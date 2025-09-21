import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  TreePine, 
  Flower, 
  Sun, 
  Cloud, 
  Droplets,
  Heart,
  Star,
  Sparkles,
  Users,
  Eye,
  Plus,
  RotateCcw,
  Zap
} from 'lucide-react';

interface Plant {
  id: string;
  type: 'sunflower' | 'lavender' | 'oak' | 'rose' | 'bamboo' | 'cactus' | 'tulip' | 'fern';
  name: string;
  x: number;
  y: number;
  growthStage: 'seed' | 'sprout' | 'young' | 'mature' | 'blooming';
  plantedAt: Date;
  lastWatered: Date;
  xpValue: number;
  message?: string;
  isSpecial: boolean;
}

interface GardenPageProps {
  user: any;
  onBack: () => void;
}

const plantTypes = {
  sunflower: { icon: '🌻', color: 'from-yellow-400 to-orange-500', name: 'Sunflower' },
  lavender: { icon: '💜', color: 'from-purple-400 to-pink-500', name: 'Lavender' },
  oak: { icon: '🌳', color: 'from-green-600 to-green-800', name: 'Oak Tree' },
  rose: { icon: '🌹', color: 'from-red-400 to-pink-500', name: 'Rose' },
  bamboo: { icon: '🎋', color: 'from-green-400 to-green-600', name: 'Bamboo' },
  cactus: { icon: '🌵', color: 'from-green-500 to-yellow-500', name: 'Cactus' },
  tulip: { icon: '🌷', color: 'from-pink-400 to-red-500', name: 'Tulip' },
  fern: { icon: '🌿', color: 'from-green-300 to-green-500', name: 'Fern' }
};

const samplePlants: Plant[] = [
  {
    id: '1',
    type: 'sunflower',
    name: 'Gratitude Sunflower',
    x: 100,
    y: 150,
    growthStage: 'blooming',
    plantedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    lastWatered: new Date(Date.now() - 1000 * 60 * 60 * 2),
    xpValue: 25,
    message: 'Every day I find something to be grateful for',
    isSpecial: false
  },
  {
    id: '2',
    type: 'lavender',
    name: 'Calm Lavender',
    x: 250,
    y: 200,
    growthStage: 'mature',
    plantedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    lastWatered: new Date(Date.now() - 1000 * 60 * 60 * 4),
    xpValue: 20,
    message: 'Breathing exercises help me stay centered',
    isSpecial: false
  },
  {
    id: '3',
    type: 'oak',
    name: 'Resilience Oak',
    x: 400,
    y: 100,
    growthStage: 'young',
    plantedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    lastWatered: new Date(Date.now() - 1000 * 60 * 60 * 1),
    xpValue: 50,
    message: 'I am stronger than I think',
    isSpecial: true
  },
  {
    id: '4',
    type: 'rose',
    name: 'Self-Care Rose',
    x: 150,
    y: 300,
    growthStage: 'sprout',
    plantedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    lastWatered: new Date(Date.now() - 1000 * 60 * 60 * 6),
    xpValue: 15,
    message: 'Taking care of myself is not selfish',
    isSpecial: false
  }
];

