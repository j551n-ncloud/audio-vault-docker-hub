
# Use Node.js as base image for the frontend
FROM node:18-alpine AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Python image for the audio tools
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -O /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Install Python packages
RUN pip install --no-cache-dir spotdl eyed3

# Set up the web server with the frontend
WORKDIR /app
COPY --from=frontend /app/dist /app

# Install a simple HTTP server to serve the frontend
RUN npm install -g serve

# Expose port
EXPOSE 8080

# Start the web server
CMD ["serve", "-s", ".", "-p", "8080"]
