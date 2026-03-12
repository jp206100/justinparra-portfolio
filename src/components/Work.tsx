"use client";

import { useState } from "react";
import Link from "next/link";
import SectionLabel from "./SectionLabel";

const pagePad = "clamp(20px, 5vw, 80px)";

export interface WorkPost {
  title: string;
  slug: string;
  desc: string;
  date: string;
  categories: string[];
  imageUrl?: string;
}

const fallbackCategories = [
  "All",
  "Case Studies",
  "Work in Progress",
  "Experiments",
  "Personal Projects",
];

const fallbackPosts: WorkPost[] = [
  {
    title: "NERIS: Modernizing Fire Data for 2,900+ Departments",
    slug: "neris-modernizing-fire-data",
    desc: "Led the GTM and onboarding UX for the US Fire Administration\u2019s national fire information platform, resulting in adoption across thousands of departments.",
    date: "11-13-24",
    categories: ["Case Studies"],
  },
  {
    title: "Toyota Newsroom CMS",
    slug: "toyota-newsroom-cms",
    desc: "Custom content management system that cut lead time for new press content by 50%.",
    date: "08-22-24",
    categories: ["Case Studies"],
  },
  {
    title: "EPA Water Resilience Tool",
    slug: "epa-water-resilience-tool",
    desc: "Digital training platform that expanded national access to utility training while cutting federal costs.",
    date: "03-15-17",
    categories: ["Case Studies"],
  },
  {
    title: "Sound Transit Light Rail Microsites",
    slug: "sound-transit-light-rail-microsites",
    desc: "Multi-language public engagement platforms with scalable design systems serving diverse communities.",
    date: "06-04-17",
    categories: ["Case Studies"],
  },
  {
    title: "AI-Powered Content Workflow Prototype",
    slug: "ai-powered-content-workflow-prototype",
    desc: "Exploring how large language models can streamline editorial review cycles for enterprise press teams.",
    date: "01-28-25",
    categories: ["Experiments", "Work in Progress"],
  },
  {
    title: "Personal Portfolio Site",
    slug: "personal-portfolio-site",
    desc: "Designing and building this site with Next.js, Sanity, and React Three Fiber. Swiss design meets interactive 3D.",
    date: "02-10-25",
    categories: ["Personal Projects", "Work in Progress"],
  },
  {
    title: "Design System Audit Framework",
    slug: "design-system-audit-framework",
    desc: "A reusable methodology for evaluating and scoring component library maturity across distributed teams.",
    date: "09-05-24",
    categories: ["Experiments", "Case Studies"],
  },
  {
    title: "Interactive Data Storytelling Toolkit",
    slug: "interactive-data-storytelling-toolkit",
    desc: "Prototyping a lightweight library for narrative-driven data visualizations in public engagement contexts.",
    date: "03-01-25",
    categories: ["Experiments"],
  },
  {
    title: "Accessible Wayfinding for Transit",
    slug: "accessible-wayfinding-for-transit",
    desc: "Research and prototyping for inclusive digital wayfinding tools supporting multilingual transit riders.",
    date: "07-19-23",
    categories: ["Personal Projects", "Case Studies"],
  },
  {
    title: "Claude Code Publishing Workflow",
    slug: "claude-code-publishing-workflow",
    desc: "Building an AI-assisted content pipeline that publishes directly to a headless CMS from the command line.",
    date: "02-25-25",
    categories: ["Experiments", "Personal Projects"],
  },
];

interface WorkProps {
  posts?: WorkPost[];
  categories?: string[];
}

export default function Work({ posts, categories }: WorkProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(5);

  const workPosts = posts ?? fallbackPosts;
  const categoryList = categories ?? fallbackCategories;

  const filtered =
    activeFilter === "All"
      ? workPosts
      : workPosts.filter((p) => p.categories.includes(activeFilter));
  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <section
      id="work"
      style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}
    >
      <SectionLabel label="Work" num="06" />

      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-3" style={{ marginBottom: 40 }}>
        {categoryList.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setVisibleCount(5);
              }}
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "8px 16px",
                border: `1px solid ${isActive ? "var(--color-accent)" : "var(--color-border)"}`,
                background: isActive ? "var(--color-accent)" : "transparent",
                color: isActive ? "#fff" : "var(--color-fg-secondary)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderRadius: 0,
                outline: "none",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filtered Posts Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "clamp(16px, 2vw, 32px)",
        }}
      >
        {visible.map((post, i) => {
          const isHovered = hoveredCard === `work-${post.title}`;
          return (
            <Link
              href={`/work/${post.slug}`}
              key={post.title}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: "var(--color-card-bg)",
                border: `1px solid ${isHovered ? "var(--color-accent)" : "var(--color-border)"}`,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered
                  ? "0 20px 60px rgba(0,0,0,0.08)"
                  : "none",
                animation: `cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both`,
                transition:
                  "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={() => setHoveredCard(`work-${post.title}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image preview */}
              {post.imageUrl ? (
                <div
                  style={{
                    aspectRatio: "16/9",
                    overflow: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #E8E4DF 0%, #D4CFC8 100%)",
                    aspectRatio: "16/9",
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
              <div style={{ padding: 32 }}>
                {/* Multi-category tags */}
                <div
                  className="flex flex-wrap gap-2"
                  style={{ marginBottom: 16 }}
                >
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
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    marginBottom: 12,
                  }}
                >
                  {post.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "var(--color-fg-secondary)",
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  {post.desc}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--color-fg-secondary)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {post.date}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Load More Button */}
        {hasMore && (
          <div
            className="flex justify-center"
            style={{ gridColumn: "1 / -1", paddingTop: 16 }}
          >
            <button
              onClick={() => setVisibleCount((v) => v + 5)}
              className="load-more-btn"
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "14px 40px",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-fg)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                outline: "none",
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
