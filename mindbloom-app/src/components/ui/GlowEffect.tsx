/**
 * GlowEffect - Animated glow effect
 */
import React from 'react';
import { motion } from 'framer-motion';

interface GlowEffectProps {
  color?: string;
  size?: number;
  intensity?: number;
  children: React.ReactNode;
  className?: string;
}

export function GlowEffect({
  color = '#FF8FA3',
  size = 200,
  intensity = 0.5,
  children,
  className = '',
}: GlowEffectProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent)`,
          width: size,
          height: size,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: intensity,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [intensity * 0.5, intensity, intensity * 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

