/**
 * Story Service for AI-powered story features
 * 
 * Provides:
 * - AI narrative mode (voice to story)
 * - Emotion tag generation
 * - Bloom meter calculation
 * - Text-to-Speech narration
 */

import { vertexAIService } from './vertexAIService';
import { googleCloudLanguageService } from './googleCloudLanguageService';
import { hybridSTTService } from './googleCloudSpeechService';
import { hybridTTSService } from './googleCloudTTSService';
import { googleCloudStorageService } from './googleCloudStorageService';

export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  emotion?: {
    type: string;
    intensity: number;
  };
  sentiment?: {
    score: number;
    magnitude: number;
  };
  bloomScore?: number;
}

export interface BloomMeter {
  userId: string;
  stories: Story[];
  overallBloom: number;
  emotionalTrend: 'growing' | 'stable' | 'declining';
  evolution: Array<{
    date: Date;
    bloomScore: number;
    emotion: string;
  }>;
}

export class StoryService {
  /**
   * Convert voice to story using AI
   */
  async processVoiceStory(userId: string, transcript: string): Promise<{
    story: string;
    title: string;
    emotion: string;
    sentiment: number;
  }> {
    try {
      // Use AI to rewrite voice transcript as beautiful story
      const prompt = `You are a compassionate narrative coach. The user has shared a personal reflection verbally. Rewrite it as a beautiful, reflective story post (2-4 paragraphs) that:

1. Maintains the user's authentic voice and emotions
2. Flows naturally and reads well
3. Is encouraging and self-compassionate
4. Highlights growth and learning

User's reflection:
"${transcript}"

Generate a title (max 50 characters) and the story content. Format as JSON:
{
  "title": "Story title here",
  "story": "Story content here"
}`;

      const response = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: prompt }]
      }]);

      // Parse JSON response
      let storyData: { title: string; story: string };
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          storyData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        storyData = {
          title: 'My Reflection',
          story: response.substring(0, 500),
        };
      }

      // Analyze sentiment and emotion
      const sentiment = await googleCloudLanguageService.analyzeSentiment(storyData.story);
      const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(storyData.story);

      return {
        story: storyData.story,
        title: storyData.title,
        emotion: emotionalTone.primaryEmotion,
        sentiment: sentiment.score,
      };
    } catch (error) {
      console.error('Error processing voice story:', error);
      throw error;
    }
  }

  /**
   * Record voice and convert to story
   */
  async recordVoiceStory(userId: string): Promise<{
    transcript: string;
    story: string;
    title: string;
    emotion: string;
    sentiment: number;
  }> {
    try {
      // Record voice
      const transcript = await hybridSTTService.startListening();
      
      // Process voice to story
      const result = await this.processVoiceStory(userId, transcript);
      
      return {
        transcript,
        ...result,
      };
    } catch (error) {
      console.error('Error recording voice story:', error);
      throw error;
    }
  }

  /**
   * Generate emotion tags for story
   */
  async generateEmotionTags(content: string): Promise<string[]> {
    try {
      const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(content);
      
      // Get top 3 emotions
      const topEmotions = emotionalTone.emotions
        .slice(0, 3)
        .map((e: any) => e.emotion);
      
      return topEmotions;
    } catch (error) {
      console.error('Error generating emotion tags:', error);
      return ['reflection'];
    }
  }

  /**
   * Calculate Bloom Meter for user's stories
   */
  async calculateBloomMeter(userId: string, stories: Story[]): Promise<BloomMeter> {
    try {
      // Calculate bloom score for each story
      const bloomScores = stories.map(story => {
        const baseScore = story.sentiment ? (story.sentiment.score + 1) * 50 : 50;
        const emotionBonus = story.emotion ? story.emotion.intensity * 20 : 0;
        return Math.min(100, baseScore + emotionBonus);
      });

      const overallBloom = bloomScores.length > 0
        ? bloomScores.reduce((a, b) => a + b, 0) / bloomScores.length
        : 50;

      // Calculate trend
      if (bloomScores.length < 2) {
        return {
          userId,
          stories,
          overallBloom,
          emotionalTrend: 'stable',
          evolution: [],
        };
      }

      const recentAvg = bloomScores.slice(0, Math.floor(bloomScores.length / 2))
        .reduce((a, b) => a + b, 0) / Math.floor(bloomScores.length / 2);
      const olderAvg = bloomScores.slice(Math.floor(bloomScores.length / 2))
        .reduce((a, b) => a + b, 0) / (bloomScores.length - Math.floor(bloomScores.length / 2));

      let emotionalTrend: 'growing' | 'stable' | 'declining' = 'stable';
      if (recentAvg > olderAvg + 5) emotionalTrend = 'growing';
      else if (recentAvg < olderAvg - 5) emotionalTrend = 'declining';

      // Create evolution timeline
      const evolution = stories.map((story, idx) => ({
        date: story.timestamp,
        bloomScore: bloomScores[idx],
        emotion: story.emotion?.type || 'neutral',
      }));

      return {
        userId,
        stories,
        overallBloom,
        emotionalTrend,
        evolution,
      };
    } catch (error) {
      console.error('Error calculating bloom meter:', error);
      return {
        userId,
        stories,
        overallBloom: 50,
        emotionalTrend: 'stable',
        evolution: [],
      };
    }
  }

  /**
   * Narrate story with Text-to-Speech
   */
  async narrateStory(story: Story): Promise<void> {
    try {
      const fullText = `${story.title}. ${story.content}`;
      await hybridTTSService.speak(fullText, {
        rate: 0.85, // Slightly slower for reflection
        pitch: 1.0,
        volume: 1.0,
      });
    } catch (error) {
      console.error('Error narrating story:', error);
      throw error;
    }
  }

  /**
   * Save story to cloud storage
   */
  async saveStory(userId: string, story: Story): Promise<void> {
    try {
      const blob = new Blob([JSON.stringify(story, null, 2)], {
        type: 'application/json',
      });

      await googleCloudStorageService.uploadAudio(
        blob as any,
        userId,
        'story',
        `story-${story.id}.json`
      );
    } catch (error) {
      console.error('Error saving story:', error);
    }
  }
}

export const storyService = new StoryService();

