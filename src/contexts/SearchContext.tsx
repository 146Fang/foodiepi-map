'use client';
import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// 這裡的名字我改成了 UniqueSearchStore，確保它不會再噴出 "SearchContext redefined"
export const UniqueSearchStore = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children, onSearch }: { children: React.ReactNode; onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const updateSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <UniqueSearchStore.Provider value={{ searchTerm, setSearchTerm: updateSearch }}>
      {children}
    </UniqueSearchStore.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(UniqueSearchStore);
  if (!context) throw new Error('useSearch must be used within a SearchProvider');
  return context;
};