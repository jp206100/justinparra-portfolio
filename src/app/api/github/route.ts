import { NextResponse } from "next/server";

const USERNAME = "jp206100";
const TOKEN = process.env.GITHUB_TOKEN;

// Keep the feed reasonably fresh so newly-made contributions show up without a
// redeploy, while staying well inside GitHub's rate limits.
const REVALIDATE_SECONDS = 600;

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

interface CalendarResult {
  days: ContributionDay[];
  viewerLogin: string | null;
  totalContributions: number;
  restrictedContributionsCount: number;
}

/** Non-secret diagnostics, surfaced via `?debug=1` and in server logs. */
interface Diagnostics {
  tokenPresent: boolean;
  tokenKind: string;
  calendar: {
    attempted: boolean;
    httpStatus: number | null;
    graphqlErrors: string[];
    viewerLogin: string | null;
    viewerMatchesUsername: boolean | null;
    dayCount: number;
    nonZeroDayCount: number;
    totalContributions: number;
    restrictedContributionsCount: number;
    usable: boolean;
    failureReason: string | null;
  };
  events: {
    page: number;
    httpStatus: number;
    count: number;
    rateLimitRemaining: string | null;
  }[];
  reposHttpStatus: number | null;
  source: "contribution-calendar" | "public-events";
}

/**
 * Describe the token by shape only — never the token itself. Classic PATs start
 * with `ghp_`, fine-grained with `github_pat_`, GitHub App installation tokens
 * with `ghs_`. Only fine-grained/classic user tokens can read `viewer`
 * contribution data, so the shape is genuinely diagnostic.
 */
