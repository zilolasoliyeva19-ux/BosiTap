/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Fingerprint,
  Zap,
  Cpu,
  Flame,
  Bot,
  Server,
  Radio,
  Satellite,
  TrendingUp,
  Gauge,
  BatteryCharging,
  ShieldCheck,
  Lock,
  Check,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { UPGRADE_DEFINITIONS, getUpgradeBenefit, getUpgradeCost, getNextUpgradeBenefit } from '../data/upgradesData';
import { translations } from '../localization/translations';
import { UpgradeDefinition } from '../types/game';
import { formatBits, formatNumber } from '../utils/format';

const ICON_MAP: Record<string, React.ElementType> = {
  Fingerprint,
  Zap,
  Cpu,
  Flame,
  Bot,
  Server,
  Radio,
  Satellite,
  TrendingUp,
  Gauge,
  BatteryCharging,
  ShieldCheck,
};

export function UpgradesPage() {
  const { state, buyUpgrade } = useGame();
  const t = translations[state.settings.language];
  const [filter, setFilter] = useState<'all' | 'tap' | 'miner' | 'multiplier' | 'booster'>('all');

  const filteredUpgrades = UPGRADE_DEFINITIONS.filter((def) => {
    if (filter === 'all') return true;
    return def.category === filter;
  });

  const getIsLocked = (def: UpgradeDefinition): { locked: boolean; reason?: string } => {
    if (def.minLevelToUnlock && state.level < def.minLevelToUnlock) {
      return {
        locked: true,
        reason: `${t.upgrades.unlockAtLevel} ${def.minLevelToUnlock}`,
      };
    }
    if (def.minTapsToUnlock && state.totalTaps < def.minTapsToUnlock) {
      return {
        locked: true,
        reason: `${t.upgrades.unlockAtTaps} ${def.minTapsToUnlock}`,
      };
    }
    return { locked: false };
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 transition-colors">
      {/* Sticky Compact Balance Header */}
      <div className="sticky top-14 sm:top-16 z-20 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md py-3 border-b border-[#EAEAEA] dark:border-[#1E2638] mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111] dark:text-white tracking-tight">
            {t.upgrades.title}
          </h2>
          <p className="text-xs text-[#777777] dark:text-[#94A3B8] hidden sm:block">
            {t.upgrades.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F7F7F7] dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] px-3 py-1.5 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-[#777777] dark:text-[#94A3B8]">
            {t.upgrades.balanceLabel}
          </span>
          <span className="font-mono text-sm font-bold text-[#111111] dark:text-white">
            {formatNumber(state.bits, state.settings.compactNumbers)} B
          </span>
        </div>
      </div>

      {/* Segmented Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {[
          { id: 'all' as const, label: t.upgrades.filterAll },
          { id: 'tap' as const, label: t.upgrades.filterTap },
          { id: 'miner' as const, label: t.upgrades.filterMiner },
          { id: 'multiplier' as const, label: t.upgrades.filterMultiplier },
          { id: 'booster' as const, label: t.upgrades.filterBooster },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white ${
              filter === btn.id
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs'
                : 'bg-[#F7F7F7] dark:bg-[#151C2C] text-[#777777] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Upgrades List */}
      <div className="flex flex-col gap-3">
        {filteredUpgrades.map((def) => {
          const Icon = ICON_MAP[def.iconName] || Zap;
          const currentLevel = state.upgrades[def.id] || 0;
          const isMaxed = Boolean(def.maxLevel && currentLevel >= def.maxLevel);
          const cost = getUpgradeCost(def, currentLevel);
          const canAfford = state.bits >= cost;
          const lockStatus = getIsLocked(def);
          const currentBenefit = getUpgradeBenefit(def, currentLevel);
          const nextBenefit = getNextUpgradeBenefit(def, currentLevel);

          return (
            <div
              key={def.id}
              className={`p-4 rounded-2xl border transition-all ${
                lockStatus.locked
                  ? 'bg-[#FAFAFA] dark:bg-[#111624] border-[#EAEAEA] dark:border-[#20293D] opacity-70'
                  : 'bg-white dark:bg-[#151C2C] border-[#EAEAEA] dark:border-[#263147] hover:border-[#CCCCCC] dark:hover:border-[#384766]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Icon & Info */}
                <div className="flex items-start gap-3.5 flex-1">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      lockStatus.locked
                        ? 'bg-[#EAEAEA] dark:bg-[#1A2234] text-[#999999] dark:text-[#64748B] border-[#DCDCDC] dark:border-[#222E46]'
                        : currentLevel > 0
                        ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white'
                        : 'bg-[#F7F7F7] dark:bg-[#1E2638] text-[#111111] dark:text-white border-[#EAEAEA] dark:border-[#2B374E]'
                    }`}
                  >
                    {lockStatus.locked ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                        {def.name[state.settings.language]}
                      </h3>
                      {currentLevel > 0 && (
                        <span className="text-xs font-mono font-semibold text-[#777777] dark:text-[#94A3B8]">
                          Lvl {currentLevel}
                          {def.maxLevel ? `/${def.maxLevel}` : ''}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5 max-w-md">
                      {def.description[state.settings.language]}
                    </p>

                    {/* Benefit calculation indicator */}
                    {!lockStatus.locked && (
                      <div className="flex items-center gap-2 text-xs font-mono text-[#111111] dark:text-white mt-2">
                        <span className="text-[#777777] dark:text-[#94A3B8]">{t.upgrades.benefit}:</span>
                        <span className="font-semibold">
                          +{currentBenefit} {def.benefitUnit}
                        </span>
                        {!isMaxed && (
                          <>
                            <span className="text-[#AAAAAA] dark:text-[#64748B]">→</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              +{nextBenefit} {def.benefitUnit}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Price & Upgrade Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F0F0] dark:border-[#222C3F]">
                  {lockStatus.locked ? (
                    <div className="text-xs font-medium text-[#888888] dark:text-[#94A3B8] py-2 px-3 bg-[#F0F0F0] dark:bg-[#1E2638] rounded-lg">
                      {lockStatus.reason}
                    </div>
                  ) : isMaxed ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.upgrades.maxed}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => buyUpgrade(def.id)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2 whitespace-nowrap active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white ${
                        canAfford
                          ? 'bg-[#111111] dark:bg-white hover:bg-black dark:hover:bg-neutral-100 text-white dark:text-[#111111] shadow-xs cursor-pointer'
                          : 'bg-[#F2F2F2] dark:bg-[#1E2638] text-[#AAAAAA] dark:text-[#64748B] cursor-not-allowed'
                      }`}
                    >
                      <span>{t.upgrades.buy}</span>
                      <span className="font-mono font-bold">
                        {formatBits(cost, state.settings.compactNumbers)}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
