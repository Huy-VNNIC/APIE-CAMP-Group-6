#!/bin/bash

echo "=== Starting Online Coding Platform Docker Setup ==="

# Step 1: Clean up any existing containers
echo "Step 1: Stopping and removing any existing containers..."
docker-compose down -v

# Step 2: Build the images with no cache to ensure fresh builds
echo "Step 2: Building Docker images..."
docker-compose build 

# Step 3: Start MongoDB only first
echo "Step 3: Starting MongoDB container..."
docker-compose up -d mongodb
echo "Waiting for MongoDB to initialize (15 seconds)..."
sleep 15

# Check if MongoDB is running
if ! docker-compose ps mongodb | grep -q "Up"; then
  echo "ERROR: MongoDB container failed to start. Exiting."
  docker-compose logs mongodb
  exit 1
fi

# Step 4: Start the backend with direct output
echo "Step 4: Starting backend container in foreground to debug..."
echo "Press Ctrl+C when the backend is running successfully to continue with the setup"
docker-compose up backend

# After manually confirming backend is working, continue with setup
echo "Step 5: Starting all services in background..."
docker-compose up -d

# Wait for services to initialize
echo "Waiting for services to initialize (15 seconds)..."
sleep 15

# Step 6: Show status of all containers
echo "Step 6: Showing container status..."
docker-compose ps

echo ""
echo "Access your services at:"
echo "MongoDB: mongodb://localhost:27018"
echo "Backend API: http://localhost:5001"
echo "Frontend: http://localhost:3001"
echo ""
echo "Check container logs with:"
echo "docker-compose logs -f [service_name]"
echo ""
echo "To stop all services:"
echo "docker-compose down"
