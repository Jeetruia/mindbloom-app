import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Heart, Users } from 'lucide-react';

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          <Loader2 className="w-12 h-12 text-emerald-500 mx-auto" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
            <Users className="w-8 h-8 text-blue-500" />
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading WellnessWorld
          </h2>
          <p className="text-gray-600">
            Preparing your safe space for connection and growth...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
