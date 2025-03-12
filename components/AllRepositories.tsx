'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Pagination from './Pagination';
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
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');

  const router = useRouter();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchRepos = useCallback(
    async (pageNumber: number) => {
      if (!session?.user?.accessToken) return;

      try {
        setLoading(true);
        const params = new URLSearchParams({
          per_page: '30',
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

        // Parse total pages from Link header
        const linkHeader = res.headers.get('Link');
        if (linkHeader) {
          const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
          setTotalPages(lastPageMatch ? parseInt(lastPageMatch[1]) : 1);
        }

        const newRepos = await res.json();
        setRepos(newRepos);
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
      fetchRepos(1);
    }
  }, [session?.user?.username, visibilityFilter, fetchRepos]);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      setCurrentPage(pageNumber);
      fetchRepos(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [fetchRepos]
  );

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
          {visibilityFilter === 'all' ? 'All' : visibilityFilter} Repositories (
          {filteredRepos.length})
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
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
