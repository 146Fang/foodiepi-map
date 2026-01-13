import React from 'react';

interface LogoProps {
  className?: string;
  color?: 'orange' | 'green';
  size?: number;
}

/**
 * FoodiePi Map Logo 组件
 * 包含厨师帽和地图标记的组合图标
 */
export function Logo({ className = '', color = 'orange', size = 40 }: LogoProps) {
  const fillColor = color === 'green' ? '#22c55e' : '#f97316'; // green-500 or orange-500
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 厨师帽 */}
      <path
        d="M50 10 L35 25 L30 30 L25 35 L20 40 L20 45 L25 50 L30 45 L35 40 L40 35 L45 30 L50 25 L55 30 L60 35 L65 40 L70 45 L75 50 L80 45 L80 40 L75 35 L70 30 L65 25 Z"
        fill={fillColor}
        stroke="white"
        strokeWidth="2"
      />
      
      {/* 地图标记主体 */}
      <path
        d="M50 50 L30 70 L30 85 L50 110 L70 85 L70 70 Z"
        fill={fillColor}
        stroke="white"
        strokeWidth="2"
      />
      
      {/* 餐具：筷子 */}
      <g transform="translate(35, 60)">
        <line x1="0" y1="0" x2="0" y2="15" stroke="white" strokeWidth="2" />
        <line x1="2" y1="0" x2="2" y2="15" stroke="white" strokeWidth="2" />
      </g>
      
      {/* 餐具：叉子 */}
      <g transform="translate(48, 60)">
        <line x1="0" y1="0" x2="0" y2="15" stroke="white" strokeWidth="2" />
        <line x1="-2" y1="5" x2="2" y2="5" stroke="white" strokeWidth="1.5" />
        <line x1="-2" y1="8" x2="2" y2="8" stroke="white" strokeWidth="1.5" />
        <line x1="-2" y1="11" x2="2" y2="11" stroke="white" strokeWidth="1.5" />
      </g>
      
      {/* 餐具：勺子 */}
      <g transform="translate(60, 60)">
        <ellipse cx="0" cy="8" rx="3" ry="4" fill="white" />
        <line x1="0" y1="12" x2="0" y2="15" stroke="white" strokeWidth="2" />
      </g>
    </svg>
  );
}
