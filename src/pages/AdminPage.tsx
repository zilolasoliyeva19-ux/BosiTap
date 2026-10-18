import React, { useEffect, useState } from 'react';
import { ArrowLeft, KeyRound, LogOut, RefreshCw, ShieldCheck, Users, Bot, Clock3 } from 'lucide-react';

type Overview = { service: string; serverTime: string; telegramConfigured: boolean; telegramBotUsername: string; activeTelegramAuthSessions: number; note: string };
const TOKEN_KEY = 'bositap_admin_session_v1';
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const apiUrl = (path: string) => API_BASE + path;

export function AdminPage() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadOverview = async (session: string) => {
    const response = await fetch(apiUrl('/api/admin/overview'), { headers: { 'x-bositap-admin-session': session }, cache: 'no-store' });
    if (!response.ok) {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken('');
      setOverview(null);
      if (response.status !== 401) setError('Admin serveri javob bermadi. Backend deploy holatini tekshiring.');
      return;
    }
    setOverview(await response.json() as Overview);
    setError('');
  };

  useEffect(() => { if (token) void loadOverview(token); }, [token]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const response = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }), cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kirish amalga oshmadi.');
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Serverga ulanishda xatolik.');
    } finally { setBusy(false); }
  };

  const logout = async () => {
    if (token) await fetch(apiUrl('/api/admin/logout'), { method: 'POST', headers: { 'x-bositap-admin-session': token } }).catch(() => undefined);
    sessionStorage.removeItem(TOKEN_KEY); setToken(''); setOverview(null);
  };

  return <main className="min-h-[100dvh] bg-[#F7F7F7] dark:bg-[#0E121B] text-[#111] dark:text-white p-4 sm:p-8">
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#555] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white"><ArrowLeft className="w-4 h-4" /> BosiTap ga qaytish</a>
        {token && <button onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-xl border border-[#ddd] dark:border-[#263147] px-3 py-2 text-sm"><LogOut className="w-4 h-4" /> Chiqish</button>}
      </div>
      <div className="mb-6 flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-[#111] text-white flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div><div><p className="text-xs uppercase tracking-[0.2em] text-[#777] dark:text-[#94A3B8]">BosiTap</p><h1 className="text-2xl font-bold">Admin panel</h1></div></div>
      {!token ? <form onSubmit={login} className="max-w-md rounded-3xl border border-[#E5E5E5] dark:border-[#263147] bg-white dark:bg-[#151C2C] p-6 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-[#F3F3F3] dark:bg-[#202B40] flex items-center justify-center mb-4"><KeyRound className="w-5 h-5" /></div>
        <h2 className="text-lg font-bold mb-1">Administrator sifatida kirish</h2><p className="text-sm text-[#777] dark:text-[#94A3B8] mb-5">Parol serverda saqlanadi va brauzer kodiga kiritilmaydi.</p>
        <label htmlFor="admin-password" className="block text-xs font-semibold mb-2">Admin paroli</label>
        <input id="admin-password" type="password" autoComplete="current-password" minLength={1} required value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 rounded-xl border border-[#ddd] dark:border-[#263147] bg-white dark:bg-[#0E131F] px-3 outline-none focus:ring-2 focus:ring-[#888]" placeholder="Server admin paroli" />
        {error && <p role="alert" className="text-sm text-rose-600 mt-3">{error}</p>}
        <button disabled={busy} className="w-full h-11 rounded-xl bg-[#111] dark:bg-white text-white dark:text-[#111] font-semibold mt-4 disabled:opacity-50">{busy ? 'Tekshirilmoqda…' : 'Kirish'}</button>
        <p className="text-[11px] text-[#888] mt-4">Xavfsizlik: 15 daqiqada 8 ta urinish limiti qo‘llanadi. Sessiya 8 soat amal qiladi.</p>
      </form> : <div className="space-y-4">
        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Tizim holati</h2><button onClick={() => void loadOverview(token)} className="inline-flex items-center gap-2 rounded-xl border border-[#ddd] dark:border-[#263147] px-3 py-2 text-sm"><RefreshCw className="w-4 h-4" /> Yangilash</button></div>
        {overview ? <>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#263147] bg-white dark:bg-[#151C2C] p-4"><Bot className="w-5 h-5 mb-3 text-[#777]" /><p className="text-xs text-[#777]">Telegram bot</p><p className="font-bold mt-1">{overview.telegramConfigured ? 'Sozlangan' : 'Sozlanmagan'}</p><p className="text-xs mt-1 text-[#777]">{overview.telegramBotUsername ? '@'+overview.telegramBotUsername : 'Username yo‘q'}</p></div>
            <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#263147] bg-white dark:bg-[#151C2C] p-4"><Users className="w-5 h-5 mb-3 text-[#777]" /><p className="text-xs text-[#777]">Telegram login sessiyalari</p><p className="text-2xl font-bold mt-1">{overview.activeTelegramAuthSessions}</p><p className="text-xs mt-1 text-[#777]">Faol ulanish kodlari</p></div>
            <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#263147] bg-white dark:bg-[#151C2C] p-4"><Clock3 className="w-5 h-5 mb-3 text-[#777]" /><p className="text-xs text-[#777]">Server vaqti</p><p className="font-bold mt-1">{new Date(overview.serverTime).toLocaleTimeString()}</p><p className="text-xs mt-1 text-[#777]">{new Date(overview.serverTime).toLocaleDateString()}</p></div>
          </div>
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-900 dark:text-amber-200"><strong>Leaderboard eslatmasi:</strong> {overview.note}</div>
        </> : <div className="rounded-2xl bg-white dark:bg-[#151C2C] p-5 text-sm text-[#777]">Admin ma’lumotlari yuklanmoqda…</div>}
        <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#263147] bg-white dark:bg-[#151C2C] p-5"><h3 className="font-bold mb-1">Keyingi boshqaruv funksiyalari</h3><p className="text-sm text-[#777] dark:text-[#94A3B8]">Foydalanuvchilar ro‘yxati, global reyting, e’lon yuborish va bloklash amallarini xavfsiz qo‘shish uchun doimiy ma’lumotlar bazasi va admin audit jurnali kerak. Bu panel hozircha server holatini ko‘rsatadi.</p></div>
      </div>}
    </div>
  </main>;
}
