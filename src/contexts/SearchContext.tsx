'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (term: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children, onSearch }: { children: React.ReactNode; onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    onSearch(term);
  }, [onSearch]);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, onSearch: handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
