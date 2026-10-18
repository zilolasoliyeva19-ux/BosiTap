/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from 'react';
import { User, Sparkles, X, ShieldCheck, Check, LogOut, LockKeyhole, Clock3 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { translations } from '../localization/translations';
import { telegramService, TelegramAuthSession } from '../services/telegramBotService';
import { getProfileEditPolicy, registerProfileEdit, signOutCurrentProfile } from '../utils/profilePolicy';

const AVATAR_OPTIONS = [
  { id: 'avatar_1', color: 'bg-emerald-600' },
  { id: 'avatar_2', color: 'bg-indigo-600' },
  { id: 'avatar_3', color: 'bg-amber-600' },
  { id: 'avatar_4', color: 'bg-rose-600' },
  { id: 'avatar_5', color: 'bg-cyan-600' },
  { id: 'avatar_6', color: 'bg-[#111111] dark:bg-white dark:text-[#111111]' },
];

function formatRemaining(ms: number): string {
  const totalHours = Math.max(1, Math.ceil(ms / (60 * 60 * 1000)));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return days > 0 ? `${days} kun ${hours} soat` : `${hours} soat`;
}

export function AuthModal() {
  const { state, updateProfile, isAuthModalOpen, setIsAuthModalOpen } = useGame();
  const t = translations[state.settings.language];
  const [name, setName] = useState(state.profile?.name || '');
  const [username, setUsername] = useState(state.profile?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState(state.profile?.avatarId || 'avatar_1');
  const [error, setError] = useState<string | null>(null);
  const [telegramSession, setTelegramSession] = useState<TelegramAuthSession | null>(null);
  const [telegramLoading, setTelegramLoading] = useState(false);

  useEffect(() => {
    if (!telegramSession) return;
    let active = true;
    let checking = false;
    const pollStatus = async () => {
      if (checking || !active) return;
      checking = true;
      try {
        const result = await telegramService.checkAuthSession(telegramSession.code);
        if (!active) return;
        if (result?.status === 'verified' && result.telegramUser) {
          updateProfile(result.telegramUser);
          setTelegramSession(null);
          setIsAuthModalOpen(false);
        } else if (Date.now() >= telegramSession.expiresAt) {
          setError('Telegram ulanish kodi muddati tugadi. Yangi kod yarating.');
          setTelegramSession(null);
        }
      } finally {
        checking = false;
      }
    };
    void pollStatus();
    const interval = window.setInterval(() => void pollStatus(), 1500);
    return () => { active = false; window.clearInterval(interval); };
  }, [telegramSession, updateProfile, setIsAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isInitialSetup = !state.profile;
  const isTelegramAccount = Boolean(state.profile?.isTelegramLinked || state.profile?.telegramId);
  const editPolicy = state.profile && !isTelegramAccount ? getProfileEditPolicy(state.profile) : { editsUsed: 0, cooldownUntil: 0 };
  const editLocked = Boolean(editPolicy.cooldownUntil && Date.now() < editPolicy.cooldownUntil);

  const handleTelegramLogin = async () => {
    setTelegramLoading(true);
    setError(null);
    try {
      setTelegramSession(await telegramService.createAuthSession());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Telegram bilan ulanishda xatolik.');
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTelegramAccount) {
      setError('Telegram orqali kirilgan akkaunt profilini tahrirlab bo‘lmaydi. Faqat chiqish mumkin.');
      return;
    }
    if (editLocked) {
      setError(`Profil tahriri vaqtincha yopilgan. ${formatRemaining(editPolicy.cooldownUntil - Date.now())} dan keyin qayta urinib ko‘ring.`);
      return;
    }
    const cleanName = name.trim();
    const cleanUsername = username.trim().replace(/^@/, '');
    if (cleanName.length < 2) { setError(t.auth.errorNameRequired); return; }
    if (cleanUsername.length < 3) { setError(t.auth.errorUsernameRequired); return; }

    const hasChanges = Boolean(state.profile && (
      cleanName !== state.profile.name ||
      cleanUsername !== state.profile.username ||
      selectedAvatar !== state.profile.avatarId
    ));
    if (state.profile && hasChanges) registerProfileEdit(state.profile);

    updateProfile({
      name: cleanName,
      username: cleanUsername,
      avatarId: selectedAvatar,
      createdAt: state.profile?.createdAt || Date.now(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white dark:bg-[#151C2C] border border-[#EAEAEA] dark:border-[#263147] rounded-3xl p-6 sm:p-7 shadow-2xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-mono font-black flex items-center justify-center text-sm">B</div>
            <h3 className="text-lg font-bold text-[#111111] dark:text-white leading-tight">
              {isTelegramAccount ? 'Telegram akkaunti' : isInitialSetup ? t.auth.title : t.auth.editProfile}
            </h3>
          </div>
          {!isInitialSetup && (
            <button onClick={() => setIsAuthModalOpen(false)} aria-label="Yopish" className="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] dark:text-[#99A2B3] hover:bg-[#F7F7F7] dark:hover:bg-[#1E273A]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isTelegramAccount ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/30">
              <div className="flex items-center gap-2 font-semibold text-sky-900 dark:text-sky-200"><LockKeyhole className="w-4 h-4" /> Telegram bilan himoyalangan profil</div>
              <p className="text-sm text-sky-800 dark:text-sky-300 mt-2">Telegram orqali kirilgan akkauntda ism, username va avatar o‘zgartirilmaydi. Akkauntdan chiqishingiz mumkin.</p>
              <p className="text-sm font-semibold text-sky-900 dark:text-sky-200 mt-3">{state.profile?.name} · @{state.profile?.username}</p>
            </div>
            <button type="button" onClick={signOutCurrentProfile} className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Akkauntdan chiqish
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#777777] dark:text-[#94A3B8] leading-relaxed mb-5">
              {isInitialSetup ? t.auth.subtitle : 'Profilni ko‘pi bilan 2 marta tahrirlashingiz mumkin. Ikkinchi tahrirdan keyin 7 kun kutish kerak.'}
            </p>

            {editLocked && (
              <div className="mb-4 p-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs flex gap-2">
                <Clock3 className="w-4 h-4 shrink-0" />
                <span>Profil tahriri vaqtincha yopiq. Qayta tahrirlashgacha {formatRemaining(editPolicy.cooldownUntil - Date.now())} qoldi.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] dark:text-[#E2E8F0] uppercase tracking-wider mb-1.5">{t.auth.nameLabel}</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(null); }} disabled={editLocked} maxLength={30} placeholder={t.auth.namePlaceholder} className="w-full h-11 px-3.5 rounded-xl border border-[#EAEAEA] dark:border-[#263147] bg-[#F7F7F7] dark:bg-[#0E131F] text-sm text-[#111111] dark:text-white disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111111] dark:text-[#E2E8F0] uppercase tracking-wider mb-1.5">{t.auth.usernameLabel}</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 font-mono text-sm font-semibold text-[#777777]">@</span>
                  <input type="text" value={username} onChange={(e) => { setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '')); setError(null); }} disabled={editLocked} maxLength={20} placeholder={t.auth.usernamePlaceholder} className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-[#EAEAEA] dark:border-[#263147] bg-[#F7F7F7] dark:bg-[#0E131F] text-sm font-mono text-[#111111] dark:text-white disabled:opacity-50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111111] dark:text-[#E2E8F0] uppercase tracking-wider mb-2">{t.auth.avatarLabel}</label>
                <div className="flex items-center gap-2.5">
                  {AVATAR_OPTIONS.map((avatar) => {
                    const selected = selectedAvatar === avatar.id;
                    return <button key={avatar.id} type="button" disabled={editLocked} onClick={() => setSelectedAvatar(avatar.id)} aria-label={avatar.id} className={`w-10 h-10 rounded-full ${avatar.color} text-white flex items-center justify-center disabled:opacity-40 ${selected ? 'ring-2 ring-offset-2 ring-[#111111] dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}>{selected ? <Check className="w-4 h-4 stroke-[3]" /> : <User className="w-4 h-4" />}</button>;
                  })}
                </div>
              </div>
              {error && <div role="alert" className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">{error}</div>}
              <button type="submit" disabled={editLocked} className="w-full h-12 mt-1 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>{isInitialSetup ? t.auth.startButton : t.auth.saveButton}</span>
              </button>
            </form>

            <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-[#999999]"><div className="h-px flex-1 bg-[#EAEAEA] dark:bg-[#263147]" /><span>yoki</span><div className="h-px flex-1 bg-[#EAEAEA] dark:bg-[#263147]" /></div>
            <button type="button" onClick={() => void handleTelegramLogin()} disabled={telegramLoading || Boolean(telegramSession)} className="w-full min-h-11 rounded-xl border border-[#D8E7F8] dark:border-[#263147] bg-[#F0F7FF] dark:bg-[#172338] text-[#145A9E] dark:text-[#93C5FD] font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              <span>✈️</span><span>{telegramLoading ? 'Ulanish kodi yaratilmoqda…' : telegramSession ? 'Telegram tasdiqlash kutilmoqda…' : 'Telegram orqali kirish'}</span>
            </button>
            {telegramSession && (
              <div className="mt-3 p-3 rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/30 text-center">
                <p className="text-xs text-sky-900 dark:text-sky-200 mb-2">Botni oching. Telegram hisobingiz tasdiqlangach profil avtomatik ulanadi.</p>
                <a href={telegramSession.deepLink} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold">Telegram botni ochish ↗</a>
                <p className="mt-2 text-[10px] text-sky-800 dark:text-sky-300">Kod 5 daqiqa amal qiladi.</p>
              </div>
            )}
          </>
        )}

        <div className="mt-4 pt-3 border-t border-[#F0F0F0] dark:border-[#222C3F] flex items-center justify-center gap-1.5 text-[11px] text-[#777777] dark:text-[#94A3B8]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /><span>Telegram tasdiqlashi serverda tekshiriladi</span>
        </div>
      </div>
    </div>
  );
}
