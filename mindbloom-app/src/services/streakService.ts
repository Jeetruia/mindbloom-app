/**
 * Streak Service - Manages daily streaks and multipliers
 */
import { googleCloudStorageService } from './googleCloudStorageService';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakMultiplier: number; // 1.0 to 1.7 (10% per day, max 7 days)
}

export class StreakService {
  /**
   * Get or initialize streak data
   */
  async getStreak(userId: string): Promise<StreakData> {
    try {
      // In production, load from Google Cloud Storage
      const stored = localStorage.getItem(`streak-${userId}`);
      if (stored) {
        const data: StreakData = JSON.parse(stored);
        return this.updateStreak(userId, data);
      }
      
      // Initialize
      const newStreak: StreakData = {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString().split('T')[0],
        streakMultiplier: 1.0,
      };
      
      return this.updateStreak(userId, newStreak);
    } catch (error) {
      console.error('Error getting streak:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString().split('T')[0],
        streakMultiplier: 1.0,
      };
    }
  }

  /**
   * Update streak based on activity
   */
  async updateStreak(userId: string, data: StreakData): Promise<StreakData> {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = new Date(data.lastActivityDate);
    const todayDate = new Date(today);
    
    const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day - no change
      return data;
    } else if (daysDiff === 1) {
      // Consecutive day - increment streak
      const newStreak = data.currentStreak + 1;
      const multiplier = Math.min(1.0 + (newStreak * 0.1), 1.7); // Max 70% bonus
      
      const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, data.longestStreak),
        lastActivityDate: today,
        streakMultiplier: multiplier,
      };
      
      await this.saveStreak(userId, updated);
      return updated;
    } else {
      // Streak broken
      const updated: StreakData = {
        currentStreak: 1,
        longestStreak: data.longestStreak,
        lastActivityDate: today,
        streakMultiplier: 1.0,
      };
      
      await this.saveStreak(userId, updated);
      return updated;
    }
  }

  /**
   * Record activity for today
   */
  async recordActivity(userId: string): Promise<StreakData> {
    const currentStreak = await this.getStreak(userId);
    return this.updateStreak(userId, currentStreak);
  }

  /**
   * Get streak multiplier for XP bonus
   */
  async getMultiplier(userId: string): Promise<number> {
    const streak = await this.getStreak(userId);
    return streak.streakMultiplier;
  }

  /**
   * Save streak data
   */
  private async saveStreak(userId: string, data: StreakData): Promise<void> {
    try {
      // Save to localStorage
      localStorage.setItem(`streak-${userId}`, JSON.stringify(data));
      
      // Save to Google Cloud Storage
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      await googleCloudStorageService.uploadAudio(
        blob as any,
        userId,
        'wellness',
        `streak-${Date.now()}.json`
      );
    } catch (error) {
      console.error('Error saving streak:', error);
    }
  }
}

export const streakService = new StreakService();

