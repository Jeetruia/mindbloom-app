import React from 'react';
import { motion } from 'framer-motion';

interface XPBarProps {
  currentXP: number;
  level: number;
}

export function XPBar({ currentXP, level }: XPBarProps) {
  const xpForCurrentLevel = level * 100;
  const xpForNextLevel = (level + 1) * 100;
  const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-800">Level {level}</div>
        <div className="text-xs text-gray-600">{currentXP} XP</div>
      </div>
      
      <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-wellness-400 to-wellness-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      <div className="text-xs text-gray-600">
        {xpForNextLevel - currentXP} to next level
      </div>
    </div>
  );
}
