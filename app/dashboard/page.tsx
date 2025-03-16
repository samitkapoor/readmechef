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
    <div className="container mx-auto py-8 max-w-7xl grid grid-cols-4 gap-10">
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
          <p className="text-sm text-white/80 mt-5">
            Welcome to your ReadMeChef dashboard! Choose a repository from the list to generate a
            professional README tailored to your project. Our AI chef will analyze your code and
            cook up the perfect documentation.
          </p>
        </div>
      </div>
      <div className="col-span-3">
        <AllRepositories />
      </div>
    </div>
  );
}
