/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Flame,
  Zap,
  Coins,
  TrendingUp,
  Wrench,
  Bot,
  Cpu,
  Award,
  Calendar,
  Trophy,
  Check,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/achievementsData';
import { translations } from '../localization/translations';
import { formatBits, formatNumber, formatRate, formatTimeAgo } from '../utils/format';

const ACH_ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Zap,
  Coins,
  TrendingUp,
  Wrench,
  Bot,
  Cpu,
  Award,
  Calendar,
  Trophy,
};

export function StatsPage() {
  const { state, metrics, claimAchievement } = useGame();
  const t = translations[state.settings.language];
  const [sessionDurationMs, setSessionDurationMs] = useState(Date.now() - state.sessionStartTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDurationMs(Date.now() - state.sessionStartTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [state.sessionStartTime]);

  const sessionSeconds = Math.max(1, Math.floor(sessionDurationMs / 1000));
  const tapsPerSecond = (state.sessionTaps / sessionSeconds).toFixed(1);

  const kpis = [
    { label: t.stats.currentBalance, value: formatNumber(state.bits, state.settings.compactNumbers) + ' B' },
    { label: t.stats.lifetimeBits, value: formatNumber(state.lifetimeBits, state.settings.compactNumbers) + ' B' },
    { label: t.stats.totalTaps, value: formatNumber(state.totalTaps, state.settings.compactNumbers) },
    { label: t.stats.effectiveTapPower, value: `+${metrics.tapPower} B` },
    { label: t.stats.passiveIncome, value: formatRate(metrics.passivePerSecond, state.settings.compactNumbers) },
    { label: t.stats.playerLevel, value: `Lvl ${state.level}` },
    { label: t.stats.upgradesPurchased, value: `${metrics.totalUpgradesPurchased}` },
    { label: t.stats.streak, value: `${state.dailyStreak} d` },
    { label: t.stats.sessionTime, value: formatTimeAgo(sessionDurationMs) },
    { label: t.stats.sessionBits, value: `+${formatNumber(state.sessionBits, state.settings.compactNumbers)} B` },
    { label: t.stats.tapPace, value: `${tapsPerSecond} ${t.stats.tapsPerSec}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 transition-colors">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111111] dark:text-white tracking-tight">
          {t.stats.title}
        </h2>
        <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">
          {t.stats.subtitle}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex flex-col justify-between"
          >
            <span className="text-[11px] font-semibold text-[#777777] dark:text-[#94A3B8] uppercase tracking-wider">
              {kpi.label}
            </span>
            <span className="text-base sm:text-lg font-mono font-bold text-[#111111] dark:text-white mt-1 truncate">
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-[#111111] dark:text-white tracking-tight">
              {t.stats.achievementsTitle}
            </h3>
            <p className="text-xs text-[#777777] dark:text-[#94A3B8]">{t.stats.achievementsSubtitle}</p>
          </div>
          <div className="text-xs font-mono font-bold text-[#111111] dark:text-white bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] px-2.5 py-1 rounded-lg">
            {Object.keys(state.unlockedAchievements).length}/{ACHIEVEMENTS.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const Icon = ACH_ICON_MAP[ach.iconName] || Award;
            const isUnlocked = Boolean(state.unlockedAchievements[ach.id]);
            const isClaimed = Boolean(state.claimedAchievements[ach.id]);
            const progressRatio = isUnlocked ? 1 : ach.getProgress(state);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-white dark:bg-[#151C2C] border-[#EAEAEA] dark:border-[#263147]'
                    : 'bg-[#FAFAFA] dark:bg-[#111624] border-[#EAEAEA] dark:border-[#20293D] opacity-80'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white'
                      : 'bg-[#EAEAEA] dark:bg-[#1E2638] text-[#888888] dark:text-[#64748B] border-[#DCDCDC] dark:border-[#2B374E]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#111111] dark:text-white truncate">
                      {ach.title[state.settings.language]}
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-[#111111] dark:text-white shrink-0">
                      +{ach.rewardBits} B
                    </span>
                  </div>

                  <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5 line-clamp-2">
                    {ach.description[state.settings.language]}
                  </p>

                  {/* Progress Bar & Claim Button */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="w-full h-1.5 bg-[#EAEAEA] dark:bg-[#1E2638] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#111111] dark:bg-white transition-all duration-300"
                          style={{ width: `${Math.round(progressRatio * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isClaimed ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.stats.claimed}</span>
                        </span>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => claimAchievement(ach.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#111111] dark:bg-white hover:bg-black dark:hover:bg-neutral-100 text-white dark:text-[#111111] text-[11px] font-semibold active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#111111]"
                        >
                          {t.stats.claimReward}
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-[#888888] dark:text-[#94A3B8]">
                          {Math.round(progressRatio * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
