FROM node:18-alpine

RUN apk --no-cache add curl

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm config set legacy-peer-deps true
RUN npm install

# Copy the rest of the app
COPY . .

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV WDS_SOCKET_PORT=0
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV BROWSER=none

EXPOSE 3000

CMD ["npm", "start"]
