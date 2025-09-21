import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { WellnessChallenge } from '../types';
import { Target, Users, Clock, Star, CheckCircle } from 'lucide-react';

export function WellnessChallenges() {
  const { wellnessChallenges, joinChallenge, completeChallenge } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
    { id: 'connection', name: 'Connection', icon: '🤝' },
    { id: 'movement', name: 'Movement', icon: '🏃' },
    { id: 'creativity', name: 'Creativity', icon: '🎨' },
    { id: 'gratitude', name: 'Gratitude', icon: '🙏' }
  ];

  const getDifficultyColor = (difficulty: WellnessChallenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: WellnessChallenge['category']) => {
    switch (category) {
      case 'mindfulness': return '🧘';
      case 'connection': return '🤝';
      case 'movement': return '🏃';
      case 'creativity': return '🎨';
      case 'gratitude': return '🙏';
      default: return '🌟';
    }
  };

  const filteredChallenges = selectedCategory === 'all' 
    ? wellnessChallenges 
    : wellnessChallenges.filter(challenge => challenge.category === selectedCategory);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-800">Wellness Challenges</h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredChallenges.map((challenge) => {
            const isJoined = challenge.participants.length > 0;
            const isCompleted = challenge.completions.length > 0;
            const timeLeft = new Date(challenge.endDate).getTime() - new Date().getTime();
            const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={challenge.id}
                className={`rounded-lg border-2 p-3 transition-all duration-200 ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : isJoined 
                      ? 'border-purple-200 bg-purple-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Challenge Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryIcon(challenge.category)}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{challenge.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{daysLeft} days left</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{challenge.participants.length}</span>
                    </div>
                  </div>
                </div>

                {/* Challenge Description */}
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>

                {/* Progress Bar */}
                {isJoined && !isCompleted && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{challenge.completions.length} completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(challenge.completions.length / challenge.participants.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => joinChallenge(challenge.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isJoined
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        {isJoined ? 'Joined' : 'Join Challenge'}
                      </button>
                      
                      {isJoined && (
                        <button
                          onClick={() => completeChallenge(challenge.id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium text-center">
                      ✅ Completed!
                    </div>
                  )}
                  
                  <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                </div>

                {/* XP Reward */}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>XP Reward:</span>
                  <span className="font-semibold text-purple-600">+{challenge.xpReward}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Daily Challenge Highlight */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">🌟</span>
          <span className="text-sm font-medium text-gray-700">Today's Featured Challenge</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Share one thing you're grateful for with the community
        </p>
        <button className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium">
          Start Today's Challenge
        </button>
      </div>
    </div>
  );
}
