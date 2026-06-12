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

- Create a token at https://github.com/settings/tokens. A classic token with
  the `read:user` scope (and `repo` if you want private contributions counted)
  works; a fine-grained token with read access to your profile/contributions
  also works.
- The token is used server-side only to query GitHub's GraphQL contribution
  calendar as the authenticated `viewer`, which includes private-repo
  contribution **counts** (never private repo names — nothing private is
  exposed on the public site).
- If `GITHUB_TOKEN` is not set, the section gracefully falls back to public
  events only.

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
