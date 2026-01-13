'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Utensils, ExternalLink } from 'lucide-react';
import { Restaurant } from '@/services/restaurantService';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 餐厅照片 */}
      {restaurant.photos && restaurant.photos.length > 0 && (
        <div className="relative w-full h-48">
          <Image
            src={restaurant.photos[0]}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
          />
        </div>
      )}

      {/* 餐厅信息 */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {restaurant.name}
        </h3>

        {/* 地址 */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">{restaurant.address}</p>
        </div>

        {/* 餐饮品相 */}
        {restaurant.dishes && restaurant.dishes.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">餐饮品相</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {restaurant.dishes.map((dish, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {dish}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 多张照片预览 */}
        {restaurant.photos && restaurant.photos.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {restaurant.photos.slice(1, 4).map((photo, index) => (
              <div key={index} className="relative w-16 h-16 flex-shrink-0 rounded">
                <Image
                  src={photo}
                  alt={`${restaurant.name} photo ${index + 2}`}
                  fill
                  className="object-cover rounded"
                  sizes="64px"
                />
              </div>
            ))}
          </div>
        )}

        {/* 链接到餐厅仪表板 */}
        {restaurant.id && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href={`/restaurant-dashboard/${restaurant.id}`}
              className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View Dashboard
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
