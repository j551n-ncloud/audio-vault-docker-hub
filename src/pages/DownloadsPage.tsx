
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Music, Youtube, AlertCircle, Folder, List, CheckCircle2, Image, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

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
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [downloadType, setDownloadType] = useState<"single" | "playlist">("single");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [albumCoverUrl, setAlbumCoverUrl] = useState("");
  const [isAlbumCoverDialogOpen, setIsAlbumCoverDialogOpen] = useState(false);

  const { toast } = useToast();

  // Theme switcher effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

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
          
          // If it's a playlist download, prompt to create a playlist
          if (downloadType === "playlist") {
            setTimeout(() => {
              setIsCreatePlaylistDialogOpen(true);
            }, 500);
          }
          
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

    // Simulate download progress with combined thumbnail options
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadComplete(true);
          toast({
            title: "Download complete",
            description: "Your audio with thumbnails has been downloaded successfully",
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

  const handleCreateFolder = () => {
    if (!folderName) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a folder name",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }
    
    toast({
      title: "Creating folder",
      description: `Creating folder: ${folderName}`
    });
    
    // Simulate folder creation
    setTimeout(() => {
      toast({
        title: "Folder created",
        description: `${folderName} has been created at ${outputDir}/${folderName}`,
        icon: <CheckCircle2 className="h-4 w-4" />
      });
      setIsCreateFolderDialogOpen(false);
      setOutputDir(`${outputDir}/${folderName}`);
      setFolderName("");
    }, 1000);
  };

  const handleUpdateProfile = () => {
    if (!password) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter your current password to make changes",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }
    
    toast({
      title: "Updating profile",
      description: "Processing your changes..."
    });
    
    // Simulate profile update
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        icon: <CheckCircle2 className="h-4 w-4" />
      });
      setIsProfileDialogOpen(false);
      // Only update email if it was changed
      if (password === "password123" && newPassword) {
        toast({
          title: "Password changed",
          description: "Your password has been updated successfully"
        });
      }
      setPassword("");
      setNewPassword("");
    }, 1500);
  };

  const handleSetAlbumCover = () => {
    if (!albumCoverUrl) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a URL for the album cover",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }
    
    toast({
      title: "Setting album cover",
      description: "Updating album artwork..."
    });
    
    // Simulate album cover update
    setTimeout(() => {
      toast({
        title: "Album cover updated",
        description: "Album artwork has been updated successfully",
        icon: <CheckCircle2 className="h-4 w-4" />
      });
      setIsAlbumCoverDialogOpen(false);
      setAlbumCoverUrl("");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Audio Downloader</h1>
        <div className="flex gap-2 items-center">
          <div className="flex items-center space-x-2">
            <Switch 
              id="theme-mode" 
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
            <Label htmlFor="theme-mode" className="text-sm">{isDarkMode ? "Dark" : "Light"}</Label>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCreateFolderDialogOpen(true)}
          >
            <Folder className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsProfileDialogOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>

      <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
        <Tabs defaultValue="spotify" className="w-full">
          <TabsList className="w-full justify-start bg-muted border-b px-3">
            <TabsTrigger value="spotify" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Music className="w-4 h-4" />
              Spotify
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Youtube className="w-4 h-4" />
              YouTube
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spotify" className="p-6">
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
                      Auto-embed lyrics after download
                    </Label>
                  </div>
                </div>
                
                {isDownloading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Downloading...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
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
                      {downloadType === "playlist" && (
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setIsCreatePlaylistDialogOpen(true)}
                        >
                          <List className="mr-2 h-4 w-4" />
                          Create Playlist
                        </Button>
                      )}
                      
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
                      
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsAlbumCoverDialogOpen(true)}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Edit Cover
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="youtube" className="p-6">
            <Card className="border-none shadow-none">
              <CardContent className="space-y-4 p-0">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="youtube-url">YouTube URL</Label>
                  <Input
                    id="youtube-url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-background border"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={isDownloading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="output-dir-yt">Output Directory</Label>
                    <Input
                      id="output-dir-yt"
                      placeholder="/audio"
                      className="bg-background border"
                      value={outputDir}
                      onChange={(e) => setOutputDir(e.target.value)}
                      disabled={isDownloading}
                    />
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
                
                <div className="flex items-center mt-2 mb-2">
                  <p className="text-sm font-medium">Automatically write and embed thumbnails</p>
                  <div className="flex-grow border-t border-border ml-2"></div>
                </div>
                
                {isDownloading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Downloading...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/80"
                    onClick={handleYoutubeDownload}
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download with Thumbnails"}
                  </Button>
                  
                  {downloadComplete && (
                    <div className="flex w-full gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsCreatePlaylistDialogOpen(true)}
                      >
                        <List className="mr-2 h-4 w-4" />
                        Create Playlist
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsAlbumCoverDialogOpen(true)}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Edit Cover
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Create Playlist Dialog */}
      <Dialog open={isCreatePlaylistDialogOpen} onOpenChange={setIsCreatePlaylistDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
                className="bg-background border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playlist-dir">Directory</Label>
              <Input
                id="playlist-dir"
                value={outputDir}
                onChange={(e) => setOutputDir(e.target.value)}
                className="bg-background border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePlaylistDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePlaylist}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="New Folder"
                className="bg-background border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folder-path">Parent Directory</Label>
              <Input
                id="folder-path"
                value={outputDir}
                onChange={(e) => setOutputDir(e.target.value)}
                className="bg-background border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                className="bg-background border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password (leave empty to keep current)</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-background border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Album Cover Dialog */}
      <Dialog open={isAlbumCoverDialogOpen} onOpenChange={setIsAlbumCoverDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Album Cover</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="album-cover-url">Album Cover URL</Label>
              <Input
                id="album-cover-url"
                value={albumCoverUrl}
                onChange={(e) => setAlbumCoverUrl(e.target.value)}
                placeholder="https://example.com/album-cover.jpg"
                className="bg-background border"
              />
            </div>
            {albumCoverUrl && (
              <div className="mt-2 rounded-md overflow-hidden border">
                <img 
                  src={albumCoverUrl} 
                  alt="Album cover preview" 
                  className="w-full h-auto max-h-48 object-contain" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/png?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              This will apply to selected or recently downloaded files.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlbumCoverDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSetAlbumCover}>Apply Cover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
