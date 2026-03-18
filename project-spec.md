# Justin Parra Portfolio Website - Project Specification

## Overview

Personal portfolio website for Justin Parra, a UX leader and digital strategist based in Seattle. The site serves as a statement piece for job interviews and professional networking. It should be on par with award-winning personal portfolio sites, combining Swiss design minimalism with purposeful 3D interactive elements.

**Target audience:** Hiring managers, recruiters, and peers who want to learn more beyond a LinkedIn profile.

**Live reference prototype:** See `portfolio-prototype.jsx` for the approved interactive design, animations, and full content.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14+ (App Router) | SSR, ISR, file-based routing |
| 3D | Canvas 2D with custom projection (see prototype) | No Three.js dependency needed - pure canvas |
| Styling | Tailwind CSS | Utility-first, matches Swiss precision |
| Typography | Inter Tight (Google Fonts) | Single typeface, all hierarchy via weight/size/spacing |
| CMS | Sanity (hosted, free tier) | Structured content, API for Claude Code publishing |
| GitHub Feed | GitHub public REST API via ISR | Revalidates on interval, no auth needed for public repos |
| Hosting | Vercel | Auto-deploy from GitHub, CDN, preview deployments |
| Domain | Custom domain pointed to Vercel | DNS already configured |

---

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#F5F2ED` | Page background (warm off-white) |
| `--fg` | `#1A1A1A` | Primary text |
| `--fg-secondary` | `#6B6560` | Secondary text, metadata, labels |
| `--accent` | `#C8412B` | Red accent - links, highlights, interactive elements, 3D wireframes |
| `--border` | `#D4CFC8` | Borders, dividers |
| `--card-bg` | `#FFFEF9` | Card backgrounds |

### Typography

**Single typeface: Inter Tight** (weights: 300, 400, 500, 600)

| Element | Weight | Size | Spacing | Transform |
|---------|--------|------|---------|-----------|
| Hero h1 | 300 (name: 500) | clamp(40px, 6vw, 80px) | -0.03em | None |
| Section statement | 300 | clamp(22px, 2.5vw, 32px) | -0.01em | None |
| Body text | 400 | 15px | Normal | None |
| Section labels | 500 | 11px | 0.15em | Uppercase |
| Nav links | 400 | 11px | 0.1em | Uppercase |
| Metadata/dates | 400 | 11px | 0.02em | None |
| Category tags | 400 | 9px | 0.1em | Uppercase |
| Stat numbers | 300 | 36px | -0.02em | None |

### Content Rules

- **No em dashes** anywhere. Rewrite sentences to avoid them.
- **No DARPA** mentions anywhere.
- **No LinkedIn feed** integration.
- Date format: **MM-DD-YY** (e.g., "11-13-24")
- En dashes for date ranges in experience (e.g., "2024 – 2026")

---

## Page Architecture

Single-page layout with smooth scroll navigation. Individual routes for full work post detail pages (`/work/[slug]`).

### Section Order

1. **Nav** (fixed, semi-opaque)
2. **Hero** (3D converging grids animation)
3. **About** (01)
4. **Currently Seeking** (02)
5. **Experience** (03)
6. **Select Clients** (04) - dark background inversion
7. **GitHub Activity** (05)
8. **Work** (06) - filterable grid with load more
9. **Contact**
10. **Footer**

---

## Section Details

### Navigation

- Fixed position, top of viewport
- Semi-opaque background: `rgba(245, 242, 237, 0.85)` with `backdrop-filter: blur(12px)`
- Left: "JUSTIN PARRA" (uppercase, 500 weight, 13px)
- Right: About, Experience, Work, Contact links
- Smooth scroll to section anchors

### Hero

- Height: 80vh, min 560px
- Content positioned at bottom-left
- **3D Animation: Dual Converging Grids**
  - Grid A (left side): Structured, tight 16px spacing, clean sine wave patterns. Represents "design strategy"
  - Grid B (right side): Organic, wider 22px spacing, layered ripple patterns. Represents "technical leadership"
  - Both flow continuously left-to-right (forward momentum = "moving people forward")
  - Where grids overlap: lines brighten, thicken, subtle radial glow (the "intersection")
  - Mouse controls convergence point position
  - Fades out on scroll
  - Uses Canvas 2D with custom perspective projection (no Three.js)
  - Red wireframe color: `rgba(200, 65, 43, opacity)`
- Content:
  - Label: "UX LEADER & DIGITAL STRATEGIST, SEATTLE, WA"
  - H1: "**Justin Parra** / Building digital experiences / that move people forward."
  - Sub: "18+ years leading design, development, and strategy teams across private and public sectors. From Toyota to the US EPA."
- Staggered fade-up entrance animations (0.3s, 0.5s, 0.7s delays)

### About (01)

- Two-column grid layout
- Left: Statement text with accent-colored italic emphasis on "design strategy", "technical leadership", "user advocacy"
  - "I simplify the complex. My work lives at the intersection of *design strategy*, *technical leadership*, and *user advocacy*, translating business goals into intuitive digital products."
- Right: Body copy + stats
  - "With early career roots in web development, I bring a rare blend of creative and technical fluency to every project."
  - "I've led cross-functional teams to ship apps, VR experiences, websites, analytics dashboards, and public engagement tools for clients ranging from Toyota North America to the US Fire Administration."
  - Stats: "18+" Years Experience, "100+" Projects Shipped

### Currently Seeking (02)

- Single flowing sentence, light weight with medium-weight role titles
- "Positions in the field of **Digital Product Management**, **UX Program Management**, **Digital Strategy**, **AI Enablement**, and **Creative Services Production**. Currently in Seattle, but open to move to San Francisco or Chicago."

### Experience (03)

