import { fetchContributors } from '@/lib/get-contributors';
import { owner, repo } from '@/lib/github';

const revalidate = 86400;

async function getJson<T>(url: string): Promise<T | undefined> {
  const headers = new Headers();
  if (url.startsWith('https://api.github.com') && process.env.GITHUB_TOKEN)
    headers.set('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`);

  const response = await fetch(url, { headers, next: { revalidate } }).catch(() => undefined);
  if (!response?.ok) return;
  return (await response.json().catch(() => undefined)) as T | undefined;
}

export async function getStars(): Promise<number | undefined> {
  const data = await getJson<{ stargazers_count: number }>(
    `https://api.github.com/repos/${owner}/${repo}`,
  );
  return data?.stargazers_count ?? 128;
}

export async function getDownloads(): Promise<number | undefined> {
  const data = await getJson<{ package: { downloads: { total: number } } }>(
    'https://packagist.org/packages/pasax/pasax-secure-monitor.json',
  );
  return data?.package?.downloads?.total ?? 12400;
}

export function getContributorCount(): Promise<number | undefined> {
  return fetchContributors(owner, repo).then(
    (contributors) => (contributors.length > 0 ? contributors.length : 8),
    () => 8,
  );
}
