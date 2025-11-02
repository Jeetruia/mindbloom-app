/**
 * ThemeContext - Manages emotional theme and mood-based UI adaptations
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { colors } from '../constants/theme';

type Mood = 'calm' | 'happy' | 'reflective' | 'energetic' | 'peaceful' | 'creative';

interface ThemeContextType {
  mood: Mood;
  setMood: (mood: Mood) => void;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  intensity: number;
  setIntensity: (intensity: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<Mood>('calm');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [intensity, setIntensity] = useState(0.7);

  // Detect time of day
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
      else if (hour >= 17 && hour < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Adjust mood based on time of day
  useEffect(() => {
    if (timeOfDay === 'morning') {
      setMood('energetic');
      setIntensity(0.8);
    } else if (timeOfDay === 'afternoon') {
      setMood('happy');
      setIntensity(0.7);
    } else if (timeOfDay === 'evening') {
      setMood('reflective');
      setIntensity(0.6);
    } else {
      setMood('calm');
      setIntensity(0.5);
    }
  }, [timeOfDay]);

  return (
    <ThemeContext.Provider value={{ mood, setMood, timeOfDay, intensity, setIntensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

