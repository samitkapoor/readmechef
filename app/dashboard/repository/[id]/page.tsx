'use client';

import Chatbox from '@/components/Chatbox';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  private: boolean;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
}

const RepositoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      if (!session?.user?.accessToken) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`https://api.github.com/repositories/${params.id}`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            Accept: 'application/vnd.github+json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch repository details');
        }

        const data = await res.json();
        setRepository(data);
      } catch (err) {
        console.error('Error fetching repository:', err);
        setError('Failed to load repository details');
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [params.id, session?.user?.accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error || 'Repository not found'}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {repository.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{repository.full_name}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              View on GitHub
            </a>
            <button
              onClick={() => router.push(`/dashboard/repository/${params.id}/generate`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors"
            >
              Generate README
            </button>
          </div>
        </div>

        {/* Repository Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Repository Details
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Description:</span>{' '}
                {repository.description || 'No description available'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Visibility:</span>{' '}
                {repository.private ? 'Private' : 'Public'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Default Branch:</span> {repository.default_branch}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Language:</span>{' '}
                {repository.language || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-500">{repository.stargazers_count}</p>
                <p className="text-gray-600 dark:text-gray-400">Stars</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-500">{repository.forks_count}</p>
                <p className="text-gray-600 dark:text-gray-400">Forks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-500">{repository.watchers_count}</p>
                <p className="text-gray-600 dark:text-gray-400">Watchers</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Created:</span>{' '}
                {new Date(repository.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(repository.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="h-full w-full flex items-start justify-center pt-20">
          <Chatbox />
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;
