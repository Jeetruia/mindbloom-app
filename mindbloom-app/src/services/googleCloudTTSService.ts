/**
 * Google Cloud Text-to-Speech Service
 * 
 * Provides natural-sounding voices with better quality than browser TTS
 * Supports SSML, multiple voices, and audio effects
 */

interface VoiceConfig {
  languageCode: string;
  name?: string;
  ssmlGender?: 'SSML_VOICE_GENDER_UNSPECIFIED' | 'MALE' | 'FEMALE' | 'NEUTRAL';
}

interface TTSOptions {
  voice?: VoiceConfig;
  audioConfig?: {
    audioEncoding: 'MP3' | 'LINEAR16' | 'OGG_OPUS' | 'AUDIO_ENCODING_UNSPECIFIED';
    speakingRate?: number; // 0.25 to 4.0
    pitch?: number; // -20.0 to 20.0
    volumeGainDb?: number; // -96.0 to 16.0
    sampleRateHertz?: number; // 16000, 22050, 24000, 44100, 48000
  };
  enableTimePointing?: boolean;
}

class GoogleCloudTTSService {
  private proxyUrl: string | null;
  private defaultVoice: VoiceConfig;
  private defaultOptions: TTSOptions;
  private currentLanguage: string;

  constructor() {
    this.proxyUrl = process.env.REACT_APP_GOOGLE_CLOUD_PROXY_URL || null;
    
    // Get language from user settings or default to English
    const storedLang = localStorage.getItem('mindbloom-language') || 'en';
    this.currentLanguage = storedLang;
    
    // Get voice configuration for current language
    const { languageService } = require('./languageService');
    const langConfig = languageService.getLanguageConfig(storedLang);
    
    // Default to a warm, empathetic female voice (similar to therapist persona)
    this.defaultVoice = {
      languageCode: langConfig.ttsVoiceCode,
      name: langConfig.ttsVoiceName, // Natural female voice
      ssmlGender: 'FEMALE',
    };

    this.defaultOptions = {
      voice: this.defaultVoice,
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9, // Slightly slower for calm, empathetic tone
        pitch: 0, // Natural pitch
        volumeGainDb: 0,
        sampleRateHertz: 24000,
      },
    };
  }

  /**
   * Synthesize speech from text
   */
  async synthesize(
    text: string,
    options?: Partial<TTSOptions>
  ): Promise<Blob> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Text-to-Speech proxy not configured. Please set REACT_APP_GOOGLE_CLOUD_PROXY_URL');
    }

    const ttsOptions = {
      ...this.defaultOptions,
      ...options,
      voice: { ...this.defaultVoice, ...options?.voice },
      audioConfig: { ...this.defaultOptions.audioConfig, ...options?.audioConfig },
    };

    const response = await fetch(`${this.proxyUrl}/text-to-speech/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: ttsOptions.voice,
        audioConfig: ttsOptions.audioConfig,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Text-to-Speech error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Decode base64 audio
    const audioBytes = this.base64ToBlob(data.audioContent, 'audio/mpeg');
    return audioBytes;
  }

  /**
   * Synthesize speech with SSML (for advanced voice control)
   */
  async synthesizeSSML(
    ssml: string,
    options?: Partial<TTSOptions>
  ): Promise<Blob> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Text-to-Speech proxy not configured');
    }

    const ttsOptions = {
      ...this.defaultOptions,
      ...options,
      voice: { ...this.defaultVoice, ...options?.voice },
      audioConfig: { ...this.defaultOptions.audioConfig, ...options?.audioConfig },
    };

    const response = await fetch(`${this.proxyUrl}/text-to-speech/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { ssml },
        voice: ttsOptions.voice,
        audioConfig: ttsOptions.audioConfig,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Text-to-Speech SSML error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const audioBytes = this.base64ToBlob(data.audioContent, 'audio/mpeg');
    return audioBytes;
  }

  /**
   * Speak text (play audio immediately)
   */
  async speak(
    text: string,
    options?: Partial<TTSOptions>
  ): Promise<void> {
    const audioBlob = await this.synthesize(text, options);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      audio.play().catch(reject);
    });
  }

  /**
   * Get available voices for a language
   */
  async getVoices(languageCode?: string): Promise<Array<{
    name: string;
    ssmlGender: string;
    naturalSampleRateHertz: number;
    languageCodes: string[];
  }>> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Text-to-Speech proxy not configured');
    }

    const response = await fetch(
      `${this.proxyUrl}/text-to-speech/voices${languageCode ? `?languageCode=${languageCode}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Get voices error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.voices || [];
  }

  /**
   * Set voice by name
   */
  setVoice(voiceName: string, languageCode: string = 'en-US') {
    this.defaultVoice = {
      languageCode,
      name: voiceName,
      ssmlGender: 'FEMALE',
    };
  }

  /**
   * Set speaking rate
   */
  setSpeakingRate(rate: number) {
    if (this.defaultOptions.audioConfig) {
      this.defaultOptions.audioConfig.speakingRate = Math.max(0.25, Math.min(4.0, rate));
    }
  }

  /**
   * Set pitch
   */
  setPitch(pitch: number) {
    if (this.defaultOptions.audioConfig) {
      this.defaultOptions.audioConfig.pitch = Math.max(-20.0, Math.min(20.0, pitch));
    }
  }

  /**
   * Set language for TTS
   */
  setLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
    // Get voice configuration for language
    const { languageService } = require('./languageService');
    const langConfig = languageService.getLanguageConfig(languageCode);
    
    this.defaultVoice = {
      languageCode: langConfig.ttsVoiceCode,
      name: langConfig.ttsVoiceName,
      ssmlGender: 'FEMALE',
    };
    
    // Update default options
    this.defaultOptions = {
      ...this.defaultOptions,
      voice: this.defaultVoice,
    };
  }

  /**
   * Convert base64 to blob
   */
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}

