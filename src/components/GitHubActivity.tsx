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
            View Profile &rarr;
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

        {/* Bottom: recent events + top repos side by side */}
        <div
          className="github-bottom-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {/* Recent events feed */}
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
              Recent Events
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(data?.recentEvents ?? []).map((event, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: "var(--color-accent)",
                      flexShrink: 0,
                      alignSelf: "center",
                    }}
                  />
                  <span style={{ color: "var(--color-fg)", fontWeight: 500 }}>
                    {event.type}
                  </span>
                  <span
                    style={{
                      color: "var(--color-fg-secondary)",
                      fontSize: 11,
                    }}
                  >
                    {event.repo}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 10,
                      color: "var(--color-fg-secondary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {timeAgo(event.date)}
                  </span>
                </div>
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

          {/* Top repos */}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(data?.topRepos ?? []).map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 10px",
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
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--color-fg)",
                      marginBottom: 2,
                    }}
                  >
                    {repo.name}
                  </div>
                  {repo.description && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--color-fg-secondary)",
                        lineHeight: 1.3,
                        marginBottom: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
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
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor:
                            langColors[repo.language] ?? "var(--color-fg-secondary)",
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
        </div>
      </Reveal>
    </section>
  );
}
