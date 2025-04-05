'use client';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SearchAndFilter from './SearchAndFilter';
import RepositoryCard from './RepositoryCard';
import { VisibilityFilter } from '@/types/filters.types';
import { GitHubRepo } from '@/types/github.types';
import { Github } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';

function AllRepositories() {
  const { data: session } = useSession();

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  const mainRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastComponent = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const debouncedSearch = useDebounce(searchQuery, 300);

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
          ...(debouncedSearch && { q: debouncedSearch }),
          per_page: debouncedSearch ? '100' : '10',
          page: pageNumber.toString(),
          ...(visibilityFilter !== 'all' && { visibility: visibilityFilter }),
          ...(languageFilter !== 'all' && { language: languageFilter }),
          affiliation: 'owner',
          sort: 'updated' // Default sort by last updated time
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

        const linkHeader = res.headers.get('Link');
        if (linkHeader) {
          setHasMorePages(linkHeader.includes('rel="next"'));
        } else {
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
    [session?.user?.accessToken, visibilityFilter, languageFilter, debouncedSearch]
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

    // Apply visibility filter
    if (visibilityFilter !== 'all') {
      filtered = filtered.filter((repo) => repo.visibility === visibilityFilter);
    }

    return filtered;
  }, [repos, debouncedSearch, languageFilter]);

  useEffect(() => {
    if (session?.user?.username) {
      setCurrentPage(1);
      fetchRepos(1, false);
    }
  }, [session?.user?.username, visibilityFilter, languageFilter, fetchRepos]);

  // Load more repos when the last component is in view
  useEffect(() => {
    if (lastComponent.current && !loading && hasMorePages) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            handleLoadMore();
          }
        },
        {
          root: null,
          rootMargin: '20px',
          threshold: 0.1
        }
      );

      observer.observe(lastComponent.current);

      return () => observer.disconnect();
    }
  }, [lastComponent, loading, hasMorePages]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchRepos(nextPage, true);
  }, [currentPage, fetchRepos]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const noModifiers = !event.altKey && !event.shiftKey && !event.metaKey && !event.ctrlKey;

    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      searchRef.current?.focus();
    } else if (noModifiers && event.key === 'Escape') {
      searchRef.current?.blur();
      mainRef.current?.focus();
    } else if (
      noModifiers &&
      event.key >= '0' &&
      event.key <= '9' &&
      document.activeElement !== searchRef.current
    ) {
      const index = parseInt(event.key);
      if (index >= 0 && index < filteredRepos.length) {
        router.push(`/${session?.user?.username}/${filteredRepos[index].name}`);
      }
    }
  };

  return (
    <div
      ref={mainRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="flex flex-col gap-1 w-full outline-none border-none"
    >
      <div>
        <p className="text-base text-[var(--text)]">
          Select a repository to generate a professional README with our AI-powered documentation
          tool.
        </p>
      </div>

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        visibilityFilter={visibilityFilter}
        onVisibilityChange={setVisibilityFilter}
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
        availableLanguages={availableLanguages}
        searchRef={searchRef}
      />

      {loading && currentPage === 1 ? (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-secondary mt-5"></div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-[1px] border-slate-800">
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo, i) =>
                i === filteredRepos.length - 1 ? (
                  <RepositoryCard
                    ref={lastComponent}
                    key={repo.id}
                    repo={repo}
                    onClick={() => router.push(`/${session?.user?.username}/${repo.name}`)}
                    index={i}
                  />
                ) : (
                  <RepositoryCard
                    key={repo.id}
                    repo={repo}
                    onClick={() => router.push(`/${session?.user?.username}/${repo.name}`)}
                    index={i}
                  />
                )
              )
            ) : (
              <EmptyState />
            )}
          </div>

          {hasMorePages && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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
        </>
      )}
    </div>
  );
}

const EmptyState = () => (
  <div className="py-6">
    <p className="text-gray-700 dark:text-gray-300">
      You don&apos;t have any repositories yet. Get started by creating your first repository.
    </p>
    <button
      onClick={() => {
        redirect('https://github.com/');
      }}
      className="mt-4 rounded-md bg-secondary px-4 py-2 text-white hover:bg-secondary/60 cursor-pointer transition-colors flex items-center gap-1"
    >
      <Github size={16} />
      <p>Go to GitHub</p>
    </button>
  </div>
);

export default AllRepositories;
