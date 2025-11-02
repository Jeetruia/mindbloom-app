/**
 * MoodMeter - Interactive mood meter with emotion detection
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh } from 'lucide-react';

interface MoodMeterProps {
  mood: 'positive' | 'neutral' | 'negative';
  intensity: number; // 0-1
  size?: number;
  className?: string;
}

export function MoodMeter({ mood, intensity, size = 200, className = '' }: MoodMeterProps) {
  const angle = (intensity - 0.5) * 180; // -90 to 90 degrees
  const moodConfig = {
    positive: { icon: Smile, color: '#FFB88C', emoji: '😊' },
    neutral: { icon: Meh, color: '#B19CD9', emoji: '😐' },
    negative: { icon: Frown, color: '#87CEEB', emoji: '😔' },
  };

  const config = moodConfig[mood];

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size / 2 }}>
      {/* Background arc */}
      <svg width={size} height={size / 2} className="absolute inset-0">
        <path
          d={`M ${size * 0.1} ${size * 0.4} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size * 0.4}`}
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="8"
        />
      </svg>
      
      {/* Active arc */}
      <motion.svg
        width={size}
        height={size / 2}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.path
          d={`M ${size * 0.1} ${size * 0.4} A ${size * 0.4} ${size * 0.4} 0 ${
            angle > 0 ? '1' : '0'
          } 1 ${size * 0.5 + size * 0.4 * Math.cos((angle * Math.PI) / 180)} ${
            size * 0.4 - size * 0.4 * Math.sin((angle * Math.PI) / 180)
          }`}
          fill="none"
          stroke={config.color}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.svg>
      
      {/* Needle */}
      <motion.div
        className="absolute"
        style={{
          left: size / 2,
          top: size * 0.4,
          transformOrigin: 'bottom center',
        }}
        initial={{ rotate: -90 }}
        animate={{ rotate: -90 + angle }}
        transition={{ duration: 1, type: 'spring', stiffness: 100 }}
      >
        <div
          className="w-1 bg-gray-800 rounded-full"
          style={{ height: size * 0.35, transformOrigin: 'bottom center' }}
        />
        <div
          className="absolute -bottom-2 -left-3 w-8 h-8 rounded-full bg-gray-800 border-2 border-white"
          style={{ background: config.color }}
        >
          <div className="flex items-center justify-center h-full text-xl">
            {config.emoji}
          </div>
        </div>
      </motion.div>
      
      {/* Labels */}
      <div className="absolute -bottom-6 left-2 text-xs text-gray-600">Low</div>
      <div className="absolute -bottom-6 right-2 text-xs text-gray-600">High</div>
    </div>
  );
}

