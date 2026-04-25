import type { Metadata } from "next";
import Link from "next/link";
import EyNav from "@/components/ey/EyNav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "EY Studio+ Portfolio — Justin Parra",
  description:
    "A tailored portfolio prepared for the EY Studio+ Experience Design Director panel interview.",
  robots: { index: false, follow: false, nocache: true },
};

const pagePad = "clamp(20px, 5vw, 80px)";

const roleFit = [
  {
    responsibility: "Lead experience design across multiple engagements",
    evidence:
      "As VP, Digital at Allison Worldwide I oversee design and delivery across a portfolio of engagements spanning Toyota North America, Lexus, Dexcom, and federal clients — setting direction from discovery through launch and measurement.",
  },
  {
    responsibility: "Develop designers through coaching and quality oversight",
    evidence:
      "I manage and mentor a cross-discipline team of designers, developers, and producers. My role centers on portfolio review, craft feedback, and career pathing — building consistency and confidence across a distributed team.",
  },
  {
    responsibility: "Partner with consulting leads to shape client deliverables",
    evidence:
      "I sit at the intersection of strategy, creative, and technology leadership — co-authoring proposals, SOWs, and client narratives that connect design outcomes to measurable business value.",
  },
  {
    responsibility:
      "Translate research, data, and business needs into cohesive journeys",
    evidence:
      "On Toyota AMRD’s reorg I translated business goals and employee research into a new org, workflow, and digital toolset, cutting press content lead time by 50%.",
  },
  {
    responsibility:
      "Lead human-centered and AI-enabled experiences with clear standards",
    evidence:
      "I’ve led the rollout of AI-assisted workflows across editorial, review, and production teams — shaping standards for trust, transparency, and human oversight inside enterprise contexts.",
  },
  {
    responsibility:
      "Align researchers, strategists, product leads, and engineers",
    evidence:
      "I routinely frame ambiguous problems for multidisciplinary teams — moving groups from divergent inputs to a shared direction through structured critiques and decision workshops.",
  },
  {
    responsibility: "Oversee contributions to design systems and accessibility",
    evidence:
      "I’ve led design system audits and multi-language, WCAG-aligned public engagement platforms for Sound Transit, the City of Seattle, and the US Fire Administration.",
  },
  {
    responsibility:
      "Show up as a trusted design leader who upholds quality and grows accounts",
    evidence:
      "I’ve grown client relationships from single engagements into multi-year programs by pairing high design standards with consistent, predictable delivery and clear executive communication.",
  },
];

const highlights = [
  {
    title: "NERIS — US Fire Administration",
    tag: "Public sector · Service design",
    summary:
      "Led GTM and onboarding UX for a national fire information platform, driving adoption across 2,900+ fire departments in the first rollout window.",
    outcomes: [
      "Translated policy and reporting complexity into a simple onboarding flow",
      "Built a multi-stakeholder governance model across federal, state, and local teams",
      "Established accessibility and trust standards for a public-facing data product",
    ],
  },
  {
    title: "Toyota Newsroom CMS + AMRD Reorg",
    tag: "Enterprise · Org + product",
    summary:
      "Redesigned the content, workflow, and CMS behind Toyota’s North American press operation — cutting lead time for new press content by 50%.",
    outcomes: [
      "Reframed the problem from a CMS build into an end-to-end operating model",
      "Led research, org design, and product direction with executive stakeholders",
      "Shipped a platform that scaled to daily global use across PR, legal, and product",
    ],
  },
  {
    title: "EPA Water Resilience Training",
    tag: "Public sector · Learning experience",
    summary:
      "Expanded national access to utility resilience training through a digital platform that reduced federal delivery costs while improving reach.",
    outcomes: [
      "Designed a service model that replaced in-person workshops at scale",
      "Met federal accessibility, security, and procurement requirements",
      "Created a reusable content model adopted across subsequent EPA programs",
    ],
  },
  {
    title: "Sound Transit Light Rail Microsites",
    tag: "Public engagement · Design systems",
    summary:
      "Delivered multilingual public engagement platforms on a shared design system — serving diverse communities across major transit expansions.",
    outcomes: [
      "Stood up a scalable component library across multiple concurrent programs",
      "Built translation and governance workflows for 6+ languages",
      "Raised engagement KPIs across historically underserved communities",
    ],
  },
];

