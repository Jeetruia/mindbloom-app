/**
 * GradientText - Text with animated gradient
 */
import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  children: React.ReactNode;
  gradient: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

export function GradientText({
  children,
  gradient = 'from-pink-500 via-purple-500 to-blue-500',
  className = '',
  size = 'lg',
}: GradientTextProps) {
  return (
    <motion.span
      className={`
        bg-gradient-to-r ${gradient}
        bg-clip-text text-transparent
        font-bold
        ${sizeClasses[size]}
        ${className}
      `}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.span>
  );
}

