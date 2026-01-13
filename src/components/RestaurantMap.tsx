'use client';

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Restaurant } from '@/services/restaurantService';
import { RestaurantCard } from './RestaurantCard';
import { Logo } from './Logo';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (restaurant: Restaurant) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 25.0330, // 台北市默认坐标
  lng: 121.5654,
};

const defaultZoom = 13;

export function RestaurantMap({
  restaurants,
  center = defaultCenter,
  onMarkerClick,
}: RestaurantMapProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    if (onMarkerClick) {
      onMarkerClick(restaurant);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedRestaurant(null);
  };

  // 创建自定义标记图标（绿色 Logo）
  const customMarkerIcon = useMemo(() => {
    if (typeof window === 'undefined' || !window.google) {
      return undefined;
    }
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="40" height="48" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L35 25 L30 30 L25 35 L20 40 L20 45 L25 50 L30 45 L35 40 L40 35 L45 30 L50 25 L55 30 L60 35 L65 40 L70 45 L75 50 L80 45 L80 40 L75 35 L70 30 L65 25 Z" fill="#22c55e" stroke="white" stroke-width="2"/>
          <path d="M50 50 L30 70 L30 85 L50 110 L70 85 L70 70 Z" fill="#22c55e" stroke="white" stroke-width="2"/>
          <g transform="translate(35, 60)">
            <line x1="0" y1="0" x2="0" y2="15" stroke="white" stroke-width="2"/>
            <line x1="2" y1="0" x2="2" y2="15" stroke="white" stroke-width="2"/>
          </g>
          <g transform="translate(48, 60)">
            <line x1="0" y1="0" x2="0" y2="15" stroke="white" stroke-width="2"/>
            <line x1="-2" y1="5" x2="2" y2="5" stroke="white" stroke-width="1.5"/>
            <line x1="-2" y1="8" x2="2" y2="8" stroke="white" stroke-width="1.5"/>
            <line x1="-2" y1="11" x2="2" y2="11" stroke="white" stroke-width="1.5"/>
          </g>
          <g transform="translate(60, 60)">
            <ellipse cx="0" cy="8" rx="3" ry="4" fill="white"/>
            <line x1="0" y1="12" x2="0" y2="15" stroke="white" stroke-width="2"/>
          </g>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(40, 48),
      anchor: new window.google.maps.Point(20, 48),
    };
  }, []);

  // 检查 API Key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-lg">
        <div className="text-center text-white p-8">
          <p className="text-lg font-semibold mb-2">Google Maps API Key Missing</p>
          <p className="text-sm text-white/70">
            Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{
                lat: restaurant.latitude,
                lng: restaurant.longitude,
              }}
              icon={customMarkerIcon}
              onClick={() => handleMarkerClick(restaurant)}
            />
          ))}

          {selectedRestaurant && (
            <InfoWindow
              position={{
                lat: selectedRestaurant.latitude,
                lng: selectedRestaurant.longitude,
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="w-64">
                <RestaurantCard restaurant={selectedRestaurant} />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
