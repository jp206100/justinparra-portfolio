import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "hzqd03zv",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Categories
const categories = [
  { _id: "cat-case-studies", _type: "category", title: "Case Studies", slug: { _type: "slug", current: "case-studies" } },
  { _id: "cat-work-in-progress", _type: "category", title: "Work in Progress", slug: { _type: "slug", current: "work-in-progress" } },
  { _id: "cat-experiments", _type: "category", title: "Experiments", slug: { _type: "slug", current: "experiments" } },
  { _id: "cat-personal-projects", _type: "category", title: "Personal Projects", slug: { _type: "slug", current: "personal-projects" } },
];

// Experience entries
const experience = [
  { _id: "exp-1", _type: "experienceEntry", role: "VP, Digital", company: "Allison Worldwide", companyUrl: "https://www.allisonworldwide.com/", startYear: 2024, endYear: "2026", order: 1 },
  { _id: "exp-2", _type: "experienceEntry", role: "Digital Director", company: "Allison Worldwide", companyUrl: "https://www.allisonworldwide.com/", startYear: 2018, endYear: "2024", order: 2 },
  { _id: "exp-3", _type: "experienceEntry", role: "Sr. Interactive Producer", company: "PRR", companyUrl: "https://www.prrbiz.com/", startYear: 2016, endYear: "2018", order: 3 },
  { _id: "exp-4", _type: "experienceEntry", role: "Sr. Producer & Co-Founder", company: "Creation-1 Interactive", companyUrl: "https://c1studios.com/int/", startYear: 2006, endYear: "2016", order: 4 },
  { _id: "exp-5", _type: "experienceEntry", role: "Digital Archivist", company: "Mark Seliger Photography", companyUrl: "https://markseliger.com/", startYear: 2006, endYear: "2007", order: 5 },
];

// Clients
const clients = [
  "Toyota North America", "US Fire Administration", "US EPA", "Lexus",
  "Sound Transit", "Cond\u00e9 Nast", "Vanity Fair", "Getty Images",
  "CAA", "Toyota Connected", "Toyota AMRD", "Dexcom",
].map((name, i) => ({
  _id: `client-${i + 1}`,
  _type: "client",
  name,
  order: i + 1,
}));

// Category slug to ID mapping
const catMap = {
  "Case Studies": "cat-case-studies",
  "Work in Progress": "cat-work-in-progress",
  "Experiments": "cat-experiments",
  "Personal Projects": "cat-personal-projects",
};

// Work posts
const workPosts = [
  {
    title: "NERIS: Modernizing Fire Data for 2,900+ Departments",
    slug: "neris-modernizing-fire-data",
    description: "Led the GTM and onboarding UX for the US Fire Administration\u2019s national fire information platform, resulting in adoption across thousands of departments.",
    date: "2024-11-13",
    categories: ["Case Studies"],
  },
  {
    title: "Toyota Newsroom CMS",
    slug: "toyota-newsroom-cms",
    description: "Custom content management system that cut lead time for new press content by 50%.",
    date: "2024-08-22",
    categories: ["Case Studies"],
  },
  {
    title: "EPA Water Resilience Tool",
    slug: "epa-water-resilience-tool",
    description: "Digital training platform that expanded national access to utility training while cutting federal costs.",
    date: "2017-03-15",
    categories: ["Case Studies"],
  },
  {
    title: "Sound Transit Light Rail Microsites",
    slug: "sound-transit-light-rail-microsites",
    description: "Multi-language public engagement platforms with scalable design systems serving diverse communities.",
    date: "2017-06-04",
    categories: ["Case Studies"],
  },
  {
    title: "AI-Powered Content Workflow Prototype",
    slug: "ai-powered-content-workflow-prototype",
    description: "Exploring how large language models can streamline editorial review cycles for enterprise press teams.",
    date: "2025-01-28",
    categories: ["Experiments", "Work in Progress"],
  },
  {
    title: "Personal Portfolio Site",
    slug: "personal-portfolio-site",
    description: "Designing and building this site with Next.js, Sanity, and React Three Fiber. Swiss design meets interactive 3D.",
    date: "2025-02-10",
    categories: ["Personal Projects", "Work in Progress"],
  },
  {
    title: "Design System Audit Framework",
    slug: "design-system-audit-framework",
    description: "A reusable methodology for evaluating and scoring component library maturity across distributed teams.",
    date: "2024-09-05",
    categories: ["Experiments", "Case Studies"],
  },
  {
    title: "Interactive Data Storytelling Toolkit",
    slug: "interactive-data-storytelling-toolkit",
    description: "Prototyping a lightweight library for narrative-driven data visualizations in public engagement contexts.",
    date: "2025-03-01",
    categories: ["Experiments"],
  },
  {
    title: "Accessible Wayfinding for Transit",
    slug: "accessible-wayfinding-for-transit",
    description: "Research and prototyping for inclusive digital wayfinding tools supporting multilingual transit riders.",
    date: "2023-07-19",
    categories: ["Personal Projects", "Case Studies"],
  },
  {
    title: "Claude Code Publishing Workflow",
    slug: "claude-code-publishing-workflow",
    description: "Building an AI-assisted content pipeline that publishes directly to a headless CMS from the command line.",
    date: "2025-02-25",
    categories: ["Experiments", "Personal Projects"],
  },
].map((post, i) => ({
  _id: `work-${i + 1}`,
  _type: "workPost",
  title: post.title,
  slug: { _type: "slug", current: post.slug },
  description: post.description,
  date: post.date,
  featured: i === 0,
  categories: post.categories.map((cat) => ({
    _type: "reference",
    _ref: catMap[cat],
    _key: catMap[cat],
  })),
}));

// Site settings
const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  heroLabel: "UX Leader & Digital Strategist, Seattle, WA",
  heroTitle: "Justin Parra — Building digital experiences that move people forward.",
  heroSubtitle: "18+ years leading design, development, and strategy teams across private and public sectors. From Toyota to the US EPA.",
  aboutStatement: "I simplify the complex. My work lives at the intersection of design strategy, technical leadership, and user advocacy, translating business goals into intuitive digital products.",
  seekingText: "Positions in the field of Digital Product Management, UX Program Management, Digital Strategy, AI Enablement, and Creative Services Production. Currently in Seattle, but open to move to San Francisco or Chicago.",
  contactHeading: "Let's build something worth using.",
  contactSubtext: "Currently open to new opportunities in UX leadership and digital strategy.",
  githubUsername: "justinparra",
};

async function seed() {
  const transaction = client.transaction();

  // Create or replace all documents
  for (const doc of [...categories, ...experience, ...clients, ...workPosts, siteSettings]) {
    transaction.createOrReplace(doc);
  }

  console.log("Committing transaction...");
  const result = await transaction.commit();
  console.log(`Done! ${result.documentIds.length} documents created/updated.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
