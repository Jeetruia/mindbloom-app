/**
 * Enhanced Chat with Mira - Serene, glowing space bubble interface
 * With mood detection, voice chat, and emotion reflection games
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, Camera, Smile } from 'lucide-react';
import { AIAvatar } from './ui/AIAvatar';
import { BloomButton } from './ui/BloomButton';
import { MoodBackground } from './ui/MoodBackground';
import { XPToast } from './ui/XPToast';
import { useTheme } from '../contexts/ThemeContext';
import { useGamification } from '../contexts/GamificationContext';
import { therapyService } from '../services/therapyService';
import { hybridSTTService } from '../services/googleCloudSpeechService';
import { hybridTTSService } from '../services/googleCloudTTSService';
import { googleCloudLanguageService } from '../services/googleCloudLanguageService';

interface Message {
  id: string;
  text: string;
  isFromUser: boolean;
  timestamp: Date;
  emotion?: string;
}

export function EnhancedMiraChat({ user }: { user: any }) {
  const { mood, setMood } = useTheme();
  const { addXP } = useGamification();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMoodMirror, setShowMoodMirror] = useState(false);
  const [showBreathingSync, setShowBreathingSync] = useState(false);
  const [xpToast, setXpToast] = useState<{ show: boolean; xp: number }>({ show: false, xp: 0 });
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize with greeting
    const greeting = "Hello! I'm Mira, your AI wellness companion. How are you feeling today?";
    setMessages([{ id: '1', text: greeting, isFromUser: false, timestamp: new Date() }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      isFromUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Analyze emotion from user input
    try {
      const emotion = await googleCloudLanguageService.analyzeEmotionalTone(inputText);
      setDetectedEmotion(emotion.primaryEmotion);
      
      // Update mood based on emotion
      if (emotion.primaryEmotion.includes('happy') || emotion.primaryEmotion.includes('joy')) {
        setMood('happy');
      } else if (emotion.primaryEmotion.includes('calm') || emotion.primaryEmotion.includes('peace')) {
        setMood('calm');
      } else if (emotion.primaryEmotion.includes('thoughtful') || emotion.primaryEmotion.includes('reflective')) {
        setMood('reflective');
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    }

    // Get Mira's response
    try {
      const response = await therapyService.generateTherapeuticResponse(user?.id || 'user', inputText);
      const miraMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isFromUser: false,
        timestamp: new Date(),
        emotion: response.emotion?.detected,
      };
      setMessages(prev => [...prev, miraMsg]);

      // Award XP
      await addXP({
        id: Date.now().toString(),
        type: 'chat',
        xp: 10,
        description: 'Chat with Mira',
        timestamp: new Date(),
      });
      setXpToast({ show: true, xp: 10 });
      setTimeout(() => setXpToast({ show: false, xp: 0 }), 2000);
    } catch (error) {
      console.error('Error getting response:', error);
    }
  };

  const handleVoiceInput = async () => {
    setIsListening(true);
    try {
      const transcript = await hybridSTTService.startListening();
      setInputText(transcript);
      setIsListening(false);
      
      // Auto-send after voice input
      setTimeout(() => {
        setInputText(transcript);
        handleSend();
      }, 500);
    } catch (error) {
      console.error('Error with voice input:', error);
      setIsListening(false);
    }
  };

  const handleMoodMirror = async () => {
    setShowMoodMirror(true);
    
    // Access camera for emotion detection
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Simulate emotion detection (in production, use Google Cloud Vision API)
        setTimeout(() => {
          const emotions = ['happy', 'calm', 'thoughtful', 'energetic'];
          const detected = emotions[Math.floor(Math.random() * emotions.length)];
          setDetectedEmotion(detected);
          setMood(detected as any);
          
          const affirmation = `You're showing signs of ${detected} energy. That's wonderful! Remember to breathe deeply and appreciate this moment.`;
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: affirmation,
            isFromUser: false,
            timestamp: new Date(),
          }]);
          
          addXP({
            id: Date.now().toString(),
            type: 'game',
            xp: 15,
            description: 'Mood Mirror',
            timestamp: new Date(),
          });
          setXpToast({ show: true, xp: 15 });
          
          setTimeout(() => setShowMoodMirror(false), 3000);
        }, 2000);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setShowMoodMirror(false);
      }
    }
  };

  const handleBreathingSync = () => {
    setShowBreathingSync(true);
  };

  return (
    <MoodBackground mood={mood}>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <AIAvatar mood={mood} size="lg" isSpeaking={isSpeaking} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Chat with Mira</h1>
                <p className="text-gray-600">Your AI wellness companion</p>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="flex space-x-2">
              <BloomButton
                variant="secondary"
                size="sm"
                onClick={handleMoodMirror}
                icon={<Camera className="w-4 h-4" />}
              >
                Mood Mirror
              </BloomButton>
              <BloomButton
                variant="mint"
                size="sm"
                onClick={handleBreathingSync}
                icon={<Heart className="w-4 h-4" />}
              >
                Breathing
              </BloomButton>
            </div>
          </motion.div>

          {/* Chat container - Glass bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-3xl p-6 shadow-2xl mb-6 h-[600px] flex flex-col"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[75%] rounded-2xl p-4 shadow-lg
                        ${
                          msg.isFromUser
                            ? 'bg-gradient-to-r from-pink-400 to-peach-400 text-white'
                            : 'bg-white/90 backdrop-blur-sm text-gray-800'
                        }
                      `}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      {msg.emotion && (
                        <div className="mt-2 text-xs opacity-70">
                          💫 {msg.emotion}
                        </div>
                      )}
                      
                      {/* Bloom particles */}
                      {!msg.isFromUser && (
                        <motion.div
                          className="absolute -top-2 -right-2"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                        >
                          <Sparkles className="w-4 h-4 text-pink-400" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Share what's on your mind..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-white/30 focus:border-pink-300 focus:outline-none transition-all text-gray-800"
                />
              </div>
              
              <BloomButton
                variant="primary"
                size="md"
                onClick={handleVoiceInput}
                icon={isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              >
                {isListening ? 'Stop' : 'Voice'}
              </BloomButton>
              
              <BloomButton
                variant="primary"
                size="md"
                onClick={handleSend}
                icon={<Send className="w-4 h-4" />}
              >
                Send
              </BloomButton>
            </div>
          </motion.div>

          {/* Detected emotion indicator */}
          {detectedEmotion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 mb-4 text-center"
            >
              <p className="text-sm text-gray-700">
                Detected emotion: <span className="font-semibold text-pink-600">{detectedEmotion}</span>
              </p>
            </motion.div>
          )}
        </div>

        {/* Mood Mirror Modal */}
        <AnimatePresence>
          {showMoodMirror && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-md w-full glass-strong"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-xl font-bold mb-4 text-center">Mood Mirror</h3>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full rounded-2xl mb-4"
                />
                <p className="text-center text-gray-600">Looking into your eyes...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breathing Sync Modal */}
        <AnimatePresence>
          {showBreathingSync && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center glass-strong"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-xl font-bold mb-4">Breathing Sync</h3>
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-sky-400 to-mint-400 mb-4"
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <p className="text-gray-700 mb-4">Breathe in... and out...</p>
                <BloomButton onClick={() => setShowBreathingSync(false)}>
                  Done
                </BloomButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XP Toast */}
        <XPToast
          xp={xpToast.xp}
          show={xpToast.show}
          onComplete={() => setXpToast({ show: false, xp: 0 })}
          position={{ x: 50, y: 80 }}
        />
      </div>
    </MoodBackground>
  );
}

