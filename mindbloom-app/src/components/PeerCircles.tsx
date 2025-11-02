import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Shield, 
  Clock,
  ArrowLeft,
  Send,
  ThumbsUp,
  Flag,
  CheckCircle,
  Lock,
  Mic,
  MicOff,
  TrendingUp,
  Activity,
  Brain,
  Sparkles,
  Award,
  Zap
} from 'lucide-react';
import { circleService, CirclePost as ServiceCirclePost } from '../services/circleService';
import { hybridSTTService } from '../services/googleCloudSpeechService';
import { useStore } from '../hooks/useStore';
import { xpService } from '../services/xpService';
import { ParticleBackground } from './ui/ParticleBackground';
import { ConfettiBurst } from './ui/ConfettiBurst';
import { SparkleEffect } from './ui/SparkleEffect';

interface PeerCirclesProps {
  user: any;
  onBack: () => void;
}

interface Circle {
  id: string;
  name: string;
  description: string;
  theme: string;
  maxCapacity: number;
  currentMembers: number;
  rules: string[];
  lastActivity: string;
  isJoined: boolean;
}

interface CirclePost {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  isAnonymous: boolean;
  sentiment?: {
    score: number;
    magnitude: number;
  };
  emotion?: {
    type: string;
    intensity: number;
  };
}

const sampleCircles: Circle[] = [
  {
    id: '1',
    name: 'Exam Support',
    description: 'A safe space for students dealing with exam stress',
    theme: 'academic',
    maxCapacity: 30,
    currentMembers: 24,
    rules: ['No diagnosing', 'Listen and hold space', 'Use Get Help flow for crisis'],
    lastActivity: '2 hours ago',
    isJoined: false
  },
  {
    id: '2',
    name: 'First-gen Students',
    description: 'Support for first-generation college students',
    theme: 'academic',
    maxCapacity: 25,
    currentMembers: 18,
    rules: ['No diagnosing', 'Listen and hold space', 'Use Get Help flow for crisis'],
    lastActivity: '1 hour ago',
    isJoined: true
  },
  {
    id: '3',
    name: 'Night Owls',
    description: 'For those who struggle with sleep and late-night thoughts',
    theme: 'wellness',
    maxCapacity: 20,
    currentMembers: 15,
    rules: ['No diagnosing', 'Listen and hold space', 'Use Get Help flow for crisis'],
    lastActivity: '30 minutes ago',
    isJoined: false
  },
  {
    id: '4',
    name: 'Parents of Teens',
    description: 'Support for parents navigating teen mental health',
    theme: 'family',
    maxCapacity: 15,
    currentMembers: 12,
    rules: ['No diagnosing', 'Listen and hold space', 'Use Get Help flow for crisis'],
    lastActivity: '4 hours ago',
    isJoined: false
  }
];

const samplePosts: CirclePost[] = [
  {
    id: '1',
    content: 'Feeling overwhelmed with finals coming up. Anyone else struggling with time management?',
    author: 'Anonymous Student',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    likes: 8,
    isLiked: false,
    isAnonymous: true
  },
  {
    id: '2',
    content: 'Just wanted to say you\'re not alone in this. We\'ve got this together! 💪',
    author: 'Anonymous Supporter',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    likes: 12,
    isLiked: true,
    isAnonymous: true
  },
  {
    id: '3',
    content: 'Has anyone tried the pomodoro technique? It really helped me focus better.',
    author: 'Anonymous Helper',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    likes: 5,
    isLiked: false,
    isAnonymous: true
  }
];

