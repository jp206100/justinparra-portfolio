"use client";

import { useState } from "react";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const pagePad = "clamp(20px, 5vw, 80px)";

const fallbackExperience = [
  {
    role: "VP, Digital",
    company: "Allison Worldwide",
    url: "https://www.allisonworldwide.com/",
    date: "2024 – 2026",
  },
  {
    role: "Digital Director",
    company: "Allison Worldwide",
    url: "https://www.allisonworldwide.com/",
    date: "2018 – 2024",
  },
  {
    role: "Sr. Interactive Producer",
    company: "PRR",
    url: "https://www.prrbiz.com/",
    date: "2016 – 2018",
  },
  {
    role: "Sr. Producer & Co-Founder",
    company: "Creation-1 Interactive",
    url: "https://c1studios.com/int/",
    date: "2006 – 2016",
  },
  {
    role: "Digital Archivist",
    company: "Mark Seliger Photography",
    url: "https://markseliger.com/",
    date: "2006 – 2007",
  },
];

export interface ExperienceEntry {
  role: string;
  company: string;
  url?: string;
  date: string;
}

interface ExperienceProps {
  entries?: ExperienceEntry[];
}

export default function Experience({ entries }: ExperienceProps) {
  const [hoveredExp, setHoveredExp] = useState<number | null>(null);
  const experience = entries ?? fallbackExperience;

  return (
    <section
      id="experience"
      style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}
    >
      <SectionLabel label="Experience" num="03" />
      <div className="flex flex-col">
        {experience.map((e, i) => (
          <Reveal
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              gap: 32,
              padding: "32px 0",
              borderBottom: `1px solid var(--color-border)`,
              borderTop: i === 0 ? `1px solid var(--color-border)` : "none",
              alignItems: "baseline",
              background:
                hoveredExp === i ? "rgba(200,65,43,0.03)" : "transparent",
              transition: "background 0.3s",
              cursor: "default",
            }}
            onMouseEnter={() => setHoveredExp(i)}
            onMouseLeave={() => setHoveredExp(null)}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              {e.role}
            </span>
            <span style={{ fontSize: 15, color: "var(--color-fg-secondary)" }}>
              {e.url ? (
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="exp-company-link"
                  style={{
                    color: "var(--color-fg-secondary)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--color-border)",
                    transition: "color 0.3s, border-color 0.3s",
                  }}
                >
                  {e.company}
                </a>
              ) : (
                e.company
              )}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--color-fg-secondary)",
                textAlign: "right",
                letterSpacing: "0.02em",
              }}
            >
              {e.date}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
