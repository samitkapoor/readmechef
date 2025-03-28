'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ChefHat, Github, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { status } = useSession();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="fixed top-0 z-50 flex items-center justify-center h-[70px] w-screen">
      <div className="w-screen backdrop-blur-md shadow-lg shadow-white/[0.02]">
        <div className="flex h-16 items-center justify-between px-4 mx-6">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat size={24} />
            <span className="text-xl font-bold text-white">
              <span className="text-primary">ReadMe</span>Chef
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-primary hover:bg-secondary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-opacity-80 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut size={17} />
                  <p>Logout</p>
                </button>
              </div>
            ) : (
              pathname !== '/login' && (
                <Link
                  href="/login"
                  className="rounded-full bg-secondary bg-opacity-40 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-opacity-80 flex items-center gap-1"
                >
                  <Github size={17} />
                  <p>Login</p>
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
