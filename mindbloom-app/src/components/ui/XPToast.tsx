/**
 * XPToast - Floating +XP particle animation
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { soundEffect } from './SoundEffect';
import { HapticFeedback } from './HapticFeedback';

interface XPToastProps {
  xp: number;
  show: boolean;
  onComplete?: () => void;
  position?: { x: number; y: number };
}

export function XPToast({ xp, show, onComplete, position = { x: 50, y: 50 } }: XPToastProps) {
  useEffect(() => {
    if (show) {
      // Play sound and haptic feedback
      soundEffect.playSound('xp');
      HapticFeedback.lightTap();
      
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -50 }}
          exit={{ opacity: 0, scale: 0.5, y: -100 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main XP Badge */}
          <motion.div
            className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full px-6 py-3 shadow-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <Sparkles className="w-5 h-5" />
              <span>+{xp} XP</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/30 blur-xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>

          {/* Particle burst */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 60;
            return (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

