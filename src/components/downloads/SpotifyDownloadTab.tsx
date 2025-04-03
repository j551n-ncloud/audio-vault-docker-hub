
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, List, Music, Image, Terminal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDownloadStatus } from "@/hooks/useDownloadStatus";
import { useToast } from "@/hooks/use-toast";
import StatusDisplay from "./StatusDisplay";
import CommandDisplay from "./CommandDisplay";

interface SpotifyDownloadTabProps {
  onCreatePlaylist: () => void;
  onEditCover: () => void;
}

export default function SpotifyDownloadTab({ onCreatePlaylist, onEditCover }: SpotifyDownloadTabProps) {
  // Form states
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [outputDir, setOutputDir] = useState("/audio");
  const [generateLyrics, setGenerateLyrics] = useState(true);
  const [embedLyrics, setEmbedLyrics] = useState(true);
  const [downloadType, setDownloadType] = useState<"single" | "playlist">("single");
  const [audioBitrate, setAudioBitrate] = useState("320");
  
  const { toast } = useToast();
  const { 
    isDownloading, 
    downloadComplete, 
    downloadStatus,
    embedStatus,
    playlistStatus,
    currentCommand,
    startDownload,
    simulateEmbedLyrics 
  } = useDownloadStatus();

  const handleSpotifyDownload = () => {
    if (!spotifyUrl) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a valid Spotify URL"
      });
      return;
    }

    // Generate command preview using the correct spotdl syntax
    const command = `spotdl download "${spotifyUrl}" --output "${outputDir}" --format mp3 --bitrate ${audioBitrate}k ${generateLyrics ? '--generate-lrc' : ''}`;
    
    // Start download process
    startDownload({
      command,
      type: downloadType,
      onComplete: () => {
        if (generateLyrics && embedLyrics) {
          // After download is complete, we'd embed lyrics using eyeD3 as a separate step
          simulateEmbedLyrics();
          
          // The actual command to embed lyrics with eyeD3 would be something like:
          // find "${outputDir}" -name "*.mp3" -exec eyeD3 --add-lyrics="{}.lrc" {} \;
          const eyeD3Command = `find "${outputDir}" -name "*.mp3" -exec eyeD3 --add-lyrics="{}.lrc" {} \\;`;
          console.log("Embedding lyrics command:", eyeD3Command);
        }
      }
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-4 p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="download-type">Download Type</Label>
            <Select 
              defaultValue="single" 
              onValueChange={(value) => setDownloadType(value as "single" | "playlist")}
              disabled={isDownloading}
            >
              <SelectTrigger className="bg-background border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Track</SelectItem>
                <SelectItem value="playlist">Playlist/Album</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="bitrate">Audio Bitrate</Label>
            <Select 
              defaultValue="320" 
              onValueChange={setAudioBitrate}
              disabled={isDownloading}
            >
              <SelectTrigger className="bg-background border">
                <SelectValue placeholder="Select bitrate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128 kbps</SelectItem>
                <SelectItem value="192">192 kbps</SelectItem>
                <SelectItem value="256">256 kbps</SelectItem>
                <SelectItem value="320">320 kbps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="spotify-url">
            {downloadType === "single" ? "Track URL" : "Playlist/Album URL"}
          </Label>
          <Input
            id="spotify-url"
            placeholder={downloadType === "single" 
              ? "https://open.spotify.com/track/..." 
              : "https://open.spotify.com/playlist/..."}
            className="bg-background border"
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            disabled={isDownloading}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="output-dir">Output Directory</Label>
          <div className="flex gap-2">
            <Input
              id="output-dir"
              placeholder="/audio"
              className="bg-background border flex-1"
              value={outputDir}
              onChange={(e) => setOutputDir(e.target.value)}
              disabled={isDownloading}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="generate-lyrics" 
              checked={generateLyrics} 
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setGenerateLyrics(checked);
                  if (!checked) setEmbedLyrics(false);
                }
              }}
              disabled={isDownloading}
            />
            <Label htmlFor="generate-lyrics">Generate lyrics files (.lrc)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="embed-lyrics" 
              checked={embedLyrics} 
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setEmbedLyrics(checked);
                }
              }}
              disabled={isDownloading || !generateLyrics}
            />
            <Label 
              htmlFor="embed-lyrics" 
              className={!generateLyrics ? "text-muted-foreground" : ""}
            >
              Auto-embed lyrics after download (using eyeD3)
            </Label>
          </div>
        </div>
        
        {/* Command display */}
        {currentCommand && !isDownloading && downloadComplete && (
          <CommandDisplay command={currentCommand} />
        )}
        
        {/* Combined process status display */}
        {(isDownloading || downloadComplete) && (
          <StatusDisplay 
            downloadStatus={downloadStatus}
            embedStatus={(generateLyrics && embedLyrics) ? embedStatus : undefined}
            playlistStatus={downloadType === "playlist" && downloadComplete ? playlistStatus : undefined}
          />
        )}
        
        <div className="pt-4">
          <Button 
            className="w-full bg-primary hover:bg-primary/80"
            onClick={handleSpotifyDownload}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
          
          {downloadComplete && (
            <div className="flex w-full gap-2 mt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onCreatePlaylist}
              >
                <List className="mr-2 h-4 w-4" />
                Create Playlist
              </Button>
              
              {generateLyrics && !embedLyrics && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={simulateEmbedLyrics}
                >
                  <Music className="mr-2 h-4 w-4" />
                  Embed Lyrics
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onEditCover}
              >
                <Image className="mr-2 h-4 w-4" />
                Edit Cover
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
