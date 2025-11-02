/**
 * Google Cloud Speech-to-Text Service
 * 
 * Provides better accuracy than browser Web Speech API
 * Supports multiple languages, real-time streaming, and custom models
 */

interface SpeechRecognitionConfig {
  languageCode: string;
  sampleRateHertz?: number;
  encoding?: 'LINEAR16' | 'FLAC' | 'MULAW' | 'AMR' | 'AMR_WB' | 'OGG_OPUS' | 'SPEEX_WITH_HEADER_BYTE';
  audioChannelCount?: number;
  enableAutomaticPunctuation?: boolean;
  model?: 'default' | 'command_and_search' | 'phone_call' | 'video' | 'latest_long' | 'latest_short';
  useEnhanced?: boolean;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  alternatives?: Array<{
    transcript: string;
    confidence: number;
  }>;
}

class GoogleCloudSTTService {
  private proxyUrl: string | null;
  private defaultConfig: SpeechRecognitionConfig;

  constructor() {
    this.proxyUrl = process.env.REACT_APP_GOOGLE_CLOUD_PROXY_URL || null;
    this.defaultConfig = {
      languageCode: 'en-US',
      sampleRateHertz: 16000,
      encoding: 'LINEAR16',
      enableAutomaticPunctuation: true,
      model: 'latest_short',
      useEnhanced: true,
    };
  }

  /**
   * Recognize speech from audio blob
   */
  async recognize(audioBlob: Blob, config?: Partial<SpeechRecognitionConfig>): Promise<SpeechRecognitionResult> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Speech-to-Text proxy not configured. Please set REACT_APP_GOOGLE_CLOUD_PROXY_URL');
    }

    const recognitionConfig = { ...this.defaultConfig, ...config };

    // Convert blob to base64
    const base64Audio = await this.blobToBase64(audioBlob);

    const response = await fetch(`${this.proxyUrl}/speech-to-text/recognize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: recognitionConfig,
        audio: {
          content: base64Audio.split(',')[1], // Remove data:audio/...;base64, prefix
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Speech-to-Text error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0 && data.results[0].alternatives.length > 0) {
      const alternative = data.results[0].alternatives[0];
      return {
        transcript: alternative.transcript,
        confidence: alternative.confidence || 0.8,
        alternatives: data.results[0].alternatives.map((alt: any) => ({
          transcript: alt.transcript,
          confidence: alt.confidence || 0.8,
        })),
      };
    }

    throw new Error('No speech recognized');
  }

  /**
   * Stream recognition (for real-time transcription)
   * Note: This requires WebSocket or streaming setup
   */
  async streamRecognize(
    audioStream: MediaStream,
    onTranscript: (transcript: string, isFinal: boolean) => void,
    config?: Partial<SpeechRecognitionConfig>
  ): Promise<void> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Speech-to-Text proxy not configured');
    }

    // For streaming, we'll use MediaRecorder to chunk audio
    const mediaRecorder = new MediaRecorder(audioStream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
        
        // Process chunk
        try {
          const result = await this.recognize(event.data, config);
          onTranscript(result.transcript, true);
        } catch (error) {
          console.error('Stream recognition error:', error);
        }
      }
    };

    mediaRecorder.start(1000); // Process every second

    // Return cleanup function
    return new Promise((resolve) => {
      // Will be cleaned up externally
      resolve();
    });
  }

  /**
   * Convert blob to base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'es-ES', 'es-MX', 'fr-FR', 'fr-CA',
      'de-DE', 'it-IT', 'pt-BR', 'pt-PT',
      'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW',
      'ar-XA', 'hi-IN', 'ru-RU',
    ];
  }

  /**
   * Set default language
   */
  setLanguage(languageCode: string) {
    this.defaultConfig.languageCode = languageCode;
  }
}

/**
 * Hybrid STT Service
 * Falls back to browser Web Speech API if Google Cloud is not available
 */
export class HybridSTTService {
  private googleCloudService: GoogleCloudSTTService;
  private browserService: any; // Browser Web Speech API (will be injected)
  private useGoogleCloud: boolean;

  constructor() {
    this.googleCloudService = new GoogleCloudSTTService();
    this.useGoogleCloud = !!process.env.REACT_APP_GOOGLE_CLOUD_PROXY_URL;
  }

  /**
   * Set browser STT service (from speechServiceSimple)
   */
  setBrowserService(browserService: any) {
    this.browserService = browserService;
  }

  /**
   * Recognize speech with automatic fallback
   */
  async recognize(audioBlob?: Blob, config?: Partial<SpeechRecognitionConfig>): Promise<SpeechRecognitionResult | string> {
    if (this.useGoogleCloud && audioBlob) {
      try {
        const result = await this.googleCloudService.recognize(audioBlob, config);
        return result.transcript;
      } catch (error) {
        console.warn('Google Cloud STT failed, falling back to browser:', error);
        return this.fallbackToBrowser();
      }
    }

    // Fallback to browser
    return this.fallbackToBrowser();
  }

  /**
   * Start listening with automatic fallback
   */
  async startListening(): Promise<string> {
    if (this.useGoogleCloud) {
      // For browser-based recording, we'll use MediaRecorder
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        return new Promise((resolve, reject) => {
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop());
            
            try {
              const result = await this.googleCloudService.recognize(audioBlob);
              resolve(result.transcript);
            } catch (error) {
              console.warn('Google Cloud STT failed, falling back to browser:', error);
              this.fallbackToBrowser().then(resolve).catch(reject);
            }
          };

          mediaRecorder.start();
          
          // Stop after 5 seconds or on external stop
          setTimeout(() => {
            if (mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
          }, 5000);
        });
      } catch (error) {
        console.warn('MediaRecorder failed, falling back to browser:', error);
        return this.fallbackToBrowser();
      }
    }

    return this.fallbackToBrowser();
  }

  /**
   * Fallback to browser Web Speech API
   */
  private async fallbackToBrowser(): Promise<string> {
    if (!this.browserService) {
      throw new Error('No speech recognition service available');
    }

    if (this.browserService.startListening) {
      return await this.browserService.startListening();
    }

    throw new Error('Browser STT service not properly initialized');
  }

  stopListening() {
    if (this.browserService && this.browserService.stopListening) {
      this.browserService.stopListening();
    }
  }

  setLanguage(languageCode: string) {
    this.googleCloudService.setLanguage(languageCode);
    if (this.browserService && this.browserService.setLanguage) {
      this.browserService.setLanguage(languageCode);
    }
  }
}

// Export singleton instance
export const googleCloudSTTService = new GoogleCloudSTTService();
export const hybridSTTService = new HybridSTTService();

