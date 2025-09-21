import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Users, Heart, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (userData: OnboardingData) => void;
}

interface OnboardingData {
  nickname: string;
  ageBand: string;
  language: string;
  role: 'student' | 'parent' | 'teacher';
  consentGiven: boolean;
  moodCheck: {
    energy: number;
    stress: number;
    connection: number;
  };
}

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<OnboardingData>>({
    nickname: '',
    ageBand: '',
    language: 'en',
    role: 'student',
    consentGiven: false,
    moodCheck: { energy: 0.5, stress: 0.5, connection: 0.5 }
  });

  const steps = [
    {
      title: "Welcome to MindBloom",
      subtitle: "A private place to get stronger — together.",
      component: (props: any) => <WelcomeStep {...props} />
    },
    {
      title: "Tell us about yourself",
      subtitle: "Help us personalize your experience",
      component: (props: any) => <PersonalizationStep {...props} />
    },
    {
      title: "Your privacy matters",
      subtitle: "We keep your data safe and anonymous",
      component: (props: any) => <PrivacyStep {...props} />
    },
    {
      title: "Quick wellness check",
      subtitle: "Optional - helps us personalize your journey",
      component: (props: any) => <MoodCheckStep {...props} />
    },
    {
      title: "You're all set!",
      subtitle: "Let's start your wellness journey together",
      component: (props: any) => <CompletionStep {...props} />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData as OnboardingData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateUserData = (updates: Partial<OnboardingData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Content */}
        <div className="p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentComponent
              userData={userData}
              updateUserData={updateUserData}
              onNext={handleNext}
              onBack={handleBack}
              isFirst={currentStep === 0}
              isLast={currentStep === steps.length - 1}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Heart className="w-12 h-12 text-white" />
      </motion.div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to MindBloom
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        A private place to get stronger — together.
      </p>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3 text-left">
          <Shield className="w-6 h-6 text-green-500" />
          <span className="text-gray-700">Anonymous and secure</span>
        </div>
        <div className="flex items-center space-x-3 text-left">
          <Users className="w-6 h-6 text-blue-500" />
          <span className="text-gray-700">Supportive community</span>
        </div>
        <div className="flex items-center space-x-3 text-left">
          <Heart className="w-6 h-6 text-pink-500" />
          <span className="text-gray-700">AI wellness guide</span>
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// Personalization Step Component
function PersonalizationStep({ userData, updateUserData, onNext, onBack }: any) {
  const ageBands = [
    { value: '13-17', label: '13-17', icon: '🎓' },
    { value: '18-24', label: '18-24', icon: '🎓' },
    { value: '25-34', label: '25-34', icon: '💼' },
    { value: '35-44', label: '35-44', icon: '👨‍👩‍👧‍👦' },
    { value: '45+', label: '45+', icon: '🌟' }
  ];

  const roles = [
    { value: 'student', label: 'Student', icon: '🎓', desc: 'I\'m a student' },
    { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦', desc: 'I\'m a parent' },
    { value: 'teacher', label: 'Teacher', icon: '👩‍🏫', desc: 'I\'m an educator' }
  ];

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about yourself</h2>
      <p className="text-gray-600 mb-8">Help us personalize your experience</p>
      
      <div className="space-y-8">
        {/* Nickname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What should we call you?
          </label>
          <input
            type="text"
            value={userData.nickname || ''}
            onChange={(e) => updateUserData({ nickname: e.target.value })}
            placeholder="Choose a nickname"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Age Band */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Age range
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ageBands.map((band) => (
              <button
                key={band.value}
                onClick={() => updateUserData({ ageBand: band.value })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userData.ageBand === band.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{band.icon}</div>
                <div className="font-medium">{band.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I am a...
          </label>
          <div className="space-y-3">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => updateUserData({ role: role.value })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  userData.role === role.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <div className="font-medium">{role.label}</div>
                    <div className="text-sm text-gray-600">{role.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Language
          </label>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => updateUserData({ language: lang.value })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  userData.language === lang.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!userData.nickname || !userData.ageBand || !userData.role}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Privacy Step Component
function PrivacyStep({ userData, updateUserData, onNext, onBack }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your privacy matters</h2>
      <p className="text-gray-600 mb-8">We keep your data safe and anonymous</p>
      
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-800 mb-3">🔒 No names. No shame. Your data is yours.</h3>
          <ul className="space-y-2 text-green-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <span>We keep identifiers off. Everything you do here can be anonymous.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Your conversations are encrypted and private.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <span>We never share your personal information.</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-3">🆘 Crisis Support</h3>
          <p className="text-blue-700">
            If you're in immediate danger, we may connect you with crisis resources while keeping your identity private.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="consent"
            checked={userData.consentGiven || false}
            onChange={(e) => updateUserData({ consentGiven: e.target.checked })}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            I understand and agree to the privacy policy and terms of service. I consent to anonymous data collection for improving the service.
          </label>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!userData.consentGiven}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          I Agree
        </button>
      </div>
    </div>
  );
}

// Mood Check Step Component
function MoodCheckStep({ userData, updateUserData, onNext, onBack }: any) {
  const [moodData, setMoodData] = useState(userData.moodCheck || { energy: 0.5, stress: 0.5, connection: 0.5 });

  const updateMood = (key: string, value: number) => {
    const newMood = { ...moodData, [key]: value };
    setMoodData(newMood);
    updateUserData({ moodCheck: newMood });
  };

  const getMoodLabel = (value: number) => {
    if (value <= 0.2) return 'Very Low';
    if (value <= 0.4) return 'Low';
    if (value <= 0.6) return 'Moderate';
    if (value <= 0.8) return 'High';
    return 'Very High';
  };

  const getMoodColor = (value: number) => {
    if (value <= 0.2) return 'text-red-500';
    if (value <= 0.4) return 'text-orange-500';
    if (value <= 0.6) return 'text-yellow-500';
    if (value <= 0.8) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick wellness check</h2>
      <p className="text-gray-600 mb-8">Optional - helps us personalize your journey</p>
      
      <div className="space-y-8">
        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How's your energy today?
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={moodData.energy}
              onChange={(e) => updateMood('energy', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Exhausted</span>
              <span className={`font-medium ${getMoodColor(moodData.energy)}`}>
                {getMoodLabel(moodData.energy)}
              </span>
              <span className="text-gray-500">Energized</span>
            </div>
          </div>
        </div>

        {/* Stress Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How stressed do you feel?
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={moodData.stress}
              onChange={(e) => updateMood('stress', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Calm</span>
              <span className={`font-medium ${getMoodColor(moodData.stress)}`}>
                {getMoodLabel(moodData.stress)}
              </span>
              <span className="text-gray-500">Very Stressed</span>
            </div>
          </div>
        </div>

        {/* Connection Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How connected do you feel to others?
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={moodData.connection}
              onChange={(e) => updateMood('connection', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Isolated</span>
              <span className={`font-medium ${getMoodColor(moodData.connection)}`}>
                {getMoodLabel(moodData.connection)}
              </span>
              <span className="text-gray-500">Very Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Completion Step Component
function CompletionStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        You're all set!
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        Let's start your wellness journey together
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <p className="text-blue-800 font-medium">
          "Hello — I'm Mira. You're safe here. Share as little or as much as you like."
        </p>
      </div>
      
      <button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span>Start My Journey</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
