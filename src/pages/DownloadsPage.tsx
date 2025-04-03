
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Music, Youtube, AlertCircle, Folder, List, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function DownloadsPage() {
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [outputDir, setOutputDir] = useState("/audio");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generateLyrics, setGenerateLyrics] = useState(true);
  const [embedLyrics, setEmbedLyrics] = useState(true);
  const [audioBitrate, setAudioBitrate] = useState("320");
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [downloadType, setDownloadType] = useState<"single" | "playlist">("single");

  const { toast } = useToast();

  const handleSpotifyDownload = () => {
    if (!spotifyUrl) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a valid Spotify URL",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }

    setIsDownloading(true);
    setProgress(0);
    setDownloadComplete(false);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadComplete(true);
          toast({
            title: "Download complete",
            description: "Your audio files have been downloaded successfully",
            icon: <CheckCircle2 className="h-4 w-4" />
          });
          return 100;
        }
        return prev + 2;
      });
    }, 300);
  };

  const handleYoutubeDownload = () => {
    if (!youtubeUrl) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a valid YouTube URL",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }

    setIsDownloading(true);
    setProgress(0);
    setDownloadComplete(false);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadComplete(true);
          toast({
            title: "Download complete",
            description: "Your audio has been downloaded successfully",
            icon: <CheckCircle2 className="h-4 w-4" />
          });
          return 100;
        }
        return prev + 3;
      });
    }, 300);
  };

  const handleEmbedLyrics = () => {
    toast({
      title: "Processing",
      description: "Embedding lyrics into downloaded files..."
    });

    // Simulate embedding process
    setTimeout(() => {
      toast({
        title: "Complete",
        description: "Lyrics have been embedded into your audio files",
        icon: <CheckCircle2 className="h-4 w-4" />
      });
    }, 2000);
  };

  const handleCreatePlaylist = () => {
    if (!playlistName) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a playlist name",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }
    
    toast({
      title: "Creating playlist",
      description: `Creating ${playlistName}.m3u from downloaded files`
    });
    
    // Simulate playlist creation
    setTimeout(() => {
      toast({
        title: "Playlist created",
        description: `${playlistName}.m3u has been created in ${outputDir}`,
        icon: <CheckCircle2 className="h-4 w-4" />
      });
      setIsCreatePlaylistDialogOpen(false);
      setPlaylistName("");
    }, 1500);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Audio Downloader</h1>
      </div>

      <Tabs defaultValue="spotify" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="spotify" className="flex items-center">
            <Music className="w-4 h-4 mr-2" />
            Spotify Downloader
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center">
            <Youtube className="w-4 h-4 mr-2" />
            YouTube Downloader
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="spotify">
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>SpotDL Downloader</CardTitle>
              <CardDescription>
                Download audio from Spotify tracks, albums or playlists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="download-type">Download Type</Label>
                <Select 
                  defaultValue="single" 
                  onValueChange={(value) => setDownloadType(value as "single" | "playlist")}
                  disabled={isDownloading}
                >
                  <SelectTrigger className="bg-black/30">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Track</SelectItem>
                    <SelectItem value="playlist">Playlist/Album</SelectItem>
                  </SelectContent>
                </Select>
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
                  className="bg-black/30"
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
                    className="bg-black/30 flex-1"
                    value={outputDir}
                    onChange={(e) => setOutputDir(e.target.value)}
                    disabled={isDownloading}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isDownloading}
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="bitrate">Audio Bitrate</Label>
                <Select 
                  defaultValue="320" 
                  onValueChange={setAudioBitrate}
                  disabled={isDownloading}
                >
                  <SelectTrigger className="bg-black/30">
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
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="generate-lyrics" 
                  checked={generateLyrics} 
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      setGenerateLyrics(checked);
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
                  Automatically embed lyrics after download
                </Label>
              </div>
              
              {isDownloading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Downloading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-audio-purple hover:bg-audio-purple/80"
                onClick={handleSpotifyDownload}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
              
              {downloadComplete && (
                <div className="flex w-full gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsCreatePlaylistDialogOpen(true)}
                  >
                    <List className="mr-2 h-4 w-4" />
                    Create Playlist
                  </Button>
                  
                  {generateLyrics && !embedLyrics && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleEmbedLyrics}
                    >
                      <Music className="mr-2 h-4 w-4" />
                      Embed Lyrics
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="youtube">
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>YT-DLP Downloader</CardTitle>
              <CardDescription>
                Download audio from YouTube videos or playlists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-black/30"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={isDownloading}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="output-dir-yt">Output Directory</Label>
                <div className="flex gap-2">
                  <Input
                    id="output-dir-yt"
                    placeholder="/audio"
                    className="bg-black/30 flex-1"
                    value={outputDir}
                    onChange={(e) => setOutputDir(e.target.value)}
                    disabled={isDownloading}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isDownloading}
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="bitrate-yt">Audio Bitrate</Label>
                <Select 
                  defaultValue="320" 
                  onValueChange={setAudioBitrate}
                  disabled={isDownloading}
                >
                  <SelectTrigger className="bg-black/30">
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
              
              {isDownloading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Downloading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-audio-purple hover:bg-audio-purple/80"
                onClick={handleYoutubeDownload}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
              
              {downloadComplete && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsCreatePlaylistDialogOpen(true)}
                >
                  <List className="mr-2 h-4 w-4" />
                  Create Playlist
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Playlist Dialog */}
      <Dialog open={isCreatePlaylistDialogOpen} onOpenChange={setIsCreatePlaylistDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="playlist-name">Playlist Name</Label>
              <Input
                id="playlist-name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="bg-black/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playlist-dir">Directory</Label>
              <Input
                id="playlist-dir"
                value={outputDir}
                onChange={(e) => setOutputDir(e.target.value)}
                className="bg-black/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePlaylistDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePlaylist}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
