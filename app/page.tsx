import DemoSection from '@/components/DemoSection';
import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="flex-1 flex-col flex items-center">
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[#161b22]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <p className="text-sm text-[#eaeaea]/60">Cooking the perfect README every time</p>
            </div>

            <div className="flex gap-6">
              <Link
                href="#"
                className="text-[#eaeaea]/60 hover:text-[#d26a4d] transition-colors text-sm"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-[#eaeaea]/60 hover:text-[#d26a4d] transition-colors text-sm"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-[#eaeaea]/60 hover:text-[#d26a4d] transition-colors text-sm"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-[#eaeaea]/40 text-xs">
            © 2025 ReadMeChef. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
