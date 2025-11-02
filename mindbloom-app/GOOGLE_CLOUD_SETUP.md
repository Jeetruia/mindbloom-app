# Google Cloud Integration Setup

This guide will help you set up Google Cloud services for the MindBloom app using your Google Cloud subscription and credits.

## Prerequisites

- Google Cloud account with active subscription
- Google Cloud project with billing enabled
- Required APIs enabled (see below)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project

## Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud project:

1. **Vertex AI API** (for Gemini AI)
   - Go to: APIs & Services > Library
   - Search: "Vertex AI API"
   - Click Enable

2. **Cloud Speech-to-Text API**
   - Search: "Cloud Speech-to-Text API"
   - Click Enable

3. **Cloud Text-to-Speech API**
   - Search: "Cloud Text-to-Speech API"
   - Click Enable

4. **Cloud Storage API**
   - Search: "Cloud Storage API"
   - Click Enable

5. **Cloud Natural Language API**
   - Search: "Cloud Natural Language API"
   - Click Enable

## Step 3: Create Service Account

1. Go to: IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name: `mindbloom-app-service`
4. Click "Create and Continue"
5. Grant roles:
   - Vertex AI User
   - Cloud Speech-to-Text User
   - Cloud Text-to-Speech User
   - Storage Object Admin
   - Cloud Language Service User
6. Click "Done"

## Step 4: Create Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON"
5. Download the key file (save it securely, **never commit to git**)

## Step 5: Create Storage Bucket (Optional)

If you want to store audio files and user content:

1. Go to: Cloud Storage > Buckets
2. Click "Create Bucket"
3. Name: `mindbloom-app-storage` (or your preferred name)
4. Choose location: Multi-region or specific region
5. Storage class: Standard
6. Access control: Fine-grained
7. Click "Create"

## Step 6: Configure Environment Variables

Create a `.env` file in the root of `mindbloom-app/` (if it doesn't exist):

```bash
# Google Cloud Configuration
REACT_APP_GOOGLE_CLOUD_PROJECT_ID=your-project-id
REACT_APP_GOOGLE_CLOUD_REGION=us-central1
REACT_APP_GOOGLE_CLOUD_STORAGE_BUCKET=mindbloom-app-storage

# Service Account Key (Base64 encoded JSON)
# IMPORTANT: For production, use environment variables or secure storage
# For now, we'll use a server-side proxy approach for security
REACT_APP_GOOGLE_CLOUD_PROXY_URL=http://localhost:5000/api/google-cloud

# Vertex AI Gemini Configuration
REACT_APP_GEMINI_MODEL=gemini-1.5-flash
REACT_APP_GEMINI_LOCATION=us-central1

# Optional: Fallback to free Gemini API key (for development)
REACT_APP_GEMINI_API_KEY=your-fallback-api-key

# Supabase (keep existing)
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-key
```

## Step 7: Install Dependencies

The app will need Google Cloud client libraries. We'll use a server-side proxy for security, but you can also install client libraries:

```bash
cd mindbloom-app
npm install @google-cloud/speech @google-cloud/text-to-speech @google-cloud/storage @google-cloud/language @google/aiplatform
```

**Note:** For security reasons, we recommend using a server-side proxy to handle Google Cloud API calls instead of exposing service account keys in the frontend. The proxy will handle authentication securely.

## Step 8: Set Up Server-Side Proxy (Recommended)

For production, create a server-side proxy to handle Google Cloud API calls securely. This prevents exposing service account keys in the frontend.

See `server-proxy/` directory for example Express.js proxy setup.

## Features Enabled

With Google Cloud integration, you'll have access to:

1. **Vertex AI / Gemini**: 
   - Higher rate limits
   - Better performance
   - More advanced features
   - Usage tracking and quotas

2. **Cloud Speech-to-Text**:
   - Higher accuracy than browser APIs
   - Better multilingual support
   - Custom models support
   - Real-time streaming

3. **Cloud Text-to-Speech**:
   - Natural-sounding voices
   - Multiple voice options
   - SSML support
   - Better quality than browser TTS

4. **Cloud Storage**:
   - Store audio files
   - User-generated content
   - Community stories attachments
   - Scalable storage

5. **Cloud Natural Language API**:
   - Sentiment analysis
   - Entity extraction
   - Content classification
   - Better crisis detection

## Cost Considerations

Monitor your usage in Google Cloud Console:
- Vertex AI: Pay per token usage
- Speech-to-Text: Pay per 15-second increment
- Text-to-Speech: Pay per character
- Storage: Pay per GB stored

Set up billing alerts to avoid unexpected charges.

## Security Best Practices

1. **Never commit service account keys to git**
2. Use environment variables for configuration
3. Implement server-side proxy for API calls
4. Use IAM roles with least privilege
5. Enable Cloud Audit Logs
6. Regularly rotate service account keys

## Troubleshooting

### Authentication Errors
- Verify service account key is valid
- Check that APIs are enabled
- Verify IAM roles are assigned correctly

### API Quota Errors
- Check API quotas in Cloud Console
- Request quota increase if needed
- Implement rate limiting

### CORS Issues
- Use server-side proxy for API calls
- Configure CORS in Cloud Storage bucket if accessing directly

## Support

For issues:
1. Check Google Cloud Console for API status
2. Review Cloud Logs for errors
3. Verify billing is enabled
4. Check API quotas

