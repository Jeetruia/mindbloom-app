/**
 * Language Service for Multilingual Support
 * 
 * Provides language detection and configuration for:
 * - Text-to-Speech voice selection
 * - Speech-to-Text language configuration
 * - UI translations (future)
 */

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  ttsVoiceCode: string;
  ttsVoiceName: string;
  sttLanguageCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    ttsVoiceCode: 'en-US',
    ttsVoiceName: 'en-US-Neural2-F',
    sttLanguageCode: 'en-US',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    ttsVoiceCode: 'es-ES',
    ttsVoiceName: 'es-ES-Neural2-F',
    sttLanguageCode: 'es-ES',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    ttsVoiceCode: 'fr-FR',
    ttsVoiceName: 'fr-FR-Neural2-F',
    sttLanguageCode: 'fr-FR',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    ttsVoiceCode: 'de-DE',
    ttsVoiceName: 'de-DE-Neural2-F',
    sttLanguageCode: 'de-DE',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    ttsVoiceCode: 'it-IT',
    ttsVoiceName: 'it-IT-Neural2-C',
    sttLanguageCode: 'it-IT',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    ttsVoiceCode: 'pt-PT',
    ttsVoiceName: 'pt-PT-Neural2-F',
    sttLanguageCode: 'pt-PT',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    ttsVoiceCode: 'zh-CN',
    ttsVoiceName: 'zh-CN-Neural2-F',
    sttLanguageCode: 'zh-CN',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    ttsVoiceCode: 'ja-JP',
    ttsVoiceName: 'ja-JP-Neural2-C',
    sttLanguageCode: 'ja-JP',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    ttsVoiceCode: 'ko-KR',
    ttsVoiceName: 'ko-KR-Neural2-C',
    sttLanguageCode: 'ko-KR',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    ttsVoiceCode: 'ar-XA',
    ttsVoiceName: 'ar-XA-Neural2-C',
    sttLanguageCode: 'ar-SA',
  },
];

class LanguageService {
  private currentLanguage: string = 'en';

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Set current language
   */
  setCurrentLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
    // Store in localStorage
    localStorage.setItem('mindbloom-language', languageCode);
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(languageCode?: string): LanguageConfig {
    const code = languageCode || this.currentLanguage;
    const config = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
    return config || SUPPORTED_LANGUAGES[0]; // Default to English
  }

  /**
   * Detect language from user's browser
   */
  detectBrowserLanguage(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const code = browserLang.split('-')[0];
    
    // Check if we support this language
    const supported = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
    if (supported) {
      return code;
    }
    
    return 'en'; // Default to English
  }

  /**
   * Initialize language from storage or browser
   */
  initializeLanguage(): string {
    const stored = localStorage.getItem('mindbloom-language');
    if (stored) {
      this.currentLanguage = stored;
      return stored;
    }
    
    const detected = this.detectBrowserLanguage();
    this.setCurrentLanguage(detected);
    return detected;
  }

  /**
   * Get TTS voice configuration for current language
   */
  getTTSVoice(): { languageCode: string; name: string; ssmlGender: 'FEMALE' | 'MALE' | 'NEUTRAL' } {
    const config = this.getLanguageConfig();
    return {
      languageCode: config.ttsVoiceCode,
      name: config.ttsVoiceName,
      ssmlGender: 'FEMALE', // Default to female voice for therapist persona
    };
  }

  /**
   * Get STT language code
   */
  getSTTLanguageCode(): string {
    const config = this.getLanguageConfig();
    return config.sttLanguageCode;
  }

  /**
   * Check if language is RTL (right-to-left)
   */
  isRTL(languageCode?: string): boolean {
    const code = languageCode || this.currentLanguage;
    return ['ar', 'he', 'fa', 'ur'].includes(code);
  }
}

export const languageService = new LanguageService();
export default LanguageService;

