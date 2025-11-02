import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Users, 
  Target, 
  TrendingUp, 
  Calendar,
  Play,
  CheckCircle,
  Leaf,
  Zap,
  BarChart3,
  Sparkles,
  TrendingDown,
  Activity
} from 'lucide-react';
import { dashboardAnalyticsService, ActivityData } from '../services/dashboardAnalyticsService';
import { googleCloudStorageService } from '../services/googleCloudStorageService';
import { ParticleBackground } from './ui/ParticleBackground';
import { MoodRing } from './ui/MoodRing';
import { StatsWidget } from './ui/StatsWidget';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  user: any;
  onNavigate: (page: 'dashboard' | 'chat' | 'community' | 'circles' | 'challenges' | 'progress' | 'resources' | 'settings') => void;
}

interface WellnessMetrics {
  calmness: number;
  energy: number;
  connection: number;
}

interface MicroTask {
  id: string;
  title: string;
  description: string;
  duration: number;
  xpReward: number;
  type: 'breathing' | 'journaling' | 'mindfulness' | 'gratitude';
}

interface CommunityPulse {
  activeUsers: number;
  gardenGrowth: number;
  storiesShared: number;
  supportTokens: number;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const { mood, intensity } = useTheme();
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetrics>({
    calmness: 0.7,
    energy: 0.6,
    connection: 0.5
  });

  const [todayTask, setTodayTask] = useState<MicroTask | null>(null);
  const [communityPulse, setCommunityPulse] = useState<CommunityPulse>({
    activeUsers: 1247,
    gardenGrowth: 89,
    storiesShared: 23,
    supportTokens: 156
  });

  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [wellnessInsight, setWellnessInsight] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [activities, setActivities] = useState<ActivityData[]>([]);

