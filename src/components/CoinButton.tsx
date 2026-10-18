/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useGame } from '../context/GameContext';

interface CoinButtonProps {
  onTapCoin: (
    x: number,
    y: number,
    meta?: { isTrusted?: boolean; clientX?: number; clientY?: number }
  ) => void;
}

export function CoinButton({ onTapCoin }: CoinButtonProps) {
  const { metrics, state } = useGame();
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(true);

    const rect = buttonRef.current?.getBoundingClientRect();
    let spawnX = e.clientX;
    let spawnY = e.clientY - 30;

    if (!rect || isNaN(spawnX) || spawnX <= 0) {
      if (rect) {
        spawnX = rect.left + rect.width / 2;
        spawnY = rect.top + rect.height / 2 - 20;
      }
    }

    onTapCoin(spawnX, spawnY, {
      isTrusted: e.isTrusted,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsPressed(true);
      const rect = buttonRef.current?.getBoundingClientRect();
      const spawnX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const spawnY = rect ? rect.top + rect.height / 2 - 30 : 350;
      onTapCoin(spawnX, spawnY, {
        isTrusted: e.isTrusted,
        clientX: spawnX,
        clientY: spawnY,
      });
      setTimeout(() => setIsPressed(false), 100);
    }
  };

  const comboScale = Math.min(1 + metrics.comboCount * 0.003, 1.08);

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-1 sm:py-3 touch-none">
      {/* Dynamic ambient aura */}
      {(metrics.isOverclockActive || metrics.comboCount > 5) && (
        <div
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none transition-all duration-300"
          style={{
            width: 'clamp(210px, 58vw, 300px)',
            height: 'clamp(210px, 58vw, 300px)',
            background: metrics.isOverclockActive
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(255, 255, 255, 0) 70%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
            transform: `scale(${isPressed ? 1.08 : 1})`,
          }}
        />
      )}

      {/* Main Physical Coin with fluid clamp scaling */}
      <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        aria-label="Tap to earn Bits"
        className={`group relative rounded-full flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white focus-visible:ring-offset-4 touch-none cursor-pointer select-none transition-transform duration-75 ${
          state.settings.reducedMotion ? '' : 'coin-press-effect'
        }`}
        style={{
          width: 'clamp(175px, 48vw, 248px)',
          height: 'clamp(175px, 48vw, 248px)',
          transform: state.settings.reducedMotion
            ? undefined
            : isPressed
            ? 'scale(0.93)'
            : `scale(${comboScale})`,
        }}
      >
        {/* Outer Coin Perimeter Rim */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#F2F2F2] via-[#E5E5E5] to-[#D8D8D8] dark:from-[#2B354D] dark:via-[#1F2739] dark:to-[#161D2B] shadow-lg shadow-black/8 dark:shadow-black/40 transition-all duration-150 group-hover:shadow-xl" />

        {/* Outer Stepped Edge */}
        <div className="absolute inset-1.5 sm:inset-2 rounded-full border border-[#DCDCDC] dark:border-[#2F3C57] bg-gradient-to-tr from-[#FAFAFA] via-[#FFFFFF] to-[#F0F0F0] dark:from-[#1A2234] dark:via-[#202A40] dark:to-[#151D2C]" />

        {/* Concentric Milled Grooves */}
        <div className="absolute inset-3 sm:inset-4 rounded-full border border-dashed border-[#E5E5E5]/80 dark:border-[#384766]/60 pointer-events-none" />

        {/* Inner Coin Recessed Well */}
        <div className="relative w-[74%] h-[74%] rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#F9F9F9] dark:from-[#161E2E] dark:to-[#0F1522] border border-[#EAEAEA] dark:border-[#28354D] flex flex-col items-center justify-center shadow-inner">
          {/* Top subtle coin notches */}
          <div className="absolute top-2 sm:top-2.5 flex items-center gap-1.5 opacity-40 dark:opacity-60">
            <span className="w-1 h-1 rounded-full bg-[#111111] dark:bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111] dark:bg-white" />
            <span className="w-1 h-1 rounded-full bg-[#111111] dark:bg-white" />
          </div>

          {/* Central Architectural "B" Emblem */}
          <div className="relative w-[46%] h-[46%] flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-[#111111] dark:text-white transition-transform duration-100 group-hover:scale-105"
            >
              {/* Back vertical stem */}
              <rect x="18" y="12" width="6" height="40" rx="1.5" fill="currentColor" />
              {/* Upper Loop */}
              <path
                d="M24 14H37C42 14 45.5 17.5 45.5 22.5C45.5 27.5 42 31 37 31H24V14Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Lower Loop */}
              <path
                d="M24 31H39C44.5 31 48 35 48 40.5C48 46 44.5 50 39 50H24V31Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <line x1="12" y1="31" x2="18" y2="31" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          {/* Bottom coin currency label */}
          <span className="absolute bottom-2 sm:bottom-2.5 text-[9px] sm:text-[10px] tracking-widest font-bold uppercase text-[#777777] dark:text-[#94A3B8]">
            BITS
          </span>
        </div>
      </button>

      {/* Ripple ring */}
      <div
        className={`absolute pointer-events-none rounded-full border border-[#111111]/15 dark:border-white/15 transition-all duration-300 ${
          isPressed ? 'scale-110 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{
          width: 'clamp(170px, 45vw, 240px)',
          height: 'clamp(170px, 45vw, 240px)',
        }}
      />
    </div>
  );
}
