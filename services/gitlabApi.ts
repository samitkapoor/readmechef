'use server';

import { GitLabRepo } from '@/types/gitlab.types';
import { signOut } from 'next-auth/react';

async function getUserId(accessToken: string): Promise<string> {
  const userDetails = await fetch('https://gitlab.com/api/v4/user', {
    headers: {
      authorization: 'Bearer ' + accessToken
    }
  });
  if (!userDetails.ok) {
    signOut({ callbackUrl: '/login' });
    throw new Error('Failed to fetch user details');
  }
  const { id: userId } = await userDetails.json();

  return userId;
}

async function getRepos(
  userId: string,
  params: URLSearchParams | string,
  accessToken: string
): Promise<Response> {
  const response = await fetch(`https://gitlab.com/api/v4/users/${userId}/projects?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`GitLab API error: ${response.status}`);
  }

  return response;
}

/**
 * Fetches repositories from GitLab API
 */
export async function fetchGitLabRepos(
  accessToken: string,
  page: number = 1,
  perPage: number = 10,
  search?: string,
  visibility?: string,
  language?: string,
  scope?: string
): Promise<{ repos: GitLabRepo[]; hasMore: boolean }> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      order_by: 'updated_at',
      sort: 'desc'
    });

    // Add search parameter if provided
    if (search) {
      params.append('search', search);
    }

    const visibilityFilter = scope?.includes('read_repository') ? visibility : 'public';
    // Add visibility filter if provided
    if (visibilityFilter && visibilityFilter !== 'all') {
      params.append('visibility', visibilityFilter);
    }

    // GitLab doesn't have a direct language filter in the API
    // We'll filter by language after fetching
    const userId = await getUserId(accessToken);

    const response = await getRepos(userId, params, accessToken);

    const repos = await response.json();

    // Get total pages from headers
    const totalPages = parseInt(response.headers.get('X-Total-Pages') || '1', 10);
    const currentPage = parseInt(response.headers.get('X-Page') || '1', 10);

    const hasMore = currentPage < totalPages;

    // Filter by language if specified (since GitLab API doesn't support this directly)
    let filteredRepos = repos;
    if (language && language !== 'all') {
      filteredRepos = repos.filter(
        (repo: GitLabRepo) => repo.language?.toLowerCase() === language.toLowerCase()
      );
    }

    return { repos: filteredRepos, hasMore };
  } catch (error) {
    console.error('Error fetching GitLab repositories:', error);
    throw error;
  }
}

export async function fetchGitLabRepository(
  repositoryName: string,
  accessToken: string
): Promise<GitLabRepo> {
  const userId = await getUserId(accessToken);

  //? Search repository name
  const repoDetailsResponse = await getRepos(userId, `search=${repositoryName}`, accessToken);
  const repos = await repoDetailsResponse.json();
  if (repos.length === 0) {
    signOut({ callbackUrl: '/login' });
    throw new Error(`Repository not found`);
  }
  const repo = repos[0];

  const response = await fetch(`https://gitlab.com/api/v4/projects/${repo.id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    signOut({ callbackUrl: '/login' });
    throw new Error(`Failed to fetch GitLab repository: ${response.status}`);
  }

  return response.json();
}
