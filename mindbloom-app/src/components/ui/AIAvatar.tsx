/**
 * AIAvatar - Mira's expressive avatar with dynamic states
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Heart } from 'lucide-react';

interface AIAvatarProps {
  mood?: 'calm' | 'happy' | 'thoughtful' | 'supportive' | 'energetic' | 'reflective' | 'peaceful' | 'creative';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  className?: string;
}

const moodColors: { [key: string]: string } = {
  calm: 'from-sky-400 to-blue-500',
  happy: 'from-peach-400 to-pink-400',
  thoughtful: 'from-lavender-400 to-purple-500',
  supportive: 'from-mint-400 to-green-400',
  energetic: 'from-pink-400 to-orange-400',
  reflective: 'from-lavender-400 to-purple-500',
  peaceful: 'from-mint-400 to-green-400',
  creative: 'from-purple-400 to-pink-400',
};

const sizes = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export function AIAvatar({
  mood = 'calm',
  size = 'md',
  isSpeaking = false,
  className = '',
}: AIAvatarProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Main avatar circle */}
      <motion.div
        className={`
          ${sizes[size]}
          rounded-full bg-gradient-to-br ${moodColors[mood]}
          shadow-xl shadow-pink-200/50
          flex items-center justify-center
          relative overflow-hidden
        `}
        animate={isSpeaking ? {
          scale: [1, 1.1, 1],
        } : {
          scale: 1,
        }}
        transition={{
          duration: 1.5,
          repeat: isSpeaking ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Inner glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-white/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Face icon */}
        <div className="relative z-10 text-white text-2xl">
          {(mood === 'calm' || mood === 'peaceful') && '😌'}
          {mood === 'happy' && '😊'}
          {(mood === 'thoughtful' || mood === 'reflective') && '🤔'}
          {mood === 'supportive' && '💙'}
          {mood === 'energetic' && '✨'}
          {mood === 'creative' && '🎨'}
        </div>

        {/* Speaking indicator */}
        {isSpeaking && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Orbiting particles */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              x: size === 'sm' ? -20 : size === 'md' ? -30 : -40,
              y: 0,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Mood-based glow */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${moodColors[mood] || moodColors.calm} opacity-30 blur-xl`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

