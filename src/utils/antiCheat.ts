/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TapEventMetadata {
  isTrusted?: boolean;
  clientX: number;
  clientY: number;
  timestamp: number;
}

export type AnomalyType = 'synthetic_event' | 'autoclicker_rate' | 'zero_variance' | 'coordinate_macro';

export interface ValidationResult {
  allowed: boolean;
  anomaly?: AnomalyType;
  throttleMs?: number;
  muted?: boolean;
}

const MUTE_STORAGE_KEY = 'bositap_anticheat_mute_until_v1';
const MUTE_DURATION_MS = 3 * 60 * 60 * 1000;
const STRIKE_LIMIT = 3;

class AntiCheatEngine {
  private recentTaps: TapEventMetadata[] = [];
  private throttledUntil = 0;
  private suspiciousTapsBlocked = 0;
  private lastAnomaly: AnomalyType | null = null;
  private consecutiveViolations = 0;
  private mutedUntil = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = Number(localStorage.getItem(MUTE_STORAGE_KEY) || 0);
      this.mutedUntil = Number.isFinite(stored) && stored > Date.now() ? stored : 0;
    }
  }

  public isMuted(): boolean {
    if (this.mutedUntil && Date.now() >= this.mutedUntil) {
      this.mutedUntil = 0;
      if (typeof window !== 'undefined') localStorage.removeItem(MUTE_STORAGE_KEY);
    }
    return Date.now() < this.mutedUntil;
  }

  public isThrottled(): boolean {
    return Date.now() < this.throttledUntil || this.isMuted();
  }

  public getThrottleRemainingSeconds(): number {
    const until = Math.max(this.throttledUntil, this.isMuted() ? this.mutedUntil : 0);
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
  }

  public getSuspiciousCount(): number { return this.suspiciousTapsBlocked; }
  public getLastAnomaly(): AnomalyType | null { return this.lastAnomaly; }

  // Closing a warning never removes a 3-hour mute.
  public clearThrottle(): void { this.throttledUntil = 0; }

  private flag(anomaly: AnomalyType, shortCooldownMs: number): ValidationResult {
    this.lastAnomaly = anomaly;
    this.suspiciousTapsBlocked++;
    this.consecutiveViolations++;
    this.throttledUntil = Date.now() + shortCooldownMs;

    if (this.consecutiveViolations >= STRIKE_LIMIT) {
      this.mutedUntil = Date.now() + MUTE_DURATION_MS;
      this.throttledUntil = 0;
      if (typeof window !== 'undefined') localStorage.setItem(MUTE_STORAGE_KEY, String(this.mutedUntil));
      return { allowed: false, anomaly, throttleMs: MUTE_DURATION_MS, muted: true };
    }
    return { allowed: false, anomaly, throttleMs: shortCooldownMs };
  }

  public validateTap(event: { isTrusted?: boolean; clientX?: number; clientY?: number }): ValidationResult {
    const now = Date.now();

    if (this.isMuted()) {
      return { allowed: false, anomaly: this.lastAnomaly || 'autoclicker_rate', throttleMs: this.mutedUntil - now, muted: true };
    }
    // A short cooldown rejects taps without counting them as new cheating strikes.
    if (now < this.throttledUntil) {
      return { allowed: false, anomaly: this.lastAnomaly || 'autoclicker_rate', throttleMs: this.throttledUntil - now };
    }
    if (event.isTrusted === false) return this.flag('synthetic_event', 4000);

    this.recentTaps.push({
      isTrusted: Boolean(event.isTrusted ?? true),
      clientX: event.clientX || 0,
      clientY: event.clientY || 0,
      timestamp: now,
    });
    if (this.recentTaps.length > 20) this.recentTaps.shift();

    const tapsInLastSec = this.recentTaps.filter((tap) => tap.timestamp >= now - 1000).length;
    if (tapsInLastSec > 20) return this.flag('autoclicker_rate', 3500);

    if (this.recentTaps.length >= 8) {
      const intervals: number[] = [];
      for (let i = 1; i < this.recentTaps.length; i++) intervals.push(this.recentTaps[i].timestamp - this.recentTaps[i - 1].timestamp);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      if (avg < 75 && stdDev < 2.2) return this.flag('zero_variance', 3000);

      const last10 = this.recentTaps.slice(-10);
      if (last10.length === 10) {
        const firstX = last10[0].clientX;
        const firstY = last10[0].clientY;
        if (last10.every((tap) => tap.clientX === firstX && tap.clientY === firstY) && avg < 100) {
          return this.flag('coordinate_macro', 3000);
        }
      }
    }

    this.consecutiveViolations = 0;
    return { allowed: true };
  }
}

export const antiCheat = new AntiCheatEngine();
