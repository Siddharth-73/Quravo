"use client";

import React from 'react';

interface QuravoLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function QuravoLogo({
  className = '',
  iconClassName = '',
  textClassName = '',
  showText = true,
  size = 'md',
}: QuravoLogoProps) {
  const iconDimensions = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textDimensions = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Mark matching theme primary color */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions} ${iconClassName}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="40" height="40" rx="10" className="fill-primary" />
          <path
            d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C22.2536 30 24.331 29.2533 26 28L30 30L28 26C29.2533 24.331 30 22.2536 30 20C30 14.4772 25.5228 10 20 10Z"
            className="fill-primary-foreground opacity-95"
          />
          <path
            d="M20 14V26M14 20H26"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold tracking-tight text-foreground font-sans ${textDimensions} ${textClassName}`}>
          Quravo
        </span>
      )}
    </div>
  );
}
