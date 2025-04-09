'use client';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SearchAndFilter from './SearchAndFilter';
import RepositoryCard from './RepositoryCard';
import { VisibilityFilter } from '@/types/filters.types';
import { GitHubRepo } from '@/types/github.types';
import { GitLabRepo } from '@/types/gitlab.types';
import { Github } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';
import { fetchGitHubRepos } from '@/services/githubApi';
import { fetchGitLabRepos } from '@/services/gitlabApi';

// Union type for repositories from either platform
type Repo = GitHubRepo | GitLabRepo;

function AllRepositories() {
  const { data: session } = useSession();

  const [repos, setRepos] = useState<Repo[]>([]);
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

        // Determine which API to use based on the platform
        const isGitHub = session.user.platform === 'github';
        const isGitLab = session.user.platform === 'gitlab';

        if (!isGitHub && !isGitLab) {
          console.error('Unknown platform:', session.user.platform);
          return;
        }

        const perPage = debouncedSearch ? 100 : 10;

        let result;

        if (isGitHub) {
          result = await fetchGitHubRepos(
            session.user.accessToken,
            pageNumber,
            perPage,
            debouncedSearch,
            visibilityFilter,
            languageFilter
          );
        } else {
          result = await fetchGitLabRepos(
            session.user.accessToken,
            pageNumber,
            perPage,
            debouncedSearch,
            visibilityFilter,
            languageFilter,
            session?.user?.scope || ''
          );
        }

        const { repos: newRepos, hasMore } = result;

        // Update repos - either append or replace based on parameter
        setRepos((prevRepos) => (append ? [...prevRepos, ...newRepos] : newRepos));
        setHasMorePages(hasMore);
      } catch (err) {
        console.error('Error fetching repositories:', err);
      } finally {
        setLoading(false);
      }
    },
    [
      session?.user?.accessToken,
      session?.user?.platform,
      visibilityFilter,
      languageFilter,
      debouncedSearch
    ]
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

    return filtered;
  }, [repos, debouncedSearch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePages && !loading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (lastComponent.current) {
      observer.observe(lastComponent.current);
    }

    return () => {
      if (lastComponent.current) {
        observer.unobserve(lastComponent.current);
      }
    };
  }, [hasMorePages, loading, currentPage]);

  // Effect for fetching repositories
  useEffect(() => {
    // Only append if page > 1, otherwise replace
    const shouldAppend = currentPage > 1;
    fetchRepos(currentPage, shouldAppend);
  }, [fetchRepos, currentPage]);

  // Reset page and fetch when filters change
  useEffect(() => {
    setCurrentPage(1);
    // This will trigger the fetch effect above with page 1
  }, [debouncedSearch, visibilityFilter, languageFilter]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  const handleRepoClick = (repo: Repo) => {
    if (session?.user?.username) {
      router.push(`/${session.user.username}/${repo.name}`);
    }
  };

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
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-l-2 border-secondary mt-10"></div>
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
                    onClick={() => handleRepoClick(repo)}
                    index={i}
                  />
                ) : (
                  <RepositoryCard
                    key={repo.id}
                    repo={repo}
                    onClick={() => handleRepoClick(repo)}
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
                onClick={() => fetchRepos(currentPage, true)}
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
