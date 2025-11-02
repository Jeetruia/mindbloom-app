/**
 * Google Cloud Proxy Server
 * 
 * Express.js server that acts as a secure proxy for Google Cloud API calls
 * This prevents exposing service account keys in the frontend
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Google Cloud client libraries (server-side only)
const { SpeechClient } = require('@google-cloud/speech');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { Storage } = require('@google-cloud/storage');
const language = require('@google-cloud/language');
// Note: Vertex AI will use REST API for now (simpler integration)

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Initialize Google Cloud clients
const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();
const storage = new Storage();
const languageClient = new language.LanguageServiceClient();

// Initialize Vertex AI (using REST API approach)
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = process.env.GOOGLE_CLOUD_REGION || 'us-central1';

// Vertex AI will use REST API calls (implemented in the route handler)
const vertexAIConfigured = !!PROJECT_ID;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== Vertex AI / Gemini ====================

app.post('/api/google-cloud/vertex-ai/generate', async (req, res) => {
  try {
    const { projectId, location, model, messages } = req.body;

    if (!vertexAIConfigured) {
      return res.status(503).json({ error: 'Vertex AI not configured' });
    }

    // Use the free Gemini API as a proxy (for now)
    // TODO: Implement proper Vertex AI REST API integration
    // For now, fall back to free API endpoint which works similarly
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'Gemini API key not configured. Please set GEMINI_API_KEY or implement Vertex AI REST API.' });
    }

    console.log('Received request with messages:', JSON.stringify(messages).substring(0, 200));
    
    // Format messages for Gemini API - the API expects contents array
    let formattedMessages = messages.map(msg => {
      if (msg.parts && msg.parts.length > 0) {
        return {
          role: msg.role === 'model' ? 'model' : 'user',
          parts: msg.parts.map(part => {
            if (typeof part === 'string') {
              return { text: part };
            }
            if (part && part.text) {
              return part;
            }
            return { text: JSON.stringify(part) };
          })
        };
      }
      // Fallback for alternative format
      return {
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text || msg.content || JSON.stringify(msg) }]
      };
    });

    console.log('Formatted messages:', JSON.stringify(formattedMessages).substring(0, 200));

    // Use the correct Gemini API endpoint
    // Use gemini-2.5-flash which is available (from listModels API)
    const modelName = 'gemini-2.5-flash'; // Use available model
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
    console.log('Using model:', modelName, 'URL:', baseUrl);
    
    const response = await fetch(`${baseUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API success response:', JSON.stringify(data).substring(0, 200));
    res.json(data);
  } catch (error) {
    console.error('Vertex AI error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Speech-to-Text ====================

app.post('/api/google-cloud/speech-to-text/recognize', async (req, res) => {
  try {
    const { config, audio } = req.body;

    const request = {
      audio: {
        content: audio.content,
      },
      config: {
        encoding: config.encoding || 'LINEAR16',
        sampleRateHertz: config.sampleRateHertz || 16000,
        languageCode: config.languageCode || 'en-US',
        enableAutomaticPunctuation: config.enableAutomaticPunctuation !== false,
        model: config.model || 'latest_short',
        useEnhanced: config.useEnhanced !== false,
      },
    };

    const [response] = await speechClient.recognize(request);
    res.json(response);
  } catch (error) {
    console.error('Speech-to-Text error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Text-to-Speech ====================

app.post('/api/google-cloud/text-to-speech/synthesize', async (req, res) => {
  try {
    const { input, voice, audioConfig } = req.body;

    const request = {
      input: input,
      voice: voice || {
        languageCode: 'en-US',
        name: 'en-US-Neural2-F',
        ssmlGender: 'FEMALE',
      },
      audioConfig: audioConfig || {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        pitch: 0,
        volumeGainDb: 0,
        sampleRateHertz: 24000,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    res.json({
      audioContent: response.audioContent.toString('base64'),
    });
  } catch (error) {
    console.error('Text-to-Speech error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/google-cloud/text-to-speech/voices', async (req, res) => {
  try {
    const languageCode = req.query.languageCode;

    const request = languageCode ? { languageCode } : {};
    const [response] = await ttsClient.listVoices(request);

    res.json({
      voices: response.voices,
    });
  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Cloud Storage ====================

app.post('/api/google-cloud/storage/upload', async (req, res) => {
  try {
    const { bucket: bucketName, path, file, contentType, metadata, makePublic, cacheControl } = req.body;

    const bucket = storage.bucket(bucketName);
    const fileBuffer = Buffer.from(file, 'base64');

    const fileHandle = bucket.file(path);

    await fileHandle.save(fileBuffer, {
      metadata: {
        contentType: contentType || 'application/octet-stream',
        metadata: metadata || {},
        cacheControl: cacheControl || 'public, max-age=3600',
      },
    });

    if (makePublic) {
      await fileHandle.makePublic();
    }

    const [metadata_result] = await fileHandle.getMetadata();
    
    res.json({
      name: metadata_result.name,
      bucket: metadata_result.bucket,
      size: parseInt(metadata_result.size),
      contentType: metadata_result.contentType,
      timeCreated: metadata_result.timeCreated,
      updated: metadata_result.updated,
      publicUrl: makePublic ? `https://storage.googleapis.com/${bucketName}/${path}` : undefined,
    });
  } catch (error) {
    console.error('Storage upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/google-cloud/storage/get-url', async (req, res) => {
  try {
    const { bucket: bucketName, path, expiresIn } = req.body;

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(path);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + (expiresIn || 3600) * 1000,
    });

    res.json({ url });
  } catch (error) {
    console.error('Get URL error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/google-cloud/storage/delete', async (req, res) => {
  try {
    const { bucket: bucketName, path } = req.body;

    const bucket = storage.bucket(bucketName);
    await bucket.file(path).delete();

    res.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/google-cloud/storage/list', async (req, res) => {
  try {
    const { bucket: bucketName, prefix, maxResults } = req.body;

    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({
      prefix: prefix || '',
      maxResults: maxResults || 100,
    });

    const fileMetadata = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        return {
          name: metadata.name,
          bucket: metadata.bucket,
          size: parseInt(metadata.size),
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated,
        };
      })
    );

    res.json({ files: fileMetadata });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Natural Language API ====================

app.post('/api/google-cloud/language/analyze-sentiment', async (req, res) => {
  try {
    const { document, encodingType } = req.body;

    const [result] = await languageClient.analyzeSentiment({
      document: {
        type: document.type || 'PLAIN_TEXT',
        content: document.content,
        languageCode: document.languageCode || 'en',
      },
      encodingType: encodingType || 'UTF8',
    });

    res.json(result);
  } catch (error) {
    console.error('Analyze sentiment error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/google-cloud/language/analyze-entities', async (req, res) => {
  try {
    const { document, encodingType } = req.body;

    const [result] = await languageClient.analyzeEntities({
      document: {
        type: document.type || 'PLAIN_TEXT',
        content: document.content,
        languageCode: document.languageCode || 'en',
      },
      encodingType: encodingType || 'UTF8',
    });

    res.json(result);
  } catch (error) {
    console.error('Analyze entities error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/google-cloud/language/classify-text', async (req, res) => {
  try {
    const { document } = req.body;

    const [result] = await languageClient.classifyText({
      document: {
        type: document.type || 'PLAIN_TEXT',
        content: document.content,
      },
    });

    res.json(result);
  } catch (error) {
    console.error('Classify text error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Google Cloud Proxy Server running on port ${PORT}`);
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Location: ${LOCATION}`);
});

