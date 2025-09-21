// Core types for WellnessWorld community platform

export interface PixelAvatar {
  id: string;
  userId: string;
  name: string;
  appearance: AvatarAppearance;
  mood: MoodState;
  level: number;
  xp: number;
  badges: Badge[];
  lastActive: Date;
  isOnline: boolean;
}

export interface AvatarAppearance {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  clothing: string;
  accessories: string[];
  expression: 'happy' | 'neutral' | 'thoughtful' | 'concerned' | 'supportive';
}

export interface MoodState {
  current: 'great' | 'good' | 'okay' | 'struggling' | 'need-support';
  energy: number; // 0-100
  social: number; // 0-100
  emotional: number; // 0-100
  lastUpdated: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface CommunitySpace {
  id: string;
  name: string;
  type: 'garden' | 'library' | 'cafe' | 'workshop' | 'sanctuary' | 'playground';
  description: string;
  capacity: number;
  currentOccupancy: number;
  theme: string;
  activities: Activity[];
  isActive: boolean;
}

export interface Activity {
  id: string;
  name: string;
  type: 'conversation' | 'challenge' | 'meditation' | 'journaling' | 'art' | 'movement';
  description: string;
  duration: number; // minutes
  xpReward: number;
  participants: string[];
  maxParticipants: number;
  isActive: boolean;
  prompts?: ConversationPrompt[];
}

export interface ConversationPrompt {
  id: string;
  category: 'daily-check-in' | 'gratitude' | 'challenges' | 'celebrations' | 'support';
  question: string;
  followUpQuestions: string[];
  suggestedResponses: string[];
  empathyTriggers: string[];
}

export interface CommunityMessage {
  id: string;
  userId: string;
  avatarId: string;
  content: string;
  type: 'text' | 'reaction' | 'support' | 'celebration';
  timestamp: Date;
  spaceId: string;
  isAnonymous: boolean;
  reactions: Reaction[];
  replies: CommunityMessage[];
}

export interface Reaction {
  userId: string;
  type: 'heart' | 'hug' | 'lightbulb' | 'rainbow' | 'sunshine' | 'butterfly';
  timestamp: Date;
}

export interface WellnessChallenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'community';
  category: 'mindfulness' | 'connection' | 'movement' | 'creativity' | 'gratitude';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  participants: string[];
  completions: ChallengeCompletion[];
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface ChallengeCompletion {
  userId: string;
  completedAt: Date;
  reflection: string;
  xpEarned: number;
  sharedPublicly: boolean;
}

export interface CommunityAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'empathy' | 'openness' | 'support' | 'growth' | 'community';
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  unlockedBy: string[];
}

export interface AchievementRequirement {
  type: 'messages_sent' | 'support_given' | 'challenges_completed' | 'days_active' | 'empathy_points';
  value: number;
  timeframe?: string;
}

export interface AchievementReward {
  type: 'xp' | 'badge' | 'avatar_item' | 'space_access';
  value: any;
}

export interface EmpathyPoint {
  userId: string;
  points: number;
  source: 'support_given' | 'vulnerability_shared' | 'active_listening' | 'encouragement';
  timestamp: Date;
  fromUserId?: string; // if given by another user
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reportedMessageId?: string;
  reason: 'harassment' | 'inappropriate' | 'spam' | 'crisis' | 'other';
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
}

export interface CrisisSupport {
  id: string;
  userId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  actionTaken: 'monitored' | 'community_support' | 'professional_referral' | 'emergency_contact';
  resourcesProvided: string[];
  followUpRequired: boolean;
}

export interface CommunityStats {
  totalUsers: number;
  activeUsers: number;
  messagesToday: number;
  supportGivenToday: number;
  challengesCompletedToday: number;
  empathyPointsToday: number;
  averageMood: number;
  communityHealth: 'excellent' | 'good' | 'fair' | 'needs-attention';
}