function describeTokenKind(token: string | undefined): string {
  if (!token) return "none";
  if (token.startsWith("github_pat_")) return "fine-grained-pat";
  if (token.startsWith("ghp_")) return "classic-pat";
  if (token.startsWith("ghs_")) return "app-installation-token";
  if (token.startsWith("gho_")) return "oauth-token";
  return "unknown-format";
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

/** `YYYY-MM-DD` for a Date, in UTC — matches GitHub's calendar day keys. */
function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Fetch the contribution calendar via the GraphQL API. Because this queries the
 * authenticated `viewer`, GitHub includes contributions made to PRIVATE
 * repositories in the daily counts. Only per-day counts are returned (never
 * private repo names), so nothing private is exposed on the public site.
 *
 * Returns `null` when no token is configured or the request fails, so callers
 * can fall back to public event data. `diag` is populated either way so
 * failures are visible instead of silently collapsing to zero.
 */
async function fetchContributionCalendar(
  diag: Diagnostics
): Promise<CalendarResult | null> {
  if (!TOKEN) {
    diag.calendar.failureReason =
      "GITHUB_TOKEN is not set, so private contributions cannot be counted.";
    return null;
  }

  diag.calendar.attempted = true;

  // Cover a 90-day window — enough for the 60-day bar chart and the
  // 30-day "events this month" stat. Anchor `to` to the end of today so
  // contributions made earlier today are included.
  const to = new Date();
  to.setUTCHours(23, 59, 59, 0);
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 90);

  const query = `
    query($from: DateTime!, $to: DateTime!) {
      viewer {
        login
        contributionsCollection(from: $from, to: $to) {
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
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
      next: { revalidate: REVALIDATE_SECONDS },
    });

    diag.calendar.httpStatus = res.status;

    if (!res.ok) {
      diag.calendar.failureReason = `GraphQL request failed with HTTP ${res.status}. A 401 means the token is invalid or expired; a 403 usually means it lacks the required scope.`;
      return null;
    }

    const json = await res.json();

    // GraphQL reports scope/permission problems as HTTP 200 with an `errors`
    // array, which is exactly how this used to fail silently.
    if (Array.isArray(json?.errors) && json.errors.length > 0) {
      diag.calendar.graphqlErrors = json.errors.map(
        (e: { message?: string }) => e?.message ?? "unknown GraphQL error"
      );
      diag.calendar.failureReason = `GraphQL returned errors: ${diag.calendar.graphqlErrors.join("; ")}`;
      return null;
    }

    const viewer = json?.data?.viewer;
    const collection = viewer?.contributionsCollection;
    const calendar = collection?.contributionCalendar;
    const weeks = calendar?.weeks;

    diag.calendar.viewerLogin = viewer?.login ?? null;
    if (viewer?.login) {
      diag.calendar.viewerMatchesUsername =
        viewer.login.toLowerCase() === USERNAME.toLowerCase();
    }

    if (!Array.isArray(weeks)) {
      diag.calendar.failureReason =
        "GraphQL response did not contain a contribution calendar.";
      return null;
    }

    const days: ContributionDay[] = [];
    for (const week of weeks) {
      for (const day of week.contributionDays ?? []) {
        days.push({
          date: day.date,
          contributionCount: day.contributionCount,
        });
      }
    }

    diag.calendar.dayCount = days.length;
    diag.calendar.nonZeroDayCount = days.filter(
      (d) => d.contributionCount > 0
    ).length;
    diag.calendar.totalContributions = calendar?.totalContributions ?? 0;
    diag.calendar.restrictedContributionsCount =
      collection?.restrictedContributionsCount ?? 0;

    return {
      days,
      viewerLogin: viewer?.login ?? null,
      totalContributions: calendar?.totalContributions ?? 0,
      restrictedContributionsCount:
        collection?.restrictedContributionsCount ?? 0,
    };
  } catch (error) {
    diag.calendar.failureReason = `GraphQL request threw: ${
      error instanceof Error ? error.message : String(error)
    }`;
    return null;
  }
}

export async function GET(request: Request) {
  const debug = new URL(request.url).searchParams.get("debug") === "1";

  const diag: Diagnostics = {
    tokenPresent: Boolean(TOKEN),
    tokenKind: describeTokenKind(TOKEN),
    calendar: {
      attempted: false,
      httpStatus: null,
      graphqlErrors: [],
      viewerLogin: null,
      viewerMatchesUsername: null,
      dayCount: 0,
      nonZeroDayCount: 0,
      totalContributions: 0,
      restrictedContributionsCount: 0,
      usable: false,
      failureReason: null,
    },
    events: [],
    reposHttpStatus: null,
    source: "public-events",
  };

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
      { headers, next: { revalidate: REVALIDATE_SECONDS } }
    );

    const eventsPromise = Promise.all(
      [1, 2, 3].map((page) =>
        fetch(
          `https://api.github.com/users/${USERNAME}/events/public?per_page=100&page=${page}`,
          { headers, next: { revalidate: REVALIDATE_SECONDS } }
        )
      )
    );

    const calendarPromise = fetchContributionCalendar(diag);

    const [reposRes, eventPages, calendar] = await Promise.all([
      reposPromise,
      eventsPromise,
      calendarPromise,
    ]);

    diag.reposHttpStatus = reposRes.status;

    if (!reposRes.ok) {
      throw new Error(`GitHub repos request failed with HTTP ${reposRes.status}`);
    }

    const repos: GitHubRepo[] = await reposRes.json();
    const events: GitHubEvent[] = [];
    for (let i = 0; i < eventPages.length; i++) {
      const res = eventPages[i];
      const entry = {
        page: i + 1,
        httpStatus: res.status,
        count: 0,
        rateLimitRemaining: res.headers.get("x-ratelimit-remaining"),
      };
      if (res.ok) {
        const page: GitHubEvent[] = await res.json();
        entry.count = Array.isArray(page) ? page.length : 0;
        if (Array.isArray(page)) events.push(...page);
      } else {
        console.error(
          `GitHub events page ${i + 1} failed: HTTP ${res.status} (rate limit remaining: ${entry.rateLimitRemaining ?? "unknown"})`
        );
      }
      diag.events.push(entry);
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
    const thirtyDaysAgoKey = toDateKey(thirtyDaysAgo);

    // --- Build the public-events view first, so it is always available as a
    // floor. Previously a calendar that came back empty (or a silently-failed
    // one) collapsed the stat to zero even when public events existed.
    let eventContributions = 0;
    for (const event of events) {
      if (new Date(event.created_at) > thirtyDaysAgo) {
        eventContributions++;
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

    const eventActivityDays: ActivityDay[] = Array.from(dayMap.entries())
      .map(([date, { count, repos: repoSet }]) => ({
        date,
        count,
        repos: Array.from(repoSet),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    // --- Prefer the calendar (it includes private-repo contributions), but
    // only when it actually returned contribution data. An empty array is
    // truthy, so the old `if (contributionDays)` check accepted an empty
    // calendar and suppressed the public-events fallback.
    const calendarUsable = Boolean(calendar && calendar.days.length > 0);
    diag.calendar.usable = calendarUsable;

    let recentContributions: number;
    let activityDays: ActivityDay[];

    if (calendarUsable && calendar) {
      diag.source = "contribution-calendar";

      recentContributions = calendar.days.reduce(
        (sum, d) => (d.date >= thirtyDaysAgoKey ? sum + d.contributionCount : sum),
        0
      );

      activityDays = calendar.days
        .filter((d) => d.contributionCount > 0)
        .map((d) => ({ date: d.date, count: d.contributionCount, repos: [] }))
        .sort((a, b) => b.date.localeCompare(a.date));

      // The calendar should be a superset of public events, but if GitHub's
      // calendar lags or the token can only see a subset, never report fewer
      // than the public events already prove.
      if (eventContributions > recentContributions) {
        recentContributions = eventContributions;
        activityDays = eventActivityDays;
        diag.source = "public-events";
      }
    } else {
      diag.source = "public-events";
      if (diag.calendar.failureReason) {
        console.error(
          `GitHub contribution calendar unavailable, falling back to public events: ${diag.calendar.failureReason}`
        );
      }
      recentContributions = eventContributions;
      activityDays = eventActivityDays;
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
      ...(debug ? { debug: diag } : {}),
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch GitHub data",
        ...(debug ? { debug: diag } : {}),
      },
      { status: 500 }
    );
  }
}
