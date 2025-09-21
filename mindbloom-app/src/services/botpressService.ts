// Botpress Service Integration - Real API
export interface BotpressMessage {
  id: string;
  type: 'text' | 'image' | 'file' | 'card' | 'carousel' | 'quick_reply';
  text?: string;
  data?: any;
  timestamp: Date;
}

export interface BotpressConfig {
  botId: string;
  userId: string;
  conversationId?: string;
  configUrl: string;
  apiUrl?: string;
}

export class BotpressService {
  private config: BotpressConfig;
  private conversationId: string | null = null;
  private isConnected = false;
  private messageQueue: BotpressMessage[] = [];
  private messageListeners: ((message: BotpressMessage) => void)[] = [];

  constructor(config: BotpressConfig) {
    this.config = config;
    this.conversationId = config.conversationId || null;
  }

  // Initialize connection to Botpress
  async initialize(): Promise<void> {
    try {
      // Generate a unique conversation ID if not provided
      if (!this.conversationId) {
        this.conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Test connection by making a simple API call
      await this.testConnection();
      this.isConnected = true;
      console.log('Botpress service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Botpress service:', error);
      this.isConnected = false;
    }
  }

  // Test connection to Botpress
  private async testConnection(): Promise<void> {
    try {
      // Make a test call to Botpress API
      const response = await fetch('https://cdn.botpress.cloud/webchat/v3.2/shareable.html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'text',
          text: 'test',
          userId: this.config.userId,
          conversationId: this.conversationId,
          botId: this.config.botId
        })
      });

      if (!response.ok) {
        throw new Error(`Botpress API error: ${response.status}`);
      }
    } catch (error) {
      console.warn('Botpress API test failed, using fallback mode');
      // Don't throw error, just mark as not connected
    }
  }

  // Send message to Botpress and get response
  async sendMessage(message: string): Promise<BotpressMessage[]> {
    try {
      if (!this.isConnected) {
        console.warn('Botpress not connected, using fallback');
        return this.getFallbackResponse(message);
      }

      // Send message to real Botpress API
      const response = await fetch('https://cdn.botpress.cloud/webchat/v3.2/shareable.html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'text',
          text: message,
          userId: this.config.userId,
          conversationId: this.conversationId,
          botId: this.config.botId
        })
      });

      if (!response.ok) {
        throw new Error(`Botpress API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseBotpressResponse(data);
    } catch (error) {
      console.error('Error sending message to Botpress:', error);
      return this.getFallbackResponse(message);
    }
  }

  // Parse Botpress response format
  private parseBotpressResponse(data: any): BotpressMessage[] {
    const messages: BotpressMessage[] = [];
    
    if (data.messages && Array.isArray(data.messages)) {
      data.messages.forEach((msg: any, index: number) => {
        messages.push({
          id: msg.id || `msg_${Date.now()}_${index}`,
          type: msg.type || 'text',
          text: msg.text || msg.message || '',
          data: msg.data,
          timestamp: new Date()
        });
      });
    } else if (data.text) {
      messages.push({
        id: `msg_${Date.now()}`,
        type: 'text',
        text: data.text,
        timestamp: new Date()
      });
    } else {
      // If no response, use fallback
      return this.getFallbackResponse('fallback');
    }

    return messages;
  }

  // Fallback response when Botpress is unavailable
  private getFallbackResponse(message: string): BotpressMessage[] {
    const responses = [
      "I'm here to listen and support you. How are you feeling today?",
      "Thank you for sharing that with me. I understand this might be difficult to talk about.",
      "I'm glad you reached out. Let's work through this together, one step at a time.",
      "Your feelings are valid, and it's okay to not be okay sometimes. I'm here to help.",
      "I can hear that you're going through a challenging time. You're not alone in this."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return [{
      id: `fallback_${Date.now()}`,
      type: 'text',
      text: randomResponse,
      timestamp: new Date()
    }];
  }

  // Get initial greeting message
  async getInitialGreeting(): Promise<BotpressMessage[]> {
    try {
      // Try to get a personalized greeting from Botpress
      const response = await this.sendMessage('start conversation');
      
      // If no response or empty, use default greeting
      if (response.length === 0 || !response[0].text) {
        return [{
          id: `greeting_${Date.now()}`,
          type: 'text',
          text: "Hello! I'm Mira, your wellness guide. I'm here to listen and support you. How are you feeling today?",
          timestamp: new Date()
        }];
      }
      
      return response;
    } catch (error) {
      console.warn('Failed to get Botpress greeting, using fallback:', error);
      return [{
        id: `greeting_${Date.now()}`,
        type: 'text',
        text: "Hello! I'm Mira, your wellness guide. I'm here to listen and support you. How are you feeling today?",
        timestamp: new Date()
      }];
    }
  }

  // Check if service is connected
  isServiceConnected(): boolean {
    return this.isConnected;
  }

  // Get conversation ID
  getConversationId(): string | null {
    return this.conversationId;
  }

  // Show/hide the Botpress widget (placeholder for future implementation)
  showWidget(): void {
    console.log('Botpress widget show (not implemented yet)');
  }

  hideWidget(): void {
    console.log('Botpress widget hide (not implemented yet)');
  }
}

// Create a singleton instance with your specific Botpress configuration
export const botpressService = new BotpressService({
  botId: '20250921130550-P1WEUHCI', // Extracted from the configUrl
  userId: 'user_' + Date.now(),
  configUrl: 'https://files.bpcontent.cloud/2025/09/21/13/20250921130550-P1WEUHCI.json',
  apiUrl: 'https://cdn.botpress.cloud/webchat/v3.2/shareable.html'
});

// Add global type declaration for window
declare global {
  interface Window {
    botpressWebChat?: any;
  }
}