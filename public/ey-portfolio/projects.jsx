/* global React */
const { useEffect, useRef } = React;

/* ============================================
   Project data — 4 case studies, deeper format
   ============================================ */
const PROJECTS = [
  {
    num: "01",
    name: "Toyota AMRD",
    nameItalic: "Newsroom",
    year: "2022 — 2025",
    visualLabel: "Newsroom CMS",
    visualMeta: ["Toyota North America", "Enterprise CMS"],
    visualOverlay: ["Cut new-content lead time by ", "50%", " across product launches, corporate announcements, and executive communications."],
    tags: ["Enterprise CMS", "Editorial Workflow", "Design System", "Airtable Automation"],
    role: "Vice President, Digital — End-to-end production lead",
    problem: "Toyota's enterprise newsroom ecosystem was orchestrating high-visibility product launches and executive communications across multiple channels — but editorial planning and publishing were bottlenecked by manual handoffs.",
    approach: "Led a cross-functional team of designers, engineers, and editors to build a custom CMS paired with an Airtable content workflow. Established a unified editorial pipeline from briefing through multichannel publishing.",
    outcome: "Shortened new-content lead time by 50%. Standardized launch operations across vehicle reveals, executive communications, and corporate announcements.",
    metric: { value: "50%", label: "reduction in lead time" },
  },
  {
    num: "02",
    name: "AI-Generated",
    nameItalic: "Audit Framework",
    year: "2023 — 2025",
    visualLabel: "AI Workflow",
    visualMeta: ["Allison Worldwide", "AI Enablement"],
    visualOverlay: ["A repeatable framework that turned audits into ", "campaign-ready strategy ", "in days, not weeks."],
    tags: ["AI Enablement", "Python · TensorFlow", "Figma", "Creative Ops"],
    role: "Digital Director — AI workflow architect",
    problem: "Web and e-commerce campaign creative was being produced one-off, every time. Audits were manual, slow, and rarely informed creative the way they should.",
    approach: "Engineered and designed an AI-enabled audit + creative workflow using Python, TensorFlow, and Figma. Partnered with design, engineering, and marketing to embed it into the production pipeline — with clear standards for trust, transparency, and human review.",
    outcome: "Deployed across 15+ product launches over 18 months. Drove a 32% increase in asset production efficiency and elevated design-system usage across high-volume content delivery.",
    metric: { value: "32%", label: "production efficiency gain" },
  },
  {
    num: "03",
    name: "Nordic",
    nameItalic: "Global",
    year: "2023 — 2024",
    visualLabel: "Global rebrand",
    visualMeta: ["Allison Worldwide", "Web · CRM · Analytics"],
    visualOverlay: ["A rebrand that did the math: ", "+20% traffic, +10% form fills, ", "100% HubSpot integration."],
    tags: ["Rebrand", "Web Platform", "HubSpot", "Information Architecture"],
    role: "Creative production leader — rebrand & site relaunch",
    problem: "The agency's own brand and site no longer matched the work or the international footprint of the team. Conversion paths were leaky and disconnected from CRM.",
    approach: "Spearheaded the enterprise-level digital transformation: refined site architecture, targeted content optimization, integrated CRM and analytics seamlessly, and tightened conversion paths end-to-end.",
    outcome: "20% increase in traffic, 10% lift in form fills, and 100% integration with HubSpot from day one of launch.",
    metric: { value: "+20%", label: "post-launch traffic" },
  },
  {
    num: "04",
    name: "U.S. EPA",
    nameItalic: "Resilience Tool",
    year: "2016 — 2018",
    visualLabel: "Public-sector platform",
    visualMeta: ["U.S. EPA", "Civic UX"],
    visualOverlay: ["A national tabletop-exercise tool that ", "expanded utility training reach", " and cut significant federal travel costs."],
    tags: ["Public Sector", "Service Design", "Accessibility", "Distributed Teams"],
    role: "Senior Interactive Producer — UX, build & delivery lead",
    problem: "The EPA's water-resilience training was tied to in-person tabletop exercises — limiting reach, slow to iterate, and expensive to deliver to the nation's water utilities.",
    approach: "Directed UX, development, content, and government-consulting teams through full lifecycle: discovery, IA, design, build, testing, deployment. Aligned complex technical and policy requirements into clear, agile timelines.",
    outcome: "The Water Resilience Tabletop Exercise Tool expanded national access to utility training and cut significant federal costs tied to in-person sessions — a model later echoed in the NERIS rollout (2,900+ fire departments onboarded).",
    metric: { value: "Nat'l", label: "scale, federal cost reduction" },
  },
];

/* ============================================
   Project — single case study card
   ============================================ */
function Project({ data }) {
  return (
    <article className="project">
      <div className="project__head">
        <div className="project__num reveal">— {data.num}</div>
        <h3 className="project__name reveal reveal--delay-1">
          {data.name} <em>{data.nameItalic}</em>
        </h3>
        <div className="project__year reveal reveal--delay-2">{data.year}</div>
      </div>

      <div className="project__body">
        <div className="project__tags reveal">
          {data.tags.map((t, i) => (
            <span className="project__tag" key={i}>— {t}</span>
          ))}
        </div>

        <div className="project__visual reveal reveal--delay-1">
          <div className="project__visual-placeholder">
            <div className="project__visual-meta">
              <span>{data.visualMeta[0]}</span>
              <span>{data.visualMeta[1]}</span>
            </div>
            <div className="project__visual-label">
              <em>{data.visualLabel}</em>
            </div>
            <div className="project__visual-marker">
              [ image placeholder · {data.num} ]
            </div>
          </div>
          <div className="project__visual-overlay">
            <div className="project__visual-overlay-text">
              <em>"{data.visualOverlay[0]}<span className="accent">{data.visualOverlay[1]}</span>{data.visualOverlay[2]}"</em>
            </div>
          </div>
        </div>

        <div className="project__details">
          <div className="project__detail-block reveal reveal--delay-2">
            <div className="project__detail-label">Role</div>
            <div className="project__detail-text">{data.role}</div>
          </div>
          <div className="project__detail-block reveal reveal--delay-3">
            <div className="project__detail-label">Problem</div>
            <div className="project__detail-text">{data.problem}</div>
          </div>
          <div className="project__detail-block reveal reveal--delay-3">
            <div className="project__detail-label">Approach</div>
            <div className="project__detail-text">{data.approach}</div>
          </div>
          <div className="project__detail-block reveal reveal--delay-4">
            <div className="project__detail-label">Outcome</div>
            <div className="project__detail-text">{data.outcome}</div>
          </div>
          <div className="project__detail-block reveal reveal--delay-4">
            <div className="project__metric">
              <span className="accent-bar"></span>
              <em>{data.metric.value}</em>
            </div>
            <div className="project__detail-text" style={{ marginTop: 6 }}>
              {data.metric.label}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============================================
   Work — section wrapper
   ============================================ */
function Work() {
  return (
    <section className="section" id="work">
      <div className="shell">
        <div className="section-label reveal">
          <span className="section-label__num">03</span>
          <span>Selected Work</span>
        </div>
        <div className="work__intro">
          <h2 className="work__title reveal">
            Four engagements, <em>one operating system</em> — clarity,
            craft, and measurable outcome.
          </h2>
          <p className="work__caption reveal reveal--delay-1">
            Each project below shows role, problem, approach, and outcome.
            Imagery is intentionally placeholder — additional case-study
            visuals will be swapped in for the final review.
          </p>
        </div>

        <div className="projects">
          {PROJECTS.map((p) => <Project key={p.num} data={p} />)}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Project, Work, PROJECTS });
