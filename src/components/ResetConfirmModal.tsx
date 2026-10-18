/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { translations } from '../localization/translations';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResetConfirmModal({ isOpen, onClose }: ResetConfirmModalProps) {
  const { resetProgress, state } = useGame();
  const t = translations[state.settings.language];
  const [typedText, setTypedText] = useState('');

  if (!isOpen) return null;

  const isConfirmed = typedText.trim().toUpperCase() === 'RESET';

  const handleConfirm = () => {
    if (!isConfirmed) return;
    resetProgress();
    setTypedText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#151C2C] rounded-3xl border border-[#EAEAEA] dark:border-[#263147] p-6 shadow-2xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg text-[#111111] dark:text-white">{t.resetModal.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] dark:text-[#94A3B8] hover:bg-[#F7F7F7] dark:hover:bg-[#1E273A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#777777] dark:text-[#94A3B8] leading-relaxed mb-4">
          {t.resetModal.warning}
        </p>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-[#111111] dark:text-[#E2E8F0] uppercase tracking-wider mb-1.5">
            {t.resetModal.confirmText}
          </label>
          <input
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder={t.resetModal.typePrompt}
            className="w-full h-11 px-3.5 rounded-xl border border-[#EAEAEA] dark:border-[#263147] bg-[#F7F7F7] dark:bg-[#0E131F] text-sm text-[#111111] dark:text-white font-mono tracking-wider uppercase focus:outline-none focus:border-[#111111] dark:focus:border-white focus:bg-white dark:focus:bg-[#0E131F]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-[#EAEAEA] dark:border-[#263147] text-sm font-medium text-[#777777] dark:text-[#94A3B8] hover:bg-[#F7F7F7] dark:hover:bg-[#1E273A]"
          >
            {t.resetModal.cancel}
          </button>
          <button
            type="button"
            disabled={!isConfirmed}
            onClick={handleConfirm}
            className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-colors ${
              isConfirmed
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[#F2F2F2] dark:bg-[#1E2638] text-[#AAAAAA] dark:text-[#64748B] cursor-not-allowed'
            }`}
          >
            {t.resetModal.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
