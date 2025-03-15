'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 dark:border-white/10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            <span className="text-amber-500">Readme</span>Chef
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/subscribe"
            className="text-sm font-medium text-gray-700 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400"
          >
            Subscribe
          </Link>
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              {session.user?.image && (
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                  />
                </div>
              )}
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 dark:hover:bg-amber-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 dark:hover:bg-amber-400"
            >
              Login with GitHub
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
