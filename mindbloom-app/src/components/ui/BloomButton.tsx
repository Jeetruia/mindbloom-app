/**
 * BloomButton - Animated gradient button that "blooms" on click
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BloomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'mint' | 'lavender';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const variants = {
  primary: 'bg-gradient-to-r from-pink-400 via-peach-400 to-lavender-400',
  secondary: 'bg-gradient-to-r from-sky-400 via-mint-400 to-lavender-400',
  mint: 'bg-gradient-to-r from-mint-400 via-sky-400 to-lavender-400',
  lavender: 'bg-gradient-to-r from-lavender-400 via-pink-400 to-peach-400',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function BloomButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
}: BloomButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        text-white font-semibold rounded-2xl
        shadow-lg shadow-pink-200/50
        backdrop-blur-sm
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={disabled ? {} : {
        scale: 1.05,
        boxShadow: '0 0 30px rgba(255, 143, 163, 0.4)',
      }}
      whileTap={disabled ? {} : {
        scale: 0.98,
      }}
      animate={disabled ? {} : {
        boxShadow: [
          '0 10px 40px rgba(255, 143, 163, 0.2)',
          '0 10px 40px rgba(255, 143, 163, 0.3)',
          '0 10px 40px rgba(255, 143, 163, 0.2)',
        ],
      }}
      transition={{
        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {/* Bloom ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Content */}
      <span className="relative flex items-center justify-center space-x-2">
        {icon && <span>{icon}</span>}
        <span>{children}</span>
        {!icon && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        )}
      </span>
      
      {/* Floating particles on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: '50%',
            }}
            animate={{
              y: [0, -30, -60],
              x: [0, Math.random() * 20 - 10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>
    </motion.button>
  );
}

