import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Loader2, Brain, Heart, Sparkles, FileText, Save, TrendingUp } from 'lucide-react';
import { therapyService } from '../services/therapyService';
import { hybridSTTService } from '../services/googleCloudSpeechService';
import { hybridTTSService } from '../services/googleCloudTTSService';
import { TTSService, STTService } from '../services/speechServiceSimple';
import { useStore } from '../hooks/useStore';
import { xpService } from '../services/xpService';
import { languageService } from '../services/languageService';

interface EnhancedTherapyChatProps {
  onMessage?: (message: string, isFromUser: boolean) => void;
  onSpeaking?: (isSpeaking: boolean) => void;
}

interface TherapyMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  emotion?: {
    type: string;
    intensity: number;
  };
  technique?: string;
  suggestedActivity?: string;
}

export function EnhancedTherapyChat({ onMessage, onSpeaking }: EnhancedTherapyChatProps) {
  const { user, setUser } = useStore();
  const [messages, setMessages] = useState<TherapyMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    messages: 0,
    techniques: new Set<string>(),
    emotions: [] as Array<{ type: string; intensity: number }>,
    moodTrend: [] as Array<number>,
  });
  const [showSessionNotes, setShowSessionNotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionStartRef = useRef<Date>(new Date());
  const speechSynthesis = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    initializeChat();
    initializeSpeechServices();
    
    // Update session duration
    const interval = setInterval(() => {
      if (sessionId) {
        const duration = Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000 / 60);
        setSessionStats(prev => ({ ...prev, duration }));
      }
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
      endSession();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newSessionId = `session-${Date.now()}`;
      setSessionId(newSessionId);
      sessionStartRef.current = new Date();

      // Use vertexAI service for initial greeting (better prompt)
      const { vertexAIService } = await import('../services/vertexAIService');
      const greetingText = await vertexAIService.getInitialGreeting();

      const greeting: TherapyMessage = {
        id: Date.now().toString(),
        content: greetingText,
        isFromUser: false,
        timestamp: new Date(),
      };

      setMessages([greeting]);
      // Don't speak automatically on initialization - let user choose to enable voice
      // speakMessage(greetingText);
    } catch (error) {
      console.error('Error initializing therapy chat:', error);
      const fallback: TherapyMessage = {
        id: Date.now().toString(),
        content: "Hello! I'm Mira, your therapist. I'm here to provide a safe and supportive space for you to explore your thoughts and feelings. What would you like to talk about today?",
        isFromUser: false,
        timestamp: new Date(),
      };
      setMessages([fallback]);
      // Don't speak automatically on initialization
      // speakMessage(fallback.content);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSpeechServices = () => {
    // Initialize language service
    const userLang = user?.language || languageService.initializeLanguage();
    languageService.setCurrentLanguage(userLang);
    
    // Update TTS language
    hybridTTSService.setLanguage(userLang);
    
    // Update STT language
    const langConfig = languageService.getLanguageConfig(userLang);
    hybridSTTService.setLanguage(langConfig.sttLanguageCode);
    
    const browserTTS = new TTSService();
    const browserSTT = new STTService();
    hybridTTSService.setBrowserService(browserTTS);
    hybridSTTService.setBrowserService(browserSTT);
  };

  const speakMessage = async (text: string) => {
    if (isMuted || isSpeaking) return;

    setIsSpeaking(true);
    if (onSpeaking) onSpeaking(true);

    try {
      await hybridTTSService.speak(text, {
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
      });
    } catch (error) {
      console.error('Error speaking message:', error);
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onSpeaking) onSpeaking(false);
      };
      speechSynthesis.current = utterance;
      window.speechSynthesis.speak(utterance);
    } finally {
      setIsSpeaking(false);
      if (onSpeaking) onSpeaking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user || !sessionId) return;

    const userMsg: TherapyMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      isFromUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setSessionStats(prev => ({
      ...prev,
      messages: prev.messages + 1,
    }));

    if (onMessage) {
      onMessage(userMsg.content, true);
    }

    try {
      // Get therapeutic response
      const response = await therapyService.generateTherapeuticResponse(
        user.id,
        userMsg.content,
        sessionId
      );

      // Update session stats
      setSessionStats(prev => {
        const newTechniques = new Set(prev.techniques);
        if (response.technique) {
          newTechniques.add(response.technique);
        }
        
        const emotionData = response.emotion 
          ? { type: response.emotion.detected, intensity: response.emotion.intensity }
          : { type: 'neutral', intensity: 0.5 };
        
        return {
          ...prev,
          techniques: newTechniques,
          emotions: [...prev.emotions, emotionData],
          moodTrend: [...prev.moodTrend, emotionData.intensity],
        };
      });

      const emotionData = response.emotion 
        ? { type: response.emotion.detected, intensity: response.emotion.intensity }
        : undefined;

      const therapistMsg: TherapyMessage = {
        id: `therapist-${Date.now()}`,
        content: response.message,
        isFromUser: false,
        timestamp: new Date(),
        emotion: emotionData,
        technique: response.technique,
        suggestedActivity: response.suggestedActivity,
      };

      setMessages(prev => [...prev, therapistMsg]);
      
      if (onMessage) {
        onMessage(therapistMsg.content, false);
      }

      // Speak the response
      await speakMessage(therapistMsg.content);

      // Award XP for conversation
      if (messages.length > 0 && messages.length % 5 === 0) {
        const result = await xpService.addXP(user.id, user.xp || 0, {
          id: `chat-xp-${Date.now()}`,
          type: 'chat',
          xp: 5,
          description: 'Meaningful conversation milestone',
        });

        if (setUser) {
          setUser({
            ...user,
            xp: result.newXP,
            avatarLevel: result.newLevel,
          });
        }
      }
    } catch (error: any) {
      console.error('Error getting therapeutic response:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      });
      
      // More helpful error message that shows the actual issue
      const errorMsg: TherapyMessage = {
        id: `error-${Date.now()}`,
        content: error?.message?.includes('No Google Cloud configuration') 
          ? "I'm having trouble connecting to Google Cloud services. Please check your configuration. However, I'm still here to support you - could you tell me more about what's on your mind?"
          : error?.message?.includes('proxy') || error?.message?.includes('fetch')
          ? "I'm having trouble connecting right now. Please check that the proxy server is running on port 5001. But I'm still here - what would you like to talk about?"
          : `I'm experiencing a technical issue: ${error?.message || 'Unknown error'}. Let's continue our conversation - what's on your mind?`,
        isFromUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      await speakMessage(errorMsg.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      setIsListening(false);
      hybridSTTService.stopListening();
    } else {
      setIsListening(true);
      try {
        const transcript = await hybridSTTService.startListening();
        if (transcript) {
          setInputMessage(transcript);
          setIsListening(false);
        }
      } catch (error) {
        console.error('Error with voice input:', error);
        setIsListening(false);
      }
    }
  };

  const endSession = async () => {
    if (sessionId && user) {
      await therapyService.endSession(user.id, sessionId);
    }
  };

  const saveSession = async () => {
    if (sessionId && user) {
      try {
        const { xpEarned } = await therapyService.saveSession(user.id, sessionId);
        
        // Award XP for session
        const result = await xpService.addXP(user.id, user.xp || 0, {
          id: `therapy-session-${sessionId}`,
          type: 'chat',
          xp: xpEarned,
          description: `Therapy session (${sessionStats.messages} messages)`,
          metadata: {
            sessionId,
            duration: sessionStats.duration,
            techniques: Array.from(sessionStats.techniques),
          },
        });

        // Update user XP
        if (setUser) {
          setUser({
            ...user,
            xp: result.newXP,
            avatarLevel: result.newLevel,
          });
        }
        
        // Show confirmation
        alert(`Session saved successfully! Earned ${xpEarned} XP.`);
      } catch (error) {
        console.error('Error saving session:', error);
        alert('Error saving session. Please try again.');
      }
    }
  };

  const getTechniqueIcon = (technique?: string) => {
    switch (technique) {
      case 'cbt': return '🧠';
      case 'dbt': return '💚';
      case 'act': return '🎯';
      case 'mindfulness': return '🧘';
      case 'validation': return '💝';
      case 'reframing': return '🔄';
      default: return '💬';
    }
  };

  const getTechniqueLabel = (technique?: string) => {
    switch (technique) {
      case 'cbt': return 'CBT';
      case 'dbt': return 'DBT';
      case 'act': return 'ACT';
      case 'mindfulness': return 'Mindfulness';
      case 'validation': return 'Validation';
      case 'reframing': return 'Reframing';
      default: return 'Exploration';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (onSpeaking) onSpeaking(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Mira - Your Therapist</h3>
              <p className="text-sm text-white/80">
                Licensed Therapist • CBT • DBT • ACT
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={saveSession}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              title="Save Session"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted ? 'bg-red-500/20 text-red-200' : 'bg-white/20 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Session Stats */}
        <div className="flex items-center gap-4 text-xs text-white/80 mt-2">
          <span>⏱️ {sessionStats.duration} min</span>
          <span>💬 {sessionStats.messages} messages</span>
          <span>🎯 {sessionStats.techniques.size} techniques</span>
          {sessionStats.moodTrend.length > 0 && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {(sessionStats.moodTrend.reduce((a, b) => a + b, 0) / sessionStats.moodTrend.length * 100).toFixed(0)}% positive
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-purple-50/30">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 ${message.isFromUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!message.isFromUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`max-w-xs lg:max-w-md rounded-2xl p-3 ${
                  message.isFromUser
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.technique && !message.isFromUser && (
                      <div className="flex-shrink-0 ml-2" title={getTechniqueLabel(message.technique)}>
                        <span className="text-lg">{getTechniqueIcon(message.technique)}</span>
                      </div>
                    )}
                  </div>
                  
                  {message.suggestedActivity && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-600"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Suggested: {message.suggestedActivity === 'breathing-dragon' ? '🐉 Breathing Exercise' :
                                        message.suggestedActivity === 'gratitude-hunt' ? '🙏 Gratitude Journal' :
                                        message.suggestedActivity === 'mindfulness' ? '🧘 Mindfulness' : message.suggestedActivity}</span>
                    </motion.div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {message.isFromUser && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-gray-500"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Mira is thinking...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Share what's on your mind..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleVoiceInput}
              className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>💬 {sessionStats.messages} messages in this session</span>
        </div>
      </div>
    </div>
  );
}

