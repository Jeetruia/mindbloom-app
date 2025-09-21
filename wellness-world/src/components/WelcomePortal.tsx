import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { PixelAvatar, AvatarAppearance, MoodState } from '../types';
import { Heart, Shield, Users, Sparkles, Palette, Wand2 } from 'lucide-react';

interface WelcomePortalProps {
  onComplete: () => void;
}

export function WelcomePortal({ onComplete }: WelcomePortalProps) {
  const { createUser, createAvatar } = useStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nickname: '',
    age: '',
    skinTone: '#fdbcb4',
    hairColor: '#8b4513',
    hairStyle: 'straight',
    eyeColor: '#4a90e2',
    clothing: '#4a90e2',
    accessories: [] as string[]
  });

  const skinTones = [
    { name: 'Light', color: '#fdbcb4' },
    { name: 'Medium Light', color: '#e6a085' },
    { name: 'Medium', color: '#d08b5b' },
    { name: 'Medium Dark', color: '#b8651f' },
    { name: 'Dark', color: '#8d4a00' },
    { name: 'Deep', color: '#5d2e00' }
  ];

  const hairColors = [
    { name: 'Black', color: '#2c1810' },
    { name: 'Brown', color: '#8b4513' },
    { name: 'Blonde', color: '#f4e4bc' },
    { name: 'Red', color: '#a0522d' },
    { name: 'Gray', color: '#808080' },
    { name: 'White', color: '#f5f5f5' }
  ];

  const hairStyles = ['straight', 'curly', 'wavy', 'short', 'long'];
  const eyeColors = ['#4a90e2', '#228b22', '#8b4513', '#ff6347', '#9370db', '#ffd700'];
  const clothingColors = ['#4a90e2', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#34495e'];
  const accessories = ['👓', '🎩', '💍', '📿', '🎧', '🕶️'];

  const handleSubmit = () => {
    if (formData.nickname && formData.age) {
      // Create user
      const user = createUser({
        nickname: formData.nickname,
        age: parseInt(formData.age),
        language: 'en'
      });

      // Create avatar
      const avatarAppearance: AvatarAppearance = {
        skinTone: formData.skinTone,
        hairColor: formData.hairColor,
        hairStyle: formData.hairStyle,
        eyeColor: formData.eyeColor,
        clothing: formData.clothing,
        accessories: formData.accessories,
        expression: 'happy'
      };

      const moodState: MoodState = {
        current: 'good',
        energy: 80,
        social: 70,
        emotional: 75,
        lastUpdated: new Date()
      };

      const avatar = createAvatar({
        name: formData.nickname,
        appearance: avatarAppearance,
        mood: moodState
      });

      onComplete();
    }
  };

  const steps = [
    {
      title: "Welcome to WellnessWorld",
      subtitle: "Where mental wellness is celebrated, not hidden",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              A Safe Space for Everyone
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Join a community where mental wellness is normalized, celebrated, and supported. 
              Here, everyone's journey is valued and everyone belongs.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <p className="text-sm text-gray-600">Connect</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Grow</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Privacy & Safety First",
      subtitle: "Your wellbeing is our priority",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Safe & Anonymous
            </h2>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-gray-600">End-to-end encrypted conversations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-gray-600">No personal data collection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-gray-600">Crisis detection & support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-gray-600">Community moderation</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Create Your Avatar",
      subtitle: "Express yourself in our pixel world",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Design Your Pixel Self
            </h2>
            <p className="text-gray-600">
              Create an avatar that represents you in our inclusive community
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Avatar Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Preview</h3>
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">😊</span>
                </div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skin Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.name}
                      onClick={() => setFormData({ ...formData, skinTone: tone.color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.skinTone === tone.color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: tone.color }}
                      title={tone.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hair Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {hairColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setFormData({ ...formData, hairColor: color.color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.hairColor === color.color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.color }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eye Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {eyeColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, eyeColor: color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.eyeColor === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tell Us About Yourself",
      subtitle: "Help us personalize your experience",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Let's Get Started
            </h2>
            <p className="text-gray-600">
              A few quick questions to personalize your wellness journey
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What should we call you?
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="Choose your nickname"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Enter your age"
                min="13"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['great', 'good', 'okay', 'struggling', 'need-support'].map((mood) => (
                  <button
                    key={mood}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {mood.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {currentStep.title}
          </h1>
          <p className="text-gray-600">
            {currentStep.subtitle}
          </p>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep.content}
        </motion.div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === step ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.nickname || !formData.age}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Enter WellnessWorld
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
