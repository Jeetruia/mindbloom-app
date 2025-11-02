/**
 * Leaderboard Service - Manages rankings and friend comparisons
 */
export interface LeaderboardEntry {
  userId: string;
  nickname: string;
  avatarLevel: number;
  totalXP: number;
  weeklyXP: number;
  streak: number;
  rank: number;
}

export class LeaderboardService {
  /**
   * Get weekly leaderboard
   */
  async getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
    // In production, fetch from backend/Google Cloud
    // For now, return mock data
    return [
      { userId: '1', nickname: 'WellnessWarrior', avatarLevel: 12, totalXP: 5420, weeklyXP: 850, streak: 15, rank: 1 },
      { userId: '2', nickname: 'CalmSoul', avatarLevel: 11, totalXP: 5100, weeklyXP: 720, streak: 12, rank: 2 },
      { userId: '3', nickname: 'MindfulMe', avatarLevel: 10, totalXP: 4850, weeklyXP: 680, streak: 10, rank: 3 },
      { userId: '4', nickname: 'PeacefulPath', avatarLevel: 9, totalXP: 4520, weeklyXP: 620, streak: 8, rank: 4 },
      { userId: '5', nickname: 'BloomBuddy', avatarLevel: 8, totalXP: 4200, weeklyXP: 580, streak: 7, rank: 5 },
    ];
  }

  /**
   * Get user's position on leaderboard
   */
  async getUserRank(userId: string): Promise<number> {
    const leaderboard = await this.getWeeklyLeaderboard();
    const user = leaderboard.find(entry => entry.userId === userId);
    return user?.rank || 0;
  }

  /**
   * Get friends leaderboard
   */
  async getFriendsLeaderboard(userId: string, friendIds: string[]): Promise<LeaderboardEntry[]> {
    const all = await this.getWeeklyLeaderboard();
    return all.filter(entry => friendIds.includes(entry.userId));
  }
}

export const leaderboardService = new LeaderboardService();

