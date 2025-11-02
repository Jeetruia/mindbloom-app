/**
 * StatsWidget - Animated statistics widget
 */
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsWidgetProps {
  icon: LucideIcon;
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

export function StatsWidget({
  icon: Icon,
  label,
  value,
  max,
  color,
  unit = '',
  trend,
  trendValue,
}: StatsWidgetProps) {
  const percentage = (value / max) * 100;

  return (
    <motion.div
      className="glass-strong rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
          <Icon className={`w-6 h-6`} style={{ color: color.split('-')[1] }} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
            {trendValue && <span>{Math.abs(trendValue)}%</span>}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="flex items-baseline space-x-2">
          <motion.div
            className="text-3xl font-bold text-gray-800"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {value}
          </motion.div>
          {unit && <span className="text-sm text-gray-600">{unit}</span>}
        </div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        />
      </div>
      
      <div className="text-xs text-gray-500 mt-1">
        {percentage.toFixed(0)}% of {max}
      </div>
    </motion.div>
  );
}

