import CtaSection from '@/components/CtaSection';
import DemoSection from '@/components/DemoSection';
import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/ui/footer';
import WhyReadmeSection from '@/components/WhyReadmeSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReadmeChef - AI-Powered README Generator',
  description:
    'Create beautiful, comprehensive README files for your GitHub repositories in seconds with our AI-powered generator. Save time and improve your project documentation.',
  openGraph: {
    title: 'ReadmeChef - AI-Powered README Generator',
    description:
      'Create beautiful, comprehensive README files for your GitHub repositories in seconds with our AI-powered generator.',
    images: [
      {
        url: '/readmechef-logo.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeChef - AI-Powered README Generator'
      }
    ]
  }
};

export default function Home() {
  return (
    <>
      <main className="flex-1 flex-col flex items-center">
        <HeroSection />
        <FeaturesSection />
        <WhyReadmeSection />
        <DemoSection />
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
