/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UpgradeDefinition } from '../types/game';

export const UPGRADE_DEFINITIONS: UpgradeDefinition[] = [
  // --- TAP POWER UPGRADES ---
  {
    id: 'tap_reinforced_touch',
    name: {
      en: 'Reinforced Touch',
      uz: 'Kuchaytirilgan teginish',
    },
    category: 'tap',
    description: {
      en: 'Calibrates tactile sensitivity to extract more Bits per tap.',
      uz: 'Har bir bosishda ko\'proq Bits olish uchun sezgirlikni oshiradi.',
    },
    baseCost: 15,
    costMultiplier: 1.55,
    baseBenefit: 1,
    benefitMultiplier: 1,
    benefitUnit: 'B/tap',
    iconName: 'Fingerprint',
  },
  {
    id: 'tap_micro_actuator',
    name: {
      en: 'Micro Actuator',
      uz: 'Mikro aktuator',
    },
    category: 'tap',
    description: {
      en: 'High-frequency micro-pulsing boosts tap efficiency.',
      uz: 'Yuqori chastotali impulslar bosish samaradorligini kuchaytiradi.',
    },
    baseCost: 120,
    costMultiplier: 1.62,
    baseBenefit: 4,
    benefitMultiplier: 1,
    benefitUnit: 'B/tap',
    iconName: 'Zap',
    minLevelToUnlock: 2,
  },
  {
    id: 'tap_neural_haptic',
    name: {
      en: 'Neural Tap Sync',
      uz: 'Neyronli bosish sinxi',
    },
    category: 'tap',
    description: {
      en: 'Direct synaptic relay exponentially multiplies mechanical click energy.',
      uz: 'To\'g\'ridan-to\'g\'ri sinaptik aloqa bosish energiyasini keskin oshiradi.',
    },
    baseCost: 850,
    costMultiplier: 1.7,
    baseBenefit: 18,
    benefitMultiplier: 1,
    benefitUnit: 'B/tap',
    iconName: 'Cpu',
    minLevelToUnlock: 4,
  },
  {
    id: 'tap_plasma_pulse',
    name: {
      en: 'Plasma Pulse',
      uz: 'Plazma impulsi',
    },
    category: 'tap',
    description: {
      en: 'Thermal ionized pulse surges maximum yield upon contact.',
      uz: 'Termal ionlashtirilgan impuls har bir teginishda katta hajm chiqaradi.',
    },
    baseCost: 4500,
    costMultiplier: 1.75,
    baseBenefit: 75,
    benefitMultiplier: 1,
    benefitUnit: 'B/tap',
    iconName: 'Flame',
    minLevelToUnlock: 7,
  },

  // --- AUTO MINERS (PASSIVE INCOME) ---
  {
    id: 'miner_nano_bot',
    name: {
      en: 'Nano Drone',
      uz: 'Nano dron',
    },
    category: 'miner',
    description: {
      en: 'Autonomous microscopic worker steadily mines Bits in the background.',
      uz: 'Orqa fonda avtomatik ravishda muntazam Bits qazib oladi.',
    },
    baseCost: 50,
    costMultiplier: 1.5,
    baseBenefit: 1,
    benefitMultiplier: 1,
    benefitUnit: 'B/sec',
    iconName: 'Bot',
  },
  {
    id: 'miner_server_rack',
    name: {
      en: 'Mining Rig Cluster',
      uz: 'Mayning klasteri',
    },
    category: 'miner',
    description: {
      en: 'Dedicated high-density computing server solving distributed coin algorithms.',
      uz: 'Taqsimlangan tanga algoritmlarini yechuvchi maxsus hisoblash serveri.',
    },
    baseCost: 320,
    costMultiplier: 1.58,
    baseBenefit: 7,
    benefitMultiplier: 1,
    benefitUnit: 'B/sec',
    iconName: 'Server',
    minLevelToUnlock: 3,
  },
  {
    id: 'miner_quantum_core',
    name: {
      en: 'Quantum Rig',
      uz: 'Kvant mayneri',
    },
    category: 'miner',
    description: {
      en: 'Qubit superposition algorithms continuously harvest vast streams of Bits.',
      uz: 'Kubik superpozitsiya algoritmlari doimiy ravishda Bits oqimini yig\'adi.',
    },
    baseCost: 2200,
    costMultiplier: 1.65,
    baseBenefit: 35,
    benefitMultiplier: 1,
    benefitUnit: 'B/sec',
    iconName: 'Radio',
    minLevelToUnlock: 5,
  },
  {
    id: 'miner_orbital_satellite',
    name: {
      en: 'Orbital Bit Relay',
      uz: 'Orbital rele stansiyasi',
    },
    category: 'miner',
    description: {
      en: 'Low-orbit satellite array transmitting uninterrupted high-speed Bit transfers.',
      uz: 'Yer orbitasidan uzluksiz yuqori tezlikda Bits uzatuvchi sun\'iy yo\'ldosh.',
    },
    baseCost: 12000,
    costMultiplier: 1.72,
    baseBenefit: 160,
    benefitMultiplier: 1,
    benefitUnit: 'B/sec',
    iconName: 'Satellite',
    minLevelToUnlock: 8,
  },

  // --- MULTIPLIERS ---
  {
    id: 'mult_kinetic_resonator',
    name: {
      en: 'Kinetic Resonator',
      uz: 'Kinetik rezonator',
    },
    category: 'multiplier',
    description: {
      en: 'Harmonic frequency tuning provides +15% compound tap bonus per tier.',
      uz: 'Har bir daraja uchun bosish kuchiga +15% umumiy bonus beradi.',
    },
    baseCost: 500,
    costMultiplier: 2.2,
    baseBenefit: 0.15,
    benefitMultiplier: 1,
    benefitUnit: '% Tap Boost',
    maxLevel: 10,
    iconName: 'TrendingUp',
    minLevelToUnlock: 3,
  },
  {
    id: 'mult_flux_overclock',
    name: {
      en: 'Miner Supercharger',
      uz: 'Mayner kuchaytirgichi',
    },
    category: 'multiplier',
    description: {
      en: 'Optimizes passive miner algorithms by +20% compound output per tier.',
      uz: 'Avtomatik maynerlar unumdorligini har bir daraja uchun +20% ga oshiradi.',
    },
    baseCost: 1400,
    costMultiplier: 2.3,
    baseBenefit: 0.2,
    benefitMultiplier: 1,
    benefitUnit: '% Miner Boost',
    maxLevel: 10,
    iconName: 'Gauge',
    minLevelToUnlock: 4,
  },

  // --- BOOSTERS & STORAGE ---
  {
    id: 'boost_overclock_reactor',
    name: {
      en: 'Surge Capacitor',
      uz: 'Tezlanish kondensatori',
    },
    category: 'booster',
    description: {
      en: 'Upgrades the manual 2x Overclock Surge ability duration by +5 seconds per level.',
      uz: '2x Tezlanish qobiliyati davomiyligini har bir daraja uchun +5 soniyaga uzaytiradi.',
    },
    baseCost: 800,
    costMultiplier: 2.1,
    baseBenefit: 5,
    benefitMultiplier: 1,
    benefitUnit: 'sec Surge',
    maxLevel: 8,
    iconName: 'BatteryCharging',
    minLevelToUnlock: 3,
  },
  {
    id: 'boost_offline_vault',
    name: {
      en: 'Cold Storage Vault',
      uz: 'Muzlatilgan ombor',
    },
    category: 'booster',
    description: {
      en: 'Increases maximum offline passive accumulation window (+3 hours per level, starts at 3h).',
      uz: 'Oflayn rejimda Bits yig\'ish maksimal muddatini oshiradi (+3 soat har daraja).',
    },
    baseCost: 650,
    costMultiplier: 1.95,
    baseBenefit: 3,
    benefitMultiplier: 1,
    benefitUnit: 'hrs offline',
    maxLevel: 7,
    iconName: 'ShieldCheck',
    minLevelToUnlock: 2,
  },
];

export function getUpgradeCost(def: UpgradeDefinition, currentLevel: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costMultiplier, currentLevel));
}

export function getUpgradeBenefit(def: UpgradeDefinition, currentLevel: number): number {
  if (currentLevel <= 0) return 0;
  return def.baseBenefit * currentLevel * def.benefitMultiplier;
}

export function getNextUpgradeBenefit(def: UpgradeDefinition, currentLevel: number): number {
  return def.baseBenefit * (currentLevel + 1) * def.benefitMultiplier;
}
