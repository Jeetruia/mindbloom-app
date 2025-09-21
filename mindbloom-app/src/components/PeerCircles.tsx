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
  Lock
} from 'lucide-react';

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
  const [circles, setCircles] = useState<Circle[]>(sampleCircles);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [posts, setPosts] = useState<CirclePost[]>(samplePosts);
  const [newPost, setNewPost] = useState('');
  const [showRules, setShowRules] = useState(false);

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

  const handleSendPost = () => {
    if (newPost.trim() && selectedCircle) {
      const post: CirclePost = {
        id: Date.now().toString(),
        content: newPost.trim(),
        author: 'You',
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        isAnonymous: true
      };
      setPosts(prev => [post, ...prev]);
      setNewPost('');
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
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span>Posting anonymously</span>
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
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
  );
}
