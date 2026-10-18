/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthModal } from './components/AuthModal';
import { FloatingNumbersOverlay } from './components/FloatingNumber';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OfflineModal } from './components/OfflineModal';
import { GameProvider, useGame } from './context/GameContext';
import { DailyPage } from './pages/DailyPage';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';
import { UpgradesPage } from './pages/UpgradesPage';

function AppContent() {
  const { activeTab, floatingTexts } = useGame();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'upgrades':
        return <UpgradesPage />;
      case 'daily':
        return <DailyPage />;
      case 'stats':
        return <StatsPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-white dark:bg-[#0E121B] text-[#111111] dark:text-[#F3F4F6] flex flex-col font-sans selection:bg-[#111111] dark:selection:bg-white selection:text-white dark:selection:text-[#111111] transition-colors overflow-x-hidden">
      {/* Top Bar Navigation */}
      <Header />

      {/* Main Content Area: Zero overflow on Home, comfortable scroll clearance on other tabs */}
      <main className={`flex-1 w-full ${activeTab === 'home' ? 'overflow-hidden' : 'pb-20 md:pb-8 overflow-y-auto'}`}>
        {renderActiveScreen()}
      </main>

      {/* Mobile Bottom Navigation */}
      <Navigation />

      {/* Floating Particles Overlay */}
      <FloatingNumbersOverlay items={floatingTexts} />

      {/* Offline Earnings Dialog */}
      <OfflineModal />

      {/* Auth / Profile Onboarding Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
