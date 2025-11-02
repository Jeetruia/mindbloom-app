/**
 * Memory Match Game - Functional card matching game
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, CheckCircle } from 'lucide-react';
import { BloomButton } from '../ui/BloomButton';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌿', '🍀', '🍄', '🌵', '🌴', '🌲'];

export function MemoryMatchGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Initialize game
  useEffect(() => {
    startGame();
  }, []);

  // Timer
  useEffect(() => {
    if (isGameOver) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isGameOver]);

  const startGame = () => {
    // Create pairs
    const pairs = [...emojis.slice(0, 8), ...emojis.slice(0, 8)];
    // Shuffle
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    
    const newCards = shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    
    setCards(newCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setIsGameOver(false);
    setTimeElapsed(0);
  };

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedCards.length >= 2) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    // Check for match
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [first, second] = newFlipped;
        if (newCards[first].emoji === newCards[second].emoji) {
          // Match found
          newCards[first].isMatched = true;
          newCards[second].isMatched = true;
          newCards[first].isFlipped = true;
          newCards[second].isFlipped = true;
          setMatches(prev => prev + 1);
          
          if (matches + 1 === 8) {
            // Game over
            setTimeout(() => {
              setIsGameOver(true);
              const score = calculateScore(moves + 1, timeElapsed);
              onComplete(score);
            }, 500);
          }
        } else {
          // No match - flip back
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
        }
        
        setCards(newCards);
        setFlippedCards([]);
      }, 1000);
    }
  };

  const calculateScore = (moves: number, time: number): number => {
    // Base score: 100
    // Bonus for fewer moves: (30 - moves) * 5
    // Bonus for time: (60 - time) * 2
    const moveBonus = Math.max(0, (30 - moves) * 5);
    const timeBonus = Math.max(0, (60 - time) * 2);
    return Math.max(50, 100 + moveBonus + timeBonus);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass-strong rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
            Memory Match
          </h2>
          <p className="text-gray-600">Match all pairs to win!</p>
        </div>
        <BloomButton variant="secondary" size="sm" onClick={startGame} icon={<RotateCcw className="w-4 h-4" />}>
          Restart
        </BloomButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{moves}</div>
          <div className="text-xs text-gray-600">Moves</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{matches}/8</div>
          <div className="text-xs text-gray-600">Matches</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{timeElapsed}s</div>
          <div className="text-xs text-gray-600">Time</div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(index)}
            disabled={card.isMatched || isGameOver}
            className={`
              aspect-square rounded-xl p-4 text-4xl
              transition-all duration-300
              ${card.isMatched ? 'bg-green-400' : card.isFlipped ? 'bg-white/90' : 'bg-purple-400'}
              ${card.isMatched ? 'cursor-default' : 'cursor-pointer hover:scale-105'}
              shadow-lg
            `}
            whileHover={!card.isMatched ? { scale: 1.05 } : {}}
            whileTap={!card.isMatched ? { scale: 0.95 } : {}}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {(card.isFlipped || card.isMatched) ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
              >
                {card.emoji}
              </motion.div>
            ) : (
              <div className="text-gray-600">?</div>
            )}
            {card.isMatched && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ type: 'spring' }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Game Over */}
      <AnimatePresence>
        {isGameOver && (
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h3>
            <p className="text-gray-600 mb-4">You matched all pairs!</p>
            <div className="space-y-2">
              <div className="text-lg">
                <span className="font-semibold">Final Score:</span>{' '}
                <span className="text-purple-600 font-bold">{calculateScore(moves, timeElapsed)} XP</span>
              </div>
              <div className="text-sm text-gray-600">
                Completed in {moves} moves and {timeElapsed} seconds
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