/**
 * Hybrid TTS Service
 * Falls back to browser TTS if Google Cloud is not available
 */
export class HybridTTSService {
  private googleCloudService: GoogleCloudTTSService;
  private browserService: any; // Browser TTS (will be injected)
  private useGoogleCloud: boolean;

  constructor() {
    this.googleCloudService = new GoogleCloudTTSService();
    this.useGoogleCloud = !!process.env.REACT_APP_GOOGLE_CLOUD_PROXY_URL;
  }

  /**
   * Set browser TTS service (from speechServiceSimple)
   */
  setBrowserService(browserService: any) {
    this.browserService = browserService;
  }

  /**
   * Set language for TTS
   */
  setLanguage(languageCode: string): void {
    this.googleCloudService.setLanguage(languageCode);
    // Also update browser service if available
    if (this.browserService && this.browserService.setLanguage) {
      this.browserService.setLanguage(languageCode);
    }
  }

  /**
   * Speak text with automatic fallback
   */
  async speak(
    text: string,
    options?: Partial<TTSOptions> & { rate?: number; pitch?: number; volume?: number }
  ): Promise<void> {
    if (this.useGoogleCloud) {
      try {
        // Convert browser options to Google Cloud options
        const ttsOptions: Partial<TTSOptions> = {};
        
        // Ensure audioConfig is properly initialized with required audioEncoding
        if (options?.rate !== undefined || options?.pitch !== undefined) {
          ttsOptions.audioConfig = {
            audioEncoding: 'MP3', // Required property
            ...(options?.rate !== undefined && { speakingRate: options.rate }),
            ...(options?.pitch !== undefined && { pitch: options.pitch * 20 }), // Convert -1 to 1 scale to -20 to 20
          };
        }

        await this.googleCloudService.speak(text, ttsOptions);
        return;
      } catch (error) {
        console.warn('Google Cloud TTS failed, falling back to browser:', error);
        // Fall through to browser TTS
      }
    }

    // Fallback to browser TTS
    if (this.browserService && this.browserService.speak) {
      await this.browserService.speak(text, {
        rate: options?.rate,
        pitch: options?.pitch,
        volume: options?.volume,
      });
    } else {
      throw new Error('No TTS service available');
    }
  }

  /**
   * Stop speaking
   */
  stop() {
    if (this.browserService && this.browserService.stop) {
      this.browserService.stop();
    }
  }

  /**
   * Pause speaking
   */
  pause() {
    if (this.browserService && this.browserService.pause) {
      this.browserService.pause();
    }
  }

  /**
   * Resume speaking
   */
  resume() {
    if (this.browserService && this.browserService.resume) {
      this.browserService.resume();
    }
  }

  isSpeaking(): boolean {
    if (this.browserService && this.browserService.isSpeaking) {
      return this.browserService.isSpeaking();
    }
    return false;
  }
}

// Export singleton instance
export const googleCloudTTSService = new GoogleCloudTTSService();
export const hybridTTSService = new HybridTTSService();

