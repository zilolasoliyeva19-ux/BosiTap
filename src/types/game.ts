/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'uz';
export type Theme = 'light' | 'dark';

export interface UserProfile {
  name: string;
  username: string;
  avatarId: string;
  createdAt: number;
  telegramId?: number;
  isTelegramLinked?: boolean;
  telegramPhotoUrl?: string;
  telegramUsername?: string;
  telegramAuthDate?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  compactNumbers: boolean;
  language: Language;
  theme: Theme;
}

export interface UpgradeDefinition {
  id: string;
  name: Record<Language, string>;
  category: 'tap' | 'miner' | 'multiplier' | 'booster';
  description: Record<Language, string>;
  baseCost: number;
  costMultiplier: number;
  baseBenefit: number;
  benefitMultiplier: number;
  benefitUnit: string;
  maxLevel?: number;
  iconName: string;
  minLevelToUnlock?: number;
  minTapsToUnlock?: number;
}

export interface DailyRewardTier {
  day: number;
  bits: number;
  multiplierText?: string;
  isSpecial?: boolean;
}

export interface AchievementDefinition {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  rewardBits: number;
  iconName: string;
  category: 'taps' | 'bits' | 'upgrades' | 'streak' | 'level';
  targetValue: number;
  checkUnlocked: (state: GameState) => boolean;
  getProgress: (state: GameState) => number;
}

export interface FloatingTextItem {
  id: string;
  x: number;
  y: number;
  amount: number;
  isCrit?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  username: string;
  avatarId: string;
  lifetimeBits: number;
  passiveRate: number;
  division: string;
  isCurrentUser?: boolean;
}

export interface AntiCheatStatus {
  suspiciousTapsBlocked: number;
  isThrottled: boolean;
  throttleEndsAt: number;
  lastAnomalyType: 'autoclicker_rate' | 'zero_variance' | 'synthetic_event' | 'coordinate_macro' | null;
}

export interface GameState {
  version: number;
  profile: UserProfile | null;
  bits: number;
  lifetimeBits: number;
  totalTaps: number;
  level: number;
  exp: number;
  sessionBits: number;
  sessionTaps: number;
  sessionStartTime: number;
  lastActiveTime: number;
  lastDailyClaimTime: number | null;
  dailyStreak: number;
  upgrades: Record<string, number>; // upgradeId -> level
  unlockedAchievements: Record<string, number>; // achievementId -> unlockedAt timestamp
  claimedAchievements: Record<string, boolean>; // achievementId -> claimed
  overclockBoostActiveUntil: number; // timestamp
  settings: GameSettings;
}

export interface DerivedGameMetrics {
  tapPower: number;
  passivePerSecond: number;
  effectiveMultiplier: number;
  isOverclockActive: boolean;
  overclockRemainingSeconds: number;
  nextLevelBitsRequired: number;
  levelProgressRatio: number;
  totalUpgradesPurchased: number;
  comboCount: number;
}
