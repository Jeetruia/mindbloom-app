import React from 'react';
import { motion } from 'framer-motion';
import { PixelAvatar as PixelAvatarType, AvatarAppearance, MoodState } from '../types';

interface PixelAvatarProps {
  avatar: PixelAvatarType;
  size?: 'small' | 'medium' | 'large';
  showMood?: boolean;
  showBadges?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PixelAvatar({ 
  avatar, 
  size = 'medium', 
  showMood = false, 
  showBadges = false,
  isClickable = true,
  onClick,
  className = ''
}: PixelAvatarProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const getMoodColor = (mood: MoodState['current']) => {
    switch (mood) {
      case 'great': return 'bg-gradient-to-br from-yellow-300 to-orange-400';
      case 'good': return 'bg-gradient-to-br from-green-300 to-emerald-400';
      case 'okay': return 'bg-gradient-to-br from-blue-300 to-cyan-400';
      case 'struggling': return 'bg-gradient-to-br from-purple-300 to-pink-400';
      case 'need-support': return 'bg-gradient-to-br from-red-300 to-rose-400';
      default: return 'bg-gradient-to-br from-gray-300 to-slate-400';
    }
  };

  const getExpressionEmoji = (expression: AvatarAppearance['expression']) => {
    switch (expression) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'thoughtful': return '🤔';
      case 'concerned': return '😟';
      case 'supportive': return '🤗';
      default: return '😊';
    }
  };

  const AvatarComponent = () => (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      {/* Avatar Container */}
      <motion.div
        className={`w-full h-full rounded-lg border-2 border-white shadow-lg overflow-hidden ${getMoodColor(avatar.mood.current)}`}
        animate={avatar.isOnline ? {
          scale: [1, 1.02, 1],
          boxShadow: [
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={isClickable ? { scale: 1.05 } : {}}
        onClick={isClickable ? onClick : undefined}
      >
        {/* Pixel Art Avatar */}
        <div className="w-full h-full relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent"></div>
          </div>

          {/* Face */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Skin Tone Background */}
            <div 
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: avatar.appearance.skinTone }}
            >
              {/* Eyes */}
              <div className="flex justify-center space-x-1 pt-2">
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: avatar.appearance.eyeColor }}
                ></div>
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: avatar.appearance.eyeColor }}
                ></div>
              </div>
              
              {/* Expression */}
              <div className="text-center text-xs mt-1">
                {getExpressionEmoji(avatar.appearance.expression)}
              </div>
            </div>
          </div>

          {/* Hair */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-3 rounded-t-full"
            style={{ backgroundColor: avatar.appearance.hairColor }}
          >
            {/* Hair Style Variations */}
            {avatar.appearance.hairStyle === 'curly' && (
              <div className="w-full h-full bg-gradient-to-b from-transparent to-black/20 rounded-t-full"></div>
            )}
            {avatar.appearance.hairStyle === 'straight' && (
              <div className="w-full h-full bg-gradient-to-b from-transparent to-black/10 rounded-t-full"></div>
            )}
          </div>

          {/* Clothing */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-4 rounded-b-lg"
            style={{ backgroundColor: avatar.appearance.clothing }}
          >
            {/* Clothing Pattern */}
            <div className="w-full h-full bg-gradient-to-t from-black/10 to-transparent rounded-b-lg"></div>
          </div>

          {/* Accessories */}
          {avatar.appearance.accessories.map((accessory, index) => (
            <div key={index} className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs">{accessory}</span>
            </div>
          ))}
        </div>

        {/* Online Indicator */}
        {avatar.isOnline && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* Level Badge */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {avatar.level}
        </div>
      </motion.div>

      {/* Mood Indicator */}
      {showMood && (
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-full px-2 py-1 shadow-lg border border-gray-200">
            <span className="text-xs font-medium text-gray-700">
              {avatar.mood.current.replace('-', ' ')}
            </span>
          </div>
        </motion.div>
      )}

      {/* Badges */}
      {showBadges && avatar.badges.length > 0 && (
        <div className="absolute -top-1 -left-1 flex space-x-1">
          {avatar.badges.slice(0, 2).map((badge, index) => (
            <motion.div
              key={badge.id}
              className="w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <span className="text-xs">{badge.icon}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Name */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <span className="text-xs font-medium text-gray-700 bg-white/80 px-2 py-1 rounded-full">
          {avatar.name}
        </span>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
      >
        <AvatarComponent />
      </motion.div>
    );
  }

  return <AvatarComponent />;
}
