import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useStore } from './hooks/useStore';
import { VirtualWorld } from './components/VirtualWorld';
import { PixelAvatar } from './components/PixelAvatar';
import { CommunitySpaces } from './components/CommunitySpaces';
import { WellnessChallenges } from './components/WellnessChallenges';
import { CommunityChat } from './components/CommunityChat';
import { AchievementSystem } from './components/AchievementSystem';
import { WelcomePortal } from './components/WelcomePortal';
import { SafetyGuard } from './components/SafetyGuard';
import { LoadingScreen } from './components/LoadingScreen';
import './App.css';

function App() {
  const { 
    user, 
    avatar, 
    isLoading, 
    initializeApp,
    communityStats 
  } = useStore();

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    if (user && avatar) {
      setShowWelcome(false);
    }
  }, [user, avatar]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-purple-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />

        <AnimatePresence>
          {showWelcome && (
            <WelcomePortal onComplete={() => setShowWelcome(false)} />
          )}
        </AnimatePresence>

        <SafetyGuard />

        <main className="relative h-screen overflow-hidden">
          {/* Header with Community Stats */}
          {user && avatar && (
            <motion.header 
              className="absolute top-0 left-0 right-0 z-20 p-4 bg-white/80 backdrop-blur-sm border-b border-emerald-200"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                  <PixelAvatar 
                    avatar={avatar} 
                    size="medium" 
                    showMood={true}
                    isClickable={false}
                  />
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">
                      Welcome to WellnessWorld, {avatar.name}!
                    </h1>
                    <p className="text-sm text-gray-600">
                      Level {avatar.level} • {avatar.xp} XP
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">
                      {communityStats.activeUsers}
                    </div>
                    <div className="text-xs text-gray-600">Online</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {communityStats.empathyPointsToday}
                    </div>
                    <div className="text-xs text-gray-600">Empathy Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {communityStats.supportGivenToday}
                    </div>
                    <div className="text-xs text-gray-600">Support Given</div>
                  </div>
                </div>
              </div>
            </motion.header>
          )}

          {/* Main Virtual World */}
          <div className="flex h-full pt-20">
            <div className="flex-1 relative">
              <VirtualWorld />
            </div>

            {/* Sidebar with Community Features */}
            <div className="w-80 bg-white/90 backdrop-blur-sm border-l border-emerald-200 overflow-y-auto">
              <div className="p-4 space-y-4">
                <CommunitySpaces />
                <WellnessChallenges />
                <CommunityChat />
                <AchievementSystem />
              </div>
            </div>
          </div>
        </main>

        <Routes>
          <Route path="/space/:spaceId" element={<div>Space Detail</div>} />
          <Route path="/challenge/:challengeId" element={<div>Challenge Detail</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
