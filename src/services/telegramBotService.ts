/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameState, UserProfile } from '../types/game';
import { formatBits, formatNumber } from '../utils/format';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramBotInfo {
  botName: string;
  botUsername: string;
  isConfigured: boolean;
  status: 'active' | 'connecting' | 'offline';
  miniAppUrl: string;
}

export interface BotChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  buttons?: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
}

export interface TelegramAuthSession {
  code: string;
  expiresAt: number;
  botUsername: string;
  deepLink: string;
}

class TelegramService {
  private botUsername: string = 'BosiTapBot';

  constructor() {
    if (typeof window !== 'undefined') {
      // Bot tokens must never be stored in browser storage.
      localStorage.removeItem('bositap_custom_bot_token');
      this.botUsername = localStorage.getItem('bositap_bot_username') || 'BosiTapBot';
    }
  }

  /**
   * Check if running inside Telegram Mini App
   */
  public isInsideTelegram(): boolean {
    return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp?.initData);
  }

  /**
   * Retrieve real Telegram user data if inside Telegram WebApp
   */
  public getTelegramWebAppUser(): TelegramUser | null {
    if (typeof window === 'undefined') return null;
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      return tg.initDataUnsafe.user as TelegramUser;
    }
    return null;
  }

  /**
   * Initialize Telegram WebApp settings & expand
   */
  public initTelegramWebApp() {
    if (typeof window === 'undefined') return;
    const tg = window.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
      } catch (err) {
        console.warn('Telegram WebApp init warning:', err);
      }
    }
  }

  /**
   * Native Telegram haptic feedback
   */
  public triggerNativeHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'medium') {
    if (typeof window === 'undefined') return;
    const haptic = window.Telegram?.WebApp?.HapticFeedback;
    if (!haptic) return;

    try {
      if (type === 'success' || type === 'warning') {
        haptic.notificationOccurred(type);
      } else {
        haptic.impactOccurred(type);
      }
    } catch {
      // Ignore if not supported in current client
    }
  }

  public getBotUsername(): string {
    return this.botUsername;
  }

  public setBotUsername(username: string) {
    this.botUsername = username.replace(/^@/, '');
    if (typeof window !== 'undefined') {
      localStorage.setItem('bositap_bot_username', this.botUsername);
    }
  }

  /** Tokens are server-side secrets and are intentionally unavailable to browser code. */
  public getCustomBotToken(): string {
    return '';
  }

  /** Intentionally does not persist bot tokens in the browser. */
  public setCustomBotToken(_token: string) {
    if (typeof window !== 'undefined') localStorage.removeItem('bositap_custom_bot_token');
  }

  /**
   * Create an auth session code for browser users
   */
  public async createAuthSession(): Promise<TelegramAuthSession> {
    const res = await fetch('/api/telegram/create-auth-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Telegram orqali ulanishni boshlash imkonsiz.');
    }
    return data as TelegramAuthSession;
  }

  /**
   * Check status of auth session
   */
  public async checkAuthSession(code: string): Promise<{ status: 'pending' | 'verified'; telegramUser?: UserProfile } | null> {
    if (!/^\d{8}$/.test(code)) return null;
    try {
      const res = await fetch(`/api/telegram/check-auth-session/${encodeURIComponent(code)}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.status === 'verified' && data.telegramUser) {
        return {
          status: 'verified',
          telegramUser: {
            name: data.telegramUser.name,
            username: data.telegramUser.username,
            avatarId: 'avatar_1',
            createdAt: Date.now(),
            telegramId: data.telegramUser.id,
            isTelegramLinked: true,
            telegramPhotoUrl: data.telegramUser.photoUrl,
          },
        };
      }
      return { status: 'pending' };
    } catch {
      return null;
    }
  }

  /**
   * Wait for the server to confirm the Telegram webhook session.
   * The browser is never allowed to manufacture a verified Telegram identity.
   */
  public async verifyAuthCodeLocally(code: string): Promise<UserProfile> {
    const result = await this.checkAuthSession(code);
    if (result?.status === 'verified' && result.telegramUser) return result.telegramUser;
    throw new Error('Telegram hisobingiz hali tasdiqlanmadi. Botdagi ulanishni yakunlang va qayta urinib ko‘ring.');
  }

  /**
   * Check server-side bot configuration without ever sending a token from the browser.
   */
  public async testBotToken(_token: string): Promise<{ ok: boolean; botName?: string; username?: string; error?: string }> {
    try {
      const res = await fetch('/api/telegram/bot-info', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.isConfigured) {
        return { ok: false, error: 'Bot tokenini serverdagi Secrets / Environment Variables bo‘limiga joylang.' };
      }
      this.setBotUsername(data.botUsername);
      return { ok: true, botName: data.botName, username: data.botUsername };
    } catch {
      return { ok: false, error: 'Serverdagi Telegram sozlamalarini tekshirib bo‘lmadi.' };
    }
  }

  /**
   * Generate interactive Bot simulated responses with rich Telegram UI
   */
  public processCommand(command: string, state: GameState, tapPower: number, passiveRate: number): BotChatMessage {
    const cleanCmd = command.trim().toLowerCase();
    const now = Date.now();
    const id = `msg_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const botUser = `@${this.botUsername}`;

    if (cleanCmd === '/start' || cleanCmd.startsWith('/start')) {
      const isAuthCode = cleanCmd.includes('auth_');
      let extraNote = '';
      if (isAuthCode) {
        extraNote = '\n\n✅ <b>Brauzer seansi tasdiqlandi!</b> BosiTap ilovasida profilingiz ulandi.';
      }

      return {
        id,
        sender: 'bot',
        timestamp: now,
        text: `👋 <b>Assalomu alaykum, BosiTap botiga xush kelibsiz!</b>\n\nBosiTap — eng zamonaviy va tezkor tanga bosish (coin clicker) platformasi. Tangani bosing, Bits to'plang, yangilanishlarni sotib oling va do'stlaringiz bilan haqiqiy reytingda bellashing!${extraNote}\n\nQuyidagi tugma orqali o'yinni Telegram ichida bir zumda ishga tushiring:`,
        buttons: [
          { label: '🕹 BosiTap ni ochish', action: 'open_app' },
          { label: '💰 Balansni tekshirish', action: 'cmd_balance' },
          { label: '🎁 Kunlik bonus', action: 'cmd_daily' },
        ],
      };
    }

    if (cleanCmd === '/play' || cleanCmd === '🕹 bositap ni ochish') {
      return {
        id,
        sender: 'bot',
        timestamp: now,
        text: `🚀 <b>BosiTap Mini App ishga tushirilmoqda...</b>\n\n• Balans: <b>${formatBits(state.bits)}</b>\n• Daraja: <b>${state.level}-daraja</b>\n• Bosish kuchi: <b>+${formatNumber(tapPower)} B</b>\n• Passiv oqim: <b>+${formatNumber(passiveRate)} B/sek</b>\n\nO'yinga kirish uchun pastdagi tugmani bosing:`,
        buttons: [{ label: '▶ O\'yinni boshlash', action: 'open_app' }],
      };
    }

    if (cleanCmd === '/balance' || cleanCmd === '💰 balansni tekshirish') {
      return {
        id,
        sender: 'bot',
        timestamp: now,
        text: `💎 <b>BosiTap Balansingiz:</b>\n\n💰 <b>Mavjud Bits:</b> <code>${formatBits(state.bits)}</code>\n📈 <b>Jami topilgan:</b> <code>${formatBits(state.lifetimeBits)}</code>\n⚡ <b>Bosish kuchi:</b> <code>+${formatNumber(tapPower)} B</code>\n⚙ <b>Passiv mayner:</b> <code>+${formatNumber(passiveRate)} B/sek</code>\n🏆 <b>Daraja:</b> <code>${state.level}</code>\n🔥 <b>Kunlik seriya:</b> <code>${state.dailyStreak} kun</code>`,
        buttons: [
          { label: '🕹 O\'yinni ochish', action: 'open_app' },
          { label: '⚡ Do\'konga o\'tish', action: 'open_upgrades' },
        ],
      };
    }

    if (cleanCmd === '/daily' || cleanCmd === '🎁 kunlik bonus') {
      const nowMs = Date.now();
      const lastClaim = state.lastDailyClaimTime;
      const canClaim = !lastClaim || nowMs - lastClaim >= 24 * 3600 * 1000;

      if (canClaim) {
        return {
          id,
          sender: 'bot',
          timestamp: now,
          text: `🎁 <b>Kunlik mukofotingiz tayyor!</b>\n\nSiz <b>${state.dailyStreak + 1}-kunlik seriya</b> mukofotini olishingiz mumkin. Hoziroq ilovaga kirib mukofotingizni oling:`,
          buttons: [{ label: '🎁 Mukofotni olish', action: 'open_daily' }],
        };
      } else {
        const remainingMs = Math.max(0, 24 * 3600 * 1000 - (nowMs - (lastClaim || 0)));
        const hours = Math.floor(remainingMs / (3600 * 1000));
        const minutes = Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000));
        return {
          id,
          sender: 'bot',
          timestamp: now,
          text: `⏳ <b>Bugungi mukofot allaqachon qabul qilingan!</b>\n\nJoriy seriya: <b>${state.dailyStreak} kun</b>\nKeyingi mukofotgacha: <b>${hours} soat ${minutes} daqiqa</b> qoldi.`,
          buttons: [{ label: '🕹 Tangani bosish', action: 'open_app' }],
        };
      }
    }

    if (cleanCmd === '/stats' || cleanCmd === '📊 statistika') {
      return {
        id,
        sender: 'bot',
        timestamp: now,
        text: `📊 <b>BosiTap Shaxsiy Statistikasi:</b>\n\n👤 <b>Foydalanuvchi:</b> ${state.profile ? `@${state.profile.username}` : 'Mehmon'}\n👆 <b>Jami bosishlar soni:</b> <code>${formatNumber(state.totalTaps)}</code>\n💎 <b>Jami yig'ilgan Bits:</b> <code>${formatBits(state.lifetimeBits)}</code>\n🚀 <b>Sotib olingan yangilanishlar:</b> <code>${Object.values(state.upgrades).reduce((a, b) => a + b, 0)} ta</code>\n🏅 <b>Haqiqiy ligangiz:</b> <code>${state.level >= 10 ? 'Usta (Master)' : state.level >= 7 ? 'Platina' : state.level >= 4 ? 'Oltin' : 'Kumush'}</code>`,
        buttons: [{ label: '🕹 BosiTap ni ochish', action: 'open_app' }],
      };
    }

    if (cleanCmd === '/link' || cleanCmd === '/auth') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        id,
        sender: 'bot',
        timestamp: now,
        text: `🔐 <b>Telegram hisobingizni ulash:</b>\n\nSizning bir martalik ulanish kodingiz:\n\n<code>${code}</code>\n\nBosiTap veb-ilovasidagi "Telegram orqali kirish" oynasiga ushbu kodni kiriting va hisobingiz darhol ulanadi.`,
        buttons: [{ label: '✅ Kodni tasdiqlash', action: `verify_code_${code}` }],
      };
    }

    if (cleanCmd === '/help' || cleanCmd === 'ℹ yordam') {
      return {
        id,
        sender: 'bot',
        timestamp: now,
        text: `ℹ <b>BosiTap Bot Buyruqlari:</b>\n\n/start - Botni qayta ishga tushirish\n/play - O'yinni Telegram ichida ochish\n/balance - Bits balansi va ko'rsatkichlarni bilish\n/daily - Kunlik mukofot holatini tekshirish\n/stats - To'liq shaxsiy o'yin statistikasi\n/link - Veb-profilni Telegram bilan ulash\n/help - Ushbu yo'riqnomani ko'rsatish\n\nSavol yoki takliflar uchun: ${botUser}`,
        buttons: [{ label: '🕹 BosiTap ni ochish', action: 'open_app' }],
      };
    }

    // Default response for unhandled messages
    return {
      id,
      sender: 'bot',
      timestamp: now,
      text: `🤖 <b>Buyruq tushunarsiz bo'ldi.</b>\n\nIltimos, quyidagi buyruqlardan birini tanlang yoki /help deb yozing:`,
      buttons: [
        { label: '🕹 BosiTap ni ochish', action: 'open_app' },
        { label: '💰 Balans', action: 'cmd_balance' },
        { label: 'ℹ Yordam', action: 'cmd_help' },
      ],
    };
  }
}

export const telegramService = new TelegramService();
