import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Target, 
  Trophy, 
  Globe,
  Zap,
  Bot,
  Heart, 
  Share2, 
  Star, 
  Filter,
  Plus,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Mic,
  MicOff,
  Brain,
  Search,
  Coins,
  Crown,
  Gift,
  Network
} from 'lucide-react';
import { ChatWithMira } from './ChatWithMira';
import { vertexAIService } from '../services/vertexAIService';
import { hybridSTTService } from '../services/googleCloudSpeechService';
import { useStore } from '../hooks/useStore';

// Story Interface
interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  theme: 'daily-wins' | 'struggles' | 'hope' | 'lessons-learned';
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  isAnonymous: boolean;
  isSpotlight: boolean;
  xpEarned: number;
}

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

// Story Card Component
function StoryCard({ 
  story, 
  onLike, 
  onShare 
}: { 
  story: Story; 
  onLike: (id: string) => void;
  onShare: (id: string) => void;
}) {
  const themes = [
    { id: 'daily-wins', icon: '🌟', color: 'from-yellow-500 to-orange-500' },
    { id: 'struggles', icon: '💪', color: 'from-red-500 to-pink-500' },
    { id: 'hope', icon: '🌈', color: 'from-green-500 to-teal-500' },
    { id: 'lessons-learned', icon: '🎓', color: 'from-purple-500 to-indigo-500' }
  ];

  const getThemeIcon = (theme: string) => {
    const themeObj = themes.find(t => t.id === theme);
    return themeObj?.icon || '📚';
  };

  const getThemeColor = (theme: string) => {
    const themeObj = themes.find(t => t.id === theme);
    return themeObj?.color || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-r ${getThemeColor(story.theme)} rounded-full flex items-center justify-center text-white font-bold`}>
            {getThemeIcon(story.theme)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{story.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>by {story.author}</span>
              <Clock className="w-4 h-4" />
              <span>{story.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        {story.isSpotlight && (
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium">Spotlight</span>
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{story.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(story.id)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
              story.isLiked 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${story.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{story.likes}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Comment</span>
          </button>
          
          <button 
            onClick={() => onShare(story.id)}
            className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span>+{story.xpEarned} XP</span>
        </div>
      </div>
    </motion.div>
  );
}

// Sample Data
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'Today I asked for help',
    content: 'I\'ve always been the "strong one" in my family, but today I finally told my roommate I was struggling with anxiety. She didn\'t judge me - she just listened and offered to help. Sometimes the bravest thing we can do is be vulnerable.',
    author: 'Anonymous Student',
    theme: 'daily-wins',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    likes: 24,
    isLiked: false,
    isAnonymous: true,
    isSpotlight: true,
    xpEarned: 15
  },
  {
    id: '2',
    title: 'The power of small steps',
    content: 'I\'ve been feeling overwhelmed with finals, but instead of trying to study for 8 hours straight, I started with just 25 minutes. I used the pomodoro technique and actually got more done than usual. Small steps really do add up.',
    author: 'Night Owl',
    theme: 'lessons-learned',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    likes: 18,
    isLiked: true,
    isAnonymous: true,
    isSpotlight: false,
    xpEarned: 12
  },
  {
    id: '3',
    title: 'Finding hope in dark times',
    content: 'Last month I felt like giving up on everything. But I started writing down one good thing each day, even if it was just "the sun was shining." Slowly, I began to notice more positive things. Hope isn\'t about being happy all the time - it\'s about believing things can get better.',
    author: 'Hope Seeker',
    theme: 'hope',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 31,
    isLiked: false,
    isAnonymous: true,
    isSpotlight: false,
    xpEarned: 20
  },
  {
    id: '4',
    title: 'Struggling with perfectionism',
    content: 'I used to think I had to be perfect at everything. Today I turned in a paper that wasn\'t perfect, and you know what? The world didn\'t end. My professor actually said it was good. I\'m learning that "good enough" is often better than perfect.',
    author: 'Recovering Perfectionist',
    theme: 'struggles',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    likes: 22,
    isLiked: false,
    isAnonymous: true,
    isSpotlight: false,
    xpEarned: 18
  }
];

const storyThemes = [
  { id: 'all', label: 'All Stories', icon: '📚', color: 'from-blue-500 to-purple-500' },
  { id: 'daily-wins', label: 'Daily Wins', icon: '🌟', color: 'from-yellow-500 to-orange-500' },
  { id: 'struggles', label: 'Struggles', icon: '💪', color: 'from-red-500 to-pink-500' },
  { id: 'hope', label: 'Hope', icon: '🌈', color: 'from-green-500 to-teal-500' },
  { id: 'lessons-learned', label: 'Lessons Learned', icon: '🎓', color: 'from-purple-500 to-indigo-500' }
];

// Main Community & Stories Component
export function CommunityStories({ user }: { user: any }) {
  const { setUser } = useStore();
  const [activeTab, setActiveTab] = useState<'spaces' | 'challenges' | 'chat' | 'stories' | 'mira' | 'achievements'>('stories');
  const [stories, setStories] = useState<Story[]>(sampleStories);
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    theme: 'daily-wins' as Story['theme']
  });
  
  // AI Features
  const [dailyPrompt, setDailyPrompt] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSearchQuery, setVoiceSearchQuery] = useState<string | null>(null);
  const [mindTokens, setMindTokens] = useState(150);
  const [reputation, setReputation] = useState({
    level: 1,
    title: 'Newcomer',
    tokens: 150,
    rank: 'Bronze'
  });

  const communityMessages = [
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
  ];

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

  const filteredStories = selectedTheme === 'all' 
    ? stories 
    : stories.filter(story => story.theme === selectedTheme);

  const spotlightStory = stories.find(story => story.isSpotlight);

  const handleLike = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            isLiked: !story.isLiked, 
            likes: story.isLiked ? story.likes - 1 : story.likes + 1 
          }
        : story
    ));
  };

  const handleShare = (storyId: string) => {
    console.log(`Sharing story: ${storyId}`);
  };

  const handleShareStory = () => {
    if (newStory.title.trim() && newStory.content.trim()) {
      const story: Story = {
        id: Date.now().toString(),
        title: newStory.title.trim(),
        content: newStory.content.trim(),
        author: user?.nickname || 'Anonymous',
        theme: newStory.theme,
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        isAnonymous: true,
        isSpotlight: false,
        xpEarned: 10
      };
      
      setStories(prev => [story, ...prev]);
      setNewStory({ title: '', content: '', theme: 'daily-wins' });
      setShowShareModal(false);
    }
  };

  const handleJoinChallenge = (challengeTitle: string) => {
    console.log(`Joined challenge: ${challengeTitle}`);
  };

  const handleEnterSpace = (spaceName: string) => {
    console.log(`Entered space: ${spaceName}`);
  };

  // Load AI features
  useEffect(() => {
    if (user) {
      loadDailyPrompt();
    }
  }, [user]);

  const loadDailyPrompt = async () => {
    try {
      const prompt = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{
          text: `Generate a daily reflection prompt for a mental wellness community. It should be warm, thoughtful, and encourage meaningful sharing (1 sentence). Make it personal and engaging.`
        }]
      }]);
      setDailyPrompt(prompt);
    } catch (error) {
      console.error('Error loading daily prompt:', error);
      setDailyPrompt("What's one thing that brought you peace or joy today?");
    }
  };

  const handleVoiceSearch = async () => {
    setIsRecording(true);
    try {
      const transcript = await hybridSTTService.startListening();
      setVoiceSearchQuery(transcript);
      
      // Find related community threads based on voice query
      // This would search through stories/messages for related content
      console.log('Voice search:', transcript);
    } catch (error) {
      console.error('Error with voice search:', error);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-sky-50 via-emerald-50 to-purple-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Globe className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">Community & Stories</h1>
        </div>
        <p className="text-gray-600">
          Connect with others and share your journey in a safe, supportive space.
        </p>
      </div>

      {/* AI Daily Prompt */}
      {dailyPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border-2 border-indigo-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
              Today's Reflection Prompt
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                AI Generated
              </span>
            </h3>
            <button
              onClick={loadDailyPrompt}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              New Prompt
            </button>
          </div>
          <p className="text-gray-700 text-lg italic">"{dailyPrompt}"</p>
        </motion.div>
      )}

      {/* Gamified Reputation System */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-4 border-2 border-yellow-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{mindTokens}</div>
                <div className="text-xs text-gray-600">Mind Tokens</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm font-semibold text-gray-800">{reputation.title}</div>
                <div className="text-xs text-gray-600">Level {reputation.level} • {reputation.rank}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleVoiceSearch}
              disabled={isRecording}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                isRecording
                  ? 'bg-red-100 text-red-600 animate-pulse'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
              title="Voice Search Community"
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Voice Search Results */}
      {voiceSearchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-xl shadow-lg p-4 border-2 border-blue-200"
        >
          <div className="flex items-center mb-3">
            <Brain className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="font-semibold text-gray-800">Voice Search Results</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">You searched: "{voiceSearchQuery}"</p>
          <div className="text-sm text-gray-500">
            Finding related community threads...
          </div>
        </motion.div>
      )}

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
          <div className="text-2xl font-bold text-purple-600">{stories.length}</div>
          <div className="text-sm text-gray-600">Stories Shared</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-pink-600">{stories.reduce((sum, story) => sum + story.likes, 0)}</div>
          <div className="text-sm text-gray-600">Hearts Given</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 border border-gray-200 overflow-x-auto">
        {[
          { id: 'stories', label: 'Stories', icon: BookOpen },
          { id: 'spaces', label: 'Spaces', icon: Globe },
          { id: 'challenges', label: 'Challenges', icon: Target },
          { id: 'chat', label: 'Community Chat', icon: MessageCircle },
          { id: 'mira', label: 'Chat with Mira', icon: Bot },
          { id: 'achievements', label: 'Achievements', icon: Trophy }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors whitespace-nowrap ${
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
          {activeTab === 'stories' && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Share Story Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Share Story</span>
                </button>
              </div>

              {/* Daily Spotlight */}
              {spotlightStory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Star className="w-6 h-6" />
                      <h2 className="text-xl font-bold">Daily Spotlight</h2>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{spotlightStory.title}</h3>
                    <p className="text-white/90 mb-4">{spotlightStory.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">by {spotlightStory.author}</span>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span>{spotlightStory.likes}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Award className="w-4 h-4" />
                        <span>+{spotlightStory.xpEarned} XP</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Theme Filters */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {storyThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedTheme === theme.id
                          ? `bg-gradient-to-r ${theme.color} text-white shadow-lg`
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className="mr-2">{theme.icon}</span>
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stories Feed */}
              <div className="space-y-6">
                {filteredStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onLike={handleLike}
                    onShare={handleShare}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'spaces' && (
            <motion.div
              key="spaces"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Community Spaces</h2>
                <button
                  onClick={handleVoiceSearch}
                  disabled={isRecording}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    isRecording
                      ? 'bg-red-100 text-red-600'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                  title="Voice Search Spaces"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span className="text-xs">Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span className="text-xs">Voice Search</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Mind Map Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-4 border-2 border-purple-200"
              >
                <div className="flex items-center mb-3">
                  <Network className="w-5 h-5 text-purple-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">Community Activity Map</h3>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Interactive
                  </span>
                </div>
                <div className="relative h-48 bg-white rounded-lg overflow-hidden">
                  {/* Simplified mind map visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {spaces.slice(0, 6).map((space, idx) => {
                        const angle = (idx * 60) * (Math.PI / 180);
                        const radius = 80;
                        const x = Math.cos(angle) * radius + 50;
                        const y = Math.sin(angle) * radius + 50;
                        return (
                          <motion.div
                            key={space.name}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="absolute"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl shadow-lg cursor-pointer"
                            >
                              {space.icon}
                            </motion.div>
                            <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-700">
                              {space.name}
                            </div>
                          </motion.div>
                        );
                      })}
                      {/* Center node */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl shadow-xl"
                        >
                          🌸
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

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
                  <button
                    onClick={handleVoiceSearch}
                    disabled={isRecording}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording
                        ? 'bg-red-100 text-red-600 animate-pulse'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                    title="Voice Input"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
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
              <ChatWithMira onBack={() => setActiveTab('stories')} />
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

      {/* Share Story Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Story</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Title
                  </label>
                  <input
                    type="text"
                    value={newStory.title}
                    onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your story a title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={newStory.theme}
                    onChange={(e) => setNewStory(prev => ({ ...prev, theme: e.target.value as Story['theme'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily-wins">Daily Wins</option>
                    <option value="struggles">Struggles</option>
                    <option value="hope">Hope</option>
                    <option value="lessons-learned">Lessons Learned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Story
                  </label>
                  <textarea
                    value={newStory.content}
                    onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience, lesson, or moment of growth..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={6}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Story Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Focus on positive actions, lessons, or moments of growth</li>
                    <li>• Keep it personal and authentic</li>
                    <li>• Avoid clinical or medical language</li>
                    <li>• Your story will be shared anonymously by default</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareStory}
                  disabled={!newStory.title.trim() || !newStory.content.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Share Story
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


