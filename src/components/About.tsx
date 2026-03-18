import { PortableText } from "@portabletext/react";
import type { SanityBlock } from "@/lib/types";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const pagePad = "clamp(20px, 5vw, 80px)";

const fallbackStatement =
  "I simplify the complex. My work lives at the intersection of design strategy, technical leadership, and user advocacy, translating business goals into intuitive digital products.";

interface AboutProps {
  statement?: string;
  body?: SanityBlock[];
}

export default function About({ statement, body }: AboutProps) {
  const aboutText = statement ?? fallbackStatement;

  return (
    <section
      id="about"
      style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}
    >
      <SectionLabel label="About" num="01" />
      <div
        className="about-grid grid gap-[clamp(40px,6vw,100px)] items-start"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        <Reveal>
          <div
            style={{
              fontSize: "clamp(22px, 2.5vw, 32px)",
              fontWeight: 300,
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
            }}
          >
            {aboutText}
          </div>
        </Reveal>
        <Reveal>
          <div
            style={{
              fontSize: 15,
              color: "var(--color-fg-secondary)",
              lineHeight: 1.7,
            }}
          >
            {body ? (
              <PortableText value={body} />
            ) : (
              <>
                <p style={{ marginBottom: 20 }}>
                  With early career roots in web development, I bring a rare
                  blend of creative and technical fluency to every project.
                </p>
                <p style={{ marginBottom: 20 }}>
                  I&apos;ve led cross-functional teams to ship apps, VR
                  experiences, websites, analytics dashboards, and public
                  engagement tools for clients ranging from Toyota North America
                  to the US Fire Administration.
                </p>
              </>
            )}
          </div>
          <div
            className="grid grid-cols-2 gap-6"
            style={{
              marginTop: 40,
              paddingTop: 32,
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                18+
              </span>
              <br />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-fg-secondary)",
                }}
              >
                Years Experience
              </span>
            </div>
            <div>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                100+
              </span>
              <br />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-fg-secondary)",
                }}
              >
                Projects Shipped
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