- List layout: 3-column grid (Role | Company | Date range)
- Subtle hover background tint
- Company names linked to websites (open in new tab):
  - Allison Worldwide: https://www.allisonworldwide.com/
  - PRR: https://www.prrbiz.com/
  - Creation-1 Interactive: https://c1studios.com/int/
  - Mark Seliger Photography: https://markseliger.com/
- Entries:
  - VP, Digital | Allison Worldwide | 2024 – 2026
  - Digital Director | Allison Worldwide | 2018 – 2024
  - Sr. Interactive Producer | PRR | 2016 – 2018
  - Sr. Producer & Co-Founder | Creation-1 Interactive | 2006 – 2016
  - Digital Archivist | Mark Seliger Photography | 2006 – 2007

### Select Clients (04)

- Dark background section (bg/fg inverted)
- Grid of client names with hover highlight effect
- Clients: Toyota North America, US Fire Administration, US EPA, Lexus, Sound Transit, Conde Nast, Vanity Fair, Getty Images, CAA, Toyota Connected, Toyota AMRD, Dexcom

### GitHub Activity (05)

- Card container with header ("Contribution Activity" + "View Profile" link)
- **Animated contribution grid:**
  - Classic 52x7 flat grid (instantly recognizable as GitHub contributions)
  - Red accent color palette instead of GitHub green (5 levels from bg color to full accent)
  - Ripple wave animation passes through cells, modulating brightness
  - Wave origin follows mouse cursor (echoing hero interaction)
  - Highest-activity cells get subtle scale pulse and glow
  - Month labels across top, day-of-week labels on left (Mon, Wed, Fri)
- Stats row: Contributions this month, Repositories, Active Projects
- In production: pull real data from GitHub public API with ISR revalidation

### Work (06)

- **Category filter bar** at top with buttons: All, Case Studies, Work in Progress, Experiments, Personal Projects
  - Active filter: solid accent background, white text
  - Inactive: transparent with border
  - Switching filters resets visible count and triggers card entrance animation
- **Post cards** in 2-column grid:
  - Each card has: 16:9 image preview (top), multi-category tags, title, description, date (MM-DD-YY)
  - Cards support multiple category tags displayed as small bordered pills
  - Hover: lift (-4px), shadow, accent border, arrow indicator
  - Entrance animation: staggered fade-up with slight scale (cardIn keyframe)
  - Click navigates to full post detail page (`/work/[slug]`)
- **Load more button:** Shows 5 posts initially, "Load More" reveals next 5
- Posts can belong to multiple categories and appear in each relevant filter

### Contact

- Centered layout
- H2: "Let's build something worth using."
- Sub: "Currently open to new opportunities in UX leadership and digital strategy."
- Links: Email (justinparra206@gmail.com), LinkedIn (https://www.linkedin.com/in/justin-parra/), GitHub (https://github.com/justinparra)

### Footer

- Simple flex row: "© 2026 Justin Parra" left, "Seattle, WA" right

---

## Sanity CMS Schema

### Document Types

**workPost**
- `title` (string, required)
- `slug` (slug, from title)
- `description` (text, for card preview)
- `body` (portable text / block content, for full post page)
- `date` (date, displayed as MM-DD-YY)
- `categories` (array of references to category documents)
- `image` (image with alt text, for card preview)
- `featured` (boolean, optional)

**category**
- `title` (string): "Case Studies", "Work in Progress", "Experiments", "Personal Projects"
- `slug` (slug, from title)

**siteSettings** (singleton)
- `heroLabel` (string)
- `heroTitle` (string)
- `heroSubtitle` (string)
- `aboutStatement` (text)
- `aboutBody` (portable text)
- `seekingText` (text)
- `contactHeading` (string)
- `contactSubtext` (string)
- `githubUsername` (string)

**experienceEntry**
- `role` (string)
- `company` (string)
- `companyUrl` (url, optional)
- `startYear` (number)
- `endYear` (number or "Present")
- `order` (number, for sorting)

**client**
- `name` (string)
- `order` (number, for sorting)

---

## Deployment Plan

### Phase 1: Scaffold
1. Create Next.js project with App Router
2. Install dependencies: `@sanity/client`, `next-sanity`, `tailwindcss`
3. Configure Tailwind with custom design tokens
4. Set up Sanity project and studio (embedded at `/studio` route or separate)
5. Create all Sanity schemas
6. Push to GitHub repo
7. Connect repo to Vercel
8. Point domain DNS to Vercel

### Phase 2: Build
1. Build each section as a component matching the prototype
2. Port the Canvas 2D hero animation (dual converging grids)
3. Port the GitHub contribution grid with ripple animation
4. Wire up Sanity queries for work posts, experience, clients, settings
5. Build work post detail page (`/work/[slug]`)
6. Implement category filtering with animated transitions
7. Implement "Load more" pagination
8. Integrate GitHub public API for real contribution data
9. Add responsive breakpoints (mobile: single column, stacked layouts)
10. Implement scroll-reveal animations via Intersection Observer

### Phase 3: Content & Launch
1. Populate Sanity with real content
2. Upload project images
3. Test across devices
4. Performance audit (lazy-load canvas, optimize images)
5. Ship

---

## Claude Code Publishing Workflow

For ongoing content updates via Claude Code:

1. Use Sanity's Content API (`@sanity/client`) to create/update documents
2. Claude Code writes content, calls Sanity API to publish
3. Sanity webhook triggers Vercel rebuild (ISR for work posts)
4. No code changes needed for content updates

Environment variables needed:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN` (for write operations)
- `NEXT_PUBLIC_SANITY_API_VERSION`

---

## Files Included

- `portfolio-prototype.jsx` - Interactive React prototype with all approved design, content, animations
- This spec document

When starting in Claude Code, reference both files. The prototype is the visual source of truth; this spec is the architectural and content source of truth.
