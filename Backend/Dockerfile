FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose container port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start Express server
CMD ["node", "server.js"]
