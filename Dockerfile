
FROM node:18-slim

# Install required dependencies including ffmpeg
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install spotdl, yt-dlp and eyeD3 with --break-system-packages flag
RUN pip3 install --no-cache-dir --break-system-packages spotdl yt-dlp eyeD3

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

# Start the application using the preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
