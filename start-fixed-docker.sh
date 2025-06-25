#!/bin/bash

echo "=== Starting Online Coding Platform Docker Setup ==="

# Step 1: Clean up any existing containers
echo "Step 1: Stopping and removing any existing containers..."
docker-compose down -v
docker system prune -f --volumes

# Step 2: Check if any MongoDB container is running on port 27017
if sudo lsof -i :27017 >/dev/null 2>&1; then
  echo "WARNING: Port 27017 is already in use by another process."
  echo "We'll use port 27018 for MongoDB in docker-compose."
  
  # Remind user that we're using port 27018
  echo "Make sure services are configured to connect to port 27018 in docker-compose.yml"
fi

# Step 3: Build the images with no cache to ensure fresh builds
echo "Step 3: Building Docker images from scratch..."
docker-compose build --no-cache

# Step 4: Start MongoDB only first
echo "Step 4: Starting MongoDB container..."
docker-compose up -d mongodb
echo "Waiting for MongoDB to initialize (20 seconds)..."
sleep 20

# Step 5: Check MongoDB health
echo "Step 5: Checking MongoDB health status..."
MONGO_HEALTH=$(docker-compose ps | grep mongodb | grep -i "healthy" || echo "")
if [ -z "$MONGO_HEALTH" ]; then
  echo "MongoDB may not be healthy yet. Checking logs:"
  docker-compose logs mongodb
  echo "Giving MongoDB more time to start (20 more seconds)..."
  sleep 20
fi

# Step 6: Start the backend
echo "Step 6: Starting backend container..."
docker-compose up -d backend
echo "Waiting for backend to initialize (45 seconds)..."
sleep 45

# Step 7: Check backend health
echo "Step 7: Checking backend health status..."
BACKEND_HEALTH=$(docker-compose ps | grep backend | grep -i "healthy" || echo "")
if [ -z "$BACKEND_HEALTH" ]; then
  echo "Backend may not be healthy yet. Checking logs:"
  docker-compose logs backend
  echo "Giving backend more time to start (30 more seconds)..."
  sleep 30
fi

# Step 8: Start the frontend
echo "Step 8: Starting frontend container..."
docker-compose up -d frontend
echo "Waiting for frontend to initialize (20 seconds)..."
sleep 20

# Step 9: Show status of all containers
echo "Step 9: Showing container status..."
docker-compose ps

# Step 10: Check if all services are running
if docker-compose ps | grep -q "Exit\|exited\|unhealthy"; then
  echo "=== WARNING: Some containers failed to start properly ==="
  echo "Here are the logs for the failed containers:"
  
  if docker-compose ps | grep mongodb | grep -q "Exit\|exited\|unhealthy"; then
    echo "=== MONGODB LOGS ==="
    docker-compose logs mongodb
  fi
  
  if docker-compose ps | grep backend | grep -q "Exit\|exited\|unhealthy"; then
    echo "=== BACKEND LOGS ==="
    docker-compose logs backend
  fi
  
  if docker-compose ps | grep frontend | grep -q "Exit\|exited\|unhealthy"; then
    echo "=== FRONTEND LOGS ==="
    docker-compose logs frontend
  fi
  
  echo ""
  echo "Try running the containers individually to debug:"
  echo "docker-compose up mongodb"
  echo "docker-compose up backend"
  echo "docker-compose up frontend"
else
  echo "=== Setup Complete! All services appear to be running ==="
fi

# Display access information
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
echo ""
echo "If you encounter issues, try running each service individually:"
echo "docker-compose up mongodb"
echo "docker-compose up backend"
echo "docker-compose up frontend"
