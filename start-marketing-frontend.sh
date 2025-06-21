#!/bin/bash

# Start script for marketing frontend
echo "======================================"
echo "Setting up Marketing Role Frontend"
echo "======================================"

# Navigate to the backend directory
echo -e "\nFirst, starting the backend server..."
cd /workspaces/APIE-CAMP-Group-6/backend
npm install
node scripts/create-marketing-user.js &
node index.js &
BACKEND_PID=$!

# Wait for backend to start
echo -e "\nWaiting for backend to initialize..."
sleep 5

# Navigate to the frontend directory
echo -e "\nNow setting up the frontend..."
cd /workspaces/APIE-CAMP-Group-6/frontend
npm install

echo -e "\nStarting the frontend application..."
npm start

# Cleanup function
cleanup() {
  echo -e "\nCleaning up processes..."
  kill $BACKEND_PID
  exit 0
}

# Register the cleanup function for when the script exits
trap cleanup SIGINT SIGTERM

# Wait for the frontend process
wait
