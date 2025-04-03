
FROM node:18-slim

# Install required dependencies including ffmpeg
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-full \
    ffmpeg \
    python3-eyed3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create and activate a virtual environment for Python packages
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install spotdl and yt-dlp in the virtual environment
RUN /opt/venv/bin/pip install --no-cache-dir spotdl yt-dlp

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

# Create directories with correct permissions
RUN mkdir -p /app/downloads /audio /youtube /playlists \
    && chown -R node:node /app/downloads /audio /youtube /playlists

# Switch to non-root user
USER node

# Start the application
CMD ["npm", "start"]
