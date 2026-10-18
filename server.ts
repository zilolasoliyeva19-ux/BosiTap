/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import express, { Request, Response } from 'express';
import { randomInt, timingSafeEqual } from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AuthSession {
  code: string;
  status: 'pending' | 'verified';
  telegramUser?: { id: number; name: string; username: string; photoUrl?: string };
  createdAt: number;
  expiresAt: number;
}

const authSessions = new Map<string, AuthSession>();
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const SESSION_TTL_MS = 5 * 60 * 1000;
const CODE_PATTERN = /^\d{8}$/;

function env(name: string): string {
  return (process.env[name] || '').trim();
}

function normalizedBotUsername(): string {
  return env('TELEGRAM_BOT_USERNAME').replace(/^@/, '');
}

function telegramConfigured(): boolean {
  return Boolean(env('TELEGRAM_BOT_TOKEN') && normalizedBotUsername() && env('TELEGRAM_WEBHOOK_SECRET'));
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

async function telegramApi(method: string, body: Record<string, unknown>): Promise<any> {
  const token = env('TELEGRAM_BOT_TOKEN');
  if (!token) throw new Error('Telegram bot is not configured');
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  const data = await response.json() as { ok?: boolean; description?: string };
  if (!response.ok || !data.ok) {
    throw new Error(data.description || `Telegram API request failed: ${method}`);
  }
  return data;
}

async function sendTelegramMessage(chatId: number, text: string, webAppUrl?: string): Promise<void> {
  const replyMarkup = webAppUrl && /^https:\/\//i.test(webAppUrl)
    ? { inline_keyboard: [[{ text: '🕹 BosiTap ni ochish', web_app: { url: webAppUrl } }]] }
    : undefined;
  try {
    await telegramApi('sendMessage', {
      chat_id: chatId,
      text,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    });
  } catch (error) {
    // Never log bot tokens or user-supplied Telegram data.
    console.error('Telegram sendMessage failed:', error instanceof Error ? error.message : 'unknown error');
  }
}

async function configureWebhook(): Promise<void> {
  const apiUrl = env('API_URL').replace(/\/+$/, '');
  const secret = env('TELEGRAM_WEBHOOK_SECRET');
  if (!env('TELEGRAM_BOT_TOKEN') || !apiUrl || !secret) {
    console.warn('Telegram webhook not configured: set TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET and API_URL.');
    return;
  }
  if (!/^[A-Za-z0-9_-]{1,256}$/.test(secret)) {
    console.error('Telegram webhook not configured: TELEGRAM_WEBHOOK_SECRET must use only letters, numbers, _ or -.');
    return;
  }
  try {
    await telegramApi('setWebhook', {
      url: `${apiUrl}/api/telegram/webhook`,
      secret_token: secret,
      allowed_updates: ['message'],
    });
    await telegramApi('setMyCommands', {
      commands: [
        { command: 'start', description: 'BosiTap ni boshlash yoki hisobni ulash' },
        { command: 'play', description: 'O‘yinni ochish' },
        { command: 'help', description: 'Yordam va buyruqlar' },
      ],
    });
    console.log('Telegram webhook configured.');
  } catch (error) {
    console.error('Telegram webhook setup failed:', error instanceof Error ? error.message : 'unknown error');
  }
}

// Expired sessions and rate-limit buckets are kept short-lived.
setInterval(() => {
  const now = Date.now();
  for (const [code, session] of authSessions) {
    if (session.expiresAt <= now) authSessions.delete(code);
  }
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
}, 60_000).unref();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.disable('x-powered-by');

  // Allow the Vercel frontend to call this Railway-hosted API.
  const allowedOrigins = new Set([
    env('APP_URL').replace(/\/+$/, ''),
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean));
  app.use((req: Request, res: Response, next) => {
    const origin = req.get('origin');
    if (origin && allowedOrigins.has(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Vary', 'Origin');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') {
      if (origin && !allowedOrigins.has(origin)) return res.status(403).end();
      return res.status(204).end();
    }
    next();
  });
  app.use(express.json({ limit: '16kb', strict: true }));

  app.get('/api/telegram/bot-info', (_req: Request, res: Response) => {
    res.set('Cache-Control', 'no-store');
    res.json({
      botName: 'BosiTap Bot',
      botUsername: normalizedBotUsername(),
      isConfigured: telegramConfigured(),
      status: telegramConfigured() ? 'active' : 'offline',
      miniAppUrl: env('APP_URL'),
      features: ['telegram_login', 'mini_app', 'help'],
    });
  });

  app.post('/api/telegram/create-auth-session', (req: Request, res: Response) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!rateLimit(`create:${ip}`, 5, 15 * 60 * 1000)) {
      return res.status(429).json({ error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.' });
    }
    if (!telegramConfigured()) {
      return res.status(503).json({ error: 'Telegram login sozlanmagan. Server environment variables qiymatlarini tekshiring.' });
    }

    // Eight-digit, short-lived, one-use codes reduce guessing risk.
    let code = String(randomInt(10_000_000, 100_000_000));
    while (authSessions.has(code)) code = String(randomInt(10_000_000, 100_000_000));
    const now = Date.now();
    authSessions.set(code, { code, status: 'pending', createdAt: now, expiresAt: now + SESSION_TTL_MS });
    res.set('Cache-Control', 'no-store');
    return res.json({
      code,
      expiresAt: now + SESSION_TTL_MS,
      botUsername: normalizedBotUsername(),
      deepLink: `https://t.me/${normalizedBotUsername()}?start=auth_${code}`,
    });
  });

  // Only Telegram's authenticated webhook may verify a session. Browser clients cannot submit identities.
  app.get('/api/telegram/check-auth-session/:code', (req: Request, res: Response) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!rateLimit(`check:${ip}`, 90, 60_000)) {
      return res.status(429).json({ error: 'Juda ko‘p so‘rov.' });
    }
    const { code } = req.params;
    if (!CODE_PATTERN.test(code)) return res.status(400).json({ error: 'Kod formati noto‘g‘ri.' });
    const session = authSessions.get(code);
    if (!session || session.expiresAt <= Date.now()) {
      if (session) authSessions.delete(code);
      return res.status(404).json({ error: 'Sessiya topilmadi yoki muddati tugagan.' });
    }

    res.set('Cache-Control', 'no-store');
    if (session.status !== 'verified' || !session.telegramUser) {
      return res.json({ code, status: 'pending', telegramUser: null });
    }

    // Consume a verified session on first successful read.
    const telegramUser = session.telegramUser;
    authSessions.delete(code);
    return res.json({ code, status: 'verified', telegramUser });
  });

  app.post('/api/telegram/webhook', async (req: Request, res: Response) => {
    const expectedSecret = env('TELEGRAM_WEBHOOK_SECRET');
    const receivedSecret = req.get('x-telegram-bot-api-secret-token') || '';
    if (!expectedSecret || !receivedSecret || !safeEqual(receivedSecret, expectedSecret)) {
      return res.status(401).json({ error: 'Unauthorized webhook' });
    }
    if (!telegramConfigured()) return res.status(503).json({ error: 'Telegram bot is not configured' });

    const update = req.body;
    const message = update?.message;
    if (!message || typeof message.chat?.id !== 'number' || typeof message.from?.id !== 'number') {
      return res.json({ ok: true });
    }

    const chatId = message.chat.id as number;
    const from = message.from;
    const text = typeof message.text === 'string' ? message.text.trim() : '';
    const startMatch = text.match(/^\/start(?:@\w+)?(?:\s+auth_(\d{8}))?$/i);

    if (startMatch?.[1]) {
      const code = startMatch[1];
      const session = authSessions.get(code);
      if (session && session.status === 'pending' && session.expiresAt > Date.now()) {
        session.status = 'verified';
        session.telegramUser = {
          id: from.id,
          name: `${from.first_name || ''} ${from.last_name || ''}`.trim() || from.username || 'Telegram foydalanuvchisi',
          username: from.username || `user_${from.id}`,
          photoUrl: undefined,
        };
        authSessions.set(code, session);
        await sendTelegramMessage(chatId, '✅ Telegram hisobingiz BosiTap bilan xavfsiz ulandi. Endi brauzer oynasiga qaytishingiz mumkin.');
      } else {
        await sendTelegramMessage(chatId, '⚠️ Ulanish kodi yaroqsiz yoki muddati tugagan. BosiTap’da yangi kod yarating.');
      }
      return res.json({ ok: true });
    }

    if (startMatch || /^\/play(?:@\w+)?$/i.test(text)) {
      const appUrl = env('APP_URL');
      await sendTelegramMessage(
        chatId,
        '👋 Assalomu alaykum! BosiTap — Bits yig‘ish va yangilanishlar ochish o‘yini. O‘yinni ochish uchun tugmani bosing. Hisobni ulash uchun saytda Telegram orqali kirishni tanlang.',
        appUrl,
      );
    } else if (/^\/help(?:@\w+)?$/i.test(text)) {
      await sendTelegramMessage(chatId, 'BosiTap buyruqlari:\n/start — boshlash yoki hisobni ulash\n/play — o‘yinni ochish\n/help — yordam', env('APP_URL'));
    }
    return res.json({ ok: true });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BosiTap server running on port ${PORT}`);
    void configureWebhook();
  });
}

startServer().catch((error) => {
  console.error('BosiTap server failed to start:', error instanceof Error ? error.message : 'unknown error');
  process.exitCode = 1;
});
