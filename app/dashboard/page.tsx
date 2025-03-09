'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-slate-800">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {session?.user?.name || 'User'}!
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          This is your ReadmeChef dashboard. Here you can manage your README files and projects.
        </p>
      </div>

      {/* Dashboard content will go here */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </div>
  );
}
