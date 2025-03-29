'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function GetStartedButton() {
  const { status } = useSession();

  const href = status === 'authenticated' ? '/dashboard' : '/login';

  return (
    <Link
      href={href}
      className="rounded-full bg-amber-500 px-8 py-3 text-white font-medium hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors"
    >
      Get Started
    </Link>
  );
}
