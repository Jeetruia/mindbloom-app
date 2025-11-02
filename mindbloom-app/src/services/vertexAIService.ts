/**
 * Vertex AI Service - Enhanced Gemini AI with Google Cloud
 * 
 * This service uses Vertex AI instead of the free Gemini API for:
 * - Higher rate limits
 * - Better performance
 * - Usage tracking
 * - Advanced features
 */

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface VertexAIResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
    finishReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

class VertexAIService {
  private projectId: string;
  private location: string;
  private modelName: string;
  private proxyUrl: string | null;
  private fallbackApiKey: string | null;

  constructor() {
    this.projectId = process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID || '';
    this.location = process.env.REACT_APP_GEMINI_LOCATION || 'us-central1';
    this.modelName = process.env.REACT_APP_GEMINI_MODEL || 'gemini-1.5-flash';
    this.proxyUrl = process.env.REACT_APP_GOOGLE_CLOUD_PROXY_URL || null;
    this.fallbackApiKey = process.env.REACT_APP_GEMINI_API_KEY || null;
  }

  /**
   * Generate response using Vertex AI or fallback to free API
   */
  async generateResponse(messages: GeminiMessage[]): Promise<string> {
    // Try Vertex AI first if proxy is configured
    if (this.proxyUrl) {
      try {
        return await this.generateViaProxy(messages);
      } catch (error) {
        console.warn('Vertex AI proxy failed, falling back to free API:', error);
        if (this.fallbackApiKey) {
          return await this.generateViaFreeAPI(messages);
        }
        throw error;
      }
    }

    // Fallback to free API if proxy not configured
    if (this.fallbackApiKey) {
      return await this.generateViaFreeAPI(messages);
    }

    throw new Error('No Google Cloud configuration found. Please set up either Vertex AI proxy or Gemini API key.');
  }

  /**
   * Generate via server-side proxy (secure, recommended for production)
   */
  private async generateViaProxy(messages: GeminiMessage[]): Promise<string> {
    if (!this.proxyUrl) {
      throw new Error('Proxy URL not configured');
    }

    const response = await fetch(`${this.proxyUrl}/api/google-cloud/vertex-ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId: this.projectId,
        location: this.location,
        model: this.modelName,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      const errorMessage = error.message || error.error || 'Unknown error';
      console.error('Vertex AI proxy error:', response.status, errorMessage);
      
      // If it's a configuration error, provide helpful message
      if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
        throw new Error(`Google Cloud API key not configured on server. Please set GEMINI_API_KEY in server-proxy/.env file. Error: ${errorMessage}`);
      }
      
      throw new Error(`Vertex AI proxy error: ${response.status} - ${errorMessage}`);
    }

    const data: VertexAIResponse = await response.json();
    
    console.log('Vertex AI proxy response data:', JSON.stringify(data).substring(0, 300));
    
    // Handle Gemini API response format
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content?.parts?.[0]?.text) {
        return candidate.content.parts[0].text;
      }
    }
    
    // Try alternative format
    if ((data as any).text) {
      return (data as any).text;
    }
    
    console.error('Unexpected response format:', data);
    throw new Error('No valid response from Vertex AI - unexpected response format');
  }

  /**
   * Generate via free Gemini API (fallback)
   */
  private async generateViaFreeAPI(messages: GeminiMessage[]): Promise<string> {
    if (!this.fallbackApiKey) {
      throw new Error('Fallback API key not configured');
    }

    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    const response = await fetch(`${baseUrl}?key=${this.fallbackApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: VertexAIResponse = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response from Gemini API');
    }
  }

  /**
   * Get initial greeting from Mira
   */
  async getInitialGreeting(): Promise<string> {
    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{
          text: `You are Mira, a licensed and experienced therapist with expertise in Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), and Acceptance and Commitment Therapy (ACT).

Your therapeutic approach:
- Warm, compassionate, and non-judgmental
- Uses evidence-based therapeutic techniques
- Creates a safe space for exploration
- Validates feelings while offering insights
- Asks thoughtful, open-ended questions
- Provides practical coping strategies
- Encourages self-compassion and acceptance
- Speaks professionally but warmly (like a caring therapist)

Please provide a brief, professional greeting (2-3 sentences) that:
1. Introduces yourself as their therapist
2. Acknowledges it's okay to share what's on their mind
3. Invites them to begin the conversation

Keep it warm, professional, and inviting.`
        }]
      }
    ];

    try {
      return await this.generateResponse(messages);
    } catch (error) {
      console.error('Error getting initial greeting:', error);
      return "Hello! I'm Mira, your therapist. I'm here to provide a safe and supportive space for you to explore your thoughts and feelings. What would you like to talk about today?";
    }
  }

  /**
   * Generate therapeutic response
   */
  async generateTherapeuticResponse(
    userMessage: string, 
    conversationHistory: GeminiMessage[] = []
  ): Promise<string> {
    const systemPrompt = `You are Mira, a licensed and experienced therapist with expertise in:
- Cognitive Behavioral Therapy (CBT): Identifying thought patterns, challenging cognitive distortions, reframing
- Dialectical Behavior Therapy (DBT): Emotion regulation, distress tolerance, mindfulness
- Acceptance and Commitment Therapy (ACT): Acceptance, mindfulness, values-based action

YOUR THERAPEUTIC APPROACH:
1. Active Listening: Fully hear and understand what they're sharing
2. Validation: Acknowledge their feelings are valid and understandable
3. Exploration: Ask insightful, open-ended questions to deepen understanding
4. Evidence-Based Techniques: Use CBT (thought challenging, reframing), DBT (emotion regulation), ACT (acceptance), mindfulness
5. Normalization: Help them understand their experiences are human and common
6. Empowerment: Encourage self-compassion, self-care, and agency
7. Practical Strategies: Offer concrete coping techniques and tools
8. Professional Boundaries: Never diagnose, never provide medical advice, always encourage professional help for serious concerns
9. Crisis Response: If suicidal thoughts expressed, validate their pain, express care, provide immediate crisis resources (988), encourage safety

RESPONSE GUIDELINES:
- Warm and professional tone
- 3-5 sentences that are meaningful and therapeutic
- Show genuine care and understanding
- Ask questions that encourage deeper exploration
- Offer insights that help them see patterns or new perspectives
- Suggest practical techniques when appropriate
- End with a question or invitation to continue exploring

Conversation Context:
${conversationHistory.length > 0 ? `Previous conversation: ${conversationHistory.slice(-3).map(m => m.parts[0]?.text).join(' | ')}` : 'Beginning of session'}

Current User Message: "${userMessage}"

Provide a therapeutic response that validates, explores, and supports.`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      }
    ];

    try {
      return await this.generateResponse(messages);
    } catch (error) {
      console.error('Error generating therapeutic response:', error);
      return "I hear you, and I want to understand better. Can you tell me more about what you're experiencing? I'm here to support you through this.";
    }
  }
}

// Initialize service
export const vertexAIService = new VertexAIService();
export default VertexAIService;

