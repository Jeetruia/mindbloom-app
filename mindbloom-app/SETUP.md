# MindBloom Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Botpress Configuration
REACT_APP_BOTPRESS_BOT_ID=your_botpress_bot_id
REACT_APP_BOTPRESS_CONFIG_URL=your_botpress_config_url

# App Configuration
REACT_APP_APP_NAME=MindBloom
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql` into the SQL editor
4. Run the SQL to create all tables and policies
5. Copy your project URL and anon key to the `.env` file

### 3. Botpress Setup

1. Create a Botpress account at [botpress.com](https://botpress.com)
2. Create a new bot for your therapy chatbot
3. Configure your bot with appropriate responses and flows
4. Get your bot ID and config URL
5. Add them to your `.env` file

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm start
```

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router** for navigation

### Backend
- **Supabase** for database and authentication
- **Botpress** for AI chatbot integration
- **Web Speech API** for TTS/STT

### Key Features
- 🎭 **AI Avatar with Lip-Sync** - Realistic 2D avatar with speech animation
- 💬 **Botpress Integration** - Advanced AI chatbot for therapy
- 👥 **Peer Circles** - Anonymous support groups
- 📊 **Wellness Dashboard** - Personal wellness tracking
- 🌱 **Community Garden** - Collaborative virtual space
- 📖 **Stories Hub** - Shared experiences and normalization
- 🎯 **Challenges & Events** - Community engagement
- 🔒 **Privacy-First** - Anonymous and secure

## 📱 Pages & Features

### 1. Landing/Onboarding/Consent
- **Purpose**: Low-friction entry with privacy focus
- **Features**: Age selection, language choice, role selection, privacy consent
- **USP**: "A private place to get stronger — together"

### 2. Home/Dashboard
- **Purpose**: Wellness snapshot and quick actions
- **Features**: Wellness metrics, daily micro-tasks, community pulse
- **USP**: Single glance gives purpose and immediate micro-wins

### 3. Therapist Chat (Avatar)
- **Purpose**: Embodied conversational support
- **Features**: AI avatar with lip-sync, micro-CBT, crisis detection
- **USP**: Empathy + action in one interface

### 4. Peer Circles
- **Purpose**: Small safe groups for support
- **Features**: Anonymous posting, support tokens, moderation
- **USP**: Small group intimacy + anonymity

### 5. Stories Hub
- **Purpose**: Narrative normalization through shared experiences
- **Features**: Story sharing, population comparisons, support tokens
- **USP**: "You're not alone" through real stories

### 6. Challenges & Events
- **Purpose**: Community challenges to normalize mental health
- **Features**: Time-boxed challenges, progress tracking, rewards
- **USP**: Social contagion for positive change

### 7. Community Garden
- **Purpose**: Visual social proof of collective progress
- **Features**: Plant items with XP, view community contributions
- **USP**: Nonverbal demonstration of mutual support

### 8. Progress & Rewards
- **Purpose**: Link micro-wins with visible rewards
- **Features**: XP system, avatar customization, achievements
- **USP**: Rewards that celebrate self-care

### 9. Resources & Tools
- **Purpose**: On-demand micro-interventions
- **Features**: Breathing exercises, journaling prompts, mindfulness
- **USP**: Bite-size, evidence-informed tools

### 10. Settings & Privacy
- **Purpose**: User control over data and preferences
- **Features**: Anonymity toggles, data choices, language settings
- **USP**: Empowering control reduces fear

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom hooks
├── lib/                # External libraries (Supabase)
├── services/           # API services
├── types/              # TypeScript types
└── App.tsx             # Main app component
```

### Key Components
- `OnboardingFlow.tsx` - Complete onboarding experience
- `Dashboard.tsx` - Main dashboard with wellness metrics
- `PeerCircles.tsx` - Anonymous support groups
- `AvatarScene2D.tsx` - AI avatar with lip-sync
- `ChatInterface.tsx` - Chat interface with Botpress
- `CommunityPlatform.tsx` - Community features

### State Management
- **Zustand** store in `hooks/useStore.ts`
- Global state for user, messages, avatar, crisis detection
- Persistent storage for user data

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Set environment variables in deployment settings
3. Deploy automatically on push to main branch

### Supabase Production
1. Create production Supabase project
2. Run migration scripts
3. Update environment variables
4. Configure RLS policies

## 🔒 Security & Privacy

### Data Protection
- **Anonymous by default** - No personal identifiers stored
- **Encrypted conversations** - All chat data encrypted
- **RLS policies** - Row-level security in Supabase
- **Crisis escalation** - Safe handling of crisis situations

### Privacy Features
- Optional profile creation
- Data sharing controls
- Anonymous posting in circles
- Secure crisis reporting

## 📊 Analytics & Measurement

### Key Metrics
- User engagement (sessions, time spent)
- Wellness improvements (pre/post surveys)
- Community participation (circles, stories)
- Crisis interventions (escalations, outcomes)

### Stigma Reduction Indicators
- Help-seeking behavior increase
- Story sharing growth
- Community participation rates
- Positive sentiment in conversations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@mindbloom.app or create an issue in the GitHub repository.

---

**MindBloom** - A private place to get stronger — together. 🌱
