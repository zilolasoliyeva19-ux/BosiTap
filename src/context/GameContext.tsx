/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ACHIEVEMENTS } from '../data/achievementsData';
import { UPGRADE_DEFINITIONS, getUpgradeBenefit, getUpgradeCost } from '../data/upgradesData';
import {
  clearGameState,
  INITIAL_STATE,
  loadGameState,
  saveGameState,
} from '../services/storage';
import {
  DerivedGameMetrics,
  FloatingTextItem,
  GameSettings,
  GameState,
  UserProfile,
} from '../types/game';
import { telegramService } from '../services/telegramBotService';
import { antiCheat } from '../utils/antiCheat';
import { playHaptic, soundEngine } from '../utils/audio';
import { getLevelProgress } from '../utils/format';

interface OfflineReport {
  bits: number;
  durationSeconds: number;
}

export type TabType = 'home' | 'upgrades' | 'daily' | 'stats' | 'leaderboard' | 'settings';

export interface AntiCheatWarning {
  anomaly: string;
  remainingSeconds: number;
}

interface GameContextType {
  state: GameState;
  metrics: DerivedGameMetrics;
  floatingTexts: FloatingTextItem[];
  offlineReport: OfflineReport | null;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  levelUpNotification: number | null;
  antiCheatWarning: AntiCheatWarning | null;
  dismissAntiCheatWarning: () => void;
  antiCheatBlockedCount: number;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isTelegramBotModalOpen: boolean;
  setIsTelegramBotModalOpen: (open: boolean) => void;
  updateProfile: (profile: UserProfile) => void;
  linkTelegramProfile: (tgData: { id: number; name: string; username: string; photoUrl?: string }) => void;
  unlinkTelegramProfile: () => void;
  toggleTheme: () => void;
  tapCoin: (x?: number, y?: number, meta?: { isTrusted?: boolean; clientX?: number; clientY?: number }) => boolean;
  buyUpgrade: (id: string) => boolean;
  claimDailyReward: () => boolean;
  claimAchievement: (id: string) => boolean;
  activateOverclock: () => boolean;
  overclockCooldownSeconds: number;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetProgress: () => void;
  dismissOfflineReport: () => void;
  dismissLevelUpNotification: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => loadGameState());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(null);
  const [levelUpNotification, setLevelUpNotification] = useState<number | null>(null);
  const [antiCheatWarning, setAntiCheatWarning] = useState<AntiCheatWarning | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => !state.profile);
  const [combo, setCombo] = useState<number>(0);
  const [lastOverclockUsedTime, setLastOverclockUsedTime] = useState<number>(0);

  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  // Anti-cheat cooldown countdown
  useEffect(() => {
    if (!antiCheatWarning) return;
    const interval = setInterval(() => {
      const remaining = antiCheat.getThrottleRemainingSeconds();
      if (remaining <= 0) {
        setAntiCheatWarning(null);
      } else {
        setAntiCheatWarning((prev) => (prev ? { ...prev, remainingSeconds: remaining } : null));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [antiCheatWarning]);

  // Sync theme with document element
  useEffect(() => {
    if (state.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.settings.theme]);

  // Sync sound settings with audio engine
  useEffect(() => {
    soundEngine.setMuted(!state.settings.soundEnabled);
  }, [state.settings.soundEnabled]);

  // Prompt auth if profile is missing
  useEffect(() => {
    if (!state.profile) {
      setIsAuthModalOpen(true);
    }
  }, [state.profile]);

  // Offline earnings calculation on mount
  useEffect(() => {
    const now = Date.now();
    const lastActive = state.lastActiveTime;
    const elapsedSeconds = Math.max(0, Math.floor((now - lastActive) / 1000));

    let basePassive = 0;
    for (const def of UPGRADE_DEFINITIONS) {
      if (def.category === 'miner') {
        const lvl = state.upgrades[def.id] || 0;
        basePassive += getUpgradeBenefit(def, lvl);
      }
    }
    const minerMultiplier = 1 + (state.upgrades['mult_flux_overclock'] || 0) * 0.20;
    const passivePerSec = Math.floor(basePassive * minerMultiplier);

    const vaultLvl = state.upgrades['boost_offline_vault'] || 0;
    const maxOfflineSeconds = (3 + vaultLvl * 3) * 3600;

    if (elapsedSeconds >= 15 && passivePerSec > 0) {
      const cappedSeconds = Math.min(elapsedSeconds, maxOfflineSeconds);
      const earnedOfflineBits = Math.floor(cappedSeconds * passivePerSec);

      if (earnedOfflineBits > 0) {
        setOfflineReport({
          bits: earnedOfflineBits,
          durationSeconds: cappedSeconds,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute derived metrics
  const metrics = useMemo<DerivedGameMetrics>(() => {
    const now = Date.now();
    const isOverclockActive = now < state.overclockBoostActiveUntil;
    const overclockRemainingSeconds = isOverclockActive
      ? Math.max(0, Math.ceil((state.overclockBoostActiveUntil - now) / 1000))
      : 0;

    let tapBonus = 0;
    for (const def of UPGRADE_DEFINITIONS) {
      if (def.category === 'tap') {
        const lvl = state.upgrades[def.id] || 0;
        tapBonus += getUpgradeBenefit(def, lvl);
      }
    }
    const tapMultiplier = 1 + (state.upgrades['mult_kinetic_resonator'] || 0) * 0.15;
    const overclockTapMult = isOverclockActive ? 2 : 1;
    const tapPower = Math.max(1, Math.floor((1 + tapBonus) * tapMultiplier * overclockTapMult));

    let basePassive = 0;
    for (const def of UPGRADE_DEFINITIONS) {
      if (def.category === 'miner') {
        const lvl = state.upgrades[def.id] || 0;
        basePassive += getUpgradeBenefit(def, lvl);
      }
    }
    const minerMultiplier = 1 + (state.upgrades['mult_flux_overclock'] || 0) * 0.20;
    const passivePerSecond = Math.floor(basePassive * minerMultiplier * overclockTapMult);

    const levelInfo = getLevelProgress(state.lifetimeBits, state.level);
    const totalUpgradesPurchased = Object.values(state.upgrades).reduce((acc, v) => acc + v, 0);

    return {
      tapPower,
      passivePerSecond,
      effectiveMultiplier: tapMultiplier * overclockTapMult,
      isOverclockActive,
      overclockRemainingSeconds,
      nextLevelBitsRequired: levelInfo.expRequired,
      levelProgressRatio: levelInfo.progressRatio,
      totalUpgradesPurchased,
      comboCount: combo,
    };
  }, [state, combo]);

  const evaluateAchievements = (currentState: GameState): GameState => {
    let changed = false;
    const unlockedMap = { ...currentState.unlockedAchievements };

    for (const ach of ACHIEVEMENTS) {
      if (!unlockedMap[ach.id] && ach.checkUnlocked(currentState)) {
        unlockedMap[ach.id] = Date.now();
        changed = true;
      }
    }

    if (changed) {
      return { ...currentState, unlockedAchievements: unlockedMap };
    }
    return currentState;
  };

  // Passive income ticker (1s)
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        let basePassive = 0;
        for (const def of UPGRADE_DEFINITIONS) {
          if (def.category === 'miner') {
            const lvl = prev.upgrades[def.id] || 0;
            basePassive += getUpgradeBenefit(def, lvl);
          }
        }
        const minerMultiplier = 1 + (prev.upgrades['mult_flux_overclock'] || 0) * 0.20;
        const isOverclock = Date.now() < prev.overclockBoostActiveUntil;
        const rate = Math.floor(basePassive * minerMultiplier * (isOverclock ? 2 : 1));

        if (rate <= 0) {
          return { ...prev, lastActiveTime: Date.now() };
        }

        const newBits = prev.bits + rate;
        const newLifetime = prev.lifetimeBits + rate;
        const newSessionBits = prev.sessionBits + rate;

        const levelInfo = getLevelProgress(newLifetime, prev.level);
        let nextLevel = prev.level;
        if (levelInfo.currentLevel > prev.level) {
          nextLevel = levelInfo.currentLevel;
          setLevelUpNotification(nextLevel);
          soundEngine.playLevelUp();
        }

        let updated: GameState = {
          ...prev,
          bits: newBits,
          lifetimeBits: newLifetime,
          sessionBits: newSessionBits,
          level: nextLevel,
          lastActiveTime: Date.now(),
        };

        updated = evaluateAchievements(updated);
        saveGameState(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Periodic autosave
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGameState(stateRef.current);
    }, 3000);
    return () => clearInterval(saveInterval);
  }, []);

  const tapCoin = (
    x?: number,
    y?: number,
    meta?: { isTrusted?: boolean; clientX?: number; clientY?: number }
  ): boolean => {
    // 1. Anti-Cheat verification (Rate limits, isTrusted check, zero-variance macro detection)
    const validation = antiCheat.validateTap({
      isTrusted: meta?.isTrusted,
      clientX: meta?.clientX ?? x ?? 0,
      clientY: meta?.clientY ?? y ?? 0,
    });

    if (!validation.allowed) {
      const remaining = antiCheat.getThrottleRemainingSeconds();
      setAntiCheatWarning({
        anomaly: validation.anomaly || 'autoclicker_rate',
        remainingSeconds: remaining,
      });
      if (state.settings.hapticsEnabled) {
        playHaptic(35);
      }
      return false;
    }

    if (antiCheatWarning) {
      setAntiCheatWarning(null);
    }

    setCombo((prev) => Math.min(prev + 1, 50));
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, 1100);

    soundEngine.playTap(combo);
    if (state.settings.hapticsEnabled) {
      playHaptic(14);
    }

    const isCrit = Math.random() < 0.06;
    const earnedAmount = isCrit ? Math.floor(metrics.tapPower * 2) : metrics.tapPower;

    const textId = `${Date.now()}_${Math.random()}`;
    const targetX = x !== undefined ? x : (typeof window !== 'undefined' ? window.innerWidth / 2 : 200);
    const targetY = y !== undefined ? y : 350;

    setFloatingTexts((prev) => [
      ...prev.slice(-15),
      { id: textId, x: targetX, y: targetY, amount: earnedAmount, isCrit },
    ]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== textId));
    }, 950);

    setState((prev) => {
      const newBits = prev.bits + earnedAmount;
      const newLifetime = prev.lifetimeBits + earnedAmount;
      const newTaps = prev.totalTaps + 1;
      const newSessionBits = prev.sessionBits + earnedAmount;
      const newSessionTaps = prev.sessionTaps + 1;

      const levelInfo = getLevelProgress(newLifetime, prev.level);
      let nextLevel = prev.level;
      if (levelInfo.currentLevel > prev.level) {
        nextLevel = levelInfo.currentLevel;
        setLevelUpNotification(nextLevel);
        soundEngine.playLevelUp();
      }

      let updated: GameState = {
        ...prev,
        bits: newBits,
        lifetimeBits: newLifetime,
        totalTaps: newTaps,
        sessionBits: newSessionBits,
        sessionTaps: newSessionTaps,
        level: nextLevel,
        lastActiveTime: Date.now(),
      };

      updated = evaluateAchievements(updated);
      return updated;
    });

    return true;
  };

  const dismissAntiCheatWarning = () => {
    antiCheat.clearThrottle();
    setAntiCheatWarning(null);
  };

  const buyUpgrade = (upgradeId: string): boolean => {
    const def = UPGRADE_DEFINITIONS.find((u) => u.id === upgradeId);
    if (!def) return false;

    const currentLvl = state.upgrades[upgradeId] || 0;
    if (def.maxLevel && currentLvl >= def.maxLevel) return false;

    const cost = getUpgradeCost(def, currentLvl);
    if (state.bits < cost) return false;

    soundEngine.playPurchase();
    if (state.settings.hapticsEnabled) {
      playHaptic(25);
    }

    setState((prev) => {
      const newUpgrades = {
        ...prev.upgrades,
        [upgradeId]: currentLvl + 1,
      };

      let updated: GameState = {
        ...prev,
        bits: prev.bits - cost,
        upgrades: newUpgrades,
        lastActiveTime: Date.now(),
      };

      updated = evaluateAchievements(updated);
      saveGameState(updated);
      return updated;
    });

    return true;
  };

  const claimDailyReward = (): boolean => {
    const now = Date.now();
    const lastClaim = state.lastDailyClaimTime;

    if (lastClaim && now - lastClaim < 24 * 3600 * 1000) {
      return false;
    }

    let newStreak = 1;
    if (lastClaim) {
      const hoursSinceLastClaim = (now - lastClaim) / (3600 * 1000);
      if (hoursSinceLastClaim <= 48) {
        newStreak = state.dailyStreak + 1;
      } else {
        newStreak = 1;
      }
    }

    const streakDayMod = ((newStreak - 1) % 7) + 1;
    const baseReward = 80;
    const streakMultiplier = Math.pow(1.5, streakDayMod - 1);
    const rewardBits = Math.floor(baseReward * streakMultiplier * (streakDayMod === 7 ? 2 : 1));

    soundEngine.playRewardClaim();
    if (state.settings.hapticsEnabled) {
      playHaptic(40);
    }

    setState((prev) => {
      let updated: GameState = {
        ...prev,
        bits: prev.bits + rewardBits,
        lifetimeBits: prev.lifetimeBits + rewardBits,
        sessionBits: prev.sessionBits + rewardBits,
        dailyStreak: newStreak,
        lastDailyClaimTime: now,
        lastActiveTime: now,
      };

      updated = evaluateAchievements(updated);
      saveGameState(updated);
      return updated;
    });

    return true;
  };

  const claimAchievement = (achId: string): boolean => {
    const ach = ACHIEVEMENTS.find((a) => a.id === achId);
    if (!ach) return false;

    if (!state.unlockedAchievements[achId] || state.claimedAchievements[achId]) {
      return false;
    }

    soundEngine.playRewardClaim();
    if (state.settings.hapticsEnabled) {
      playHaptic(30);
    }

    setState((prev) => {
      let updated: GameState = {
        ...prev,
        bits: prev.bits + ach.rewardBits,
        lifetimeBits: prev.lifetimeBits + ach.rewardBits,
        sessionBits: prev.sessionBits + ach.rewardBits,
        claimedAchievements: {
          ...prev.claimedAchievements,
          [achId]: true,
        },
        lastActiveTime: Date.now(),
      };

      updated = evaluateAchievements(updated);
      saveGameState(updated);
      return updated;
    });

    return true;
  };

  const overclockCooldownSeconds = Math.max(
    0,
    Math.ceil((lastOverclockUsedTime + 60000 - Date.now()) / 1000)
  );

  const activateOverclock = (): boolean => {
    if (Date.now() < state.overclockBoostActiveUntil) return false;
    if (overclockCooldownSeconds > 0) return false;

    const reactorLvl = state.upgrades['boost_overclock_reactor'] || 0;
    const durationSec = 20 + reactorLvl * 5;
    const until = Date.now() + durationSec * 1000;

    soundEngine.playRewardClaim();
    if (state.settings.hapticsEnabled) {
      playHaptic(35);
    }

    setLastOverclockUsedTime(Date.now());
    setState((prev) => ({
      ...prev,
      overclockBoostActiveUntil: until,
    }));

    return true;
  };

  const updateProfile = (profile: UserProfile) => {
    setState((prev) => {
      const updated: GameState = {
        ...prev,
        profile,
      };
      saveGameState(updated);
      return updated;
    });
    setIsAuthModalOpen(false);
    soundEngine.playRewardClaim();
  };

  const toggleTheme = () => {
    const nextTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setState((prev) => {
      const updated: GameState = {
        ...prev,
        settings: {
          ...prev.settings,
          ...newSettings,
        },
      };
      saveGameState(updated);
      return updated;
    });
  };

  const resetProgress = () => {
    clearGameState();
    setState({
      ...INITIAL_STATE,
      sessionStartTime: Date.now(),
      lastActiveTime: Date.now(),
    });
    setOfflineReport(null);
    setLevelUpNotification(null);
    setIsAuthModalOpen(true);
  };

  const dismissOfflineReport = () => {
    if (offlineReport) {
      setState((prev) => {
        const updated = {
          ...prev,
          bits: prev.bits + offlineReport.bits,
          lifetimeBits: prev.lifetimeBits + offlineReport.bits,
          sessionBits: prev.sessionBits + offlineReport.bits,
          lastActiveTime: Date.now(),
        };
        saveGameState(updated);
        return updated;
      });
      soundEngine.playRewardClaim();
      setOfflineReport(null);
    }
  };

  const dismissLevelUpNotification = () => {
    setLevelUpNotification(null);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        metrics,
        floatingTexts,
        offlineReport,
        activeTab,
        setActiveTab,
        levelUpNotification,
        antiCheatWarning,
        dismissAntiCheatWarning,
        antiCheatBlockedCount: antiCheat.getSuspiciousCount(),
        isAuthModalOpen,
        setIsAuthModalOpen,
        updateProfile,
        toggleTheme,
        tapCoin,
        buyUpgrade,
        claimDailyReward,
        claimAchievement,
        activateOverclock,
        overclockCooldownSeconds,
        updateSettings,
        resetProgress,
        dismissOfflineReport,
        dismissLevelUpNotification,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
