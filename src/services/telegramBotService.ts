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
  private customBotToken: string = '';
  private botUsername: string = 'BosiTapBot';

  constructor() {
    if (typeof window !== 'undefined') {
      this.customBotToken = localStorage.getItem('bositap_custom_bot_token') || '';
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

  public getCustomBotToken(): string {
    return this.customBotToken;
  }

  public setCustomBotToken(token: string) {
    this.customBotToken = token.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('bositap_custom_bot_token', this.customBotToken);
    }
  }

  /**
   * Create an auth session code for browser users
   */
  public async createAuthSession(): Promise<TelegramAuthSession> {
    try {
      const res = await fetch('/api/telegram/create-auth-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback for standalone/offline preview
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const session: TelegramAuthSession = {
      code,
      expiresAt,
      botUsername: this.botUsername,
      deepLink: `https://t.me/${this.botUsername}?start=auth_${code}`,
    };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`bositap_auth_session_${code}`, JSON.stringify(session));
    }
    return session;
  }

  /**
   * Check status of auth session
   */
  public async checkAuthSession(code: string): Promise<{ status: 'pending' | 'verified'; telegramUser?: UserProfile } | null> {
    try {
      const res = await fetch(`/api/telegram/check-auth-session/${code}`);
      if (res.ok) {
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
        return { status: data.status };
      }
    } catch {
      // Fallback check
    }

    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`bositap_auth_session_${code}_verified`);
      if (stored) {
        try {
          return { status: 'verified', telegramUser: JSON.parse(stored) };
        } catch {}
      }
    }
    return { status: 'pending' };
  }

  /**
   * Simulate or verify an auth code immediately
   */
  public async verifyAuthCodeLocally(
    code: string,
    profileInfo?: { name: string; username: string; id?: number }
  ): Promise<UserProfile> {
    const defaultId = Math.floor(100000000 + Math.random() * 900000000);
    const tgProfile: UserProfile = {
      name: profileInfo?.name || 'Telegram Foydalanuvchisi',
      username: profileInfo?.username || 'telegram_user',
      avatarId: 'avatar_1',
      createdAt: Date.now(),
      telegramId: profileInfo?.id || defaultId,
      isTelegramLinked: true,
    };

    try {
      await fetch('/api/telegram/verify-auth-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          telegramUser: {
            id: tgProfile.telegramId,
            name: tgProfile.name,
            username: tgProfile.username,
          },
        }),
      });
    } catch {
      // Ignored if API is unavailable
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`bositap_auth_session_${code}_verified`, JSON.stringify(tgProfile));
    }

    return tgProfile;
  }

  /**
   * Test a Telegram Bot token with Telegram official API
   */
  public async testBotToken(token: string): Promise<{ ok: boolean; botName?: string; username?: string; error?: string }> {
    try {
      // First try via our backend proxy
      const res = await fetch('/api/telegram/test-bot-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.bot) {
          this.setBotUsername(data.bot.username);
          this.setCustomBotToken(token);
          return {
            ok: true,
            botName: data.bot.first_name,
            username: data.bot.username,
          };
        }
      }
    } catch {
      // Direct call fallback
    }

    try {
      const directRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const directData = await directRes.json();
      if (directData.ok && directData.result) {
        this.setBotUsername(directData.result.username);
        this.setCustomBotToken(token);
        return {
          ok: true,
          botName: directData.result.first_name,
          username: directData.result.username,
        };
      }
      return { ok: false, error: directData.description || 'Noto\'g\'ri token' };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Telegram serveriga ulanib bo\'lmadi' };
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
