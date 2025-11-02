# MindBloom App - Deployment Guide

## 🚀 Hosting the Application

### Prerequisites
- Node.js 14+ installed
- Google Cloud Platform account with billing enabled
- Google Cloud project with APIs enabled

### Setup Instructions

#### 1. Frontend Setup

```bash
cd mindbloom-app
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# See GOOGLE_CLOUD_SETUP.md for detailed setup
```

#### 2. Backend Proxy Setup

```bash
cd server-proxy
npm install

# Copy environment template
cp .env.example .env

# Download service account key from Google Cloud Console
# Place it as: server-proxy/service-account-key.json
# Update .env with your project details
```

#### 3. Running Locally

**Terminal 1 - Start Proxy Server:**
```bash
cd server-proxy
npm start
# Server runs on http://localhost:5001
```

**Terminal 2 - Start React App:**
```bash
cd mindbloom-app
npm start
# App runs on http://localhost:3000
```

### 🐳 Docker Deployment (Optional)

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

### ☁️ Cloud Hosting Options

#### Option 1: Vercel (Frontend) + Cloud Run (Backend)
1. **Frontend on Vercel:**
   - Connect GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

2. **Backend on Google Cloud Run:**
   ```bash
   gcloud run deploy mindbloom-proxy \
     --source ./server-proxy \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### Option 2: Netlify (Frontend) + Railway (Backend)
1. **Frontend on Netlify:**
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `build`
   - Add environment variables

2. **Backend on Railway:**
   - Connect repository
   - Set working directory to `server-proxy`
   - Add environment variables
   - Deploy

#### Option 3: Full Google Cloud Deployment
1. **Frontend - Cloud Storage + Cloud CDN:**
   ```bash
   gsutil mb gs://mindbloom-app-frontend
   gsutil -m cp -r build/* gs://mindbloom-app-frontend/
   gsutil web set -m index.html -e index.html gs://mindbloom-app-frontend
   ```

2. **Backend - Cloud Run:**
   ```bash
   cd server-proxy
   gcloud run deploy mindbloom-proxy \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### 🔐 Environment Variables for Production

**Frontend (.env.production):**
```env
REACT_APP_GOOGLE_CLOUD_PROXY_URL=https://your-proxy-url.com/api/google-cloud
REACT_APP_GEMINI_API_KEY=your-production-api-key
REACT_APP_SUPABASE_URL=your-production-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-production-supabase-key
```

**Backend (.env):**
```env
PORT=5001
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_CLOUD_STORAGE_BUCKET=your-storage-bucket
GEMINI_API_KEY=your-production-api-key
CORS_ORIGIN=https://your-frontend-url.com
```

### 📝 Important Security Notes

1. **Never commit:**
   - `.env` files
   - `service-account-key.json` files
   - API keys in code

2. **Use environment variables:**
   - All sensitive data should be in environment variables
   - Use platform-specific secret management (Vercel, Netlify, etc.)

3. **CORS Configuration:**
   - Update `CORS_ORIGIN` in backend to match your frontend URL
   - For production: `https://your-domain.com`

### 🛠️ Troubleshooting

**Issue: CORS errors**
- Check that `CORS_ORIGIN` in backend matches frontend URL
- Ensure proxy server is running

**Issue: Google Cloud API errors**
- Verify service account key is correct
- Check API enablement in Google Cloud Console
- Verify project ID and region match

**Issue: Build fails**
- Check Node.js version (14+ required)
- Run `npm install` in both directories
- Check for missing dependencies

### 📚 Additional Resources

- See `GOOGLE_CLOUD_SETUP.md` for Google Cloud configuration
- See `GOOGLE_CLOUD_INTEGRATION.md` for API integration details
- See `ENHANCEMENTS.md` for feature documentation

