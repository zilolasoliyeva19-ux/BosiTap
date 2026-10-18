/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Gift, CheckCircle, Clock, Flame, ShieldAlert, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { translations } from '../localization/translations';
import { formatBits, formatDuration } from '../utils/format';

export function DailyPage() {
  const { state, claimDailyReward } = useGame();
  const t = translations[state.settings.language];
  const [secondsUntilNextClaim, setSecondsUntilNextClaim] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const last = state.lastDailyClaimTime;
      if (!last) {
        setSecondsUntilNextClaim(0);
        return;
      }
      const diff = 24 * 3600 * 1000 - (now - last);
      setSecondsUntilNextClaim(Math.max(0, Math.floor(diff / 1000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [state.lastDailyClaimTime]);

  const canClaim = secondsUntilNextClaim === 0;

  const dailyTiers = [
    { day: 1, bits: 80, label: '1-kun' },
    { day: 2, bits: 120, label: '2-kun' },
    { day: 3, bits: 180, label: '3-kun' },
    { day: 4, bits: 270, label: '4-kun' },
    { day: 5, bits: 400, label: '5-kun' },
    { day: 6, bits: 600, label: '6-kun' },
    { day: 7, bits: 1800, label: '7-kun', isGrand: true },
  ];

  const currentCycleDay = state.dailyStreak === 0 ? 1 : ((state.dailyStreak - 1) % 7) + 1;
  const nextCycleDay = canClaim
    ? state.dailyStreak === 0
      ? 1
      : (state.dailyStreak % 7) + 1
    : currentCycleDay;

  const handleClaim = () => {
    if (!canClaim) return;
    const success = claimDailyReward();
    if (success) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 transition-colors">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111111] dark:text-white tracking-tight">
          {t.daily.title}
        </h2>
        <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">
          {t.daily.subtitle}
        </p>
      </div>

      {/* Main Status Card */}
      <div className="bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-3xl p-5 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center shrink-0 shadow-md">
            <Gift className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#777777] dark:text-[#94A3B8] font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.daily.currentStreak}</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#111111] dark:text-white mt-0.5">
              {state.dailyStreak} {t.daily.daysStreak}
            </div>
            <div className="text-xs text-[#777777] dark:text-[#94A3B8] mt-1">
              {canClaim ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.daily.readyToClaim}</span>
              ) : (
                <span>
                  {t.daily.nextClaimIn}:{' '}
                  <span className="font-mono font-semibold text-[#111111] dark:text-white">
                    {formatDuration(secondsUntilNextClaim)}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Claim Action */}
        <button
          type="button"
          disabled={!canClaim}
          onClick={handleClaim}
          className={`min-h-[48px] w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white ${
            canClaim
              ? 'bg-[#111111] dark:bg-white hover:bg-black dark:hover:bg-neutral-100 text-white dark:text-[#111111] shadow-md shadow-black/10 cursor-pointer animate-bounce-short'
              : 'bg-[#F2F2F2] dark:bg-[#1E2638] text-[#999999] dark:text-[#64748B] cursor-not-allowed'
          }`}
        >
          {canClaim ? (
            <>
              <Gift className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>{t.daily.claimReward}</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>{t.daily.claimedToday}</span>
            </>
          )}
        </button>
      </div>

      {/* Celebration Notification */}
      {showCelebration && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 animate-fade-in">
          <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">{t.daily.streakExtendedToast}</span>
          </div>
        </div>
      )}

      {/* 7-Day Track Grid */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-[#777777] dark:text-[#94A3B8] uppercase tracking-wider mb-3">
          7 kunlik mukofotlar jadvali
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {dailyTiers.map((tier) => {
            const isToday = canClaim ? tier.day === nextCycleDay : tier.day === currentCycleDay;
            const isCompleted = state.dailyStreak > 0 && !canClaim && tier.day <= currentCycleDay;

            return (
              <div
                key={tier.day}
                className={`p-3.5 rounded-2xl border relative flex flex-col justify-between transition-all ${
                  isToday
                    ? 'border-[#111111] dark:border-white bg-white dark:bg-[#1A2234] ring-1 ring-[#111111] dark:ring-white shadow-xs'
                    : isCompleted
                    ? 'border-[#EAEAEA] dark:border-[#222E46] bg-[#F7F7F7] dark:bg-[#111624] opacity-80'
                    : 'border-[#EAEAEA] dark:border-[#263147] bg-white dark:bg-[#151C2C]'
                } ${tier.isGrand ? 'sm:col-span-2 bg-gradient-to-br from-[#FAFAFA] to-[#F0F0F0] dark:from-[#182030] dark:to-[#131926]' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#777777] dark:text-[#94A3B8] uppercase tracking-wider">
                    {tier.label}
                  </span>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isToday && canClaim ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  ) : null}
                </div>

                <div className="my-1">
                  <div className="text-base font-mono font-bold text-[#111111] dark:text-white">
                    +{formatBits(tier.bits, false)}
                  </div>
                  {tier.isGrand && (
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Jackpot Bonus
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-[#888888] dark:text-[#94A3B8] mt-2 font-medium">
                  {isCompleted
                    ? 'Olindi'
                    : isToday
                    ? canClaim
                      ? 'Olish mumkin'
                      : 'Keyingi navbat'
                    : 'Kutilmoqda'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanatory Rules & Device Storage Box */}
      <div className="flex flex-col gap-3">
        <div className="p-4 rounded-2xl border border-[#EAEAEA] dark:border-[#263147] bg-[#FAFAFA] dark:bg-[#111624]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-white mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{t.daily.streakRuleTitle}</span>
          </div>
          <p className="text-xs text-[#777777] dark:text-[#94A3B8] leading-relaxed">
            {t.daily.streakRuleBody}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-[#EAEAEA] dark:border-[#263147] bg-[#FAFAFA] dark:bg-[#111624]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-white mb-1">
            <ShieldAlert className="w-4 h-4 text-[#777777] dark:text-[#94A3B8]" />
            <span>{t.daily.storageNoticeTitle}</span>
          </div>
          <p className="text-xs text-[#777777] dark:text-[#94A3B8] leading-relaxed">
            {t.daily.storageNoticeBody}
          </p>
        </div>
      </div>
    </div>
  );
}
