/**
 * Enhanced Gamified Challenges Page
 * Full XP system, streaks, mini-games, leaderboards, and rewards
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Flame,
  Trophy,
  Star,
  Zap,
  Crown,
  Users,
  Gift,
  TrendingUp,
  Calendar,
  Play,
  Lock,
  CheckCircle,
  Coins,
  BarChart3,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { BloomButton } from './ui/BloomButton';
import { XPToast } from './ui/XPToast';
import { AchievementCard } from './ui/AchievementCard';
import { QuestMap } from './ui/QuestMap';
import { useTheme } from '../contexts/ThemeContext';
import { useGamification } from '../contexts/GamificationContext';
import { xpService } from '../services/xpService';
import { streakService, StreakData } from '../services/streakService';
import { rewardService, Reward } from '../services/rewardService';
import { leaderboardService, LeaderboardEntry } from '../services/leaderboardService';
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { TypeRacerGame } from './games/TypeRacerGame';
import { TriviaGame } from './games/TriviaGame';
import { BreathingDragonGame } from './BreathingDragonGame';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  status: 'completed' | 'available' | 'locked';
  category: 'breathing' | 'mindfulness' | 'gratitude' | 'journaling' | 'exercise' | 'game';
  duration?: number; // minutes
  icon: string;
  requiresLevel?: number;
}

interface DailyChallenge extends Challenge {
  isDaily: true;
  completedToday: boolean;
}

interface ChallengesPageProps {
  user: any;
  onBack: () => void;
}

export function ChallengesPageEnhanced({ user, onBack }: ChallengesPageProps) {
  const { mood } = useTheme();
  const { xp, level, addXP } = useGamification();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [showRewardStore, setShowRewardStore] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState<'memory' | 'typeracer' | 'trivia' | 'breathing' | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [xpToast, setXpToast] = useState<{ show: boolean; xp: number }>({ show: false, xp: 0 });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadChallenges();
      loadStreak();
      loadRewards();
      loadLeaderboard();
    }
  }, [user, level]);

  const loadChallenges = () => {
    const allChallenges: Challenge[] = [
      {
        id: '1',
        title: '5-Minute Breathing',
        description: 'Complete a guided breathing exercise',
        difficulty: 'easy',
        xpReward: 25,
        status: level >= 1 ? 'available' : 'locked',
        category: 'breathing',
        duration: 5,
        icon: '🫁',
        requiresLevel: 1,
      },
      {
        id: '2',
        title: 'Gratitude Journal',
        description: 'Write 3 things you\'re grateful for',
        difficulty: 'easy',
        xpReward: 30,
        status: level >= 1 ? 'available' : 'locked',
        category: 'gratitude',
        icon: '🙏',
        requiresLevel: 1,
      },
      {
        id: '3',
        title: 'Mindful Walk',
        description: 'Take a 10-minute mindful walk',
        difficulty: 'medium',
        xpReward: 50,
        status: level >= 3 ? 'available' : 'locked',
        category: 'exercise',
        duration: 10,
        icon: '🚶',
        requiresLevel: 3,
      },
      {
        id: '4',
        title: 'Reflection Meditation',
        description: '15-minute guided meditation',
        difficulty: 'medium',
        xpReward: 60,
        status: level >= 5 ? 'available' : 'locked',
        category: 'mindfulness',
        duration: 15,
        icon: '🧘',
        requiresLevel: 5,
      },
      {
        id: '5',
        title: 'Breathing Dragon',
        description: 'Complete a guided breathing exercise with camera tracking',
        difficulty: 'easy',
        xpReward: 50,
        status: 'available',
        category: 'breathing',
        duration: 5,
        icon: '🐉',
      },
      {
        id: '6',
        title: 'Memory Match',
        description: 'Complete the memory game',
        difficulty: 'medium',
        xpReward: 75,
        status: 'available',
        category: 'game',
        icon: '🎮',
      },
      {
        id: '7',
        title: 'Type Racer',
        description: 'Speed typing challenge',
        difficulty: 'hard',
        xpReward: 100,
        status: 'available',
        category: 'game',
        icon: '⌨️',
      },
      {
        id: '8',
        title: 'Wellness Trivia',
        description: 'Test your wellness knowledge',
        difficulty: 'hard',
        xpReward: 120,
        status: level >= 7 ? 'available' : 'locked',
        category: 'game',
        icon: '🧠',
        requiresLevel: 7,
      },
    ];

    // Check completion status from localStorage
    const completed = JSON.parse(localStorage.getItem(`completed-challenges-${user.id}`) || '[]');
    const updated = allChallenges.map(challenge => ({
      ...challenge,
      status: completed.includes(challenge.id)
        ? 'completed'
        : challenge.status,
    }));

    setChallenges(updated);

    // Set daily challenge
    const today = new Date().toISOString().split('T')[0];
    const dailyCompleted = localStorage.getItem(`daily-${today}-${user.id}`);
    
    const daily: DailyChallenge = {
      id: 'daily-1',
      title: 'Daily Wellness Check',
      description: 'Complete your daily wellness routine',
      difficulty: 'easy',
      xpReward: 50,
      status: 'available',
      category: 'mindfulness',
      icon: '⭐',
      isDaily: true,
      completedToday: !!dailyCompleted,
    };
    setDailyChallenge(daily);
  };

  const loadStreak = async () => {
    if (!user) return;
    const streakData = await streakService.getStreak(user.id);
    setStreak(streakData);
  };

  const loadRewards = async () => {
    if (!user) return;
    const loaded = await rewardService.loadRewards(user.id);
    setRewards(loaded);
  };

  const loadLeaderboard = async () => {
    const data = await leaderboardService.getWeeklyLeaderboard();
    setLeaderboard(data);
  };

  const handleChallengeComplete = async (challengeId: string, bonusXP: number = 0) => {
    if (!user) return;

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.status === 'completed') return;

    // Record activity for streak
    const updatedStreak = await streakService.recordActivity(user.id);
    setStreak(updatedStreak);

    // Calculate XP with streak multiplier
    const baseXP = challenge.xpReward;
    const multiplier = updatedStreak.streakMultiplier;
    const finalXP = Math.round((baseXP + bonusXP) * multiplier);

    // Add XP
    const previousLevel = level;
    await addXP({
      id: `${challengeId}-${Date.now()}`,
      type: challenge.category === 'game' ? 'game' : 'challenge',
      xp: finalXP,
      description: challenge.title,
      timestamp: new Date(),
    });

    // Check for level up
    if (level > previousLevel) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    // Show XP toast
    setXpToast({ show: true, xp: finalXP });
    setTimeout(() => setXpToast({ show: false, xp: 0 }), 2000);

    // Mark as completed
    const completed = JSON.parse(localStorage.getItem(`completed-challenges-${user.id}`) || '[]');
    if (!completed.includes(challengeId)) {
      completed.push(challengeId);
      localStorage.setItem(`completed-challenges-${user.id}`, JSON.stringify(completed));
    }

    // Reload challenges
    loadChallenges();
  };

  const handleDailyChallenge = async () => {
    if (!user || !dailyChallenge) return;
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`daily-${today}-${user.id}`, 'completed');
    
    await handleChallengeComplete(dailyChallenge.id, 25); // Bonus XP for daily
    loadChallenges();
  };

  const handleMiniGameComplete = async (gameType: string, score: number) => {
    const challenge = challenges.find(c => 
      (gameType === 'breathing' && c.id === '5') ||
      (gameType === 'memory' && c.id === '6') ||
      (gameType === 'typeracer' && c.id === '7') ||
      (gameType === 'trivia' && c.id === '8')
    );
    
    if (challenge) {
      await handleChallengeComplete(challenge.id, score);
    }
    
    setShowMiniGame(null);
  };

  const handlePurchaseReward = async (rewardId: string) => {
    if (!user) return;
    
    const result = await rewardService.purchaseReward(user.id, rewardId, xp);
    
    if (result.success) {
      // Update XP in context
      await addXP({
        id: `purchase-${Date.now()}`,
        type: 'game',
        xp: -rewardService.getRewards().find(r => r.id === rewardId)!.cost,
        description: `Purchased reward`,
        timestamp: new Date(),
      });
      
      loadRewards();
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const filteredChallenges = selectedCategory === 'all'
    ? challenges
    : challenges.filter(c => c.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'available': return <Play className="w-5 h-5 text-blue-500" />;
      case 'locked': return <Lock className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Target className="w-6 h-6 mr-2 text-purple-500" />
                Challenges & Games
              </h1>
              <p className="text-gray-600">Level up through wellness activities</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* XP Display */}
            <div className="text-right">
              <div className="text-sm text-gray-600">Level {level}</div>
              <div className="text-lg font-bold text-purple-600">{xp} XP</div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <BloomButton
                variant="secondary"
                size="sm"
                onClick={() => setShowLeaderboard(true)}
                icon={<Trophy className="w-4 h-4" />}
              >
                Leaderboard
              </BloomButton>
              <BloomButton
                variant="mint"
                size="sm"
                onClick={() => setShowRewardStore(true)}
                icon={<Gift className="w-4 h-4" />}
              >
                Rewards
              </BloomButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Streak & Daily Challenge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Streak Card */}
          {streak && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-6 shadow-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Flame className="w-6 h-6 mr-2 text-orange-500" />
                  Streak
                </h2>
                <div className="text-3xl font-bold text-orange-600">
                  {streak.currentStreak}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Current Streak</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {Math.round(streak.streakMultiplier * 100 - 100)}% XP Bonus
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(streak.currentStreak / 7) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-orange-400 to-red-400 h-3 rounded-full"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Longest Streak</span>
                  <span className="font-semibold text-gray-800">{streak.longestStreak} days</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Daily Challenge */}
          {dailyChallenge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-strong rounded-2xl p-6 shadow-xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-yellow-500" />
                  Daily Challenge
                </h2>
                {dailyChallenge.completedToday && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              
              <div className="mb-4">
                <div className="text-3xl mb-2">{dailyChallenge.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{dailyChallenge.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{dailyChallenge.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    {dailyChallenge.xpReward} XP + 25 Bonus
                  </span>
                  <span className="text-xs text-gray-600">
                    {streak?.streakMultiplier ? `+${Math.round((dailyChallenge.xpReward + 25) * (streak.streakMultiplier - 1))} XP` : ''}
                  </span>
                </div>
              </div>
              
              <BloomButton
                variant="primary"
                size="md"
                onClick={handleDailyChallenge}
                disabled={dailyChallenge.completedToday}
                className="w-full"
              >
                {dailyChallenge.completedToday ? 'Completed Today!' : 'Start Daily Challenge'}
              </BloomButton>
            </motion.div>
          )}
        </div>

        {/* XP Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-6 shadow-xl mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
              Progress to Level {level + 1}
            </h2>
            <div className="text-sm text-gray-600">
              {xp} / {(level + 1) * 100} XP
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-6">
              <motion.div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-6 rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${(xp / ((level + 1) * 100)) * 100}%` }}
                transition={{ duration: 0.5 }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All', icon: '🎯' },
              { id: 'breathing', label: 'Breathing', icon: '🫁' },
              { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
              { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
              { id: 'journaling', label: 'Journaling', icon: '📝' },
              { id: 'game', label: 'Games', icon: '🎮' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quest Map */}
        {challenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-2xl p-6 shadow-xl mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
              Quest Map
            </h2>
            <div className="h-64 bg-white/30 rounded-xl p-4">
              <QuestMap
                quests={challenges.slice(0, 6).map((challenge, idx) => ({
                  id: challenge.id,
                  title: challenge.title,
                  status: challenge.status as 'completed' | 'available' | 'locked',
                  x: 20 + (idx % 3) * 35,
                  y: 30 + Math.floor(idx / 3) * 40,
                }))}
                onQuestClick={(questId) => {
                  const challenge = challenges.find(c => c.id === questId);
                  if (questId === '5') {
                    setShowMiniGame('breathing');
                  } else if (challenge?.category === 'game') {
                    if (questId === '6') setShowMiniGame('memory');
                    if (questId === '7') setShowMiniGame('typeracer');
                    if (questId === '8') setShowMiniGame('trivia');
                  } else {
                    // For non-game challenges, mark as completed
                    handleChallengeComplete(questId);
                  }
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredChallenges.map((challenge, idx) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`
                  glass-strong rounded-2xl p-6 shadow-xl cursor-pointer transition-all
                  ${challenge.status === 'completed' ? 'border-2 border-green-400 bg-green-50/50' : ''}
                  ${challenge.status === 'locked' ? 'opacity-60' : ''}
                `}
                onClick={() => {
                  if (challenge.status === 'available') {
                    if (challenge.id === '5') {
                      setShowMiniGame('breathing');
                    } else if (challenge.category === 'game') {
                      if (challenge.id === '6') setShowMiniGame('memory');
                      if (challenge.id === '7') setShowMiniGame('typeracer');
                      if (challenge.id === '8') setShowMiniGame('trivia');
                    } else {
                      handleChallengeComplete(challenge.id);
                    }
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{challenge.icon}</div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(challenge.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-800">
                      {challenge.xpReward} XP
                    </span>
                    {streak && streak.streakMultiplier > 1 && (
                      <span className="text-xs text-orange-600">
                        +{Math.round(challenge.xpReward * (streak.streakMultiplier - 1))}
                      </span>
                    )}
                  </div>
                  
                  {challenge.duration && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{challenge.duration} min</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Personal Analytics */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass-strong rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
            Your Growth Graph
          </h2>
          
          <div className="h-48 flex items-end justify-between space-x-2">
            {[...Array(7)].map((_, idx) => {
              const dayXP = Math.floor(Math.random() * 200) + 50; // Mock data
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(dayXP / 200) * 100}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-purple-400 to-pink-400 rounded-t"
                    style={{ minHeight: '4px' }}
                  />
                  <span className="text-xs text-gray-600 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Mini-Game Modals */}
      <AnimatePresence>
        {showMiniGame === 'breathing' && (
          <BreathingDragonGame
            onClose={() => setShowMiniGame(null)}
            onComplete={(score) => handleMiniGameComplete('breathing', score)}
          />
        )}
        
        {showMiniGame === 'memory' && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-4xl w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <MemoryMatchGame onComplete={(score) => handleMiniGameComplete('memory', score)} />
              <div className="mt-4 text-center">
                <BloomButton onClick={() => setShowMiniGame(null)}>Close</BloomButton>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showMiniGame === 'typeracer' && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-4xl w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <TypeRacerGame onComplete={(score) => handleMiniGameComplete('typeracer', score)} />
              <div className="mt-4 text-center">
                <BloomButton onClick={() => setShowMiniGame(null)}>Close</BloomButton>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showMiniGame === 'trivia' && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-4xl w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <TriviaGame onComplete={(score) => handleMiniGameComplete('trivia', score)} />
              <div className="mt-4 text-center">
                <BloomButton onClick={() => setShowMiniGame(null)}>Close</BloomButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Store Modal */}
      <AnimatePresence>
        {showRewardStore && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Gift className="w-6 h-6 mr-2 text-pink-500" />
                  Reward Store
                </h2>
                <button
                  onClick={() => setShowRewardStore(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{xp} XP</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      reward.unlocked
                        ? 'bg-green-50 border-green-400'
                        : reward.cost <= xp
                        ? 'bg-white/70 backdrop-blur-sm border-purple-200 hover:border-purple-400 cursor-pointer'
                        : 'bg-gray-50 border-gray-300 opacity-60'
                    }`}
                    whileHover={!reward.unlocked && reward.cost <= xp ? { scale: 1.02 } : {}}
                    onClick={() => !reward.unlocked && reward.cost <= xp && handlePurchaseReward(reward.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-3xl">{reward.icon}</div>
                      {reward.unlocked && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {reward.cost} XP
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        reward.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                        reward.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        reward.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {reward.rarity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                  Weekly Leaderboard
                </h2>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                {leaderboard.map((entry, idx) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl ${
                      entry.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' :
                      entry.rank === 2 ? 'bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-300' :
                      entry.rank === 3 ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300' :
                      'bg-white/70 backdrop-blur-sm border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                          entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                          entry.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
                          'bg-gradient-to-r from-purple-400 to-pink-400'
                        }`}>
                          {entry.rank <= 3 ? (
                            <Trophy className="w-6 h-6" />
                          ) : (
                            entry.rank
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{entry.nickname}</div>
                          <div className="text-xs text-gray-600">Level {entry.avatarLevel} • {entry.streak} day streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{entry.weeklyXP} XP</div>
                        <div className="text-xs text-gray-600">This Week</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-2">Level Up!</h2>
              <p className="text-xl text-white">You reached Level {level}!</p>
              
              {/* Confetti */}
              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const distance = 150;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-300 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: 'easeOut',
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Toast */}
      <XPToast
        xp={xpToast.xp}
        show={xpToast.show}
        onComplete={() => setXpToast({ show: false, xp: 0 })}
        position={{ x: 50, y: 20 }}
      />
    </div>
  );
}

