'use client';

import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// 1. 這裡的名字改成 GlobalSearchData，避免跟檔案名稱或 Provider 撞名
export const GlobalSearchData = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children, onSearch }: { children: React.ReactNode; onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdate = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <GlobalSearchData.Provider value={{ searchTerm, setSearchTerm: handleUpdate }}>
      {children}
    </GlobalSearchData.Provider>
  );
}

// 2. 提供一個簡單的 Hook 給別的檔案用
export const useSearch = () => {
  const context = useContext(GlobalSearchData);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};