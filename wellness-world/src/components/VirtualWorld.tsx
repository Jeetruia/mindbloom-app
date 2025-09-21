import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { CommunitySpace } from '../types';
import { PixelAvatar } from './PixelAvatar';
import { SpacePortal } from './SpacePortal';
import { FloatingPrompt } from './FloatingPrompt';

export function VirtualWorld() {
  const { 
    avatar, 
    communitySpaces, 
    onlineAvatars,
    enterSpace,
    currentSpace 
  } = useStore();

  const [hoveredSpace, setHoveredSpace] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(true);

  const spacePositions = {
    'garden': { x: 20, y: 30 },
    'library': { x: 70, y: 20 },
    'cafe': { x: 50, y: 60 },
    'workshop': { x: 80, y: 70 },
    'sanctuary': { x: 30, y: 80 },
    'playground': { x: 60, y: 40 }
  };

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
      case 'garden': return 'from-green-400 to-emerald-500';
      case 'library': return 'from-blue-400 to-indigo-500';
      case 'cafe': return 'from-amber-400 to-orange-500';
      case 'workshop': return 'from-purple-400 to-violet-500';
      case 'sanctuary': return 'from-pink-400 to-rose-500';
      case 'playground': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-slate-500';
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-sky-100 via-emerald-100 to-purple-100">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Community Spaces */}
      {communitySpaces.map((space) => {
        const position = spacePositions[space.type];
        const isHovered = hoveredSpace === space.id;
        const isCurrentSpace = currentSpace?.id === space.id;

        return (
          <motion.div
            key={space.id}
            className="absolute"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setHoveredSpace(space.id)}
            onHoverEnd={() => setHoveredSpace(null)}
          >
            {/* Space Portal */}
            <SpacePortal
              space={space}
              isActive={space.isActive}
              isHovered={isHovered}
              isCurrentSpace={isCurrentSpace}
              onClick={() => enterSpace(space.id)}
            />

            {/* Space Info */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 min-w-48"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getSpaceIcon(space.type)}</span>
                    <h3 className="font-semibold text-gray-800">{space.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{space.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{space.currentOccupancy}/{space.capacity} avatars</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                      {space.isActive ? 'Active' : 'Quiet'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Online Avatars */}
      {onlineAvatars.map((onlineAvatar) => (
        <motion.div
          key={onlineAvatar.id}
          className="absolute"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <PixelAvatar
            avatar={onlineAvatar}
            size="small"
            showMood={true}
            isClickable={true}
            onClick={() => {
              // Show avatar profile or start conversation
              console.log('Clicked avatar:', onlineAvatar.name);
            }}
          />
        </motion.div>
      ))}

      {/* Current User Avatar */}
      {avatar && (
        <motion.div
          className="absolute bottom-8 right-8"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <PixelAvatar
            avatar={avatar}
            size="large"
            showMood={true}
            showBadges={true}
            isClickable={false}
          />
        </motion.div>
      )}

      {/* Floating Wellness Prompts */}
      {showPrompts && (
        <FloatingPrompt
          onClose={() => setShowPrompts(false)}
        />
      )}

      {/* Community Health Indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Community Health: Excellent</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {onlineAvatars.length} avatars online, spreading empathy
        </p>
      </div>

      {/* Welcome Message */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to WellnessWorld! 🌟
          </h2>
          <p className="text-gray-600 mb-4">
            A safe space where mental wellness is celebrated, not hidden. 
            Click on any space to explore and connect with others.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="text-center">
              <div className="text-lg">💬</div>
              <div className="text-gray-600">Connect</div>
            </div>
            <div className="text-center">
              <div className="text-lg">🤝</div>
              <div className="text-gray-600">Support</div>
            </div>
            <div className="text-center">
              <div className="text-lg">🌱</div>
              <div className="text-gray-600">Grow</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
