'use client';

import { useState, useEffect } from 'react';
import { PiAuthProvider } from '@/components/PiAuthProvider';
import { usePiAuth } from '@/hooks/usePiAuth';
import { RestaurantMap } from '@/components/RestaurantMap';
import { Restaurant } from '@/services/restaurantService';
import { getAllRestaurants, searchRestaurants } from '@/services/restaurantService';
import { <NewSearchProvider> } from '@/contexts/MyNewSearch';

export default function Home() {
  return (
    <PiAuthProvider autoAuth={true}>
      <HomeContent />
    </PiAuthProvider>
  );
}

function HomeContent() {
  const { user } = usePiAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    try {
      const results = await searchRestaurants(searchTerm);
      setFilteredRestaurants(results);
    } catch (error) {
      console.error('Search failed:', error);
      // 搜索失败时显示所有餐厅
      setFilteredRestaurants(restaurants);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

  return (
    <SearchProvider onSearch={handleSearch}>
      <div className="w-full h-[calc(100vh-200px)] relative">
        <RestaurantMap
          restaurants={filteredRestaurants}
          onMarkerClick={(restaurant) => {
            console.log('Restaurant clicked:', restaurant);
          }}
        />
      </div>
    </SearchProvider>
  );
}
