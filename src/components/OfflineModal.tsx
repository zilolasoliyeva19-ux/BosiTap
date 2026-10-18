/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { translations } from '../localization/translations';
import { formatBits, formatDuration } from '../utils/format';

export function OfflineModal() {
  const { offlineReport, dismissOfflineReport, state } = useGame();
  const t = translations[state.settings.language];

  if (!offlineReport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-[#151C2C] rounded-3xl border border-[#EAEAEA] dark:border-[#263147] p-6 shadow-2xl flex flex-col items-center text-center transition-colors">
        {/* Drone Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] flex items-center justify-center text-[#111111] dark:text-white mb-4">
          <Bot className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-[#111111] dark:text-white tracking-tight mb-1">
          {t.offlineModal.title}
        </h3>

        <p className="text-sm text-[#777777] dark:text-[#94A3B8] mb-5">
          {t.offlineModal.minedWhileAway}
        </p>

        {/* Stats card */}
        <div className="w-full bg-[#F7F7F7] dark:bg-[#0E131F] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl p-4 mb-6">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#777777] dark:text-[#94A3B8] mb-1">
            {t.offlineModal.offlineDuration}
          </div>
          <div className="text-sm font-mono text-[#111111] dark:text-white mb-3">
            {formatDuration(offlineReport.durationSeconds)}
          </div>

          <div className="border-t border-[#EAEAEA] dark:border-[#222C3F] pt-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#777777] dark:text-[#94A3B8] mb-1">
              Topilgan Bits
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +{formatBits(offlineReport.bits, state.settings.compactNumbers)}
            </div>
          </div>
        </div>

        {/* Collect button */}
        <button
          onClick={dismissOfflineReport}
          className="w-full h-12 rounded-xl bg-[#111111] dark:bg-white hover:bg-black dark:hover:bg-neutral-100 text-white dark:text-[#111111] font-semibold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
        >
          <span>{t.offlineModal.collect}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
