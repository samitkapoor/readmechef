import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { SessionProvider } from '@/components/SessionProvider';
import JsonLd from '@/components/JsonLd';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: 'ReadmeChef - Cook the Perfect README Every Single Time',
  description:
    'Generate comprehensive README files for your GitHub repositories with ReadmeChef. AI-powered documentation that saves time and improves project visibility.',
  icons: {
    icon: '/favicon.png'
  },
  keywords:
    'readme generator, github readme, project documentation, ai documentation, readme template, developer tools, software documentation, ai-powered documentation, markdown readme, readme best practices, readme examples, readme formatting',
  authors: [{ name: 'Samit Kapoor', url: 'https://github.com/samitkapoor' }],
  creator: 'Samit Kapoor',
  publisher: 'ReadmeChef',
  metadataBase: new URL('https://readmechef.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'ReadmeChef - Cook the Perfect README Every Single Time',
    description:
      'AI-powered README generator that helps you create professional documentation for your projects in minutes.',
    url: 'https://readmechef.com',
    siteName: 'ReadmeChef',
    images: [
      {
        url: 'https://readmechef.com/readmechef-poster.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeChef - AI-powered README generator'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReadmeChef - Cook the Perfect README Every Single Time',
    description:
      'AI-powered README generator that helps you create professional documentation for your projects in minutes.',
    creator: '@samitkapoorr',
    images: ['https://readmechef.com/readmechef-poster.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'google-site-verification-code' // Replace with actual code when available
  },
  category: 'technology'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d26a4d" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/readmechef-poster.png" fetchPriority="high" />
        <Analytics />
        {/* <script
          src="https://script.refix.ai/script.min.js"
          type="text/javascript"
          data-refix-token="21e99321-89fd-4286-9d23-1d9c70fabbd8"
          defer
          async
        ></script> */}
      </head>
      <body className={`${inter.className} antialiased m-0 p-0`}>
        <SessionProvider>
          <Navbar />
          {children}
          <JsonLd />
        </SessionProvider>
      </body>
    </html>
  );
}
