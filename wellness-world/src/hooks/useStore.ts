import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  PixelAvatar, 
  CommunitySpace, 
  CommunityMessage, 
  WellnessChallenge, 
  CommunityAchievement,
  ConversationPrompt,
  CommunityStats,
  User,
  AvatarAppearance,
  MoodState,
  Badge,
  EmpathyPoint
} from '../types';

interface AppState {
  // User & Avatar
  user: User | null;
  avatar: PixelAvatar | null;
  isLoading: boolean;
  
  // Community
  communitySpaces: CommunitySpace[];
  currentSpace: CommunitySpace | null;
  onlineAvatars: PixelAvatar[];
  communityMessages: CommunityMessage[];
  
  // Challenges & Achievements
  wellnessChallenges: WellnessChallenge[];
  achievements: CommunityAchievement[];
  userBadges: Badge[];
  empathyPoints: number;
  
  // Prompts & Stats
  conversationPrompts: ConversationPrompt[];
  communityStats: CommunityStats;
  
  // Actions
  createUser: (userData: { nickname: string; age: number; language: string }) => User;
  createAvatar: (avatarData: { name: string; appearance: AvatarAppearance; mood: MoodState }) => PixelAvatar;
  initializeApp: () => Promise<void>;
  
  // Spaces
  enterSpace: (spaceId: string) => void;
  leaveSpace: () => void;
  
  // Messages
  sendCommunityMessage: (messageData: { content: string; type: string; spaceId: string; isAnonymous: boolean }) => Promise<void>;
  addReaction: (messageId: string, reactionType: string) => Promise<void>;
  
  // Challenges
  joinChallenge: (challengeId: string) => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
  
  // Achievements
  unlockAchievement: (achievementId: string) => Promise<void>;
  addEmpathyPoints: (points: number, source: string) => void;
}

// Mock data generators
const generateMockSpaces = (): CommunitySpace[] => [
  {
    id: 'garden',
    name: 'Mindful Garden',
    type: 'garden',
    description: 'A peaceful space for reflection and growth',
    capacity: 50,
    currentOccupancy: 12,
    theme: 'nature',
    activities: [
      {
        id: 'meditation',
        name: 'Guided Meditation',
        type: 'meditation',
        description: 'Join a group meditation session',
        duration: 15,
        xpReward: 50,
        participants: [],
        maxParticipants: 20,
        isActive: true
      }
    ],
    isActive: true
  },
  {
    id: 'library',
    name: 'Wisdom Library',
    type: 'library',
    description: 'Share knowledge and stories',
    capacity: 30,
    currentOccupancy: 8,
    theme: 'learning',
    activities: [
      {
        id: 'story-sharing',
        name: 'Story Sharing Circle',
        type: 'conversation',
        description: 'Share personal stories and experiences',
        duration: 30,
        xpReward: 75,
        participants: [],
        maxParticipants: 15,
        isActive: true
      }
    ],
    isActive: true
  },
  {
    id: 'cafe',
    name: 'Cozy Cafe',
    type: 'cafe',
    description: 'Casual conversations and coffee chats',
    capacity: 40,
    currentOccupancy: 15,
    theme: 'social',
    activities: [
      {
        id: 'coffee-chat',
        name: 'Coffee & Chat',
        type: 'conversation',
        description: 'Casual conversations with community members',
        duration: 20,
        xpReward: 30,
        participants: [],
        maxParticipants: 25,
        isActive: true
      }
    ],
    isActive: true
  },
  {
    id: 'workshop',
    name: 'Creative Workshop',
    type: 'workshop',
    description: 'Learn new skills and create art',
    capacity: 25,
    currentOccupancy: 6,
    theme: 'creativity',
    activities: [
      {
        id: 'art-therapy',
        name: 'Art Therapy Session',
        type: 'art',
        description: 'Express yourself through creative art',
        duration: 45,
        xpReward: 100,
        participants: [],
        maxParticipants: 12,
        isActive: true
      }
    ],
    isActive: true
  },
  {
    id: 'sanctuary',
    name: 'Peaceful Sanctuary',
    type: 'sanctuary',
    description: 'Find peace and connect with your inner self',
    capacity: 20,
    currentOccupancy: 4,
    theme: 'peace',
    activities: [
      {
        id: 'breathing-exercise',
        name: 'Breathing Exercise',
        type: 'meditation',
        description: 'Practice mindful breathing techniques',
        duration: 10,
        xpReward: 25,
        participants: [],
        maxParticipants: 10,
        isActive: true
      }
    ],
    isActive: true
  },
  {
    id: 'playground',
    name: 'Joy Playground',
    type: 'playground',
    description: 'Have fun and celebrate joy',
    capacity: 60,
    currentOccupancy: 22,
    theme: 'fun',
    activities: [
      {
        id: 'joy-celebration',
        name: 'Joy Celebration',
        type: 'conversation',
        description: 'Share moments of joy and celebration',
        duration: 25,
        xpReward: 40,
        participants: [],
        maxParticipants: 30,
        isActive: true
      }
    ],
    isActive: true
  }
];

