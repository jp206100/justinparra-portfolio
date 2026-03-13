import HeroCanvas from "./HeroCanvas";

const pagePad = "clamp(20px, 5vw, 80px)";

interface HeroProps {
  label?: string;
  title?: string;
  subtitle?: string;
}

export default function Hero({ label, title, subtitle }: HeroProps) {
  const heroLabel = label ?? "UX Leader & Digital Strategist, Seattle, WA";
  const heroTitle = title ?? "Justin Parra — Building digital experiences that move people forward.";
  const heroSubtitle = subtitle ?? "18+ years leading design, development, and strategy teams across private and public sectors. From Toyota to the US EPA.";

  // Split title on " — " to bold the name portion
  const dashIndex = heroTitle.indexOf(" — ");
  const namePart = dashIndex >= 0 ? heroTitle.slice(0, dashIndex) : null;
  const restPart = dashIndex >= 0 ? heroTitle.slice(dashIndex + 3) : heroTitle;

  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden"
      style={{
        height: "80vh",
        minHeight: 560,
        padding: pagePad,
        paddingBottom: "clamp(40px, 6vh, 80px)",
      }}
    >
      <HeroCanvas />
      <div className="relative z-1" style={{ maxWidth: 900 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-fg-secondary)",
            marginBottom: 20,
            animation: "fadeUp 0.8s ease 0.3s both",
          }}
        >
          {heroLabel}
        </div>
        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            animation: "fadeUp 0.8s ease 0.5s both",
          }}
        >
          {namePart ? (
            <>
              <strong style={{ fontWeight: 500 }}>{namePart}</strong>
              <br />
              {restPart}
            </>
          ) : (
            restPart
          )}
        </h1>
        <p
          style={{
            fontSize: "clamp(16px, 1.8vw, 20px)",
            fontWeight: 300,
            color: "var(--color-fg-secondary)",
            maxWidth: 560,
            lineHeight: 1.6,
            animation: "fadeUp 0.8s ease 0.7s both",
          }}
        >
          {heroSubtitle}
        </p>
      </div>
    </section>
  );
}
