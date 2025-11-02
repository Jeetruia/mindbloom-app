/**
 * MindBloom Design System
 * Soft-futuristic, emotionally intelligent design tokens
 */

export const colors = {
  // Primary Palette - Bloom-inspired
  bloom: {
    pink: '#FF8FA3',
    peach: '#FFB88C',
    lavender: '#B19CD9',
    mint: '#A8E6CF',
    sky: '#87CEEB',
    violet: '#9B8FB8',
  },
  
  // Mood Colors
  mood: {
    calm: '#87CEEB',      // Sky blue
    happy: '#FFB88C',     // Peach
    reflective: '#B19CD9', // Lavender
    energetic: '#FF8FA3',  // Pink
    peaceful: '#A8E6CF',   // Mint
    creative: '#D4A5F7',   // Soft purple
  },
  
  // Gradients
  gradients: {
    bloom: 'from-pink-300 via-peach-300 to-lavender-300',
    calm: 'from-sky-300 via-mint-300 to-lavender-300',
    energetic: 'from-pink-400 via-peach-400 to-violet-400',
    peaceful: 'from-mint-300 via-sky-300 to-lavender-300',
    sunrise: 'from-peach-300 via-pink-300 to-lavender-300',
    sunset: 'from-violet-400 via-pink-400 to-peach-400',
  },
  
  // Glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Backgrounds
  bg: {
    primary: '#FEF7F0',      // Warm cream
    secondary: '#FFF9F5',   // Soft white
    tertiary: '#F5F0FF',    // Lavender tint
    dark: '#2D1B3D',        // Deep purple
  },
};

export const fonts = {
  primary: "'Poppins', sans-serif",
  secondary: "'Baloo 2', cursive",
  display: "'Outfit', sans-serif",
};

export const animations = {
  bloom: {
    duration: 0.6,
    easing: [0.34, 1.56, 0.64, 1], // Custom bloom easing
  },
  float: {
    duration: 3,
    repeat: 'Infinity',
    ease: 'easeInOut',
  },
  pulse: {
    duration: 2,
    repeat: 'Infinity',
    ease: 'easeInOut',
  },
};

export const shadows = {
  bloom: '0 10px 40px rgba(255, 143, 163, 0.2)',
  glow: '0 0 20px rgba(255, 143, 163, 0.4)',
  soft: '0 4px 20px rgba(0, 0, 0, 0.08)',
  glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
};

