# Use Node 18 on Alpine Linux
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY src ./src

EXPOSE 3000

CMD ["node", "src/server.js"]
