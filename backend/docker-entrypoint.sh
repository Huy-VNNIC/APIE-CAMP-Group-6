#!/bin/sh

# Add check for missing dependencies
echo "Checking for any missing Node.js dependencies..."
npm install --no-save axios

# Add bcryptjs package if missing
if ! grep -q "bcryptjs" package.json; then
  echo "Adding bcryptjs dependency..."
  npm install --save bcryptjs
fi

# Create simple health endpoint if it doesn't exist
echo "Setting up health endpoint..."
mkdir -p src/routes

# Add simple health check endpoint directly to index.js
if ! grep -q "app.get('/health'" index.js; then
  echo "Adding health check endpoint to index.js"
  sed -i -e '/const app = express/a\\n// Health check endpoint\napp.get(\"/health\", (req, res) => {\n  res.status(200).json({ status: \"healthy\" });\n});' index.js || echo "Failed to update index.js, but continuing..."
fi

# Wait for MongoDB to be available
echo "Waiting for MongoDB to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "Attempt $((RETRY_COUNT+1)) of $MAX_RETRIES to connect to MongoDB..."
  
  # Simple connection test
  if nc -z mongodb 27017; then
    echo "MongoDB is reachable!"
    sleep 2
    break
  else
    echo "Failed to connect to MongoDB, retrying in 5 seconds..."
    sleep 5
    RETRY_COUNT=$((RETRY_COUNT+1))
  fi
done

# Start the application
echo "Starting the application..."
node index.js
