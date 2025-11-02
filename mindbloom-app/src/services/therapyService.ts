/**
 * Enhanced Therapy Service using Google Cloud Vertex AI
 * 
 * Provides professional therapeutic conversations with:
 * - Evidence-based techniques (CBT, DBT, ACT)
 * - Emotion tracking and analysis
 * - Session memory and context
 * - Crisis detection and intervention
 * - Progress tracking
 */

import { vertexAIService } from './vertexAIService';
import { googleCloudLanguageService } from './googleCloudLanguageService';
import { googleCloudStorageService } from './googleCloudStorageService';

interface TherapyMessage {
  role: 'user' | 'therapist';
  content: string;
  timestamp: Date;
  emotion?: {
    type: string;
    intensity: number;
  };
  sentiment?: {
    score: number;
    magnitude: number;
  };
}

interface SessionContext {
  sessionId: string;
  userId: string;
  messages: TherapyMessage[];
  emotions: Array<{ type: string; intensity: number; timestamp: Date }>;
  topics: string[];
  techniques: string[];
  moodProgression: Array<{ timestamp: Date; score: number }>;
  crisisDetected: boolean;
  startTime: Date;
}

interface TherapeuticResponse {
  message: string;
  technique?: 'cbt' | 'dbt' | 'act' | 'mindfulness' | 'validation' | 'reframing' | 'exploration';
  emotion?: {
    detected: string;
    intensity: number;
  };
  suggestedActivity?: string;
  sessionNote?: string;
}

export class TherapyService {
  private sessions: Map<string, SessionContext> = new Map();
  
  /**
   * Get or create a therapy session
   */
  private getSession(userId: string, sessionId?: string): SessionContext {
    const id = sessionId || `session-${Date.now()}`;
    
    if (!this.sessions.has(id)) {
      this.sessions.set(id, {
        sessionId: id,
        userId,
        messages: [],
        emotions: [],
        topics: [],
        techniques: [],
        moodProgression: [],
        crisisDetected: false,
        startTime: new Date(),
      });
    }
    
    return this.sessions.get(id)!;
  }

  /**
   * Enhanced therapeutic response with professional techniques
   */
  async generateTherapeuticResponse(
    userId: string,
    userMessage: string,
    sessionId?: string
  ): Promise<TherapeuticResponse> {
    const session = this.getSession(userId, sessionId);

    // Analyze sentiment and emotion
    const sentiment = await googleCloudLanguageService.analyzeSentiment(userMessage);
    const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(userMessage);
    const crisis = await googleCloudLanguageService.detectCrisis(userMessage);

    // Update session tracking
    session.emotions.push({
      type: emotionalTone.primaryEmotion,
      intensity: Math.abs(sentiment.score),
      timestamp: new Date(),
    });

    session.moodProgression.push({
      timestamp: new Date(),
      score: sentiment.score,
    });

    if (crisis.isCrisis) {
      session.crisisDetected = true;
    }

    // Add user message to session
    const userMsg: TherapyMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      emotion: {
        type: emotionalTone.primaryEmotion,
        intensity: Math.abs(sentiment.score),
      },
      sentiment,
    };
    session.messages.push(userMsg);

    // Build enhanced therapeutic prompt
    const therapeuticPrompt = this.buildTherapeuticPrompt(
      userMessage,
      session,
      sentiment,
      emotionalTone,
      crisis
    );

    // Generate response using Vertex AI
    let response;
    try {
      response = await this.generateWithTechniques(
        therapeuticPrompt,
        session.messages,
        sentiment,
        emotionalTone
      );
    } catch (error) {
      console.error('Error generating therapeutic response:', error);
      // If error, provide a meaningful response instead of generic fallback
      response = {
        message: `I hear you, and I want to understand better. What you're sharing sounds important. ${userMessage.includes('?') ? 'Let me think about that...' : 'Can you tell me more about how you\'re feeling right now?'} I'm here to support you through this.`,
        suggestedActivity: sentiment.score < -0.4 ? 'breathing-dragon' : undefined,
      };
    }

    // Add therapist response to session
    const therapistMsg: TherapyMessage = {
      role: 'therapist',
      content: response.message,
      timestamp: new Date(),
    };
    session.messages.push(therapistMsg);

    // Determine therapeutic technique used
    const technique = this.identifyTechnique(response.message);

    // Track technique in session
    if (technique && !session.techniques.includes(technique)) {
      session.techniques.push(technique);
    }

