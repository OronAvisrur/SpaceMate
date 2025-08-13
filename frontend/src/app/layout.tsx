// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpaceMate - Your Creative Space',
  description: 'A modern, colorful platform for creative collaboration and project management.',
  keywords: ['collaboration', 'project management', 'creative', 'team'],
  authors: [{ name: 'SpaceMate Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased bg-gray-50`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}