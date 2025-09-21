import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ChatMessage, AvatarState, CrisisDetection, WellnessSession } from '../types';
import { TTSService } from '../services/speechServiceSimple';
import { botpressService } from '../services/botpressService';

interface AppState {
  // User state
  user: User | null;
  isLoading: boolean;
  
  // Chat state
  messages: ChatMessage[];
  isTyping: boolean;
  
  // Avatar state
  avatarState: AvatarState;
  
  // Crisis detection
  crisisDetected: CrisisDetection | null;
  
  // Sessions
  sessions: WellnessSession[];
  
  // Speech service
  ttsService: TTSService;
  isListening: boolean;
  
  // Botpress state
  botpressConnected: boolean;
  hasShownInitialGreeting: boolean;
  
  // Actions
  setUser: (user: User) => void;
  addMessage: (message: ChatMessage) => void;
  setTyping: (isTyping: boolean) => void;
  updateAvatarState: (state: Partial<AvatarState>) => void;
  setCrisisDetected: (crisis: CrisisDetection | null) => void;
  addSession: (session: WellnessSession) => void;
  initializeApp: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  processCrisisDetection: (message: string) => CrisisDetection | null;
  speakText: (text: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  initializeBotpress: () => Promise<void>;
  showInitialGreeting: () => Promise<void>;
  setBotpressConnected: (connected: boolean) => void;
}

const CRISIS_KEYWORDS = {
  critical: ['suicide', 'kill myself', 'end it all', 'not worth living', 'want to die'],
  high: ['depressed', 'hopeless', 'worthless', 'can\'t go on', 'give up'],
  medium: ['sad', 'lonely', 'anxious', 'worried', 'stressed'],
  low: ['tired', 'overwhelmed', 'difficult', 'challenging']
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: true,
      messages: [],
      isTyping: false,
      avatarState: {
        isVisible: false,
        isSpeaking: false,
        currentAnimation: 'idle',
        emotion: { type: 'neutral', intensity: 0.5 },
        position: { x: 0, y: 0, z: 0 }
      },
      crisisDetected: null,
      sessions: [],
      ttsService: new TTSService(),
      isListening: false,
      botpressConnected: false,
      hasShownInitialGreeting: false,

      // Actions
      setUser: (user) => set({ user }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      
      setTyping: (isTyping) => set({ isTyping }),
      
      updateAvatarState: (newState) => set((state) => ({
        avatarState: { ...state.avatarState, ...newState }
      })),
      
      setCrisisDetected: (crisis) => set({ crisisDetected: crisis }),
      
      addSession: (session) => set((state) => ({
        sessions: [...state.sessions, session]
      })),

      initializeApp: async () => {
        set({ isLoading: true });
        
        try {
          // Check for existing user in localStorage
          const savedUser = localStorage.getItem('mindbloom-user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            set({ user, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Error initializing app:', error);
          set({ isLoading: false });
        }
      },

      sendMessage: async (content) => {
        const { user, addMessage, setTyping, processCrisisDetection, setCrisisDetected } = get();
        
        if (!user) return;

        // Add user message
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          userId: user.id,
          content,
          isFromUser: true,
          timestamp: new Date()
        };
        addMessage(userMessage);

        // Check for crisis keywords
        const crisis = processCrisisDetection(content);
        if (crisis) {
          setCrisisDetected(crisis);
        }

        setTyping(true);

        try {
          // Use ONLY Botpress for AI response
          const botpressMessages = await botpressService.sendMessage(content);
          let aiResponse = '';
          
          if (botpressMessages.length > 0) {
            aiResponse = botpressMessages[0].text || '';
          }
          
          // If no response from Botpress, use a simple fallback
          if (!aiResponse) {
            aiResponse = "I'm here to listen and support you. How are you feeling today?";
          }
          
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            userId: 'ai',
            content: aiResponse,
            isFromUser: false,
            timestamp: new Date(),
            emotion: { type: 'encouraging', intensity: 0.8 }
          };
          
          addMessage(aiMessage);
          
          // Update avatar to speak and use TTS
          get().updateAvatarState({
            isSpeaking: true,
            currentAnimation: 'speaking',
            emotion: { type: 'encouraging', intensity: 0.8 }
          });

          // Use TTS to speak the response
          try {
            await get().speakText(aiResponse);
          } catch (error) {
            console.warn('TTS failed:', error);
          }

          // Stop speaking after TTS completes
          get().updateAvatarState({
            isSpeaking: false,
            currentAnimation: 'idle'
          });

        } catch (error) {
          console.error('Error sending message:', error);
        } finally {
          setTyping(false);
        }
      },

