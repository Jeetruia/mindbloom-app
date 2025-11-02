/**
 * GamificationContext - Manages XP, levels, achievements, and rewards
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { xpService, XPAction } from '../services/xpService';

interface GamificationContextType {
  xp: number;
  level: number;
  addXP: (action: XPAction) => Promise<void>;
  achievements: any[];
  unlockAchievement: (achievementId: string) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState<any[]>([]);

  const addXP = async (action: XPAction) => {
    try {
      const result = await xpService.addXP('user-id', xp, action);
      setXp(result.newXP);
      setLevel(result.newLevel);
      
      // Check for achievements - XP service will handle this internally
      // We can trigger achievement notifications here if needed
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };

  const unlockAchievement = (achievementId: string) => {
    // Trigger achievement unlock animation
    setAchievements(prev => {
      if (!prev.find(a => a.id === achievementId)) {
        return [...prev, { id: achievementId, unlockedAt: new Date() }];
      }
      return prev;
    });
  };

  return (
    <GamificationContext.Provider value={{ xp, level, addXP, achievements, unlockAchievement }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
}

