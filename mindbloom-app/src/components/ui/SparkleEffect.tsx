/**
 * SparkleEffect - Animated sparkle particles
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SparkleEffectProps {
  count?: number;
  size?: number;
  duration?: number;
  color?: string;
  className?: string;
}

export function SparkleEffect({
  count = 10,
  size = 4,
  duration = 2,
  color = '#FFD93D',
  className = '',
}: SparkleEffectProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            background: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: duration + Math.random(),
            repeat: Infinity,
            delay: Math.random() * duration,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