const leadership = [
  {
    heading: "Coaching the craft",
    body: "I run weekly critiques and 1:1 portfolio reviews focused on clarity, narrative, and the ‘why’ behind decisions. I set quality bars in writing so growth is legible, not subjective.",
  },
  {
    heading: "Reading the room",
    body: "Distributed teams, senior stakeholders, and client politics are part of the work. I optimize for alignment and momentum — small decisions made often beats a perfect doc no one reads.",
  },
  {
    heading: "Framing the work",
    body: "Most engagements arrive framed as a deliverable. I spend real energy reframing them as outcomes, so teams can make trade-offs instead of defending scope.",
  },
  {
    heading: "Growing the account",
    body: "Trust compounds. I show up consistently, protect quality, surface risk early, and turn every engagement into the foundation for the next one.",
  },
];

const aiNotes = [
  "Leading AI-assisted editorial and review workflows across enterprise content teams, with human-in-the-loop standards baked in.",
  "Shipping AI-native internal tools (this portfolio site is built and deployed via an AI-assisted pipeline) so I can speak to the practice from inside it.",
  "Setting team standards for trust, transparency, and responsible design: disclosure, provenance, and opt-out patterns are not optional.",
  "Treating AI as a design material — evaluating where it adds leverage, where it adds risk, and where it just adds noise.",
];

const principles = [
  "Simplify the complex — clarity is the work.",
  "Outcomes over artifacts — the deck is not the product.",
  "Protect the user, name the trade-offs, respect the business.",
  "Accessibility is a baseline, not a phase.",
  "Trust compounds — ship consistently, communicate plainly.",
];

const panelQuestions = [
  "Where is Studio+ today on the human + AI experience maturity curve, and where do you want this role to take it in the first 12 months?",
  "What does ‘great’ look like for an Experience Design Director here a year from now — in client outcomes, team growth, and practice contribution?",
  "How is design leadership partnered with consulting and engagement leads on account growth and upstream strategy?",
  "What are the biggest friction points today in moving a Studio+ engagement from concept into delivery, and how do you want this role to help resolve them?",
  "How does Studio+ invest in design craft, research, and design system maturity across the portfolio?",
];

