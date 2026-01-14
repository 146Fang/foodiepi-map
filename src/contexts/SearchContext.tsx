'use client';

import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// 1. 將 Context 本身改名為 SearchLibContext，避免跟組件名稱衝突
export const SearchLibContext = createContext<SearchContextType | undefined>(undefined);

// 2. 這是 Provider 組件
export function SearchProvider({ children, onSearch }: { children: React.ReactNode; onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <SearchLibContext.Provider value={{ searchTerm, setSearchTerm: handleUpdateSearch }}>
      {children}
    </SearchLibContext.Provider>
  );
}

// 3. 這是 Hook
export const useSearch = () => {
  const context = useContext(SearchLibContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};