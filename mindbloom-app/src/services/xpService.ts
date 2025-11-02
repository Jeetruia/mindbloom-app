/**
 * XP Service with Google Cloud Storage Integration
 * 
 * Manages XP, levels, achievements, and stores progress in Google Cloud
 */

import { googleCloudStorageService } from './googleCloudStorageService';

export interface XPAction {
  id: string;
  type: 'game' | 'challenge' | 'chat' | 'journal' | 'meditation';
  xp: number;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  xpReward: number;
}

export interface LevelProgress {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progress: number; // 0-100
  xpToNextLevel: number;
}

export class XPService {
  private xpHistory: XPAction[] = [];
  private achievements: Achievement[] = [
    { id: 'first_breath', title: 'First Breath', description: 'Complete your first breathing exercise', icon: '🌬️', xpReward: 50 },
    { id: 'breathing_master', title: 'Breathing Master', description: 'Complete 10 breathing cycles', icon: '🐉', xpReward: 100 },
    { id: 'daily_streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', xpReward: 200 },
    { id: 'gratitude_pro', title: 'Gratitude Pro', description: 'Complete 5 gratitude exercises', icon: '🙏', xpReward: 150 },
    { id: 'meditation_zen', title: 'Zen Master', description: 'Complete 20 meditation sessions', icon: '🧘', xpReward: 300 },
    { id: 'level_5', title: 'Rising Star', description: 'Reach Level 5', icon: '⭐', xpReward: 250 },
    { id: 'level_10', title: 'Champion', description: 'Reach Level 10', icon: '👑', xpReward: 500 },
    { id: 'community_hero', title: 'Community Hero', description: 'Share 5 stories with the community', icon: '💝', xpReward: 200 },
  ];

  /**
   * Calculate XP needed for a level
   */
  private xpForLevel(level: number): number {
    // XP formula: level * 100 (exponential)
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  /**
   * Calculate level from total XP
   */
  calculateLevel(totalXP: number): number {
    let level = 1;
    let xpForNextLevel = this.xpForLevel(level + 1);
    
    while (totalXP >= xpForNextLevel) {
      level++;
      xpForNextLevel = this.xpForLevel(level + 1);
    }
    
    return level;
  }

  /**
   * Get level progress
   */
  getLevelProgress(totalXP: number): LevelProgress {
    const currentLevel = this.calculateLevel(totalXP);
    const xpForCurrentLevel = this.xpForLevel(currentLevel);
    const xpForNextLevel = this.xpForLevel(currentLevel + 1);
    const xpToNextLevel = xpForNextLevel - totalXP;
    const progress = ((totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

    return {
      currentLevel,
      currentXP: totalXP,
      xpForCurrentLevel,
      xpForNextLevel,
      progress: Math.max(0, Math.min(100, progress)),
      xpToNextLevel: Math.max(0, xpToNextLevel),
    };
  }

  /**
   * Add XP and save to Google Cloud
   */
  async addXP(
    userId: string,
    currentXP: number,
    action: Omit<XPAction, 'timestamp'>
  ): Promise<{ newXP: number; newLevel: number; levelUp: boolean; unlockedAchievements: Achievement[] }> {
    const xpAction: XPAction = {
      ...action,
      timestamp: new Date(),
    };

    this.xpHistory.push(xpAction);
    const newXP = currentXP + action.xp;
    const oldLevel = this.calculateLevel(currentXP);
    const newLevel = this.calculateLevel(newXP);
    const levelUp = newLevel > oldLevel;

    // Check for achievements
    const unlockedAchievements = this.checkAchievements(newXP, newLevel, action.type);

    // Save to Google Cloud Storage
    try {
      const progressData = {
        userId,
        xp: newXP,
        level: newLevel,
        action: xpAction,
        unlockedAchievements: unlockedAchievements.map(a => a.id),
        timestamp: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(progressData)], { type: 'application/json' });
      await googleCloudStorageService.uploadAudio(
        blob as any,
        userId,
        'recording',
        `xp-progress-${Date.now()}.json`
      );
    } catch (error) {
      console.error('Error saving XP to Google Cloud:', error);
      // Continue even if save fails
    }

    return {
      newXP,
      newLevel,
      levelUp,
      unlockedAchievements,
    };
  }

  /**
   * Check for unlocked achievements
   */
  private checkAchievements(
    totalXP: number,
    level: number,
    actionType: string
  ): Achievement[] {
    const unlocked: Achievement[] = [];

    // Level achievements
    if (level >= 5 && !this.achievements.find(a => a.id === 'level_5')?.unlockedAt) {
      const achievement = this.achievements.find(a => a.id === 'level_5');
      if (achievement) {
        achievement.unlockedAt = new Date();
        unlocked.push(achievement);
      }
    }

    if (level >= 10 && !this.achievements.find(a => a.id === 'level_10')?.unlockedAt) {
      const achievement = this.achievements.find(a => a.id === 'level_10');
      if (achievement) {
        achievement.unlockedAt = new Date();
        unlocked.push(achievement);
      }
    }

    // Action-based achievements (would need to track history)
    // This is simplified - in production, track action counts

    return unlocked;
  }

  /**
   * Get all achievements
   */
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  /**
   * Get XP history
   */
  getXPHistory(): XPAction[] {
    return [...this.xpHistory].reverse();
  }

  /**
   * Calculate streak (simplified - would need daily tracking)
   */
  calculateStreak(xpHistory: XPAction[]): number {
    // Simplified streak calculation
    // In production, track daily completions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const recentActions = xpHistory.filter(
      action => new Date(action.timestamp) >= today
    );
    
    return recentActions.length > 0 ? 1 : 0;
  }
}

// Export singleton
export const xpService = new XPService();