export default function EyPortfolioPage() {
  return (
    <>
      <EyNav />
      <main id="main-content">
        {/* Hero */}
        <section
          id="overview"
          className="relative flex flex-col justify-end overflow-hidden"
          style={{
            minHeight: "72vh",
            padding: pagePad,
            paddingTop: "clamp(120px, 18vh, 200px)",
            paddingBottom: "clamp(40px, 6vh, 80px)",
          }}
        >
          <div style={{ maxWidth: 960 }}>
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
              Prepared for EY Studio+ · Experience Design Director Panel
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
              <strong style={{ fontWeight: 500 }}>Justin Parra</strong>
              <br />
              Experience design leadership for human + AI products, journeys,
              and services.
            </h1>
            <p
              style={{
                fontSize: "clamp(16px, 1.8vw, 20px)",
                fontWeight: 300,
                color: "var(--color-fg-secondary)",
                maxWidth: 680,
                lineHeight: 1.6,
                animation: "fadeUp 0.8s ease 0.7s both",
              }}
            >
              A short, focused read for the Studio+ panel. How I lead design
              across engagements, where my work has moved the needle for
              clients, and how I think about building a practice around human
              and AI-enabled experiences.
            </p>
          </div>
        </section>

        {/* Opening statement */}
        <section style={{ padding: `clamp(40px, 8vh, 100px) ${pagePad}` }}>
          <SectionLabel label="Why this role" num="01" />
          <Reveal>
            <div
              style={{
                fontSize: "clamp(22px, 2.5vw, 32px)",
                fontWeight: 300,
                lineHeight: 1.5,
                letterSpacing: "-0.01em",
                maxWidth: 860,
              }}
            >
              Studio+ sits exactly where I want my next decade of work to live:
              a global, multidisciplinary practice shaping experiences that are
              both deeply human and increasingly AI-enabled — at enterprise and
              public-sector scale. I want to help lead that, not just
              participate in it.
            </div>
          </Reveal>
        </section>

        {/* Role Fit */}
        <section
          id="role-fit"
          style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}
        >
          <SectionLabel label="How I map to the role" num="02" />
          <div className="flex flex-col">
            {roleFit.map((row, i) => (
              <Reveal
                key={row.responsibility}
                className="exp-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 32,
                  padding: "32px 0",
                  borderBottom: "1px solid var(--color-border)",
                  borderTop: i === 0 ? "1px solid var(--color-border)" : "none",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {row.responsibility}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    color: "var(--color-fg-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {row.evidence}
                </span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Work Highlights */}
        <section
          id="work"
          style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}
        >
          <SectionLabel label="Selected engagements" num="03" />
          <div
            className="grid work-grid"
            style={{
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "clamp(16px, 2vw, 32px)",
            }}
          >
            {highlights.map((h, i) => (
              <Reveal
                key={h.title}
                style={{
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--color-border)",
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  animation: `cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    marginBottom: 16,
                  }}
                >
                  {h.tag}
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    marginBottom: 12,
                  }}
                >
                  {h.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--color-fg-secondary)",
                    lineHeight: 1.65,
                    marginBottom: 20,
                  }}
                >
                  {h.summary}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {h.outcomes.map((o) => (
                    <li
                      key={o}
                      style={{
                        fontSize: 14,
                        color: "var(--color-fg)",
                        lineHeight: 1.55,
                        paddingLeft: 18,
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 10,
                          width: 8,
                          height: 1,
                          background: "var(--color-accent)",
                        }}
                      />
                      {o}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section
          id="leadership"
          style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}
        >
          <SectionLabel label="How I lead teams" num="04" />
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(24px, 3vw, 48px)",
            }}
          >
            {leadership.map((l) => (
              <Reveal key={l.heading}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    marginBottom: 12,
                  }}
                >
                  {l.heading}
                </div>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "var(--color-fg)",
                  }}
                >
                  {l.body}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Human + AI */}
        <section
          id="human-ai"
          style={{
            background: "var(--color-fg)",
            color: "var(--color-bg)",
            padding: `clamp(60px, 10vh, 120px) ${pagePad}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(245,242,237,0.5)",
              marginBottom: 48,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(245,242,237,0.15)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Human + AI experiences</span>
            <span style={{ color: "var(--color-accent)" }}>05</span>
          </div>
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
                AI is now a design material. My job is to help teams use it
                with judgment — building experiences that earn trust, disclose
                what the system is doing, and keep a human meaningfully in the
                loop.
              </div>
            </Reveal>
            <Reveal>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                {aiNotes.map((n) => (
                  <li
                    key={n}
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "rgba(245,242,237,0.85)",
                      paddingLeft: 20,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 12,
                        width: 10,
                        height: 1,
                        background: "var(--color-accent)",
                      }}
                    />
                    {n}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Design principles */}
        <section style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}>
          <SectionLabel label="Design principles I work by" num="06" />
          <div className="flex flex-col">
            {principles.map((p, i) => (
              <Reveal
                key={p}
                style={{
                  padding: "24px 0",
                  borderBottom: "1px solid var(--color-border)",
                  borderTop: i === 0 ? "1px solid var(--color-border)" : "none",
                  fontSize: "clamp(18px, 2vw, 24px)",
                  fontWeight: 300,
                  lineHeight: 1.5,
                  letterSpacing: "-0.01em",
                }}
              >
                <span
                  style={{
                    color: "var(--color-accent)",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    marginRight: 20,
                    fontWeight: 500,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </Reveal>
            ))}
          </div>
        </section>

        {/* Questions for the panel */}
        <section
          id="questions"
          style={{ padding: `clamp(60px, 10vh, 120px) ${pagePad}` }}
        >
          <SectionLabel label="Questions I have for you" num="07" />
          <div
            className="flex flex-col"
            style={{ gap: 24, maxWidth: 860 }}
          >
            {panelQuestions.map((q, i) => (
              <Reveal
                key={q}
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "baseline",
                  paddingBottom: 24,
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    color: "var(--color-accent)",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  Q{String(i + 1).padStart(2, "0")}
                </span>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.6,
                    color: "var(--color-fg)",
                    fontWeight: 300,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {q}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Close */}
        <section
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
              Thank you for the time and the conversation.
            </h2>
          </Reveal>
          <Reveal>
            <p
              style={{
                fontSize: 16,
                color: "var(--color-fg-secondary)",
                marginBottom: 40,
                maxWidth: 620,
                marginInline: "auto",
                lineHeight: 1.7,
              }}
            >
              If anything here sparks a follow-up — or you’d like me to walk
              through a specific engagement in more depth — I’m easy to reach.
            </p>
          </Reveal>
          <Reveal className="flex justify-center gap-10 flex-wrap">
            <a
              href="mailto:justinparra206@gmail.com"
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
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/justin-parra/"
              target="_blank"
              rel="noopener noreferrer"
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
              LinkedIn
            </a>
            <Link
              href="/"
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
              Full portfolio
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
