import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { CommunitySpace } from '../types';
import { Users, MessageCircle, Activity, Heart } from 'lucide-react';

export function CommunitySpaces() {
  const { communitySpaces, enterSpace, currentSpace } = useStore();
  const [expandedSpace, setExpandedSpace] = useState<string | null>(null);

  const getSpaceIcon = (type: CommunitySpace['type']) => {
    switch (type) {
      case 'garden': return '🌱';
      case 'library': return '📚';
      case 'cafe': return '☕';
      case 'workshop': return '🛠️';
      case 'sanctuary': return '🕊️';
      case 'playground': return '🎪';
      default: return '🏠';
    }
  };

  const getSpaceColor = (type: CommunitySpace['type']) => {
    switch (type) {
      case 'garden': return 'bg-green-100 border-green-200 text-green-800';
      case 'library': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'cafe': return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'workshop': return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'sanctuary': return 'bg-pink-100 border-pink-200 text-pink-800';
      case 'playground': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getSpaceDescription = (type: CommunitySpace['type']) => {
    switch (type) {
      case 'garden': return 'Grow together through mindful conversations and nature-inspired activities';
      case 'library': return 'Share knowledge, stories, and wisdom in a quiet, reflective space';
      case 'cafe': return 'Casual conversations and coffee chats in a warm, welcoming atmosphere';
      case 'workshop': return 'Learn new skills, create art, and explore creative wellness practices';
      case 'sanctuary': return 'Find peace, practice meditation, and connect with your inner self';
      case 'playground': return 'Have fun, play games, and celebrate joy with the community';
      default: return 'A welcoming space for connection and support';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-gray-800">Community Spaces</h2>
      </div>

      <div className="space-y-3">
        {communitySpaces.map((space) => {
          const isExpanded = expandedSpace === space.id;
          const isCurrentSpace = currentSpace?.id === space.id;
          const isActive = space.isActive;

          return (
            <motion.div
              key={space.id}
              className={`rounded-lg border-2 transition-all duration-200 ${
                isCurrentSpace 
                  ? 'border-emerald-400 bg-emerald-50' 
                  : isActive 
                    ? 'border-gray-200 bg-white hover:border-gray-300' 
                    : 'border-gray-100 bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {/* Space Header */}
              <div
                className="p-3 cursor-pointer"
                onClick={() => setExpandedSpace(isExpanded ? null : space.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getSpaceIcon(space.type)}</div>
                    <div>
                      <h3 className="font-medium text-gray-800">{space.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{space.currentOccupancy}/{space.capacity}</span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <span>{isActive ? 'Active' : 'Quiet'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isCurrentSpace && (
                      <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                        Here
                      </span>
                    )}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="border-t border-gray-200 p-3"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-gray-600 mb-3">
                      {getSpaceDescription(space.type)}
                    </p>

                    {/* Activities */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Activities:</h4>
                      <div className="space-y-1">
                        {space.activities.slice(0, 3).map((activity) => (
                          <div key={activity.id} className="flex items-center space-x-2 text-sm text-gray-600">
                            <Activity className="w-3 h-3" />
                            <span>{activity.name}</span>
                            <span className="text-xs text-gray-400">({activity.duration}min)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => enterSpace(space.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isCurrentSpace
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {isCurrentSpace ? 'You\'re Here' : 'Enter Space'}
                      </button>
                      
                      <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Community Health */}
      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
        <div className="flex items-center space-x-2 mb-2">
          <Heart className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">Community Health</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Today's empathy points:</span>
          <span className="font-semibold text-emerald-600">1,247</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-gradient-to-r from-emerald-400 to-blue-400 h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>
      </div>
    </div>
  );
}
