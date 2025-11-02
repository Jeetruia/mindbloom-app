/**
 * Reward Service - Manages rewards store and redemption
 */
export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  cost: number; // XP cost
  type: 'theme' | 'avatar' | 'sound' | 'badge' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}

export interface RewardsStore {
  rewards: Reward[];
  userXP: number;
}

export class RewardService {
  private rewards: Reward[] = [
    // Themes
    { id: 'theme-sunset', title: 'Sunset Theme', description: 'Warm orange and pink gradients', icon: '🌅', cost: 100, type: 'theme', rarity: 'common', unlocked: false },
    { id: 'theme-ocean', title: 'Ocean Theme', description: 'Calming blues and teals', icon: '🌊', cost: 150, type: 'theme', rarity: 'common', unlocked: false },
    { id: 'theme-forest', title: 'Forest Theme', description: 'Nature greens and browns', icon: '🌲', cost: 200, type: 'theme', rarity: 'rare', unlocked: false },
    
    // Avatar Effects
    { id: 'effect-glitter', title: 'Glitter Effect', description: 'Sparkly avatar particles', icon: '✨', cost: 250, type: 'effect', rarity: 'rare', unlocked: false },
    { id: 'effect-rainbow', title: 'Rainbow Aura', description: 'Colorful glow around avatar', icon: '🌈', cost: 500, type: 'effect', rarity: 'epic', unlocked: false },
    
    // Sounds
    { id: 'sound-chimes', title: 'Chime Pack', description: 'Gentle bell sounds', icon: '🔔', cost: 150, type: 'sound', rarity: 'common', unlocked: false },
    { id: 'sound-nature', title: 'Nature Sounds', description: 'Birds, water, wind', icon: '🐦', cost: 200, type: 'sound', rarity: 'common', unlocked: false },
    
    // Badges
    { id: 'badge-warrior', title: 'Warrior Badge', description: 'For completing 10 challenges', icon: '⚔️', cost: 300, type: 'badge', rarity: 'rare', unlocked: false },
    { id: 'badge-zen', title: 'Zen Master Badge', description: 'For 30-day streak', icon: '🧘', cost: 1000, type: 'badge', rarity: 'legendary', unlocked: false },
  ];

  /**
   * Get all available rewards
   */
  getRewards(): Reward[] {
    return this.rewards;
  }

  /**
   * Purchase a reward
   */
  async purchaseReward(userId: string, rewardId: string, userXP: number): Promise<{
    success: boolean;
    message: string;
    remainingXP: number;
  }> {
    const reward = this.rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return { success: false, message: 'Reward not found', remainingXP: userXP };
    }
    
    if (reward.unlocked) {
      return { success: false, message: 'Already unlocked', remainingXP: userXP };
    }
    
    if (userXP < reward.cost) {
      return { success: false, message: 'Not enough XP', remainingXP: userXP };
    }
    
    // Unlock reward
    reward.unlocked = true;
    const remainingXP = userXP - reward.cost;
    
    // Save to storage
    this.saveRewards(userId);
    
    return {
      success: true,
      message: `Unlocked ${reward.title}!`,
      remainingXP,
    };
  }

  /**
   * Save rewards to storage
   */
  private async saveRewards(userId: string): Promise<void> {
    try {
      localStorage.setItem(`rewards-${userId}`, JSON.stringify(this.rewards));
    } catch (error) {
      console.error('Error saving rewards:', error);
    }
  }

  /**
   * Load rewards from storage
   */
  async loadRewards(userId: string): Promise<Reward[]> {
    try {
      const stored = localStorage.getItem(`rewards-${userId}`);
      if (stored) {
        this.rewards = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading rewards:', error);
    }
    return this.rewards;
  }
}

export const rewardService = new RewardService();

