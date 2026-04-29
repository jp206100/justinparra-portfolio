import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/api/", "/ey-portfolio", "/ey-portfolio/"],
      },
    ],
    sitemap: "https://justinparra.com/sitemap.xml",
  };
}
