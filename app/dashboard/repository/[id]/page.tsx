'use client';

import Chatbox from '@/components/Chatbox';
import Hyperlink from '@/components/ui/Hyperlink';

import Loader from '@/components/ui/Loader';
import { Github } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
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
          className="px-4 py-2 bg-secondary/40 text-white rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative flex items-center justify-center">
      <div className="container mx-auto px-4 pt-[70px] grid grid-cols-4 items-start gap-6 h-full max-w-7xl w-full">
        <div className="col-span-1 flex flex-col items-start justify-start relative pt-[70px]">
          <div className="flex flex-col items-start justify-start sticky top-[100px]">
            <div>
              {session?.user?.image && (
                <div className="h-full w-full overflow-hidden rounded-full hover:animate-spin p-1 border-[10px] border-neutral-900 ">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={1080}
                    height={1080}
                    className="rounded-full"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col items-start justify-start ml-[10px]">
              <p className="text-xl font-bold mt-5 leading-none">{session?.user?.name}</p>
              <p className="text-xl text-white/70">{session?.user?.username}</p>
              <p className="text-white mt-5 text-xl">{repository.name}</p>
              <div className="mt-5">
                <Hyperlink
                  href={'https://github.com/' + session?.user?.username + '/' + repository.name}
                  prefixIcon={<Github size={16} className="mr-0.5" />}
                  text="Open"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 border-l-[1px] border-primary/10 h-full overflow-y-auto">
          <Chatbox repository={repository} />
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;
