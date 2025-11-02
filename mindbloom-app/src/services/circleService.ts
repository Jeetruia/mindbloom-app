/**
 * Circle Service for AI-powered peer circle features
 * 
 * Provides:
 * - AI moderation and summarization
 * - Mood pulse analysis
 * - Voice check-ins
 * - Emotion-based avatar animations
 */

import { vertexAIService } from './vertexAIService';
import { googleCloudLanguageService } from './googleCloudLanguageService';
import { hybridSTTService } from './googleCloudSpeechService';
import { googleCloudStorageService } from './googleCloudStorageService';

export interface CirclePost {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  isAnonymous: boolean;
  sentiment?: {
    score: number;
    magnitude: number;
  };
  emotion?: {
    type: string;
    intensity: number;
  };
}

export interface CircleMood {
  circleId: string;
  averageSentiment: number;
  emotions: Array<{
    emotion: string;
    count: number;
    averageIntensity: number;
  }>;
  timestamp: Date;
}

export interface CircleSummary {
  circleId: string;
  summary: string;
  keyThemes: string[];
  sentiment: number;
  timestamp: Date;
}

export class CircleService {
  /**
   * Analyze circle mood from recent posts
   */
  async analyzeCircleMood(circleId: string, posts: CirclePost[]): Promise<CircleMood> {
    try {
      // Analyze sentiment of all posts
      const allContent = posts.map(p => p.content).join(' ');
      const sentiment = await googleCloudLanguageService.analyzeSentiment(allContent);
      const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(allContent);

      // Count emotions
      const emotionCounts = new Map<string, { count: number; totalIntensity: number }>();
      posts.forEach(post => {
        if (post.emotion) {
          const existing = emotionCounts.get(post.emotion.type) || { count: 0, totalIntensity: 0 };
          emotionCounts.set(post.emotion.type, {
            count: existing.count + 1,
            totalIntensity: existing.totalIntensity + post.emotion.intensity,
          });
        }
      });

      const emotions = Array.from(emotionCounts.entries()).map(([emotion, data]) => ({
        emotion,
        count: data.count,
        averageIntensity: data.totalIntensity / data.count,
      }));

      return {
        circleId,
        averageSentiment: sentiment.score,
        emotions,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error analyzing circle mood:', error);
      return {
        circleId,
        averageSentiment: 0,
        emotions: [],
        timestamp: new Date(),
      };
    }
  }

  /**
   * Summarize circle discussion using AI
   */
  async summarizeCircleDiscussion(circleId: string, posts: CirclePost[]): Promise<CircleSummary> {
    try {
      const recentPosts = posts.slice(0, 20).map(p => `- ${p.content}`).join('\n');
      
      const prompt = `You are a compassionate moderator for a peer support circle. Summarize the following discussion in a warm, supportive way (2-3 sentences). Identify the main themes or topics being discussed.

Posts:
${recentPosts}

Provide:
1. A brief summary of the discussion
2. Key themes (3-5 themes as a comma-separated list)

Format your response as JSON:
{
  "summary": "summary text here",
  "themes": ["theme1", "theme2", "theme3"]
}`;

      const response = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: prompt }]
      }]);

      // Parse JSON response
      let summaryData: { summary: string; themes: string[] };
      try {
        // Try to extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          summaryData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        // Fallback if JSON parsing fails
        summaryData = {
          summary: response.substring(0, 200),
          themes: ['support', 'wellness', 'community'],
        };
      }

      // Calculate average sentiment
      const sentiments = posts.filter(p => p.sentiment).map(p => p.sentiment!.score);
      const avgSentiment = sentiments.length > 0
        ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length
        : 0;

      return {
        circleId,
        summary: summaryData.summary,
        keyThemes: summaryData.themes,
        sentiment: avgSentiment,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error summarizing circle discussion:', error);
      return {
        circleId,
        summary: 'The circle members have been sharing their thoughts and supporting each other.',
        keyThemes: ['support', 'community'],
        sentiment: 0,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Process voice check-in
   */
  async processVoiceCheckIn(circleId: string, userId: string): Promise<{
    transcript: string;
    summary: string;
    sentiment: number;
    emotion: string;
  }> {
    try {
      // Record voice
      const transcript = await hybridSTTService.startListening();
      
      // Analyze sentiment
      const sentiment = await googleCloudLanguageService.analyzeSentiment(transcript);
      const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(transcript);

      // Generate summary using AI
      const summaryPrompt = `Summarize this voice reflection in a supportive, concise way (1-2 sentences):

"${transcript}"

Provide a brief, empathetic summary:`;

      const summary = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: summaryPrompt }]
      }]);

      // Save to cloud storage
      const checkInData = {
        circleId,
        userId,
        transcript,
        summary,
        sentiment: sentiment.score,
        emotion: emotionalTone.primaryEmotion,
        timestamp: new Date(),
      };

      const blob = new Blob([JSON.stringify(checkInData, null, 2)], {
        type: 'application/json',
      });

      await googleCloudStorageService.uploadAudio(
        blob as any,
        userId,
        'recording',
        `circle-checkin-${circleId}-${Date.now()}.json`
      );

      return {
        transcript,
        summary,
        sentiment: sentiment.score,
        emotion: emotionalTone.primaryEmotion,
      };
    } catch (error) {
      console.error('Error processing voice check-in:', error);
      throw error;
    }
  }

  /**
   * Analyze post for sentiment and emotion
   */
  async analyzePost(content: string): Promise<{
    sentiment: { score: number; magnitude: number };
    emotion: { type: string; intensity: number };
  }> {
    try {
      const sentiment = await googleCloudLanguageService.analyzeSentiment(content);
      const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(content);

      return {
        sentiment,
        emotion: {
          type: emotionalTone.primaryEmotion,
          intensity: Math.abs(sentiment.score),
        },
      };
    } catch (error) {
      console.error('Error analyzing post:', error);
      return {
        sentiment: { score: 0, magnitude: 0 },
        emotion: { type: 'neutral', intensity: 0.5 },
      };
    }
  }
}

export const circleService = new CircleService();

