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
  Crown,
  Mic,
  MicOff,
  Sparkles,
  FileText,
  Gift,
  LineChart
} from 'lucide-react';
import { progressService, WellnessInsight, EmotionData, Milestone } from '../services/progressService';
import { useStore } from '../hooks/useStore';
import { xpService } from '../services/xpService';
import { ProgressRadial } from './ui/ProgressRadial';
import { MoodMeter } from './ui/MoodMeter';
import { ParticleBackground } from './ui/ParticleBackground';
import { ConfettiBurst } from './ui/ConfettiBurst';
import { useTheme } from '../contexts/ThemeContext';

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
  const { setUser } = useStore();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(sampleMoodEntries);
  const [stats, setStats] = useState<Stat[]>(sampleStats);
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [userLevel, setUserLevel] = useState(user?.avatarLevel || 5);
  const [userXP, setUserXP] = useState(user?.xp || 1250);
  
  // AI Features
  const [wellnessInsight, setWellnessInsight] = useState<WellnessInsight | null>(null);
  const [emotionTrends, setEmotionTrends] = useState<EmotionData[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [voiceJournal, setVoiceJournal] = useState<any>(null);

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

  // Load AI insights
  useEffect(() => {
    if (user) {
      loadWellnessInsights();
      loadEmotionTrends();
      checkMilestones();
    }
  }, [user, moodEntries]);

  const loadWellnessInsights = async () => {
    if (!user) return;
    
    setIsLoadingInsights(true);
    try {
      const activities = moodEntries.map(entry => ({
        content: entry.activities.join(' '),
        timestamp: entry.date,
      }));
      
      const insight = await progressService.generateWellnessInsights(user.id, activities);
      setWellnessInsight(insight);
    } catch (error) {
      console.error('Error loading wellness insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const loadEmotionTrends = async () => {
    if (!user) return;
    
    try {
      const activities = moodEntries.map(entry => ({
        text: entry.activities.join(' '),
        timestamp: entry.date,
      }));
      
      const trends = await progressService.calculateEmotionTrends(user.id, activities);
      setEmotionTrends(trends);
    } catch (error) {
      console.error('Error loading emotion trends:', error);
    }
  };

  const checkMilestones = () => {
    if (!user) return;
    
    const activities = moodEntries.map(entry => entry.activities).flat();
    const streak = getStreakDays();
    const level = user.avatarLevel || userLevel;
    
    const newMilestones = progressService.checkMilestones(activities, level, streak);
    setMilestones(newMilestones);
  };

  const handleVoiceJournal = async () => {
    if (!user) return;

    setIsRecording(true);
    try {
      const result = await progressService.processVoiceJournal(user.id);
      setVoiceJournal(result);

      // Award XP
      const xpResult = await xpService.addXP(user.id, user.xp || 0, {
        id: `voice-journal-${Date.now()}`,
        type: 'journal',
        xp: 15,
        description: 'Voice journal entry',
      });

      if (setUser) {
        setUser({
          ...user,
          xp: xpResult.newXP,
          avatarLevel: xpResult.newLevel,
        });
      }

      // Reload insights
      await loadWellnessInsights();
    } catch (error) {
      console.error('Error with voice journal:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const { mood, intensity } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <ParticleBackground particleCount={25} className="opacity-40" />
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
        {/* AI Wellness Insights */}
        {wellnessInsight && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-blue-500" />
                AI Wellness Insights
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Powered by Google Cloud AI
                </span>
              </h2>
              {isLoadingInsights && (
                <div className="flex items-center text-sm text-gray-600">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
                  />
                  Analyzing...
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                  Summary
                </h3>
                <p className="text-sm text-gray-700">{wellnessInsight.summary}</p>
              </div>

              {/* Trends */}
              {wellnessInsight.trends && wellnessInsight.trends.length > 0 && (
                <div className="bg-white rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    Key Trends
                  </h3>
                  <ul className="space-y-1">
                    {wellnessInsight.trends.map((trend, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {wellnessInsight.recommendations && wellnessInsight.recommendations.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-pink-500" />
                    Personalized Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {wellnessInsight.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-pink-500 mr-2">✨</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sentiment & Emotions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <h3 className="text-xs font-medium text-gray-600 mb-2">Overall Sentiment</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(wellnessInsight.sentiment + 1) * 50}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-2 rounded-full ${
                          wellnessInsight.sentiment > 0.3 ? 'bg-green-500' :
                          wellnessInsight.sentiment < -0.3 ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      wellnessInsight.sentiment > 0.3 ? 'text-green-600' :
                      wellnessInsight.sentiment < -0.3 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {wellnessInsight.sentiment > 0.3 ? 'Positive' :
                       wellnessInsight.sentiment < -0.3 ? 'Negative' :
                       'Neutral'}
                    </span>
                  </div>
                </div>
                
                {wellnessInsight.emotions && wellnessInsight.emotions.length > 0 && (
                  <div className="bg-white rounded-xl p-4">
                    <h3 className="text-xs font-medium text-gray-600 mb-2">Top Emotions</h3>
                    <div className="flex flex-wrap gap-1">
                      {wellnessInsight.emotions.slice(0, 3).map((emotion, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {emotion.emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Voice Journal Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleVoiceJournal}
            disabled={isRecording}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isRecording
                ? 'bg-red-100 text-red-600 animate-pulse'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Recording...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Voice Journal Entry</span>
              </>
            )}
          </button>
        </div>

        {/* Voice Journal Result */}
        {voiceJournal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white rounded-xl shadow-lg p-4 border-2 border-purple-200"
          >
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Latest Voice Journal</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">{voiceJournal.summary}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <span>Sentiment: {voiceJournal.sentiment > 0 ? 'Positive' : 'Neutral'}</span>
              <span>Emotion: {voiceJournal.emotion}</span>
            </div>
          </motion.div>
        )}

        {/* Recent Milestones */}
        {milestones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Gift className="w-6 h-6 mr-2 text-yellow-500" />
              Recent Milestones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-4 border-2 border-yellow-200"
                >
                  <div className="text-3xl mb-2">{milestone.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Emotion Trends Graph */}
        {emotionTrends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <LineChart className="w-6 h-6 mr-2 text-blue-500" />
              Emotion Trends Over Time
            </h2>
            <div className="h-64 flex items-end justify-between space-x-2">
              {emotionTrends.slice(-14).map((entry, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.sentiment + 1) * 50}%` }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    className={`w-full rounded-t ${
                      entry.sentiment > 0.3 ? 'bg-green-400' :
                      entry.sentiment < -0.3 ? 'bg-red-400' :
                      'bg-gray-400'
                    }`}
                    style={{ minHeight: '4px' }}
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    {entry.date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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

        {/* Stats Overview - Enhanced with ProgressRadial */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Wellness Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-strong rounded-xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow"
              >
                <ProgressRadial
                  progress={(stat.value / stat.max) * 100}
                  size={100}
                  color={stat.color.includes('red') ? '#EF4444' : stat.color.includes('blue') ? '#3B82F6' : stat.color.includes('green') ? '#10B981' : '#8B5CF6'}
                  icon={stat.icon}
                  label={stat.name}
                  showPercentage={true}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Mood Meter */}
        <div className="mb-8 flex justify-center">
          <div className="glass-strong rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Current Mood Intensity</h3>
            <MoodMeter mood="positive" intensity={intensity} size={250} />
          </div>
        </div>

        {/* Mood Tracker - Enhanced */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Tracker</h2>
          <div className="glass-strong rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-3xl">{moodIcons[moodEntries[0]?.mood || 'sunny']}</span>
                </motion.div>
                <span className="text-lg font-medium">Today's Mood</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Average Mood</div>
                <motion.div
                  className="text-lg font-bold text-blue-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  {getMoodTrend().toFixed(1)}/5
                </motion.div>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {moodEntries.slice(0, 7).map((entry, index) => (
                <motion.button
                  key={entry.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${moodColors[entry.mood]} rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    {moodIcons[entry.mood]}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {entry.date.toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                </motion.button>
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
      
      {/* Confetti Burst for Achievements */}
      <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}

