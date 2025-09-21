#!/bin/bash

# MindBloom App - Simple Setup Script
echo "🌱 MindBloom - AI Mental Wellness Companion"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "mindbloom-app/package.json" ]; then
    echo "❌ Please run this script from the MINDBLOOM directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

echo "📁 Found MindBloom project directory"
echo ""

# Navigate to project directory
cd mindbloom-app

echo "📦 Installing dependencies..."
echo "   This may take a few minutes..."

# Install dependencies with verbose output
npm install --verbose

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🚀 Starting MindBloom..."
    echo "📱 The app will open in your browser at: http://localhost:3000"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    echo "🎉 Welcome to MindBloom - Your AI Wellness Companion!"
    echo ""
    
    # Start the development server
    npm start
else
    echo ""
    echo "❌ Failed to install dependencies"
    echo ""
    echo "🔧 Troubleshooting tips:"
    echo "   1. Make sure you have Node.js 16+ installed"
    echo "   2. Try running: npm cache clean --force"
    echo "   3. Check your internet connection"
    echo "   4. Try running: npm install --legacy-peer-deps"
    echo ""
    exit 1
fi
