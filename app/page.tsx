'use client';

import React, { Suspense, lazy } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// Import critical sections directly
import HeroSection from '@/components/HeroSection';
import GridDivider from '@/components/ui/GridDivider';
import Footer from '@/components/ui/footer';

// Lazy load non-critical sections
const FeaturesSection = lazy(() => import('@/components/FeaturesSection'));
const DemoSection = lazy(() => import('@/components/DemoSection'));
const WhyReadmeSection = lazy(() => import('@/components/WhyReadmeSection'));
const CtaSection = lazy(() => import('@/components/CtaSection'));

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

  if (status === 'authenticated') {
    redirect('/' + session?.user?.username);
  }

  return (
    <>
      <main className="flex-col flex justify-center items-center overflow-x-hidden">
        {/* Critical path rendering - load immediately */}
        <HeroSection />
        <GridDivider enableBackground={false} />

        {/* Defer non-critical sections with Suspense */}
        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>

        <GridDivider />

        <Suspense fallback={<SectionLoader />}>
          <DemoSection />
        </Suspense>

        <GridDivider />

        <Suspense fallback={<SectionLoader />}>
          <WhyReadmeSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CtaSection />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
