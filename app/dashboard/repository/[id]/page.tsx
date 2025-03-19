'use client';

import Chatbox from '@/components/Chatbox';
import Hyperlink from '@/components/ui/Hyperlink';
import IconDetail from '@/components/ui/IconDetail';
import Loader from '@/components/ui/Loader';
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  GitBranch,
  GitFork,
  Github,
  Glasses,
  Languages,
  NotebookText,
  Star
} from 'lucide-react';
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
        <Loader />
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-[var(--error)]">{error || 'Repository not found'}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[var(--secondary)]/40 text-white rounded-md hover:bg-[var(--secondary)]/80 transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden pt-[70px] relative">
      <div
        style={{
          gridTemplateColumns: '300px 1fr'
        }}
        className="grid grid-cols-2 items-start gap-6 h-full w-full"
      >
        <div className="flex flex-col pt-5 pl-8">
          <div className="flex items-start gap-4">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
              className="w-12 h-12 rounded-full mt-2 hover:animate-spin "
            />
            <div className="flex flex-col mt-1">
              <h1 className="text-xl font-bold leading-none">{repository.name}</h1>
              <p className="text-gray-400">{repository.full_name}</p>
              <div className="flex gap-4">
                <Hyperlink
                  href={repository.html_url}
                  prefixIcon={<Github size={16} className="mr-0.5" />}
                  text="GitHub"
                />
              </div>
            </div>
          </div>
          <div className="rounded-lg mt-4">
            <div className="flex flex-col ml-1 mt-1">
              <IconDetail
                icon={<NotebookText size={16} className="text-white" />}
                value={repository.description}
              />
              <IconDetail
                icon={
                  repository.private ? (
                    <EyeOff size={16} className="text-white" />
                  ) : (
                    <Eye size={16} className="text-white" />
                  )
                }
                value={repository.private ? 'Private' : 'Public'}
              />
              <IconDetail
                icon={<GitBranch size={16} className="text-white" />}
                value={repository.default_branch}
              />
              <IconDetail
                icon={<Languages size={16} className="text-white" />}
                value={repository.language}
              />
              <IconDetail
                icon={<Star size={16} className="text-white" />}
                value={repository.stargazers_count}
              />
              <IconDetail
                icon={<GitFork size={16} className="text-white" />}
                value={repository.forks_count}
              />
              <IconDetail
                icon={<Glasses size={16} className="text-white" />}
                value={repository.watchers_count}
              />
            </div>
          </div>
        </div>

        <div className="h-full w-full flex items-start justify-center overflow-y-auto border-l-[1px] border-neutral-700">
          <Chatbox repository={repository} />
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;
