'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Github, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const { status, data: session } = useSession();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const actionButtons = [
    {
      name: 'Connect',
      logo: '/contacts/twitter.png',
      link: 'https://x.com/samitkapoorr'
    },
    {
      name: 'Support',
      link: 'https://buymeacoffee.com/samitkapoow',
      logo: '/contacts/buymeacoffee.svg'
    }
  ];

  return (
    <header className="fixed top-0 z-50 flex items-center justify-center h-[100px] w-screen bg-gradient-to-b from-black to-transparent">
      <div className="w-screen">
        <div className="flex h-16 items-center justify-between sm:px-20 mx-6">
          <Link
            href={status === 'authenticated' ? '/' + session?.user?.username : '/'}
            className="flex items-center gap-2"
          >
            <Image src="/readmechef-logo.png" alt="ReadmeChef Logo" width={32} height={32} />
            <span className="text-xl font-bold text-white">
              <span className="text-primary">ReadMe</span>Chef
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {actionButtons.map((button) => (
              <Link
                href={button.link}
                key={button.name}
                className="text-white hover:text-primary border-b-[1px] border-transparent hover:border-primary bg-opacity-40 text-xs md:text-sm font-medium transition-colors hover:bg-opacity-80 flex items-center gap-1"
              >
                <Image src={button.logo} alt={button.name} width={17} height={17} />
                <p>{button.name}</p>
              </Link>
            ))}
            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="text-primary border-b-[1px] border-transparent hover:border-primary bg-opacity-40 text-xs md:text-sm font-medium transition-colors hover:bg-opacity-80 flex items-center gap-1"
                >
                  <LogOut size={17} />
                  <p>Logout</p>
                </button>
              </div>
            ) : (
              pathname !== '/login' && (
                <Link
                  href="/login"
                  className="text-primary border-b-[1px] border-transparent hover:border-primary bg-opacity-40 text-xs md:text-sm font-medium transition-colors hover:bg-opacity-80 flex items-center gap-1"
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
