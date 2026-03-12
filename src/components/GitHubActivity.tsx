import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
import GitHubGrid from "./GitHubGrid";

const pagePad = "clamp(20px, 5vw, 80px)";

export default function GitHubActivity() {
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
            href="https://github.com/justinparra"
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
        <GitHubGrid />
        <div className="flex gap-8">
          <div>
            <div style={{ fontSize: 20, fontWeight: 300 }}>47</div>
            <div
              style={{
                fontSize: 10,
                color: "var(--color-fg-secondary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Contributions this month
            </div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 300 }}>12</div>
            <div
              style={{
                fontSize: 10,
                color: "var(--color-fg-secondary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Repositories
            </div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 300 }}>3</div>
            <div
              style={{
                fontSize: 10,
                color: "var(--color-fg-secondary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Active Projects
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
