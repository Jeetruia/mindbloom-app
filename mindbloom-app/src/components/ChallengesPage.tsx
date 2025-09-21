import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Clock, 
  Star, 
  Zap, 
  CheckCircle,
  Play,
  Trophy,
  Flame,
  Brain,
  Heart,
  Shield,
  Sword,
  Gem,
  Leaf
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'mini-game';
  category: 'mindfulness' | 'gratitude' | 'breathing' | 'kindness' | 'reflection';
  duration: number; // in minutes
  xpReward: number;
  isCompleted: boolean;
  isActive: boolean;
  streak: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  color: string;
}

interface ChallengesPageProps {
  user: any;
  onBack: () => void;
}

const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Thought Reframing Quest',
    description: 'Challenge one negative thought today by writing it down and reframing it in a more balanced way.',
    type: 'daily',
    category: 'mindfulness',
    duration: 5,
    xpReward: 15,
    isCompleted: false,
    isActive: true,
    streak: 3,
    difficulty: 'easy',
    icon: '🧠',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: '2',
    title: 'Gratitude Hunt',
    description: 'Find and write down 3 things you\'re grateful for today, no matter how small.',
    type: 'daily',
    category: 'gratitude',
    duration: 3,
    xpReward: 10,
    isCompleted: true,
    isActive: true,
    streak: 7,
    difficulty: 'easy',
    icon: '🌟',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '3',
    title: 'Breathing Dragon',
    description: 'Complete a 5-minute breathing exercise to calm your mind and body.',
    type: 'mini-game',
    category: 'breathing',
    duration: 5,
    xpReward: 20,
    isCompleted: false,
    isActive: true,
    streak: 0,
    difficulty: 'easy',
    icon: '🐉',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: '4',
    title: 'Kindness Mission',
    description: 'Do one kind thing for yourself or someone else today.',
    type: 'daily',
    category: 'kindness',
    duration: 10,
    xpReward: 25,
    isCompleted: false,
    isActive: true,
    streak: 2,
    difficulty: 'medium',
    icon: '💝',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '5',
    title: 'Journaling Journey',
    description: 'Write in your journal for 7 days straight about your thoughts and feelings.',
    type: 'weekly',
    category: 'reflection',
    duration: 15,
    xpReward: 100,
    isCompleted: false,
    isActive: true,
    streak: 4,
    difficulty: 'hard',
    icon: '📝',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: '6',
    title: 'Defeat Negative Thoughts',
    description: 'RPG-style mini-game where you battle negative thoughts with positive affirmations.',
    type: 'mini-game',
    category: 'mindfulness',
    duration: 8,
    xpReward: 30,
    isCompleted: false,
    isActive: true,
    streak: 0,
    difficulty: 'medium',
    icon: '⚔️',
    color: 'from-red-500 to-pink-500'
  }
];

const categories = [
  { id: 'all', label: 'All Challenges', icon: '🎯', color: 'from-gray-500 to-gray-600' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧠', color: 'from-blue-500 to-indigo-500' },
  { id: 'gratitude', label: 'Gratitude', icon: '🌟', color: 'from-yellow-500 to-orange-500' },
  { id: 'breathing', label: 'Breathing', icon: '🐉', color: 'from-green-500 to-teal-500' },
  { id: 'kindness', label: 'Kindness', icon: '💝', color: 'from-pink-500 to-rose-500' },
  { id: 'reflection', label: 'Reflection', icon: '📝', color: 'from-purple-500 to-indigo-500' }
];

export function ChallengesPage({ user, onBack }: ChallengesPageProps) {
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMiniGame, setShowMiniGame] = useState<string | null>(null);
  const [userXP, setUserXP] = useState(150);
  const [userLevel, setUserLevel] = useState(3);

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.category === selectedCategory);

  const dailyChallenges = challenges.filter(c => c.type === 'daily' && c.isActive);
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly' && c.isActive);
  const miniGames = challenges.filter(c => c.type === 'mini-game' && c.isActive);

  const handleCompleteChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { 
            ...challenge, 
            isCompleted: true,
            streak: challenge.streak + 1
          }
        : challenge
    ));
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setUserXP(prev => prev + challenge.xpReward);
      // Check for level up
      if (userXP + challenge.xpReward >= userLevel * 100) {
        setUserLevel(prev => prev + 1);
      }
    }
  };

  const handleStartMiniGame = (challengeId: string) => {
    setShowMiniGame(challengeId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '🎯';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-500" />
                The Quest Board
              </h1>
              <p className="text-gray-600">Turn self-care into an adventure</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Level {userLevel}</div>
              <div className="text-lg font-bold text-blue-600">{userXP} XP</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userLevel}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Challenges */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Daily Quests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${
                  challenge.isCompleted ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${challenge.color} rounded-full flex items-center justify-center text-white text-xl`}>
                      {challenge.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">{challenge.duration} min</span>
                      </div>
                    </div>
                  </div>
                  {challenge.isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <p className="text-gray-600 mb-4 text-sm">{challenge.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">+{challenge.xpReward} XP</span>
                    </div>
                    {challenge.streak > 0 && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{challenge.streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>

                {!challenge.isCompleted && (
                  <button
                    onClick={() => handleCompleteChallenge(challenge.id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Quest</span>
                  </button>
                )}

                {challenge.isCompleted && (
                  <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center font-medium">
                    Completed! +{challenge.xpReward} XP
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Challenges */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-purple-500" />
            Weekly Adventures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${
                  challenge.isCompleted ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${challenge.color} rounded-full flex items-center justify-center text-white text-xl`}>
                      {challenge.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">{challenge.duration} min</span>
                      </div>
                    </div>
                  </div>
                  {challenge.isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <p className="text-gray-600 mb-4 text-sm">{challenge.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">+{challenge.xpReward} XP</span>
                    </div>
                    {challenge.streak > 0 && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{challenge.streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>

                {!challenge.isCompleted && (
                  <button
                    onClick={() => handleCompleteChallenge(challenge.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Adventure</span>
                  </button>
                )}

                {challenge.isCompleted && (
                  <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center font-medium">
                    Completed! +{challenge.xpReward} XP
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mini-Games */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Sword className="w-5 h-5 mr-2 text-red-500" />
            Mini-Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {miniGames.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${challenge.color} rounded-full flex items-center justify-center text-white text-xl`}>
                      {challenge.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">{challenge.duration} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{challenge.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">+{challenge.xpReward} XP</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartMiniGame(challenge.id)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Play Game</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Your Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{challenges.filter(c => c.isCompleted).length}</div>
              <div className="text-sm text-gray-600">Quests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{challenges.reduce((sum, c) => sum + c.streak, 0)}</div>
              <div className="text-sm text-gray-600">Total Streak Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userXP}</div>
              <div className="text-sm text-gray-600">Total XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">Level {userLevel}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mini-Game Modal */}
      <AnimatePresence>
        {showMiniGame && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Mini-Game</h3>
              <p className="text-gray-600 mb-6">
                This mini-game will help you practice the challenge in a fun, interactive way!
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowMiniGame(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowMiniGame(null);
                    handleCompleteChallenge(showMiniGame);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Complete Challenge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
