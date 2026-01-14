'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header'; 
import { AppSearchProvider } from '@/contexts/AppSearch'; 
import { RestaurantMap } from '@/components/RestaurantMap'; 
import { getAllRestaurants, searchRestaurants, Restaurant } from '@/services/restaurantService';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // 修正 1：處理初始數據加載
  useEffect(() => {
    const loadData = async () => {
      const data = await getAllRestaurants();
      setRestaurants(data);
    };
    loadData();
  }, []);

  // 修正 2：處理搜尋邏輯（這就是解決第 25 行報錯的關鍵）
  const handleSearch = async (term: string) => {
    // 加上 await，確保先拿到「結果」，再存入「State」
    const results = await searchRestaurants(term);
    setRestaurants(results);
  };

  return (
    <AppSearchProvider onSearch={handleSearch}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 relative">
          <RestaurantMap restaurants={restaurants} />
        </main>
      </div>
    </AppSearchProvider>
  );
}