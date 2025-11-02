/**
 * Type Racer Game - Speed typing challenge
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, RotateCcw } from 'lucide-react';
import { BloomButton } from '../ui/BloomButton';

const affirmations = [
  "I am capable of achieving my goals",
  "Every day I grow stronger and wiser",
  "I choose to focus on positive thoughts",
  "I am worthy of love and happiness",
  "I embrace challenges as opportunities",
  "My mind is calm and peaceful",
  "I trust in my ability to succeed",
  "I am grateful for this moment",
];

export function TypeRacerGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const randomText = affirmations[Math.floor(Math.random() * affirmations.length)];
    setCurrentText(randomText);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (startTime && userInput.length === 1) {
      setStartTime(Date.now());
    }
    
    if (userInput.length > 0 && startTime) {
      const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      const wordsTyped = userInput.length / 5;
      setWpm(Math.round(wordsTyped / elapsed));
      
      // Calculate accuracy
      let errorCount = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== currentText[i]) {
          errorCount++;
        }
      }
      setErrors(errorCount);
      setAccuracy(Math.max(0, ((userInput.length - errorCount) / userInput.length) * 100));
    }
  }, [userInput, startTime, currentText]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setUserInput(value);
    
    if (value === currentText) {
      setIsComplete(true);
      const score = calculateScore(wpm, accuracy);
      setTimeout(() => onComplete(score), 1000);
    }
  };

  const calculateScore = (wpm: number, acc: number): number => {
    // Base score from WPM
    // Accuracy bonus
    const wpmScore = Math.min(100, wpm * 2);
    const accuracyBonus = (acc / 100) * 50;
    return Math.round(wpmScore + accuracyBonus);
  };

  const restart = () => {
    const randomText = affirmations[Math.floor(Math.random() * affirmations.length)];
    setCurrentText(randomText);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
    setErrors(0);
    inputRef.current?.focus();
  };

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return 'text-gray-400';
    if (userInput[index] === currentText[index]) return 'text-green-500';
    return 'text-red-500 bg-red-100';
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass-strong rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            Type Racer
          </h2>
          <p className="text-gray-600">Type the affirmation as fast as you can!</p>
        </div>
        <BloomButton variant="secondary" size="sm" onClick={restart} icon={<RotateCcw className="w-4 h-4" />}>
          Restart
        </BloomButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">{wpm}</div>
          <div className="text-xs text-gray-600">WPM</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round(accuracy)}%</div>
          <div className="text-xs text-gray-600">Accuracy</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{errors}</div>
          <div className="text-xs text-gray-600">Errors</div>
        </div>
      </div>

      {/* Text to Type */}
      <div className="mb-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-4">
          <div className="text-lg leading-relaxed font-medium text-gray-800">
            {currentText.split('').map((char, index) => (
              <span key={index} className={getCharacterClass(index)}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInput}
          disabled={isComplete}
          placeholder="Start typing..."
          className="w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-lg font-medium text-gray-800"
        />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(userInput.length / currentText.length) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">
          {userInput.length} / {currentText.length} characters
        </div>
      </div>

      {/* Completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Amazing!</h3>
            <p className="text-gray-600 mb-4">You completed the typing challenge!</p>
            <div className="space-y-2">
              <div className="text-lg">
                <span className="font-semibold">Final Score:</span>{' '}
                <span className="text-purple-600 font-bold">{calculateScore(wpm, accuracy)} XP</span>
              </div>
              <div className="text-sm text-gray-600">
                {wpm} WPM • {Math.round(accuracy)}% Accuracy
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

