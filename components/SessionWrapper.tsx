'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[var(--primary)] border-t-2 mx-auto"></div>
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/login');
  } else if (status === 'loading') {
    return <Loader />;
  } else return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

export default SessionWrapper;
