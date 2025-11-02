/**
 * Resource Service for AI-powered resource recommendations
 * 
 * Provides:
 * - AI-curated recommendations based on mood
 * - Daily Bloom Dose generation
 * - Learning path gamification
 * - Voice search
 */

import { vertexAIService } from './vertexAIService';
import { googleCloudLanguageService } from './googleCloudLanguageService';
import { hybridSTTService } from './googleCloudSpeechService';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'audio' | 'tool' | 'emergency' | 'education';
  category: 'mindfulness' | 'breathing' | 'crisis' | 'education' | 'tools';
  relevance: number;
  icon: string;
  color: string;
  isBookmarked: boolean;
}

export interface DailyDose {
  id: string;
  title: string;
  content: string;
  type: 'affirmation' | 'tip' | 'quote' | 'exercise';
  timestamp: Date;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  topics: Array<{
    id: string;
    title: string;
    unlocked: boolean;
    completed: boolean;
  }>;
  progress: number;
}

export class ResourceService {
  /**
   * Get AI-curated recommendations based on user mood
   */
  async getRecommendations(userId: string, userMood?: string, recentActivities?: string[]): Promise<Resource[]> {
    try {
      // Analyze user context
      const contextPrompt = `Based on the user's mood and recent activities, recommend the most relevant wellness resources.

User mood: ${userMood || 'neutral'}
Recent activities: ${recentActivities?.join(', ') || 'none'}

Recommend 3-5 specific resources that would be most helpful. Format as JSON:
{
  "resources": [
    {
      "title": "Resource title",
      "description": "Brief description",
      "type": "guide|audio|tool|education",
      "category": "mindfulness|breathing|crisis|tools",
      "relevance": 0.9
    }
  ]
}`;

      const response = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: contextPrompt }]
      }]);

      // Parse JSON response
      let resourceData: { resources: Resource[] };
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          resourceData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        // Fallback recommendations
        resourceData = {
          resources: [
            {
              id: '1',
              title: 'Daily Breathing Exercise',
              description: 'A 5-minute guided breathing exercise to help you feel calm',
              type: 'audio',
              category: 'breathing',
              relevance: 0.8,
              icon: '🫁',
              color: 'from-blue-500 to-indigo-500',
              isBookmarked: false,
            },
            {
              id: '2',
              title: 'Mindfulness Guide',
              description: 'Learn techniques for staying present and reducing stress',
              type: 'guide',
              category: 'mindfulness',
              relevance: 0.7,
              icon: '🧠',
              color: 'from-purple-500 to-pink-500',
              isBookmarked: false,
            },
          ],
        };
      }

      return resourceData.resources;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  /**
   * Generate Daily Bloom Dose
   */
  async generateDailyDose(userId: string, userMood?: string): Promise<DailyDose> {
    try {
      const prompt = `Generate a daily wellness dose - a short, encouraging message (affirmation, tip, quote, or exercise) that will help the user feel supported today.

User mood: ${userMood || 'neutral'}

Provide one of:
1. A positive affirmation (1-2 sentences)
2. A practical wellness tip (1-2 sentences)
3. An inspiring quote (with attribution if possible)
4. A quick exercise suggestion (1-2 sentences)

Format as JSON:
{
  "title": "Short title",
  "content": "The message content",
  "type": "affirmation|tip|quote|exercise"
}`;

      const response = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: prompt }]
      }]);

      // Parse JSON response
      let doseData: { title: string; content: string; type: string };
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          doseData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        doseData = {
          title: 'Daily Wellness Reminder',
          content: 'You are doing your best, and that is enough. Take a moment to breathe and appreciate your progress.',
          type: 'affirmation',
        };
      }

      return {
        id: `dose-${Date.now()}`,
        title: doseData.title,
        content: doseData.content,
        type: doseData.type as DailyDose['type'],
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error generating daily dose:', error);
      return {
        id: `dose-${Date.now()}`,
        title: 'Daily Wellness Reminder',
        content: 'You are doing your best, and that is enough.',
        type: 'affirmation',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Process voice search
   */
  async processVoiceSearch(userId: string, query?: string): Promise<{
    transcript: string;
    results: Resource[];
  }> {
    try {
      // If query not provided, record voice
      let transcript = query;
      if (!transcript) {
        transcript = await hybridSTTService.startListening();
      }

      // Search resources based on transcript
      const searchPrompt = `The user is searching for resources using voice: "${transcript}"

Find 3-5 relevant wellness resources that match this search. Format as JSON:
{
  "resources": [
    {
      "title": "Resource title",
      "description": "Brief description",
      "type": "guide|audio|tool|education",
      "category": "mindfulness|breathing|crisis|tools",
      "relevance": 0.9
    }
  ]
}`;

      const response = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: searchPrompt }]
      }]);

      // Parse JSON response
      let searchData: { resources: Resource[] };
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          searchData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        searchData = { resources: [] };
      }

      return {
        transcript,
        results: searchData.resources,
      };
    } catch (error) {
      console.error('Error processing voice search:', error);
      return {
        transcript: query || '',
        results: [],
      };
    }
  }

  /**
   * Generate learning path
   */
  async generateLearningPath(userId: string, currentLevel: number): Promise<LearningPath> {
    try {
      const topics = [
        { id: '1', title: 'Introduction to Mindfulness', unlocked: true, completed: true },
        { id: '2', title: 'Breathing Techniques', unlocked: true, completed: currentLevel >= 2 },
        { id: '3', title: 'Emotion Regulation', unlocked: currentLevel >= 3, completed: false },
        { id: '4', title: 'Stress Management', unlocked: currentLevel >= 5, completed: false },
        { id: '5', title: 'Building Resilience', unlocked: currentLevel >= 7, completed: false },
      ];

      const completedCount = topics.filter(t => t.completed).length;
      const progress = (completedCount / topics.length) * 100;

      return {
        id: `path-${userId}`,
        title: 'Mindfulness Mastery Path',
        description: 'A progressive learning journey through wellness techniques',
        topics,
        progress,
      };
    } catch (error) {
      console.error('Error generating learning path:', error);
      return {
        id: `path-${userId}`,
        title: 'Wellness Journey',
        description: 'Your personalized learning path',
        topics: [],
        progress: 0,
      };
    }
  }

  /**
   * Summarize long resource content
   */
  async summarizeResource(content: string): Promise<string> {
    try {
      const prompt = `Summarize this wellness resource content into key points as flashcards (3-5 cards):

"${content}"

Format as JSON:
{
  "cards": [
    {
      "front": "Question or topic",
      "back": "Answer or explanation"
    }
  ]
}`;

      const response = await vertexAIService.generateResponse([{
        role: 'user',
        parts: [{ text: prompt }]
      }]);

      return response; // Return as text for now
    } catch (error) {
      console.error('Error summarizing resource:', error);
      return content.substring(0, 200);
    }
  }
}

export const resourceService = new ResourceService();

