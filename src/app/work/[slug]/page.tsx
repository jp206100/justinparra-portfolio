export const revalidate = 60;

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, workPostBySlugQuery, workPostsQuery, getImageUrl } from "@/lib/sanity";
import type { SanityWorkPost, SanityGalleryImage } from "@/lib/types";
import PortableTextBody from "@/components/PortableTextBody";
import { formatDate } from "@/lib/formatDate";
import CaseStudyLayout from "@/components/CaseStudyLayout";

const pagePad = "clamp(20px, 5vw, 80px)";

// Static fallback data used when Sanity is not configured
const fallbackPosts: Record<
  string,
  { title: string; desc: string; date: string; categories: string[] }
> = {
  "neris-modernizing-fire-data": {
    title: "NERIS: Modernizing Fire Data for 2,900+ Departments",
    desc: "Led the GTM and onboarding UX for the US Fire Administration\u2019s national fire information platform, resulting in adoption across thousands of departments.",
    date: "11-13-24",
    categories: ["Case Studies"],
  },
  "toyota-newsroom-cms": {
    title: "Toyota Newsroom CMS",
    desc: "Custom content management system that cut lead time for new press content by 50%.",
    date: "08-22-24",
    categories: ["Case Studies"],
  },
  "epa-water-resilience-tool": {
    title: "EPA Water Resilience Tool",
    desc: "Digital training platform that expanded national access to utility training while cutting federal costs.",
    date: "03-15-17",
    categories: ["Case Studies"],
  },
  "sound-transit-light-rail-microsites": {
    title: "Sound Transit Light Rail Microsites",
    desc: "Multi-language public engagement platforms with scalable design systems serving diverse communities.",
    date: "06-04-17",
    categories: ["Case Studies"],
  },
  "ai-powered-content-workflow-prototype": {
    title: "AI-Powered Content Workflow Prototype",
    desc: "Exploring how large language models can streamline editorial review cycles for enterprise press teams.",
    date: "01-28-25",
    categories: ["Experiments", "Work in Progress"],
  },
  "personal-portfolio-site": {
    title: "Personal Portfolio Site",
    desc: "Designing and building this site with Next.js, Sanity, and React Three Fiber. Swiss design meets interactive 3D.",
    date: "02-10-25",
    categories: ["Personal Projects", "Work in Progress"],
  },
  "design-system-audit-framework": {
    title: "Design System Audit Framework",
    desc: "A reusable methodology for evaluating and scoring component library maturity across distributed teams.",
    date: "09-05-24",
    categories: ["Experiments", "Case Studies"],
  },
  "interactive-data-storytelling-toolkit": {
    title: "Interactive Data Storytelling Toolkit",
    desc: "Prototyping a lightweight library for narrative-driven data visualizations in public engagement contexts.",
    date: "03-01-25",
    categories: ["Experiments"],
  },
  "accessible-wayfinding-for-transit": {
    title: "Accessible Wayfinding for Transit",
    desc: "Research and prototyping for inclusive digital wayfinding tools supporting multilingual transit riders.",
    date: "07-19-23",
    categories: ["Personal Projects", "Case Studies"],
  },
  "claude-code-publishing-workflow": {
    title: "Claude Code Publishing Workflow",
    desc: "Building an AI-assisted content pipeline that publishes directly to a headless CMS from the command line.",
    date: "02-25-25",
    categories: ["Experiments", "Personal Projects"],
  },
};

interface WorkPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WorkPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post: SanityWorkPost | null = await client.fetch(
      workPostBySlugQuery,
      { slug },
    );
    if (post) {
      const title = post.title;
      const description = post.description;
      const canonical = `https://justinparra.com/work/${slug}`;
      const images = post.image
        ? [{ url: getImageUrl(post.image, 1200, 630) }]
        : [];
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, type: "article", images, url: canonical },
        twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
      };
    }
  } catch {
    // Fall through to fallback
  }
  const fallback = fallbackPosts[slug];
  if (fallback) {
    return {
      title: fallback.title,
      description: fallback.desc,
      alternates: { canonical: `https://justinparra.com/work/${slug}` },
    };
  }
  return { title: "Work" };
}

async function getWorkPost(slug: string) {
  try {
    const post: SanityWorkPost | null = await client.fetch(
      workPostBySlugQuery,
      { slug },
    );
    if (post) {
      return {
        title: post.title,
        desc: post.description,
        date: post.date,
        categories: post.categories?.map((c) => c.title) ?? [],
        imageUrl: post.image ? getImageUrl(post.image, 1200) : null,
        body: post.body,
        caseStudyWhat: post.caseStudyWhat ?? null,
        caseStudyHow: post.caseStudyHow ?? null,
        caseStudyResults: post.caseStudyResults ?? null,
        caseStudyRole: post.caseStudyRole ?? null,
        galleryImages: post.galleryImages ?? null,
      };
    }
  } catch {
    // Fall through to fallback
  }
  const fallback = fallbackPosts[slug];
  if (fallback) {
    return {
      ...fallback,
      imageUrl: null,
      body: null,
      caseStudyWhat: null,
      caseStudyHow: null,
      caseStudyResults: null,
      caseStudyRole: null,
      galleryImages: null,
    };
  }
  return null;
}

