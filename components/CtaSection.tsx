'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ShineButton from './ui/ShineButton';

const CtaSection = () => {
  const router = useRouter();

  return (
    <section className="w-full pt-[200px] flex flex-col items-center justify-center bg-primary/10">
      <div
        style={{
          backgroundColor: '#000000',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23198d49' fill-opacity='0.3'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
        className="py-36 mx-auto relative text-center flex flex-col items-center justify-center border-[1px] bg-background border-neutral-700 border-b-0 max-w-[1300px] w-full"
      >
        <div
          style={{
            background: 'radial-gradient(circle at center, transparent, black)'
          }}
          className="absolute inset-0 h-full w-full"
        />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 z-10">
          Ready to Cook Up Perfect READMEs?
        </h2>
        <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto z-10">
          Join the developers who save time and improve their projects with ReadMeChef.
        </p>

        <ShineButton
          onClick={() => router.push('/login')}
          className="flex justify-center bg-background text-primary z-10 font-medium px-8 py-4 rounded-md items-center gap-2 shadow-2xl shadow-white/10 hover:shadow-xl transition-all duration-300"
        >
          <p>Get Started for Free</p>
        </ShineButton>
      </div>
    </section>
  );
};

export default CtaSection;
