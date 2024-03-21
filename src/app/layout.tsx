import React from 'react';
import { validateRequest } from '@/lib/auth';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SessionProvider from '@/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js 14 Auth with Lucia',
  description:
    'A Next.js 14 Authentication App with Lucia Auth, Mongoose & MongoDB Adapter',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await validateRequest();

  return (
    <html lang='en'>
      <body className={inter.className}>
        <SessionProvider value={sessionData}>{children}</SessionProvider>

        <Toaster />
      </body>
    </html>
  );
}
