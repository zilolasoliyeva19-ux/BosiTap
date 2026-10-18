/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export function Logo({ size = 'md', showWordmark = true }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7 text-sm', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-8 h-8 sm:w-9 sm:h-9 text-base', text: 'text-lg sm:text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-11 h-11 text-xl', text: 'text-2xl', sub: 'text-xs' },
  };

  const current = sizeClasses[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Simplified, Ultra-clean Minimalist Monogram Icon */}
      <div
        className={`${current.icon} rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-mono font-black flex items-center justify-center shrink-0 shadow-xs tracking-tighter`}
      >
        <span>B</span>
      </div>

      {/* Clean Typography Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-extrabold tracking-tight text-[#111111] dark:text-white ${current.text}`}>
              BosiTap
            </span>
          </div>
          <span className={`font-medium tracking-wide text-[#777777] dark:text-[#94A3B8] ${current.sub} mt-0.5`}>
            Coin Clicker
          </span>
        </div>
      )}
    </div>
  );
}
