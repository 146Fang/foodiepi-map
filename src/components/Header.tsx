'use client';

import { useState, useContext } from 'react';
import { Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
// 這裡確保導入名稱與下方 useContext 一致
import { AppSearchContext } from '@/contexts/AppSearch';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

// ... 前方的導入部分保持不變

export function Header({ onSearch }: HeaderProps) {
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 核心修正：將 SearchContext 改為 AppSearchContext
  const searchContext = useContext(AppSearchContext); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 安全地取得搜尋處理函式
    const finalOnSearch = onSearch || searchContext?.onSearch;
    
    if (finalOnSearch) {
      finalOnSearch(searchTerm);
    }
  };

  // ... 後方的 return 部分保持不變

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo />
        
        <form onSubmit={handleSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder') || 'Search restaurants...'}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </form>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}