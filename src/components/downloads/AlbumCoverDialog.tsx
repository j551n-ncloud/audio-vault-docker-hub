
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProcessInfo } from "./StatusDisplay";

interface AlbumCoverDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSetAlbumCover: () => void;
  embedStatus: ProcessInfo;
  outputDir: string;
}

export default function AlbumCoverDialog({ 
  isOpen, 
  onOpenChange,
  onSetAlbumCover,
  embedStatus,
  outputDir
}: AlbumCoverDialogProps) {
  const [albumCoverUrl, setAlbumCoverUrl] = useState("");
  const [albumCoverFile, setAlbumCoverFile] = useState<File | null>(null);
  const [albumCoverPreview, setAlbumCoverPreview] = useState("");
  
  const { toast } = useToast();

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
  
  const handleApplyCover = () => {
    if (!albumCoverUrl && !albumCoverFile) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please provide an image URL or upload a file for the album cover"
      });
      return;
    }
    
    onSetAlbumCover();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleApplyCover}>Apply Cover</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
