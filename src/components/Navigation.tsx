/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CircleDot, ShoppingBag, Gift, BarChart2, Trophy } from 'lucide-react';
import { useGame, TabType } from '../context/GameContext';
import { translations } from '../localization/translations';

export function Navigation() {
  const { activeTab, setActiveTab, state } = useGame();
  const t = translations[state.settings.language];

  const items: Array<{ id: TabType; label: string; icon: React.ElementType }> = [
    { id: 'home', label: t.nav.home, icon: CircleDot },
    { id: 'upgrades', label: t.nav.upgrades, icon: ShoppingBag },
    { id: 'daily', label: t.nav.daily, icon: Gift },
    { id: 'stats', label: t.nav.stats, icon: BarChart2 },
    { id: 'leaderboard', label: t.nav.leaderboard, icon: Trophy },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md border-t border-[#EAEAEA] dark:border-[#1E2638] pb-safe transition-colors"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors select-none focus-visible:outline-none"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                  isActive
                    ? 'text-[#111111] dark:text-white bg-[#F4F4F4] dark:bg-[#1E273A]'
                    : 'text-[#888888] dark:text-[#94A3B8]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight whitespace-nowrap mt-0.5 ${
                  isActive
                    ? 'text-[#111111] dark:text-white'
                    : 'text-[#888888] dark:text-[#94A3B8]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
