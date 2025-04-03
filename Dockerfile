
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
    unzip \
    curl \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -O /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Create virtual environment to avoid system package conflicts
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages in the virtual environment
RUN /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install spotdl eyed3

# Set up scripts directory
WORKDIR /spotdl
RUN mkdir -p /spotdl/audio /spotdl/scripts

# Create script files
RUN echo '#!/bin/bash\n\
\n\
# Check if arguments were provided, otherwise prompt\n\
if [ -z "$1" ]; then\n\
  read -p "Enter Spotify URL: " SPOTIFY_URL\n\
else\n\
  SPOTIFY_URL="$1"\n\
fi\n\
\n\
if [ -z "$2" ]; then\n\
  read -p "Enter output directory: " OUTPUT_DIR\n\
else\n\
  OUTPUT_DIR="$2"\n\
fi\n\
\n\
# Ensure the output directory exists\n\
mkdir -p "$OUTPUT_DIR"\n\
\n\
# Run spotdl with user input\n\
spotdl --bitrate 320k --generate-lrc --output "$OUTPUT_DIR" "$SPOTIFY_URL"\n\
\n\
echo "Download and lyrics generation complete!"\n\
' > /spotdl/scripts/download.sh

RUN echo '#!/bin/bash\n\
\n\
# Check if argument was provided, otherwise prompt\n\
if [ -z "$1" ]; then\n\
  read -p "Enter the path to the music folder: " MUSIC_FOLDER\n\
else\n\
  MUSIC_FOLDER="$1"\n\
fi\n\
\n\
# Check if the folder exists\n\
if [ ! -d "$MUSIC_FOLDER" ]; then\n\
    echo "Error: Directory '"$MUSIC_FOLDER"' does not exist."\n\
    exit 1\n\
fi\n\
\n\
# Loop through all MP3 files in the given folder\n\
for file in "$MUSIC_FOLDER"/*.mp3; do\n\
    lrc_file="${file%.mp3}.lrc"\n\
    if [ -f "$lrc_file" ]; then\n\
        echo "Embedding lyrics into: $file"\n\
        eyeD3 --add-lyrics "$lrc_file" "$file"\n\
    else\n\
        echo "No matching lyrics file for: $file"\n\
    fi\n\
done\n\
\n\
echo "Lyrics embedding complete!"\n\
' > /spotdl/scripts/embed_lyrics.sh

RUN echo '#!/bin/bash\n\
\n\
# Check if arguments were provided, otherwise prompt\n\
if [ -z "$1" ]; then\n\
  read -p "Enter the folder path: " folder\n\
else\n\
  folder="$1"\n\
fi\n\
\n\
if [ -z "$2" ]; then\n\
  read -p "Enter the playlist name (without .m3u extension): " playlist_name\n\
else\n\
  playlist_name="$2"\n\
fi\n\
\n\
# Check if the folder exists\n\
if [ ! -d "$folder" ]; then\n\
  echo "The folder does not exist."\n\
  exit 1\n\
fi\n\
\n\
# Create the playlist\n\
cd "$folder" || exit\n\
ls *.mp3 | sed "s|^|./|" > "$playlist_name.m3u"\n\
\n\
echo "Playlist created: $playlist_name.m3u"\n\
' > /spotdl/scripts/playlist.sh

RUN echo '#!/bin/bash\n\
\n\
# Check if arguments were provided, otherwise prompt\n\
if [ -z "$1" ]; then\n\
  read -p "Enter YouTube URL: " YOUTUBE_URL\n\
else\n\
  YOUTUBE_URL="$1"\n\
fi\n\
\n\
if [ -z "$2" ]; then\n\
  read -p "Enter output directory: " OUTPUT_DIR\n\
else\n\
  OUTPUT_DIR="$2"\n\
fi\n\
\n\
if [ -z "$3" ]; then\n\
  THUMBNAIL_OPTION="--embed-thumbnail"\n\
else\n\
  THUMBNAIL_OPTION="$3"\n\
fi\n\
\n\
# Ensure the output directory exists\n\
mkdir -p "$OUTPUT_DIR"\n\
\n\
# Run yt-dlp to extract audio with thumbnail options\n\
yt-dlp -x --audio-format mp3 --audio-quality 320K $THUMBNAIL_OPTION -o "$OUTPUT_DIR/%(title)s.%(ext)s" "$YOUTUBE_URL"\n\
\n\
echo "YouTube download complete!"\n\
' > /spotdl/scripts/youtube_download.sh

# Make all scripts executable
RUN chmod +x /spotdl/scripts/*.sh

# Set up the web server with the frontend
WORKDIR /app
COPY --from=frontend /app/dist /app

# Install a simple HTTP server to serve the frontend
RUN npm install -g serve

# Expose port
EXPOSE 8080

# Start the web server
CMD ["serve", "-s", ".", "-p", "8080"]
