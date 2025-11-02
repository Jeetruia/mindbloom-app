import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Mic, MicOff, Trophy, Flame } from 'lucide-react';
import { googleCloudStorageService } from '../services/googleCloudStorageService';
import { useStore } from '../hooks/useStore';

interface BreathingDragonGameProps {
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export function BreathingDragonGame({ onClose, onComplete }: BreathingDragonGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [cycle, setCycle] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [breathDetected, setBreathDetected] = useState(false);
  const [score, setScore] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(0);
  const [level, setLevel] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  const phaseTimeRef = useRef<number>(0);
  
  const { user, setUser } = useStore();
  
  // Cycle timing (4-7-8 breathing)
  const PHASE_DURATIONS = {
    inhale: 4000,  // 4 seconds
    hold: 7000,    // 7 seconds
    exhale: 8000,  // 8 seconds
    rest: 2000     // 2 seconds rest
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startBreathingCycle = () => {
    setIsPlaying(true);
    setShowInstructions(false);
    startCamera();
    setPhase('inhale');
    setCycle(0);
    phaseTimeRef.current = Date.now();
    runBreathingCycle();
  };

  const runBreathingCycle = () => {
    if (!isPlaying) return;

    const now = Date.now();
    const elapsed = now - phaseTimeRef.current;
    const duration = PHASE_DURATIONS[phase];

    if (elapsed >= duration) {
      // Move to next phase
      let nextPhase: typeof phase;
      switch (phase) {
        case 'inhale':
          nextPhase = 'hold';
          break;
        case 'hold':
          nextPhase = 'exhale';
          break;
        case 'exhale':
          nextPhase = 'rest';
          setTotalBreaths(prev => prev + 1);
          setCycle(prev => prev + 1);
          // Award XP based on cycle completion
          const xpEarned = calculateXP();
          setScore(prev => prev + xpEarned);
          
          // Level up every 5 cycles
          if ((cycle + 1) % 5 === 0) {
            setLevel(prev => prev + 1);
          }
          break;
        case 'rest':
          nextPhase = 'inhale';
          break;
      }
      
      setPhase(nextPhase);
      phaseTimeRef.current = Date.now();
    }

    animationRef.current = requestAnimationFrame(runBreathingCycle);
  };

  const calculateXP = () => {
    // Base XP per breath cycle
    let baseXP = 10;
    
    // Bonus for completing cycles
    if (cycle > 0) {
      baseXP += Math.floor(cycle / 2) * 5;
    }
    
    // Bonus for level
    baseXP += level * 2;
    
    return baseXP;
  };

  const stopGame = () => {
    setIsPlaying(false);
    stopCamera();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const completeGame = async () => {
    stopGame();
    
    // Calculate final XP (base + bonus)
    const finalXP = score + (cycle * 5) + (level * 10);
    
    // Save session to Google Cloud Storage
    if (user) {
      try {
        const sessionData = {
          userId: user.id,
          gameType: 'breathing-dragon',
          cyclesCompleted: cycle,
          totalBreaths,
          level,
          score,
          xpEarned: finalXP,
          timestamp: new Date().toISOString(),
        };
        
        // Save session data (as JSON)
        const blob = new Blob([JSON.stringify(sessionData)], { type: 'application/json' });
        await googleCloudStorageService.uploadAudio(
          blob as any,
          user.id,
          'recording',
          `breathing-session-${Date.now()}.json`
        );
      } catch (error) {
        console.error('Error saving session:', error);
      }
      
      // Update user XP
      const updatedUser = {
        ...user,
        xp: (user.xp || 0) + finalXP,
      };
      setUser(updatedUser);
    }
    
    onComplete(finalXP);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return { text: 'Breathe IN...', color: 'text-blue-500', emoji: '⬆️' };
      case 'hold':
        return { text: 'Hold...', color: 'text-purple-500', emoji: '⏸️' };
      case 'exhale':
        return { text: 'Breathe OUT...', color: 'text-green-500', emoji: '⬇️' };
      case 'rest':
        return { text: 'Rest...', color: 'text-gray-500', emoji: '💤' };
    }
  };

  const getPhaseProgress = () => {
    const now = Date.now();
    const elapsed = now - phaseTimeRef.current;
    const duration = PHASE_DURATIONS[phase];
    return Math.min((elapsed / duration) * 100, 100);
  };

  const phaseInfo = getPhaseInstruction();
  const progress = getPhaseProgress();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              🐉 Breathing Dragon
              <span className="text-sm font-normal bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Level {level}
              </span>
            </h2>
            <p className="text-sm mt-1">4-7-8 Breathing Exercise</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {showInstructions ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="text-6xl mb-4">🐉</div>
              <h3 className="text-2xl font-bold text-gray-800">Welcome to Breathing Dragon!</h3>
              <div className="bg-blue-50 p-6 rounded-xl space-y-4 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📖</div>
                  <div>
                    <h4 className="font-semibold mb-1">How to Play</h4>
                    <p className="text-sm text-gray-600">
                      Follow the breathing pattern: Inhale for 4 seconds, hold for 7 seconds, 
                      exhale for 8 seconds, then rest. Complete cycles to earn XP!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h4 className="font-semibold mb-1">Your Goal</h4>
                    <p className="text-sm text-gray-600">
                      Complete as many breathing cycles as you can. Each cycle earns you XP, 
                      and you level up every 5 cycles!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📹</div>
                  <div>
                    <h4 className="font-semibold mb-1">Camera</h4>
                    <p className="text-sm text-gray-600">
                      Your camera helps track your breathing. Don't worry - nothing is recorded 
                      or saved without your permission.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={startBreathingCycle}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition flex items-center gap-2 mx-auto"
              >
                <Play size={20} />
                Start Breathing Journey
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Camera View */}
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="absolute w-64 h-64 rounded-full border-4 border-white border-opacity-50"
                      animate={{
                        scale: phase === 'inhale' ? [1, 1.5, 1] : 
                               phase === 'exhale' ? [1.5, 1, 1] : 1,
                        opacity: phase === 'hold' ? [0.5, 0.8, 0.5] : 1
                      }}
                      transition={{
                        duration: PHASE_DURATIONS[phase] / 1000,
                        repeat: Infinity,
                        ease: phase === 'inhale' ? 'easeIn' : 
                              phase === 'exhale' ? 'easeOut' : 'linear'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Phase Indicator */}
              <div className="text-center">
                <motion.div
                  className={`text-6xl mb-4 ${phaseInfo.color}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {phaseInfo.emoji}
                </motion.div>
                <h3 className={`text-4xl font-bold mb-4 ${phaseInfo.color}`}>
                  {phaseInfo.text}
                </h3>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      phase === 'inhale' ? 'bg-blue-500' :
                      phase === 'hold' ? 'bg-purple-500' :
                      phase === 'exhale' ? 'bg-green-500' :
                      'bg-gray-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">{cycle}</div>
                  <div className="text-sm text-blue-700">Cycles</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600">{score}</div>
                  <div className="text-sm text-purple-700">XP Earned</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">{level}</div>
                  <div className="text-sm text-green-700">Level</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showInstructions && (
          <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={isPlaying ? stopGame : startBreathingCycle}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
            </div>
            <button
              onClick={completeGame}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2 font-semibold"
            >
              <Trophy size={18} />
              Complete & Earn {score + (cycle * 5) + (level * 10)} XP
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

