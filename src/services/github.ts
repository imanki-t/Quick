export const GITHUB_USERNAME = 'imanki-t';

// @ts-ignore
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const headers: HeadersInit = {
  Accept: 'application/vnd.github.v3+json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

/* ─── Types ─── */
export interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  html_url: string;
  homepage: string | null;
  updated_at: string;
  created_at: string;
  topics: string[];
  fork: boolean;
  size: number;
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: {
    commits?: Array<{ message: string; sha: string }>;
    action?: string;
    ref?: string;
    ref_type?: string;
    pull_request?: { title: string; number: number };
    issue?: { title: string; number: number };
    forkee?: { full_name: string };
  };
}

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

/* ─── Language colors ─── */
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Rust:       '#dea584',
  Go:         '#00ADD8',
  Python:     '#3572A5',
  CSS:        '#563d7c',
  HTML:       '#e34c26',
  Shell:      '#89e051',
  Dockerfile: '#384d54',
  Vue:        '#41b883',
  Svelte:     '#ff3e00',
  Ruby:       '#701516',
  Swift:      '#fa7343',
  Kotlin:     '#A97BFF',
  C:          '#555555',
  'C++':      '#f34b7d',
  'C#':       '#178600',
  Java:       '#b07219',
  Lua:        '#000080',
};

export function getLangColor(lang: string | null | undefined): string {
  if (!lang) return '#888';
  return LANG_COLORS[lang] ?? '#888';
}

/* ─── Core fetchers ─── */
export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    { headers }
  );
  if (!res.ok) throw new Error('Failed to fetch repos');
  return res.json();
}

export async function getRepo(name: string): Promise<Repo> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch repo');
  return res.json();
}

export async function getReadme(name: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}/readme`, {
    headers: { ...headers, Accept: 'application/vnd.github.v3.raw' },
  });
  if (!res.ok) return null;
  return res.text();
}

export async function getEvents(): Promise<GitHubEvent[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`,
    { headers }
  );
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

/* ─── User profile (followers / following) ─── */
export async function getUserProfile(): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

/* ─── Language stats (real bytes from top repos) ─── */
export async function getLanguageStats(repos: Repo[]): Promise<LanguageStat[]> {
  const ownRepos = repos.filter((r) => !r.fork).slice(0, 20);

  const results = await Promise.allSettled(
    ownRepos.map((r) =>
      fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${r.name}/languages`, { headers })
        .then((res) => (res.ok ? res.json() : {}))
    )
  );

  const totals: Record<string, number> = {};
  results.forEach((r) => {
    if (r.status === 'fulfilled') {
      Object.entries(r.value as Record<string, number>).forEach(([lang, bytes]) => {
        totals[lang] = (totals[lang] ?? 0) + (bytes as number);
      });
    }
  });

  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(totals)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 1000) / 10,
      color: getLangColor(name),
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);
}

/* ─── LOC estimate from repo sizes ─── */
export function estimateLinesOfCode(repos: Repo[]): number {
  const ownRepos = repos.filter((r) => !r.fork);
  const totalKb = ownRepos.reduce((sum, r) => sum + (r.size || 0), 0);
  return Math.round(totalKb * 40);
}

/* ─── Coding streak from events (up to ~90 events) ─── */
export async function getCodingStreak(): Promise<StreakData> {
  const pages = await Promise.allSettled([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30&page=1`, { headers }).then(r => r.ok ? r.json() : []),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30&page=2`, { headers }).then(r => r.ok ? r.json() : []),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30&page=3`, { headers }).then(r => r.ok ? r.json() : []),
  ]);

  const allEvents: GitHubEvent[] = [];
  pages.forEach((r) => {
    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
      allEvents.push(...r.value);
    }
  });

  const activeDays = new Set<string>();
  allEvents.forEach((ev) => {
    if (['PushEvent', 'CreateEvent', 'IssuesEvent', 'PullRequestEvent', 'CommitCommentEvent'].includes(ev.type)) {
      activeDays.add(ev.created_at.slice(0, 10));
    }
  });

  const sortedDays = Array.from(activeDays).sort().reverse();

  let currentStreak = 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (sortedDays.length > 0 && (sortedDays[0] === today || sortedDays[0] === yesterday)) {
    currentStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prev = new Date(sortedDays[i - 1]).getTime();
      const curr = new Date(sortedDays[i]).getTime();
      if (Math.round((prev - curr) / 86400000) === 1) {
        currentStreak++;
      } else break;
    }
  }

  let longestStreak = currentStreak;
  const chronoDays = [...sortedDays].reverse();
  let tempStreak = 1;
  for (let i = 1; i < chronoDays.length; i++) {
    const prev = new Date(chronoDays[i - 1]).getTime();
    const curr = new Date(chronoDays[i]).getTime();
    if (Math.round((curr - prev) / 86400000) === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, longestStreak, totalActiveDays: activeDays.size };
}

/* ─── Open source contributions (PRs merged in other repos) ─── */
export async function getContributionCount(): Promise<number> {
  const res = await fetch(
    `https://api.github.com/search/issues?q=type:pr+is:merged+author:${GITHUB_USERNAME}+-user:${GITHUB_USERNAME}&per_page=1`,
    { headers }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data.total_count ?? 0;
}

/* ─── Event helpers ─── */
export function formatEventMessage(event: GitHubEvent): { type: string; message: string; repo: string } {
  const repoName = event.repo.name.replace(`${GITHUB_USERNAME}/`, '');
  switch (event.type) {
    case 'PushEvent': {
      const msg = event.payload.commits?.[0]?.message?.split('\n')[0] ?? 'Pushed code';
      return { type: 'commit', message: msg, repo: repoName };
    }
    case 'WatchEvent':
      return { type: 'star', message: `Starred ${event.repo.name}`, repo: repoName };
    case 'ForkEvent':
      return { type: 'fork', message: `Forked ${event.repo.name}`, repo: event.payload.forkee?.full_name ?? repoName };
    case 'CreateEvent':
      return { type: 'create', message: `Created ${event.payload.ref_type} ${event.payload.ref ?? repoName}`, repo: repoName };
    case 'IssuesEvent':
      return { type: 'issue', message: `${event.payload.action} issue: ${event.payload.issue?.title}`, repo: repoName };
    case 'PullRequestEvent':
      return { type: 'pr', message: `${event.payload.action} PR: ${event.payload.pull_request?.title}`, repo: repoName };
    default:
      return { type: 'other', message: event.type.replace('Event', ''), repo: repoName };
  }
}

export function formatTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
