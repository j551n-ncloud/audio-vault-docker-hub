
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, List, Folder, Image, Terminal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDownloadStatus } from "@/hooks/useDownloadStatus";
import { useToast } from "@/hooks/use-toast";
import StatusDisplay from "./StatusDisplay";
import CommandDisplay from "./CommandDisplay";

interface YoutubeDownloadTabProps {
  onCreatePlaylist: () => void;
  onEditCover: () => void;
  onCreateFolder: () => void;
}

export default function YoutubeDownloadTab({ 
  onCreatePlaylist, 
  onEditCover, 
  onCreateFolder 
}: YoutubeDownloadTabProps) {
  // Form states
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeOutputDir, setYoutubeOutputDir] = useState("/youtube");
  const [embedThumbnails, setEmbedThumbnails] = useState(true);
  const [writeAllThumbs, setWriteAllThumbs] = useState(false);
  const [youtubeDownloadType, setYoutubeDownloadType] = useState<"single" | "playlist">("single");
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
    simulateEmbedThumbnails 
  } = useDownloadStatus();

  const handleYoutubeDownload = () => {
    if (!youtubeUrl) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a valid YouTube URL"
      });
      return;
    }

    // Generate command preview with correct yt-dlp syntax
    let thumbnailOptions = "";
    if (embedThumbnails && writeAllThumbs) {
      thumbnailOptions = "--write-all-thumbnails --embed-thumbnail";
    } else if (embedThumbnails) {
      thumbnailOptions = "--embed-thumbnail";
    } else if (writeAllThumbs) {
      thumbnailOptions = "--write-all-thumbnails";
    }
    
    const playlistOption = youtubeDownloadType === "playlist" ? "--yes-playlist" : "--no-playlist";
    const command = `yt-dlp ${youtubeUrl} -x --audio-format mp3 --audio-quality ${audioBitrate}k ${thumbnailOptions} ${playlistOption} -o "${youtubeOutputDir}/%(title)s.%(ext)s"`;
    
    // Start download process
    startDownload({
      command,
      type: youtubeDownloadType,
      onComplete: () => {
        if (embedThumbnails || writeAllThumbs) {
          simulateEmbedThumbnails();
        }
      }
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-4 p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="youtube-download-type">Download Type</Label>
            <Select 
              defaultValue="single" 
              onValueChange={(value) => setYoutubeDownloadType(value as "single" | "playlist")}
              disabled={isDownloading}
            >
              <SelectTrigger className="bg-background border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Video</SelectItem>
                <SelectItem value="playlist">Playlist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="bitrate-yt">Audio Bitrate</Label>
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
          <Label htmlFor="youtube-url">
            {youtubeDownloadType === "single" ? "Video URL" : "Playlist URL"}
          </Label>
          <Input
            id="youtube-url"
            placeholder={youtubeDownloadType === "single" 
              ? "https://www.youtube.com/watch?v=..." 
              : "https://www.youtube.com/playlist?list=..."}
            className="bg-background border"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            disabled={isDownloading}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="youtube-output-dir">Output Directory</Label>
          <div className="flex gap-2">
            <Input
              id="youtube-output-dir"
              placeholder="/youtube"
              className="bg-background border flex-1"
              value={youtubeOutputDir}
              onChange={(e) => setYoutubeOutputDir(e.target.value)}
              disabled={isDownloading}
            />
            <Button
              variant="outline"
              onClick={onCreateFolder}
              disabled={isDownloading}
            >
              <Folder className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="embed-thumbnails" 
              checked={embedThumbnails} 
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setEmbedThumbnails(checked);
                }
              }}
              disabled={isDownloading}
            />
            <Label htmlFor="embed-thumbnails">
              Embed thumbnails
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="write-all-thumbs" 
              checked={writeAllThumbs} 
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setWriteAllThumbs(checked);
                }
              }}
              disabled={isDownloading}
            />
            <Label htmlFor="write-all-thumbs">
              Write all thumbnails
            </Label>
          </div>
        </div>
        
        {/* Command display */}
        {currentCommand && !isDownloading && downloadComplete && (
          <CommandDisplay command={currentCommand} />
        )}
        
        {/* Process status display */}
        {(isDownloading || downloadComplete) && (
          <StatusDisplay 
            downloadStatus={downloadStatus}
            embedStatus={(embedThumbnails || writeAllThumbs) && downloadComplete ? embedStatus : undefined}
            playlistStatus={youtubeDownloadType === "playlist" && downloadComplete ? playlistStatus : undefined}
          />
        )}
        
        <div className="pt-4">
          <Button 
            className="w-full bg-primary hover:bg-primary/80"
            onClick={handleYoutubeDownload}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
          
          {downloadComplete && (
            <div className="flex w-full gap-2 mt-2">
              {youtubeDownloadType === "playlist" && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onCreatePlaylist}
                >
                  <List className="mr-2 h-4 w-4" />
                  Create Playlist
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
              
              <Button
                variant="outline"
                className="flex-1"
                onClick={onCreateFolder}
              >
                <Folder className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
