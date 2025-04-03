'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ShineButton from './ui/ShineButton';
import MatrixCell from './ui/MatrixCell';

const CtaSection = () => {
  const router = useRouter();

  return (
    <section className="w-full pt-[200px] flex flex-col items-center justify-center bg-primary/10">
      <div className="py-36 mx-auto relative text-center flex flex-col items-center justify-center border-[1px] bg-background border-neutral-700 border-b-0 max-w-[1300px] w-full">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <MatrixCell beamsPerCell={30} />
        </div>
        <div
          style={{
            background: 'radial-gradient(circle at center, transparent, black)'
          }}
          className="absolute inset-0 h-full w-full"
        />
        <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 z-10">
          Ready to Cook Up Perfect READMEs?
        </h2>
        <p className="sm:text-xl text-white/90 mb-12 max-w-3xl mx-auto z-10">
          Join the developers who save time and improve their projects with ReadMeChef.
        </p>

        <ShineButton
          onClick={() => router.push('/login')}
          className="flex justify-center bg-background text-primary z-10 font-medium px-8 py-4 rounded-md items-center gap-2 transition-all duration-300"
        >
          <p>Get Started for Free</p>
        </ShineButton>
      </div>
    </section>
  );
};

export default CtaSection;
