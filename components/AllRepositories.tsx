'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchAndFilter from './SearchAndFilter';
import RepositoryCard from './RepositoryCard';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
}

type VisibilityFilter = 'all' | 'public' | 'private';

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

function AllRepositories() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('public');

  const router = useRouter();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchRepos = useCallback(
    async (pageNumber: number, append: boolean = false) => {
      if (!session?.user?.accessToken) return;

      try {
        setLoading(true);
        const params = new URLSearchParams({
          per_page: debouncedSearch ? '200' : '30',
          page: pageNumber.toString(),
          ...(visibilityFilter !== 'all' && { visibility: visibilityFilter })
        });

        const res = await fetch(`https://api.github.com/user/repos?${params}`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            Accept: 'application/vnd.github+json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const newRepos = await res.json();

        // Check if there are more pages to load
        const linkHeader = res.headers.get('Link');
        if (linkHeader) {
          // If there's a "next" link, there are more pages
          setHasMorePages(linkHeader.includes('rel="next"'));
        } else {
          // If no Link header and we got less than the full page
          // or no results, there are no more pages
          setHasMorePages(newRepos.length === 30);
        }

        // Update repos - either append or replace based on parameter
        setRepos((prevRepos) => (append ? [...prevRepos, ...newRepos] : newRepos));
      } catch (err) {
        console.error('Error fetching repositories:', err);
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.accessToken, visibilityFilter]
  );

  // Filter repos based on search query
  const filteredRepos = useMemo(() => {
    if (!debouncedSearch) return repos;

    const searchLower = debouncedSearch.toLowerCase();
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchLower) ||
        (repo.description?.toLowerCase() || '').includes(searchLower)
    );
  }, [repos, debouncedSearch]);

  // Fetch repos when dependencies change
  useEffect(() => {
    if (session?.user?.username) {
      setCurrentPage(1);
      fetchRepos(1, false);
    }
  }, [session?.user?.username, visibilityFilter, fetchRepos]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchRepos(nextPage, true);
  }, [currentPage, fetchRepos]);

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        visibilityFilter={visibilityFilter}
        onVisibilityChange={setVisibilityFilter}
      />

      <div className="flex items-center justify-between">
        <p className="text-gray-700 dark:text-gray-300">
          {visibilityFilter === 'all'
            ? 'All'
            : visibilityFilter.charAt(0).toUpperCase() + visibilityFilter.slice(1)}{' '}
          Repositories ({filteredRepos.length})
        </p>
        {loading && <div className="text-sm text-gray-500">Refreshing...</div>}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              onClick={() => router.push(`/dashboard/repository/${repo.id}`)}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {hasMorePages && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="rounded-md bg-amber-500 px-6 py-2 text-white hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                <span>Loading...</span>
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

const EmptyState = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-slate-800">
    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Your Projects</h2>
    <p className="text-gray-700 dark:text-gray-300">
      You haven't created any projects yet. Get started by creating your first README.
    </p>
    <button className="mt-4 rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors">
      Create New Project
    </button>
  </div>
);

export default AllRepositories;
