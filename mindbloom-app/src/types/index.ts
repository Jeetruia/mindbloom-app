// Core types for the MindBloom app

export interface User {
  id: string;
  nickname: string;
  age: number;
  language: string;
  avatarLevel: number;
  xp: number;
  streak: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  emotion?: Emotion;
}

export interface Emotion {
  type: 'happy' | 'sad' | 'neutral' | 'concerned' | 'encouraging' | 'welcoming';
  intensity: number; // 0-1
}

export interface AvatarState {
  isVisible: boolean;
  isSpeaking: boolean;
  currentAnimation: string;
  emotion: Emotion;
  position: { x: number; y: number; z: number };
}

export interface WellnessSession {
  id: string;
  userId: string;
  type: 'chat' | 'breathing' | 'journaling' | 'exercise';
  duration: number; // in minutes
  xpEarned: number;
  completedAt: Date;
  notes?: string;
}

export interface CrisisDetection {
  keywords: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'monitor' | 'escalate' | 'emergency';
}

export interface TTSConfig {
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
}

export interface LipSyncData {
  visemes: Viseme[];
  duration: number;
}

export interface Viseme {
  phoneme: string;
  startTime: number;
  endTime: number;
  intensity: number;
}

export interface CBTExercise {
  id: string;
  title: string;
  description: string;
  type: 'thought_challenge' | 'breathing' | 'mindfulness' | 'journaling';
  duration: number;
  xpReward: number;
  instructions: string[];
}

export interface UserProgress {
  totalSessions: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  completedExercises: string[];
  unlockedAnimations: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  xpReward: number;
}
