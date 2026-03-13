import { NextResponse } from "next/server";

const USERNAME = "jp206100";

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

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "justinparra-portfolio",
    };

    const [reposRes, eventsRes] = await Promise.all([
      fetch(
        `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`,
        { headers, next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.github.com/users/${USERNAME}/events/public?per_page=100`,
        { headers, next: { revalidate: 3600 } }
      ),
    ]);

    if (!reposRes.ok || !eventsRes.ok) {
      throw new Error("GitHub API request failed");
    }

    const repos: GitHubRepo[] = await reposRes.json();
    const events: GitHubEvent[] = await eventsRes.json();

    // Count public repos (excluding forks)
    const ownRepos = repos.filter((r) => !r.fork);
    const totalRepos = ownRepos.length;

    // Count repos active in the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const activeProjects = ownRepos.filter(
      (r) => new Date(r.pushed_at) > ninetyDaysAgo
    ).length;

    // Recent contributions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    let recentContributions = 0;
    for (const event of events) {
      if (new Date(event.created_at) > thirtyDaysAgo) {
        recentContributions++;
      }
    }

    // Build activity stream: group events by day with counts
    const dayMap = new Map<string, { count: number; repos: Set<string> }>();
    for (const event of events) {
      const date = event.created_at.split("T")[0];
      const entry = dayMap.get(date) ?? { count: 0, repos: new Set<string>() };
      entry.count++;
      entry.repos.add(event.repo.name.split("/").pop() ?? event.repo.name);
      dayMap.set(date, entry);
    }

    const activityDays = Array.from(dayMap.entries())
      .map(([date, { count, repos: repoSet }]) => ({
        date,
        count,
        repos: Array.from(repoSet),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    // Recent events for activity feed (last 10, deduplicated by repo+type+day)
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

    // Top repos (most recently pushed, non-fork, up to 4)
    const topRepos = ownRepos.slice(0, 4).map((r) => ({
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
