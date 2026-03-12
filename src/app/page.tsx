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
  experienceQuery,
  clientsQuery,
  workPostsQuery,
  categoriesQuery,
} from "@/lib/sanity";

async function getSanityData() {
  try {
    const [experienceData, clientsData, workPostsData, categoriesData] =
      await Promise.all([
        client.fetch(experienceQuery),
        client.fetch(clientsQuery),
        client.fetch(workPostsQuery),
        client.fetch(categoriesQuery),
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
            }) => ({
              title: p.title,
              slug: p.slug.current,
              desc: p.description,
              date: p.date,
              categories: p.categories?.map((c) => c.title) ?? [],
            }),
          )
        : undefined;

    const categories: string[] | undefined =
      categoriesData?.length > 0
        ? ["All", ...categoriesData.map((c: { title: string }) => c.title)]
        : undefined;

    return { experience, clients, posts, categories };
  } catch {
    return {
      experience: undefined,
      clients: undefined,
      posts: undefined,
      categories: undefined,
    };
  }
}

export default async function Home() {
  const { experience, clients, posts, categories } = await getSanityData();

  return (
    <>
      <Nav />
      <Hero />
      <About />
      <CurrentlySeeking />
      <Experience entries={experience} />
      <Clients clients={clients} />
      <GitHubActivity />
      <Work posts={posts} categories={categories} />
      <Contact />
      <Footer />
    </>
  );
}
