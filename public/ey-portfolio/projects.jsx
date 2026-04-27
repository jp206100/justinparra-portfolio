/* global React */
const { useEffect, useRef } = React;

/* ============================================
   Project data — 4 case studies, deeper format

   Image strategy:
   - Every image is a placeholder. Each placeholder includes its own
     `imageId` slug and a `caption` so you can drop the real asset in
     later (e.g. /ey-portfolio/img/<imageId>.jpg).
   - Toyota gets 4 images; the other three projects get 3 each.
   ============================================ */
const PROJECTS = [
  {
    num: "01",
    name: "Navigating a Reorg with",
    nameItalic: "Toyota's Advanced Mobility R&D",
    year: "2026",
    lede:
      "When Toyota needed help presenting their newly consolidated R&D division to the public, our integrated team built an experience that made a complex organization's work digestible to a niche audience.",
    tags: [
      "Case Study",
      "Stakeholder Research",
      "Information Architecture",
      "Design + CMS",
    ],
    role: [
      "Built user personas",
      "Designed the sitemap with the client team",
      "Conducted stakeholder interviews with Toyota's engineering and communications leaders",
      "Led our internal team of designers to build out a site audit, wireframes, and responsive mockups",
      "Directed the dev team to build, test, and deploy the website and CMS",
    ],
    what: [
      "Toyota's AMRD (Advanced Mobility R&D) conducts research and product development for the next 10, 20, and 50 years of automotive technology. Setting the agenda for what mobility looks like decades out.",
    ],
    how: [
      "When Toyota asked us to help them present this newly consolidated department to the public, our integrated team stepped in to make a very complex organization's work digestible to a niche audience.",
      "We visited Toyota's AMRD headquarters in Ann Arbor, Michigan to meet their Communications Team, engineering leads, and researchers to understand how the new R&D divisions would actually be organized. Stakeholder interviews surfaced the challenge: appealing primarily to experienced engineers in the talent pool, alongside the journalists who report on AMRD's work.",
      "Using existing user data, past research, and stakeholder feedback, we built user flows, personas, a sitemap, and wireframes that guided our design teams and built mutual buy-in with the client.",
    ],
    results: [
      "Toyota gained a new recruiting and public-engagement tool that can efficiently answer the question, \"What's the difference between AMRD's divisions?\" Our preliminary SEO work helped the site rank higher for several key search terms tied to advanced mobility research.",
    ],
    images: [
      {
        imageId: "01-toyota-hero",
        caption: "Hero — Toyota AMRD homepage in context.",
        slot: "hero",
        src: "/ey-portfolio/img/01-toyota-hero.png",
        alt: "Toyota Advanced Mobility R&D website displayed on laptop, tablet, and mobile phone",
      },
      {
        imageId: "01-toyota-personas",
        caption:
          "User flows and personas mapping audience segments and navigation paths.",
        slot: "after-what",
        src: "/ey-portfolio/img/01-toyota-personas.png",
        alt: "Toyota AMRD user flows and persona research document",
      },
      {
        imageId: "01-toyota-sitemap",
        caption:
          "Sitemap designed with the client team to organize AMRD's divisions.",
        slot: "after-how-1",
        src: "/ey-portfolio/img/01-toyota-sitemap.png",
        alt: "Toyota AMRD sitemap showing main navigation and division page hierarchy",
      },
      {
        imageId: "01-toyota-wireframe",
        caption: "Wireframe exploration for the AMRD homepage structure.",
        slot: "after-how-2",
        src: "/ey-portfolio/img/01-toyota-wireframe.png",
        alt: "Toyota AMRD website wireframe showing page layout and content hierarchy",
      },
    ],
  },

  {
    num: "02",
    name: "AI-Generated",
    nameItalic: "Website Audit Framework",
    year: "2026",
    lede:
      "An experiment in building a reusable methodology for evaluating website performance, SEO, usability, and content that combines AI-assisted analysis with structured human review.",
    tags: [
      "Experiment / Case Study",
      "AI Workflow Design",
      "Audit Methodology",
      "Reporting Templates",
    ],
    role: [
      "Designed the audit framework and scoring methodology",
      "Built the AI-assisted analysis pipeline (performance, accessibility, SEO, content quality)",
      "Created Figma reporting templates so the framework is reusable across the team",
      "Defined human review checkpoints to keep AI output trustworthy and client-ready",
      "Piloted the framework on internal site audits before rolling it out to client work",
    ],
    what: [
      "Website audits of performance, SEO, usability, and content were getting done one engagement at a time, each from scratch. Findings were inconsistent across teams, slow to produce, and rarely connected the technical signals (Core Web Vitals, crawlability) to the experience signals (IA, content quality) in a way clients could actually act on.",
    ],
    how: [
      "I built a repeatable audit framework that pairs AI-assisted analysis with a structured human review pass. Lighthouse, accessibility scanners, and content-quality models do the heavy data collection; a templated reporting layer in Figma turns those raw signals into prioritized recommendations clients can hand straight to their dev and content teams.",
      "Each pass produces a consistent scorecard, so improvements can be measured pre/post. The same methodology runs whether the site is a 12-page brochure or a 12,000-page enterprise platform.",
    ],
    results: [
      "Cut audit turnaround from weeks to days. Standardized output across the team so any designer or strategist can run the framework, and findings now feed directly into roadmap prioritization rather than sitting in a slide deck. The framework has become a model for how we introduce AI into client-facing deliverables.",
    ],
    images: [
      {
        imageId: "02-audit-hero",
        caption: "Hero — Audit framework reporting view.",
        slot: "hero",
        src: "/ey-portfolio/img/02-audit-hero.jpg",
        alt: "AI-generated website audit framework reporting view",
      },
      {
        imageId: "02-audit-scorecard",
        caption:
          "Standardized scorecard surfacing performance, SEO, usability, and content signals in one view.",
        slot: "after-what",
      },
      {
        imageId: "02-audit-recommendations",
        caption:
          "Prioritized recommendations layer — the human review pass that turns signals into client-ready actions.",
        slot: "after-how",
      },
    ],
  },

  {
    num: "03",
    name: "Nordic Global",
    nameItalic: "Mergers, Acquisitions, Rebrands",
    year: "2025",
    lede:
      "Helped Nordic evolve from Nordic Health to Nordic Global while redesigning their digital presence to accommodate new services and products during a landmark year of growth.",
    tags: [
      "Case Study",
      "Information Architecture",
      "Web Platform",
      "Distributed Dev Team",
    ],
    role: [
      "Conducted a card-sorting exercise with the client to start the conversation about content hierarchy and priorities",
      "Ran multiple live sitemap-building sessions to discuss, design, and revise the sitemap",
      "Led an internal design team to build out wireframes and multiple Home page mockups",
      "Directed the client's development team in Brazil to build the new Home page and inner pages",
      "Led QA and testing via Jira with the development team to finalize the work to spec",
    ],
    what: [
      "Nordic was on a fast-track to evolve from Nordic Health in Wisconsin, to Nordic Global, a worldwide healthcare-efficiency company worth more than a billion dollars.",
      "Our team jumped on board for a fast-paced ride, accommodating new services and products joining the fold as the business grew through a landmark year for the organization.",
    ],
    how: [
      "Our UX team of designers, developers, and project managers was integrated into the project from day one. Before we layered the new services and products into the new website, we knew there was upstream work to do: consolidating pages and streamlining the user journey.",
      "Our copywriters collaborated with the marketing team to rename navigation labels so the page inventory actually made sense, while we simplified the navigation experience based on user feedback and stakeholder interviews.",
    ],
    results: [
      "We built out several new sitemaps as the company evolved over the year, encompassing their products and services under easy-to-find categories. We also designed a complete overhaul of the Home page and several key inner pages, which improved legibility and the user's likelihood of cross-traversing the site to explore more content.",
    ],
    images: [
      {
        imageId: "03-nordic-hero",
        caption: "Hero — Nordic Global homepage in context.",
        slot: "hero",
        src: "/ey-portfolio/img/03-nordic-hero.png",
        alt: "Nordic Global website header design showing the new brand identity",
      },
      {
        imageId: "03-nordic-sitemap",
        caption:
          "Revised sitemap organizing Nordic's expanded services and products into intuitive categories.",
        slot: "after-what",
        src: "/ey-portfolio/img/03-nordic-sitemap.png",
        alt: "Nordic Global sitemap showing reorganized navigation and content hierarchy",
      },
      {
        imageId: "03-nordic-homepage",
        caption:
          "The final redesigned Nordic Global homepage with improved navigation and content organization.",
        slot: "after-how",
        src: "/ey-portfolio/img/03-nordic-homepage.png",
        alt: "Nordic Global live website showing the final redesigned homepage",
      },
    ],
  },

  {
    num: "04",
    name: "Accidents de France",
    nameItalic: "Three.js & Open Data Visualization",
    year: "2026",
    lede:
      "A 3D visualization experiment using Three.js, Claude Code, and open French traffic-accident data from data.gouv.fr that explored how immersive views can make public-sector data legible at a glance.",
    tags: [
      "Experiment",
      "Three.js · WebGL",
      "Open Data",
      "AI-Assisted Development",
    ],
    role: [
      "Conceived the experiment and chose the dataset",
      "Designed the 3D visual language consisting of geometry, color mapping, and camera framing",
      "Built the Three.js scene and data pipeline",
      "Used Claude Code as a pair-programmer for shader and geometry iteration",
      "Documented the workflow as a reference for AI-assisted prototyping",
    ],
    what: [
      "A self-directed experiment exploring how 3D environments can make public-sector data legible at a glance. The dataset derived from open French traffic-accident records at data.gouv.fr that contained rich geographic, temporal, and severity dimensions that flatten poorly in standard charts.",
      "The question: can a 3D scene let a viewer feel the pattern (where, when, how severe) before they read a single number?",
    ],
    how: [
      "Built the visualization in Three.js, with Claude Code as a pair-programming collaborator for shader work, geometry generation, and data wrangling. Pulled the raw accident records, geocoded and clustered them, then mapped severity to vertical extrusion and time-of-day to color.",
      "Iterated quickly on camera framing and interaction patterns to find a view that reads as both atlas and analysis tool that oriented non-technical viewers in seconds while still rewarding deeper exploration.",
    ],
    results: [
      "A working prototype that surfaces geographic accident hotspots and temporal patterns instantly. Orienting a view that a public-safety stakeholder could understand in seconds. Just as importantly, it became a working reference for how AI-assisted development (Claude Code) compresses a one-person prototyping cycle from weeks to days.",
    ],
    images: [
      {
        imageId: "04-accidents-hero",
        caption: "Hero — 3D visualization of French accident data.",
        slot: "hero",
        src: "/ey-portfolio/img/04-accidents-hero.png",
        alt: "Three.js 3D visualization of French accident data, hero view",
      },
      {
        imageId: "04-accidents-detail",
        caption:
          "Severity mapped to vertical extrusion; time-of-day mapped to color.",
        slot: "after-what",
      },
      {
        imageId: "04-accidents-pipeline",
        caption:
          "Data pipeline view — raw open-data records geocoded and clustered before render.",
        slot: "after-how",
      },
    ],
  },
];

