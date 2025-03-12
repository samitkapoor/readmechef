'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
}

function AllRepositories() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const fetchRepos = async (pageNumber: number) => {
    try {
      setLoading(true);

      const res = await fetch(`https://api.github.com/user/repos?per_page=30&page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          Accept: 'application/vnd.github+json'
        }
      });

      // Get total count from GitHub API Link header
      const linkHeader = res.headers.get('Link');
      if (linkHeader) {
        const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
        if (lastPageMatch) {
          setTotalPages(parseInt(lastPageMatch[1]));
        }
      }

      if (res.ok) {
        const newRepos = await res.json();
        setRepos(newRepos);
      } else {
        console.error('Failed to fetch repositories');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.username) return;
    fetchRepos(currentPage);
  }, [session?.user?.username, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-amber-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (loading && currentPage === 1) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-5 w-full">
      <p>All Repositories ({repos.length})</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {repos.length > 0 ? (
          repos.map((repo) => (
            <div
              onClick={() => {
                router.push(`/dashboard/repository/${repo.id}`);
              }}
              key={repo.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-slate-800 flex flex-col justify-between"
            >
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                {repo.name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 truncate">
                {repo.description || 'No description available'}
              </p>
              <div className="mt-4 flex justify-between">
                <span className="text-sm text-gray-500">
                  {repo.language || 'No language specified'}
                </span>
                <span className="text-sm text-gray-500">⭐ {repo.stargazers_count}</span>
              </div>
              <button className="w-full py-2 px-2 bg-white hover:bg-white/90 cursor-pointer text-black rounded-md mt-10">
                Select
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Your Projects
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You haven't created any projects yet. Get started by creating your first README.
            </p>
            <button className="mt-4 rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors">
              Create New Project
            </button>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      )}
      {loading && <div className="text-center mt-4">Loading...</div>}
    </div>
  );
}

export default AllRepositories;
