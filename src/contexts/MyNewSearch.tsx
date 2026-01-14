'use client';
import React, { createContext, useContext, useState } from 'react';

interface SearchDataType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// 徹底改名，絕不重複
export const NewSearchContextData = createContext<SearchDataType | undefined>(undefined);

export function NewSearchProvider({ children, onSearch }: { children: React.ReactNode; onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const handleUpdate = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <NewSearchContextData.Provider value={{ searchTerm, setSearchTerm: handleUpdate }}>
      {children}
    </NewSearchContextData.Provider>
  );
}

export const useMySearch = () => {
  const context = useContext(NewSearchContextData);
  if (!context) throw new Error('useMySearch must be used within NewSearchProvider');
  return context;
};