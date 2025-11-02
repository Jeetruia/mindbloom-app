/**
 * Progress Service for AI-powered progress tracking
 * 
 * Provides:
 * - AI wellness insights
 * - Emotion trend graphs
 * - Voice journal integration
 * - Milestone tracking
 */

import { vertexAIService } from './vertexAIService';
import { googleCloudLanguageService } from './googleCloudLanguageService';
import { hybridSTTService } from './googleCloudSpeechService';
import { googleCloudStorageService } from './googleCloudStorageService';

export interface WellnessInsight {
  summary: string;
  trends: string[];
  recommendations: string[];
  sentiment: number;
  emotions: Array<{ emotion: string; intensity: number }>;
  timestamp: Date;
}

export interface EmotionData {
  date: Date;
  sentiment: number;
  emotions: Array<{ emotion: string; intensity: number }>;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  type: 'streak' | 'level' | 'activity' | 'emotion';
}

export class ProgressService {
  /**
   * Generate AI wellness insights from user activities
   */
  async generateWellnessInsights(userId: string, activities: any[]): Promise<WellnessInsight> {
    try {
      // Analyze all activities
      const sentiments: number[] = [];
      const allEmotions: { [key: string]: number } = {};
      const activityTexts: string[] = [];

      for (const activity of activities) {
        if (activity.content || activity.text) {
          const text = activity.content || activity.text;
          activityTexts.push(text);

          const sentiment = await googleCloudLanguageService.analyzeSentiment(text);
          sentiments.push(sentiment.score);

          const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(text);
          emotionalTone.emotions.forEach((e: any) => {
            allEmotions[e.emotion] = (allEmotions[e.emotion] || 0) + e.intensity;
          });
        }
      }

      const avgSentiment = sentiments.length > 0
        ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length
        : 0;

      const emotions = Object.entries(allEmotions)
        .map(([emotion, intensity]) => ({
          emotion,
          intensity: intensity / activities.length,
        }))
        .sort((a, b) => b.intensity - a.intensity)
        .slice(0, 5);

      // Generate AI summary
      const prompt = `You are a compassionate wellness coach. Analyze the user's recent activities and provide:

1. A brief wellness summary (2-3 sentences)
2. Key trends noticed (3-5 trends as bullet points)
3. Personalized recommendations (2-3 actionable recommendations)

User's recent activities:
${activityTexts.slice(0, 10).join('\n')}

Overall sentiment: ${avgSentiment > 0.3 ? 'Positive' : avgSentiment < -0.3 ? 'Negative' : 'Neutral'}
Key emotions: ${emotions.map(e => e.emotion).join(', ')}

Format your response as JSON:
{
  "summary": "summary text here",
  "trends": ["trend1", "trend2", "trend3"],
  "recommendations": ["rec1", "rec2", "rec3"]
}`;

      const response = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: prompt }]
      }]);

      // Parse JSON response
      let insightData: { summary: string; trends: string[]; recommendations: string[] };
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          insightData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        insightData = {
          summary: response.substring(0, 200),
          trends: ['Wellness patterns emerging', 'Growth in activities'],
          recommendations: ['Continue daily practices', 'Try new activities'],
        };
      }

      return {
        summary: insightData.summary,
        trends: insightData.trends,
        recommendations: insightData.recommendations,
        sentiment: avgSentiment,
        emotions,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error generating wellness insights:', error);
      return {
        summary: 'Your wellness journey is showing progress. Keep engaging with activities that support your growth.',
        trends: ['Consistent engagement', 'Positive momentum'],
        recommendations: ['Continue your practices', 'Explore new activities'],
        sentiment: 0,
        emotions: [],
        timestamp: new Date(),
      };
    }
  }

  /**
   * Process voice journal entry
   */
  async processVoiceJournal(userId: string): Promise<{
    transcript: string;
    summary: string;
    sentiment: number;
    emotion: string;
  }> {
    try {
      // Record voice
      const transcript = await hybridSTTService.startListening();

      // Analyze sentiment and emotion
      const sentiment = await googleCloudLanguageService.analyzeSentiment(transcript);
      const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(transcript);

      // Generate summary using AI
      const summaryPrompt = `Summarize this voice journal entry in a supportive, concise way (1-2 sentences):

"${transcript}"

Provide a brief, empathetic summary:`;

      const summary = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: summaryPrompt }]
      }]);

      // Save to cloud storage
      const journalData = {
        userId,
        transcript,
        summary,
        sentiment: sentiment.score,
        emotion: emotionalTone.primaryEmotion,
        timestamp: new Date(),
      };

      const blob = new Blob([JSON.stringify(journalData, null, 2)], {
        type: 'application/json',
      });

      await googleCloudStorageService.uploadAudio(
        blob as any,
        userId,
        'recording',
        `voice-journal-${Date.now()}.json`
      );

      return {
        transcript,
        summary,
        sentiment: sentiment.score,
        emotion: emotionalTone.primaryEmotion,
      };
    } catch (error) {
      console.error('Error processing voice journal:', error);
      throw error;
    }
  }

  /**
   * Calculate emotion trends over time
   */
  async calculateEmotionTrends(userId: string, activities: any[]): Promise<EmotionData[]> {
    try {
      const emotionData: EmotionData[] = [];

      for (const activity of activities) {
        if (activity.content || activity.text) {
          const text = activity.content || activity.text;
          const sentiment = await googleCloudLanguageService.analyzeSentiment(text);
          const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(text);

          emotionData.push({
            date: activity.timestamp || new Date(),
            sentiment: sentiment.score,
            emotions: emotionalTone.emotions,
          });
        }
      }

      return emotionData.sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      console.error('Error calculating emotion trends:', error);
      return [];
    }
  }

  /**
   * Check for milestones
   */
  checkMilestones(activities: any[], level: number, streak: number): Milestone[] {
    const milestones: Milestone[] = [];

    // Level milestones
    if (level >= 5 && !milestones.find(m => m.id === 'level_5')) {
      milestones.push({
        id: 'level_5',
        title: 'Rising Star',
        description: 'Reached Level 5!',
        icon: '⭐',
        unlockedAt: new Date(),
        type: 'level',
      });
    }

    if (level >= 10 && !milestones.find(m => m.id === 'level_10')) {
      milestones.push({
        id: 'level_10',
        title: 'Champion',
        description: 'Reached Level 10!',
        icon: '👑',
        unlockedAt: new Date(),
        type: 'level',
      });
    }

    // Streak milestones
    if (streak >= 7 && !milestones.find(m => m.id === 'streak_7')) {
      milestones.push({
        id: 'streak_7',
        title: 'Week Warrior',
        description: '7-day streak!',
        icon: '🔥',
        unlockedAt: new Date(),
        type: 'streak',
      });
    }

    if (streak >= 30 && !milestones.find(m => m.id === 'streak_30')) {
      milestones.push({
        id: 'streak_30',
        title: 'Month Master',
        description: '30-day streak!',
        icon: '💪',
        unlockedAt: new Date(),
        type: 'streak',
      });
    }

    // Activity milestones
    if (activities.length >= 50) {
      milestones.push({
        id: 'activities_50',
        title: 'Active Explorer',
        description: '50 activities completed!',
        icon: '🎯',
        unlockedAt: new Date(),
        type: 'activity',
      });
    }

    return milestones;
  }
}

export const progressService = new ProgressService();

