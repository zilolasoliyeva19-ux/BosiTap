/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUpRight, Zap, Flame, ShieldAlert } from 'lucide-react';
import { CoinButton } from '../components/CoinButton';
import { useGame } from '../context/GameContext';
import { translations } from '../localization/translations';
import { formatBits, formatNumber, formatRate } from '../utils/format';

export function HomePage() {
  const {
    state,
    metrics,
    tapCoin,
    setActiveTab,
    levelUpNotification,
    dismissLevelUpNotification,
    antiCheatWarning,
    dismissAntiCheatWarning,
  } = useGame();
  const t = translations[state.settings.language];

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-2 sm:py-4 flex flex-col justify-between h-[calc(100dvh-3.5rem-4.25rem)] md:h-[calc(100dvh-4rem)] min-h-[500px] overflow-y-auto no-scrollbar transition-colors">
      {/* Anti-Cheat Throttle Alert */}
      {antiCheatWarning && (
        <div className="w-full mb-2 bg-rose-600/95 dark:bg-rose-950/90 text-white border border-rose-500/50 dark:border-rose-800 rounded-xl p-3 flex items-center justify-between shadow-lg animate-fade-in shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-200 shrink-0" />
            <div className="text-xs">
              <div className="font-bold">{t.antiCheat.warningTitle}</div>
              <div className="text-rose-100 text-[11px] mt-0.5">
                {t.antiCheat.warningDesc(antiCheatWarning.remainingSeconds)}
              </div>
            </div>
          </div>
          <button
            onClick={dismissAntiCheatWarning}
            className="text-xs font-semibold px-2 py-1 rounded bg-black/20 hover:bg-black/30 shrink-0 ml-2"
          >
            {t.home.dismiss}
          </button>
        </div>
      )}

      {/* Level Up Subtle Toast */}
      {levelUpNotification && (
        <div className="w-full mb-2 bg-[#111111] dark:bg-[#1E273A] text-white border border-neutral-700 dark:border-neutral-600 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-lg animate-fade-in shrink-0">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">{t.home.levelUnlockedToast(levelUpNotification)}</span>{' '}
              <span className="text-neutral-400 hidden sm:inline">{t.home.levelUnlockedSub}</span>
            </div>
          </div>
          <button
            onClick={dismissLevelUpNotification}
            className="text-xs text-neutral-400 hover:text-white px-2 py-0.5"
          >
            {t.home.dismiss}
          </button>
        </div>
      )}

      {/* Balance Section */}
      <section className="w-full text-center flex flex-col items-center shrink-0">
        <div className="text-[10px] sm:text-xs tracking-widest font-semibold text-[#777777] dark:text-[#94A3B8] uppercase">
          {t.home.yourBalance}
        </div>

        {/* Responsive Balance Display with dynamic fluid size */}
        <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-extrabold tracking-tight text-[#111111] dark:text-white my-0.5 sm:my-1 flex items-baseline justify-center gap-1.5 sm:gap-2">
          <span>{formatNumber(state.bits, state.settings.compactNumbers)}</span>
          <span className="text-lg sm:text-xl font-bold text-[#777777] dark:text-[#94A3B8]">B</span>
        </div>

        {/* Unboxed Metadata Strip */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#777777] dark:text-[#94A3B8] font-medium mb-1.5 sm:mb-2">
          <span>{t.home.sessionEarned}: +{formatNumber(state.sessionBits, state.settings.compactNumbers)} B</span>
          <span aria-hidden="true">·</span>
          <span>{formatRate(metrics.passivePerSecond, state.settings.compactNumbers)}</span>
        </div>

        {/* Level Progression Bar */}
        <div className="w-full max-w-xs flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-[#777777] dark:text-[#94A3B8] font-medium">
            <span>{t.home.currentLevel} {state.level}</span>
            <span>{Math.round(metrics.levelProgressRatio * 100)}%</span>
          </div>
          <div className="w-full h-1 sm:h-1.5 bg-[#F2F2F2] dark:bg-[#1E2638] rounded-full overflow-hidden border border-[#EAEAEA] dark:border-[#283248]">
            <div
              className="h-full bg-[#111111] dark:bg-white transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(4, metrics.levelProgressRatio * 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Centerpiece: Coin Button with dynamic centering */}
      <div className="w-full my-auto flex flex-col items-center justify-center py-1 sm:py-2">
        <CoinButton onTapCoin={(x, y, meta) => tapCoin(x, y, meta)} />

        {/* Under the Coin Label */}
        <div className="flex flex-col items-center gap-0.5 mt-1 sm:mt-2">
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#111111] dark:text-white">
            {t.home.tapToEarn}
          </span>
          <span className="text-[10px] sm:text-xs text-[#777777] dark:text-[#94A3B8]">
            +{metrics.tapPower} B per tap
            {metrics.isOverclockActive && ' (2x Active)'}
          </span>
        </div>
      </div>

      {/* Under Coin Metric Strip & Quick Upgrade Callout */}
      <section className="w-full max-w-md mx-auto pt-1 sm:pt-2 shrink-0">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-3 bg-[#F7F7F7] dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-xl text-center">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#777777] dark:text-[#94A3B8]">
              {t.home.tapPower}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-[#111111] dark:text-white mt-0.5">
              +{metrics.tapPower} B
            </span>
          </div>

          <div className="flex flex-col border-x border-[#EAEAEA] dark:border-[#263147]">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#777777] dark:text-[#94A3B8]">
              {t.home.passiveIncome}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-[#111111] dark:text-white mt-0.5">
              +{metrics.passivePerSecond} B/s
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#777777] dark:text-[#94A3B8]">
              {t.home.lifetimeTaps}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-[#111111] dark:text-white mt-0.5">
              {formatNumber(state.totalTaps, state.settings.compactNumbers)}
            </span>
          </div>
        </div>

        {/* Quick Shop Action */}
        <button
          onClick={() => setActiveTab('upgrades')}
          className="w-full mt-2 py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl border border-[#EAEAEA] dark:border-[#263147] hover:border-[#111111] dark:hover:border-white bg-white dark:bg-[#151C2C] text-xs font-medium text-[#111111] dark:text-white flex items-center justify-between group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Zap className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
            <span className="truncate">Do&apos;kon ({metrics.totalUpgradesPurchased} ta olingan)</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#777777] dark:text-[#94A3B8] group-hover:text-[#111111] dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
        </button>
      </section>
    </div>
  );
}
