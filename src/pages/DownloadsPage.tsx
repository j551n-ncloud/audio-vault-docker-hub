
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Music, Youtube, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DownloadsPage() {
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
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

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          toast({
            title: "Download complete",
            description: "Your audio file has been downloaded successfully",
          });
          return 0;
        }
        return prev + 10;
      });
    }, 500);
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

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          toast({
            title: "Download complete",
            description: "Your audio file has been downloaded successfully",
          });
          return 0;
        }
        return prev + 8;
      });
    }, 400);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Downloads</h1>
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
                Download audio from Spotify tracks, albums or playlists using spotdl
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="spotify-url" className="text-sm font-medium">
                  Spotify URL
                </label>
                <Input
                  id="spotify-url"
                  placeholder="https://open.spotify.com/track/..."
                  className="bg-black/30"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  disabled={isDownloading}
                />
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
            <CardFooter>
              <Button 
                className="w-full bg-audio-purple hover:bg-audio-purple/80"
                onClick={handleSpotifyDownload}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
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
                <label htmlFor="youtube-url" className="text-sm font-medium">
                  YouTube URL
                </label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-black/30"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={isDownloading}
                />
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
            <CardFooter>
              <Button 
                className="w-full bg-audio-purple hover:bg-audio-purple/80"
                onClick={handleYoutubeDownload}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
