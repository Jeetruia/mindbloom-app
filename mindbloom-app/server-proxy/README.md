# Google Cloud Proxy Server

This is an example Express.js server that acts as a secure proxy for Google Cloud API calls. This prevents exposing service account keys in the frontend.

## Why Use a Proxy?

1. **Security**: Service account keys should never be exposed in frontend code
2. **Authentication**: Server-side authentication is more secure
3. **Rate Limiting**: Control API usage and costs
4. **CORS**: Avoid CORS issues with Google Cloud APIs
5. **Error Handling**: Centralized error handling and logging

## Setup

1. Install dependencies:
```bash
cd server-proxy
npm install
```

2. Create a `.env` file:
```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_CLOUD_STORAGE_BUCKET=mindbloom-app-storage

# Service Account Key Path (or use GOOGLE_APPLICATION_CREDENTIALS)
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (optional)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

3. Run the server:
```bash
npm start
```

## API Endpoints

### Vertex AI / Gemini

**POST** `/api/google-cloud/vertex-ai/generate`
- Generate text using Vertex AI Gemini
- Body: `{ projectId, location, model, messages }`

### Speech-to-Text

**POST** `/api/google-cloud/speech-to-text/recognize`
- Recognize speech from audio
- Body: `{ config, audio }`

### Text-to-Speech

**POST** `/api/google-cloud/text-to-speech/synthesize`
- Synthesize speech from text
- Body: `{ input: { text } or { ssml }, voice, audioConfig }`

**GET** `/api/google-cloud/text-to-speech/voices?languageCode=en-US`
- Get available voices

### Cloud Storage

**POST** `/api/google-cloud/storage/upload`
- Upload file to Cloud Storage
- Body: `{ bucket, path, file (base64), contentType, metadata, makePublic, cacheControl }`

**POST** `/api/google-cloud/storage/get-url`
- Get signed URL for file
- Body: `{ bucket, path, expiresIn }`

**POST** `/api/google-cloud/storage/delete`
- Delete file from Cloud Storage
- Body: `{ bucket, path }`

**POST** `/api/google-cloud/storage/list`
- List files in bucket
- Body: `{ bucket, prefix, maxResults }`

### Natural Language API

**POST** `/api/google-cloud/language/analyze-sentiment`
- Analyze sentiment of text
- Body: `{ document, encodingType }`

**POST** `/api/google-cloud/language/analyze-entities`
- Extract entities from text
- Body: `{ document, encodingType }`

**POST** `/api/google-cloud/language/classify-text`
- Classify text into categories
- Body: `{ document }`

## Deployment

### Deploy to Cloud Run (Recommended)

1. Build Docker image:
```bash
docker build -t gcr.io/YOUR_PROJECT_ID/mindbloom-proxy .
```

2. Push to Container Registry:
```bash
docker push gcr.io/YOUR_PROJECT_ID/mindbloom-proxy
```

3. Deploy to Cloud Run:
```bash
gcloud run deploy mindbloom-proxy \
  --image gcr.io/YOUR_PROJECT_ID/mindbloom-proxy \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to App Engine

1. Update `app.yaml` with your configuration
2. Deploy:
```bash
gcloud app deploy
```

### Deploy to Cloud Functions

See `functions/` directory for serverless function examples.

## Security

1. Use environment variables for sensitive data
2. Enable CORS only for your frontend domains
3. Implement rate limiting
4. Use IAM roles with least privilege
5. Enable Cloud Audit Logs
6. Regularly rotate service account keys

## Cost Optimization

1. Implement caching where appropriate
2. Use quota limits to prevent unexpected charges
3. Monitor usage in Cloud Console
4. Set up billing alerts

