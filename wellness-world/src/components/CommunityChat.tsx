import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { CommunityMessage, ConversationPrompt } from '../types';
import { Send, Heart, Lightbulb, Rainbow, Sunshine, Butterfly, Smile, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function CommunityChat() {
  const { 
    communityMessages, 
    sendCommunityMessage, 
    addReaction,
    currentSpace,
    conversationPrompts 
  } = useStore();
  
  const [inputValue, setInputValue] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<ConversationPrompt | null>(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [communityMessages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && currentSpace) {
      try {
        await sendCommunityMessage({
          content: inputValue.trim(),
          type: 'text',
          spaceId: currentSpace.id,
          isAnonymous: true
        });
        setInputValue('');
        toast.success('Message sent! 💬');
      } catch (error) {
        toast.error('Failed to send message');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = async (messageId: string, reactionType: string) => {
    try {
      await addReaction(messageId, reactionType);
      toast.success('Reaction added! ✨');
    } catch (error) {
      toast.error('Failed to add reaction');
    }
  };

  const handlePromptSelect = (prompt: ConversationPrompt) => {
    setSelectedPrompt(prompt);
    setInputValue(prompt.question);
    setShowPrompts(false);
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'heart': return <Heart className="w-3 h-3" />;
      case 'lightbulb': return <Lightbulb className="w-3 h-3" />;
      case 'rainbow': return <Rainbow className="w-3 h-3" />;
      case 'sunshine': return <Sunshine className="w-3 h-3" />;
      case 'butterfly': return <Butterfly className="w-3 h-3" />;
      default: return <Heart className="w-3 h-3" />;
    }
  };

  const getReactionColor = (type: string) => {
    switch (type) {
      case 'heart': return 'text-red-500';
      case 'lightbulb': return 'text-yellow-500';
      case 'rainbow': return 'text-purple-500';
      case 'sunshine': return 'text-orange-500';
      case 'butterfly': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Community Chat</h2>
        {currentSpace && (
          <span className="text-sm text-gray-500">in {currentSpace.name}</span>
        )}
      </div>

      {/* Conversation Prompts */}
      <AnimatePresence>
        {showPrompts && conversationPrompts.length > 0 && (
          <motion.div
            className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Conversation Starters</span>
            </div>
            <div className="space-y-2">
              {conversationPrompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handlePromptSelect(prompt)}
                  className="w-full text-left p-2 bg-white/80 rounded-lg hover:bg-white transition-colors text-sm text-gray-700"
                >
                  {prompt.question}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPrompts(false)}
              className="text-xs text-gray-500 hover:text-gray-700 mt-2"
            >
              Hide prompts
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="h-64 overflow-y-auto space-y-3 mb-4">
        <AnimatePresence>
          {communityMessages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.isAnonymous ? 'justify-start' : 'justify-end'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                message.isAnonymous
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-500 text-white'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${
                    message.isAnonymous ? 'text-gray-500' : 'text-blue-100'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                  
                  {/* Reactions */}
                  <div className="flex items-center space-x-1">
                    {message.reactions.map((reaction, index) => (
                      <span
                        key={index}
                        className={`${getReactionColor(reaction.type)}`}
                        title={`${reaction.type} reaction`}
                      >
                        {getReactionIcon(reaction.type)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs text-gray-500">Quick reactions:</span>
        {['heart', 'lightbulb', 'rainbow', 'sunshine', 'butterfly'].map((reactionType) => (
          <button
            key={reactionType}
            onClick={() => {
              // Add reaction to latest message or create a reaction-only message
              const latestMessage = communityMessages[communityMessages.length - 1];
              if (latestMessage) {
                handleReaction(latestMessage.id, reactionType);
              }
            }}
            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${getReactionColor(reactionType)}`}
            title={`Add ${reactionType} reaction`}
          >
            {getReactionIcon(reactionType)}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share something with the community..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {selectedPrompt && (
            <div className="absolute -top-8 left-0 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              Using prompt: {selectedPrompt.category}
            </div>
          )}
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Community Guidelines */}
      <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2">
          <Smile className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-700 font-medium">Community Guidelines</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Be kind, supportive, and respectful. This is a safe space for everyone to share and grow together.
        </p>
      </div>
    </div>
  );
}
