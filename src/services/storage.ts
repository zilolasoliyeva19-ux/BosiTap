/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameSettings, GameState, UserProfile } from '../types/game';

const STORAGE_KEY = 'bositap_save_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  compactNumbers: false,
  language: 'uz', // Default is now Uzbek as requested
  theme: 'light',
};

export const INITIAL_STATE: GameState = {
  version: 1,
  profile: null,
  bits: 0,
  lifetimeBits: 0,
  totalTaps: 0,
  level: 1,
  exp: 0,
  sessionBits: 0,
  sessionTaps: 0,
  sessionStartTime: Date.now(),
  lastActiveTime: Date.now(),
  lastDailyClaimTime: null,
  dailyStreak: 0,
  upgrades: {},
  unlockedAchievements: {},
  claimedAchievements: {},
  overclockBoostActiveUntil: 0,
  settings: DEFAULT_SETTINGS,
};

function sanitizeNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return Math.max(0, value);
  }
  return fallback;
}

export function loadGameState(): GameState {
  if (typeof window === 'undefined') return INITIAL_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_STATE, sessionStartTime: Date.now(), lastActiveTime: Date.now() };

    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return INITIAL_STATE;

    const validatedSettings: GameSettings = {
      soundEnabled: Boolean(parsed.settings?.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled),
      hapticsEnabled: Boolean(parsed.settings?.hapticsEnabled ?? DEFAULT_SETTINGS.hapticsEnabled),
      reducedMotion: Boolean(parsed.settings?.reducedMotion ?? DEFAULT_SETTINGS.reducedMotion),
      compactNumbers: Boolean(parsed.settings?.compactNumbers ?? DEFAULT_SETTINGS.compactNumbers),
      language: parsed.settings?.language === 'en' ? 'en' : 'uz', // default 'uz'
      theme: parsed.settings?.theme === 'dark' ? 'dark' : 'light',
    };

    let validatedProfile: UserProfile | null = null;
    if (parsed.profile && typeof parsed.profile === 'object' && parsed.profile.name && parsed.profile.username) {
      validatedProfile = {
        name: String(parsed.profile.name).trim().slice(0, 30),
        username: String(parsed.profile.username).trim().replace(/^@/, '').slice(0, 20),
        avatarId: String(parsed.profile.avatarId || 'avatar_1'),
        createdAt: Number(parsed.profile.createdAt || Date.now()),
        telegramId: typeof parsed.profile.telegramId === 'number' ? parsed.profile.telegramId : undefined,
        isTelegramLinked: Boolean(parsed.profile.isTelegramLinked),
        telegramPhotoUrl: typeof parsed.profile.telegramPhotoUrl === 'string' ? parsed.profile.telegramPhotoUrl : undefined,
      };
    }

    const validatedUpgrades: Record<string, number> = {};
    if (parsed.upgrades && typeof parsed.upgrades === 'object') {
      for (const [k, v] of Object.entries(parsed.upgrades)) {
        const num = sanitizeNumber(v, 0);
        if (num > 0) validatedUpgrades[k] = Math.floor(num);
      }
    }

    const validatedAchievements: Record<string, number> = {};
    if (parsed.unlockedAchievements && typeof parsed.unlockedAchievements === 'object') {
      for (const [k, v] of Object.entries(parsed.unlockedAchievements)) {
        validatedAchievements[k] = sanitizeNumber(v, Date.now());
      }
    }

    const validatedClaimed: Record<string, boolean> = {};
    if (parsed.claimedAchievements && typeof parsed.claimedAchievements === 'object') {
      for (const [k, v] of Object.entries(parsed.claimedAchievements)) {
        if (v) validatedClaimed[k] = true;
      }
    }

    return {
      version: 1,
      profile: validatedProfile,
      bits: sanitizeNumber(parsed.bits, 0),
      lifetimeBits: sanitizeNumber(parsed.lifetimeBits, 0),
      totalTaps: sanitizeNumber(parsed.totalTaps, 0),
      level: Math.max(1, sanitizeNumber(parsed.level, 1)),
      exp: sanitizeNumber(parsed.exp, 0),
      sessionBits: 0,
      sessionTaps: 0,
      sessionStartTime: Date.now(),
      lastActiveTime: sanitizeNumber(parsed.lastActiveTime, Date.now()),
      lastDailyClaimTime: parsed.lastDailyClaimTime ? sanitizeNumber(parsed.lastDailyClaimTime, 0) : null,
      dailyStreak: sanitizeNumber(parsed.dailyStreak, 0),
      upgrades: validatedUpgrades,
      unlockedAchievements: validatedAchievements,
      claimedAchievements: validatedClaimed,
      overclockBoostActiveUntil: 0,
      settings: validatedSettings,
    };
  } catch (err) {
    console.error('BosiTap: Error reading saved state, starting fresh:', err);
    return INITIAL_STATE;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    const toSave: Partial<GameState> = {
      version: state.version,
      profile: state.profile,
      bits: state.bits,
      lifetimeBits: state.lifetimeBits,
      totalTaps: state.totalTaps,
      level: state.level,
      exp: state.exp,
      lastActiveTime: Date.now(),
      lastDailyClaimTime: state.lastDailyClaimTime,
      dailyStreak: state.dailyStreak,
      upgrades: state.upgrades,
      unlockedAchievements: state.unlockedAchievements,
      claimedAchievements: state.claimedAchievements,
      settings: state.settings,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('BosiTap: Could not write to localStorage', err);
  }
}

export function clearGameState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function getStorageSizeEstimate(): string {
  if (typeof window === 'undefined') return '0 KB';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return '0.2 KB';
    const bytes = new Blob([raw]).size;
    return `${(bytes / 1024).toFixed(1)} KB`;
  } catch {
    return '0.5 KB';
  }
}
