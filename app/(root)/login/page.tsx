'use client';

import { LucideGithub } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { status } = useSession();

  console.log(useSession());
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleGitHubLogin = () => {
    signIn('github', { callbackUrl: '/dashboard' });
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 relative">
      <div
        style={{
          background: 'radial-gradient(circle at center, transparent, rgba(0, 0, 0, 0.5))'
        }}
        className="absolute inset-0 z-0"
      />
      <div
        style={{
          background:
            'radial-gradient(circle at center, transparent 20%, rgba(255, 0, 0, 0.1), transparent 60%)'
        }}
        className="absolute inset-0 z-0 opacity-70"
      />
      <div className="z-10 relative">
        <div className="h-full w-full overflow-hidden p-[5px] rounded-2xl border-[5px] border-neutral-900 ">
          <div
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)'
            }}
            className="flex flex-col items-center justify-center z-10 bg-black/30 p-12 md:p-16 rounded-lg backdrop-blur-md border border-white/30"
          >
            <div className="w-full max-w-[320px] space-y-8">
              <div className="text-center flex flex-col items-center justify-center">
                <Image src="/icon.png" alt="Logo" width={100} height={100} />
                <h1 className="text-4xl font-bold text-white tracking-tight bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                  Welcome
                </h1>
                <p className="text-yellow-100/80 text-sm font-semibold max-w-[240px]">
                  Sign in to let me cook the perfect README
                </p>
              </div>

              <button
                onClick={handleGitHubLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-3 text-white hover:bg-[var(--primary)]/90 transition-all duration-200 shadow-lg shadow-amber-900/20 font-medium cursor-pointer"
              >
                <LucideGithub className="w-5 h-5" />
                Login with GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
