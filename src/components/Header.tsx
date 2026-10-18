/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Settings, Sparkles, Zap, Sun, Moon, User } from 'lucide-react';
import { useGame, TabType } from '../context/GameContext';
import { translations } from '../localization/translations';
import { Logo } from './Logo';

const AVATAR_COLORS: Record<string, string> = {
  avatar_1: 'bg-emerald-600',
  avatar_2: 'bg-indigo-600',
  avatar_3: 'bg-amber-600',
  avatar_4: 'bg-rose-600',
  avatar_5: 'bg-cyan-600',
  avatar_6: 'bg-[#111111] dark:bg-white dark:text-[#111111]',
};

export function Header() {
  const {
    state,
    metrics,
    activeTab,
    setActiveTab,
    updateSettings,
    toggleTheme,
    activateOverclock,
    overclockCooldownSeconds,
    setIsAuthModalOpen,
  } = useGame();
  const t = translations[state.settings.language];
  const isDark = state.settings.theme === 'dark';

  const navItems: Array<{ id: TabType; label: string }> = [
    { id: 'home', label: t.nav.home },
    { id: 'upgrades', label: t.nav.upgrades },
    { id: 'daily', label: t.nav.daily },
    { id: 'stats', label: t.nav.stats },
    { id: 'leaderboard', label: t.nav.leaderboard },
    { id: 'settings', label: t.nav.settings },
  ];

  const userAvatarBg = state.profile
    ? AVATAR_COLORS[state.profile.avatarId] || 'bg-emerald-600'
    : 'bg-[#111111] dark:bg-white';

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md border-b border-[#EAEAEA] dark:border-[#1E2638] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Zone 1: BosiTap Logo & Brand */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white rounded"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: Navigation Links (Desktop 4-5 links) / Mobile Info (Level & Streak) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                    : 'text-[#777777] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#151C2C]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Middle Info Badge */}
        <div className="flex md:hidden items-center gap-1.5 text-xs font-medium text-[#777777] dark:text-[#94A3B8]">
          <span>Lvl {state.level}</span>
          <span aria-hidden="true">·</span>
          <span>{state.dailyStreak}d</span>
        </div>

        {/* Zone 3: Actions (Overclock surge, Theme toggle, Sound toggle, Profile avatar) */}
        <div className="flex items-center gap-2">
          {/* Overclock Quick Surge Button */}
          {metrics.isOverclockActive ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-mono font-semibold animate-pulse">
              <Zap className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>2x ({metrics.overclockRemainingSeconds}s)</span>
            </div>
          ) : overclockCooldownSeconds === 0 ? (
            <button
              onClick={() => activateOverclock()}
              title="2x Tezlanishni yoqish"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 active:scale-95 transition-all"
            >
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">2x Surge</span>
              <span className="sm:hidden">2x</span>
            </button>
          ) : null}

          {/* Dark Mode / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Yorug\' rejim' : 'Qorong\'i rejim'}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#EAEAEA] dark:border-[#263147] text-[#777777] dark:text-[#CBD5E1] hover:text-[#111111] dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#151C2C] active:scale-95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Sound toggle button */}
          <button
            type="button"
            onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
            aria-label={state.settings.soundEnabled ? 'Ovozni o\'chirish' : 'Ovozni yoqish'}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#EAEAEA] dark:border-[#263147] text-[#777777] dark:text-[#CBD5E1] hover:text-[#111111] dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#151C2C] active:scale-95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white"
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* User Profile Avatar Trigger */}
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            title={state.profile ? `@${state.profile.username}` : 'Profil'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all ring-1 ring-[#EAEAEA] dark:ring-[#263147] hover:scale-105 active:scale-95 ${userAvatarBg}`}
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
