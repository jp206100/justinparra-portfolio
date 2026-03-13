"use client";

import { useState, useEffect } from "react";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
import GitHubGrid from "./GitHubGrid";

const pagePad = "clamp(20px, 5vw, 80px)";

interface GitHubData {
  contributions: { w: number; d: number; level: number; count: number }[];
  recentContributions: number;
  totalRepos: number;
  activeProjects: number;
  username: string;
}

export default function GitHubActivity() {
  const [data, setData] = useState<GitHubData | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => d && setData(d))
      .catch(() => {});
  }, []);

  const stats = [
    {
      value: data?.recentContributions ?? "—",
      label: "Contributions this month",
    },
    { value: data?.totalRepos ?? "—", label: "Repositories" },
    { value: data?.activeProjects ?? "—", label: "Active Projects" },
  ];

  return (
    <section style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
      <SectionLabel label="GitHub Activity" num="05" />
      <Reveal
        style={{
          background: "var(--color-card-bg)",
          border: "1px solid var(--color-border)",
          padding: 32,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 16 }}
        >
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Contribution Activity
          </span>
          <a
            href={`https://github.com/${data?.username ?? "jp206100"}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              color: "var(--color-accent)",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            View Profile &rarr;
          </a>
        </div>
        <GitHubGrid contributions={data?.contributions ?? null} />
        <div className="flex gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 20, fontWeight: 300 }}>{s.value}</div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--color-fg-secondary)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
