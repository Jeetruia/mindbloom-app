import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { Bot } from 'lucide-react';

// Enhanced lip-sync component
function LipSyncMouth({ isSpeaking, text }: { isSpeaking: boolean; text: string }) {
  const [mouthShape, setMouthShape] = useState('closed');

  useEffect(() => {
    if (isSpeaking && text) {
      const interval = setInterval(() => {
        // Analyze text for phoneme-based mouth shapes
        const currentChar = text[Math.floor(Math.random() * text.length)]?.toLowerCase();
        
        if (currentChar) {
          if ('aeiou'.includes(currentChar)) {
            setMouthShape('open'); // Open mouth for vowels
          } else if ('mnpb'.includes(currentChar)) {
            setMouthShape('closed'); // Closed mouth for labials
          } else if ('fv'.includes(currentChar)) {
            setMouthShape('teeth'); // Teeth visible for fricatives
          } else {
            setMouthShape('slight'); // Slight opening for consonants
          }
        }
      }, 150); // Faster updates for more realistic lip-sync

      return () => clearInterval(interval);
    } else {
      setMouthShape('closed');
    }
  }, [isSpeaking, text]);

  const getMouthStyle = () => {
    switch (mouthShape) {
      case 'open':
        return {
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#1a1a1a'
        };
      case 'teeth':
        return {
          height: '6px',
          borderRadius: '25%',
          backgroundColor: '#f5f5f5',
          border: '1px solid #1a1a1a'
        };
      case 'slight':
        return {
          height: '4px',
          borderRadius: '50%',
          backgroundColor: '#1a1a1a'
        };
      default:
        return {
          height: '2px',
          borderRadius: '50%',
          backgroundColor: '#1a1a1a'
        };
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        width: '16px',
        bottom: '20px', // Positioned properly on the face
        left: '50%',
        transform: 'translateX(-50%)',
        ...getMouthStyle()
      }}
      animate={isSpeaking ? {
        scaleY: [1, 1.2, 0.8, 1],
        scaleX: [1, 1.1, 0.9, 1],
      } : {}}
      transition={{ 
        duration: 0.15, 
        repeat: isSpeaking ? Infinity : 0,
        ease: 'easeInOut'
      }}
    />
  );
}

// Simple 2D Avatar Component with enhanced lip-sync
function TherapistAvatar({ isSpeaking, emotion, currentMessage }: { 
  isSpeaking: boolean; 
  emotion: any;
  currentMessage: string;
}) {

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Avatar Face */}
      <motion.div
        className="relative"
        animate={isSpeaking ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
      >
        {/* Head */}
        <div className="w-32 h-32 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full shadow-lg flex items-center justify-center">
          {/* Eyes */}
          <div className="flex space-x-4">
            <motion.div
              className="w-4 h-4 bg-gray-800 rounded-full"
              animate={isSpeaking ? {
                scaleY: [1, 0.3, 1],
              } : {}}
              transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0 }}
            />
            <motion.div
              className="w-4 h-4 bg-gray-800 rounded-full"
              animate={isSpeaking ? {
                scaleY: [1, 0.3, 1],
              } : {}}
              transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0 }}
            />
          </div>
        </div>

        {/* Enhanced Lip-Sync Mouth */}
        <LipSyncMouth isSpeaking={isSpeaking} text={currentMessage} />

        {/* Body */}
        <div className="w-24 h-32 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg mx-auto mt-4 shadow-lg">
          {/* Arms */}
          <div className="flex justify-between px-2 pt-4">
            <motion.div
              className="w-3 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full"
              animate={isSpeaking ? {
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
            />
            <motion.div
              className="w-3 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full"
              animate={isSpeaking ? {
                rotate: [0, -10, 10, 0],
              } : {}}
              transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Name Tag */}
      <motion.div
        className="mt-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-lg font-semibold text-gray-800">Mira</p>
        <p className="text-sm text-gray-600">Your Wellness Guide</p>
      </motion.div>
    </div>
  );
}

// Greeting animation component
function GreetingAnimation() {
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showGreeting) return null;

  return (
    <motion.div
      className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-sm">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-2xl">👋</span>
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Hi, I'm Mira!
          </h3>
          <p className="text-gray-600">
            Your AI wellness companion. I'm here to listen, support, and guide you on your mental health journey.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main Avatar Scene Component
export function AvatarScene({ isSpeaking = false, currentMessage = '' }: { 
  isSpeaking?: boolean; 
  currentMessage?: string; 
}) {
  const { avatarState, user, messages } = useStore();
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      // Delay avatar appearance for smooth entrance
      const timer = setTimeout(() => {
        setShowAvatar(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Get the current AI message for lip-sync (prioritize passed prop)
  const messageForLipSync = currentMessage || (messages.length > 0 
    ? messages[messages.length - 1]?.content || ''
    : '');

  // Use passed isSpeaking prop or fall back to store
  const speaking = isSpeaking || avatarState.isSpeaking;

  if (!user) return null;

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-primary-50 to-wellness-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-wellness-200 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-primary-300 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-wellness-300 rounded-full"></div>
      </div>

      {/* Avatar */}
      {showAvatar && (
        <motion.div
          className="h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <TherapistAvatar 
            isSpeaking={speaking}
            emotion={avatarState.emotion}
            currentMessage={messageForLipSync}
          />
        </motion.div>
      )}

      {/* Greeting */}
      <GreetingAnimation />
      
      {/* Status Indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-gray-700">
              Mira is ready to listen and support you
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
