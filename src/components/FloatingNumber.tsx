/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FloatingTextItem } from '../types/game';

interface FloatingNumberProps {
  items: FloatingTextItem[];
}

export function FloatingNumbersOverlay({ items }: FloatingNumberProps) {
  if (items.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute transform -translate-x-1/2 will-change-transform animate-float-fade"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
          }}
        >
          <div
            className={`font-mono font-bold tracking-tight px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 ${
              item.isCrit
                ? 'text-xs text-white bg-[#111111] dark:bg-black ring-1 ring-emerald-500 scale-110'
                : 'text-sm text-[#111111] dark:text-white bg-white/95 dark:bg-[#151C2C]/95 backdrop-blur-xs border border-[#EAEAEA] dark:border-[#263147]'
            }`}
          >
            {item.isCrit && <span className="text-[10px] text-emerald-400 font-extrabold uppercase">CRIT</span>}
            <span>+{item.amount} B</span>
          </div>
        </div>
      ))}
    </div>
  );
}
