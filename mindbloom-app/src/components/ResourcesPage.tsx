import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Heart,
  Phone,
  MessageCircle,
  Download,
  Star,
  Clock,
  Brain,
  Shield,
  Users,
  Zap,
  Info,
  ExternalLink,
  Save,
  Share2
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'audio' | 'tool' | 'emergency' | 'education';
  duration?: number; // in minutes
  category: 'mindfulness' | 'breathing' | 'crisis' | 'education' | 'tools';
  icon: string;
  color: string;
  isBookmarked: boolean;
  isPlaying?: boolean;
}

interface ResourcesPageProps {
  user: any;
  onBack: () => void;
}

const sampleResources: Resource[] = [
  {
    id: '1',
    title: '5-Minute Breathing Exercise',
    description: 'A quick guided breathing exercise to help you feel calm and centered.',
    type: 'audio',
    duration: 5,
    category: 'breathing',
    icon: '🫁',
    color: 'from-blue-500 to-indigo-500',
    isBookmarked: false,
    isPlaying: false
  },
  {
    id: '2',
    title: 'How to Challenge Anxious Thoughts',
    description: 'Learn CBT techniques to reframe negative thinking patterns.',
    type: 'guide',
    duration: 3,
    category: 'mindfulness',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500',
    isBookmarked: true,
    isPlaying: false
  },
  {
    id: '3',
    title: 'Crisis Support Hotline',
    description: '24/7 crisis support and suicide prevention hotline.',
    type: 'emergency',
    category: 'crisis',
    icon: '🆘',
    color: 'from-red-500 to-pink-500',
    isBookmarked: false,
    isPlaying: false
  },
  {
    id: '4',
    title: 'Mood Tracker Tool',
    description: 'Interactive tool to track your daily mood and identify patterns.',
    type: 'tool',
    category: 'tools',
    icon: '📊',
    color: 'from-green-500 to-teal-500',
    isBookmarked: true,
    isPlaying: false
  },
  {
    id: '5',
    title: 'Grounding Techniques',
    description: 'Simple techniques to help you stay present during overwhelming moments.',
    type: 'guide',
    duration: 2,
    category: 'mindfulness',
    icon: '🌱',
    color: 'from-yellow-500 to-orange-500',
    isBookmarked: false,
    isPlaying: false
  },
  {
    id: '6',
    title: 'Sleep Meditation',
    description: 'Guided meditation to help you fall asleep peacefully.',
    type: 'audio',
    duration: 15,
    category: 'mindfulness',
    icon: '🌙',
    color: 'from-indigo-500 to-purple-500',
    isBookmarked: false,
    isPlaying: false
  },
  {
    id: '7',
    title: 'Why Breathing Works',
    description: 'Science-backed explanation of how breathing affects your nervous system.',
    type: 'education',
    duration: 2,
    category: 'education',
    icon: '🔬',
    color: 'from-cyan-500 to-blue-500',
    isBookmarked: false,
    isPlaying: false
  },
  {
    id: '8',
    title: 'Gratitude Journal Prompts',
    description: 'Daily prompts to help you practice gratitude and positive thinking.',
    type: 'tool',
    category: 'tools',
    icon: '📝',
    color: 'from-pink-500 to-rose-500',
    isBookmarked: true,
    isPlaying: false
  }
];

const categories = [
  { id: 'all', label: 'All Resources', icon: '📚', color: 'from-gray-500 to-gray-600' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧠', color: 'from-purple-500 to-pink-500' },
  { id: 'breathing', label: 'Breathing', icon: '🫁', color: 'from-blue-500 to-indigo-500' },
  { id: 'crisis', label: 'Crisis Support', icon: '🆘', color: 'from-red-500 to-pink-500' },
  { id: 'education', label: 'Education', icon: '🔬', color: 'from-cyan-500 to-blue-500' },
  { id: 'tools', label: 'Tools', icon: '🛠️', color: 'from-green-500 to-teal-500' }
];

const emergencyContacts = [
  { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
  { name: 'National Alliance on Mental Illness', number: '1-800-950-NAMI', available: 'Mon-Fri 10am-6pm' },
  { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' }
];

export function ResourcesPage({ user, onBack }: ResourcesPageProps) {
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookmark = (resourceId: string) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, isBookmarked: !resource.isBookmarked }
        : resource
    ));
  };

  const handlePlay = (resourceId: string) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, isPlaying: !resource.isPlaying }
        : resource
    ));
  };

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Play className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'tool': return <Zap className="w-4 h-4" />;
      case 'emergency': return <Phone className="w-4 h-4" />;
      case 'education': return <Info className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '📚';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'from-gray-500 to-gray-600';
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
                The Wisdom Library
              </h1>
              <p className="text-gray-600">Tools and resources for your wellness journey</p>
            </div>
          </div>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>Emergency</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Help Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Quick Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.slice(0, 2).map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.available}</p>
                  </div>
                  <button
                    onClick={() => handleEmergencyCall(contact.number)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                </div>
                <div className="mt-2 text-lg font-mono text-gray-800">{contact.number}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-full flex items-center justify-center text-white text-xl`}>
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(resource.type)}
                      <span className="text-sm text-gray-500 capitalize">{resource.type}</span>
                      {resource.duration && (
                        <>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-500">{resource.duration} min</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleBookmark(resource.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    resource.isBookmarked 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={resource.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  <Star className={`w-4 h-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{getCategoryIcon(resource.category)}</span>
                  <span className="text-xs text-gray-500 capitalize">{resource.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {resource.type === 'audio' && (
                    <button
                      onClick={() => handlePlay(resource.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        resource.isPlaying 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {resource.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  )}
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Educational Content */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            Did You Know?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Breathing & Stress</h3>
                  <p className="text-sm text-gray-600">
                    Deep breathing can reduce cortisol levels by up to 50% within just 60 seconds of practice.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Gratitude Practice</h3>
                  <p className="text-sm text-gray-600">
                    Writing down 3 things you're grateful for each day can increase happiness by 25% over 6 months.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Crisis Support Resources
              </h3>
              
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.available}</p>
                        <p className="text-lg font-mono text-gray-800 mt-1">{contact.number}</p>
                      </div>
                      <button
                        onClick={() => handleEmergencyCall(contact.number)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Remember:</h4>
                <p className="text-sm text-blue-700">
                  You are not alone. These resources are available 24/7 and are completely confidential. 
                  Reaching out for help is a sign of strength, not weakness.
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
