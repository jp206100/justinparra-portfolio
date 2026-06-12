import { NextResponse } from "next/server";

const USERNAME = "jp206100";
const TOKEN = process.env.GITHUB_TOKEN;

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: {
    commits?: { message: string }[];
    action?: string;
    ref_type?: string;
  };
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  stargazers_count: number;
}

interface ActivityDay {
  date: string;
  count: number;
  repos: string[];
}

interface ContributionDay {
  date: string;
  contributionCount: number;
}

function formatEventType(event: GitHubEvent): string {
  switch (event.type) {
    case "PushEvent": {
      const count = event.payload?.commits?.length ?? 0;
      return `Pushed ${count} commit${count !== 1 ? "s" : ""}`;
    }
    case "CreateEvent":
      return `Created ${event.payload?.ref_type ?? "repository"}`;
    case "PullRequestEvent":
      return `${event.payload?.action === "opened" ? "Opened" : "Updated"} pull request`;
    case "IssuesEvent":
      return `${event.payload?.action === "opened" ? "Opened" : "Updated"} issue`;
    case "WatchEvent":
      return "Starred repository";
    case "ForkEvent":
      return "Forked repository";
    case "DeleteEvent":
      return `Deleted ${event.payload?.ref_type ?? "branch"}`;
    default:
      return event.type.replace("Event", "");
  }
}

/**
 * Fetch the contribution calendar via the GraphQL API. Because this queries the
 * authenticated `viewer`, GitHub includes contributions made to PRIVATE
 * repositories in the daily counts. Only per-day counts are returned (never
 * private repo names), so nothing private is exposed on the public site.
 *
 * Returns `null` when no token is configured or the request fails, so callers
 * can fall back to public event data.
 */
async function fetchContributionCalendar(): Promise<ContributionDay[] | null> {
  if (!TOKEN) return null;

  // Cover a 90-day window — enough for the 60-day bar chart and the
  // 30-day "events this month" stat.
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 90);

  const query = `
    query($from: DateTime!, $to: DateTime!) {
      viewer {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "justinparra-portfolio",
      },
      body: JSON.stringify({
        query,
        variables: { from: from.toISOString(), to: to.toISOString() },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const weeks =
      json?.data?.viewer?.contributionsCollection?.contributionCalendar?.weeks;
    if (!Array.isArray(weeks)) return null;

    const days: ContributionDay[] = [];
    for (const week of weeks) {
      for (const day of week.contributionDays ?? []) {
        days.push({
          date: day.date,
          contributionCount: day.contributionCount,
        });
      }
    }
    return days;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "justinparra-portfolio",
    };
    if (TOKEN) {
      headers.Authorization = `Bearer ${TOKEN}`;
    }

    // Fetch repos, public events, and the (private-inclusive) contribution
    // calendar in parallel.
    const reposPromise = fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`,
      { headers, next: { revalidate: 3600 } }
    );

    const eventsPromise = Promise.all(
      [1, 2, 3].map((page) =>
        fetch(
          `https://api.github.com/users/${USERNAME}/events/public?per_page=100&page=${page}`,
          { headers, next: { revalidate: 3600 } }
        )
      )
    );

    const calendarPromise = fetchContributionCalendar();

    const [reposRes, eventPages, contributionDays] = await Promise.all([
      reposPromise,
      eventsPromise,
      calendarPromise,
    ]);

    if (!reposRes.ok) {
      throw new Error("GitHub API request failed");
    }

    const repos: GitHubRepo[] = await reposRes.json();
    const events: GitHubEvent[] = [];
    for (const res of eventPages) {
      if (res.ok) {
        const page: GitHubEvent[] = await res.json();
        events.push(...page);
      }
    }

    // Count public repos (excluding forks)
    const ownRepos = repos.filter((r) => !r.fork);
    const totalRepos = ownRepos.length;

    // Count repos active in the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const activeProjects = ownRepos.filter(
      (r) => new Date(r.pushed_at) > ninetyDaysAgo
    ).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let recentContributions: number;
    let activityDays: ActivityDay[];

    if (contributionDays) {
      // Private-inclusive path: drive the month count and bar chart from the
      // contribution calendar so private-repo contributions are reflected.
      recentContributions = contributionDays.reduce(
        (sum, d) =>
          new Date(d.date) > thirtyDaysAgo ? sum + d.contributionCount : sum,
        0
      );

      activityDays = contributionDays
        .filter((d) => d.contributionCount > 0)
        .map((d) => ({ date: d.date, count: d.contributionCount, repos: [] }))
        .sort((a, b) => b.date.localeCompare(a.date));
    } else {
      // Fallback (no token): count only public events from the events feed.
      recentContributions = 0;
      for (const event of events) {
        if (new Date(event.created_at) > thirtyDaysAgo) {
          recentContributions++;
        }
      }

      const dayMap = new Map<string, { count: number; repos: Set<string> }>();
      for (const event of events) {
        const date = event.created_at.split("T")[0];
        const entry = dayMap.get(date) ?? { count: 0, repos: new Set<string>() };
        entry.count++;
        entry.repos.add(event.repo.name.split("/").pop() ?? event.repo.name);
        dayMap.set(date, entry);
      }

      activityDays = Array.from(dayMap.entries())
        .map(([date, { count, repos: repoSet }]) => ({
          date,
          count,
          repos: Array.from(repoSet),
        }))
        .sort((a, b) => b.date.localeCompare(a.date));
    }

    // Recent events for activity feed (last 8, deduplicated by repo+type+day).
    // Sourced from public events only so private repo names are never exposed.
    const seen = new Set<string>();
    const recentEvents = [];
    for (const event of events) {
      const day = event.created_at.split("T")[0];
      const repoShort =
        event.repo.name.split("/").pop() ?? event.repo.name;
      const key = `${day}-${event.type}-${repoShort}`;
      if (seen.has(key)) continue;
      seen.add(key);
      recentEvents.push({
        type: formatEventType(event),
        repo: repoShort,
        date: day,
        time: event.created_at,
      });
      if (recentEvents.length >= 8) break;
    }

    // Top repos (most recently pushed, non-fork, up to 6)
    const topRepos = ownRepos.slice(0, 6).map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
    }));

    return NextResponse.json({
      activityDays,
      recentEvents,
      topRepos,
      recentContributions,
      totalRepos,
      activeProjects,
      username: USERNAME,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
