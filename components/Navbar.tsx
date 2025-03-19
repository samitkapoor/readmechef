'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Github, LogOut } from 'lucide-react';

export default function Navbar() {
  const { status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="fixed top-0 z-50 w-full flex items-center justify-center h-[70px]">
      <div className="w-full backdrop-blur-md border-b-[1px] border-[var(--primary)]/20 shadow-lg shadow-white/5 mx-auto">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              <span className="text-[var(--primary)]">ReadMe</span>Chef
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-[var(--secondary)]/40 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--secondary)]/80 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut size={17} />
                  <p>Logout</p>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[var(--secondary)]/40 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--secondary)]/80 flex items-center gap-1"
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
