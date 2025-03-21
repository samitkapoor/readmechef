import GetStartedButton from '@/components/GetStartedButton';
import { ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="flex-1 flex items-center">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex justify-center">
              <div className="bg-[#d26a4d]/10 p-4 rounded-full border border-[#d26a4d]/20">
                <ChefHat className="h-16 w-16 text-[#d26a4d]" />
              </div>
            </div>

            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Cooking the Perfect <span className="text-[#d26a4d] mt-2">README</span>
                <span className="block text-[#ec1f1f] mt-2">Every Single Time</span>
              </h2>

              <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#eaeaea]/80">
                Stop ignoring your README files. ReadMeChef helps developers and organizations
                create beautiful, comprehensive documentation for their GitHub repositories in
                minutes.
              </p>
            </div>

            <div className="flex justify-center pt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#d26a4d] hover:bg-[#ec1f1f] text-[#eaeaea] rounded-md text-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="pt-12 flex justify-center">
              <div className="h-[1px] w-24 bg-[#d26a4d]/30"></div>
            </div>
          </div>
        </section>
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
