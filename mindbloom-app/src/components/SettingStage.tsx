/**
 * Setting Stage - Personal Space with virtual garden and customization
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Music, 
  Moon, 
  Sun, 
  Sparkles, 
  Droplet, 
  Flower2,
  Target,
  Volume2,
  VolumeX
} from 'lucide-react';
import { BloomButton } from './ui/BloomButton';
import { useTheme } from '../contexts/ThemeContext';
import { useGamification } from '../contexts/GamificationContext';

interface SettingStageProps {
  user: any;
  onBack: () => void;
}

interface Plant {
  id: string;
  type: 'flower' | 'tree' | 'shrub';
  growth: number; // 0-100
  position: { x: number; y: number };
}

export function SettingStage({ user, onBack }: SettingStageProps) {
  const { mood, setMood, intensity, setIntensity } = useTheme();
  const { xp, level } = useGamification();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedSoundscape, setSelectedSoundscape] = useState('nature');
  const [miraPersonality, setMiraPersonality] = useState<'cheerful' | 'calm' | 'mentor'>('calm');
  const [dailyGoal, setDailyGoal] = useState(15);
  const [isWatering, setIsWatering] = useState(false);
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(true);

  // Initialize garden based on user progress
  useEffect(() => {
    const initialPlants: Plant[] = [];
    for (let i = 0; i < Math.min(level, 10); i++) {
      initialPlants.push({
        id: `plant-${i}`,
        type: i % 3 === 0 ? 'tree' : i % 2 === 0 ? 'flower' : 'shrub',
        growth: Math.min(50 + level * 5, 100),
        position: {
          x: 20 + (i * 15) % 70,
          y: 30 + Math.floor(i / 5) * 30,
        },
      });
    }
    setPlants(initialPlants);
  }, [level]);

  const handleWaterPlant = (plantId: string) => {
    setIsWatering(true);
    setPlants(prev => prev.map(plant => 
      plant.id === plantId 
        ? { ...plant, growth: Math.min(plant.growth + 5, 100) }
        : plant
    ));
    setTimeout(() => setIsWatering(false), 1000);
  };

  const soundscapes = [
    { id: 'nature', label: 'Nature Sounds', icon: '🌿' },
    { id: 'rain', label: 'Rain', icon: '🌧️' },
    { id: 'ocean', label: 'Ocean Waves', icon: '🌊' },
    { id: 'forest', label: 'Forest', icon: '🌲' },
    { id: 'meditation', label: 'Meditation', icon: '🧘' },
  ];

  const personalities = [
    { id: 'cheerful', label: 'Cheerful', emoji: '😊', description: 'Energetic and positive' },
    { id: 'calm', label: 'Calm', emoji: '😌', description: 'Peaceful and soothing' },
    { id: 'mentor', label: 'Mentor', emoji: '🧠', description: 'Wise and supportive' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-peach-50 relative overflow-hidden">
      {/* Floating orbs background */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: `${100 + i * 30}px`,
            height: `${100 + i * 30}px`,
            background: `radial-gradient(circle, rgba(${255 - i * 20}, ${180 - i * 10}, ${200 - i * 20}, 0.4), transparent)`,
            left: `${10 + i * 12}%`,
            top: `${5 + i * 15}%`,
          }}
          animate={{
            x: [0, Math.sin(i) * 50, 0],
            y: [0, Math.cos(i) * 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Flower2 className="w-8 h-8 mr-3 text-pink-500" />
                Your Personal Space
              </h1>
              <p className="text-gray-600 mt-2">Customize your wellness journey</p>
            </div>
            <BloomButton variant="secondary" onClick={onBack}>
              Back
            </BloomButton>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Virtual Garden */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 glass-strong rounded-3xl p-6 shadow-2xl"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Flower2 className="w-6 h-6 mr-2 text-green-500" />
              Virtual Garden
              <span className="ml-2 text-sm font-normal text-gray-600">
                (Level {level})
              </span>
            </h2>
            
            <div className="relative h-96 bg-gradient-to-b from-sky-200/30 to-mint-200/30 rounded-2xl overflow-hidden">
              {plants.map((plant) => (
                <motion.div
                  key={plant.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${plant.position.x}%`,
                    top: `${plant.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWaterPlant(plant.id)}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: plants.indexOf(plant) * 0.3,
                  }}
                >
                  <div className="text-6xl relative">
                    {plant.type === 'flower' && '🌸'}
                    {plant.type === 'tree' && '🌳'}
                    {plant.type === 'shrub' && '🌿'}
                    
                    {/* Growth indicator */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 bg-gray-200 rounded-full h-1">
                      <motion.div
                        className="bg-green-500 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${plant.growth}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Water droplet animation */}
                  <AnimatePresence>
                    {isWatering && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                      >
                        <Droplet className="w-6 h-6 text-blue-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-4 text-center">
              Tap on plants to water them and help them grow! Your garden reflects your progress.
            </p>
          </motion.div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Mood & Intensity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-purple-500" />
                Mood & Ambience
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Current Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white/50 backdrop-blur-sm border-2 border-white/30 focus:border-pink-300 focus:outline-none"
                  >
                    <option value="calm">Calm</option>
                    <option value="happy">Happy</option>
                    <option value="reflective">Reflective</option>
                    <option value="energetic">Energetic</option>
                    <option value="peaceful">Peaceful</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Intensity: {Math.round(intensity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={intensity}
                    onChange={(e) => setIntensity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Soundscape */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-strong rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Music className="w-5 h-5 mr-2 text-blue-500" />
                  Ambient Sound
                </h3>
                <button
                  onClick={() => setAmbientSoundEnabled(!ambientSoundEnabled)}
                  className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  {ambientSoundEnabled ? (
                    <Volume2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {soundscapes.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => setSelectedSoundscape(sound.id)}
                    className={`p-3 rounded-lg transition-all ${
                      selectedSoundscape === sound.id
                        ? 'bg-gradient-to-r from-pink-400 to-peach-400 text-white shadow-lg'
                        : 'bg-white/50 backdrop-blur-sm hover:bg-white/70'
                    }`}
                  >
                    <div className="text-2xl mb-1">{sound.icon}</div>
                    <div className="text-xs">{sound.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Mira Personality */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                Mira's Personality
              </h3>
              
              <div className="space-y-3">
                {personalities.map((personality) => (
                  <button
                    key={personality.id}
                    onClick={() => setMiraPersonality(personality.id as any)}
                    className={`w-full p-4 rounded-lg transition-all text-left ${
                      miraPersonality === personality.id
                        ? 'bg-gradient-to-r from-lavender-400 to-pink-400 text-white shadow-lg'
                        : 'bg-white/50 backdrop-blur-sm hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{personality.emoji}</span>
                      <div>
                        <div className="font-semibold">{personality.label}</div>
                        <div className={`text-xs ${miraPersonality === personality.id ? 'text-white/90' : 'text-gray-600'}`}>
                          {personality.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Daily Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-strong rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Daily Reflection Goal
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Minutes per day: {dailyGoal}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 min</span>
                    <span>60 min</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

