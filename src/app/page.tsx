export const revalidate = 60;

import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CurrentlySeeking from "@/components/CurrentlySeeking";
import Experience from "@/components/Experience";
import type { ExperienceEntry } from "@/components/Experience";
import Clients from "@/components/Clients";
import GitHubActivity from "@/components/GitHubActivity";
import Work from "@/components/Work";
import type { WorkPost } from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  client,
  getImageUrl,
  experienceQuery,
  clientsQuery,
  workPostsQuery,
  categoriesQuery,
  siteSettingsQuery,
} from "@/lib/sanity";

async function getSanityData() {
  try {
    const [experienceData, clientsData, workPostsData, categoriesData, settingsData] =
      await Promise.all([
        client.fetch(experienceQuery),
        client.fetch(clientsQuery),
        client.fetch(workPostsQuery),
        client.fetch(categoriesQuery),
        client.fetch(siteSettingsQuery),
      ]);

    const experience: ExperienceEntry[] | undefined =
      experienceData?.length > 0
        ? experienceData.map(
            (e: {
              role: string;
              company: string;
              companyUrl?: string;
              startYear: number;
              endYear: string;
            }) => ({
              role: e.role,
              company: e.company,
              url: e.companyUrl,
              date: `${e.startYear} – ${e.endYear}`,
            }),
          )
        : undefined;

    const clients: string[] | undefined =
      clientsData?.length > 0
        ? clientsData.map((c: { name: string }) => c.name)
        : undefined;

    const posts: WorkPost[] | undefined =
      workPostsData?.length > 0
        ? workPostsData.map(
            (p: {
              title: string;
              slug: { current: string };
              description: string;
              date: string;
              categories: { title: string }[];
              image?: { asset: { _ref: string } };
            }) => ({
              title: p.title,
              slug: p.slug.current,
              desc: p.description,
              date: p.date,
              categories: p.categories?.map((c) => c.title) ?? [],
              imageUrl: p.image
                ? getImageUrl(p.image, 800, 450)
                : undefined,
            }),
          )
        : undefined;

    const categories: string[] | undefined =
      categoriesData?.length > 0
        ? ["All", ...categoriesData.map((c: { title: string }) => c.title)]
        : undefined;

    return { experience, clients, posts, categories, settings: settingsData ?? undefined };
  } catch {
    return {
      experience: undefined,
      clients: undefined,
      posts: undefined,
      categories: undefined,
      settings: undefined,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await client.fetch(siteSettingsQuery);
    if (settings) {
      const title = settings.heroTitle || "Justin Parra | UX Leader & Digital Strategist";
      const description = settings.heroSubtitle || "18+ years leading design, development, and strategy teams across private and public sectors.";
      return {
        title,
        description,
        openGraph: { title, description, type: "website" },
        twitter: { card: "summary_large_image", title, description },
      };
    }
  } catch {
    // Fall through to defaults
  }
  return {
    title: "Justin Parra | UX Leader & Digital Strategist",
    description: "18+ years leading design, development, and strategy teams across private and public sectors.",
  };
}

export default async function Home() {
  const { experience, clients, posts, categories, settings } = await getSanityData();

  return (
    <>
      <Nav />
      <Hero
        label={settings?.heroLabel}
        title={settings?.heroTitle}
        subtitle={settings?.heroSubtitle}
      />
      <About statement={settings?.aboutStatement} />
      <CurrentlySeeking text={settings?.seekingText} />
      <Experience entries={experience} />
      <Clients clients={clients} />
      <GitHubActivity />
      <Work posts={posts} categories={categories} />
      <Contact
        heading={settings?.contactHeading}
        subtext={settings?.contactSubtext}
      />
      <Footer />
    </>
  );
}
