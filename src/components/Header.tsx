'use client';

import { useState, useContext } from 'react';
import { Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { AppSearchContext } from '@/contexts/AppSearch';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const searchContext = useContext(AppSearchContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 優先順序：Props 傳入的 > Context 提供的
    const finalOnSearch = onSearch || searchContext?.onSearch;
    if (finalOnSearch) {
      finalOnSearch(searchTerm);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo />
        <form onSubmit={handleSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder') || 'Search...'}
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