export function PeerCircles({ user, onBack }: PeerCirclesProps) {
  const { setUser } = useStore();
  const [circles, setCircles] = useState<Circle[]>(sampleCircles);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [posts, setPosts] = useState<CirclePost[]>(samplePosts);
  const [newPost, setNewPost] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRules, setShowRules] = useState(false);
  
  // AI Features
  const [circleMood, setCircleMood] = useState<any>(null);
  const [circleSummary, setCircleSummary] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceCheckIn, setVoiceCheckIn] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [animatedAvatars, setAnimatedAvatars] = useState<Map<string, string>>(new Map());

  const handleJoinCircle = (circleId: string) => {
    setCircles(prev => prev.map(circle => 
      circle.id === circleId 
        ? { ...circle, isJoined: true, currentMembers: circle.currentMembers + 1 }
        : circle
    ));
  };

  const handleLeaveCircle = (circleId: string) => {
    setCircles(prev => prev.map(circle => 
      circle.id === circleId 
        ? { ...circle, isJoined: false, currentMembers: circle.currentMembers - 1 }
        : circle
    ));
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  // Analyze posts when circle is selected or posts change
  useEffect(() => {
    if (selectedCircle && posts.length > 0) {
      analyzeCircleData();
    }
  }, [selectedCircle, posts]);

  const analyzeCircleData = async () => {
    if (!selectedCircle) return;
    
    setIsAnalyzing(true);
    try {
      // Analyze circle mood
      const mood = await circleService.analyzeCircleMood(selectedCircle.id, posts);
      setCircleMood(mood);

      // Get AI summary
      const summary = await circleService.summarizeCircleDiscussion(selectedCircle.id, posts);
      setCircleSummary(summary);

      // Update avatar colors based on emotions
      const avatarMap = new Map<string, string>();
      posts.forEach(post => {
        if (post.emotion) {
          const color = getEmotionColor(post.emotion.type);
          avatarMap.set(post.id, color);
        }
      });
      setAnimatedAvatars(avatarMap);
    } catch (error) {
      console.error('Error analyzing circle data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionColor = (emotion: string): string => {
    switch (emotion.toLowerCase()) {
      case 'joy': return 'from-yellow-400 to-orange-400';
      case 'happiness': return 'from-green-400 to-emerald-400';
      case 'calm': return 'from-blue-400 to-indigo-400';
      case 'sadness': return 'from-blue-300 to-blue-400';
      case 'anxiety': return 'from-purple-300 to-pink-300';
      case 'anger': return 'from-red-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const handleVoiceCheckIn = async () => {
    if (!selectedCircle || !user) return;

    setIsRecording(true);
    try {
      const result = await circleService.processVoiceCheckIn(selectedCircle.id, user.id);
      setVoiceCheckIn(result);

      // Create a post from voice check-in
      const post: ServiceCirclePost = {
        id: Date.now().toString(),
        content: result.summary,
        author: 'You (Voice)',
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        isAnonymous: true,
        sentiment: { score: result.sentiment, magnitude: 0.7 },
        emotion: { type: result.emotion, intensity: 0.7 },
      };
      
      setPosts(prev => [post, ...prev]);

      // Award XP
      const xpResult = await xpService.addXP(user.id, user.xp || 0, {
        id: `voice-checkin-${Date.now()}`,
        type: 'chat',
        xp: 15,
        description: 'Voice check-in in circle',
      });

      if (setUser) {
        setUser({
          ...user,
          xp: xpResult.newXP,
          avatarLevel: xpResult.newLevel,
        });
      }
    } catch (error) {
      console.error('Error with voice check-in:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const handleSendPost = async () => {
    if (newPost.trim() && selectedCircle && user) {
      // Analyze post sentiment and emotion
      const analysis = await circleService.analyzePost(newPost.trim());
      
      const post: ServiceCirclePost = {
        id: Date.now().toString(),
        content: newPost.trim(),
        author: 'You',
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        isAnonymous: true,
        sentiment: analysis.sentiment,
        emotion: analysis.emotion,
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost('');

      // Award XP
      const xpResult = await xpService.addXP(user.id, user.xp || 0, {
        id: `circle-post-${Date.now()}`,
        type: 'chat',
        xp: 10,
        description: 'Posted in circle',
      });

      if (setUser) {
        setUser({
          ...user,
          xp: xpResult.newXP,
          avatarLevel: xpResult.newLevel,
        });
      }
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'academic': return '🎓';
      case 'wellness': return '🌙';
      case 'family': return '👨‍👩‍👧‍👦';
      default: return '💬';
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'academic': return 'from-blue-500 to-indigo-500';
      case 'wellness': return 'from-purple-500 to-pink-500';
      case 'family': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (selectedCircle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedCircle(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {selectedCircle.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedCircle.currentMembers} members • {selectedCircle.lastActivity}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRules(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Circle Rules"
              >
                <Shield className="w-5 h-5" />
              </button>
              {selectedCircle.isJoined ? (
                <button
                  onClick={() => handleLeaveCircle(selectedCircle.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={() => handleJoinCircle(selectedCircle.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI-Powered Features Header */}
        {selectedCircle.isJoined && (
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* Mood Pulse Meter */}
            {circleMood && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-4 border-2 border-purple-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-purple-500" />
                    Circle Mood Pulse
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      AI Powered
                    </span>
                  </h3>
                  {isAnalyzing && (
                    <div className="flex items-center text-sm text-gray-600">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mr-2"
                      />
                      Analyzing...
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {/* Sentiment Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">Overall Sentiment</span>
                      <span className={`text-sm font-semibold ${
                        circleMood.averageSentiment > 0.3 ? 'text-green-600' :
                        circleMood.averageSentiment < -0.3 ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {circleMood.averageSentiment > 0.3 ? 'Positive' :
                         circleMood.averageSentiment < -0.3 ? 'Needs Support' :
                         'Neutral'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(circleMood.averageSentiment + 1) * 50}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-3 rounded-full ${
                          circleMood.averageSentiment > 0.3 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                          circleMood.averageSentiment < -0.3 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                          'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Emotions */}
                  {circleMood.emotions && circleMood.emotions.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-700 mb-2 block">Detected Emotions</span>
                      <div className="flex flex-wrap gap-2">
                        {circleMood.emotions.slice(0, 5).map((emotion: any, idx: number) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                          >
                            {emotion.emotion} ({emotion.count})
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* AI Summary */}
            {circleSummary && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-4 border-2 border-blue-200"
              >
                <div className="flex items-start mb-3">
                  <Brain className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      AI-Moderated Summary
                      <Sparkles className="w-4 h-4 ml-2 text-blue-500" />
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">{circleSummary.summary}</p>
                    {circleSummary.keyThemes && circleSummary.keyThemes.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-600 mb-1 block">Key Themes:</span>
                        <div className="flex flex-wrap gap-2">
                          {circleSummary.keyThemes.map((theme: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Posts */}
        <div className="max-w-4xl mx-auto p-4">
          <div className="space-y-4">
            {/* New Post Input */}
            {selectedCircle.isJoined && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share something supportive with the community..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Lock className="w-4 h-4" />
                          <span>Posting anonymously</span>
                        </div>
                        {/* Voice Check-in Button */}
                        <button
                          onClick={handleVoiceCheckIn}
                          disabled={isRecording}
                          className={`p-2 rounded-lg transition-colors ${
                            isRecording
                              ? 'bg-red-100 text-red-600 animate-pulse'
                              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          }`}
                          title="Voice Check-in"
                        >
                          {isRecording ? (
                            <MicOff className="w-4 h-4" />
                          ) : (
                            <Mic className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={handleSendPost}
                        disabled={!newPost.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-4"
                >
                  <div className="flex items-start space-x-3">
                    <motion.div
                      animate={{
                        scale: animatedAvatars.has(post.id) ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br ${
                        animatedAvatars.get(post.id) || 'from-gray-400 to-gray-500'
                      }`}
                    >
                      {post.author.charAt(0).toUpperCase()}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-800">{post.author}</span>
                        <span className="text-sm text-gray-500">
                          {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {post.isAnonymous && (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      
                      {/* Emotion Tag */}
                      {post.emotion && (
                        <div className="mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                            getEmotionColor(post.emotion.type)
                          } text-white`}>
                            {post.emotion.type}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                            post.isLiked 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Reply</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                          <Flag className="w-4 h-4" />
                          <span className="text-sm">Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Rules Modal */}
        <AnimatePresence>
          {showRules && (
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-500" />
                  Circle Rules
                </h3>
                <ul className="space-y-3 mb-6">
                  {selectedCircle.rules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowRules(false)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Got it
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <ParticleBackground particleCount={20} className="opacity-40" />
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Peer Circles</h1>
              <p className="text-gray-600">Small safe groups for support and connection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Circles Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circle) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedCircle(circle)}
            >
              <div className={`h-2 bg-gradient-to-r ${getThemeColor(circle.theme)}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getThemeIcon(circle.theme)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{circle.name}</h3>
                      <p className="text-sm text-gray-600">{circle.theme}</p>
                    </div>
                  </div>
                  {circle.isJoined && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Joined</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{circle.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{circle.currentMembers}/{circle.maxCapacity} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{circle.lastActivity}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Supportive community</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      circle.isJoined 
                        ? handleLeaveCircle(circle.id)
                        : handleJoinCircle(circle.id);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      circle.isJoined
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {circle.isJoined ? 'Leave' : 'Join'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
      
      {/* Confetti for circle achievements */}
      <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Sparkle effect on posts */}
      <SparkleEffect count={5} size={3} duration={3} />
    </div>
  );
}
