#!/bin/bash

echo "=== Starting Online Coding Platform Docker Setup ==="

# Step 1: Clean up any existing containers
echo "Step 1: Cleaning up existing containers..."
docker-compose down -v
docker system prune -af --volumes

# Step 2: Build the images
echo "Step 2: Building Docker images..."
docker-compose build

# Step 3: Start MongoDB only first
echo "Step 3: Starting MongoDB container..."
docker-compose up -d mongodb
echo "Waiting for MongoDB to initialize..."
sleep 15

# Step 4: Start the backend
echo "Step 4: Starting backend container..."
docker-compose up -d backend
echo "Waiting for backend to initialize..."
sleep 30

# Step 5: Start the frontend
echo "Step 5: Starting frontend container..."
docker-compose up -d frontend

# Step 6: Show status
echo "Step 6: Showing container status..."
docker-compose ps

echo "=== Setup Complete ==="
echo "MongoDB: http://localhost:27017"
echo "Backend API: http://localhost:5001"
echo "Frontend: http://localhost:3001"
echo ""
echo "Check container logs with:"
echo "docker-compose logs -f [service_name]"
echo ""
echo "To stop all services:"
echo "docker-compose down"
