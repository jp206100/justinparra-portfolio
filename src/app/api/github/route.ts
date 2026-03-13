import { NextResponse } from "next/server";

const USERNAME = "jp206100";

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

interface GitHubRepo {
  name: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "justinparra-portfolio",
    };

    // Fetch repos and recent events in parallel
    const [reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=100`, { headers, next: { revalidate: 3600 } }),
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

    // Build a contribution grid from events (last 52 weeks)
    // GitHub events API only returns ~90 days, so older weeks will be empty
    const now = new Date();
    const grid: number[][] = Array.from({ length: 52 }, () =>
      Array.from({ length: 7 }, () => 0)
    );

    // Calculate the start of the grid (52 weeks ago, starting on Sunday)
    const gridStart = new Date(now);
    gridStart.setDate(gridStart.getDate() - 52 * 7 - gridStart.getDay());
    gridStart.setHours(0, 0, 0, 0);

    let recentContributions = 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const event of events) {
      const eventDate = new Date(event.created_at);
      const daysSinceStart = Math.floor(
        (eventDate.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      const week = Math.floor(daysSinceStart / 7);
      const day = daysSinceStart % 7;

      if (week >= 0 && week < 52 && day >= 0 && day < 7) {
        grid[week][day]++;
      }

      if (eventDate > thirtyDaysAgo) {
        recentContributions++;
      }
    }

    // Flatten and assign levels
    const contributions = [];
    for (let w = 0; w < 52; w++) {
      for (let d = 0; d < 7; d++) {
        const count = grid[w][d];
        let level = 0;
        if (count >= 1) level = 1;
        if (count >= 3) level = 2;
        if (count >= 5) level = 3;
        if (count >= 8) level = 4;
        contributions.push({ w, d, level, count });
      }
    }

    return NextResponse.json({
      contributions,
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
