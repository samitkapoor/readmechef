'use client';

import { LucideGithub } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import GradientButton from '@/components/ui/GradientButton';

export default function LoginPage() {
  const { status } = useSession();

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
            'radial-gradient(circle at center, transparent 20%, rgba(255, 0, 0, 0.13), transparent 60%)'
        }}
        className="absolute inset-0 z-0 opacity-70"
      />
      <div className="z-10 relative">
        <div className="h-full w-full overflow-hidden rounded-3xl">
          {/* Card glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-3xl blur-md opacity-70"></div>

          <div className="flex flex-col items-center justify-center z-10 bg-black/60 p-14 md:p-18 md:px-22 rounded-3xl backdrop-blur-xl border-[4px] border-white/10 relative">
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-secondary/5 via-transparent to-secondary/5 pointer-events-none"></div>
            <div className="w-full max-w-[400px] space-y-12">
              {/* Logo and heading */}
              <div className="text-center flex flex-col items-center justify-center">
                <div className="relative mb-2">
                  <div className="h-[110px] w-[110px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border border-white/10 relative shadow-lg">
                    <Image
                      src="/icon.png"
                      alt="Logo"
                      width={88}
                      height={88}
                      className="drop-shadow-lg"
                    />
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-white tracking-tight mt-5 mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    ReadmeChef
                  </span>
                </h1>
                <p className="text-white/70 text-sm max-w-[260px] mb-1">
                  Sign in to let me cook the perfect README for your repositories
                </p>
              </div>

              {/* Login button with hover effect */}
              <GradientButton
                onClick={handleGitHubLogin}
                fullWidth
                icon={<LucideGithub className="w-5 h-5" />}
              >
                Connect with GitHub
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
