import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 40 }: LogoProps) {
  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagone avec gradient */}
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>
        
        {/* Hexagone */}
        <path
          d="M30 5L50 15V35L30 50L10 35V15L30 5Z"
          fill="url(#hexGradient)"
          stroke="none"
        />
        
        {/* Lettre E en vert */}
        <path
          d="M22 20H38V24H22V20ZM22 28H38V32H22V28ZM22 36H32V40H22V36Z"
          fill="#10B981"
        />
      </svg>
    </div>
  );
}

