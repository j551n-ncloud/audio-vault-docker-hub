
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ProcessInfo } from "./StatusDisplay";

interface PlaylistDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePlaylist: (name: string, dir: string) => boolean;
  playlistStatus: ProcessInfo;
  outputDir: string;
  isYoutube?: boolean;
}

export default function PlaylistDialog({ 
  isOpen, 
  onOpenChange,
  onCreatePlaylist,
  playlistStatus,
  outputDir,
  isYoutube = false
}: PlaylistDialogProps) {
  const [playlistName, setPlaylistName] = useState("");
  const [currentDir, setCurrentDir] = useState(outputDir);
  
  const { toast } = useToast();
  
  const handleCreatePlaylist = () => {
    if (!playlistName) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a playlist name"
      });
      return;
    }
    
    const success = onCreatePlaylist(playlistName, currentDir);
    
    if (success) {
      // This will be closed by the parent component once the playlist creation is complete
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              value={currentDir}
              onChange={(e) => setCurrentDir(e.target.value)}
              className="bg-background border"
            />
          </div>
          {playlistStatus.status === "active" && (
            <Progress value={playlistStatus.progress} className="h-1" />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreatePlaylist}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
