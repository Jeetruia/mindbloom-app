/**
 * LoadingBloom - Animated loading spinner with bloom effect
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingBloomProps {
  size?: number;
  color?: string;
  message?: string;
}

export function LoadingBloom({ size = 64, color = '#FF8FA3', message = 'Loading...' }: LoadingBloomProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: color,
            borderRightColor: color,
            borderWidth: size / 8,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent"
          style={{
            borderBottomColor: color,
            borderLeftColor: color,
            borderWidth: size / 12,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles style={{ color }} className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
      
      {message && (
        <motion.p
          className="mt-4 text-gray-600 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

