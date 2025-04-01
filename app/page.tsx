'use client';

import CtaSection from '@/components/CtaSection';
import DemoSection from '@/components/DemoSection';
import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/ui/footer';
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
      <main className="flex-1 flex-col flex items-center overflow-x-hidden">
        <HeroSection />
        <DemoSection />
        <FeaturesSection />
        <WhyReadmeSection />
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
