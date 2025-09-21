import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Loader2 } from 'lucide-react';
import { botpressService } from '../services/botpressService';
import { useStore } from '../hooks/useStore';

interface BotpressChatProps {
  onMessage: (message: string, isFromUser: boolean) => void;
  onSpeaking: (isSpeaking: boolean) => void;
}

interface ChatMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export function BotpressChat({ onMessage, onSpeaking }: BotpressChatProps) {
  const { user, addMessage, messages, isListening, startListening, stopListening, speakText } = useStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    initializeBotpress();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeBotpress = async () => {
    try {
      await botpressService.initialize();
      setIsConnected(true);
      
      // Get initial greeting from Botpress
      const greeting = await botpressService.getInitialGreeting();
      if (greeting && greeting.length > 0) {
        const greetingMessage = greeting[0];
        addMessage({
          id: greetingMessage.id,
          userId: user?.id || 'anonymous',
          content: greetingMessage.text || 'Hello! I\'m Mira, your wellness guide.',
          isFromUser: false,
          timestamp: new Date(),
          emotion: { type: 'welcoming' as const, intensity: 0.8 }
        });
        
        // Speak the greeting
        if (greetingMessage.text) {
          speakMessage(greetingMessage.text);
        }
      }
    } catch (error) {
      console.error('Failed to initialize Botpress:', error);
      setIsConnected(false);
    }
  };

  const speakMessage = (text: string) => {
    if (isMuted || isSpeaking) return;
    
    setIsSpeaking(true);
    onSpeaking(true);
    
    // Stop any current speech
    if (speechSynthesis.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      onSpeaking(false);
    };

    speechSynthesis.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const userMsg = {
      id: `user_${Date.now()}`,
      userId: user?.id || 'anonymous',
      content: userMessage,
      isFromUser: true,
      timestamp: new Date(),
      emotion: { type: 'neutral' as const, intensity: 0.5 }
    };
    
    addMessage(userMsg);
    onMessage(userMessage, true);

    try {
      // Send to Botpress
      const responses = await botpressService.sendMessage(userMessage);
      
      if (responses && responses.length > 0) {
        for (const response of responses) {
          if (response.text) {
            const botMsg = {
              id: response.id,
              userId: user?.id || 'anonymous',
              content: response.text,
              isFromUser: false,
              timestamp: new Date(),
              emotion: { type: 'encouraging' as const, intensity: 0.7 }
            };
            
            addMessage(botMsg);
            onMessage(response.text, false);
            
            // Speak the response
            speakMessage(response.text);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message to Botpress:', error);
      
      // Fallback response
      const fallbackMsg = {
        id: `fallback_${Date.now()}`,
        userId: user?.id || 'anonymous',
        content: "I'm here to listen and support you. How are you feeling today?",
        isFromUser: false,
        timestamp: new Date(),
        emotion: { type: 'encouraging' as const, intensity: 0.6 }
      };
      
      addMessage(fallbackMsg);
      onMessage(fallbackMsg.content, false);
      speakMessage(fallbackMsg.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      onSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Mira - Your Wellness Guide</h3>
              <p className="text-sm text-white/80">
                {isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted ? 'bg-red-500/20 text-red-200' : 'bg-white/20 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            {isSpeaking && (
              <div className="flex items-center space-x-1 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs">Speaking</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isFromUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!message.isFromUser && (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {message.isFromUser && (
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Mira is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {isListening && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Listening... Speak now</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
