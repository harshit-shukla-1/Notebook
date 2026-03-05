"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo = ({ className, size = 32 }: LogoProps) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Stylized 10-pointed Crown of the King of Lanka */}
        <path
          d="M10 80L15 40L25 55L35 30L45 50L50 20L55 50L65 30L75 55L85 40L90 80H10Z"
          fill="currentColor"
          className="text-amber-500"
        />
        <path
          d="M10 80V85H90V80H10Z"
          fill="currentColor"
          className="text-amber-600"
        />
        {/* Central Eye of Power/Wisdom */}
        <circle cx="50" cy="65" r="8" fill="white" fillOpacity="0.3" />
        <circle cx="50" cy="65" r="4" fill="white" />
      </svg>
    </div>
  );
};

export default Logo;