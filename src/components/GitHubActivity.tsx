"use client";

import { useState, useEffect } from "react";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
import GitHubGrid from "./GitHubGrid";

const pagePad = "clamp(20px, 5vw, 80px)";

interface ActivityDay {
  date: string;
  count: number;
  repos: string[];
}

interface RecentEvent {
  type: string;
  repo: string;
  date: string;
}

interface TopRepo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
}

interface GitHubData {
  activityDays: ActivityDay[];
  recentEvents: RecentEvent[];
  topRepos: TopRepo[];
  recentContributions: number;
  totalRepos: number;
  activeProjects: number;
  username: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const langColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Rust: "#DEA584",
  Go: "#00ADD8",
};

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
      label: "Events this month",
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
          padding: "clamp(20px, 4vw, 32px)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 20 }}
        >
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Recent Activity
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
            <span aria-hidden="true">View Profile &rarr;</span>
            <span className="sr-only">View GitHub profile for {data?.username ?? "jp206100"}</span>
          </a>
        </div>

        {/* Stats row */}
        <div className="flex gap-8" style={{ marginBottom: 24 }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 300,
                  lineHeight: 1,
                  color: "var(--color-fg)",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--color-fg-secondary)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Canvas visualization */}
        <GitHubGrid activityDays={data?.activityDays ?? null} />

        {/* Top repos – full width grid */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-fg-secondary)",
              marginBottom: 12,
            }}
          >
            Top Repositories
          </div>
          <div
            className="github-repos-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {(data?.topRepos ?? []).map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  padding: "16px 18px",
                  borderRadius: 4,
                  border: "1px solid var(--color-border)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-border)")
                }
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--color-fg)",
                    marginBottom: 6,
                  }}
                >
                  {repo.name}
                </div>
                {repo.description && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-fg-secondary)",
                      lineHeight: 1.5,
                      marginBottom: 10,
                      flexGrow: 1,
                    }}
                  >
                    {repo.description}
                  </div>
                )}
                {repo.language && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 10,
                      color: "var(--color-fg-secondary)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor:
                          langColors[repo.language] ??
                          "var(--color-fg-secondary)",
                      }}
                    />
                    {repo.language}
                  </div>
                )}
              </a>
            ))}
            {!data && (
              <div
                style={{ fontSize: 11, color: "var(--color-fg-secondary)" }}
              >
                Loading...
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
