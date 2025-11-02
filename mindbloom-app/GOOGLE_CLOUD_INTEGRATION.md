# Google Cloud Integration Guide

This document explains how to integrate Google Cloud services into your MindBloom app.

## Overview

We've integrated the following Google Cloud services:

1. **Vertex AI / Gemini** - Enhanced AI with higher rate limits
2. **Cloud Speech-to-Text** - Better speech recognition
3. **Cloud Text-to-Speech** - Natural-sounding voices
4. **Cloud Storage** - For audio files and user content
5. **Cloud Natural Language API** - Sentiment analysis and crisis detection

## Architecture

The integration uses a **server-side proxy** approach for security:

```
Frontend (React) → Proxy Server (Express.js) → Google Cloud APIs
```

This prevents exposing service account keys in the frontend code.

## Quick Start

### 1. Set Up Google Cloud Project

Follow the instructions in `GOOGLE_CLOUD_SETUP.md` to:
- Create a Google Cloud project
- Enable required APIs
- Create service account
- Download service account key

### 2. Configure Environment Variables

#### Frontend (`.env` in `mindbloom-app/`):
```bash
# Google Cloud Proxy URL (your deployed proxy server)
REACT_APP_GOOGLE_CLOUD_PROXY_URL=http://localhost:5000/api/google-cloud

# Optional: Fallback to free Gemini API
REACT_APP_GEMINI_API_KEY=your-fallback-api-key

# Supabase (keep existing)
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-key
```

#### Backend (`.env` in `server-proxy/`):
```bash
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_CLOUD_STORAGE_BUCKET=mindbloom-app-storage
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Start Proxy Server

```bash
cd server-proxy
npm install
npm start
```

### 4. Update Frontend Services

The services automatically use Google Cloud if the proxy URL is configured, with fallback to browser APIs if not available.

## Service Integration

### 1. Vertex AI / Gemini

**Usage:**
```typescript
import { vertexAIService } from './services/vertexAIService';

// Already integrated in geminiService.ts
// Will automatically use Vertex AI if proxy is configured
// Falls back to free API if not available
```

**Benefits:**
- Higher rate limits
- Better performance
- Usage tracking
- Advanced features

### 2. Speech-to-Text

**Usage:**
```typescript
import { hybridSTTService } from './services/googleCloudSpeechService';
import { STTService } from './services/speechServiceSimple';

// Set up browser service as fallback
const browserSTT = new STTService();
hybridSTTService.setBrowserService(browserSTT);

// Use in your components
const transcript = await hybridSTTService.startListening();
```

**Benefits:**
- Higher accuracy
- Better multilingual support
- Custom models support
- Real-time streaming

### 3. Text-to-Speech

**Usage:**
```typescript
import { hybridTTSService } from './services/googleCloudTTSService';
import { TTSService } from './services/speechServiceSimple';

// Set up browser service as fallback
const browserTTS = new TTSService();
hybridTTSService.setBrowserService(browserTTS);

// Use in your components
await hybridTTSService.speak('Hello, I am Mira');
```

**Benefits:**
- Natural-sounding voices
- Multiple voice options
- SSML support
- Better quality than browser TTS

### 4. Cloud Storage

**Usage:**
```typescript
import { googleCloudStorageService } from './services/googleCloudStorageService';

// Upload audio file
const audioBlob = // ... your audio blob
const url = await googleCloudStorageService.uploadAudio(
  audioBlob,
  userId,
  'tts' // or 'recording' or 'story'
);

// Upload image
const imageBlob = // ... your image blob
const url = await googleCloudStorageService.uploadImage(
  imageBlob,
  userId,
  'story' // or 'avatar' or 'garden'
);
```

**Benefits:**
- Scalable storage
- CDN integration
- Access control
- Cost-effective

### 5. Natural Language API

**Usage:**
```typescript
import { googleCloudLanguageService } from './services/googleCloudLanguageService';

// Analyze sentiment
const sentiment = await googleCloudLanguageService.analyzeSentiment(text);

// Enhanced crisis detection
const crisis = await googleCloudLanguageService.detectCrisis(text);

// Emotional tone analysis
const emotions = await googleCloudLanguageService.analyzeEmotionalTone(text);
```

**Benefits:**
- Accurate sentiment analysis
- Entity extraction
- Content classification
- Enhanced crisis detection

## Updating Existing Components

### Update Chat Components

Replace browser TTS/STT with hybrid services:

```typescript
// Before
import { TTSService } from '../services/speechServiceSimple';
const tts = new TTSService();

// After
import { hybridTTSService, hybridSTTService } from '../services/googleCloudSpeechService';
import { TTSService, STTService } from '../services/speechServiceSimple';

// Set up fallback
hybridTTSService.setBrowserService(new TTSService());
hybridSTTService.setBrowserService(new STTService());
```

### Update Crisis Detection

Use enhanced crisis detection:

```typescript
import { googleCloudLanguageService } from '../services/googleCloudLanguageService';

// Enhanced crisis detection
const crisis = await googleCloudLanguageService.detectCrisis(userMessage);
if (crisis.isCrisis) {
  // Handle crisis based on severity
  if (crisis.severity === 'critical') {
    // Immediate action required
  }
}
```

## Deployment

### Deploy Proxy Server

1. **Cloud Run (Recommended)**
   ```bash
   cd server-proxy
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mindbloom-proxy
   gcloud run deploy mindbloom-proxy \
     --image gcr.io/YOUR_PROJECT_ID/mindbloom-proxy \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

2. **Update frontend proxy URL**
   ```bash
   REACT_APP_GOOGLE_CLOUD_PROXY_URL=https://mindbloom-proxy-xxxxx.run.app/api/google-cloud
   ```

### Deploy Frontend

Deploy your React app as usual (Vercel, Netlify, etc.).

## Cost Optimization

1. **Monitor Usage**
   - Set up billing alerts in Google Cloud Console
   - Monitor API quotas

2. **Caching**
   - Cache TTS audio files
   - Cache sentiment analysis results

3. **Rate Limiting**
   - Implement rate limiting in proxy server
   - Use quotas to prevent unexpected charges

## Troubleshooting

### Proxy Not Working
- Check that proxy server is running
- Verify `REACT_APP_GOOGLE_CLOUD_PROXY_URL` is set
- Check CORS configuration
- Review proxy server logs

### Authentication Errors
- Verify service account key path
- Check that APIs are enabled
- Verify IAM roles are assigned

### Fallback Not Working
- Ensure browser services are initialized
- Check that fallback services are set

## Security Best Practices

1. **Never commit service account keys to git**
2. **Use environment variables for all sensitive data**
3. **Enable CORS only for your domains**
4. **Implement rate limiting**
5. **Use IAM roles with least privilege**
6. **Regularly rotate service account keys**

## Next Steps

1. Set up your Google Cloud project (see `GOOGLE_CLOUD_SETUP.md`)
2. Deploy the proxy server
3. Update frontend environment variables
4. Test each service individually
5. Monitor costs and usage

## Support

For issues:
1. Check Google Cloud Console for API status
2. Review proxy server logs
3. Verify environment variables
4. Check API quotas

