#!/bin/bash
# Restart the proxy server with the new API key

echo "Stopping existing server processes..."
pkill -f "node.*server-proxy" || true
pkill -f "npm.*start" || true

sleep 2

echo "Starting server with new configuration..."
cd /Users/jeetruia/MINDBLOOM/mindbloom-app/server-proxy
npm start &

echo "Server should be running on port 5001"
echo "Wait a few seconds for it to start, then test at: http://localhost:5001/health"

