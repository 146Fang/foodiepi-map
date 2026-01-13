'use client';

import { MapPin, UtensilsCrossed, LayoutDashboard, BookOpen } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNavigation() {
  const { t } = useLocale();
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: MapPin,
      label: t('nav.map'),
    },
    {
      href: '/recommend',
      icon: UtensilsCrossed,
      label: t('nav.restaurants'),
    },
    {
      href: '/tutorial',
      icon: BookOpen,
      label: t('nav.tutorial'),
    },
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: t('nav.dashboard'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20 safe-area-inset-bottom">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-around py-2 md:py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 md:px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-white bg-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
