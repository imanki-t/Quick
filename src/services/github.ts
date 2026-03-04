export const GITHUB_USERNAME = 'imanki-t';

// @ts-ignore
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const headers: HeadersInit = {
  Accept: 'application/vnd.github.v3+json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

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
  topics: string[];
  fork: boolean;
}

export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    { headers }
  );
  if (!res.ok) throw new Error('Failed to fetch repos');
  return res.json();
}

export async function getRepo(name: string): Promise<Repo> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`, {
    headers,
  });
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
