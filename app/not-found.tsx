import Link from 'next/link';
import { Metadata } from 'next';
import { ChefHat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found | ReadmeChef',
  description: 'Sorry, the page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background">
      <div className="flex flex-col items-center text-center max-w-md">
        <ChefHat size={80} className="text-primary mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          Oops! Looks like this recipe doesn&apos;t exist. Try checking the URL or the ReadmeChef
          website.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-md font-medium transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
