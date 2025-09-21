import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Target, 
  Trophy, 
  Globe,
  Zap,
  Bot,
  Heart
} from 'lucide-react';
import { ChatWithMira } from './ChatWithMira';

// Pixel Avatar Component for Community
function PixelAvatar({ 
  name, 
  mood, 
  level, 
  isOnline, 
  onClick 
}: { 
  name: string; 
  mood: string; 
  level: number; 
  isOnline: boolean;
  onClick?: () => void;
}) {
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return 'bg-gradient-to-br from-yellow-300 to-orange-400';
      case 'good': return 'bg-gradient-to-br from-green-300 to-emerald-400';
      case 'okay': return 'bg-gradient-to-br from-blue-300 to-cyan-400';
      case 'struggling': return 'bg-gradient-to-br from-purple-300 to-pink-400';
      case 'need-support': return 'bg-gradient-to-br from-red-300 to-rose-400';
      default: return 'bg-gradient-to-br from-gray-300 to-slate-400';
    }
  };

  return (
    <motion.div
      className={`w-16 h-16 rounded-lg border-2 border-white shadow-lg overflow-hidden ${getMoodColor(mood)} cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">😊</div>
          <div className="text-xs font-bold text-white">L{level}</div>
        </div>
      </div>
      {isOnline && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
      )}
    </motion.div>
  );
}

// Community Space Component
function CommunitySpace({ 
  name, 
  icon, 
  description, 
  occupancy, 
  capacity, 
  color, 
  onClick 
}: {
  name: string;
  icon: React.ReactNode;
  description: string;
  occupancy: number;
  capacity: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${color}`}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-600">{occupancy}/{capacity} online</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}

// Wellness Challenge Component
function WellnessChallenge({ 
  title, 
  description, 
  xpReward, 
  participants, 
  difficulty, 
  onJoin 
}: {
  title: string;
  description: string;
  xpReward: number;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onJoin: () => void;
}) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>+{xpReward} XP</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{participants}</span>
          </div>
        </div>
        
        <button
          onClick={onJoin}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Join
        </button>
      </div>
    </motion.div>
  );
}

