import { vertexAIService } from './vertexAIService';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

class GeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private useVertexAI: boolean;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // Use Vertex AI if proxy is configured, otherwise fallback to free API
    this.useVertexAI = !!process.env.REACT_APP_GOOGLE_CLOUD_PROXY_URL;
  }

  async generateResponse(messages: GeminiMessage[]): Promise<string> {
    // Try Vertex AI first if configured
    if (this.useVertexAI) {
      try {
        return await vertexAIService.generateResponse(messages);
      } catch (error) {
        console.warn('Vertex AI failed, falling back to free API:', error);
        // Fall through to free API
      }
    }

    // Fallback to free Gemini API
    if (!this.apiKey) {
      throw new Error('No API key configured for Gemini API');
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
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

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async getInitialGreeting(): Promise<string> {
    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{
          text: `You are Mira, a warm and empathetic AI therapist. You're here to provide support, guidance, and a safe space for users to share their thoughts and feelings. 

Your personality:
- Warm, compassionate, and non-judgmental
- Uses gentle, encouraging language
- Focuses on empowerment and self-care
- Avoids clinical or medical terminology
- Speaks in a conversational, friendly tone
- Encourages users to explore their feelings safely

Please provide a brief, welcoming greeting (2-3 sentences) that introduces yourself and invites the user to share what's on their mind. Keep it warm and approachable.`
        }]
      }
    ];

    try {
      return await this.generateResponse(messages);
    } catch (error) {
      console.error('Error getting initial greeting:', error);
      return "Hello! I'm Mira, your wellness companion. I'm here to listen and support you. What's on your mind today?";
    }
  }

  async generateTherapeuticResponse(userMessage: string, conversationHistory: GeminiMessage[] = []): Promise<string> {
    const systemPrompt = `You are Mira, a warm and empathetic AI therapist. You're here to provide support, guidance, and a safe space for users to share their thoughts and feelings.

Your approach:
- Listen actively and validate their feelings
- Ask gentle, open-ended questions to help them explore
- Offer practical, evidence-based coping strategies
- Use CBT techniques when appropriate (thought challenging, reframing)
- Encourage self-compassion and self-care
- Normalize their experiences
- Avoid giving medical advice or diagnoses
- If someone expresses suicidal thoughts, respond with empathy and encourage them to reach out to crisis resources

Keep responses conversational, warm, and helpful. Aim for 2-4 sentences that provide meaningful support.`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    try {
      return await this.generateResponse(messages);
    } catch (error) {
      console.error('Error generating therapeutic response:', error);
      return "I'm here to listen and support you. Could you tell me more about what you're experiencing right now?";
    }
  }
}

// Initialize with API key from environment
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file');
}

export const geminiService = new GeminiService(GEMINI_API_KEY);
export default GeminiService;
