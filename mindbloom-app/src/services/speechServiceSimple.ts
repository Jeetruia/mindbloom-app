// Speech types are defined globally

// Simplified Text-to-Speech Service
export class TTSService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
    
    // Prefer female voices for therapist persona
    this.currentVoice = this.voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Karen') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Zira')
    ) || this.voices[0];
  }

  async speak(text: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (this.currentVoice) {
        utterance.voice = this.currentVoice;
      }

      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);

      this.synthesis.speak(utterance);
    });
  }

  stop() {
    this.synthesis.cancel();
  }

  pause() {
    this.synthesis.pause();
  }

  resume() {
    this.synthesis.resume();
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  setVoice(voice: SpeechSynthesisVoice) {
    this.currentVoice = voice;
  }
}

// Simplified Speech-to-Text Service
export class STTService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      
      if (this.recognition) {
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      this.isListening = true;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          this.isListening = false;
          resolve(transcript);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.isListening = false;
        reject(new Error(event.error));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  setLanguage(lang: string) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}

// Simplified Lip Sync Service
export class LipSyncService {
  private audioContext: AudioContext | null = null;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  // Simplified viseme generation based on text analysis
  generateVisemesFromText(text: string): Array<{phoneme: string, startTime: number, endTime: number}> {
    const visemes = [];
    const words = text.toLowerCase().split(/\s+/);
    
    let currentTime = 0;
    
    for (const word of words) {
      const phoneme = this.textToPhoneme(word);
      const duration = Math.max(0.1, word.length * 0.05); // Minimum 100ms
      
      visemes.push({
        phoneme,
        startTime: currentTime,
        endTime: currentTime + duration
      });
      
      currentTime += duration + 0.1; // Small pause between words
    }
    
    return visemes;
  }

  private textToPhoneme(word: string): string {
    // Simplified phoneme mapping based on common sounds
    if (word.includes('a') || word.includes('e') || word.includes('i') || word.includes('o') || word.includes('u')) {
      return 'A'; // Open mouth sounds
    } else if (word.includes('m') || word.includes('b') || word.includes('p')) {
      return 'M'; // Closed mouth sounds
    } else if (word.includes('f') || word.includes('v')) {
      return 'F'; // Lip-teeth sounds
    } else if (word.includes('th')) {
      return 'TH'; // Tongue sounds
    } else {
      return 'A'; // Default to open mouth
    }
  }

  connectToAudioElement(audioElement: HTMLAudioElement) {
    if (!this.audioContext) return;

    try {
      const source = this.audioContext.createMediaElementSource(audioElement);
      source.connect(this.audioContext.destination);
    } catch (error) {
      console.warn('Could not connect audio element:', error);
    }
  }

  getAudioLevel(): number {
    // Simplified audio level detection
    return Math.random() * 0.5 + 0.3; // Random level between 0.3 and 0.8
  }
}
