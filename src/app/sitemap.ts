import type { MetadataRoute } from "next";
import { client, workPostsQuery } from "@/lib/sanity";

const BASE_URL = "https://justinparra.com";

const fallbackSlugs = [
  "toyota-amrd-reorg",
  "personal-portfolio-site",
  "ai-generated-website-audit-framework",
  "world-radio-sampler-preview",
  "max-for-live-device-for-motion-hub",
  "motion-hub-v1-0-release",
  "katzman-produce-brand-overhaul",
  "motionhub-app-preview",
  "nordic-global",
  "city-of-seattle-renting-in-seattle",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let workEntries: MetadataRoute.Sitemap = [];

  try {
    const posts: { slug: { current: string }; date?: string }[] =
      await client.fetch(workPostsQuery);
    if (posts?.length > 0) {
      workEntries = posts.map((p) => ({
        url: `${BASE_URL}/work/${p.slug.current}`,
        lastModified: p.date ? new Date(p.date) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Fall through to fallback
  }

  if (workEntries.length === 0) {
    workEntries = fallbackSlugs.map((slug) => ({
      url: `${BASE_URL}/work/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...workEntries,
  ];
}
