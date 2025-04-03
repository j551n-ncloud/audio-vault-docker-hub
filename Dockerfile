
FROM node:18-slim

# Install required dependencies including ffmpeg
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    eyeD3 \
    && rm -rf /var/lib/apt/lists/*

# Install spotdl and yt-dlp
RUN pip3 install --no-cache-dir spotdl yt-dlp

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 8080

# Create directories
RUN mkdir -p /app/downloads /audio /youtube /playlists

# Start the application
CMD ["npm", "start"]
