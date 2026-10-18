/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Sparkles, X, ShieldCheck, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { translations } from '../localization/translations';

const AVATAR_OPTIONS = [
  { id: 'avatar_1', color: 'bg-emerald-600', label: 'Emerald' },
  { id: 'avatar_2', color: 'bg-indigo-600', label: 'Indigo' },
  { id: 'avatar_3', color: 'bg-amber-600', label: 'Amber' },
  { id: 'avatar_4', color: 'bg-rose-600', label: 'Rose' },
  { id: 'avatar_5', color: 'bg-cyan-600', label: 'Cyan' },
  { id: 'avatar_6', color: 'bg-[#111111] dark:bg-white dark:text-[#111111]', label: 'Obsidian' },
];

export function AuthModal() {
  const { state, updateProfile, isAuthModalOpen, setIsAuthModalOpen } = useGame();
  const t = translations[state.settings.language];

  const [name, setName] = useState(state.profile?.name || '');
  const [username, setUsername] = useState(state.profile?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState(state.profile?.avatarId || 'avatar_1');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const isInitialSetup = !state.profile;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanUsername = username.trim().replace(/^@/, '');

    if (cleanName.length < 2) {
      setError(t.auth.errorNameRequired);
      return;
    }
    if (cleanUsername.length < 3) {
      setError(t.auth.errorUsernameRequired);
      return;
    }

    updateProfile({
      name: cleanName,
      username: cleanUsername,
      avatarId: selectedAvatar,
      createdAt: state.profile?.createdAt || Date.now(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-3xl p-6 sm:p-7 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-mono font-black flex items-center justify-center text-sm shadow-xs">
              B
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white leading-tight">
                {isInitialSetup ? t.auth.title : t.auth.editProfile}
              </h3>
            </div>
          </div>

          {!isInitialSetup && (
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] dark:text-[#99A2B3] hover:bg-[#F7F7F7] dark:hover:bg-[#1E273A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-[#777777] dark:text-[#94A3B8] leading-relaxed mb-5">
          {t.auth.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name input */}
          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E2E8F0] uppercase tracking-wider mb-1.5">
              {t.auth.nameLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                maxLength={30}
                placeholder={t.auth.namePlaceholder}
                className="w-full h-11 px-3.5 rounded-xl border border-[#EAEAEA] dark:border-[#263147] bg-[#F7F7F7] dark:bg-[#0E131F] text-sm text-[#111111] dark:text-white placeholder-[#999999] focus:outline-none focus:border-[#111111] dark:focus:border-white focus:bg-white dark:focus:bg-[#0E131F] transition-colors"
              />
            </div>
          </div>

          {/* Username input */}
          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E2E8F0] uppercase tracking-wider mb-1.5">
              {t.auth.usernameLabel}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 font-mono text-sm font-semibold text-[#777777]">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                  setUsername(cleaned);
                  setError(null);
                }}
                maxLength={20}
                placeholder={t.auth.usernamePlaceholder}
                className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-[#EAEAEA] dark:border-[#263147] bg-[#F7F7F7] dark:bg-[#0E131F] text-sm font-mono text-[#111111] dark:text-white placeholder-[#999999] focus:outline-none focus:border-[#111111] dark:focus:border-white focus:bg-white dark:focus:bg-[#0E131F] transition-colors"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-[#111111] dark:text-[#E2E8F0] uppercase tracking-wider mb-2">
              {t.auth.avatarLabel}
            </label>
            <div className="flex items-center gap-2.5">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`w-10 h-10 rounded-full ${avatar.color} text-white flex items-center justify-center transition-transform ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-[#111111] dark:ring-white scale-110'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <User className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation error notice */}
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full h-12 mt-2 rounded-xl bg-[#111111] dark:bg-white hover:bg-black dark:hover:bg-neutral-100 text-white dark:text-[#111111] font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-black/10 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{isInitialSetup ? t.auth.startButton : t.auth.saveButton}</span>
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-[#F0F0F0] dark:border-[#222C3F] flex items-center justify-center gap-1.5 text-[11px] text-[#777777] dark:text-[#94A3B8]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>BosiTap xavfsiz lokal profili</span>
        </div>
      </div>
    </div>
  );
}
