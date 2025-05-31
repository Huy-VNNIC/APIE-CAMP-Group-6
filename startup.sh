#!/bin/bash

echo "=== Online Coding Platform Startup Script ==="
echo "Current Directory: $(pwd)"
echo "Date & Time: $(date)"
echo "Hostname: $(hostname)"
echo

if [ "$(hostname)" = "oncodedb" ]; then
  echo "Detected Database Server (VPS 2)"
  echo "Starting PostgreSQL container..."
  cd ~/Huy-workspace/online-coding-platform/postgres-docker
  docker-compose up -d
  
  echo "Checking container status..."
  sleep 3
  docker ps | grep coding_platform_db
  
  echo "Startup complete!"

elif [ "$(hostname)" = "oncode" ]; then
  echo "Detected Web Server (VPS 1)"
  echo "Starting Node.js application..."
  
  cd ~/Huy-workspace/online-coding-platform/web-server
  
  # Check if PM2 is installed
  if command -v pm2 &> /dev/null; then
    pm2 start src/server.js --name coding-platform
    echo "Application started with PM2"
  else
    echo "PM2 not found. Installing..."
    npm install -g pm2
    pm2 start src/server.js --name coding-platform
    echo "Application started with PM2"
  fi
  
  echo "Testing database connection..."
  node src/test-db-connection.js
  
  echo "Startup complete!"
else
  echo "Unknown server. Could not determine which services to start."
fi
