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
  redirects: async () => [
    {
      source: "/work/first-look-at-sortlab",
      destination: "/work/first-look-at-catagree",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      // Security headers for the main app
      source: "/(.*)",
      headers: [
        ...baseSecurityHeaders,
        { key: "Content-Security-Policy", value: appCSP },
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
