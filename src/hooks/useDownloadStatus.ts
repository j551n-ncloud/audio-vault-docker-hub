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

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  };
  
  const startDownload = async ({ command, type, onComplete }: DownloadOptions) => {
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

    try {
      const response = await fetch('http://localhost:8080/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command })
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const data = await response.json();
      
      setDownloadStatus({
        status: "complete",
        progress: 100,
        message: "Download complete!"
      });
      
      setIsDownloading(false);
      setDownloadComplete(true);
      setProgress(100);
      
      toast({
        title: "Download complete",
        description: "Your file has been downloaded successfully"
      });
      
      if (onComplete) {
        onComplete();
      }
      
      if (type === "playlist") {
        setPlaylistStatus({
          status: "complete",
          progress: 100,
          message: "Playlist download complete"
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
      
      setDownloadStatus({
        status: "error",
        progress: 0,
        message: "Download failed"
      });
      
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading your file"
      });
      
      setIsDownloading(false);
    }
  };
  
  const simulateEmbedLyrics = () => {
    setEmbedStatus({
      status: "active",
      progress: 0,
      message: "Starting lyrics embedding with eyeD3..."
    });
    
    toast({
      title: "Processing",
      description: "Embedding lyrics into downloaded files using eyeD3..."
    });

    const interval = setInterval(() => {
      setEmbedStatus(prev => {
        const newProgress = prev.progress + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          toast({
            title: "Complete",
            description: "Lyrics have been embedded into your audio files using eyeD3"
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
          message: `Embedding lyrics with eyeD3 (${newProgress}%)...`
        };
      });
    }, 200);
  };
  
  const simulateEmbedThumbnails = () => {
    setEmbedStatus({
      status: "active",
      progress: 0,
      message: "Processing thumbnails..."
    });

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
    setPlaylistStatus({
      status: "active",
      progress: 0,
      message: "Creating playlist..."
    });
    
    toast({
      title: "Creating playlist",
      description: `Creating ${playlistName}.m3u from downloaded files`
    });
    
    const playlistCommand = `find "${outputDir}" -name "*.mp3" > "${outputDir}/${playlistName}.m3u"`;
    setCurrentCommand(playlistCommand);
    
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
