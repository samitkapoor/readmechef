'use client';

import AllRepositories from '@/components/AllRepositories';
import Hyperlink from '@/components/ui/Hyperlink';
import { Github } from 'lucide-react';
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
    <div className="container mx-auto max-w-7xl grid grid-cols-4 gap-10 px-4 py-[100px]">
      <div className="col-span-1 flex flex-col items-start justify-start relative">
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
            <div className="mt-5">
              <Hyperlink
                href={'https://github.com/' + session?.user?.username}
                prefixIcon={<Github size={16} className="mr-0.5" />}
                text="GitHub"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 mt-5">
        <AllRepositories />
      </div>
    </div>
  );
}
