'use client';

import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';

interface ClientLayoutProps {
  children: React.ReactNode;
  onSearch?: (searchTerm: string) => void;
}

export function ClientLayout({ children, onSearch }: ClientLayoutProps) {
  return (
    <>
      <Header onSearch={onSearch} />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNavigation />
    </>
  );
}
