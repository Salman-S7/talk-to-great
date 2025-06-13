import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Talk to History - Converse with Historical Figures',
  description: 'Have meaningful conversations with history\'s most influential figures through AI-powered chat. Learn from the greatest minds that shaped our world.',
  keywords: 'history, AI, chat, historical figures, education, conversation',
  authors: [{ name: 'Talk to History Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}