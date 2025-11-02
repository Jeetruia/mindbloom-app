/**
 * FloatingActionButton - Animated floating action button
 */
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { soundEffect } from './SoundEffect';
import { HapticFeedback } from './HapticFeedback';

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  label?: string;
  color?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export function FloatingActionButton({
  icon: Icon,
  onClick,
  label,
  color = 'from-pink-400 to-purple-400',
  position = 'bottom-right',
  className = '',
}: FloatingActionButtonProps) {
  const handleClick = () => {
    soundEffect.playSound('click');
    HapticFeedback.lightTap();
    onClick();
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        fixed ${positionClasses[position]}
        w-16 h-16 rounded-full
        bg-gradient-to-r ${color}
        text-white shadow-2xl
        flex items-center justify-center
        z-50
        ${className}
      `}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <Icon className="w-6 h-6" />
      {label && (
        <motion.span
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          {label}
        </motion.span>
      )}
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/30"
        initial={{ scale: 1, opacity: 0.5 }}
        whileHover={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}

