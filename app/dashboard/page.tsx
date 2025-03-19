'use client';

import AllRepositories from '@/components/AllRepositories';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function DashboardPage() {
  const { data: session } = useSession();

  if (session) {
    fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(session)
    });
  }

  return (
    <div className="container mx-auto max-w-7xl grid grid-cols-4 gap-10 px-4 py-28">
      <div className="col-span-1 flex flex-col items-start justify-start relative">
        <div className="flex flex-col items-start justify-start sticky top-28">
          <div>
            {session?.user?.image && (
              <div className="h-full w-full overflow-hidden rounded-full">
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={1080}
                  height={1080}
                />
              </div>
            )}
          </div>
          <p className="text-xl font-bold mt-5">{session?.user?.name}</p>
          <p className="text-xl text-white/70">{session?.user?.username}</p>
          <div className="mt-3">
            <p className="text-xs text-[var(--info)]">
              Select a repository to generate a professional README with our AI-powered
              documentation tool. We'll analyze your code and create tailored documentation in
              seconds.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-3">
        <AllRepositories />
      </div>
    </div>
  );
}
