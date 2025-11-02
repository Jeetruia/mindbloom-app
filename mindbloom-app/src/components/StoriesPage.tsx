import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Star, 
  Filter,
  Plus,
  BookOpen,
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  Award,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Brain,
  Activity,
  Flower2,
  Zap
} from 'lucide-react';
import { storyService, BloomMeter } from '../services/storyService';
import { useStore } from '../hooks/useStore';
import { xpService } from '../services/xpService';

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

interface StoriesPageProps {
  user: any;
  onBack: () => void;
}

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

const themes = [
  { id: 'all', label: 'All Stories', icon: '📚', color: 'from-blue-500 to-purple-500' },
  { id: 'daily-wins', label: 'Daily Wins', icon: '🌟', color: 'from-yellow-500 to-orange-500' },
  { id: 'struggles', label: 'Struggles', icon: '💪', color: 'from-red-500 to-pink-500' },
  { id: 'hope', label: 'Hope', icon: '🌈', color: 'from-green-500 to-teal-500' },
  { id: 'lessons-learned', label: 'Lessons Learned', icon: '🎓', color: 'from-purple-500 to-indigo-500' }
];

export function StoriesPage({ user, onBack }: StoriesPageProps) {
  const { setUser } = useStore();
  const [stories, setStories] = useState<Story[]>(sampleStories);
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    theme: 'daily-wins' as Story['theme']
  });
  
  // AI Features
  const [isRecording, setIsRecording] = useState(false);
  const [isNarrating, setIsNarrating] = useState<string | null>(null);
  const [bloomMeter, setBloomMeter] = useState<BloomMeter | null>(null);
  const [emotionTags, setEmotionTags] = useState<Map<string, string[]>>(new Map());
  const [showAIStoryModal, setShowAIStoryModal] = useState(false);

  const filteredStories = selectedTheme === 'all' 
    ? stories 
    : stories.filter(story => story.theme === selectedTheme);

  const spotlightStory = stories.find(story => story.isSpotlight);

  // Load bloom meter and emotion tags
  useEffect(() => {
    if (user && stories.length > 0) {
      loadBloomMeter();
      loadEmotionTags();
    }
  }, [user, stories]);

  const loadBloomMeter = async () => {
    if (!user) return;
    try {
      const bloomStories = stories.map(s => ({
        id: s.id,
        title: s.title,
        content: s.content,
        author: s.author,
        timestamp: s.timestamp,
      }));
      const meter = await storyService.calculateBloomMeter(user.id, bloomStories);
      setBloomMeter(meter);
    } catch (error) {
      console.error('Error loading bloom meter:', error);
    }
  };

  const loadEmotionTags = async () => {
    try {
      const tagsMap = new Map<string, string[]>();
      for (const story of stories) {
        const tags = await storyService.generateEmotionTags(story.content);
        tagsMap.set(story.id, tags);
      }
      setEmotionTags(tagsMap);
    } catch (error) {
      console.error('Error loading emotion tags:', error);
    }
  };

  const handleVoiceStory = async () => {
    if (!user) return;
    
    setIsRecording(true);
    try {
      const result = await storyService.recordVoiceStory(user.id);
      
      // Create story from voice
      const story: Story = {
        id: Date.now().toString(),
        title: result.title,
        content: result.story,
        author: user.nickname || 'Anonymous',
        theme: 'daily-wins',
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        isAnonymous: true,
        isSpotlight: false,
        xpEarned: 25,
      };
      
      setStories(prev => [story, ...prev]);
      setShowAIStoryModal(false);
      
      // Award XP
      const xpResult = await xpService.addXP(user.id, user.xp || 0, {
        id: `voice-story-${Date.now()}`,
        type: 'journal',
        xp: 25,
        description: 'AI narrative story',
      });

      if (setUser) {
        setUser({
          ...user,
          xp: xpResult.newXP,
          avatarLevel: xpResult.newLevel,
        });
      }

      // Reload bloom meter and tags
      await loadBloomMeter();
      await loadEmotionTags();
    } catch (error) {
      console.error('Error with voice story:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const handleNarrateStory = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    if (isNarrating === storyId) {
      // Stop narration
      setIsNarrating(null);
      return;
    }

    setIsNarrating(storyId);
    try {
      await storyService.narrateStory({
        id: story.id,
        title: story.title,
        content: story.content,
        author: story.author,
        timestamp: story.timestamp,
      });
    } catch (error) {
      console.error('Error narrating story:', error);
    } finally {
      setIsNarrating(null);
    }
  };

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

  const handleShareStory = async () => {
    if (newStory.title.trim() && newStory.content.trim() && user) {
      // Generate emotion tags
      const tags = await storyService.generateEmotionTags(newStory.content);
      setEmotionTags(prev => {
        const newMap = new Map(prev);
        newMap.set(Date.now().toString(), tags);
        return newMap;
      });

      const story: Story = {
        id: Date.now().toString(),
        title: newStory.title.trim(),
        content: newStory.content.trim(),
        author: user.nickname || 'Anonymous',
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

      // Award XP
      const xpResult = await xpService.addXP(user.id, user.xp || 0, {
        id: `story-${Date.now()}`,
        type: 'journal',
        xp: 10,
        description: 'Shared story',
      });

      if (setUser) {
        setUser({
          ...user,
          xp: xpResult.newXP,
          avatarLevel: xpResult.newLevel,
        });
      }

      // Reload bloom meter
      await loadBloomMeter();
    }
  };

  const getThemeIcon = (theme: string) => {
    const themeObj = themes.find(t => t.id === theme);
    return themeObj?.icon || '📚';
  };

  const getThemeColor = (theme: string) => {
    const themeObj = themes.find(t => t.id === theme);
    return themeObj?.color || 'from-gray-500 to-gray-600';
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
                <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
                The Story Grove
              </h1>
              <p className="text-gray-600">Share your journey, inspire others</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAIStoryModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
            >
              {isRecording ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 bg-red-500 rounded-full"
                  />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>AI Narrative Mode</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Share Story</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Bloom Meter */}
        {bloomMeter && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Flower2 className="w-6 h-6 mr-2 text-purple-500" />
                Bloom Meter
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  AI Powered
                </span>
              </h2>
              <div className="flex items-center space-x-2">
                {bloomMeter.emotionalTrend === 'growing' && (
                  <>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">Growing</span>
                  </>
                )}
                {bloomMeter.emotionalTrend === 'declining' && (
                  <>
                    <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />
                    <span className="text-sm font-semibold text-red-600">Declining</span>
                  </>
                )}
                {bloomMeter.emotionalTrend === 'stable' && (
                  <>
                    <Activity className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-600">Stable</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Overall Bloom Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Overall Bloom</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {Math.round(bloomMeter.overallBloom)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bloomMeter.overallBloom}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full"
                  />
                </div>
              </div>

              {/* Evolution Timeline */}
              {bloomMeter.evolution && bloomMeter.evolution.length > 0 && (
                <div>
                  <span className="text-sm text-gray-700 mb-2 block">Emotional Evolution</span>
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    {bloomMeter.evolution.slice(-7).map((entry, idx) => (
                      <div key={idx} className="flex flex-col items-center min-w-[60px]">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold mb-1">
                          {Math.round(entry.bloomScore)}
                        </div>
                        <span className="text-xs text-gray-600">
                          {entry.date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Daily Spotlight */}
        {spotlightStory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
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
            {themes.map((theme) => (
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
          <AnimatePresence>
            {filteredStories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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

                {/* Emotion Tags */}
                {emotionTags.has(story.id) && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {emotionTags.get(story.id)?.map((tag, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(story.id)}
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
                    
                    <button className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                    
                    {/* Listen Mode */}
                    <button
                      onClick={() => handleNarrateStory(story.id)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
                        isNarrating === story.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Listen to story"
                    >
                      {isNarrating === story.id ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span className="text-sm">Pause</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span className="text-sm">Listen</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{story.xpEarned} XP</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Community Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stories.length}</div>
              <div className="text-sm text-gray-600">Stories Shared</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stories.reduce((sum, story) => sum + story.likes, 0)}</div>
              <div className="text-sm text-gray-600">Hearts Given</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stories.filter(s => s.isSpotlight).length}</div>
              <div className="text-sm text-gray-600">Spotlight Stories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stories.reduce((sum, story) => sum + story.xpEarned, 0)}</div>
              <div className="text-sm text-gray-600">XP Earned</div>
            </div>
          </div>
        </motion.div>
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

      {/* AI Narrative Mode Modal */}
      <AnimatePresence>
        {showAIStoryModal && (
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                  AI Narrative Mode
                </h3>
                <button
                  onClick={() => setShowAIStoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Speak your story, and AI will transform it into a beautiful, reflective narrative.
              </p>

              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  {isRecording ? (
                    <div className="space-y-3">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center"
                      >
                        <MicOff className="w-8 h-8 text-white" />
                      </motion.div>
                      <p className="text-sm font-medium text-gray-700">Recording your story...</p>
                      <p className="text-xs text-gray-500">Click to stop</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Mic className="w-12 h-12 text-purple-500 mx-auto" />
                      <p className="text-sm font-medium text-gray-700">Ready to record</p>
                      <p className="text-xs text-gray-500">Click the button below to start</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleVoiceStory}
                  disabled={isRecording}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {isRecording ? (
                    <span className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-3 h-3 bg-white rounded-full"
                      />
                      <span>Stop Recording</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Mic className="w-4 h-4" />
                      <span>Start Recording</span>
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
