/**
 * Trivia Game - Mental wellness trivia questions
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { BloomButton } from '../ui/BloomButton';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: "Which breathing technique is most effective for reducing stress?",
    options: ["Fast shallow breaths", "Deep diaphragmatic breathing", "Holding breath", "Irregular breathing"],
    correct: 1,
    explanation: "Deep diaphragmatic breathing activates the parasympathetic nervous system, promoting relaxation.",
  },
  {
    question: "How long does it typically take to form a new habit?",
    options: ["7 days", "21 days", "30-66 days", "100 days"],
    correct: 2,
    explanation: "Research shows it takes an average of 66 days to form a new habit, but can range from 18 to 254 days.",
  },
  {
    question: "What is a common technique used in Cognitive Behavioral Therapy (CBT)?",
    options: ["Ignoring negative thoughts", "Challenging cognitive distortions", "Avoiding emotions", "Suppressing feelings"],
    correct: 1,
    explanation: "CBT focuses on identifying and challenging cognitive distortions to change thought patterns.",
  },
  {
    question: "Which activity is proven to boost mood naturally?",
    options: ["Watching TV", "Exercise", "Scrolling social media", "Isolation"],
    correct: 1,
    explanation: "Exercise releases endorphins and other mood-boosting chemicals in the brain.",
  },
  {
    question: "What percentage of communication is non-verbal?",
    options: ["30%", "55%", "70%", "90%"],
    correct: 2,
    explanation: "Research suggests that 55% of communication is body language, 38% is tone of voice, and only 7% is words.",
  },
];

export function TriviaGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Shuffle and select 5 questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === shuffledQuestions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsComplete(true);
        const finalScore = calculateScore(score + (index === shuffledQuestions[currentQuestion].correct ? 1 : 0));
        setTimeout(() => onComplete(finalScore), 1500);
      }
    }, 2000);
  };

  const calculateScore = (correct: number): number => {
    // Base: 50 XP per correct answer
    // Bonus: 50 XP if perfect score
    return (correct * 50) + (correct === shuffledQuestions.length ? 50 : 0);
  };

  const restart = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsComplete(false);
  };

  if (shuffledQuestions.length === 0) {
    return <div>Loading...</div>;
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass-strong rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-500" />
            Wellness Trivia
          </h2>
          <p className="text-gray-600">Test your mental wellness knowledge!</p>
        </div>
        <BloomButton variant="secondary" size="sm" onClick={restart} icon={<RotateCcw className="w-4 h-4" />}>
          Restart
        </BloomButton>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </span>
          <span className="text-sm font-semibold text-purple-600">
            Score: {score}/{shuffledQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correct;
              const showFeedback = showResult && isSelected;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all
                    ${showResult && isCorrect ? 'bg-green-100 border-2 border-green-400' : ''}
                    ${showFeedback && !isCorrect ? 'bg-red-100 border-2 border-red-400' : ''}
                    ${!showResult && 'bg-white/70 backdrop-blur-sm hover:bg-white/90 border-2 border-transparent hover:border-purple-300'}
                    ${selectedAnswer !== null && index === question.correct ? 'bg-green-100 border-2 border-green-400' : ''}
                  `}
                  whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium">{option}</span>
                    {showFeedback && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </motion.div>
                    )}
                    {selectedAnswer !== null && index === question.correct && !isSelected && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Explanation:</span> {question.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
            <p className="text-gray-600 mb-4">
              You got {score} out of {shuffledQuestions.length} correct!
            </p>
            <div className="text-lg">
              <span className="font-semibold">Final Score:</span>{' '}
              <span className="text-purple-600 font-bold">{calculateScore(score)} XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

