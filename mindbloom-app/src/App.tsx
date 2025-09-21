import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './hooks/useStore';
import { AvatarScene } from './components/AvatarScene2D';
import { BotpressChat } from './components/BotpressChat';
import { UserAvatar } from './components/UserAvatar';
import { XPBar } from './components/XPBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CrisisModal } from './components/CrisisModal';
import { LoadingScreen } from './components/LoadingScreen';
import { CommunityPlatform } from './components/CommunityPlatform';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Dashboard } from './components/Dashboard';
import { PeerCircles } from './components/PeerCircles';
import { StoriesPage } from './components/StoriesPage';
import { ChallengesPage } from './components/ChallengesPage';
import { GardenPage } from './components/GardenPage';
import { ProgressPage } from './components/ProgressPage';
import { ResourcesPage } from './components/ResourcesPage';
import { SettingsPage } from './components/SettingsPage';

function App() {
  const { 
    user, 
    isLoading, 
    crisisDetected,
    initializeApp,
    initializeBotpress,
    showInitialGreeting,
    setUser
  } = useStore();

  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'chat' | 'community' | 'circles' | 'stories' | 'challenges' | 'garden' | 'progress' | 'resources' | 'settings'>('dashboard');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [currentAvatarMessage, setCurrentAvatarMessage] = useState('');

  useEffect(() => {
    const initializeEverything = async () => {
      await initializeApp();
      await initializeBotpress();
    };
    initializeEverything();
  }, [initializeApp, initializeBotpress]);

  useEffect(() => {
    if (user) {
      setShowWelcome(false);
      setShowOnboarding(false);
      // Show initial greeting after user is set and welcome screen is closed
      setTimeout(() => {
        showInitialGreeting();
      }, 1000);
    }
  }, [user, showInitialGreeting]);

  const handleOnboardingComplete = (userData: any) => {
    // Create user object from onboarding data
    const newUser = {
      id: Date.now().toString(),
      nickname: userData.nickname,
      age: userData.ageBand,
      language: userData.language,
      avatarLevel: 1,
      xp: 0,
      streak: 0,
      createdAt: new Date()
    };
    setUser(newUser);
    setShowOnboarding(false);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setShowOnboarding(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <AnimatePresence>
          {showWelcome && (
            <WelcomeScreen onComplete={handleWelcomeComplete} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showOnboarding && (
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          )}
        </AnimatePresence>

        {crisisDetected && <CrisisModal />}

        {user && (
          <main className="relative min-h-screen">
            {/* Navigation Header */}
            <motion.header 
              className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <UserAvatar level={user.avatarLevel} />
                    <div>
                      <h1 className="text-xl font-semibold text-gray-800">
                        Welcome, {user.nickname}
                      </h1>
                      <p className="text-sm text-gray-600">
                        Day {user.streak} streak • {user.xp} XP
                      </p>
                    </div>
                  </div>
                  <XPBar currentXP={user.xp} level={user.avatarLevel} />
                </div>
              </div>
            </motion.header>

            {/* Main Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex space-x-1 overflow-x-auto py-2">
                  {[
                    { id: 'dashboard', label: '🏠 Dashboard', page: 'dashboard' },
                    { id: 'chat', label: '💬 Chat with Mira', page: 'chat' },
                    { id: 'circles', label: '👥 Peer Circles', page: 'circles' },
                    { id: 'community', label: '🌍 Community', page: 'community' },
                    { id: 'stories', label: '📖 Stories', page: 'stories' },
                    { id: 'challenges', label: '🎯 Challenges', page: 'challenges' },
                    { id: 'garden', label: '🌱 Garden', page: 'garden' },
                    { id: 'progress', label: '📊 Progress', page: 'progress' },
                    { id: 'resources', label: '📚 Resources', page: 'resources' },
                    { id: 'settings', label: '⚙️ Settings', page: 'settings' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.page as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        currentPage === item.page
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {currentPage === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard user={user} onNavigate={setCurrentPage} />
                  </motion.div>
                )}

                {currentPage === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-screen pt-16"
                  >
                    <div className="flex-1 relative">
                      <AvatarScene 
                        isSpeaking={isAvatarSpeaking}
                        currentMessage={currentAvatarMessage}
                      />
                    </div>
                    <div className="w-96 bg-white/80 backdrop-blur-sm border-l border-gray-200">
                      <BotpressChat 
                        onMessage={(message, isFromUser) => {
                          if (!isFromUser) {
                            setCurrentAvatarMessage(message);
                          }
                        }}
                        onSpeaking={(speaking) => {
                          setIsAvatarSpeaking(speaking);
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {currentPage === 'circles' && (
                  <motion.div
                    key="circles"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PeerCircles user={user} onBack={() => setCurrentPage('dashboard')} />
                  </motion.div>
                )}

                {currentPage === 'community' && (
                  <motion.div
                    key="community"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <CommunityPlatform />
                  </motion.div>
                )}

                {currentPage === 'stories' && (
                  <motion.div
                    key="stories"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StoriesPage user={user} onBack={() => setCurrentPage('dashboard')} />
                  </motion.div>
                )}

                {currentPage === 'challenges' && (
                  <motion.div
                    key="challenges"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChallengesPage user={user} onBack={() => setCurrentPage('dashboard')} />
                  </motion.div>
                )}

                {currentPage === 'garden' && (
                  <motion.div
                    key="garden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GardenPage user={user} onBack={() => setCurrentPage('dashboard')} />
                  </motion.div>
                )}

                {currentPage === 'progress' && (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProgressPage user={user} onBack={() => setCurrentPage('dashboard')} />
                  </motion.div>
                )}

                {currentPage === 'resources' && (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ResourcesPage user={user} onBack={() => setCurrentPage('dashboard')} />
                  </motion.div>
                )}

                {currentPage === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SettingsPage user={user} onBack={() => setCurrentPage('dashboard')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        )}

        <Routes>
          <Route path="/breathing" element={<div>Breathing Exercise</div>} />
          <Route path="/journaling" element={<div>Journaling</div>} />
          <Route path="/exercises" element={<div>CBT Exercises</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
