# EY Portfolio (unpublished)

Static case-study page. **Currently not published** — it lives here in `archive/`
rather than `public/`, so Next.js does not serve it and `justinparra.com/ey-portfolio`
returns a 404. Nothing on the live site links to it.

Kept intact for repurposing later.

## To republish

1. `git mv archive/ey-portfolio public/ey-portfolio`
2. In `next.config.ts`, restore:
   - the `rewrites` entry mapping `/ey-portfolio` → `/ey-portfolio/index.html`
     (Next.js doesn't auto-resolve directory indexes in `/public` the way
     Apache/Nginx do)
   - the permissive `portfolioCSP` header block for `/ey-portfolio/:path*`.
     This page loads React + Babel from unpkg and Google Fonts, so it needs a
     looser CSP than the main app; scope the app's own header rule back to
     `/((?!ey-portfolio).*)` so the two policies aren't combined.
   - the `X-Robots-Tag: noindex, ...` headers on `/ey-portfolio` and
     `/ey-portfolio/:path*` if it should stay out of search results
3. Re-add `/ey-portfolio` and `/ey-portfolio/` to `disallow` in `src/app/robots.ts`
   if you want crawlers to skip it.

Git history for the removal has the exact previous config if you'd rather revert
it verbatim.

## Local preview

Asset paths are absolute (`/ey-portfolio/...`), so serve from the parent
directory and visit `http://localhost:3000/ey-portfolio/`:

```bash
cd archive
npx serve .
```
