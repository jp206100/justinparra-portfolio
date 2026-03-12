import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const pagePad = "clamp(20px, 5vw, 80px)";

export default function About() {
  return (
    <section
      id="about"
      style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}
    >
      <SectionLabel label="About" num="01" />
      <div
        className="grid gap-[clamp(40px,6vw,100px)] items-start"
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
            I simplify the complex. My work lives at the intersection of{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              design strategy
            </em>
            ,{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              technical leadership
            </em>
            , and{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              user advocacy
            </em>
            , translating business goals into intuitive digital products.
          </div>
        </Reveal>
        <Reveal>
          <p
            style={{
              fontSize: 15,
              color: "var(--color-fg-secondary)",
              marginBottom: 20,
              lineHeight: 1.7,
            }}
          >
            With early career roots in web development, I bring a rare blend of
            creative and technical fluency to every project.
          </p>
          <p
            style={{
              fontSize: 15,
              color: "var(--color-fg-secondary)",
              marginBottom: 20,
              lineHeight: 1.7,
            }}
          >
            I&apos;ve led cross-functional teams to ship CMS platforms, VR
            experiences, analytics dashboards, and public engagement tools for
            clients ranging from Toyota North America to the US Fire
            Administration.
          </p>
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
