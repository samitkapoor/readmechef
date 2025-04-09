'use client';

import { GitlabIcon, Lock, Unlock } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { KeyboardEventHandler, useEffect, useRef } from 'react';
import GradientButton from '@/components/ui/GradientButton';
import HintText from '@/components/ui/HintText';

export default function GitlabLogin() {
  const { status, data: session } = useSession();

  const mainRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/' + session?.user?.username);
    }
  }, [status, router]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  const handleGitlabLogin = () => {
    signIn('gitlab', undefined, {
      scope: 'read_user read_api'
    });
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'a') {
      handleGitlabLogin();
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
          <div className="flex flex-col items-center justify-center z-10 p-2 md:p-18 md:px-22 rounded-3xl relative">
            <div className="w-full max-w-[800px] space-y-4 mb-36">
              <div className="text-center flex flex-col items-center justify-center mt-36 md:mt-20 lg:mt-10">
                <div className="relative mb-2">
                  <div className="h-[110px] w-[110px] bg-gradient-to-br from-[#FC6D26]/10 to-[#FC6D26]/30 rounded-full flex items-center justify-center border-[2px] border-[#FC6D26]/50 relative shadow-lg">
                    <GitlabIcon className="w-16 h-16 text-[#FC6D26]" />
                  </div>
                </div>

                <p className="text-2xl font-bold text-[#FC6D26] tracking-tight mb-2">GitLab</p>
              </div>

              <div className="flex items-center justify-center gap-6 w-full">
                <div className="flex flex-col p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 backdrop-blur-sm m-[6px] max-w-[400px]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#FC6D26]/10">
                      <Unlock className="w-5 h-5 text-[#FC6D26]" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Connect Your GitLab Account
                    </h2>
                  </div>
                  <p className="text-white/70 text-sm mb-4">
                    ReadMeChef needs access to your GitLab repositories to analyze your code and
                    generate professional READMEs automatically.
                  </p>
                  <div className="mb-0">
                    <h3 className="text-white/80 text-sm font-medium mb-2">
                      What you're authorizing:
                    </h3>
                    <ul className="text-white/60 text-sm space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26]"></span>
                        <span>
                          <span className="font-medium">Read-only access</span> to your repositories
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26]"></span>
                        <span>
                          <span className="font-medium">Repository metadata</span> (name,
                          description, topics)
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26]"></span>
                        <span>
                          <span className="font-medium">README generation</span> based on your code
                        </span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-white/50 text-xs mb-4">
                    We only request the minimum permissions needed to generate your READMEs. Your
                    code and data remain secure.
                  </p>
                  <GradientButton
                    onClick={() => handleGitlabLogin()}
                    fullWidth
                    icon={<GitlabIcon className="w-5 h-5" />}
                    className="bg-gradient-to-r from-[#FC6D26] to-[#FC6D26]"
                  >
                    Connect GitLab Account
                  </GradientButton>
                  <HintText
                    textClassName="!text-[#FC6D2699]"
                    text={'Press A to connect'}
                    className="ml-1 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
