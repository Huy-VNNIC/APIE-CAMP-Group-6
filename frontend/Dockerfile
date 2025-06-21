FROM node:18-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package*.json ./
# Create npm configuration to better handle dependencies
RUN npm config set legacy-peer-deps true
# Create package.json resolutions to force date-fns version
RUN npm pkg set resolutions="{\"date-fns\": \"2.30.0\"}"
# Update package-lock.json to match resolutions
RUN npm install --package-lock-only
# Install dependencies with updated package-lock.json
RUN npm ci
# Explicitly install and overwrite date-fns with the correct version
RUN npm install --save date-fns@2.30.0

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
