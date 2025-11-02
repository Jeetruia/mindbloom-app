/**
 * ProgressRadial - Circular progress indicator with animation
 */
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ProgressRadialProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  icon?: LucideIcon | React.ReactNode | ((props: { className?: string; style?: React.CSSProperties }) => React.ReactElement);
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressRadial({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#FF8FA3',
  icon,
  label,
  showPercentage = true,
  className = '',
}: ProgressRadialProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            style={{ color }}
          >
            {React.isValidElement(icon) ? icon : typeof icon === 'function' ? React.createElement(icon as any, { className: 'w-6 h-6', style: { color } }) : icon}
          </motion.div>
        )}
        {showPercentage && (
          <motion.div
            className="text-lg font-bold"
            style={{ color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            {Math.round(progress)}%
          </motion.div>
        )}
        {label && (
          <div className="text-xs text-gray-600 mt-1">{label}</div>
        )}
      </div>
    </div>
  );
}