/* ============================================
   ProjectMedia — single image / placeholder figure
   ============================================ */
function ProjectMedia({ image, full = false }) {
  return (
    <figure
      className={
        "project__media" + (full ? " project__media--full" : "")
      }
    >
      <div className="project__media-frame">
        {image.src ? (
          <img
            className="project__media-img"
            src={image.src}
            alt={image.alt || image.caption || image.imageId}
            loading="lazy"
          />
        ) : (
          <div className="project__media-placeholder">
            <span className="project__media-placeholder-id">
              [ {image.imageId} ]
            </span>
          </div>
        )}
      </div>
      <figcaption className="project__media-caption">
        {image.caption}
      </figcaption>
    </figure>
  );
}

/* ============================================
   ProjectSection — labeled content block
   (What, How, Results, My Role)
   ============================================ */
function ProjectSection({ label, num, children }) {
  return (
    <section className="project__section reveal">
      <div className="project__section-head">
        <div className="project__section-label">{label}</div>
        <div className="project__section-num">— {num}</div>
      </div>
      <div className="project__section-body">{children}</div>
    </section>
  );
}

/* ============================================
   Project — single chapter
   ============================================ */
function Project({ data }) {
  const hero = data.images.find((i) => i.slot === "hero");
  const afterWhat = data.images.find((i) => i.slot === "after-what");
  const afterHow1 = data.images.find((i) => i.slot === "after-how-1");
  const afterHow2 = data.images.find((i) => i.slot === "after-how-2");
  const afterHow = data.images.find((i) => i.slot === "after-how");

  return (
    <article className="project" id={`project-${data.num}`}>
      {/* Sticky left rail — anchors the chapter while you scroll */}
      <aside className="project__rail">
        <div className="project__rail-inner">
          <div className="project__rail-num">— {data.num}</div>
          <div className="project__rail-name">
            {data.name} <em>{data.nameItalic}</em>
          </div>
        </div>
      </aside>

      <div className="project__main">
        {/* Chapter header */}
        <header className="project__head">
          <h3 className="project__name reveal">
            {data.name} <em>{data.nameItalic}</em>
          </h3>
          <p className="project__lede reveal reveal--delay-1">{data.lede}</p>
          <div className="project__tags reveal reveal--delay-2">
            {data.tags.map((t, i) => (
              <span className="project__tag" key={i}>
                {t}
              </span>
            ))}
          </div>
        </header>

        {/* Hero image */}
        {hero && (
          <div className="reveal reveal--delay-1">
            <ProjectMedia image={hero} full />
          </div>
        )}

        {/* What */}
        <ProjectSection label="What" num="01">
          {data.what.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ProjectSection>

        {/* Image after What */}
        {afterWhat && (
          <div className="reveal">
            <ProjectMedia image={afterWhat} full />
          </div>
        )}

        {/* How */}
        <ProjectSection label="How" num="02">
          {data.how.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ProjectSection>

        {/* Image(s) after How — 2-up grid for Toyota's 4-image set,
            single full-width for everyone else. */}
        {afterHow1 && afterHow2 && (
          <div className="project__media-row reveal">
            <ProjectMedia image={afterHow1} />
            <ProjectMedia image={afterHow2} />
          </div>
        )}
        {afterHow && (
          <div className="reveal">
            <ProjectMedia image={afterHow} full />
          </div>
        )}

        {/* Results */}
        <ProjectSection label="Results" num="03">
          {data.results.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ProjectSection>

        {/* My Role */}
        <ProjectSection label="My Role" num="04">
          <ul className="project__role">
            {data.role.map((r, i) => (
              <li key={i}>
                <span className="project__role-marker">+</span>
                {r}
              </li>
            ))}
          </ul>
        </ProjectSection>
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
            Four engagements illustrating clarity, craft, and measurable
            outcome.
          </h2>
        </div>

        <div className="projects">
          {PROJECTS.map((p) => (
            <Project key={p.num} data={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Project, ProjectSection, ProjectMedia, Work, PROJECTS });