  useEffect(() => {
    // Load user's wellness metrics and today's task
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    // In a real app, this would fetch from Supabase
    setTodayTask({
      id: '1',
      title: '3-Minute Breathing',
      description: 'A quick breathing exercise to center yourself',
      duration: 3,
      xpReward: 10,
      type: 'breathing'
    });

    // Load and analyze activities with Google Cloud
    await loadAndAnalyzeActivities();
  };

  const loadAndAnalyzeActivities = async () => {
    if (!user) return;

    setIsLoadingInsights(true);
    try {
      // Load recent activities (mock for now, would load from cloud storage)
      const recentActivities: ActivityData[] = [
        {
          id: '1',
          type: 'chat',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          content: 'Had a good conversation with Mira today about stress management',
          emotion: 'calm',
        },
        {
          id: '2',
          type: 'game',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          content: 'Completed breathing dragon game, feeling more relaxed',
          emotion: 'peaceful',
        },
        {
          id: '3',
          type: 'journal',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          content: 'Wrote in gratitude journal, feeling grateful',
          emotion: 'grateful',
        },
      ];

      setActivities(recentActivities);

      // Analyze activities with Google Cloud
      const insight = await dashboardAnalyticsService.analyzeRecentActivities(
        user.id,
        recentActivities
      );
      setWellnessInsight(insight);

      // Calculate wellness metrics
      const metrics = await dashboardAnalyticsService.calculateWellnessMetrics(
        user.id,
        recentActivities
      );
      setWellnessMetrics(metrics);

      // Get personalized recommendation
      const rec = await dashboardAnalyticsService.getPersonalizedRecommendation(
        user.id,
        insight
      );
      setRecommendation(rec);

      // Save to cloud storage
      await dashboardAnalyticsService.saveWellnessData(user.id, metrics, insight);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    if (completedTasks.includes(taskId)) return; // Already completed
    
    setCompletedTasks(prev => [...prev, taskId]);
    
    // Use XP service to add XP
    if (user) {
      const { xpService } = await import('../services/xpService');
      const todayTask = {
        id: '1',
        title: '3-Minute Breathing',
        description: 'A quick breathing exercise to center yourself',
        duration: 3,
        xpReward: 10,
        type: 'breathing' as const
      };
      
      try {
        const result = await xpService.addXP(user.id, user.xp || 0, {
          id: `task-${taskId}-${Date.now()}`,
          type: 'meditation',
          xp: todayTask.xpReward,
          description: `Completed: ${todayTask.title}`,
        });
        
        // Update user in store would be handled by the component that calls this
        console.log('Task completed, XP added:', result);
      } catch (error) {
        console.error('Error adding XP:', error);
      }
    }
  };

  const getWellnessColor = (value: number) => {
    if (value >= 0.8) return 'text-green-500';
    if (value >= 0.6) return 'text-blue-500';
    if (value >= 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getWellnessLabel = (value: number) => {
    if (value >= 0.8) return 'Excellent';
    if (value >= 0.6) return 'Good';
    if (value >= 0.4) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      <ParticleBackground particleCount={30} className="opacity-50" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user.nickname}! 👋
          </h1>
          <p className="text-gray-600">
            Day {user.streak} streak • {user.xp} XP • Level {user.avatarLevel}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wellness Metrics & Today's Task */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wellness Metrics */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Your Wellness Snapshot
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatsWidget
                  icon={Heart}
                  label="Calmness"
                  value={Math.round(wellnessMetrics.calmness * 100)}
                  max={100}
                  color="from-red-400 to-pink-400"
                  unit="%"
                  trend="up"
                  trendValue={5}
                />
                <StatsWidget
                  icon={Zap}
                  label="Energy"
                  value={Math.round(wellnessMetrics.energy * 100)}
                  max={100}
                  color="from-yellow-400 to-orange-400"
                  unit="%"
                  trend="up"
                  trendValue={3}
                />
                <StatsWidget
                  icon={Users}
                  label="Connection"
                  value={Math.round(wellnessMetrics.connection * 100)}
                  max={100}
                  color="from-green-400 to-teal-400"
                  unit="%"
                  trend="neutral"
                />
              </div>
              
              {/* Mood Ring Display */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <MoodRing mood={mood} intensity={intensity} size={150} />
                </motion.div>
              </div>
            </motion.div>

            {/* Today's Micro Task */}
            {todayTask && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-500" />
                  Today's Micro-Task
                </h2>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {todayTask.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {todayTask.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {todayTask.duration} minutes
                        </span>
                        <span className="flex items-center">
                          <Zap className="w-4 h-4 mr-1" />
                          {todayTask.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl">
                      {todayTask.type === 'breathing' && '🫁'}
                      {todayTask.type === 'journaling' && '📝'}
                      {todayTask.type === 'mindfulness' && '🧘'}
                      {todayTask.type === 'gratitude' && '🙏'}
                    </div>
                  </div>
                  
                  {completedTasks.includes(todayTask.id) ? (
                    <div className="flex items-center justify-center py-4 text-green-600">
                      <CheckCircle className="w-6 h-6 mr-2" />
                      <span className="font-medium">Completed! Great job! 🎉</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleTaskComplete(todayTask.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start — {todayTask.duration} minutes</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-500" />
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => onNavigate('chat')}
                  className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-center"
                >
                  <Heart className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Talk to Mira</span>
                </button>
                
                <button
                  onClick={() => onNavigate('resources')}
                  className="p-4 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 text-center"
                >
                  <Brain className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Journal</span>
                </button>
                
                <button
                  onClick={() => onNavigate('circles')}
                  className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-center"
                >
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Join Circle</span>
                </button>
                
                <button
                  onClick={() => onNavigate('resources')}
                  className="p-4 bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 text-center"
                >
                  <Leaf className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Breathe</span>
                </button>
              </div>
            </motion.div>

            {/* Google Cloud Wellness Insights */}
            {wellnessInsight && (
              <motion.div
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  AI Wellness Insights
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Powered by Google Cloud
                  </span>
                </h2>

                {isLoadingInsights ? (
                  <div className="text-center py-4 text-gray-500">
                    Analyzing your wellness patterns...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Sentiment Analysis */}
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Sentiment</span>
                        <span className={`text-sm font-semibold ${
                          wellnessInsight.sentiment.sentiment === 'positive' ? 'text-green-600' :
                          wellnessInsight.sentiment.sentiment === 'negative' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {wellnessInsight.sentiment.sentiment.toUpperCase()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            wellnessInsight.sentiment.score > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{
                            width: `${Math.abs(wellnessInsight.sentiment.score) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Trend */}
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Trend</span>
                        <div className="flex items-center">
                          {wellnessInsight.trend === 'improving' ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm font-semibold text-green-600">Improving</span>
                            </>
                          ) : wellnessInsight.trend === 'declining' ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                              <span className="text-sm font-semibold text-red-600">Declining</span>
                            </>
                          ) : (
                            <>
                              <Activity className="w-4 h-4 text-gray-500 mr-1" />
                              <span className="text-sm font-semibold text-gray-600">Stable</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Emotions */}
                    {wellnessInsight.emotions && wellnessInsight.emotions.length > 0 && (
                      <div className="bg-white rounded-xl p-4">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Detected Emotions</span>
                        <div className="flex flex-wrap gap-2">
                          {wellnessInsight.emotions.slice(0, 3).map((emotion: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                            >
                              {emotion.emotion} ({Math.round(emotion.intensity * 100)}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    {recommendation && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-start">
                          <Brain className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-semibold text-gray-800 block mb-1">
                              Personalized Recommendation
                            </span>
                            <p className="text-sm text-gray-700">{recommendation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column - Community Pulse */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Community Pulse
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Active today</span>
                  </div>
                  <span className="font-bold text-green-600">{communityPulse.activeUsers}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Garden growth</span>
                  </div>
                  <span className="font-bold text-blue-600">+{communityPulse.gardenGrowth}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Stories shared</span>
                  </div>
                  <span className="font-bold text-purple-600">{communityPulse.storiesShared}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700">Support tokens</span>
                  </div>
                  <span className="font-bold text-yellow-600">{communityPulse.supportTokens}</span>
                </div>
              </div>
            </motion.div>

            {/* Progress Summary */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Your Progress
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Current Streak</span>
                    <span>{user.streak} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min((user.streak / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>XP to Next Level</span>
                    <span>{user.xp} / {user.avatarLevel * 100}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${(user.xp / (user.avatarLevel * 100)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
