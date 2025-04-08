import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Repository, normalizeGitHubRepo, normalizeGitLabRepo } from '@/types/repository.types';
import { fetchGitHubRepository } from '@/services/githubApi';
import { fetchGitLabRepository } from '@/services/gitlabApi';

export function useRepository(
  username: string,
  repositoryName: string,
  accessToken: string,
  platform: string
) {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      if (!accessToken || !platform) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        let normalizedRepo: Repository;

        if (platform === 'github') {
          const githubRepo = await fetchGitHubRepository(username, repositoryName, accessToken);
          normalizedRepo = normalizeGitHubRepo(githubRepo);
        } else if (platform === 'gitlab') {
          const gitlabRepo = await fetchGitLabRepository(repositoryName, accessToken);
          normalizedRepo = normalizeGitLabRepo(gitlabRepo);
        } else {
          throw new Error(`Unsupported platform: ${platform}`);
        }

        setRepository(normalizedRepo);
        setError(null);
      } catch (err) {
        console.error('Error fetching repository:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));

        // Sign out if the error is due to authentication
        if (err instanceof Error && err.message.includes('401')) {
          signOut({ callbackUrl: '/login' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepository();
  }, [username, repositoryName, accessToken, platform]);

  return { repository, isLoading, error };
}
