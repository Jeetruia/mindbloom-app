/**
 * MoodBackground - Gradient that shifts hue based on current detected mood
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MoodBackgroundProps {
  mood?: 'calm' | 'happy' | 'reflective' | 'energetic' | 'peaceful' | 'creative' | 'default';
  children: React.ReactNode;
  intensity?: number; // 0-1, how intense the mood color is
}

const moodGradients = {
  calm: 'from-sky-300 via-blue-200 to-lavender-200',
  happy: 'from-peach-300 via-pink-200 to-yellow-200',
  reflective: 'from-lavender-300 via-purple-200 to-pink-200',
  energetic: 'from-pink-400 via-orange-300 to-yellow-300',
  peaceful: 'from-mint-300 via-green-200 to-blue-200',
  creative: 'from-purple-300 via-pink-300 to-peach-300',
  default: 'from-pink-200 via-peach-200 to-lavender-200',
};

export function MoodBackground({
  mood = 'default',
  children,
  intensity = 0.7,
}: MoodBackgroundProps) {
  const [currentMood, setCurrentMood] = useState(mood);

  useEffect(() => {
    if (mood !== currentMood && mood) {
      const timer = setTimeout(() => setCurrentMood(mood), 300);
      return () => clearTimeout(timer);
    }
  }, [mood, currentMood]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${moodGradients[currentMood]}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: intensity }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.4), rgba(255, 143, 163, 0.2))`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, Math.sin(i) * 50, 0],
              y: [0, Math.cos(i) * 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Bokeh glow effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(255, 143, 163, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 70% 80%, rgba(177, 156, 217, 0.1) 0%, transparent 50%)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

