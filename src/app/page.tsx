'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header'; 
import { AppSearchProvider } from '@/contexts/AppSearch'; 
import { RestaurantMap } from '@/components/RestaurantMap'; 
import { getAllRestaurants, searchRestaurants, Restaurant } from '@/services/restaurantService';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getAllRestaurants();
      setRestaurants(data);
    };
    loadData();
  }, []);

  // 這裡加上 async 與 await 是解決報錯的關鍵
  const handleSearch = async (term: string) => {
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