const generateMockChallenges = (): WellnessChallenge[] => [
  {
    id: 'daily-gratitude',
    title: 'Daily Gratitude Practice',
    description: 'Share one thing you\'re grateful for each day',
    type: 'daily',
    category: 'gratitude',
    difficulty: 'easy',
    xpReward: 25,
    participants: [],
    completions: [],
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'mindful-moments',
    title: 'Mindful Moments',
    description: 'Practice 5 minutes of mindfulness daily',
    type: 'daily',
    category: 'mindfulness',
    difficulty: 'easy',
    xpReward: 30,
    participants: [],
    completions: [],
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'community-support',
    title: 'Community Support',
    description: 'Offer support to at least one community member',
    type: 'weekly',
    category: 'support',
    difficulty: 'medium',
    xpReward: 75,
    participants: [],
    completions: [],
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
];

const generateMockAchievements = (): CommunityAchievement[] => [
  {
    id: 'first-message',
    title: 'First Steps',
    description: 'Send your first message to the community',
    icon: '👋',
    category: 'openness',
    requirements: [
      { type: 'messages_sent', value: 1 }
    ],
    rewards: [
      { type: 'xp', value: 50 },
      { type: 'badge', value: { name: 'Newcomer', rarity: 'common' } }
    ],
    unlockedBy: []
  },
  {
    id: 'empathy-champion',
    title: 'Empathy Champion',
    description: 'Earn 100 empathy points',
    icon: '💝',
    category: 'empathy',
    requirements: [
      { type: 'empathy_points', value: 100 }
    ],
    rewards: [
      { type: 'xp', value: 200 },
      { type: 'badge', value: { name: 'Empathy Champion', rarity: 'rare' } }
    ],
    unlockedBy: []
  },
  {
    id: 'community-builder',
    title: 'Community Builder',
    description: 'Help 10 community members',
    icon: '🤝',
    category: 'support',
    requirements: [
      { type: 'support_given', value: 10 }
    ],
    rewards: [
      { type: 'xp', value: 300 },
      { type: 'badge', value: { name: 'Community Builder', rarity: 'epic' } }
    ],
    unlockedBy: []
  }
];

const generateMockPrompts = (): ConversationPrompt[] => [
  {
    id: 'daily-check-in',
    category: 'daily-check-in',
    question: 'How are you feeling today?',
    followUpQuestions: [
      'What\'s contributing to how you feel?',
      'Is there anything you\'d like support with?'
    ],
    suggestedResponses: [
      'I\'m feeling great!',
      'I\'m doing okay',
      'I\'m struggling a bit',
      'I need some support'
    ],
    empathyTriggers: ['struggling', 'support', 'difficult']
  },
  {
    id: 'gratitude',
    category: 'gratitude',
    question: 'What\'s one thing you\'re grateful for today?',
    followUpQuestions: [
      'How does gratitude make you feel?',
      'Would you like to share more?'
    ],
    suggestedResponses: [
      'My family and friends',
      'A beautiful day',
      'Good health',
      'Learning something new'
    ],
    empathyTriggers: ['family', 'friends', 'health']
  },
  {
    id: 'challenges',
    category: 'challenges',
    question: 'What\'s a challenge you\'re working through?',
    followUpQuestions: [
      'How are you handling it?',
      'What support do you need?'
    ],
    suggestedResponses: [
      'Work stress',
      'Relationship issues',
      'Health concerns',
      'Personal growth'
    ],
    empathyTriggers: ['stress', 'issues', 'concerns']
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      avatar: null,
      isLoading: true,
      communitySpaces: generateMockSpaces(),
      currentSpace: null,
      onlineAvatars: [],
      communityMessages: [],
      wellnessChallenges: generateMockChallenges(),
      achievements: generateMockAchievements(),
      userBadges: [],
      empathyPoints: 0,
      conversationPrompts: generateMockPrompts(),
      communityStats: {
        totalUsers: 1247,
        activeUsers: 89,
        messagesToday: 342,
        supportGivenToday: 156,
        challengesCompletedToday: 78,
        empathyPointsToday: 1247,
        averageMood: 7.2,
        communityHealth: 'excellent'
      },

      // Actions
      createUser: (userData) => {
        const user: User = {
          id: Date.now().toString(),
          nickname: userData.nickname,
          age: userData.age,
          language: userData.language,
          avatarLevel: 1,
          xp: 0,
          streak: 1,
          createdAt: new Date()
        };
        set({ user });
        return user;
      },

      createAvatar: (avatarData) => {
        const avatar: PixelAvatar = {
          id: Date.now().toString(),
          userId: get().user?.id || '',
          name: avatarData.name,
          appearance: avatarData.appearance,
          mood: avatarData.mood,
          level: 1,
          xp: 0,
          badges: [],
          lastActive: new Date(),
          isOnline: true
        };
        set({ avatar });
        return avatar;
      },

      initializeApp: async () => {
        set({ isLoading: true });
        
        try {
          // Simulate loading time
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Generate some online avatars
          const onlineAvatars: PixelAvatar[] = Array.from({ length: 15 }, (_, i) => ({
            id: `online-${i}`,
            userId: `user-${i}`,
            name: `Avatar${i + 1}`,
            appearance: {
              skinTone: '#fdbcb4',
              hairColor: '#8b4513',
              hairStyle: 'straight',
              eyeColor: '#4a90e2',
              clothing: '#4a90e2',
              accessories: [],
              expression: 'happy'
            },
            mood: {
              current: 'good',
              energy: 80,
              social: 70,
              emotional: 75,
              lastUpdated: new Date()
            },
            level: Math.floor(Math.random() * 10) + 1,
            xp: Math.floor(Math.random() * 1000),
            badges: [],
            lastActive: new Date(),
            isOnline: true
          }));

          set({ 
            onlineAvatars,
            isLoading: false 
          });
        } catch (error) {
          console.error('Error initializing app:', error);
          set({ isLoading: false });
        }
      },

      enterSpace: (spaceId) => {
        const space = get().communitySpaces.find(s => s.id === spaceId);
        if (space) {
          set({ currentSpace: space });
        }
      },

      leaveSpace: () => {
        set({ currentSpace: null });
      },

      sendCommunityMessage: async (messageData) => {
        const message: CommunityMessage = {
          id: Date.now().toString(),
          userId: get().user?.id || 'anonymous',
          avatarId: get().avatar?.id || 'anonymous',
          content: messageData.content,
          type: messageData.type as any,
          timestamp: new Date(),
          spaceId: messageData.spaceId,
          isAnonymous: messageData.isAnonymous,
          reactions: [],
          replies: []
        };

        set(state => ({
          communityMessages: [...state.communityMessages, message]
        }));
      },

      addReaction: async (messageId, reactionType) => {
        set(state => ({
          communityMessages: state.communityMessages.map(msg => 
            msg.id === messageId 
              ? {
                  ...msg,
                  reactions: [
                    ...msg.reactions,
                    {
                      userId: get().user?.id || 'anonymous',
                      type: reactionType as any,
                      timestamp: new Date()
                    }
                  ]
                }
              : msg
          )
        }));
      },

      joinChallenge: async (challengeId) => {
        set(state => ({
          wellnessChallenges: state.wellnessChallenges.map(challenge =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  participants: [...challenge.participants, get().user?.id || 'anonymous']
                }
              : challenge
          )
        }));
      },

      completeChallenge: async (challengeId) => {
        const challenge = get().wellnessChallenges.find(c => c.id === challengeId);
        if (challenge) {
          const completion = {
            userId: get().user?.id || 'anonymous',
            completedAt: new Date(),
            reflection: 'Completed the challenge!',
            xpEarned: challenge.xpReward,
            sharedPublicly: true
          };

          set(state => ({
            wellnessChallenges: state.wellnessChallenges.map(c =>
              c.id === challengeId
                ? {
                    ...c,
                    completions: [...c.completions, completion]
                  }
                : c
            )
          }));

          // Add XP to avatar
          if (get().avatar) {
            set(state => ({
              avatar: state.avatar ? {
                ...state.avatar,
                xp: state.avatar.xp + challenge.xpReward
              } : null
            }));
          }
        }
      },

      unlockAchievement: async (achievementId) => {
        set(state => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId
              ? {
                  ...achievement,
                  unlockedBy: [...achievement.unlockedBy, get().user?.id || 'anonymous']
                }
              : achievement
          )
        }));
      },

      addEmpathyPoints: (points, source) => {
        set(state => ({
          empathyPoints: state.empathyPoints + points
        }));
      }
    }),
    {
      name: 'wellness-world-storage',
      partialize: (state) => ({
        user: state.user,
        avatar: state.avatar,
        userBadges: state.userBadges,
        empathyPoints: state.empathyPoints
      })
    }
  )
);
