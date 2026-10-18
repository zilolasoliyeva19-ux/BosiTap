/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AuthSession {
  code: string;
  status: 'pending' | 'verified';
  telegramUser?: {
    id: number;
    name: string;
    username: string;
    photoUrl?: string;
  };
  createdAt: number;
  expiresAt: number;
}

const authSessions = new Map<string, AuthSession>();

// Cleanup expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [code, session] of authSessions.entries()) {
    if (session.expiresAt < now) {
      authSessions.delete(code);
    }
  }
}, 60000);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Get Telegram Bot Info
  app.get('/api/telegram/bot-info', (req: Request, res: Response) => {
    res.json({
      botName: 'BosiTap Bot',
      botUsername: process.env.TELEGRAM_BOT_USERNAME || 'BosiTapBot',
      isConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      status: 'active',
      miniAppUrl: process.env.APP_URL || 'https://bositap.app',
      features: ['auth', 'play_webapp', 'balance_check', 'daily_reminder'],
    });
  });

  // Create one-time 6-digit auth session for web login
  app.post('/api/telegram/create-auth-session', (req: Request, res: Response) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const botUser = process.env.TELEGRAM_BOT_USERNAME || 'BosiTapBot';
    const session: AuthSession = {
      code,
      status: 'pending',
      createdAt: now,
      expiresAt: now + 10 * 60 * 1000,
    };
    authSessions.set(code, session);
    res.json({
      code,
      expiresAt: session.expiresAt,
      botUsername: botUser,
      deepLink: `https://t.me/${botUser}?start=auth_${code}`,
    });
  });

  // Verify auth session
  app.post('/api/telegram/verify-auth-session', (req: Request, res: Response) => {
    const { code, telegramUser } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Kod talab qilinadi' });
    }
    const session = authSessions.get(code);
    if (!session) {
      return res.status(404).json({ error: 'Ulanish kodi topilmadi yoki muddati o\'tgan' });
    }
    if (session.expiresAt < Date.now()) {
      authSessions.delete(code);
      return res.status(410).json({ error: 'Kod muddati tugagan' });
    }

    session.status = 'verified';
    session.telegramUser = telegramUser || {
      id: Math.floor(100000000 + Math.random() * 900000000),
      name: 'BosiTap Foydalanuvchisi',
      username: 'bositap_user',
    };

    authSessions.set(code, session);
    res.json({ success: true, session });
  });

  // Check auth session status
  app.get('/api/telegram/check-auth-session/:code', (req: Request, res: Response) => {
    const { code } = req.params;
    const session = authSessions.get(code);
    if (!session) {
      return res.status(404).json({ error: 'Sessiya topilmadi' });
    }
    if (session.expiresAt < Date.now()) {
      authSessions.delete(code);
      return res.status(410).json({ error: 'Sessiya muddati o\'tgan' });
    }
    res.json({
      code: session.code,
      status: session.status,
      telegramUser: session.telegramUser || null,
    });
  });

  // Test custom Telegram bot token
  app.post('/api/telegram/test-bot-token', async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Bot tokeni kiritilmadi' });
    }
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = (await tgRes.json()) as any;
      if (data.ok) {
        return res.json({ ok: true, bot: data.result });
      } else {
        return res.status(400).json({ ok: false, error: data.description || 'Noto\'g\'ri token' });
      }
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message || 'Telegram serveriga ulanishda xatolik' });
    }
  });

  // Telegram webhook receiver
  app.post('/api/telegram/webhook', async (req: Request, res: Response) => {
    const update = req.body;
    if (update?.message) {
      const msg = update.message;
      const text = (msg.text || '').trim();
      const from = msg.from;

      if (text.startsWith('/start auth_')) {
        const code = text.replace('/start auth_', '').trim();
        const session = authSessions.get(code);
        if (session && session.expiresAt > Date.now()) {
          session.status = 'verified';
          session.telegramUser = {
            id: from.id,
            name: `${from.first_name || ''} ${from.last_name || ''}`.trim() || from.username || 'Foydalanuvchi',
            username: from.username || `user_${from.id}`,
          };
          authSessions.set(code, session);
        }
      }
    }
    res.json({ ok: true });
  });

  // Mount Vite or serve static files
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BosiTap server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
