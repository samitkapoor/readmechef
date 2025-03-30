import { useState, useEffect } from 'react';
import { Repository } from '@/types/github.types';
import { signOut } from 'next-auth/react';

export function useRepository(username: string, repositoryName: string, accessToken?: string) {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`https://api.github.com/repos/${username}/${repositoryName}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github+json'
          }
        });

        if (!res.ok) {
          signOut({ callbackUrl: '/login' });
          throw new Error(`Failed to fetch repository details: ${res.status}`);
        }

        const data = await res.json();
        setRepository(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching repository:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepository();
  }, [username, repositoryName, accessToken]);

  return { repository, isLoading, error };
}
