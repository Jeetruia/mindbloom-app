/**
 * SoundEffect - Plays sound effects (with fallback if Web Audio API unavailable)
 */
export class SoundEffect {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  async playSound(type: 'xp' | 'achievement' | 'levelup' | 'click' | 'success') {
    if (!this.audioContext) return;

    try {
      const frequencies = {
        xp: [800, 1000],
        achievement: [523.25, 659.25, 783.99], // C, E, G
        levelup: [523.25, 659.25, 783.99, 1046.50], // C major chord + octave
        click: [400],
        success: [659.25, 783.99], // E, G
      };

      const freqs = frequencies[type];
      
      freqs.forEach((freq, i) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = type === 'click' ? 'square' : 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.3);
        
        oscillator.start(this.audioContext!.currentTime + i * 0.1);
        oscillator.stop(this.audioContext!.currentTime + 0.3 + i * 0.1);
      });
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }
}

export const soundEffect = new SoundEffect();