// Community Message Component
function CommunityMessage({ 
  content, 
  timestamp, 
  reactions 
}: {
  content: string;
  timestamp: Date;
  reactions: string[];
}) {
  return (
    <motion.div
      className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-gray-800 mb-2">{content}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {timestamp.toLocaleTimeString()}
        </span>
        <div className="flex items-center space-x-2">
          {reactions.map((reaction, index) => (
            <span key={index} className="text-sm">{reaction}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main Community Platform Component
export function CommunityPlatform() {
  const [activeTab, setActiveTab] = useState<'spaces' | 'challenges' | 'chat' | 'mira' | 'achievements'>('spaces');
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [communityMessages] = useState([
    {
      content: "Feeling grateful for this supportive community today! 💝",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      reactions: ['💝', '🌟', '🤗']
    },
    {
      content: "Just completed my first mindfulness challenge - feeling more centered! 🧘",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      reactions: ['🎉', '💪', '✨']
    },
    {
      content: "Thank you to everyone who shared their stories. You're not alone! 🤝",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      reactions: ['🤝', '💙', '🌈']
    }
  ]);

  const spaces = [
    {
      name: 'Mindful Garden',
      icon: '🌱',
      description: 'Peaceful reflection and growth',
      occupancy: 12,
      capacity: 50,
      color: 'bg-green-50 border-green-200 hover:border-green-300'
    },
    {
      name: 'Wisdom Library',
      icon: '📚',
      description: 'Share knowledge and stories',
      occupancy: 8,
      capacity: 30,
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    },
    {
      name: 'Cozy Cafe',
      icon: '☕',
      description: 'Casual conversations and coffee chats',
      occupancy: 15,
      capacity: 40,
      color: 'bg-amber-50 border-amber-200 hover:border-amber-300'
    },
    {
      name: 'Creative Workshop',
      icon: '🎨',
      description: 'Art therapy and skill-building',
      occupancy: 6,
      capacity: 25,
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300'
    },
    {
      name: 'Peaceful Sanctuary',
      icon: '🕊️',
      description: 'Meditation and inner connection',
      occupancy: 4,
      capacity: 20,
      color: 'bg-pink-50 border-pink-200 hover:border-pink-300'
    },
    {
      name: 'Joy Playground',
      icon: '🎪',
      description: 'Celebration and fun activities',
      occupancy: 22,
      capacity: 60,
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
    }
  ];

  const challenges = [
    {
      title: 'Daily Gratitude Practice',
      description: 'Share one thing you\'re grateful for each day',
      xpReward: 25,
      participants: 45,
      difficulty: 'easy' as const
    },
    {
      title: 'Mindful Moments',
      description: 'Practice 5 minutes of mindfulness daily',
      xpReward: 30,
      participants: 32,
      difficulty: 'easy' as const
    },
    {
      title: 'Community Support',
      description: 'Offer support to at least one community member',
      xpReward: 75,
      participants: 18,
      difficulty: 'medium' as const
    },
    {
      title: 'Creative Expression',
      description: 'Share a creative piece (art, writing, music)',
      xpReward: 50,
      participants: 28,
      difficulty: 'medium' as const
    }
  ];

  const onlineAvatars = [
    { name: 'Alex', mood: 'good', level: 5, isOnline: true },
    { name: 'Sam', mood: 'great', level: 3, isOnline: true },
    { name: 'Jordan', mood: 'okay', level: 7, isOnline: true },
    { name: 'Taylor', mood: 'good', level: 4, isOnline: true },
    { name: 'Casey', mood: 'struggling', level: 2, isOnline: true },
    { name: 'Riley', mood: 'good', level: 6, isOnline: true }
  ];

  const handleJoinChallenge = (challengeTitle: string) => {
    // Simulate joining a challenge
    console.log(`Joined challenge: ${challengeTitle}`);
  };

  const handleEnterSpace = (spaceName: string) => {
    setSelectedSpace(spaceName);
    console.log(`Entered space: ${spaceName}`);
  };

  return (
    <div className="h-full bg-gradient-to-br from-sky-50 via-emerald-50 to-purple-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Globe className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">WellnessWorld Community</h1>
        </div>
        <p className="text-gray-600">
          A safe space where mental wellness is celebrated, not hidden. Everyone belongs here.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-emerald-600">1,247</div>
          <div className="text-sm text-gray-600">Community Members</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">89</div>
          <div className="text-sm text-gray-600">Online Now</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">342</div>
          <div className="text-sm text-gray-600">Messages Today</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-pink-600">156</div>
          <div className="text-sm text-gray-600">Support Given</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 border border-gray-200">
        {[
          { id: 'spaces', label: 'Spaces', icon: Globe },
          { id: 'challenges', label: 'Challenges', icon: Target },
          { id: 'chat', label: 'Community Chat', icon: MessageCircle },
          { id: 'mira', label: 'Chat with Mira', icon: Bot },
          { id: 'achievements', label: 'Achievements', icon: Trophy }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'spaces' && (
            <motion.div
              key="spaces"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Community Spaces</h2>
              <div className="grid grid-cols-2 gap-4">
                {spaces.map((space) => (
                  <CommunitySpace
                    key={space.name}
                    {...space}
                    onClick={() => handleEnterSpace(space.name)}
                  />
                ))}
              </div>
              
              {/* Online Avatars */}
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Online Now</h3>
                <div className="flex flex-wrap gap-3">
                  {onlineAvatars.map((avatar) => (
                    <PixelAvatar
                      key={avatar.name}
                      {...avatar}
                      onClick={() => console.log(`Clicked ${avatar.name}`)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Wellness Challenges</h2>
              {challenges.map((challenge) => (
                <WellnessChallenge
                  key={challenge.title}
                  {...challenge}
                  onJoin={() => handleJoinChallenge(challenge.title)}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Community Chat</h2>
              <div className="space-y-3">
                {communityMessages.map((message, index) => (
                  <CommunityMessage
                    key={index}
                    {...message}
                  />
                ))}
              </div>
              
              {/* Message Input */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Share something with the community..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💝 Be kind, supportive, and respectful. This is a safe space for everyone.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'mira' && (
            <motion.div
              key="mira"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <ChatWithMira onBack={() => setActiveTab('spaces')} />
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'First Steps', description: 'Send your first message', icon: '👋', unlocked: true },
                  { title: 'Empathy Champion', description: 'Earn 100 empathy points', icon: '💝', unlocked: false },
                  { title: 'Community Builder', description: 'Help 10 community members', icon: '🤝', unlocked: false },
                  { title: 'Mindfulness Master', description: 'Complete 30 days of mindfulness', icon: '🧘', unlocked: false }
                ].map((achievement) => (
                  <div
                    key={achievement.title}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked 
                        ? 'border-yellow-200 bg-yellow-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Unlocked!
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
