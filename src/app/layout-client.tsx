'use client';

import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';

interface LayoutClientProps {
  children: React.ReactNode;
  onSearch?: (searchTerm: string) => void;
}

export function LayoutClient({ children, onSearch }: LayoutClientProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={onSearch} />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNavigation />
    </div>
  );
}
