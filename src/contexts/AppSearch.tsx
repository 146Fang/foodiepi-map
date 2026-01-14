'use client';
import React, { createContext, useContext, useState } from 'react';

interface AppSearchType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// 徹底改名為 AppSearchStore
export const AppSearchStore = createContext<AppSearchType | undefined>(undefined);

export function AppSearchProvider({ children, onSearch }: { children: React.ReactNode; onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const updateSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <AppSearchStore.Provider value={{ searchTerm, setSearchTerm: updateSearch }}>
      {children}
    </AppSearchStore.Provider>
  );
}

export const useAppSearch = () => {
  const context = useContext(AppSearchStore);
  if (!context) throw new Error('useAppSearch must be used within AppSearchProvider');
  return context;
};