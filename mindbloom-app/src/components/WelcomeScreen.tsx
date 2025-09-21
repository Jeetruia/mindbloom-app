import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { User } from '../types';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { setUser } = useStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nickname: '',
    age: '',
    language: 'en'
  });

  const handleSubmit = () => {
    if (formData.nickname && formData.age) {
      const newUser: User = {
        id: Date.now().toString(),
        nickname: formData.nickname,
        age: parseInt(formData.age),
        language: formData.language,
        avatarLevel: 1,
        xp: 0,
        streak: 1,
        createdAt: new Date()
      };
      
      setUser(newUser);
      onComplete();
    }
  };

  const steps = [
    {
      title: "Welcome to MindBloom",
      subtitle: "Your AI-powered mental wellness companion",
      content: (
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Heart className="w-16 h-16 text-primary-500 mx-auto" />
          </motion.div>
          <p className="text-gray-600">
            I'm Mira, your personal wellness guide. I'm here to support you on your mental health journey with empathy, understanding, and evidence-based techniques.
          </p>
        </div>
      )
    },
    {
      title: "Privacy & Safety First",
      subtitle: "Your conversations are secure and anonymous",
      content: (
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Shield className="w-16 h-16 text-wellness-500 mx-auto" />
          </motion.div>
          <div className="space-y-2 text-left">
            <p className="text-gray-600">✓ End-to-end encrypted conversations</p>
            <p className="text-gray-600">✓ No personal data stored</p>
            <p className="text-gray-600">✓ Crisis detection with immediate support</p>
            <p className="text-gray-600">✓ Evidence-based CBT techniques</p>
          </div>
        </div>
      )
    },
    {
      title: "Let's Get Started",
      subtitle: "Tell me a bit about yourself",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What should I call you?
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="Enter your nickname"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-primary-50 to-wellness-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
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
            <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
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
                  index === step ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.nickname || !formData.age}
              className="px-6 py-2 bg-wellness-500 text-white rounded-lg hover:bg-wellness-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start Journey
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
