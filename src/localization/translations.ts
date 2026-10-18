/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types/game';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    upgrades: string;
    daily: string;
    stats: string;
    leaderboard: string;
    settings: string;
  };
  auth: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    avatarLabel: string;
    startButton: string;
    saveButton: string;
    editProfile: string;
    errorNameRequired: string;
    errorUsernameRequired: string;
    welcomeBack: string;
    telegramLoginBtn: string;
    telegramOrManual: string;
    telegramModalTitle: string;
    telegramModalSubtitle: string;
    telegramConnected: string;
    telegramUnlink: string;
    telegramBotLabel: string;
    telegramCodeHint: string;
    telegramConfirmCode: string;
    telegramEnterCodePlaceholder: string;
    telegramVerifyBtn: string;
    telegramVerifiedBadge: string;
    telegramDirectUsernamePrompt: string;
    telegramLoginSuccess: string;
    telegramAutoDetected: string;
  };
  telegramBot: {
    title: string;
    subtitle: string;
    botUsername: string;
    statusActive: string;
    openInTelegram: string;
    copyLink: string;
    linkCopied: string;
    chatTab: string;
    commandsTab: string;
    setupTab: string;
    sendBtn: string;
    placeholder: string;
    quickCommandsTitle: string;
    tokenLabel: string;
    tokenPlaceholder: string;
    tokenSaveBtn: string;
    tokenTestBtn: string;
    tokenSuccess: string;
    tokenInvalid: string;
    instructionsTitle: string;
    instructionsText: string[];
  };
  home: {
    yourBalance: string;
    sessionEarned: string;
    tapToEarn: string;
    tapPower: string;
    lifetimeTaps: string;
    currentLevel: string;
    passiveIncome: string;
    perSecond: string;
    nextLevelAt: string;
    turboOverclock: string;
    overclockActive: string;
    activateOverclock: string;
    cooldownRemaining: string;
    levelUnlockedToast: (lvl: number) => string;
    levelUnlockedSub: string;
    dismiss: string;
  };
  upgrades: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterTap: string;
    filterMiner: string;
    filterMultiplier: string;
    filterBooster: string;
    level: string;
    cost: string;
    benefit: string;
    buy: string;
    maxed: string;
    locked: string;
    unlockAtLevel: string;
    unlockAtTaps: string;
    insufficientFunds: string;
    owned: string;
    balanceLabel: string;
  };
  daily: {
    title: string;
    subtitle: string;
    day: string;
    currentStreak: string;
    daysStreak: string;
    nextClaimIn: string;
    readyToClaim: string;
    claimReward: string;
    claimedToday: string;
    streakRuleTitle: string;
    streakRuleBody: string;
    storageNoticeTitle: string;
    storageNoticeBody: string;
    streakExtendedToast: string;
    dayLabel: (day: number) => string;
  };
  stats: {
    title: string;
    subtitle: string;
    currentBalance: string;
    lifetimeBits: string;
    totalTaps: string;
    effectiveTapPower: string;
    passiveIncome: string;
    playerLevel: string;
    upgradesPurchased: string;
    streak: string;
    sessionTime: string;
    sessionBits: string;
    tapPace: string;
    tapsPerSec: string;
    achievementsTitle: string;
    achievementsSubtitle: string;
    claimReward: string;
    claimed: string;
    progress: string;
    unlocked: string;
  };
  leaderboard: {
    title: string;
    subtitle: string;
    badge: string;
    yourRank: string;
    yourStats: string;
    filterAll: string;
    filterWeekly: string;
    filterLeagues: string;
    rankCol: string;
    playerCol: string;
    bitsCol: string;
    rateCol: string;
    youBadge: string;
    pointsToNext: string;
    realPlayersOnlyTitle: string;
    realPlayersOnlyDesc: string;
    divisions: {
      bronze: string;
      silver: string;
      gold: string;
      platinum: string;
      diamond: string;
      master: string;
    };
  };
  settings: {
    title: string;
    subtitle: string;
    profileTitle: string;
    profileDesc: string;
    editProfileBtn: string;
    themeTitle: string;
    themeDesc: string;
    lightTheme: string;
    darkTheme: string;
    soundTitle: string;
    soundDesc: string;
    hapticsTitle: string;
    hapticsDesc: string;
    reducedMotionTitle: string;
    reducedMotionDesc: string;
    compactNumbersTitle: string;
    compactNumbersDesc: string;
    languageTitle: string;
    languageDesc: string;
    dataManagement: string;
    saveDataSize: string;
    resetTitle: string;
    resetDesc: string;
    resetButton: string;
    version: string;
    engine: string;
  };
  antiCheat: {
    warningTitle: string;
    warningDesc: (sec: number) => string;
    statusActive: string;
    statusDesc: string;
    anomalyRate: string;
    anomalyVariance: string;
    anomalySynthetic: string;
    anomalyMacro: string;
    securityBadge: string;
  };
  offlineModal: {
    title: string;
    welcomeBack: string;
    minedWhileAway: string;
    offlineDuration: string;
    collect: string;
  };
  resetModal: {
    title: string;
    warning: string;
    confirmText: string;
    typePrompt: string;
    cancel: string;
    confirm: string;
  };
}

