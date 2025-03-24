import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'ReadmeChef - Cook the Perfect README Every Time',
  description:
    'Generate beautiful, comprehensive README files for your GitHub repositories with ReadmeChef'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
        </SessionProvider>
      </body>
    </html>
  );
}
