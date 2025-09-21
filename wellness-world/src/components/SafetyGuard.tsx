import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users } from 'lucide-react';

export function SafetyGuard() {
  return (
    <div className="fixed bottom-4 right-4 z-30">
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">Safety Active</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Crisis detection & community moderation enabled
        </p>
      </motion.div>
    </div>
  );
}
