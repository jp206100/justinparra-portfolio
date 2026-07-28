This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The GitHub Activity section reads from `/api/github`. To include contributions
made to **private** repositories in the "Events this month" stat and the
activity bar chart, set a GitHub token:

```bash
# .env.local (and in your Vercel project settings)
GITHUB_TOKEN=ghp_your_token_here
```

- Create a token at https://github.com/settings/tokens. Use a **classic**
  token with the `read:user` scope, plus `repo` if you want private-repo
  contributions counted. Classic tokens are the reliable option here —
  fine-grained tokens are frequently rejected by both the public events feed
  and `viewer.contributionsCollection`.
- The token must belong to the account named by `USERNAME` in
  `src/app/api/github/route.ts` (`jp206100`). The calendar is queried as the
  authenticated `viewer`, so a token from a different account silently reports
  that other account's activity.
- Classic PATs **expire**. When the token expires, GitHub rejects both the
  events feed and the GraphQL calendar, and the section drops to `0`. If the
  stat goes to zero unexpectedly, check the token's expiry first.
- The token is used server-side only to query GitHub's GraphQL contribution
  calendar as the authenticated `viewer`, which includes private-repo
  contribution **counts** (never private repo names — nothing private is
  exposed on the public site).
- If `GITHUB_TOKEN` is not set, the section gracefully falls back to public
  events only.

### Diagnosing the GitHub Activity section

`/api/github?debug=1` returns a `debug` object alongside the normal payload,
reporting whether a token is present and what shape it is (never the token
itself), the GraphQL HTTP status and any GraphQL `errors`, the `viewer` login
the token resolves to and whether it matches `USERNAME`, and the HTTP status,
item count, and remaining rate limit for each public-events page.

`rateLimitRemaining` near 60 means the request went out **unauthenticated** —
GitHub allows 5000/hour for an authenticated token and 60/hour per IP without
one. Failures are also written to the Vercel runtime logs.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
