
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Music, Youtube, AlertCircle, Folder, List, CheckCircle2, Image, Settings, Upload, Terminal, PlaySquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

// Status types for tracking different processes
type ProcessStatus = "pending" | "active" | "complete" | "error";

interface ProcessInfo {
  status: ProcessStatus;
  progress: number; // 0-100
  message: string;
}

export default function DownloadsPage() {
  // Form states
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [outputDir, setOutputDir] = useState("/audio");
  const [youtubeOutputDir, setYoutubeOutputDir] = useState("/youtube");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generateLyrics, setGenerateLyrics] = useState(true);
  const [embedLyrics, setEmbedLyrics] = useState(true);
  const [embedThumbnails, setEmbedThumbnails] = useState(true);
  const [writeAllThumbs, setWriteAllThumbs] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadType, setDownloadType] = useState<"single" | "playlist">("single");
  const [youtubeDownloadType, setYoutubeDownloadType] = useState<"single" | "playlist">("single");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then fallback to checking document class
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      return savedMode === "dark";
    }
    return document.documentElement.classList.contains("dark");
  });
  
  // Album cover states
  const [albumCoverUrl, setAlbumCoverUrl] = useState("");
  const [albumCoverFile, setAlbumCoverFile] = useState<File | null>(null);
  const [albumCoverPreview, setAlbumCoverPreview] = useState("");

  // Dialog states
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isAlbumCoverDialogOpen, setIsAlbumCoverDialogOpen] = useState(false);
  const [isCreateYoutubeFolderDialogOpen, setIsCreateYoutubeFolderDialogOpen] = useState(false);
  
  // User profile states
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [youtubeFolderName, setYoutubeFolderName] = useState("");
  
  // Process status tracking
  const [downloadStatus, setDownloadStatus] = useState<ProcessInfo>({
    status: "pending",
    progress: 0,
    message: "Not started"
  });
  
  const [embedStatus, setEmbedStatus] = useState<ProcessInfo>({
    status: "pending",
    progress: 0,
    message: "Not started"
  });
  
  const [playlistStatus, setPlaylistStatus] = useState<ProcessInfo>({
    status: "pending",
    progress: 0,
    message: "Not started"
  });

  // Command preview
  const [currentCommand, setCurrentCommand] = useState("");
  
  const { toast } = useToast();
  
  // Theme switcher effect with localStorage persistence
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Apply theme on page load and when navigating between pages
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDarkMode(false);
    }
  }, []);

  // File input handlers for album cover upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAlbumCoverFile(file);
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setAlbumCoverPreview(fileUrl);
      setAlbumCoverUrl("");  // Clear URL input when file is selected
      
      toast({
        title: "File selected",
        description: `${file.name} (${Math.round(file.size / 1024)} KB)`
      });
    }
  };

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

    // Reset status
    setDownloadStatus({
      status: "active",
      progress: 0,
      message: "Starting download..."
    });
    
    setEmbedStatus({
      status: "pending", 
      progress: 0, 
      message: "Waiting for download to complete"
    });
    
    setPlaylistStatus({
      status: "pending", 
      progress: 0, 
      message: "Waiting for download to complete"
    });
    
    setIsDownloading(true);
    setProgress(0);
    setDownloadComplete(false);
    
    // Generate command preview
    const command = `spotdl ${spotifyUrl} --output "${outputDir}" --format mp3 --bitrate ${audioBitrate}k ${generateLyrics ? '--generate-lrc' : ''} ${embedLyrics ? '--embed-lyrics' : ''}`;
    setCurrentCommand(command);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        
        // Update download status
        setDownloadStatus(status => ({
          ...status,
          progress: newProgress,
          message: newProgress < 100 ? `Downloading... (${newProgress}%)` : "Download complete!"
        }));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadComplete(true);
          setDownloadStatus({
            status: "complete",
            progress: 100,
            message: "Download complete"
          });
          
          // Start lyrics embedding if enabled
          if (generateLyrics && embedLyrics) {
            simulateEmbedLyrics();
          }
          
          // If it's a playlist download, update playlist status
          if (downloadType === "playlist") {
            setPlaylistStatus({
              status: "active",
              progress: 0,
              message: "Ready to create playlist"
            });
            
            // Auto-open playlist dialog
            setTimeout(() => {
              setIsCreatePlaylistDialogOpen(true);
            }, 500);
          }
          
          toast({
            title: "Download complete",
            description: "Your audio files have been downloaded successfully",
            icon: <CheckCircle2 className="h-4 w-4" />
          });
          
          return 100;
        }
        return newProgress;
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

    // Reset status
    setDownloadStatus({
      status: "active",
      progress: 0,
      message: "Starting download..."
    });
    
    setEmbedStatus({
      status: "pending", 
      progress: 0, 
      message: "Waiting for download to complete"
    });
    
    setIsDownloading(true);
    setProgress(0);
    setDownloadComplete(false);
    
    // Generate command preview with thumbnail options
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
    setCurrentCommand(command);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 3;
        
        // Update download status
        setDownloadStatus(status => ({
          ...status,
          progress: newProgress,
          message: newProgress < 100 ? `Downloading... (${newProgress}%)` : "Download complete!"
        }));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadComplete(true);
          setDownloadStatus({
            status: "complete",
            progress: 100,
            message: "Download complete"
          });
          
          // If embedding thumbnails, update status
          if (embedThumbnails || writeAllThumbs) {
            simulateEmbedThumbnails();
          }

          // If it's a playlist download, update playlist status
          if (youtubeDownloadType === "playlist") {
            setPlaylistStatus({
              status: "active",
              progress: 0,
              message: "Ready to create playlist"
            });
            
            // Auto-open playlist dialog
            setTimeout(() => {
              setIsCreatePlaylistDialogOpen(true);
            }, 500);
          }
          
          toast({
            title: "Download complete",
            description: "Your audio with thumbnails has been downloaded successfully",
            icon: <CheckCircle2 className="h-4 w-4" />
          });
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const simulateEmbedLyrics = () => {
    // Start embedding process
    setEmbedStatus({
      status: "active",
      progress: 0,
      message: "Starting lyrics embedding..."
    });
    
    toast({
      title: "Processing",
      description: "Embedding lyrics into downloaded files..."
    });

    // Simulate embedding process
    const interval = setInterval(() => {
      setEmbedStatus(prev => {
        const newProgress = prev.progress + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          toast({
            title: "Complete",
            description: "Lyrics have been embedded into your audio files",
            icon: <CheckCircle2 className="h-4 w-4" />
          });
          
          return {
            status: "complete",
            progress: 100,
            message: "Lyrics embedding complete"
          };
        }
        
        return {
          ...prev,
          progress: newProgress,
          message: `Embedding lyrics (${newProgress}%)...`
        };
      });
    }, 200);
  };
  
  const simulateEmbedThumbnails = () => {
    // Start embedding thumbnails process
    setEmbedStatus({
      status: "active",
      progress: 0,
      message: "Processing thumbnails..."
    });

    // Simulate embedding process
    const interval = setInterval(() => {
      setEmbedStatus(prev => {
        const newProgress = prev.progress + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          return {
            status: "complete",
            progress: 100,
            message: "Thumbnails embedded successfully"
          };
        }
        
        return {
          ...prev,
          progress: newProgress,
          message: `Embedding thumbnails (${newProgress}%)...`
        };
      });
    }, 150);
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
    
    // Update playlist status
    setPlaylistStatus({
      status: "active",
      progress: 0,
      message: "Creating playlist..."
    });
    
    toast({
      title: "Creating playlist",
      description: `Creating ${playlistName}.m3u from downloaded files`
    });
    
    // Generate command for the playlist creation
    const currentDir = Tabs.value === "youtube" ? youtubeOutputDir : outputDir;
    const playlistCommand = `find "${currentDir}" -name "*.mp3" > "${currentDir}/${playlistName}.m3u"`;
    setCurrentCommand(playlistCommand);
    
    // Simulate playlist creation with progress
    const interval = setInterval(() => {
      setPlaylistStatus(prev => {
        const newProgress = prev.progress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          toast({
            title: "Playlist created",
            description: `${playlistName}.m3u has been created in ${currentDir}`,
            icon: <CheckCircle2 className="h-4 w-4" />
          });
          
          setIsCreatePlaylistDialogOpen(false);
          setPlaylistName("");
          
          return {
            status: "complete",
            progress: 100,
            message: "Playlist created successfully"
          };
        }
        
        return {
          ...prev,
          progress: newProgress,
          message: `Creating playlist (${newProgress}%)...`
        };
      });
    }, 200);
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
    
    // Display the command
    setCurrentCommand(`mkdir -p "${outputDir}/${folderName}"`);
    
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

  const handleCreateYoutubeFolder = () => {
    if (!youtubeFolderName) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a folder name",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }
    
    toast({
      title: "Creating YouTube folder",
      description: `Creating folder: ${youtubeFolderName}`
    });
    
    // Display the command
    setCurrentCommand(`mkdir -p "${youtubeOutputDir}/${youtubeFolderName}"`);
    
    // Simulate folder creation
    setTimeout(() => {
      toast({
        title: "YouTube folder created",
        description: `${youtubeFolderName} has been created at ${youtubeOutputDir}/${youtubeFolderName}`,
        icon: <CheckCircle2 className="h-4 w-4" />
      });
      setIsCreateYoutubeFolderDialogOpen(false);
      setYoutubeOutputDir(`${youtubeOutputDir}/${youtubeFolderName}`);
      setYoutubeFolderName("");
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
    if (!albumCoverUrl && !albumCoverFile) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please provide an image URL or upload a file for the album cover",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }
    
    toast({
      title: "Setting album cover",
      description: "Updating album artwork..."
    });
    
    let command = "";
    if (albumCoverFile) {
      command = `eyeD3 --add-image="${albumCoverFile.name}":FRONT_COVER "${outputDir}/*.mp3"`;
    } else if (albumCoverUrl) {
      command = `eyeD3 --add-image="${albumCoverUrl}":FRONT_COVER "${outputDir}/*.mp3"`;
    }
    
    setCurrentCommand(command);
    
    // Simulate album cover update with progress
    const interval = setInterval(() => {
      setEmbedStatus(prev => {
        const newProgress = prev.progress + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          toast({
            title: "Album cover updated",
            description: "Album artwork has been updated successfully",
            icon: <CheckCircle2 className="h-4 w-4" />
          });
          
          setIsAlbumCoverDialogOpen(false);
          setAlbumCoverUrl("");
          setAlbumCoverFile(null);
          setAlbumCoverPreview("");
          
          return {
            status: "complete",
            progress: 100,
            message: "Album covers updated successfully"
          };
        }
        
        return {
          ...prev,
          progress: newProgress,
          message: `Updating album covers (${newProgress}%)...`
        };
      });
    }, 100);
  };

  const renderStatusItem = (info: ProcessInfo, label: string) => (
    <div className={`status-item status-${info.status}`}>
      <span className="status-indicator"></span>
      <span>{label}: {info.message}</span>
      {info.status === "active" && info.progress > 0 && info.progress < 100 && (
        <Progress value={info.progress} className="h-1 flex-1" />
      )}
    </div>
  );

  // Audio bitrate variable
  const [audioBitrate, setAudioBitrate] = useState("320");

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
                
                {/* Command display */}
                {currentCommand && !isDownloading && downloadComplete && (
                  <div>
                    <Label className="text-xs flex items-center gap-1 mb-1">
                      <Terminal className="h-3 w-3" />
                      Last Command
                    </Label>
                    <div className="command-display">
                      $ {currentCommand}
                    </div>
                  </div>
                )}
                
                {/* Combined process status display */}
                {(isDownloading || downloadComplete) && (
                  <div className="progress-status">
                    {renderStatusItem(downloadStatus, "Download")}
                    {(generateLyrics && embedLyrics) && renderStatusItem(embedStatus, "Lyrics")}
                    {downloadType === "playlist" && downloadComplete && renderStatusItem(playlistStatus, "Playlist")}
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
                          onClick={simulateEmbedLyrics}
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
                      onClick={() => setIsCreateYoutubeFolderDialogOpen(true)}
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
                      Write all thumbnails (--write-all-thumbnails)
                    </Label>
                  </div>
                </div>
                
                {/* Command display */}
                {currentCommand && !isDownloading && downloadComplete && (
                  <div>
                    <Label className="text-xs flex items-center gap-1 mb-1">
                      <Terminal className="h-3 w-3" />
                      Last Command
                    </Label>
                    <div className="command-display">
                      $ {currentCommand}
                    </div>
                  </div>
                )}
                
                {/* Process status display */}
                {(isDownloading || downloadComplete) && (
                  <div className="progress-status">
                    {renderStatusItem(downloadStatus, "Download")}
                    {(embedThumbnails || writeAllThumbs) && downloadComplete && renderStatusItem(embedStatus, "Thumbnails")}
                    {youtubeDownloadType === "playlist" && downloadComplete && renderStatusItem(playlistStatus, "Playlist")}
                  </div>
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
                          onClick={() => setIsCreatePlaylistDialogOpen(true)}
                        >
                          <List className="mr-2 h-4 w-4" />
                          Create Playlist
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
                      
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsCreateYoutubeFolderDialogOpen(true)}
                      >
                        <Folder className="mr-2 h-4 w-4" />
                        New Folder
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
                value={Tabs.value === "youtube" ? youtubeOutputDir : outputDir}
                onChange={(e) => {
                  if (Tabs.value === "youtube") {
                    setYoutubeOutputDir(e.target.value);
                  } else {
                    setOutputDir(e.target.value);
                  }
                }}
                className="bg-background border"
              />
            </div>
            {playlistStatus.status === "active" && (
              <Progress value={playlistStatus.progress} className="h-1" />
            )}
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
      
      {/* Create YouTube Folder Dialog */}
      <Dialog open={isCreateYoutubeFolderDialogOpen} onOpenChange={setIsCreateYoutubeFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create YouTube Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-folder-name">Folder Name</Label>
              <Input
                id="youtube-folder-name"
                value={youtubeFolderName}
                onChange={(e) => setYoutubeFolderName(e.target.value)}
                placeholder="New YouTube Folder"
                className="bg-background border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube-folder-path">Parent Directory</Label>
              <Input
                id="youtube-folder-path"
                value={youtubeOutputDir}
                onChange={(e) => setYoutubeOutputDir(e.target.value)}
                className="bg-background border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateYoutubeFolderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateYoutubeFolder}>Create</Button>
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
                onChange={(e) => {
                  setAlbumCoverUrl(e.target.value);
                  if (e.target.value) {
                    setAlbumCoverPreview(e.target.value);
                    setAlbumCoverFile(null);
                  }
                }}
                placeholder="https://example.com/album-cover.jpg"
                className="bg-background border"
                disabled={!!albumCoverFile}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="album-cover-file">Or Upload Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="album-cover-file"
                  type="file"
                  accept="image/*"
                  className="bg-background border hidden"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={() => document.getElementById("album-cover-file")?.click()}
                  disabled={isDownloading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {albumCoverFile ? "Change File" : "Upload Image"}
                </Button>
                {albumCoverFile && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      setAlbumCoverFile(null);
                      setAlbumCoverPreview("");
                    }}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {albumCoverFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  {albumCoverFile.name} ({Math.round(albumCoverFile.size / 1024)} KB)
                </p>
              )}
            </div>
            
            {(albumCoverUrl || albumCoverPreview) && (
              <div className="mt-2 rounded-md overflow-hidden border">
                <img 
                  src={albumCoverPreview || albumCoverUrl} 
                  alt="Album cover preview" 
                  className="w-full h-auto max-h-48 object-contain" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/png?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
            
            {embedStatus.status === "active" && (
              <div className="space-y-1">
                <div className="text-xs flex justify-between">
                  <span>{embedStatus.message}</span>
                  <span>{embedStatus.progress}%</span>
                </div>
                <Progress value={embedStatus.progress} className="h-1" />
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