export const translations: Record<Language, Translations> = {
  uz: {
    appName: 'BosiTap',
    tagline: 'Tezkor va aniq tanga bosish platformasi',
    nav: {
      home: 'Asosiy',
      upgrades: 'Do\'kon',
      daily: 'Mukofot',
      stats: 'Statistika',
      leaderboard: 'Reyting',
      settings: 'Sozlamalar',
    },
    auth: {
      title: 'BosiTap Profilini Yarating',
      subtitle: 'O\'yinda ishtirok etish, reytingda o\'z o\'rningizni ko\'rish va natijalarni saqlash uchun profilingizni kiriting.',
      nameLabel: 'Ismingiz',
      namePlaceholder: 'Masalan: Bosi',
      usernameLabel: 'Foydalanuvchi nomi (Username)',
      usernamePlaceholder: 'Masalan: bosi_tap',
      avatarLabel: 'Avatar belgisini tanlang',
      startButton: 'O\'yinni boshlash',
      saveButton: 'Saqlash',
      editProfile: 'Profilni tahrirlash',
      errorNameRequired: 'Iltimos, ismingizni kiriting (kamida 2 ta belgi)',
      errorUsernameRequired: 'Foydalanuvchi nomini kiriting (kamida 3 ta belgi)',
      welcomeBack: 'Qaytib kelganingizdan xursandmiz',
      telegramLoginBtn: 'Telegram orqali tezkor kirish',
      telegramOrManual: 'Yoki ma\'lumotlarni qo\'lda kiriting',
      telegramModalTitle: 'Telegram orqali ulanish',
      telegramModalSubtitle: 'Telegram orqali profilingizni 1 soniyada tasdiqlang va rasmiy ko\'k belgini oling.',
      telegramConnected: 'Telegram hisobi ulandi',
      telegramUnlink: 'Telegramni uzish',
      telegramBotLabel: 'BosiTap Bot',
      telegramCodeHint: 'Telegram botga o\'ting va quyidagi kodni yuboring yoki havolani bosing:',
      telegramConfirmCode: 'Ulanish kodi',
      telegramEnterCodePlaceholder: '6 xonali ulanish kodini kiriting',
      telegramVerifyBtn: 'Tasdiqlash',
      telegramVerifiedBadge: 'Telegram Tasdiqlangan',
      telegramDirectUsernamePrompt: 'Telegram @username orqali bog\'lash',
      telegramLoginSuccess: 'Telegram profilingiz muvaffaqiyatli ulandi!',
      telegramAutoDetected: 'Telegram Mini App foydalanuvchisi aniqlandi',
    },
    telegramBot: {
      title: 'BosiTap Telegram Bot & Mini App',
      subtitle: 'Rasmiy Telegram botimiz orqali tanga bosing, mukofotlarni kuzating va o\'yinni to\'g\'ridan-to\'g\'ri Telegram ichida o\'ynang.',
      botUsername: '@BosiTapBot',
      statusActive: 'Faol (Online)',
      openInTelegram: 'Telegramda ochish',
      copyLink: 'Havolani nusxalash',
      linkCopied: 'Havola nusxalandi!',
      chatTab: 'Jonli Bot Chat',
      commandsTab: 'Buyruqlar ro\'yxati',
      setupTab: 'Bot Token sozlamasi',
      sendBtn: 'Yuborish',
      placeholder: 'Buyruq yoki xabar yozing (masalan: /start, /balance)...',
      quickCommandsTitle: 'Tezkor buyruqlar',
      tokenLabel: 'Telegram BotFather Tokeni',
      tokenPlaceholder: '123456789:ABCdefGhIJKlmNoPQRstuVWXyz',
      tokenSaveBtn: 'Saqlash va Ulanish',
      tokenTestBtn: 'Ulanishni tekshirish',
      tokenSuccess: 'Bot muvaffaqiyatli ulandi va tekshirildi!',
      tokenInvalid: 'Bot tokeni noto\'g\'ri yoki server javob bermadi',
      instructionsTitle: 'Telegram Bot yaratish qo\'llanmasi',
      instructionsText: [
        '1. Telegram ilovasida @BotFather botini oching.',
        '2. Yangi bot ochish uchun /newbot buyrug\'ini yuboring.',
        '3. Botingizga nom bering (masalan: BosiTap Bot) va unikal username tanlang (masalan: bositap_coin_bot).',
        '4. BotFather bergan HTTP API tokenni nusxalab, ushbu sahifadagi maydonga kiriting.',
        '5. Telegram Mini App sozlash uchun /newapp buyrug\'ini yuboring va BosiTap veb-manzilini kiriting.',
      ],
    },
    home: {
      yourBalance: 'SIZNING BALANSINGIZ',
      sessionEarned: 'Sessiya',
      tapToEarn: 'BOSING VA YUTING',
      tapPower: 'Bosish kuchi',
      lifetimeTaps: 'Jami bosishlar',
      currentLevel: 'Daraja',
      passiveIncome: 'Passiv tezlik',
      perSecond: '/sek',
      nextLevelAt: 'Keyingi daraja chegarasi',
      turboOverclock: '2x Tezlanish (Surge)',
      overclockActive: '2x Tezlanish faol!',
      activateOverclock: '2x Tezlanish (20s)',
      cooldownRemaining: 'Kutish vaqti',
      levelUnlockedToast: (lvl: number) => `${lvl}-darajaga erishdingiz!`,
      levelUnlockedSub: 'Do\'konda yangi takomillashtirishlar ochildi.',
      dismiss: 'Yopish',
    },
    upgrades: {
      title: 'Rivojlantirish do\'koni',
      subtitle: 'Bosish kuchini oshiring va Bits qazib olishni avtomatlashtiring.',
      filterAll: 'Barchasi',
      filterTap: 'Bosish kuchi',
      filterMiner: 'Avtomatik mayner',
      filterMultiplier: 'Ko\'paytirgich',
      filterBooster: 'Kuchaytirgich',
      level: 'Daraja',
      cost: 'Narxi',
      benefit: 'Samarasi',
      buy: 'Olish',
      maxed: 'Maksimal',
      locked: 'Qulflangan',
      unlockAtLevel: 'Talab darajasi',
      unlockAtTaps: 'Talab bosishlari',
      insufficientFunds: 'Bits yetarli emas',
      owned: 'Olingan',
      balanceLabel: 'Balans',
    },
    daily: {
      title: 'Kunlik mukofotlar',
      subtitle: 'Har 24 soatda Bits oling. Ketma-ketlikni saqlab daromadingizni ko\'paytiring.',
      day: 'Kun',
      currentStreak: 'Joriy seriya',
      daysStreak: 'kunlik seriya',
      nextClaimIn: 'Keyingi mukofotgacha',
      readyToClaim: 'Mukofot tayyor!',
      claimReward: 'Mukofotni olish',
      claimedToday: 'Bugun olindi',
      streakRuleTitle: 'Seriya davomiyligi qoidasi',
      streakRuleBody: 'Mukofotlar har 24 soatda yangilanadi. Agar ketma-ket 48 soatdan ko\'p vaqt o\'tib ketsa, seriya yana 1-kundan boshlanadi.',
      storageNoticeTitle: 'Xavfsiz qurilma xotirasi',
      storageNoticeBody: 'Natijalaringiz, seriyalaringiz va balansingiz qurilma xotirasida xavfsiz saqlanadi.',
      streakExtendedToast: 'Kunlik seriya davom ettirildi! Balansingizga Bits qo\'shildi.',
      dayLabel: (d: number) => `${d}-kun`,
    },
    stats: {
      title: 'Hisobot va statistika',
      subtitle: 'Sizning Bits iqtisodiyotingiz bo\'yicha to\'liq tahliliy ma\'lumotlar.',
      currentBalance: 'Mavjud Bits',
      lifetimeBits: 'Jami topilgan Bits',
      totalTaps: 'Jami bosishlar soni',
      effectiveTapPower: 'Bosish quvvati',
      passiveIncome: 'Passiv oqim',
      playerLevel: 'O\'yinchi darajasi',
      upgradesPurchased: 'Sotib olingan yangilanishlar',
      streak: 'Kunlik seriya',
      sessionTime: 'Sessiya davomiyligi',
      sessionBits: 'Ushbu sessiyada',
      tapPace: 'Bosish tezligi',
      tapsPerSec: 'bosish/sek',
      achievementsTitle: 'Yutuqlar va marralar',
      achievementsSubtitle: 'Maxsus ko\'rsatkichlarga yetib qo\'shimcha Bits mukofotlarini oling.',
      claimReward: 'Olish',
      claimed: 'Qabul qilindi',
      progress: 'Jarayon',
      unlocked: 'Ochildi',
    },
    leaderboard: {
      title: 'Haqiqiy o\'yinchilar reytingi',
      subtitle: 'Haqiqiy o\'yinchilar natijalari, shaxsiy rekordlar va divizion bosqichlari.',
      badge: 'Faqat haqiqiy o\'yinchilar',
      yourRank: 'Sizning natijangiz',
      yourStats: 'Joriy ko\'rsatkich',
      filterAll: 'Shaxsiy rekordlar',
      filterWeekly: 'Haftalik natijalar',
      filterLeagues: 'Ligalar va Divizionlar',
      rankCol: 'O\'rin',
      playerCol: 'O\'yinchi',
      bitsCol: 'Jami Bits',
      rateCol: 'Passiv tezlik',
      youBadge: 'SIZ',
      pointsToNext: 'Keyingi divizion chegarasigacha',
      realPlayersOnlyTitle: 'Botlarsiz toza raqobat',
      realPlayersOnlyDesc: 'Bu reytingda soxta botlar yo\'q. Faqat qurilmangizdagi haqiqiy natijalar va rasmiy divizion standartlari ko\'rsatiladi.',
      divisions: {
        bronze: 'Bronza ligasi',
        silver: 'Kumush ligasi',
        gold: 'Oltin ligasi',
        platinum: 'Platina ligasi',
        diamond: 'Olmos ligasi',
        master: 'Usta (Master) ligasi',
      },
    },
    settings: {
      title: 'Sozlamalar',
      subtitle: 'Profil, ko\'rinish, ovoz va qurilma ma\'lumotlarini boshqarish.',
      profileTitle: 'Foydalanuvchi profili',
      profileDesc: 'Ism, username va avatarni o\'zgartirish.',
      editProfileBtn: 'Profilni tahrirlash',
      themeTitle: 'Tungi rejim (Dark Mode)',
      themeDesc: 'Qulay ko\'rinish uchun qorong\'i yoki yorug\' mavzuni tanlang.',
      lightTheme: 'Yorug\' rejim',
      darkTheme: 'Qorong\'i (Dark)',
      soundTitle: 'Ovoz effektlari',
      soundDesc: 'Har bir bosish va yutuq uchun toza sintez ovozlari.',
      hapticsTitle: 'Titroq (Haptics)',
      hapticsDesc: 'Sensorli ekranda bosish payti yumshoq tebranish.',
      reducedMotionTitle: 'Harakatlarni kamaytirish',
      reducedMotionDesc: 'Harakatlar va sakrash animatsiyalarini yumshatish.',
      compactNumbersTitle: 'Qisqa raqamlar formati',
      compactNumbersDesc: 'Katta sonlarni qisqartirib ko\'rsatish (masalan: 1.5M).',
      languageTitle: 'Ilova tili',
      languageDesc: 'Interfeys tilini tanlang.',
      dataManagement: 'Qurilma xotirasi',
      saveDataSize: 'Foydalanilgan xotira',
      resetTitle: 'Qayta tiklash (Tozalash)',
      resetDesc: 'Barcha Bits, yutuqlar va darajalarni to\'liq tozalash.',
      resetButton: 'Barcha ma\'lumotlarni o\'chirish',
      version: 'BosiTap Tizimi',
      engine: 'Arxitektura: React 19 + TypeScript + Web Audio',
    },
    antiCheat: {
      warningTitle: 'Anti-Cheat Himoyasi',
      warningDesc: (sec: number) => `G'ayritabiiy yoki avtomatik bosish aniqlandi. Halol o'yin uchun tizim ${sec} soniyaga sovutish rejimiga o'tdi.`,
      statusActive: 'Anti-Cheat: Faol & Himoyalangan',
      statusDesc: 'Barcha bosishlar inson tomonidan amalga oshirilgani tekshirilmoqda.',
      anomalyRate: 'Juda yuqori bosish tezligi (CPS > 20)',
      anomalyVariance: 'Bir xil millisekundli robot skripti',
      anomalySynthetic: 'Sintetik dasturiy teginish aniqlandi',
      anomalyMacro: 'Statik nuqtali makros bosish',
      securityBadge: 'Xavfsiz Tizim',
    },
    offlineModal: {
      title: 'Oflayn daromad qabul qilindi',
      welcomeBack: 'BosiTap ga xush kelibsiz!',
      minedWhileAway: 'Siz yo\'qligingizda avtomatik maynerlar siz uchun Bits yig\'ishni davom ettirdi.',
      offlineDuration: 'Oflayn bo\'lgan vaqtingiz',
      collect: 'Bitslarni qabul qilish',
    },
    resetModal: {
      title: 'To\'liq tozalashni tasdiqlang',
      warning: 'Bu amal qaytarilmasdir. Sizning barcha to\'plagan Bitslaringiz, sotib olingan yangilanishlar va yutuqlaringiz butunlay o\'chiriladi.',
      confirmText: 'Tasdiqlash uchun RESET deb yozing:',
      typePrompt: 'RESET',
      cancel: 'Bekor qilish',
      confirm: 'Hammasini o\'chirish',
    },
  },
  en: {
    appName: 'BosiTap',
    tagline: 'Precision Incremental Clicker',
    nav: {
      home: 'Tap',
      upgrades: 'Shop',
      daily: 'Rewards',
      stats: 'Stats',
      leaderboard: 'Leaderboard',
      settings: 'Settings',
    },
    auth: {
      title: 'Create Your BosiTap Profile',
      subtitle: 'Enter your name and username to join the leaderboard and track your progression.',
      nameLabel: 'Your Name',
      namePlaceholder: 'e.g., Bosi',
      usernameLabel: 'Username',
      usernamePlaceholder: 'e.g., bosi_tap',
      avatarLabel: 'Select Your Avatar Icon',
      startButton: 'Start Playing',
      saveButton: 'Save Changes',
      editProfile: 'Edit Profile',
      errorNameRequired: 'Please enter your name (min 2 characters)',
      errorUsernameRequired: 'Please enter a username (min 3 characters)',
      welcomeBack: 'Welcome back',
      telegramLoginBtn: 'Fast Login with Telegram',
      telegramOrManual: 'Or enter details manually',
      telegramModalTitle: 'Connect with Telegram',
      telegramModalSubtitle: 'Verify your identity instantly via Telegram and receive the official verified badge.',
      telegramConnected: 'Telegram Connected',
      telegramUnlink: 'Unlink Telegram',
      telegramBotLabel: 'BosiTap Bot',
      telegramCodeHint: 'Open our Telegram bot and send this code or click the direct link:',
      telegramConfirmCode: 'Auth Code',
      telegramEnterCodePlaceholder: 'Enter 6-digit PIN code',
      telegramVerifyBtn: 'Verify Code',
      telegramVerifiedBadge: 'Telegram Verified',
      telegramDirectUsernamePrompt: 'Link via Telegram @username',
      telegramLoginSuccess: 'Telegram account successfully linked!',
      telegramAutoDetected: 'Telegram Mini App user detected',
    },
    telegramBot: {
      title: 'BosiTap Telegram Bot & Mini App',
      subtitle: 'Tap coins, track earnings, and play BosiTap directly inside Telegram via our official bot.',
      botUsername: '@BosiTapBot',
      statusActive: 'Active (Online)',
      openInTelegram: 'Open in Telegram',
      copyLink: 'Copy Link',
      linkCopied: 'Link copied!',
      chatTab: 'Live Bot Chat',
      commandsTab: 'Bot Commands',
      setupTab: 'Bot Token Setup',
      sendBtn: 'Send',
      placeholder: 'Type a command or message (e.g. /start, /balance)...',
      quickCommandsTitle: 'Quick Commands',
      tokenLabel: 'Telegram BotFather Token',
      tokenPlaceholder: '123456789:ABCdefGhIJKlmNoPQRstuVWXyz',
      tokenSaveBtn: 'Save & Connect',
      tokenTestBtn: 'Test Connection',
      tokenSuccess: 'Bot verified and connected successfully!',
      tokenInvalid: 'Invalid bot token or failed to reach Telegram server',
      instructionsTitle: 'How to Create Your Telegram Bot',
      instructionsText: [
        '1. Open @BotFather in Telegram.',
        '2. Send /newbot to create a new bot.',
        '3. Enter your bot name (e.g., BosiTap Bot) and unique username (e.g., bositap_coin_bot).',
        '4. Copy the HTTP API token provided by BotFather and paste it here.',
        '5. Send /newapp to configure your Telegram Mini App with your BosiTap URL.',
      ],
    },
    home: {
      yourBalance: 'YOUR BALANCE',
      sessionEarned: 'Session',
      tapToEarn: 'TAP TO EARN',
      tapPower: 'Tap Power',
      lifetimeTaps: 'Lifetime Taps',
      currentLevel: 'Level',
      passiveIncome: 'Passive Rate',
      perSecond: '/sec',
      nextLevelAt: 'Next level at',
      turboOverclock: 'Overclock Surge',
      overclockActive: 'Surge 2x Active!',
      activateOverclock: 'Boost (2x for 20s)',
      cooldownRemaining: 'Cooldown',
      levelUnlockedToast: (lvl: number) => `Level ${lvl} Unlocked!`,
      levelUnlockedSub: 'New upgrades now available in the shop.',
      dismiss: 'Dismiss',
    },
    upgrades: {
      title: 'Upgrade Lab',
      subtitle: 'Expand click power and automate your Bits production.',
      filterAll: 'All',
      filterTap: 'Tap Power',
      filterMiner: 'Auto Miner',
      filterMultiplier: 'Multipliers',
      filterBooster: 'Boosters',
      level: 'Lvl',
      cost: 'Cost',
      benefit: 'Effect',
      buy: 'Upgrade',
      maxed: 'Max Level',
      locked: 'Locked',
      unlockAtLevel: 'Unlocks at Level',
      unlockAtTaps: 'Unlocks at Taps',
      insufficientFunds: 'Need more Bits',
      owned: 'Owned',
      balanceLabel: 'Balance',
    },
    daily: {
      title: 'Daily Rewards',
      subtitle: 'Claim Bits every 24 hours. Keep your streak alive to multiply earnings.',
      day: 'Day',
      currentStreak: 'Current Streak',
      daysStreak: 'days streak',
      nextClaimIn: 'Next Reward In',
      readyToClaim: 'Ready to Claim!',
      claimReward: 'Claim Reward',
      claimedToday: 'Claimed Today',
      streakRuleTitle: 'Streak Continuity Rule',
      streakRuleBody: 'Claims reset every 24 hours. If more than 48 hours pass between claims, your streak restarts at Day 1.',
      storageNoticeTitle: 'Local Device Storage',
      storageNoticeBody: 'Streaks and balances are tracked safely in device storage.',
      streakExtendedToast: 'Daily streak extended! Bits have been added to your balance.',
      dayLabel: (d: number) => `Day ${d}`,
    },
    stats: {
      title: 'Telemetry & Records',
      subtitle: 'Real-time performance audit of your Bits economy.',
      currentBalance: 'Current Bits',
      lifetimeBits: 'Lifetime Earned',
      totalTaps: 'Total Taps',
      effectiveTapPower: 'Tap Power',
      passiveIncome: 'Passive Rate',
      playerLevel: 'Player Level',
      upgradesPurchased: 'Upgrades Owned',
      streak: 'Daily Streak',
      sessionTime: 'Session Time',
      sessionBits: 'Session Earned',
      tapPace: 'Tap Velocity',
      tapsPerSec: 'taps/sec',
      achievementsTitle: 'Milestones & Achievements',
      achievementsSubtitle: 'Earn Bits bonuses by reaching operational targets.',
      claimReward: 'Claim',
      claimed: 'Claimed',
      progress: 'Progress',
      unlocked: 'Unlocked',
    },
    leaderboard: {
      title: 'Real Players & Benchmarks',
      subtitle: 'Track your real progression, device session records, and division tiers.',
      badge: 'Real Players Only',
      yourRank: 'Your Standing',
      yourStats: 'Your Output',
      filterAll: 'Personal Records',
      filterWeekly: 'Weekly Sessions',
      filterLeagues: 'Division Circuit',
      rankCol: 'Rank',
      playerCol: 'Player',
      bitsCol: 'Lifetime Bits',
      rateCol: 'Rate',
      youBadge: 'YOU',
      pointsToNext: 'Bits to next division',
      realPlayersOnlyTitle: 'Clean Competition Without Bots',
      realPlayersOnlyDesc: 'No simulated fake bot accounts. Displays strictly verified player stats and official league benchmarks.',
      divisions: {
        bronze: 'Bronze Division',
        silver: 'Silver Division',
        gold: 'Gold Division',
        platinum: 'Platinum Division',
        diamond: 'Diamond Division',
        master: 'Master League',
      },
    },
    settings: {
      title: 'Preferences',
      subtitle: 'Configure profile, theme, audio, accessibility, and local storage state.',
      profileTitle: 'Player Profile',
      profileDesc: 'Customize your public name, username, and avatar.',
      editProfileBtn: 'Edit Profile',
      themeTitle: 'Theme Mode (Dark / Light)',
      themeDesc: 'Toggle between dark and light appearance.',
      lightTheme: 'Light Mode',
      darkTheme: 'Dark Mode',
      soundTitle: 'Acoustic Feedback',
      soundDesc: 'Real-time synthesized audio clicks and progression chimes.',
      hapticsTitle: 'Haptic Vibration',
      hapticsDesc: 'Tactile vibration pulse on mobile touchscreen devices.',
      reducedMotionTitle: 'Reduced Motion',
      reducedMotionDesc: 'Minimize coin bounces, screen shakes, and floating particles.',
      compactNumbersTitle: 'Compact Number Format',
      compactNumbersDesc: 'Display large figures in concise notations (e.g., 1.5M vs 1,500,000).',
      languageTitle: 'Language (Til)',
      languageDesc: 'Choose your interface language.',
      dataManagement: 'Device Storage',
      saveDataSize: 'Storage footprint',
      resetTitle: 'Factory Reset',
      resetDesc: 'Permanently wipe all Bits, upgrades, and achievement records.',
      resetButton: 'Reset All Progress',
      version: 'BosiTap Engine',
      engine: 'Architecture: React 19 + TypeScript + Web Audio',
    },
    antiCheat: {
      warningTitle: 'Anti-Cheat Protection',
      warningDesc: (sec: number) => `Automated clicker or script anomaly detected. Tapping paused for ${sec}s to preserve fair play.`,
      statusActive: 'Anti-Cheat: Active & Secure',
      statusDesc: 'All taps are verified for genuine human physical input.',
      anomalyRate: 'Extreme click velocity (CPS > 20)',
      anomalyVariance: 'Robotic zero-variance interval script',
      anomalySynthetic: 'Synthetic script event injected',
      anomalyMacro: 'Static subpixel coordinate macro',
      securityBadge: 'Shield Active',
    },
    offlineModal: {
      title: 'Offline Yield Collected',
      welcomeBack: 'Welcome back to BosiTap!',
      minedWhileAway: 'Your automated mining rigs continued extracting Bits while you were away.',
      offlineDuration: 'Time away',
      collect: 'Collect Bits',
    },
    resetModal: {
      title: 'Confirm Factory Reset',
      warning: 'This action is irreversible. All of your Bits, purchased upgrades, daily streaks, and unlocked achievements will be permanently erased from this device.',
      confirmText: 'Type RESET to confirm:',
      typePrompt: 'RESET',
      cancel: 'Cancel',
      confirm: 'Wipe Everything',
    },
  },
};
