/**
 * ConfettiBurst - Celebratory confetti animation
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiBurstProps {
  trigger: boolean;
  colors?: string[];
  count?: number;
  onComplete?: () => void;
}

export function ConfettiBurst({
  trigger,
  colors = ['#FF8FA3', '#FFB88C', '#B19CD9', '#A8E6CF', '#87CEEB', '#FFD93D'],
  count = 50,
  onComplete,
}: ConfettiBurstProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(count)].map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const distance = 200 + Math.random() * 200;
            const color = colors[i % colors.length];
            const delay = Math.random() * 0.5;
            
            return (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: '50%',
                  top: '50%',
                  background: color,
                  rotate: Math.random() * 360,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * distance + (Math.random() - 0.5) * 100,
                  y: Math.sin(angle) * distance + (Math.random() - 0.5) * 100,
                  rotate: Math.random() * 720,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

