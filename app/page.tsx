'use client';

import CtaSection from '@/components/CtaSection';
import DemoSection from '@/components/DemoSection';
import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/ui/footer';
import GridDivider from '@/components/ui/GridDivider';
import WhyReadmeSection from '@/components/WhyReadmeSection';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    redirect('/' + session?.user?.username);
  }

  return (
    <>
      <main className="flex-col flex justify-center items-center overflow-x-hidden">
        <HeroSection />
        <GridDivider enableBackground={false} />
        <FeaturesSection />
        <GridDivider />
        <DemoSection />
        <GridDivider>
          {/* <div className="flex flex-col items-center justify-center p-6 rounded-xl">
            <div className="p-3 bg-primary/10 rounded-full mb-3">
              <Info className="text-primary w-8 h-8" />
            </div>
            <p className="font-semibold text-primary mb-2">Did you know?</p>
            <p className="font-medium text-white/90 leading-tight text-center max-w-2xl">
              Projects with well-written READMEs receive{' '}
              <span className="text-primary font-bold">80% more stars</span> and{' '}
              <span className="text-primary font-bold">65% more contributions</span> on GitHub than
              those without.
            </p>
            <p className="mt-2 text-sm text-white/80 text-center">
              ReadmeChef helps you join the top 10% of repositories with exceptional documentation.
            </p>
          </div> */}
        </GridDivider>
        <WhyReadmeSection />
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
