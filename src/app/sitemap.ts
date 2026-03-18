import type { MetadataRoute } from "next";
import { client, workPostsQuery } from "@/lib/sanity";

const BASE_URL = "https://justinparra-portfolio.vercel.app";

const fallbackSlugs = [
  "neris-modernizing-fire-data",
  "toyota-newsroom-cms",
  "epa-water-resilience-tool",
  "sound-transit-light-rail-microsites",
  "ai-powered-content-workflow-prototype",
  "personal-portfolio-site",
  "design-system-audit-framework",
  "interactive-data-storytelling-toolkit",
  "accessible-wayfinding-for-transit",
  "claude-code-publishing-workflow",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let workSlugs: string[] = [];

  try {
    const posts: { slug: { current: string } }[] =
      await client.fetch(workPostsQuery);
    if (posts?.length > 0) {
      workSlugs = posts.map((p) => p.slug.current);
    }
  } catch {
    // Fall through to fallback
  }

  if (workSlugs.length === 0) {
    workSlugs = fallbackSlugs;
  }

  const workEntries: MetadataRoute.Sitemap = workSlugs.map((slug) => ({
    url: `${BASE_URL}/work/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...workEntries,
  ];
}
