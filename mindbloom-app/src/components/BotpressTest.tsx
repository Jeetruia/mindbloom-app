import React, { useState, useEffect } from 'react';
import { botpressService } from '../services/botpressService';

export function BotpressTest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    // Check connection status
    const checkConnection = () => {
      setIsConnected(botpressService.isServiceConnected());
      setConversationId(botpressService.getConversationId());
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const testBotpress = async () => {
    setIsLoading(true);
    try {
      const messages = await botpressService.sendMessage(message);
      if (messages.length > 0) {
        setResponse(messages[0].text || 'No response');
      }
    } catch (error) {
      setResponse('Error: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const testGreeting = async () => {
    setIsLoading(true);
    try {
      const messages = await botpressService.getInitialGreeting();
      if (messages.length > 0) {
        setResponse(messages[0].text || 'No greeting');
      }
    } catch (error) {
      setResponse('Error: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeBotpress = async () => {
    setIsLoading(true);
    try {
      await botpressService.initialize();
      setResponse('Botpress initialization completed');
    } catch (error) {
      setResponse('Error initializing Botpress: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Botpress Integration Test</h3>
      
      {/* Connection Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Connected to Botpress (Real API)' : 'Not connected to Botpress'}
          </span>
        </div>
        {conversationId && (
          <p className="text-xs text-gray-600 mt-1">Conversation ID: {conversationId}</p>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Message:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message to test..."
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        
        <div className="flex space-x-2 flex-wrap">
          <button
            onClick={initializeBotpress}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Initializing...' : 'Initialize Botpress'}
          </button>
          
          <button
            onClick={testBotpress}
            disabled={isLoading || !message}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Message'}
          </button>
          
          <button
            onClick={testGreeting}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Greeting'}
          </button>
        </div>
        
        {response && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <strong>Response:</strong> {response}
          </div>
        )}
      </div>
    </div>
  );
}
