'use client';

import AllRepositories from '@/components/AllRepositories';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(session)
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-slate-800">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {session?.user?.username || session?.user?.name || 'User'}!
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          This is your ReadmeChef dashboard. Here you can manage your README files and projects.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AllRepositories />
      </Suspense>
    </div>
  );
}
