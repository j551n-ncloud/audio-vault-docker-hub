
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProcessInfo } from "@/components/downloads/StatusDisplay";

interface DownloadOptions {
  command: string;
  type: "single" | "playlist";
  onComplete?: () => void;
}

export function useDownloadStatus() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [currentCommand, setCurrentCommand] = useState("");
  
  const { toast } = useToast();
  
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
  
  const startDownload = ({ command, type, onComplete }: DownloadOptions) => {
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
          
          // If it's a playlist download, update playlist status
          if (type === "playlist") {
            setPlaylistStatus({
              status: "active",
              progress: 0,
              message: "Ready to create playlist"
            });
          }
          
          toast({
            title: "Download complete",
            description: "Your files have been downloaded successfully"
          });
          
          if (onComplete) {
            onComplete();
          }
          
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
            description: "Lyrics have been embedded into your audio files"
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
  
  const createPlaylist = (playlistName: string, outputDir: string) => {
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
    const playlistCommand = `find "${outputDir}" -name "*.mp3" > "${outputDir}/${playlistName}.m3u"`;
    setCurrentCommand(playlistCommand);
    
    // Simulate playlist creation with progress
    const interval = setInterval(() => {
      setPlaylistStatus(prev => {
        const newProgress = prev.progress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          toast({
            title: "Playlist created",
            description: `${playlistName}.m3u has been created in ${outputDir}`
          });
          
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
    
    return true;
  };
  
  return {
    isDownloading,
    progress,
    downloadComplete,
    downloadStatus,
    embedStatus,
    playlistStatus,
    currentCommand,
    startDownload,
    simulateEmbedLyrics,
    simulateEmbedThumbnails,
    createPlaylist
  };
}
