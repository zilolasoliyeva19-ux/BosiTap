/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function formatBits(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 B';
  const safeAmount = Math.max(0, amount);

  if (compact) {
    if (safeAmount >= 1_000_000_000) {
      return `${(safeAmount / 1_000_000_000).toFixed(2)}B B`;
    }
    if (safeAmount >= 1_000_000) {
      return `${(safeAmount / 1_000_000).toFixed(2)}M B`;
    }
    if (safeAmount >= 10_000) {
      return `${(safeAmount / 1_000).toFixed(1)}K B`;
    }
  }

  return `${Math.floor(safeAmount).toLocaleString('en-US')} B`;
}

export function formatNumber(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  const safe = Math.max(0, amount);

  if (compact) {
    if (safe >= 1_000_000_000) return `${(safe / 1_000_000_000).toFixed(2)}B`;
    if (safe >= 1_000_000) return `${(safe / 1_000_000).toFixed(2)}M`;
    if (safe >= 10_000) return `${(safe / 1_000).toFixed(1)}K`;
  }

  return Math.floor(safe).toLocaleString('en-US');
}

export function formatRate(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount <= 0) return '+0 B/s';
  const formatted = formatBits(amount, compact);
  return `+${formatted}/s`;
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function formatTimeAgo(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours}h ${remMinutes}m`;
}

/**
 * Level progression formula
 * Level 1: 0 - 150 lifetime bits
 * Level 2: 150 - 450
 * Level 3: 450 - 1,200 ...
 */
export function calculateLevelThreshold(level: number): number {
  if (level <= 1) return 150;
  return Math.floor(150 * Math.pow(1.75, level - 1));
}

export function getLevelProgress(lifetimeBits: number, currentLevel: number): {
  currentLevel: number;
  expInLevel: number;
  expRequired: number;
  progressRatio: number;
} {
  let prevThreshold = 0;
  let currThreshold = calculateLevelThreshold(1);
  let lvl = 1;

  while (lifetimeBits >= currThreshold && lvl < 100) {
    prevThreshold = currThreshold;
    lvl++;
    currThreshold = prevThreshold + calculateLevelThreshold(lvl);
  }

  const expInLevel = Math.max(0, lifetimeBits - prevThreshold);
  const expRequired = Math.max(1, currThreshold - prevThreshold);
  const progressRatio = Math.min(1, Math.max(0, expInLevel / expRequired));

  return {
    currentLevel: lvl,
    expInLevel,
    expRequired,
    progressRatio,
  };
}
