#!/bin/bash

# WellnessWorld Setup Script
echo "🌟 Setting up WellnessWorld - Mental Health Community Platform"
echo "=============================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Navigate to project directory
cd wellness-world

# Install dependencies
echo "📦 Installing dependencies..."
echo "   This may take a few minutes..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🌟 Welcome to WellnessWorld!"
    echo ""
    echo "🚀 Starting the community platform..."
    echo "📱 The app will open in your browser at: http://localhost:3000"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    echo "💝 Remember: Mental health is universal, not exceptional."
    echo "   You belong here, and your journey matters."
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