    // Track topics (simplified - would use NLP in production)
    if (userMessage.length > 10) {
      const words = userMessage.toLowerCase().split(/\s+/);
      const topicKeywords = ['anxiety', 'stress', 'depression', 'sad', 'worried', 'angry', 'happy', 'grateful', 'work', 'family', 'friends', 'school'];
      const foundTopic = topicKeywords.find(topic => words.some(w => w.includes(topic)));
      if (foundTopic && !session.topics.includes(foundTopic)) {
        session.topics.push(foundTopic);
      }
    }

    // Generate session note
    const sessionNote = this.generateSessionNote(session, technique, response);

    return {
      ...response,
      technique,
      emotion: {
        detected: emotionalTone.primaryEmotion,
        intensity: Math.abs(sentiment.score),
      },
      sessionNote,
    };
  }

  /**
   * Build comprehensive therapeutic prompt
   */
  private buildTherapeuticPrompt(
    userMessage: string,
    session: SessionContext,
    sentiment: any,
    emotionalTone: any,
    crisis: any
  ): string {
    const sessionDuration = Math.floor(
      (Date.now() - session.startTime.getTime()) / 1000 / 60
    );

    let prompt = `You are Mira, a licensed and experienced therapist with expertise in Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), Acceptance and Commitment Therapy (ACT), and mindfulness-based interventions.

YOUR THERAPEUTIC APPROACH:
- Use evidence-based therapeutic techniques
- Practice active listening and validation
- Ask insightful, open-ended questions
- Identify thought patterns and cognitive distortions
- Offer practical coping strategies
- Encourage self-compassion and acceptance
- Normalize emotions and experiences
- Provide gentle guidance without being directive

CURRENT SESSION CONTEXT:
- Session duration: ${sessionDuration} minutes
- Detected emotion: ${emotionalTone.primaryEmotion} (intensity: ${emotionalTone.emotions[0]?.intensity || 0.5})
- Sentiment: ${sentiment.sentiment} (score: ${sentiment.score.toFixed(2)})
- Topics discussed: ${session.topics.length > 0 ? session.topics.join(', ') : 'none yet'}
- Previous techniques used: ${session.techniques.join(', ') || 'none yet'}`;

    if (crisis.isCrisis) {
      prompt += `\n\n⚠️ CRISIS DETECTED:
- Severity: ${crisis.severity}
- Indicators: ${crisis.indicators.join(', ')}
- RESPOND WITH URGENCY: Validate their pain, express empathy, and provide immediate crisis resources.
- Do NOT minimize their feelings.
- Encourage them to contact crisis helpline (988) or emergency services if immediate danger.`;
    } else if (sentiment.score < -0.5) {
      prompt += `\n\nUSER APPEARS DISTRESSED:
- Validate their feelings deeply
- Explore what's contributing to this distress
- Offer concrete coping strategies
- Consider suggesting grounding techniques or breathing exercises`;
    }

    prompt += `\n\nUSER'S MESSAGE: "${userMessage}"\n\nProvide a therapeutic response that:
1. Validates and acknowledges their feelings
2. Asks a thoughtful question to explore deeper
3. Offers a practical technique or insight
4. Maintains warm, professional therapeutic rapport
5. Keeps response to 3-5 sentences (concise but meaningful)`;

    return prompt;
  }

  /**
   * Generate response using therapeutic techniques
   */
  private async generateWithTechniques(
    prompt: string,
    conversationHistory: TherapyMessage[],
    sentiment: any,
    emotionalTone: any
  ): Promise<{ message: string; suggestedActivity?: string }> {
    // Convert conversation history to Gemini format
    const messages = [
      {
        role: 'user' as const,
        parts: [{ text: prompt }]
      },
      ...conversationHistory.slice(-5).map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: msg.content }]
      })),
    ];

    console.log('Calling Vertex AI with prompt:', prompt.substring(0, 200) + '...');
    console.log('Messages count:', messages.length);
    
    let response: string;
    try {
      response = await vertexAIService.generateResponse(messages);
      console.log('Vertex AI response received:', response?.substring(0, 100) + '...');
    } catch (error: any) {
      console.error('Vertex AI error details:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      // Try direct Gemini API call as fallback
      try {
        console.log('Attempting fallback to Gemini API...');
        const { geminiService } = await import('./geminiService');
        response = await geminiService.generateTherapeuticResponse(
          conversationHistory[conversationHistory.length - 1]?.content || 'Hello',
          messages.slice(1).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: m.parts,
          }))
        );
        console.log('Gemini API fallback successful');
      } catch (fallbackError: any) {
        console.error('Gemini API fallback also failed:', fallbackError);
        // Provide a meaningful fallback response instead of throwing
        response = `I understand you're sharing something important with me. ${sentiment.score < -0.4 ? 'It sounds like you might be going through a difficult time right now. ' : ''}I'm here to listen and support you. Can you tell me more about what you're experiencing? I want to help you work through this.`;
      }
    }

    // Suggest activity based on emotion
    let suggestedActivity: string | undefined;
    if (sentiment.score < -0.4) {
      suggestedActivity = 'breathing-dragon';
    } else if (emotionalTone.emotions.some((e: any) => e.emotion === 'anxiety')) {
      suggestedActivity = 'mindfulness';
    } else if (emotionalTone.emotions.some((e: any) => e.emotion === 'sadness')) {
      suggestedActivity = 'gratitude-hunt';
    }

    return {
      message: response,
      suggestedActivity,
    };
  }

  /**
   * Identify therapeutic technique used
   */
  private identifyTechnique(response: string): 'cbt' | 'dbt' | 'act' | 'mindfulness' | 'validation' | 'reframing' | 'exploration' {
    const lower = response.toLowerCase();
    
    if (lower.includes('thought') || lower.includes('belief') || lower.includes('perspective') || lower.includes('way of thinking')) {
      return 'cbt';
    }
    if (lower.includes('accept') || lower.includes('present moment') || lower.includes('values') || lower.includes('commitment')) {
      return 'act';
    }
    if (lower.includes('distress tolerance') || lower.includes('mindfulness') || lower.includes('emotion regulation')) {
      return 'dbt';
    }
    if (lower.includes('breathe') || lower.includes('grounding') || lower.includes('moment')) {
      return 'mindfulness';
    }
    if (lower.includes('validate') || lower.includes('understand') || lower.includes('makes sense')) {
      return 'validation';
    }
    if (lower.includes('consider') || lower.includes('alternativ') || lower.includes('another way')) {
      return 'reframing';
    }
    
    return 'exploration';
  }

  /**
   * Generate session note for saving
   */
  private generateSessionNote(
    session: SessionContext,
    technique: string,
    response: TherapeuticResponse
  ): string {
    const avgMood = session.moodProgression.length > 0
      ? session.moodProgression.reduce((sum, m) => sum + m.score, 0) / session.moodProgression.length
      : 0;

    return `Session Note - ${new Date().toLocaleDateString()}
Duration: ${Math.floor((Date.now() - session.startTime.getTime()) / 1000 / 60)} minutes
Primary emotion: ${session.emotions[session.emotions.length - 1]?.type || 'neutral'}
Average mood: ${avgMood.toFixed(2)}
Techniques used: ${session.techniques.join(', ') || 'none'}
Topics: ${session.topics.join(', ') || 'general discussion'}
Therapeutic focus: ${technique}
Crisis detected: ${session.crisisDetected ? 'Yes - appropriate resources provided' : 'No'}`;
  }

  /**
   * Save session to Google Cloud Storage
   */
  async saveSession(userId: string, sessionId: string): Promise<{ xpEarned: number }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { xpEarned: 0 };
    }

    try {
      const sessionData = {
        sessionId,
        userId,
        startTime: session.startTime,
        endTime: new Date(),
        duration: Math.floor((Date.now() - session.startTime.getTime()) / 1000 / 60),
        messageCount: session.messages.length,
        emotions: session.emotions,
        topics: session.topics,
        techniques: session.techniques,
        moodProgression: session.moodProgression,
        crisisDetected: session.crisisDetected,
        messages: session.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          emotion: msg.emotion,
        })),
      };

      const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
        type: 'application/json',
      });

      await googleCloudStorageService.uploadAudio(
        blob as any,
        userId,
        'recording',
        `therapy-session-${sessionId}.json`
      );
      
      // Calculate XP for session (2 XP per message, max 50 XP)
      // XP will be awarded by the component after save
      const xpEarned = Math.min(session.messages.length * 2, 50);
      
      return { xpEarned };
    } catch (error) {
      console.error('Error saving therapy session:', error);
      return { xpEarned: 0 };
    }
  }

  /**
   * Get session summary
   */
  getSessionSummary(sessionId: string): SessionContext | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * End session and save
   */
  async endSession(userId: string, sessionId: string): Promise<void> {
    await this.saveSession(userId, sessionId);
    this.sessions.delete(sessionId);
  }
}

// Export singleton
export const therapyService = new TherapyService();

