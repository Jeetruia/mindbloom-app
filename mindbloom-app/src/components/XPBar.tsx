import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { GradientText } from './ui/GradientText';
import { xpService } from '../services/xpService';

interface XPBarProps {
  currentXP: number;
  level: number;
}

export function XPBar({ currentXP, level }: XPBarProps) {
  // Use XP service for accurate calculations
  const levelProgress = xpService.getLevelProgress(currentXP);
  const actualLevel = levelProgress.currentLevel;
  const actualProgress = levelProgress.progress;
  const xpToNext = levelProgress.xpToNextLevel;

  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <GradientText gradient="from-blue-500 via-purple-500 to-pink-500" size="sm">
          Level {actualLevel}
        </GradientText>
        <div className="text-xs text-gray-600">
          <AnimatedCounter value={currentXP} /> XP
        </div>
      </div>
      
      <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(actualProgress, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
      
      <div className="text-xs text-gray-600">
        {xpToNext > 0 ? (
          <>
            <AnimatedCounter value={xpToNext} /> to next level
          </>
        ) : (
          'Max Level!'
        )}
      </div>
    </div>
  );
}
