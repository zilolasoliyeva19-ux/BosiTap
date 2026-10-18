/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Volume2,
  Smartphone,
  Eye,
  Hash,
  Globe,
  Database,
  Trash2,
  Cpu,
  User,
  Moon,
  Sun,
  Edit3,
  ShieldCheck,
} from 'lucide-react';
import { ResetConfirmModal } from '../components/ResetConfirmModal';
import { useGame } from '../context/GameContext';
import { translations } from '../localization/translations';
import { getStorageSizeEstimate } from '../services/storage';

export function SettingsPage() {
  const { state, updateSettings, toggleTheme, setIsAuthModalOpen, antiCheatBlockedCount } = useGame();
  const t = translations[state.settings.language];
  const [showResetModal, setShowResetModal] = useState(false);
  const isDark = state.settings.theme === 'dark';

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 transition-colors">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111111] dark:text-white tracking-tight">
          {t.settings.title}
        </h2>
        <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">
          {t.settings.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* User Profile Card */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                  {state.profile ? state.profile.name : t.settings.profileTitle}
                </h3>
                {state.profile && (
                  <span className="text-xs text-[#777777] dark:text-[#94A3B8] font-mono">
                    @{state.profile.username}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">
                {t.settings.profileDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[#EAEAEA] dark:border-[#263147] bg-[#F7F7F7] dark:bg-[#1A2234] hover:bg-[#EAEAEA] dark:hover:bg-[#202B40] text-xs font-semibold text-[#111111] dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.settings.editProfileBtn}</span>
          </button>
        </div>

        {/* Theme Toggle: Dark / Light */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] flex items-center justify-center text-[#111111] dark:text-white">
              {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                {t.settings.themeTitle}
              </h3>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">
                {t.settings.themeDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F7F7F7] dark:bg-[#1A2234] p-1 rounded-xl border border-[#EAEAEA] dark:border-[#263147]">
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'light' })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                !isDark
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#777777] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {t.settings.lightTheme}
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                isDark
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#777777] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {t.settings.darkTheme}
            </button>
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] flex items-center justify-center text-[#111111] dark:text-white">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">{t.settings.soundTitle}</h3>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">{t.settings.soundDesc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
            aria-pressed={state.settings.soundEnabled}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              state.settings.soundEnabled ? 'bg-[#111111] dark:bg-white' : 'bg-[#E5E5E5] dark:bg-[#2C384F]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-[#111111] shadow-xs transition-transform ${
                state.settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Haptics Toggle */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] flex items-center justify-center text-[#111111] dark:text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">{t.settings.hapticsTitle}</h3>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">{t.settings.hapticsDesc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ hapticsEnabled: !state.settings.hapticsEnabled })}
            aria-pressed={state.settings.hapticsEnabled}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              state.settings.hapticsEnabled ? 'bg-[#111111] dark:bg-white' : 'bg-[#E5E5E5] dark:bg-[#2C384F]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-[#111111] shadow-xs transition-transform ${
                state.settings.hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] flex items-center justify-center text-[#111111] dark:text-white">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">{t.settings.reducedMotionTitle}</h3>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">{t.settings.reducedMotionDesc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ reducedMotion: !state.settings.reducedMotion })}
            aria-pressed={state.settings.reducedMotion}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              state.settings.reducedMotion ? 'bg-[#111111] dark:bg-white' : 'bg-[#E5E5E5] dark:bg-[#2C384F]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-[#111111] shadow-xs transition-transform ${
                state.settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Compact Numbers Format */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] flex items-center justify-center text-[#111111] dark:text-white">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">{t.settings.compactNumbersTitle}</h3>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">{t.settings.compactNumbersDesc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ compactNumbers: !state.settings.compactNumbers })}
            aria-pressed={state.settings.compactNumbers}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              state.settings.compactNumbers ? 'bg-[#111111] dark:bg-white' : 'bg-[#E5E5E5] dark:bg-[#2C384F]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-[#111111] shadow-xs transition-transform ${
                state.settings.compactNumbers ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Language Selection: Uzbek (Default) / English */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] flex items-center justify-center text-[#111111] dark:text-white">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">{t.settings.languageTitle}</h3>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">{t.settings.languageDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F7F7F7] dark:bg-[#1A2234] p-1 rounded-xl border border-[#EAEAEA] dark:border-[#263147]">
            <button
              type="button"
              onClick={() => updateSettings({ language: 'uz' })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                state.settings.language === 'uz'
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs'
                  : 'text-[#777777] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              O&apos;zbekcha (Default)
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ language: 'en' })}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                state.settings.language === 'en'
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs'
                  : 'text-[#777777] dark:text-[#94A3B8] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Storage Size Diagnostic */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] dark:bg-[#1E2638] border border-[#EAEAEA] dark:border-[#283248] flex items-center justify-center text-[#111111] dark:text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">{t.settings.dataManagement}</h3>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">{t.settings.saveDataSize}</p>
            </div>
          </div>
          <span className="font-mono text-xs font-semibold text-[#111111] dark:text-white">
            {getStorageSizeEstimate()}
          </span>
        </div>

        {/* Anti-Cheat Protection Diagnostic Card */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                  {t.antiCheat.statusActive}
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md">
                  {t.antiCheat.securityBadge}
                </span>
              </div>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">
                {t.antiCheat.statusDesc}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-semibold text-[#111111] dark:text-white">
              {antiCheatBlockedCount} ta bloklandi
            </span>
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="p-4 bg-white dark:bg-[#151C2C] border border-rose-200 dark:border-rose-900/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">{t.settings.resetTitle}</h3>
              <p className="text-xs text-[#777777] dark:text-[#94A3B8] mt-0.5">{t.settings.resetDesc}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold active:scale-98 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
          >
            {t.settings.resetButton}
          </button>
        </div>

        {/* Version & Architecture Footnote */}
        <div className="p-4 rounded-2xl border border-[#EAEAEA] dark:border-[#263147] bg-[#FAFAFA] dark:bg-[#111624] flex items-center gap-3">
          <Cpu className="w-4 h-4 text-[#777777] dark:text-[#94A3B8] shrink-0" />
          <div className="text-xs text-[#777777] dark:text-[#94A3B8]">
            <span className="font-bold text-[#111111] dark:text-white">BosiTap v1.3.0</span> · {t.settings.engine}
          </div>
        </div>
      </div>

      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
}
