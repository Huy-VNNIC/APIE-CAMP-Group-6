FROM node:18-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Make the entrypoint script executable
RUN chmod +x docker-entrypoint.sh

EXPOSE 5000

CMD ["./docker-entrypoint.sh"]
