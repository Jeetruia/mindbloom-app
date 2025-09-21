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
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onNavigate: (page: 'dashboard' | 'chat' | 'community' | 'circles' | 'stories' | 'challenges' | 'garden' | 'progress' | 'resources' | 'settings') => void;
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
  };

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => [...prev, taskId]);
    // In a real app, this would update the database
    console.log('Task completed:', taskId);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(wellnessMetrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 relative">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={getWellnessColor(value)}
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${value * 100}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{Math.round(value * 100)}%</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 capitalize">{key}</h3>
                    <p className={`text-sm ${getWellnessColor(value)}`}>
                      {getWellnessLabel(value)}
                    </p>
                  </div>
                ))}
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
