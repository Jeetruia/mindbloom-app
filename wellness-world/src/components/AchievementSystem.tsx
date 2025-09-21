import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { CommunityAchievement, Badge } from '../types';
import { Trophy, Star, Heart, Users, Zap, Lock, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';

export function AchievementSystem() {
  const { 
    achievements, 
    userBadges, 
    empathyPoints,
    unlockAchievement 
  } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfetti, setShowConfetti] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'empathy', name: 'Empathy', icon: '💝' },
    { id: 'openness', name: 'Openness', icon: '🗣️' },
    { id: 'support', name: 'Support', icon: '🤝' },
    { id: 'growth', name: 'Growth', icon: '🌱' },
    { id: 'community', name: 'Community', icon: '👥' }
  ];

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'uncommon': return 'bg-green-100 text-green-800 border-green-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRarityIcon = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return '⭐';
      case 'uncommon': return '🌟';
      case 'rare': return '💫';
      case 'epic': return '✨';
      case 'legendary': return '👑';
      default: return '⭐';
    }
  };

  const getCategoryIcon = (category: CommunityAchievement['category']) => {
    switch (category) {
      case 'empathy': return '💝';
      case 'openness': return '🗣️';
      case 'support': return '🤝';
      case 'growth': return '🌱';
      case 'community': return '👥';
      default: return '🌟';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const handleUnlockAchievement = async (achievementId: string) => {
    try {
      await unlockAchievement(achievementId);
      setNewlyUnlocked(prev => [...prev, achievementId]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <h2 className="text-lg font-semibold text-gray-800">Achievements</h2>
      </div>

      {/* Empathy Points Display */}
      <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-medium text-gray-700">Empathy Points</span>
          </div>
          <span className="text-lg font-bold text-pink-600">{empathyPoints}</span>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Earned by supporting others and sharing vulnerably
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAchievements.map((achievement) => {
            const isUnlocked = achievement.unlockedBy.length > 0;
            const isNewlyUnlocked = newlyUnlocked.includes(achievement.id);
            const progress = Math.min(100, (achievement.unlockedBy.length / 10) * 100); // Assuming 10 is max

            return (
              <motion.div
                key={achievement.id}
                className={`rounded-lg border-2 p-3 transition-all duration-200 ${
                  isUnlocked 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Achievement Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isUnlocked ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {isUnlocked ? (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Trophy className="w-5 h-5 text-yellow-600" />
                        </motion.div>
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{achievement.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{getCategoryIcon(achievement.category)}</span>
                        <span>{achievement.category}</span>
                        {isUnlocked && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            Unlocked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{achievement.unlockedBy.length}</span>
                    </div>
                    {isNewlyUnlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Achievement Description */}
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>

                {/* Progress Bar */}
                {!isUnlocked && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.unlockedBy.length}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Rewards:</span>
                    {achievement.rewards.map((reward, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        {reward.type === 'xp' && (
                          <>
                            <Zap className="w-3 h-3 text-purple-500" />
                            <span className="text-xs text-purple-600">+{reward.value}</span>
                          </>
                        )}
                        {reward.type === 'badge' && (
                          <>
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600">Badge</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {!isUnlocked && (
                    <button
                      onClick={() => handleUnlockAchievement(achievement.id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Recent Badges */}
      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-gray-700">Recent Badges</span>
        </div>
        <div className="flex space-x-2">
          {userBadges.slice(0, 3).map((badge) => (
            <div
              key={badge.id}
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(badge.rarity)}`}
            >
              <span className="mr-1">{getRarityIcon(badge.rarity)}</span>
              {badge.name}
            </div>
          ))}
        </div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
    </div>
  );
}
