import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FirebaseErrorBoundary } from '@/components/FirebaseErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FoodiePi Map - Web3 Restaurant Discovery',
  description: 'Discover amazing restaurants powered by Web3. Earn rewards, make payments with Pi Network, and explore the foodie community.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#9333ea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseErrorBoundary>
          <LocaleProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pb-20">
                {children}
              </main>
              <BottomNavigation />
            </div>
          </LocaleProvider>
        </FirebaseErrorBoundary>
      </body>
    </html>
  );
}
