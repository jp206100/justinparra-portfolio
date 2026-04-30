import type { NextConfig } from "next";

const baseSecurityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const appCSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net; style-src 'self' 'unsafe-inline'; img-src 'self' cdn.sanity.io data: blob: https://www.googletagmanager.com https://www.google-analytics.com; font-src 'self'; connect-src 'self' https://*.sanity.io https://api.github.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://*.g.doubleclick.net; frame-src 'self' https://www.youtube-nocookie.com; media-src 'self' https://*.sanity.io; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

// /ey-portfolio is a static demo page that loads React + Babel from unpkg
// and Google Fonts, so it needs a separate, more permissive CSP than the
// main Next.js app.
const portfolioCSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  // Serve /public/ey-portfolio/index.html for the bare /ey-portfolio path so
  // visitors don't have to type the index filename. (Next.js doesn't auto-
  // resolve directories in /public the way Apache/Nginx do.)
  rewrites: async () => [
    { source: "/ey-portfolio", destination: "/ey-portfolio/index.html" },
  ],
  headers: async () => [
    {
      // Security headers for the main app — excludes /ey-portfolio so its
      // permissive CSP isn't combined with (and tightened by) this one.
      source: "/((?!ey-portfolio).*)",
      headers: [
        ...baseSecurityHeaders,
        { key: "Content-Security-Policy", value: appCSP },
      ],
    },
    {
      // Static portfolio page
      source: "/ey-portfolio/:path*",
      headers: [
        ...baseSecurityHeaders,
        { key: "Content-Security-Policy", value: portfolioCSP },
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
        },
      ],
    },
    {
      // Also cover the bare /ey-portfolio path (rewritten to index.html)
      source: "/ey-portfolio",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
        },
      ],
    },
    {
      // Long-lived cache for hashed static assets
      source: "/_next/static/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      // Cache public static files (SVGs, favicons, etc.)
      source: "/(.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp))",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=604800",
        },
      ],
    },
  ],
};

export default nextConfig;
