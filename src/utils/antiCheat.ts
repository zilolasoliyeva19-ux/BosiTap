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

export type AnomalyType =
  | 'synthetic_event'
  | 'autoclicker_rate'
  | 'zero_variance'
  | 'coordinate_macro';

export interface ValidationResult {
  allowed: boolean;
  anomaly?: AnomalyType;
  throttleMs?: number;
}

class AntiCheatEngine {
  private recentTaps: TapEventMetadata[] = [];
  private throttledUntil: number = 0;
  private suspiciousTapsBlocked: number = 0;
  private lastAnomaly: AnomalyType | null = null;

  public isThrottled(): boolean {
    return Date.now() < this.throttledUntil;
  }

  public getThrottleRemainingSeconds(): number {
    return Math.max(0, Math.ceil((this.throttledUntil - Date.now()) / 1000));
  }

  public getSuspiciousCount(): number {
    return this.suspiciousTapsBlocked;
  }

  public getLastAnomaly(): AnomalyType | null {
    return this.lastAnomaly;
  }

  public clearThrottle(): void {
    this.throttledUntil = 0;
  }

  public validateTap(event: { isTrusted?: boolean; clientX?: number; clientY?: number }): ValidationResult {
    const now = Date.now();

    // 1. If currently in security cooling period, reject tap
    if (now < this.throttledUntil) {
      this.suspiciousTapsBlocked++;
      return {
        allowed: false,
        anomaly: this.lastAnomaly || 'autoclicker_rate',
        throttleMs: this.throttledUntil - now,
      };
    }

    // 2. Check for synthetic untrusted event dispatch (DOM script injection)
    if (event.isTrusted === false) {
      this.lastAnomaly = 'synthetic_event';
      this.suspiciousTapsBlocked++;
      this.throttledUntil = now + 4000; // 4s cooldown
      return {
        allowed: false,
        anomaly: 'synthetic_event',
        throttleMs: 4000,
      };
    }

    const currentTap: TapEventMetadata = {
      isTrusted: Boolean(event.isTrusted ?? true),
      clientX: event.clientX || 0,
      clientY: event.clientY || 0,
      timestamp: now,
    };

    // Keep sliding window of last 20 taps
    this.recentTaps.push(currentTap);
    if (this.recentTaps.length > 20) {
      this.recentTaps.shift();
    }

    // 3. Rate anomaly check: More than 20 taps within 1000ms window
    const oneSecAgo = now - 1000;
    const tapsInLastSec = this.recentTaps.filter((t) => t.timestamp >= oneSecAgo).length;

    if (tapsInLastSec > 20) {
      this.lastAnomaly = 'autoclicker_rate';
      this.suspiciousTapsBlocked++;
      this.throttledUntil = now + 3500;
      return {
        allowed: false,
        anomaly: 'autoclicker_rate',
        throttleMs: 3500,
      };
    }

    // 4. Robotic zero-variance check (Standard Deviation of click intervals)
    if (this.recentTaps.length >= 8) {
      const intervals: number[] = [];
      for (let i = 1; i < this.recentTaps.length; i++) {
        intervals.push(this.recentTaps[i].timestamp - this.recentTaps[i - 1].timestamp);
      }

      // Check average interval
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;

      // Variance calculation
      const variance = intervals.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      // If average delay is fast (< 75ms) and standard deviation is unnaturally low (< 2.2ms),
      // it indicates an automated setInterval or native loop clicker script
      if (avg < 75 && stdDev < 2.2) {
        this.lastAnomaly = 'zero_variance';
        this.suspiciousTapsBlocked++;
        this.throttledUntil = now + 3000;
        return {
          allowed: false,
          anomaly: 'zero_variance',
          throttleMs: 3000,
        };
      }

      // 5. Macro identical coordinate check (Autoclickers clicking exact fixed coordinate 12+ times with 0 variance)
      const last10 = this.recentTaps.slice(-10);
      if (last10.length === 10) {
        const firstX = last10[0].clientX;
        const firstY = last10[0].clientY;
        const isIdenticalCoords = last10.every((t) => t.clientX === firstX && t.clientY === firstY);

        if (isIdenticalCoords && avg < 100) {
          this.lastAnomaly = 'coordinate_macro';
          this.suspiciousTapsBlocked++;
          this.throttledUntil = now + 3000;
          return {
            allowed: false,
            anomaly: 'coordinate_macro',
            throttleMs: 3000,
          };
        }
      }
    }

    return { allowed: true };
  }
}

export const antiCheat = new AntiCheatEngine();