export function GardenPage({ user, onBack }: GardenPageProps) {
  const [plants, setPlants] = useState<Plant[]>(samplePlants);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [gardenView, setGardenView] = useState<'personal' | 'community'>('personal');
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'cloudy'>('sunny');
  const [userXP, setUserXP] = useState(150);

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowPlantModal(true);
  };

  const handleWaterPlant = (plantId: string) => {
    setPlants(prev => prev.map(plant => 
      plant.id === plantId 
        ? { 
            ...plant, 
            lastWatered: new Date(),
            growthStage: plant.growthStage === 'seed' ? 'sprout' :
                       plant.growthStage === 'sprout' ? 'young' :
                       plant.growthStage === 'young' ? 'mature' :
                       plant.growthStage === 'mature' ? 'blooming' : plant.growthStage
          }
        : plant
    ));
    setUserXP(prev => prev + 5);
  };

  const getGrowthSize = (stage: string) => {
    switch (stage) {
      case 'seed': return 'w-4 h-4';
      case 'sprout': return 'w-6 h-6';
      case 'young': return 'w-8 h-8';
      case 'mature': return 'w-10 h-10';
      case 'blooming': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };

  const getGrowthAnimation = (stage: string) => {
    if (stage === 'blooming') {
      return {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      };
    }
    return {};
  };

  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'rainy': return '🌧️';
      case 'cloudy': return '☁️';
      default: return '☀️';
    }
  };

  const getWeatherColor = () => {
    switch (weather) {
      case 'sunny': return 'from-yellow-200 to-orange-200';
      case 'rainy': return 'from-blue-200 to-gray-200';
      case 'cloudy': return 'from-gray-200 to-gray-300';
      default: return 'from-yellow-200 to-orange-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Leaf className="w-6 h-6 mr-2 text-green-500" />
                The Growth Sanctuary
              </h1>
              <p className="text-gray-600">Watch your wellness journey bloom</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getWeatherIcon()}</span>
              <span className="text-sm text-gray-600 capitalize">{weather}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Garden XP</div>
              <div className="text-lg font-bold text-green-600">{userXP}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Garden View Toggle */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setGardenView('personal')}
              className={`px-4 py-2 rounded-md transition-colors ${
                gardenView === 'personal'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Garden
            </button>
            <button
              onClick={() => setGardenView('community')}
              className={`px-4 py-2 rounded-md transition-colors ${
                gardenView === 'community'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Community Garden
            </button>
          </div>
        </div>

        {gardenView === 'personal' ? (
          <>
            {/* Personal Garden */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">My Garden Plot</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Garden Canvas */}
              <div className="relative bg-gradient-to-br from-green-100 to-green-200 rounded-xl h-96 overflow-hidden">
                {/* Weather Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getWeatherColor()} opacity-30`}></div>
                
                {/* Plants */}
                {plants.map((plant) => (
                  <motion.div
                    key={plant.id}
                    className="absolute cursor-pointer"
                    style={{ left: plant.x, top: plant.y }}
                    onClick={() => handlePlantClick(plant)}
                    whileHover={{ scale: 1.1 }}
                    animate={getGrowthAnimation(plant.growthStage)}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className={`${getGrowthSize(plant.growthStage)} bg-gradient-to-r ${plantTypes[plant.type].color} rounded-full flex items-center justify-center text-white text-lg shadow-lg`}>
                      {plantTypes[plant.type].icon}
                    </div>
                    {plant.isSpecial && (
                      <div className="absolute -top-2 -right-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Garden Decorations */}
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-brown-500 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-gray-400 rounded-full"></div>
                <div className="absolute top-4 left-1/2 w-4 h-4 bg-blue-300 rounded-full"></div>
              </div>

              {/* Plant Legend */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(plantTypes).map(([type, info]) => (
                  <div key={type} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-lg">{info.icon}</span>
                    <span className="text-sm text-gray-600">{info.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Garden Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{plants.length}</div>
                    <div className="text-sm text-gray-600">Plants Grown</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{plants.filter(p => p.isSpecial).length}</div>
                    <div className="text-sm text-gray-600">Special Plants</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{userXP}</div>
                    <div className="text-sm text-gray-600">Garden XP</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Community Garden */
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Community Garden
            </h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Global Growth</h3>
              <p className="text-gray-600 mb-6">
                See how our community is growing together! Every plant represents someone's wellness journey.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-gray-600">Total Plants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">89</div>
                  <div className="text-sm text-gray-600">Active Gardeners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">23</div>
                  <div className="text-sm text-gray-600">New This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">156</div>
                  <div className="text-sm text-gray-600">Stories Shared</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plant Care Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            Garden Care Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Water Regularly</h4>
                <p className="text-sm text-gray-600">Complete challenges to water your plants and help them grow</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sun className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Sunlight & Positivity</h4>
                <p className="text-sm text-gray-600">Share stories and support others to give your plants energy</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Love & Care</h4>
                <p className="text-sm text-gray-600">Practice self-care to keep your garden healthy and thriving</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Special Plants</h4>
                <p className="text-sm text-gray-600">Complete special challenges to unlock rare and beautiful plants</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Plant Details Modal */}
      <AnimatePresence>
        {showPlantModal && selectedPlant && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${plantTypes[selectedPlant.type].color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                  {plantTypes[selectedPlant.type].icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{selectedPlant.name}</h3>
                <p className="text-sm text-gray-600">{plantTypes[selectedPlant.type].name}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Stage:</span>
                  <span className="font-medium capitalize">{selectedPlant.growthStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Planted:</span>
                  <span className="font-medium">{selectedPlant.plantedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Watered:</span>
                  <span className="font-medium">{selectedPlant.lastWatered.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">XP Value:</span>
                  <span className="font-medium text-green-600">+{selectedPlant.xpValue}</span>
                </div>
              </div>

              {selectedPlant.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700 italic">"{selectedPlant.message}"</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPlantModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleWaterPlant(selectedPlant.id);
                    setShowPlantModal(false);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Droplets className="w-4 h-4" />
                  <span>Water Plant</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
