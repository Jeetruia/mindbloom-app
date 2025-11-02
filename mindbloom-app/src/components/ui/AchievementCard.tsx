/**
 * AchievementCard - Flipping card that bursts confetti when unlocked
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, Check } from 'lucide-react';
import { soundEffect } from './SoundEffect';
import { HapticFeedback } from './HapticFeedback';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  onUnlock?: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 via-orange-400 to-pink-400',
};

export function AchievementCard({
  title,
  description,
  icon,
  unlocked,
  rarity = 'common',
  onUnlock,
}: AchievementCardProps) {
  const [showConfetti, setShowConfetti] = React.useState(false);

  useEffect(() => {
    if (unlocked && !showConfetti) {
      setShowConfetti(true);
      onUnlock?.();
      // Play sound and haptic feedback
      soundEffect.playSound('achievement');
      HapticFeedback.achievement();
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unlocked, showConfetti, onUnlock]);

  return (
    <motion.div
      className="relative perspective-1000"
      whileHover={{ scale: 1.05, rotateY: 5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={`relative w-full h-48 rounded-2xl bg-gradient-to-br ${rarityColors[rarity]} shadow-xl overflow-hidden cursor-pointer`}
        animate={unlocked ? {
          boxShadow: [
            '0 10px 40px rgba(255, 143, 163, 0.2)',
            '0 10px 40px rgba(255, 143, 163, 0.4)',
            '0 10px 40px rgba(255, 143, 163, 0.2)',
          ],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Unlocked glow */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
          <motion.div
            className="text-5xl mb-2"
            animate={unlocked ? {
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            } : {}}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {icon}
          </motion.div>

          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-white/90 text-center">{description}</p>

          {/* Unlock badge */}
          {unlocked && (
            <motion.div
              className="absolute top-2 right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Check className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}

          {/* Locked overlay */}
          {!unlocked && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white/50" />
            </div>
          )}
        </div>

        {/* Confetti burst */}
        <AnimatePresence>
          {showConfetti && (
            <>
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * Math.PI * 2;
                const distance = 100;
                const colors = ['#FF8FA3', '#FFB88C', '#B19CD9', '#A8E6CF', '#FFD93D'];
                return (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      background: colors[i % colors.length],
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.02,
                      ease: 'easeOut',
                    }}
                  />
                );
              })}
              
              {/* Sparkle effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Sparkles className="w-16 h-16 text-yellow-300" />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

