import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { SessionProvider } from '@/components/SessionProvider';
import JsonLd from '@/components/JsonLd';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'ReadmeChef - Cook the Perfect README Every Time',
  description:
    'Generate beautiful, comprehensive README files for your GitHub repositories with ReadmeChef. AI-powered documentation that saves time and improves project visibility.',
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
    title: 'ReadmeChef - Cook the Perfect README Every Time',
    description:
      'AI-powered README generator that helps you create professional documentation for your projects in minutes.',
    url: 'https://readmechef.com',
    siteName: 'ReadmeChef',
    images: [
      {
        url: '/readmechef-logo.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeChef Logo'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReadmeChef - Cook the Perfect README Every Time',
    description:
      'AI-powered README generator that helps you create professional documentation for your projects in minutes.',
    creator: '@samitkapoorr',
    images: ['/readmechef-logo.png']
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
        <script
          src="https://script.refix.ai/script.min.js"
          type="text/javascript"
          data-refix-token="21e99321-89fd-4286-9d23-1d9c70fabbd8"
          defer
        ></script>
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
