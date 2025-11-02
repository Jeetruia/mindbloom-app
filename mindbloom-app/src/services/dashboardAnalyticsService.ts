/**
 * Dashboard Analytics Service using Google Cloud
 * 
 * Provides analytics and insights using:
 * - Google Cloud Natural Language API for sentiment analysis
 * - Google Cloud Storage for data persistence
 * - Vertex AI for smart recommendations
 */

import { googleCloudLanguageService } from './googleCloudLanguageService';
import { googleCloudStorageService } from './googleCloudStorageService';
import { vertexAIService } from './vertexAIService';

export interface WellnessInsight {
  sentiment: {
    score: number;
    magnitude: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  };
  emotions: Array<{
    emotion: string;
    intensity: number;
  }>;
  recommendation?: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface ActivityData {
  id: string;
  type: 'chat' | 'game' | 'journal' | 'challenge';
  timestamp: Date;
  content?: string;
  emotion?: string;
  sentiment?: {
    score: number;
    magnitude: number;
  };
}

export class DashboardAnalyticsService {
  /**
   * Analyze recent activities for wellness insights
   */
  async analyzeRecentActivities(
    userId: string,
    activities: ActivityData[]
  ): Promise<WellnessInsight> {
    // Analyze sentiment of recent activities
    const recentContent = activities
      .filter(a => a.content)
      .slice(-10)
      .map(a => a.content)
      .join(' ');

    if (!recentContent) {
      return {
        sentiment: { score: 0, magnitude: 0, sentiment: 'neutral' },
        emotions: [],
        trend: 'stable',
      };
    }

    try {
      // Get sentiment analysis
      const sentiment = await googleCloudLanguageService.analyzeSentiment(recentContent);
      
      // Get emotional tone
      const emotionalTone = await googleCloudLanguageService.analyzeEmotionalTone(recentContent);

      // Determine trend
      const sentimentScores = activities
        .filter(a => a.sentiment)
        .map(a => a.sentiment!.score);
      
      const avgRecent = sentimentScores.slice(-5).reduce((a, b) => a + b, 0) / (sentimentScores.slice(-5).length || 1);
      const avgOlder = sentimentScores.slice(0, -5).length > 0
        ? sentimentScores.slice(0, -5).reduce((a, b) => a + b, 0) / sentimentScores.slice(0, -5).length
        : avgRecent;
      
      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (avgRecent > avgOlder + 0.1) trend = 'improving';
      else if (avgRecent < avgOlder - 0.1) trend = 'declining';

      // Get AI recommendation
      let recommendation: string | undefined;
      try {
        const recommendationPrompt = `Based on the following wellness activities and sentiment analysis, provide a brief, encouraging recommendation (1-2 sentences):

Sentiment: ${sentiment.sentiment} (score: ${sentiment.score.toFixed(2)})
Primary emotion: ${emotionalTone.primaryEmotion}
Recent activities: ${activities.length} activities

Provide a warm, supportive recommendation for continuing wellness journey.`;

        recommendation = await vertexAIService.generateResponse([{
          role: 'user',
          parts: [{ text: recommendationPrompt }]
        }]);
      } catch (error) {
        console.warn('Failed to get AI recommendation:', error);
      }

      return {
        sentiment: {
          score: sentiment.score,
          magnitude: sentiment.magnitude,
          sentiment: sentiment.sentiment,
        },
        emotions: emotionalTone.emotions.map((e: any) => ({
          emotion: e.emotion,
          intensity: e.intensity,
        })),
        recommendation,
        trend,
      };
    } catch (error) {
      console.error('Error analyzing activities:', error);
      return {
        sentiment: { score: 0, magnitude: 0, sentiment: 'neutral' },
        emotions: [],
        trend: 'stable',
      };
    }
  }

  /**
   * Calculate wellness metrics from activities
   */
  async calculateWellnessMetrics(
    userId: string,
    activities: ActivityData[]
  ): Promise<{
    calmness: number;
    energy: number;
    connection: number;
  }> {
    try {
      // Analyze recent activities
      const insight = await this.analyzeRecentActivities(userId, activities);

      // Calculate metrics based on sentiment and emotions
      const baseCalmness = Math.max(0, Math.min(1, insight.sentiment.score + 0.5));
      const anxietyEmotion = insight.emotions.find(e => e.emotion === 'anxiety');
      const calmness = anxietyEmotion 
        ? baseCalmness * (1 - anxietyEmotion.intensity * 0.5)
        : baseCalmness;

      const energyEmotion = insight.emotions.find(e => e.emotion === 'joy' || e.emotion === 'excitement');
      const baseEnergy = 0.5 + (insight.sentiment.score * 0.3);
      const energy = energyEmotion 
        ? Math.min(1, baseEnergy + energyEmotion.intensity * 0.3)
        : baseEnergy;

      // Connection based on social activities
      const socialActivities = activities.filter(a => 
        a.type === 'chat' || a.type === 'journal'
      ).length;
      const connection = Math.min(1, 0.3 + (socialActivities / activities.length) * 0.7);

      return {
        calmness: Math.max(0.2, Math.min(1, calmness)),
        energy: Math.max(0.2, Math.min(1, energy)),
        connection: Math.max(0.2, Math.min(1, connection)),
      };
    } catch (error) {
      console.error('Error calculating wellness metrics:', error);
      return { calmness: 0.6, energy: 0.6, connection: 0.5 };
    }
  }

  /**
   * Get personalized recommendation
   */
  async getPersonalizedRecommendation(
    userId: string,
    wellnessInsight: WellnessInsight
  ): Promise<string> {
    try {
      const prompt = `You are a wellness coach. Based on the following insights, provide a brief (2-3 sentences), warm, and actionable recommendation:

Sentiment: ${wellnessInsight.sentiment.sentiment} (${wellnessInsight.sentiment.score.toFixed(2)})
Trend: ${wellnessInsight.trend}
Primary emotion: ${wellnessInsight.emotions[0]?.emotion || 'neutral'}

Provide an encouraging, personalized recommendation that helps improve wellness.`;

      const response = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: prompt }]
      }]);

      return response || 'Keep up the great work on your wellness journey!';
    } catch (error) {
      console.error('Error getting recommendation:', error);
      return 'Continue with your daily wellness activities. You\'re doing great!';
    }
  }

  /**
   * Save wellness data to cloud storage
   */
  async saveWellnessData(
    userId: string,
    wellnessMetrics: {
      calmness: number;
      energy: number;
      connection: number;
    },
    insight: WellnessInsight
  ): Promise<void> {
    try {
      const data = {
        userId,
        timestamp: new Date().toISOString(),
        metrics: wellnessMetrics,
        insight,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      await googleCloudStorageService.uploadAudio(
        blob as any,
        userId,
        'wellness',
        `wellness-${Date.now()}.json`
      );
    } catch (error) {
      console.error('Error saving wellness data:', error);
    }
  }

  /**
   * Load wellness history from cloud storage
   */
  async loadWellnessHistory(userId: string): Promise<any[]> {
    try {
      // This would load from cloud storage
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error loading wellness history:', error);
      return [];
    }
  }
}

export const dashboardAnalyticsService = new DashboardAnalyticsService();

