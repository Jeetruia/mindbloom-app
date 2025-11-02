import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, CheckCircle } from 'lucide-react';
import { googleCloudLanguageService } from '../services/googleCloudLanguageService';
import { xpService } from '../services/xpService';
import { useStore } from '../hooks/useStore';

interface GratitudeGameProps {
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export function GratitudeGame({ onClose, onComplete }: GratitudeGameProps) {
  const { user, setUser } = useStore();
  const [gratitudes, setGratitudes] = useState<string[]>(['', '', '']);
  const [completed, setCompleted] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitudes = [...gratitudes];
    newGratitudes[index] = value;
    setGratitudes(newGratitudes);
  };

  const analyzeSentiment = async () => {
    const allText = gratitudes.join(' ');
    if (!allText.trim()) return;

    try {
      const sentiment = await googleCloudLanguageService.analyzeSentiment(allText);
      // Convert sentiment score (-1 to 1) to 0-100 scale
      const score = ((sentiment.score + 1) / 2) * 100;
      setSentimentScore(Math.round(score));
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setSentimentScore(75); // Default score
    }
  };

  const handleSubmit = async () => {
    const filledGratitudes = gratitudes.filter(g => g.trim().length > 0);
    
    if (filledGratitudes.length < 3) {
      alert('Please write at least 3 things you are grateful for!');
      return;
    }

    await analyzeSentiment();
    setCompleted(true);
    setShowResults(true);
  };

  const handleComplete = async () => {
    if (!user) return;

    // Calculate XP based on sentiment and completeness
    let baseXP = 20;
    baseXP += sentimentScore > 80 ? 15 : sentimentScore > 60 ? 10 : 5;
    baseXP += gratitudes.filter(g => g.trim().length > 20).length * 5; // Bonus for detailed entries

    // Add XP using service
    const result = await xpService.addXP(user.id, user.xp || 0, {
      id: `gratitude-${Date.now()}`,
      type: 'journal',
      xp: baseXP,
      description: 'Completed Gratitude Exercise',
      metadata: {
        gratitudes: gratitudes.filter(g => g.trim()),
        sentimentScore,
      }
    });

    // Update user
    if (setUser) {
      setUser({
        ...user,
        xp: result.newXP,
        avatarLevel: result.newLevel,
      });
    }

    onComplete(baseXP);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              🙏 Gratitude Hunt
              <Sparkles className="w-6 h-6" />
            </h2>
            <p className="text-sm mt-1">Find joy in the everyday</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!showResults ? (
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                <p className="text-gray-700 text-sm">
                  <strong>Your Mission:</strong> Write down 3 things you're grateful for today. 
                  They can be big or small - what matters is they bring you joy.
                </p>
              </div>

              {gratitudes.map((gratitude, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gratitude #{index + 1}
                  </label>
                  <textarea
                    value={gratitude}
                    onChange={(e) => handleGratitudeChange(index, e.target.value)}
                    placeholder={`What are you grateful for? (e.g., "The warm sunshine today", "A friend who made me laugh")`}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition resize-none"
                    rows={3}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {gratitude.length} characters
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={gratitudes.filter(g => g.trim()).length < 3}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Heart size={20} />
                  Complete Gratitude Hunt
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-3xl font-bold text-gray-800">Wonderful Gratitude!</h3>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {sentimentScore}% Positive
                </div>
                <p className="text-gray-700">
                  Your gratitude entries show a {sentimentScore > 80 ? 'very' : sentimentScore > 60 ? '' : 'growing'} positive mindset!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {gratitudes.filter(g => g.trim()).map((gratitude, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-xl border-2 border-yellow-200"
                  >
                    <CheckCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-700 line-clamp-3">{gratitude}</p>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleComplete}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition flex items-center gap-2 mx-auto"
              >
                <Sparkles size={20} />
                Earn Your XP Reward
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

