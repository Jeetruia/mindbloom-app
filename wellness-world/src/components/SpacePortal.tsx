import React from 'react';
import { motion } from 'framer-motion';
import { CommunitySpace } from '../types';

interface SpacePortalProps {
  space: CommunitySpace;
  isActive: boolean;
  isHovered: boolean;
  isCurrentSpace: boolean;
  onClick: () => void;
}

export function SpacePortal({ 
  space, 
  isActive, 
  isHovered, 
  isCurrentSpace, 
  onClick 
}: SpacePortalProps) {
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

  const getSpaceGlow = (type: CommunitySpace['type']) => {
    switch (type) {
      case 'garden': return 'shadow-green-500/50';
      case 'library': return 'shadow-blue-500/50';
      case 'cafe': return 'shadow-amber-500/50';
      case 'workshop': return 'shadow-purple-500/50';
      case 'sanctuary': return 'shadow-pink-500/50';
      case 'playground': return 'shadow-yellow-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Portal Ring */}
      <motion.div
        className={`w-20 h-20 rounded-full border-4 border-white shadow-lg ${getSpaceGlow(space.type)}`}
        animate={isActive ? {
          rotate: 360,
          scale: [1, 1.1, 1],
        } : {
          rotate: 0,
          scale: 1,
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity }
        }}
      >
        {/* Portal Background */}
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${getSpaceColor(space.type)} flex items-center justify-center`}>
          {/* Portal Content */}
          <motion.div
            className="text-2xl"
            animate={isActive ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {getSpaceIcon(space.type)}
          </motion.div>
        </div>

        {/* Portal Effects */}
        {isActive && (
          <>
            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/50"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.8, 0.4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
            
            {/* Second Ripple */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/30"
              animate={{
                scale: [1, 1.8, 2.5],
                opacity: [0.6, 0.2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5
              }}
            />
          </>
        )}

        {/* Occupancy Indicator */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">
            {space.currentOccupancy}
          </span>
        </div>

        {/* Current Space Indicator */}
        {isCurrentSpace && (
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            You're here
          </motion.div>
        )}
      </motion.div>

      {/* Space Name */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
        <span className="text-sm font-medium text-gray-700 bg-white/80 px-2 py-1 rounded-full">
          {space.name}
        </span>
      </div>

      {/* Hover Glow */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}
