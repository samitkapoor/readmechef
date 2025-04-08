import { GitHubRepo } from '@/types/github.types';

/**
 * Fetches repositories from GitHub API
 */
export async function fetchGitHubRepos(
  accessToken: string,
  page: number = 1,
  perPage: number = 10,
  search?: string,
  visibility?: string,
  language?: string
): Promise<{ repos: GitHubRepo[]; hasMore: boolean }> {
  try {
    const params = new URLSearchParams({
      ...(search && { q: search }),
      per_page: perPage.toString(),
      page: page.toString(),
      ...(visibility !== 'all' && { visibility }),
      ...(language !== 'all' && { language }),
      affiliation: 'owner',
      sort: 'updated'
    });

    const response = await fetch(`https://api.github.com/user/repos?${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Check if there are more pages from the Link header
    const linkHeader = response.headers.get('Link');
    const hasMore = linkHeader ? linkHeader.includes('rel="next"') : repos.length === perPage;

    return { repos, hasMore };
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
}
