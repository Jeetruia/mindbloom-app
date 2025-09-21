// AI Service for conversational therapy
export interface AIResponse {
  message: string;
  emotion: 'happy' | 'sad' | 'neutral' | 'concerned' | 'encouraging';
  intensity: number;
  suggestedActions?: string[];
  crisisDetected?: boolean;
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // In production, these would come from environment variables
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async generateResponse(
    userMessage: string,
    context: {
      userAge: number;
      previousMessages: Array<{content: string, isFromUser: boolean}>;
      currentMood?: string;
    }
  ): Promise<AIResponse> {
    
    // For demo purposes, we'll use a local response generator
    // In production, this would call OpenAI API or Vertex AI
    return this.generateLocalResponse(userMessage, context);
  }

  private generateLocalResponse(
    userMessage: string,
    context: { userAge: number; previousMessages: Array<{content: string, isFromUser: boolean}>; currentMood?: string }
  ): AIResponse {
    const message = userMessage.toLowerCase();
    
    // Crisis detection
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'want to die'];
    const crisisDetected = crisisKeywords.some(keyword => message.includes(keyword));
    
    if (crisisDetected) {
      return {
        message: "I'm really concerned about what you're sharing. Your safety is the most important thing right now. Please reach out to a crisis helpline immediately. In the US, you can call 988 for the Suicide & Crisis Lifeline. You're not alone, and there are people who want to help you.",
        emotion: 'concerned',
        intensity: 0.9,
        crisisDetected: true,
        suggestedActions: ['Call 988', 'Text HOME to 741741', 'Contact emergency services']
      };
    }

    // Mood-based responses
    if (message.includes('anxious') || message.includes('worried') || message.includes('nervous')) {
      return {
        message: "I can hear that you're feeling anxious right now. That's completely understandable. Let's try a simple breathing exercise together. Take a deep breath in for 4 counts, hold for 4, and exhale for 6. Would you like to try this with me?",
        emotion: 'encouraging',
        intensity: 0.8,
        suggestedActions: ['Try breathing exercise', 'Practice mindfulness', 'Talk about what\'s worrying you']
      };
    }

    if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      return {
        message: "I'm sorry you're feeling sad right now. These feelings are valid, and it's okay to not be okay sometimes. Can you tell me more about what's contributing to these feelings? Sometimes talking about it can help us process what we're going through.",
        emotion: 'encouraging',
        intensity: 0.7,
        suggestedActions: ['Share more about your feelings', 'Try a mood tracking exercise', 'Practice self-compassion']
      };
    }

    if (message.includes('angry') || message.includes('frustrated') || message.includes('mad')) {
      return {
        message: "I can sense that you're feeling angry or frustrated. These are normal emotions, and it's important to acknowledge them. What's been triggering these feelings for you? Sometimes understanding the source can help us work through them.",
        emotion: 'neutral',
        intensity: 0.6,
        suggestedActions: ['Identify anger triggers', 'Practice anger management techniques', 'Try physical exercise']
      };
    }

    if (message.includes('happy') || message.includes('good') || message.includes('great')) {
      return {
        message: "That's wonderful to hear! I'm so glad you're feeling good right now. It's important to celebrate these positive moments. What's been contributing to your good mood? Understanding what brings us joy can help us cultivate more of these positive experiences.",
        emotion: 'happy',
        intensity: 0.8,
        suggestedActions: ['Practice gratitude', 'Share your positive experience', 'Set a positive intention']
      };
    }

    // General supportive responses
    const supportiveResponses = [
      "I really appreciate you sharing that with me. It sounds like you're dealing with a lot right now.",
      "That sounds really challenging. I'm here to listen and support you through this.",
      "I can hear the strength in your words, even when things feel difficult. You're doing better than you might think.",
      "Thank you for trusting me with your thoughts. Let's work together to find some strategies that might help.",
      "I understand this is hard for you. Remember, it's okay to take things one step at a time.",
      "Your feelings are completely valid. Sometimes just talking about what's on our mind can help us feel a bit lighter."
    ];

    const randomResponse = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];

    return {
      message: randomResponse,
      emotion: 'encouraging',
      intensity: 0.7,
      suggestedActions: ['Continue talking', 'Try a wellness exercise', 'Practice mindfulness']
    };
  }

  async generateCBTExercise(type: 'thought_challenge' | 'breathing' | 'mindfulness' | 'journaling'): Promise<{
    title: string;
    description: string;
    instructions: string[];
    duration: number;
  }> {
    const exercises = {
      thought_challenge: {
        title: "Thought Challenge Exercise",
        description: "Let's examine a negative thought and challenge it with evidence.",
        instructions: [
          "Identify a negative thought you're having",
          "Write down the evidence that supports this thought",
          "Write down evidence that contradicts this thought",
          "Consider alternative explanations",
          "Rate how much you believe the original thought now (0-100%)"
        ],
        duration: 10
      },
      breathing: {
        title: "4-7-8 Breathing Exercise",
        description: "A calming breathing technique to reduce anxiety and stress.",
        instructions: [
          "Sit comfortably and close your eyes",
          "Breathe in through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale through your mouth for 8 counts",
          "Repeat this cycle 4 times"
        ],
        duration: 5
      },
      mindfulness: {
        title: "5-Minute Mindfulness",
        description: "A brief mindfulness practice to center yourself.",
        instructions: [
          "Find a comfortable seated position",
          "Close your eyes and take 3 deep breaths",
          "Notice the sensation of your breath",
          "When your mind wanders, gently return to your breath",
          "Continue for 5 minutes"
        ],
        duration: 5
      },
      journaling: {
        title: "Emotional Check-in",
        description: "Reflect on your current emotional state and experiences.",
        instructions: [
          "Write about how you're feeling right now",
          "Describe what happened today that affected your mood",
          "Identify any patterns in your thoughts or feelings",
          "Write one thing you're grateful for",
          "Set one small intention for tomorrow"
        ],
        duration: 15
      }
    };

    return exercises[type];
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
  }> {
    // Simplified sentiment analysis
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'amazing', 'love', 'enjoy', 'excited'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'worried', 'anxious'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    if (positiveCount > negativeCount) {
      return { sentiment: 'positive', confidence: 0.8, emotions: ['joy', 'contentment'] };
    } else if (negativeCount > positiveCount) {
      return { sentiment: 'negative', confidence: 0.8, emotions: ['sadness', 'anxiety'] };
    } else {
      return { sentiment: 'neutral', confidence: 0.6, emotions: ['calm'] };
    }
  }
}
