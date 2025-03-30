import CtaSection from '@/components/CtaSection';
import DemoSection from '@/components/DemoSection';
import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/ui/footer';
import WhyReadmeSection from '@/components/WhyReadmeSection';

export default function Home() {
  return (
    <>
      <main className="flex-1 flex-col flex items-center">
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <WhyReadmeSection />
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
