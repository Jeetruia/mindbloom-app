// Speech types are defined globally

// Text-to-Speech Service
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
      voice.name.includes('Samantha')
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

// Speech-to-Text Service
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

// Lip Sync Service
export class LipSyncService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  generateVisemes(audioBuffer: AudioBuffer): Array<{phoneme: string, startTime: number, endTime: number}> {
    // Simplified viseme generation based on audio analysis
    const visemes = [];
    const duration = audioBuffer.duration;
    const sampleRate = audioBuffer.sampleRate;
    const samplesPerViseme = Math.floor(sampleRate * 0.1); // 100ms per viseme

    for (let i = 0; i < duration * 10; i++) {
      const startTime = i * 0.1;
      const endTime = startTime + 0.1;
      
      // Analyze audio data to determine phoneme
      const phoneme = this.analyzePhoneme(audioBuffer, startTime, endTime);
      
      visemes.push({
        phoneme,
        startTime,
        endTime
      });
    }

    return visemes;
  }

  private analyzePhoneme(audioBuffer: AudioBuffer, startTime: number, endTime: number): string {
    // Simplified phoneme detection based on frequency analysis
    const startSample = Math.floor(startTime * audioBuffer.sampleRate);
    const endSample = Math.floor(endTime * audioBuffer.sampleRate);
    
    const channelData = audioBuffer.getChannelData(0);
    const segment = channelData.slice(startSample, endSample);
    
    // Calculate RMS (Root Mean Square) for volume
    const rms = Math.sqrt(segment.reduce((sum, sample) => sum + sample * sample, 0) / segment.length);
    
    // Calculate spectral centroid for brightness
    const fft = this.performFFT(segment);
    const spectralCentroid = this.calculateSpectralCentroid(fft);
    
    // Map audio characteristics to phonemes
    if (rms < 0.01) return 'silence';
    if (spectralCentroid > 0.7) return 'A'; // Open mouth sounds
    if (spectralCentroid > 0.5) return 'E'; // Mid-open sounds
    if (spectralCentroid > 0.3) return 'I'; // Closed sounds
    return 'O'; // Closed mouth sounds
  }

  private performFFT(signal: Float32Array): Float32Array {
    // Simplified FFT implementation
    // In a real implementation, you'd use a proper FFT library
    return new Float32Array(signal.length);
  }

  private calculateSpectralCentroid(fft: Float32Array): number {
    // Simplified spectral centroid calculation
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < fft.length; i++) {
      const magnitude = Math.abs(fft[i]);
      weightedSum += i * magnitude;
      magnitudeSum += magnitude;
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum / fft.length : 0;
  }

  connectToAudioElement(audioElement: HTMLAudioElement) {
    if (!this.audioContext || !this.analyser) return;

    const source = this.audioContext.createMediaElementSource(audioElement);
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  getAudioLevel(): number {
    if (!this.analyser || !this.dataArray) return 0;

    this.analyser.getByteFrequencyData(this.dataArray);
    
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    
    return sum / this.dataArray.length / 255;
  }
}
