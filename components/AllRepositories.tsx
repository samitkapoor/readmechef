'use client';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchAndFilter from './SearchAndFilter';
import RepositoryCard from './RepositoryCard';
import { VisibilityFilter } from '@/types/filters.types';
import { GitHubRepo } from '@/types/github.types';
import { Github } from 'lucide-react';

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
  const [languageFilter, setLanguageFilter] = useState('all');

  const router = useRouter();
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Extract unique languages from repos
  const availableLanguages = useMemo(() => {
    const languages = repos
      .map((repo) => repo.language)
      .filter((language): language is string => !!language);

    const uniqueLanguages = [...new Set(languages)];
    return uniqueLanguages.sort().map((lang) => ({ value: lang, label: lang }));
  }, [repos]);

  const fetchRepos = useCallback(
    async (pageNumber: number, append: boolean = false) => {
      if (!session?.user?.accessToken) return;

      try {
        setLoading(true);
        const params = new URLSearchParams({
          per_page: debouncedSearch ? '200' : '30',
          page: pageNumber.toString(),
          ...(visibilityFilter !== 'all' && { visibility: visibilityFilter }),
          ...(languageFilter !== 'all' && { language: languageFilter })
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
    [session?.user?.accessToken, visibilityFilter, languageFilter]
  );

  // Filter repos based on search query and language
  const filteredRepos = useMemo(() => {
    let filtered = repos;

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchLower) ||
          (repo.description?.toLowerCase() || '').includes(searchLower)
      );
    }

    // Apply language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter((repo) => repo.language === languageFilter);
    }

    return filtered;
  }, [repos, debouncedSearch, languageFilter]);

  // Fetch repos when dependencies change
  useEffect(() => {
    if (session?.user?.username) {
      setCurrentPage(1);
      fetchRepos(1, false);
    }
  }, [session?.user?.username, visibilityFilter, languageFilter, fetchRepos]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchRepos(nextPage, true);
  }, [currentPage, fetchRepos]);

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--primary)]"></div>
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
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
        availableLanguages={availableLanguages}
      />

      <div className="grid grid-cols-1 gap-[1px] bg-slate-900 border-y-[1px] border-slate-800">
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
            className="rounded-md bg-[var(--primary)] px-6 py-2 text-white hover:bg-[var(--primary)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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
  <div className="bg-[var(--background)] py-6">
    <p className="text-gray-700 dark:text-gray-300">
      You don't have any repositories yet. Get started by creating your first repository.
    </p>
    <button
      onClick={() => {
        redirect('https://github.com/');
      }}
      className="mt-4 rounded-md bg-[var(--secondary)] px-4 py-2 text-white hover:bg-[var(--secondary)]/60 cursor-pointer transition-colors flex items-center gap-1"
    >
      <Github size={16} />
      <p>Go to GitHub</p>
    </button>
  </div>
);

export default AllRepositories;
