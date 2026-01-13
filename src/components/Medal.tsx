import React from 'react';

interface MedalProps {
  rank: number;
  size?: number;
  className?: string;
}

/**
 * 勋章组件：显示金、银、铜勋章
 */
export function Medal({ rank, size = 24, className = '' }: MedalProps) {
  if (rank > 3) {
    return null;
  }

  const medalConfig = {
    1: {
      color: '#FFD700', // 金色
      name: 'Gold',
      gradient: 'from-yellow-400 to-yellow-600',
    },
    2: {
      color: '#C0C0C0', // 银色
      name: 'Silver',
      gradient: 'from-gray-300 to-gray-500',
    },
    3: {
      color: '#CD7F32', // 铜色
      name: 'Bronze',
      gradient: 'from-orange-400 to-orange-600',
    },
  };

  const config = medalConfig[rank as keyof typeof medalConfig];

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      title={`${config.name} Medal - Rank ${rank}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 勋章主体 */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill={config.color}
          stroke="#fff"
          strokeWidth="3"
        />
        {/* 数字 */}
        <text
          x="50"
          y="65"
          fontSize="40"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {rank}
        </text>
        {/* 高光效果 */}
        <ellipse
          cx="35"
          cy="35"
          rx="15"
          ry="20"
          fill="white"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