export default async function WorkPostPage({ params }: WorkPostPageProps) {
  const { slug } = await params;
  const post = await getWorkPost(slug);

  const articleJsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.desc,
        datePublished: post.date,
        author: { "@type": "Person", name: "Justin Parra" },
        url: `https://justinparra.com/work/${slug}`,
        ...(post.imageUrl ? { image: post.imageUrl } : {}),
      }
    : null;

  // Use Case Study template when structured case study fields are present
  const isCaseStudy =
    post &&
    post.categories.includes("Case Studies") &&
    post.caseStudyWhat &&
    post.caseStudyHow &&
    post.caseStudyResults &&
    post.caseStudyRole;

  if (isCaseStudy) {
    return (
      <>
        {articleJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
        )}
        <CaseStudyLayout
          title={post.title}
          desc={post.desc}
          date={post.date}
          categories={post.categories}
          imageUrl={post.imageUrl}
          caseStudyWhat={post.caseStudyWhat!}
          caseStudyHow={post.caseStudyHow!}
          caseStudyResults={post.caseStudyResults!}
          caseStudyRole={post.caseStudyRole!}
          galleryImages={(post.galleryImages as SanityGalleryImage[]) ?? []}
        />
      </>
    );
  }

  if (!post) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: "100vh", padding: pagePad }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 300, marginBottom: 16 }}>
          Post not found
        </h1>
        <Link
          href="/#work"
          style={{
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            textDecoration: "none",
          }}
        >
          &larr; Back to Work
        </Link>
      </div>
    );
  }

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <div style={{ minHeight: "100vh" }}>
        {/* Back nav */}
      <nav
        style={{
          padding: `24px ${pagePad}`,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/#work"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-fg-secondary)",
            textDecoration: "none",
          }}
        >
          &larr; Back to Work
        </Link>
      </nav>

      {/* Hero image */}
      {post.imageUrl ? (
        <div
          style={{
            aspectRatio: "21/9",
            maxHeight: 480,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            background: "linear-gradient(135deg, #E8E4DF 0%, #D4CFC8 100%)",
            aspectRatio: "21/9",
            maxHeight: 480,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "var(--color-fg-secondary)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Project Image
        </div>
      )}

      {/* Content */}
      <article
        style={{
          padding: `clamp(40px, 8vh, 80px) ${pagePad}`,
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        {/* Category tags */}
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 24 }}>
          {post.categories.map((cat) => (
            <span
              key={cat}
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                padding: "3px 8px",
                border: "1px solid rgba(200,65,43,0.2)",
                background: "rgba(200,65,43,0.04)",
                lineHeight: 1.4,
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          {post.title}
        </h1>

        <div
          style={{
            fontSize: 11,
            color: "var(--color-fg-secondary)",
            letterSpacing: "0.02em",
            marginBottom: 40,
            paddingBottom: 40,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {formatDate(post.date)}
        </div>

        {post.body ? (
          <PortableTextBody value={post.body} />
        ) : (
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "var(--color-fg-secondary)",
            }}
          >
            <p>{post.desc}</p>
            <p style={{ marginTop: 24 }}>
              Full case study content will be managed through Sanity CMS. Connect
              your Sanity project to populate this page with rich content
              including images, embedded media, and detailed project breakdowns.
            </p>
          </div>
        )}
      </article>

      {/* Bottom back nav */}
      <nav
        style={{
          padding: `24px ${pagePad}`,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/#work"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-fg-secondary)",
            textDecoration: "none",
          }}
        >
          &larr; Back to Work
        </Link>
      </nav>

      {/* Footer */}
      <footer
        className="flex items-center justify-between"
        style={{
          padding: `32px ${pagePad}`,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--color-fg-secondary)",
            letterSpacing: "0.05em",
          }}
        >
          &copy; 2026 Justin Parra
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--color-fg-secondary)",
            letterSpacing: "0.05em",
          }}
        >
          Seattle, WA
        </span>
      </footer>
    </div>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const posts: SanityWorkPost[] = await client.fetch(workPostsQuery);
    if (posts?.length > 0) {
      return posts.map((post) => ({ slug: post.slug.current }));
    }
  } catch {
    // Fall through to fallback
  }
  return Object.keys(fallbackPosts).map((slug) => ({ slug }));
}
