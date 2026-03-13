import Reveal from "./Reveal";

const pagePad = "clamp(20px, 5vw, 80px)";

const contactLinks = [
  ["Email", "mailto:justinparra206@gmail.com"],
  ["LinkedIn", "https://www.linkedin.com/in/justin-parra/"],
  ["GitHub", "https://github.com/justinparra"],
] as const;

interface ContactProps {
  heading?: string;
  subtext?: string;
}

export default function Contact({ heading, subtext }: ContactProps) {
  const contactHeading = heading ?? "Let\u2019s build something worth using.";
  const contactSubtext =
    subtext ??
    "Currently open to new opportunities in UX leadership and digital strategy.";

  return (
    <section
      id="contact"
      className="text-center"
      style={{ padding: `clamp(80px, 15vh, 160px) ${pagePad}` }}
    >
      <Reveal>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          {contactHeading}
        </h2>
      </Reveal>
      <Reveal>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-fg-secondary)",
            marginBottom: 40,
          }}
        >
          {contactSubtext}
        </p>
      </Reveal>
      <Reveal className="flex justify-center gap-10">
        {contactLinks.map(([label, href]) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            style={{
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-fg)",
              textDecoration: "none",
              paddingBottom: 4,
              borderBottom: "1px solid var(--color-accent)",
            }}
          >
            {label}
          </a>
        ))}
      </Reveal>
    </section>
  );
}
