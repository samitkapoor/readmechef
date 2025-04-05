'use client';

import React, { KeyboardEventHandler, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import critical sections directly
import HeroSection from '@/components/HeroSection';
import GridDivider from '@/components/ui/GridDivider';
import Footer from '@/components/ui/footer';

// Lazy load non-critical sections with better chunk naming
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), {
  loading: () => <SectionLoader />,
  ssr: true
});

const DemoSection = dynamic(() => import('@/components/DemoSection'), {
  loading: () => <SectionLoader />,
  ssr: false // Don't SSR the video component
});

const WhyReadmeSection = dynamic(() => import('@/components/WhyReadmeSection'), {
  loading: () => <SectionLoader />,
  ssr: true
});

const CtaSection = dynamic(() => import('@/components/CtaSection'), {
  loading: () => <SectionLoader />,
  ssr: true
});

// Simple loading components for each section
const SectionLoader = () => (
  <div className="w-full h-[500px] flex items-center justify-center">
    <div className="animate-pulse space-y-8 w-full max-w-4xl">
      <div className="h-8 bg-neutral-800 rounded w-1/2 mx-auto"></div>
      <div className="h-64 bg-neutral-800 rounded w-full"></div>
    </div>
  </div>
);

export default function Home() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  if (status === 'authenticated') {
    redirect('/' + session?.user?.username);
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'g') {
      router.push('/login');
    }
  };

  return (
    <>
      <main
        ref={mainRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex-col flex justify-center items-center overflow-x-hidden outline-none border-none"
      >
        {/* Critical path rendering - load immediately */}
        <HeroSection />
        <GridDivider enableBackground={false} />

        {/* Features can load early since it doesn't have heavy assets */}
        <FeaturesSection />

        <GridDivider />

        {/* Demo section with video loads without SSR */}
        <DemoSection />

        <GridDivider />

        {/* Lower priority sections */}
        <WhyReadmeSection />
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
