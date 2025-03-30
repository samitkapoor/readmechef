'use client';

import { ChefHat, LucideGithub } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import GradientButton from '@/components/ui/GradientButton';

export default function LoginPage() {
  const { status, data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/' + session?.user?.username);
    }
  }, [status, router]);

  const handleGitHubLogin = () => {
    signIn('github');
  };

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
          <div className="flex flex-col items-center justify-center z-10 p-14 md:p-18 md:px-22 rounded-3xl backdrop-blur-xl relative">
            <div className="w-full max-w-[800px] space-y-4">
              <div className="text-center flex flex-col items-center justify-center">
                <div className="relative mb-2">
                  <div className="h-[110px] w-[110px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border-[2px] border-white/20 relative shadow-lg">
                    <ChefHat size={50} className="drop-shadow-lg text-primary" />
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                  <span className="text-white">ReadmeChef</span>
                </h1>
                <p className="text-white/90 mb-1">
                  Let AI cook the perfect README for your repositories
                </p>
              </div>

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
