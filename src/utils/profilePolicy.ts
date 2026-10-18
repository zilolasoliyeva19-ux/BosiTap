/**
 * BosiTap account edit policy.
 * The policy is stored locally for the current browser profile.
 */
import type { UserProfile } from '../types/game';

const POLICY_PREFIX = 'bositap_profile_edit_policy_v1_';

export interface ProfileEditPolicy {
  editsUsed: number;
  cooldownUntil: number;
}

function keyFor(profile: UserProfile): string {
  // createdAt is stable for a browser account; Telegram ID is stable for Telegram accounts.
  return POLICY_PREFIX + String(profile.telegramId ?? profile.createdAt);
}

export function getProfileEditPolicy(profile: UserProfile): ProfileEditPolicy {
  if (typeof window === 'undefined') return { editsUsed: 0, cooldownUntil: 0 };
  try {
    const raw = localStorage.getItem(keyFor(profile));
    if (!raw) return { editsUsed: 0, cooldownUntil: 0 };
    const parsed = JSON.parse(raw) as Partial<ProfileEditPolicy>;
    const cooldownUntil = Number(parsed.cooldownUntil || 0);
    if (cooldownUntil && Date.now() >= cooldownUntil) {
      localStorage.removeItem(keyFor(profile));
      return { editsUsed: 0, cooldownUntil: 0 };
    }
    return {
      editsUsed: Math.max(0, Math.min(2, Number(parsed.editsUsed || 0))),
      cooldownUntil,
    };
  } catch {
    return { editsUsed: 0, cooldownUntil: 0 };
  }
}

export function registerProfileEdit(profile: UserProfile): ProfileEditPolicy {
  const current = getProfileEditPolicy(profile);
  const editsUsed = current.editsUsed + 1;
  const next: ProfileEditPolicy = editsUsed >= 2
    ? { editsUsed: 2, cooldownUntil: Date.now() + 7 * 24 * 60 * 60 * 1000 }
    : { editsUsed, cooldownUntil: 0 };
  if (typeof window !== 'undefined') {
    localStorage.setItem(keyFor(profile), JSON.stringify(next));
  }
  return next;
}

export function signOutCurrentProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('bositap_save_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.profile = null;
      localStorage.setItem('bositap_save_v1', JSON.stringify(parsed));
    }
  } finally {
    window.location.reload();
  }
}
