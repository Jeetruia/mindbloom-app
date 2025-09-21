import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  Star,
  Flame,
  Zap,
  Heart,
  Brain,
  Shield,
  Users,
  Clock,
  Trophy,
  Gem,
  Crown
} from 'lucide-react';

interface MoodEntry {
  id: string;
  date: Date;
  mood: 'sunny' | 'cloudy' | 'stormy' | 'rainy' | 'partly-cloudy';
  note?: string;
  activities: string[];
}

interface Stat {
  name: string;
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProgressPageProps {
  user: any;
  onBack: () => void;
}

const sampleMoodEntries: MoodEntry[] = [
  { id: '1', date: new Date(), mood: 'sunny', note: 'Had a great day!', activities: ['gratitude', 'exercise'] },
  { id: '2', date: new Date(Date.now() - 1000 * 60 * 60 * 24), mood: 'partly-cloudy', note: 'Feeling okay', activities: ['journaling'] },
  { id: '3', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), mood: 'cloudy', note: 'A bit stressed', activities: ['breathing'] },
  { id: '4', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), mood: 'sunny', note: 'Good mood today', activities: ['gratitude', 'meditation'] },
  { id: '5', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), mood: 'rainy', note: 'Tough day', activities: ['self-care'] },
  { id: '6', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), mood: 'partly-cloudy', note: 'Mixed feelings', activities: ['journaling', 'breathing'] },
  { id: '7', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), mood: 'sunny', note: 'Feeling positive', activities: ['gratitude', 'exercise', 'meditation'] }
];

const sampleStats: Stat[] = [
  { name: 'Resilience', value: 75, max: 100, color: 'from-red-500 to-pink-500', icon: <Shield className="w-5 h-5" /> },
  { name: 'Mindfulness', value: 60, max: 100, color: 'from-blue-500 to-indigo-500', icon: <Brain className="w-5 h-5" /> },
  { name: 'Connection', value: 80, max: 100, color: 'from-green-500 to-teal-500', icon: <Users className="w-5 h-5" /> },
  { name: 'Creativity', value: 45, max: 100, color: 'from-purple-500 to-pink-500', icon: <Star className="w-5 h-5" /> }
];

const sampleAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Completed your first wellness challenge',
    icon: '🌟',
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    rarity: 'common'
  },
  {
    id: '2',
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    rarity: 'rare'
  },
  {
    id: '3',
    title: 'Storyteller',
    description: 'Shared 10 stories with the community',
    icon: '📖',
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    rarity: 'epic'
  },
  {
    id: '4',
    title: 'Garden Keeper',
    description: 'Grew 50 plants in your garden',
    icon: '🌱',
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    rarity: 'legendary'
  }
];

const moodIcons = {
  sunny: '☀️',
  cloudy: '☁️',
  stormy: '⛈️',
  rainy: '🌧️',
  'partly-cloudy': '⛅'
};

const moodColors = {
  sunny: 'from-yellow-400 to-orange-500',
  cloudy: 'from-gray-400 to-gray-500',
  stormy: 'from-gray-600 to-gray-700',
  rainy: 'from-blue-400 to-blue-500',
  'partly-cloudy': 'from-blue-300 to-gray-400'
};

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-orange-500'
};

export function ProgressPage({ user, onBack }: ProgressPageProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(sampleMoodEntries);
  const [stats, setStats] = useState<Stat[]>(sampleStats);
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [userLevel, setUserLevel] = useState(5);
  const [userXP, setUserXP] = useState(1250);

  const getMoodTrend = () => {
    const recentMoods = moodEntries.slice(0, 7);
    const moodValues = recentMoods.map(entry => {
      switch (entry.mood) {
        case 'sunny': return 5;
        case 'partly-cloudy': return 4;
        case 'cloudy': return 3;
        case 'rainy': return 2;
        case 'stormy': return 1;
        default: return 3;
      }
    });
    return moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
  };

  const getStreakDays = () => {
    let streak = 0;
    for (let i = 0; i < moodEntries.length; i++) {
      if (moodEntries[i].activities.length > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getTotalXP = () => {
    return moodEntries.reduce((sum, entry) => sum + entry.activities.length * 10, 0);
  };

  const getLevelProgress = () => {
    const currentLevelXP = userLevel * 100;
    const nextLevelXP = (userLevel + 1) * 100;
    const progress = ((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.max(0, Math.min(100, progress));
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
                <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
                The Growth Observatory
              </h1>
              <p className="text-gray-600">Track your wellness journey</p>
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
        {/* Timeframe Selector */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'year', label: 'This Year' }
            ].map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setSelectedTimeframe(timeframe.id as any)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedTimeframe === timeframe.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Level Progress</h2>
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Level {userLevel} → {userLevel + 1}</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getLevelProgress()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {Math.round(getLevelProgress())}%
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{userXP} XP</span>
              <span>{(userLevel + 1) * 100} XP</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Wellness Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                    <span className="font-medium text-gray-800">{stat.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{stat.value}/{stat.max}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Tracker</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{moodIcons[moodEntries[0]?.mood || 'sunny']}</span>
                <span className="text-lg font-medium">Today's Mood</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Average Mood</div>
                <div className="text-lg font-bold text-blue-600">{getMoodTrend().toFixed(1)}/5</div>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {moodEntries.slice(0, 7).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${moodColors[entry.mood]} rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2`}>
                    {moodIcons[entry.mood]}
                  </div>
                  <div className="text-xs text-gray-600">
                    {entry.date.toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${rarityColors[achievement.rarity]} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <div className="text-xs text-gray-500">
                    {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{getStreakDays()}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{getTotalXP()}</div>
                <div className="text-sm text-gray-600">Total XP</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{achievements.length}</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection Log */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            Recent Reflections
          </h3>
          <div className="space-y-3">
            {moodEntries.slice(0, 3).map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-xl">{moodIcons[entry.mood]}</span>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">
                    {entry.date.toLocaleDateString()}
                  </div>
                  {entry.note && (
                    <p className="text-gray-800 text-sm">{entry.note}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.activities.map((activity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
