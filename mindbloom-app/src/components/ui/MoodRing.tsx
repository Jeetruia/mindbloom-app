/**
 * MoodRing - Interactive mood visualization ring
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface MoodRingProps {
  mood: 'calm' | 'happy' | 'reflective' | 'energetic' | 'peaceful' | 'creative';
  intensity: number; // 0-1
  size?: number;
  className?: string;
}

const moodColors = {
  calm: { from: '#87CEEB', to: '#4682B4' },
  happy: { from: '#FFB88C', to: '#FF8FA3' },
  reflective: { from: '#B19CD9', to: '#9370DB' },
  energetic: { from: '#FF8FA3', to: '#FF6B8A' },
  peaceful: { from: '#A8E6CF', to: '#66D9A3' },
  creative: { from: '#D4A5F7', to: '#B980E8' },
};

export function MoodRing({ mood, intensity, size = 120, className = '' }: MoodRingProps) {
  const color = moodColors[mood];
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const offset = circumference - (intensity * circumference);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="8"
        />
        
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          fill="none"
          stroke={`url(#gradient-${mood})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        <defs>
          <linearGradient id={`gradient-${mood}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.from} />
            <stop offset="100%" stopColor={color.to} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-8 h-8" style={{ color: color.from }} />
        </motion.div>
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            background: color.from,
            left: '50%',
            top: '50%',
            x: 0,
            y: 0,
          }}
          animate={{
            x: [0, Math.cos((i * 120) * Math.PI / 180) * (size / 2 + 20)],
            y: [0, Math.sin((i * 120) * Math.PI / 180) * (size / 2 + 20)],
            opacity: [0.8, 0, 0.8],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

