/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Trophy,
  Shield,
  Medal,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Share2,
  User,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { translations } from '../localization/translations';
import { formatBits, formatNumber } from '../utils/format';

interface DivisionTier {
  id: string;
  name: string;
  minBits: number;
  minRate: number;
  perk: string;
}

export function LeaderboardPage() {
  const { state, metrics, setIsAuthModalOpen } = useGame();
  const t = translations[state.settings.language];
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'divisions' | 'records'>('divisions');

  const userProfile = state.profile || {
    name: 'Bosi',
    username: 'bosi_tap',
    avatarId: 'avatar_1',
    createdAt: Date.now(),
  };

  const divisions: DivisionTier[] = [
    {
      id: 'master',
      name: t.leaderboard.divisions.master,
      minBits: 1000000,
      minRate: 500,
      perk: '+30% Global Multiplier Synergy',
    },
    {
      id: 'diamond',
      name: t.leaderboard.divisions.diamond,
      minBits: 250000,
      minRate: 150,
      perk: '+20% Global Multiplier Synergy',
    },
    {
      id: 'platinum',
      name: t.leaderboard.divisions.platinum,
      minBits: 50000,
      minRate: 50,
      perk: '+15% Global Multiplier Synergy',
    },
    {
      id: 'gold',
      name: t.leaderboard.divisions.gold,
      minBits: 10000,
      minRate: 15,
      perk: '+10% Global Multiplier Synergy',
    },
    {
      id: 'silver',
      name: t.leaderboard.divisions.silver,
      minBits: 2000,
      minRate: 3,
      perk: '+5% Global Multiplier Synergy',
    },
    {
      id: 'bronze',
      name: t.leaderboard.divisions.bronze,
      minBits: 0,
      minRate: 0,
      perk: 'Boshlang\'ich litsenziya',
    },
  ];

  // Find user's current division tier
  let activeTierIndex = divisions.length - 1;
  for (let i = 0; i < divisions.length; i++) {
    if (state.lifetimeBits >= divisions[i].minBits && metrics.passivePerSecond >= divisions[i].minRate) {
      activeTierIndex = i;
      break;
    }
  }

  const activeDivision = divisions[activeTierIndex];
  const nextDivision = activeTierIndex > 0 ? divisions[activeTierIndex - 1] : null;

  const bitsToNextDivision = nextDivision ? Math.max(0, nextDivision.minBits - state.lifetimeBits) : 0;
  const rateToNextDivision = nextDivision ? Math.max(0, nextDivision.minRate - metrics.passivePerSecond) : 0;

  const handleShareScore = () => {
    const text = `BosiTap o'yinidagi natijam: ${formatBits(state.lifetimeBits, true)} (${activeDivision.name})! @${userProfile.username}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#111111] dark:text-white tracking-tight">
            {t.leaderboard.title}
          </h2>
          <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">
            {t.leaderboard.subtitle}
          </p>
        </div>

        {/* Clean Pill-free metadata badge */}
        <div className="flex items-center gap-1.5 self-start px-2.5 py-1 bg-[#F7F7F7] dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-md text-[11px] font-semibold text-[#555555] dark:text-[#E2E8F0]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{t.leaderboard.badge}</span>
        </div>
      </div>

      {/* Verified Real Player Identity Card */}
      <div className="bg-gradient-to-br from-[#111111] to-[#252525] dark:from-[#151C2C] dark:to-[#0F1420] text-white border border-[#333333] dark:border-[#263147] rounded-3xl p-5 sm:p-6 mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">{userProfile.name}</h3>
                <span className="text-xs font-mono text-emerald-400">@{userProfile.username}</span>
              </div>
              <div className="text-xs text-neutral-300 flex items-center gap-2 mt-0.5 font-medium">
                <span className="text-amber-300 font-semibold">{activeDivision.name}</span>
                <span aria-hidden="true">·</span>
                <span>{state.dailyStreak} kunlik seriya</span>
              </div>
            </div>
          </div>

          {/* Action buttons: Share & Edit */}
          <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <button
              onClick={handleShareScore}
              className="flex-1 sm:flex-initial h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Nusxalandi!' : 'Ulashish'}</span>
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex-1 sm:flex-initial h-9 px-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Tahrirlash</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Matrix */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-neutral-400">Jami Bits</span>
            <span className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">
              {formatNumber(state.lifetimeBits, state.settings.compactNumbers)} B
            </span>
          </div>

          <div className="flex flex-col border-x border-white/10">
            <span className="text-[10px] uppercase font-semibold text-neutral-400">Passiv Tezlik</span>
            <span className="text-sm sm:text-base font-mono font-bold text-emerald-400 mt-0.5">
              +{metrics.passivePerSecond} B/s
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-neutral-400">Jami Bosishlar</span>
            <span className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">
              {formatNumber(state.totalTaps, state.settings.compactNumbers)}
            </span>
          </div>
        </div>

        {/* Next Tier Qualification Target */}
        {nextDivision && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-300">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Keyingi divizion: {nextDivision.name}</span>
            </span>
            <span className="font-mono text-white text-right">
              {bitsToNextDivision > 0 && `+${formatBits(bitsToNextDivision, true)} Bits kerak`}
            </span>
          </div>
        )}
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex items-center gap-1.5 mb-6">
        <button
          onClick={() => setActiveTab('divisions')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'divisions'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs'
              : 'bg-[#F7F7F7] dark:bg-[#151C2C] text-[#777777] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          Divizionlar va Ligalar
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'records'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs'
              : 'bg-[#F7F7F7] dark:bg-[#151C2C] text-[#777777] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          Shaxsiy Rekordlar
        </button>
      </div>

      {/* Tab 1: Official Division Progression Circuit */}
      {activeTab === 'divisions' && (
        <div className="space-y-3 mb-6">
          {divisions.map((tier) => {
            const isCurrent = tier.id === activeDivision.id;
            const isQualified = state.lifetimeBits >= tier.minBits && metrics.passivePerSecond >= tier.minRate;

            return (
              <div
                key={tier.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-white dark:bg-[#1A2234] border-[#111111] dark:border-white ring-1 ring-[#111111] dark:ring-white shadow-xs'
                    : isQualified
                    ? 'bg-[#FAFAFA] dark:bg-[#151C2C] border-[#EAEAEA] dark:border-[#263147]'
                    : 'bg-white dark:bg-[#111624] border-[#EAEAEA] dark:border-[#20293D] opacity-75'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCurrent
                          ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                          : isQualified
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-[#F5F5F5] dark:bg-[#1E2638] text-[#999999]'
                      }`}
                    >
                      {isQualified ? <Medal className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#111111] dark:text-white">
                          {tier.name}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-md">
                            Siz shu yerdasiz
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5 font-mono">
                        Talab: {formatNumber(tier.minBits)} B Bits · {tier.minRate} B/s Tezlik
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {isQualified ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Erishildi</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-[#888888] dark:text-[#94A3B8]">
                        Qulflangan
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Real Local Device Records */}
      {activeTab === 'records' && (
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#777777] dark:text-[#94A3B8] uppercase">
                Ushbu sessiya rekordi
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Aktiv
              </span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#111111] dark:text-white">
              +{formatNumber(state.sessionBits, state.settings.compactNumbers)} B
            </div>
            <div className="text-xs text-[#777777] dark:text-[#94A3B8] mt-1 font-mono">
              Bosishlar: {state.sessionTaps} marta
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#777777] dark:text-[#94A3B8] uppercase">
                Barcha davrlar rekordi
              </span>
              <span className="text-xs font-mono font-bold text-[#111111] dark:text-white">
                Doimiy
              </span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#111111] dark:text-white">
              {formatNumber(state.lifetimeBits, state.settings.compactNumbers)} B
            </div>
            <div className="text-xs text-[#777777] dark:text-[#94A3B8] mt-1 font-mono">
              Jami bosishlar: {formatNumber(state.totalTaps)} marta · {state.dailyStreak} kunlik seriya
            </div>
          </div>
        </div>
      )}

      {/* Honest Anti-Bot Guarantee Notice */}
      <div className="p-4 rounded-2xl border border-[#EAEAEA] dark:border-[#263147] bg-[#FAFAFA] dark:bg-[#111624] flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-[#111111] dark:text-white">
            Shaxsiy rekordlar va ligalar
          </h4>
          <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5 leading-relaxed">
            Bu sahifadagi Bits, bosishlar va ligalar hozircha ushbu brauzerda saqlangan profilingizdan olinadi. Barcha o‘yinchilar uchun haqiqiy global TOP reytingni yoqish uchun doimiy server bazasini ulash kerak.
          </p>
        </div>
      </div>
    </div>
  );
}
