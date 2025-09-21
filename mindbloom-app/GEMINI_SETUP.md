# Google Cloud Gemini API Setup

This guide will help you set up the Google Cloud Gemini API for the Chat with Mira feature.

## Prerequisites

- A Google account
- Access to Google AI Studio

## Step 1: Get Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add your Gemini API key:

```bash
# Google Cloud Gemini API Configuration
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

## Step 3: Restart the Development Server

After adding the API key, restart your development server:

```bash
npm start
```

## Features

The Chat with Mira feature includes:

- **AI-Powered Conversations**: Powered by Google's Gemini AI
- **Therapeutic Responses**: Trained to provide supportive, empathetic responses
- **Voice Input/Output**: Speech-to-text and text-to-speech capabilities
- **Smooth Animations**: Beautiful UI transitions and loading states
- **Safety Features**: Built-in safety settings and crisis support

## Troubleshooting

### API Key Issues
- Make sure your API key is correctly set in the `.env` file
- Ensure the `.env` file is in the root directory of your project
- Restart the development server after adding the API key

### Voice Features Not Working
- Check if your browser supports the Web Speech API
- Ensure you have a working microphone
- Try refreshing the page

### No Response from Mira
- Check your internet connection
- Verify the API key is valid
- Check the browser console for error messages

## Safety and Privacy

- All conversations are processed by Google's Gemini API
- No conversation data is stored locally
- The AI is configured with safety settings to prevent harmful content
- Crisis support resources are available if needed

## Support

If you encounter any issues, please check:
1. The browser console for error messages
2. Your API key configuration
3. Your internet connection
4. The Gemini API status page
