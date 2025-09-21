import React from 'react';
import { motion } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';

interface FloatingPromptProps {
  onClose: () => void;
}

export function FloatingPrompt({ onClose }: FloatingPromptProps) {
  const prompts = [
    "How are you feeling today?",
    "What's one thing you're grateful for?",
    "Share something that made you smile recently",
    "What's a small win you had this week?",
    "How can we support each other today?"
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <motion.div
      className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200 max-w-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Daily Prompt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <p className="text-gray-800 mb-4">
          {randomPrompt}
        </p>
        
        <div className="flex space-x-2">
          <button className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium">
            Share Response
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Skip
          </button>
        </div>
      </div>
    </motion.div>
  );
}
