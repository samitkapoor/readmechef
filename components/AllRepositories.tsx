'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

function AllRepositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.username) return; // Ensure session is fully available before fetching

    const fetchRepos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/github/${session.user.username}/repos`);
        if (!res.ok) throw new Error('Failed to fetch repositories');
        const { repos } = await res.json();

        console.log({ repos });
        setRepos(repos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [session?.user?.name]); // Only runs when session.user.name changes

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {repos.length > 0 ? (
        repos.map((repo: any) => (
          <div
            key={repo.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-slate-800"
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {repo.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {repo.description || 'No description available'}
            </p>
            <div className="mt-4 flex justify-between">
              <span className="text-sm text-gray-500">
                {repo.language || 'No language specified'}
              </span>
              <span className="text-sm text-gray-500">⭐ {repo.stargazers_count}</span>
            </div>
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
  );
}

export default AllRepositories;
