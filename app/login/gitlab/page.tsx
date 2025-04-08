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

  const handleGitlabLogin = (scope: 'basic' | 'extended') => {
    signIn('gitlab', undefined, {
      scope: scope === 'basic' ? 'read_user read_api' : 'read_user read_api read_repository'
    });
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'b') {
      handleGitlabLogin('basic');
    } else if (event.key === 'e') {
      handleGitlabLogin('extended');
    }
  };

  return (
    <div
      ref={mainRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex min-h-screen flex-col items-center justify-center px-4 relative outline-none border-none"
    >
      <div
        style={{
          background: 'radial-gradient(circle at center, transparent, rgba(0, 0, 0, 0.5))'
        }}
        className="absolute inset-0 z-0"
      />
      <div
        style={{
          background:
            'radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.07), transparent 60%)'
        }}
        className="absolute inset-0 z-0 opacity-70"
      />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Basic Access Card */}
                <div className="flex flex-col p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 backdrop-blur-sm m-[6px]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#FC6D26]/10">
                      <Unlock className="w-5 h-5 text-[#FC6D26]" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Basic Access</h2>
                  </div>
                  <p className="text-white/70 text-sm mb-4">
                    Perfect for open-source projects. Generate READMEs for your public repositories
                    only.
                  </p>
                  <ul className="text-white/60 text-sm space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26]"></span>
                      Access to public repositories
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26]"></span>
                      Basic repository information
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26]"></span>
                      Limited repository access
                    </li>
                  </ul>
                  <GradientButton
                    onClick={() => handleGitlabLogin('basic')}
                    fullWidth
                    icon={<GitlabIcon className="w-5 h-5" />}
                    className="bg-gradient-to-r from-[#FC6D26] to-[#FC6D26]"
                  >
                    Connect with Basic Access
                  </GradientButton>
                  <HintText
                    textClassName="!text-[#FC6D2699]"
                    text={'Press B'}
                    className="ml-1 mt-1"
                  />
                </div>

                {/* Extended Access Card */}
                <div className="flex items-center justify-center p-1 border-2 border-orange-500/20 rounded-[20px]">
                  <div className="flex flex-col p-6 rounded-2xl bg-gradient-to-br from-black/60 via-orange-900/20 to-black/60 border border-[#FC6D26]/20 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FC6D26]/10 via-orange-900/5 to-[#FC6D26]/10 animate-gradient-x"></div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#FC6D26]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-900/10 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 border border-[#FC6D26]/5 rounded-2xl"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#FC6D26]/20 to-orange-900/20 ring-1 ring-[#FC6D26]/20">
                          <Lock className="w-5 h-5 text-[#FC6D26]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-semibold text-white">Extended Access</h2>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm mb-4">
                        Full access to generate READMEs for both public and private repositories.
                      </p>
                      <ul className="text-white/60 text-sm space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26] ring-1 ring-[#FC6D26]/30"></span>
                          Access to all repositories
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26] ring-1 ring-[#FC6D26]/30"></span>
                          Complete repository information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FC6D26] ring-1 ring-[#FC6D26]/30"></span>
                          Full repository access
                        </li>
                      </ul>
                      <button
                        onClick={() => handleGitlabLogin('extended')}
                        className="w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-black/20 via-orange-950 to-black/20 px-4 lg:px-6 py-3 text-white transition-all duration-300 font-medium cursor-pointer group relative overflow-hidden border-2 border-[#FC6D26]/20 hover:border-[#FC6D26]/40 shadow-lg shadow-[#FC6D26]/10"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#FC6D26]/0 via-white/10 to-[#FC6D26]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        <span className="relative z-10">
                          <GitlabIcon className="w-5 h-5" />
                        </span>
                        <span className="relative z-10 text-sm lg:text-base">
                          Connect with Extended Access
                        </span>
                      </button>
                      <HintText
                        textClassName="!text-[#FC6D2699]"
                        text={'Press E'}
                        className="ml-1 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
