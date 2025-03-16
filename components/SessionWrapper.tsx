'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
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
