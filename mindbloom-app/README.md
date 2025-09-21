# MindBloom - AI-Powered Mental Wellness Companion

A comprehensive mental wellness app featuring an AI therapist avatar with real-time lip-sync, conversational AI, and gamified wellness tracking.

## Features

### 🤖 AI Therapist Avatar
- **3D Avatar**: Interactive therapist avatar using Three.js
- **Real-time Lip-sync**: Synchronized mouth movements with speech
- **Emotional Expressions**: Dynamic facial expressions based on conversation context
- **Auto-greetings**: Welcoming animations and personalized introductions

### 💬 Conversational AI
- **Empathetic Dialogue**: CBT-based therapeutic conversations
- **Safety Guardrails**: Crisis detection with immediate escalation protocols
- **Multi-language Support**: English, Spanish, French, German
- **Context Awareness**: Remembers conversation history and user preferences

### 🎮 Gamification System
- **XP System**: Earn experience points through wellness activities
- **Avatar Progression**: User avatar grows and evolves with progress
- **Daily Streaks**: Maintain wellness habits with streak tracking
- **Achievements**: Unlock rewards and milestones

### 🛡️ Safety & Privacy
- **Crisis Detection**: Automatic detection of concerning language
- **Emergency Resources**: Direct access to crisis helplines
- **End-to-end Encryption**: Secure, private conversations
- **Anonymous Mode**: No personal data collection required

### 🧘 Wellness Activities
- **CBT Exercises**: Evidence-based cognitive behavioral therapy techniques
- **Breathing Exercises**: Guided meditation and relaxation
- **Journaling**: Reflective writing prompts
- **Mindfulness**: Short meditation sessions

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** for 3D avatar rendering
- **Framer Motion** for smooth animations
- **TailwindCSS** for styling
- **Zustand** for state management

### Speech & AI
- **Web Speech API** for TTS/STT
- **OpenAI API** for conversational AI (configurable)
- **Custom Lip-sync** engine for avatar synchronization

### Backend (Optional)
- **Firebase** for user data and sessions
- **Node.js** for API orchestration
- **Google Cloud TTS** for high-quality speech synthesis

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindbloom-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Variables (Optional)

Create a `.env` file for API integrations:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AvatarScene.tsx  # 3D avatar with Three.js
│   ├── ChatInterface.tsx # Chat UI with TTS/STT
│   ├── UserAvatar.tsx   # User's progress avatar
│   ├── XPBar.tsx        # Experience point display
│   ├── WelcomeScreen.tsx # Onboarding flow
│   ├── CrisisModal.tsx  # Crisis intervention UI
│   └── LoadingScreen.tsx # App loading state
├── hooks/
│   └── useStore.ts      # Zustand state management
├── services/
│   ├── speechService.ts # TTS/STT/Lip-sync services
│   └── aiService.ts     # AI conversation logic
├── types/
│   └── index.ts         # TypeScript type definitions
└── App.tsx              # Main application component
```

## Key Components

### AvatarScene
- Renders the 3D therapist avatar using Three.js
- Handles lip-sync animations based on speech
- Manages emotional expressions and gestures
- Provides interactive camera controls

### ChatInterface
- Real-time chat with voice input/output
- Crisis detection and escalation
- Quick action buttons for common responses
- Message history and typing indicators

### Speech Services
- **TTSService**: Text-to-speech with voice selection
- **STTService**: Speech-to-text with language support
- **LipSyncService**: Audio analysis for viseme generation

### AI Service
- Context-aware conversation generation
- CBT-based therapeutic responses
- Crisis detection and intervention
- Sentiment analysis and mood tracking

## Customization

### Avatar Appearance
Modify the avatar in `AvatarScene.tsx`:
- Change colors, size, and proportions
- Add custom animations
- Integrate Ready Player Me avatars
- Add clothing and accessories

### AI Personality
Customize responses in `aiService.ts`:
- Adjust empathy levels
- Modify therapeutic approaches
- Add domain-specific knowledge
- Implement custom crisis protocols

### UI Theme
Update `tailwind.config.js`:
- Change color schemes
- Modify animations
- Adjust spacing and typography
- Add custom components

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support:
- Create an issue on GitHub
- Contact: support@mindbloom.app
- Crisis Support: 988 (US) or your local crisis helpline

## Roadmap

- [ ] Ready Player Me avatar integration
- [ ] Advanced lip-sync with phoneme detection
- [ ] Mobile app with React Native
- [ ] VR/AR support
- [ ] Group therapy sessions
- [ ] Integration with wearable devices
- [ ] Advanced analytics dashboard
- [ ] Multi-therapist personalities

---

**Important**: This app is designed for wellness support and should not replace professional mental health care. Always consult with qualified mental health professionals for serious concerns.
