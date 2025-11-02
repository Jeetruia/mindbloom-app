# 🌸 MindBloom - AI-Powered Mental Wellness App

A comprehensive mental wellness application featuring AI-powered therapy, gamification, community support, and Google Cloud integration.

## ✨ Features

### 🤖 AI-Powered Therapy
- **Chat with Mira**: Licensed AI therapist using Vertex AI/Gemini
- **Sentiment Analysis**: Real-time emotion detection and mood tracking
- **Crisis Detection**: Automatic identification of critical situations
- **Therapeutic Techniques**: CBT, DBT, and ACT integration
- **Voice Support**: Speech-to-Text and Text-to-Speech in multiple languages

### 🎮 Gamification System
- **XP & Leveling**: Complete challenges to earn experience points
- **Streaks**: Daily engagement tracking with bonus multipliers
- **Achievements**: Unlock badges and milestones
- **Leaderboards**: Friendly competition with friends
- **Reward Store**: Redeem XP for themes and perks

### 🎯 Challenges & Games
- **Breathing Dragon**: Camera-integrated breathing exercise
- **Gratitude Game**: AI-analyzed gratitude journaling
- **Memory Match**: Cognitive training game
- **Type Racer**: Speed typing challenge
- **Wellness Trivia**: Knowledge-based game

### 👥 Community Features
- **Peer Circles**: Anonymous support groups with AI moderation
- **Community Stories**: Share experiences with sentiment analysis
- **Voice Check-ins**: Record reflections that are automatically analyzed
- **Mood Pulse**: Real-time group mood visualization

### 📊 Analytics & Insights
- **Wellness Dashboard**: AI-generated insights and recommendations
- **Progress Tracking**: Visual trend analysis over time
- **Bloom Meter**: Track emotional evolution through stories
- **Personalized Recommendations**: AI-curated resources and activities

### 🎨 Unique UI Components
- Particle backgrounds with interactive connections
- Mood rings with floating particles
- Animated confetti celebrations
- Progress radial indicators
- Interactive mood meters
- Sound effects and haptic feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- Google Cloud Platform account (optional, for full features)
- Git installed

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jeetruia/mindbloom-app.git
   cd mindbloom-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

### Backend Proxy Setup (Required for Google Cloud features)

1. **Navigate to server-proxy:**
   ```bash
   cd server-proxy
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Google Cloud credentials
   ```

3. **Start the proxy server:**
   ```bash
   npm start
   # Server runs on http://localhost:5001
   ```

4. **In another terminal, start the React app:**
   ```bash
   cd ..
   npm start
   # App runs on http://localhost:3000
   ```

## 📚 Documentation

- **[Google Cloud Setup Guide](GOOGLE_CLOUD_SETUP.md)** - Complete Google Cloud configuration
- **[Deployment Guide](DEPLOYMENT.md)** - Hosting instructions for various platforms
- **[Enhancements Documentation](ENHANCEMENTS.md)** - Feature documentation
- **[UI Components Guide](NEW_UI_COMPONENTS.md)** - Component library

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Cloud Run (Backend)
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Option 2: Netlify (Frontend) + Railway (Backend)
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Option 3: Full Google Cloud
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔐 Security

- **Never commit:**
  - `.env` files
  - `service-account-key.json` files
  - API keys in code

- **Use environment variables:**
  - All sensitive data should be in environment variables
  - Use platform-specific secret management

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Express.js, Node.js
- **AI:** Google Cloud Vertex AI, Gemini
- **Storage:** Google Cloud Storage
- **Speech:** Google Cloud Speech-to-Text, Text-to-Speech
- **Analytics:** Google Cloud Natural Language API
- **State Management:** Zustand
- **Animation:** Framer Motion
- **3D Graphics:** Three.js, React Three Fiber

## 📝 Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Cloud Platform for AI services
- React community for amazing tools
- Open source contributors

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for mental wellness and community support
