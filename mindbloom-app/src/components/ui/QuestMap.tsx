/**
 * QuestMap - Challenge flow visualization with animated paths
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Play } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  status: 'completed' | 'available' | 'locked';
  x: number;
  y: number;
}

interface QuestMapProps {
  quests: Quest[];
  onQuestClick?: (questId: string) => void;
}

export function QuestMap({ quests, onQuestClick }: QuestMapProps) {
  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Background paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {quests.slice(0, -1).map((quest, i) => {
          const nextQuest = quests[i + 1];
          if (!nextQuest) return null;
          
          return (
            <motion.line
              key={`path-${quest.id}-${nextQuest.id}`}
              x1={`${quest.x}%`}
              y1={`${quest.y}%`}
              x2={`${nextQuest.x}%`}
              y2={`${nextQuest.y}%`}
              stroke={quest.status === 'completed' ? '#A8E6CF' : '#E5E7EB'}
              strokeWidth="3"
              strokeDasharray={quest.status === 'completed' ? '0' : '10 5'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: quest.status === 'completed' ? 1 : 0.5 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          );
        })}
      </svg>

      {/* Quest nodes */}
      {quests.map((quest) => (
        <motion.div
          key={quest.id}
          className="absolute cursor-pointer"
          style={{
            left: `${quest.x}%`,
            top: `${quest.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: quests.indexOf(quest) * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onQuestClick?.(quest.id)}
        >
          {/* Quest circle */}
          <div
            className={`
              w-16 h-16 rounded-full
              flex items-center justify-center
              shadow-xl transition-all
              ${
                quest.status === 'completed'
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                  : quest.status === 'available'
                  ? 'bg-gradient-to-br from-pink-400 to-peach-400'
                  : 'bg-gradient-to-br from-gray-300 to-gray-400'
              }
            `}
          >
            {quest.status === 'completed' && (
              <CheckCircle className="w-8 h-8 text-white" />
            )}
            {quest.status === 'available' && (
              <Play className="w-8 h-8 text-white" />
            )}
            {quest.status === 'locked' && (
              <Lock className="w-8 h-8 text-gray-600" />
            )}
          </div>

          {/* Quest title */}
          <motion.div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-md text-sm font-medium text-gray-800">
              {quest.title}
            </div>
          </motion.div>

          {/* Pulse effect for available quests */}
          {quest.status === 'available' && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-pink-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

