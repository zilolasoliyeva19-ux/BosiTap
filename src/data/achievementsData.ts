/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AchievementDefinition } from '../types/game';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_tap',
    title: {
      en: 'First Touch',
      uz: 'Birinchi teginish',
    },
    description: {
      en: 'Perform your very first tap on the BosiTap coin.',
      uz: 'BosiTap tangasiga birinchi marta bosing.',
    },
    rewardBits: 25,
    iconName: 'Sparkles',
    category: 'taps',
    targetValue: 1,
    checkUnlocked: (state) => state.totalTaps >= 1,
    getProgress: (state) => Math.min(1, state.totalTaps / 1),
  },
  {
    id: 'taps_100',
    title: {
      en: 'Century Clicker',
      uz: 'Yuzinchi bosish',
    },
    description: {
      en: 'Execute 100 cumulative taps.',
      uz: 'Jami 100 marta tangaga bosing.',
    },
    rewardBits: 100,
    iconName: 'Flame',
    category: 'taps',
    targetValue: 100,
    checkUnlocked: (state) => state.totalTaps >= 100,
    getProgress: (state) => Math.min(100, state.totalTaps) / 100,
  },
  {
    id: 'taps_1000',
    title: {
      en: 'Kilobit Master',
      uz: 'Kilobit ustasi',
    },
    description: {
      en: 'Execute 1,000 cumulative taps.',
      uz: 'Jami 1,000 marta tangaga bosing.',
    },
    rewardBits: 750,
    iconName: 'Zap',
    category: 'taps',
    targetValue: 1000,
    checkUnlocked: (state) => state.totalTaps >= 1000,
    getProgress: (state) => Math.min(1000, state.totalTaps) / 1000,
  },
  {
    id: 'bits_1000',
    title: {
      en: 'First Thousand Bits',
      uz: 'Dastlabki ming Bits',
    },
    description: {
      en: 'Amass 1,000 total lifetime Bits.',
      uz: 'Umumiy hisobda 1,000 Bits ishlang.',
    },
    rewardBits: 200,
    iconName: 'Coins',
    category: 'bits',
    targetValue: 1000,
    checkUnlocked: (state) => state.lifetimeBits >= 1000,
    getProgress: (state) => Math.min(1000, state.lifetimeBits) / 1000,
  },
  {
    id: 'bits_25000',
    title: {
      en: 'Bits Tycoon',
      uz: 'Bits magnati',
    },
    description: {
      en: 'Amass 25,000 total lifetime Bits.',
      uz: 'Umumiy hisobda 25,000 Bits ishlab toping.',
    },
    rewardBits: 2500,
    iconName: 'TrendingUp',
    category: 'bits',
    targetValue: 25000,
    checkUnlocked: (state) => state.lifetimeBits >= 25000,
    getProgress: (state) => Math.min(25000, state.lifetimeBits) / 25000,
  },
  {
    id: 'first_upgrade',
    title: {
      en: 'Engine Calibration',
      uz: 'Dvigatel sozlanishi',
    },
    description: {
      en: 'Purchase your very first upgrade in the shop.',
      uz: 'Do\'kondan birinchi yangilanishni sotib oling.',
    },
    rewardBits: 50,
    iconName: 'Wrench',
    category: 'upgrades',
    targetValue: 1,
    checkUnlocked: (state) => Object.values(state.upgrades).reduce((a, b) => a + b, 0) >= 1,
    getProgress: (state) => Math.min(1, Object.values(state.upgrades).reduce((a, b) => a + b, 0) / 1),
  },
  {
    id: 'first_miner',
    title: {
      en: 'Autonomous Economy',
      uz: 'Avtonom iqtisodiyot',
    },
    description: {
      en: 'Acquire your first Auto Miner to start generating passive Bits.',
      uz: 'Birinchi avtomatik maynerni sotib oling va passiv daromad boshlang.',
    },
    rewardBits: 150,
    iconName: 'Bot',
    category: 'upgrades',
    targetValue: 1,
    checkUnlocked: (state) => (state.upgrades['miner_nano_bot'] || 0) >= 1,
    getProgress: (state) => Math.min(1, (state.upgrades['miner_nano_bot'] || 0) / 1),
  },
  {
    id: 'upgrades_15',
    title: {
      en: 'Upgrade Architect',
      uz: 'Yangilanishlar ustasi',
    },
    description: {
      en: 'Own 15 cumulative upgrades across all categories.',
      uz: 'Jami 15 ta turli xil yangilanish sotib oling.',
    },
    rewardBits: 1000,
    iconName: 'Cpu',
    category: 'upgrades',
    targetValue: 15,
    checkUnlocked: (state) => Object.values(state.upgrades).reduce((a, b) => a + b, 0) >= 15,
    getProgress: (state) => Math.min(15, Object.values(state.upgrades).reduce((a, b) => a + b, 0)) / 15,
  },
  {
    id: 'level_5',
    title: {
      en: 'High Tier Operator',
      uz: 'Yuqori darajali operator',
    },
    description: {
      en: 'Advance to Player Level 5.',
      uz: '5-darajaga yeting.',
    },
    rewardBits: 600,
    iconName: 'Award',
    category: 'level',
    targetValue: 5,
    checkUnlocked: (state) => state.level >= 5,
    getProgress: (state) => Math.min(5, state.level) / 5,
  },
  {
    id: 'streak_3',
    title: {
      en: 'Consistent Miner',
      uz: 'Doimiy konchi',
    },
    description: {
      en: 'Maintain a 3-day daily reward claim streak.',
      uz: '3 kun ketma-ket mukofot seriyasini bajaring.',
    },
    rewardBits: 500,
    iconName: 'Calendar',
    category: 'streak',
    targetValue: 3,
    checkUnlocked: (state) => state.dailyStreak >= 3,
    getProgress: (state) => Math.min(3, state.dailyStreak) / 3,
  },
  {
    id: 'streak_7',
    title: {
      en: 'Weekly Dedication',
      uz: 'Haftalik sadoqat',
    },
    description: {
      en: 'Reach a full 7-day daily reward streak.',
      uz: 'To\'liq 7 kunlik ketma-ket mukofot seriyasiga erishing.',
    },
    rewardBits: 2000,
    iconName: 'Trophy',
    category: 'streak',
    targetValue: 7,
    checkUnlocked: (state) => state.dailyStreak >= 7,
    getProgress: (state) => Math.min(7, state.dailyStreak) / 7,
  },
];