      processCrisisDetection: (message) => {
        const lowerMessage = message.toLowerCase();
        
        for (const [severity, keywords] of Object.entries(CRISIS_KEYWORDS)) {
          for (const keyword of keywords) {
            if (lowerMessage.includes(keyword)) {
              return {
                keywords: [keyword],
                severity: severity as CrisisDetection['severity'],
                action: severity === 'critical' ? 'emergency' : 
                       severity === 'high' ? 'escalate' : 'monitor'
              };
            }
          }
        }
        
        return null;
      },

      speakText: async (text) => {
        const { ttsService } = get();
        try {
          await ttsService.speak(text, {
            rate: 0.9,
            pitch: 1.0,
            volume: 0.8
          });
        } catch (error) {
          console.error('TTS Error:', error);
          throw error;
        }
      },

      startListening: () => {
        set({ isListening: true });
        // In a real implementation, you would start speech recognition here
        console.log('Started listening for voice input');
      },

      stopListening: () => {
        set({ isListening: false });
        // In a real implementation, you would stop speech recognition here
        console.log('Stopped listening for voice input');
      },

      initializeBotpress: async () => {
        try {
          await botpressService.initialize();
          set({ botpressConnected: true });
          console.log('Botpress initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Botpress:', error);
          set({ botpressConnected: false });
        }
      },

      showInitialGreeting: async () => {
        const { hasShownInitialGreeting, addMessage, updateAvatarState, speakText } = get();
        
        if (hasShownInitialGreeting) return;

        try {
          // Use ONLY Botpress for greeting
          const botpressMessages = await botpressService.getInitialGreeting();
          let greetingText = '';
          
          if (botpressMessages.length > 0) {
            greetingText = botpressMessages[0].text || '';
          }
          
          // Fallback greeting if Botpress fails
          if (!greetingText) {
            greetingText = "Hello! I'm Mira, your wellness guide. I'm here to listen and support you. How are you feeling today?";
          }

          const greetingMessage: ChatMessage = {
            id: `greeting_${Date.now()}`,
            userId: 'ai',
            content: greetingText,
            isFromUser: false,
            timestamp: new Date(),
            emotion: { type: 'welcoming', intensity: 0.9 }
          };

          addMessage(greetingMessage);

          // Update avatar to speak
          updateAvatarState({
            isSpeaking: true,
            currentAnimation: 'speaking',
            emotion: { type: 'welcoming', intensity: 0.9 }
          });

          // Speak the greeting
          try {
            await speakText(greetingText);
          } catch (error) {
            console.warn('TTS failed for greeting:', error);
          }

          // Stop speaking
          updateAvatarState({
            isSpeaking: false,
            currentAnimation: 'idle'
          });

          set({ hasShownInitialGreeting: true });
        } catch (error) {
          console.error('Error showing initial greeting:', error);
        }
      },

      setBotpressConnected: (connected) => set({ botpressConnected: connected })
    }),
    {
      name: 'mindbloom-storage',
      partialize: (state) => ({
        user: state.user,
        sessions: state.sessions
      })
    }
  )
);

// Local AI response generation removed - using only Botpress
