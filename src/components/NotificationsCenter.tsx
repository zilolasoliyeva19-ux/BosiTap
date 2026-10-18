import React, { useState } from 'react';
import { Bell, CheckCheck, Gift, ShieldCheck, Trophy, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

type Notice = { id: string; title: string; message: string; date: number; icon: 'gift' | 'trophy' | 'zap' | 'shield' };

const DEFAULT_NOTICES: Notice[] = [
  { id: 'welcome', title: 'BosiTap ga xush kelibsiz!', message: 'Bits yig‘ing, yangilanishlar oling va ligalarda yuqorilang.', date: 0, icon: 'gift' },
  { id: 'leaderboard', title: 'Leaderboard tayyor', message: 'Rekordlaringiz va ligangizni Reyting bo‘limida kuzating.', date: 0, icon: 'trophy' },
  { id: 'security', title: 'Akkaunt xavfsizligi', message: 'Hisob ma’lumotlarini himoya qiling va avtomatik bosishlardan saqlaning.', date: 0, icon: 'shield' },
];

const ICONS = { gift: Gift, trophy: Trophy, zap: Zap, shield: ShieldCheck };
const STORAGE_KEY = 'bositap_notifications_read_v1';

export function NotificationsCenter() {
  const { state, setActiveTab } = useGame();
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const notices = DEFAULT_NOTICES;
  const unread = notices.filter(n => !read.includes(n.id)).length;

  const markAllRead = () => {
    const all = notices.map(n => n.id);
    setRead(all);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  };

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(v => !v)} aria-label="Bildirishnomalar" aria-expanded={open}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-[#EAEAEA] dark:border-[#263147] text-[#777777] dark:text-[#CBD5E1] hover:bg-[#F7F7F7] dark:hover:bg-[#151C2C]">
        <Bell className="w-4 h-4" />
        {unread > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}
      </button>
      {open && <div className="absolute right-0 top-11 z-50 w-[min(90vw,340px)] rounded-2xl border border-[#EAEAEA] dark:border-[#263147] bg-white dark:bg-[#151C2C] shadow-xl p-3">
        <div className="flex items-center justify-between px-1 pb-2">
          <div><h3 className="font-bold text-sm text-[#111111] dark:text-white">Bildirishnomalar</h3><p className="text-[11px] text-[#777777] dark:text-[#94A3B8]">{unread ? unread + ' ta o‘qilmagan' : 'Hammasi o‘qilgan'}</p></div>
          <button type="button" onClick={markAllRead} className="text-xs font-semibold flex items-center gap-1 text-[#555] dark:text-[#CBD5E1]"><CheckCheck className="w-3.5 h-3.5" /> O‘qildi</button>
        </div>
        <div className="max-h-80 overflow-y-auto space-y-1">
          {notices.map(n => { const Icon = ICONS[n.icon]; return <button key={n.id} type="button" onClick={() => { setRead(prev => { const next = Array.from(new Set([...prev, n.id])); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next; }); if (n.id === 'leaderboard') setActiveTab('leaderboard'); setOpen(false); }}
            className="w-full flex gap-3 text-left p-3 rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#1E273A]">
            <span className="w-9 h-9 rounded-xl bg-[#F4F4F4] dark:bg-[#202B40] flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-[#333] dark:text-white" /></span>
            <span className="flex-1"><span className="flex items-center gap-2 text-sm font-semibold text-[#111111] dark:text-white">{n.title}{!read.includes(n.id) && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}</span><span className="block text-xs leading-relaxed mt-1 text-[#777777] dark:text-[#94A3B8]">{n.message}</span></span>
          </button>; })}
        </div>
        <p className="text-[10px] text-[#999] px-2 pt-2">Bildirishnomalar hozircha shu qurilmada saqlanadi.</p>
      </div>}
    </div>
  );
}
