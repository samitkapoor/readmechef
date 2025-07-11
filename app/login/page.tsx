'use client';

import { LucideGithub, Gitlab, LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

import HintText from '@/components/ui/HintText';

const LoginButton = ({
  onClick,
  icon: Icon,
  text,
  color = 'primary'
}: {
  onClick: () => void;
  icon: LucideIcon;
  text: string;
  color?: 'primary' | 'gitlab';
}) => (
  <div
    className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer mt-2"
    onClick={onClick}
  >
    <div
      className={`p-2 rounded-lg ${color === 'gitlab' ? 'bg-[#FC6D26]/10' : 'bg-primary/10'} mr-3`}
    >
      <Icon className={`w-5 h-5 ${color === 'gitlab' ? 'text-[#FC6D26]' : 'text-primary'}`} />
    </div>
    <h2 className="text-lg font-semibold text-white">{text}</h2>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  const handleGitHubLogin = () => {
    router.push('/login/github');
  };

  const handleGitLabLogin = () => {
    router.push('/login/gitlab');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'g') {
      handleGitHubLogin();
    } else if (event.key === 'l') {
      handleGitLabLogin();
    }
  };

  return (
    <div
      ref={mainRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex min-h-screen flex-col items-center justify-center px-4 relative outline-none border-none"
    >
      <div className="z-10 relative">
        <div className="h-full w-full overflow-hidden rounded-3xl">
          <div className="flex flex-col items-center justify-center z-10 p-2 md:p-18 md:px-22 rounded-3xl backdrop-blur-xl relative">
            <div className="w-full space-y-4 mb-36">
              <div className="text-center flex flex-col items-center justify-center mt-36 md:mt-20 lg:mt-10">
                <div className="relative mb-2">
                  <div className="h-[110px] w-[110px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border-[2px] border-white/20 relative shadow-lg">
                    <Image
                      src="/readmechef-logo.png"
                      alt="ReadmeChef Logo"
                      width={64}
                      height={64}
                    />
                  </div>
                </div>

                <p className="text-4xl font-bold text-white tracking-tight mb-2">
                  <span className="text-white">ReadmeChef</span>
                </p>
                <p className="text-white/90 mb-6">
                  Let AI cook the perfect README for your repositories
                </p>
              </div>

              <div className="flex flex-col w-full">
                <LoginButton
                  onClick={handleGitHubLogin}
                  icon={LucideGithub}
                  text="Continue with GitHub"
                />
                <HintText text="Press G" className="ml-2 mt-1" />
                <LoginButton
                  onClick={handleGitLabLogin}
                  icon={Gitlab}
                  text="Continue with GitLab"
                  color="gitlab"
                />
                <HintText text="Press L" className="ml-2 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
