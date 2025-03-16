'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Github } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="fixed top-5 z-50 w-full flex items-center justify-center">
      <div className="max-w-7xl w-full backdrop-blur-md bg-[var(--background)]/50 border border-[#FFFFFF27] mx-auto rounded-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              <span className="text-[var(--primary)]">ReadMe</span>Chef
            </span>
          </Link>

          <nav className="flex items-center gap-6">
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
                  className="text-sm font-medium text-gray-300 hover:text-amber-400"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/80 flex items-center gap-1"
              >
                <Github size={17} />
                <p>Login</p>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
