# Chat with Mira - API Configuration Fix

## Issue
The chat is showing a generic fallback message instead of proper therapeutic responses.

## Root Cause
The server proxy needs `GEMINI_API_KEY` in its `.env` file to make API calls.

## Solution

### 1. Add Gemini API Key to Server

Add the following to `/mindbloom-app/server-proxy/.env`:

```bash
# Add this line (replace with your actual Gemini API key)
GEMINI_API_KEY=your-gemini-api-key-here
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to the server `.env` file

### 3. Restart Server

After adding the API key, restart the proxy server:

```bash
cd mindbloom-app/server-proxy
npm start
```

### 4. Verify Configuration

The frontend `.env` should have:

```bash
REACT_APP_GOOGLE_CLOUD_PROXY_URL=http://localhost:5001/api/google-cloud
REACT_APP_GEMINI_API_KEY=your-api-key-here  # Optional fallback
```

## Enhanced Features Added

### Better Error Handling
- Detailed error messages showing actual issues
- Fallback to direct Gemini API if proxy fails
- Meaningful error responses instead of generic messages

### Improved Logging
- Console logs for API calls
- Error details for debugging
- Response format validation

### Fallback Chain
1. Try Vertex AI proxy (`/api/google-cloud/vertex-ai/generate`)
2. If proxy fails, try direct Gemini API (using `REACT_APP_GEMINI_API_KEY`)
3. If all fail, provide meaningful fallback response

## Testing

After configuration:

1. Open browser console (F12)
2. Send a message in chat
3. Check console for:
   - "Calling Vertex AI with prompt..."
   - "Vertex AI response received..."
   - Any error messages

## Expected Behavior

Once configured correctly:
- You'll get professional therapeutic responses
- Responses will be contextual and empathetic
- Technique indicators will show (🧠 CBT, 💚 DBT, etc.)
- Suggested activities based on emotions
- Session stats will update

## Troubleshooting

### Still getting generic messages?
1. Check server console for errors
2. Verify `GEMINI_API_KEY` is in server `.env`
3. Check browser console for error details
4. Verify proxy URL is correct (`http://localhost:5001/api/google-cloud`)

### API Key Issues?
- Make sure the API key is valid
- Check API quota/limits
- Verify key is not expired

### Proxy Connection Errors?
- Ensure server is running on port 5001
- Check CORS settings in server
- Verify `REACT_APP_GOOGLE_CLOUD_PROXY_URL` is set correctly

