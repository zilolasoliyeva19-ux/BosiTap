/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramWebAppUser;
  auth_date?: number;
  hash?: string;
}

export interface TelegramWebAppInterface {
  initData: string;
  initDataUnsafe: TelegramWebAppInitData;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  ready: () => void;
  expand: () => void;
  close: () => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  openTelegramLink: (url: string) => void;
  openLink: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebAppInterface;
    };
  }
}

export const TELEGRAM_BOT_USERNAME = 'BosiTapBot';

export function getTelegramWebApp(): TelegramWebAppInterface | null {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

export function isRunningInTelegram(): boolean {
  const tg = getTelegramWebApp();
  return Boolean(tg && tg.initDataUnsafe && tg.initDataUnsafe.user);
}

export function getTelegramUser(): TelegramWebAppUser | null {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
}

export function initTelegram(): void {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
    } catch {}
  }
}

export function triggerTelegramHaptic(style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light'): void {
  const tg = getTelegramWebApp();
  if (tg && tg.HapticFeedback) {
    try {
      if (style === 'success' || style === 'warning') {
        tg.HapticFeedback.notificationOccurred(style);
      } else {
        tg.HapticFeedback.impactOccurred(style);
      }
    } catch {}
  }
}

export function getTelegramBotDeepLink(): string {
  return `https://t.me/${TELEGRAM_BOT_USERNAME}?startapp=play`;
}
