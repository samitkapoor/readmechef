'use client';

import { LucideGithub, Gitlab } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const LoginButton = ({
  onClick,
  icon: Icon,
  text,
  color = 'primary'
}: {
  onClick: () => void;
  icon: any;
  text: string;
  color?: 'primary' | 'gitlab';
}) => (
  <div
    className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer"
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

  return (
    <div
      ref={mainRef}
      tabIndex={0}
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

              <div className="flex flex-col gap-4 w-full">
                <LoginButton
                  onClick={handleGitHubLogin}
                  icon={LucideGithub}
                  text="Continue with GitHub"
                />
                <LoginButton
                  onClick={handleGitLabLogin}
                  icon={Gitlab}
                  text="Continue with GitLab"
                  color="gitlab"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
