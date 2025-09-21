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
  Award
} from 'lucide-react';

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
  const [stories, setStories] = useState<Story[]>(sampleStories);
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    theme: 'daily-wins' as Story['theme']
  });

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
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Share Story</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
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
    </div>
  );
}
