import React from 'react';
import { motion } from 'framer-motion';

interface UserAvatarProps {
  level: number;
}

export function UserAvatar({ level }: UserAvatarProps) {
  const getAvatarColor = (level: number) => {
    if (level < 5) return 'bg-gray-400';
    if (level < 10) return 'bg-green-400';
    if (level < 15) return 'bg-blue-400';
    if (level < 20) return 'bg-purple-400';
    return 'bg-yellow-400';
  };

  const getAvatarSize = (level: number) => {
    const baseSize = 40;
    const growthFactor = Math.floor(level / 5) * 5;
    return baseSize + growthFactor;
  };

  return (
    <motion.div
      className={`${getAvatarColor(level)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
      style={{ 
        width: getAvatarSize(level), 
        height: getAvatarSize(level) 
      }}
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse'
      }}
    >
      <span className="text-lg">🧘</span>
    </motion.div>
  );
}
