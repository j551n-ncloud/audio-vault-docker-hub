
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, Link, AlertCircle, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AlbumCoverUploadProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (imageData: string | File) => void;
  selectedFiles?: string[];
}

export default function AlbumCoverUpload({ 
  isOpen, 
  onOpenChange, 
  onSave,
  selectedFiles = []
}: AlbumCoverUploadProps) {
  const [albumCoverUrl, setAlbumCoverUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file",
        });
        return;
      }
      
      setUploadedFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUrlPreview = () => {
    if (!albumCoverUrl) {
      toast({
        variant: "destructive",
        title: "URL required",
        description: "Please enter an image URL",
      });
      return;
    }
    
    setPreviewUrl(albumCoverUrl);
  };

  const handleSave = () => {
    if (activeTab === "upload" && uploadedFile) {
      onSave(uploadedFile);
    } else if (activeTab === "url" && albumCoverUrl) {
      onSave(albumCoverUrl);
    } else {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image file or enter a URL",
      });
      return;
    }
    
    // Reset state
    setUploadedFile(null);
    setAlbumCoverUrl("");
    setPreviewUrl("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Set Album Cover
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cover-file">Choose Image File</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  id="cover-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Browse
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cover-url">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="cover-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={albumCoverUrl}
                  onChange={(e) => setAlbumCoverUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleUrlPreview}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {previewUrl && (
          <div className="mt-2 rounded-md overflow-hidden border">
            <img 
              src={previewUrl} 
              alt="Album cover preview" 
              className="w-full h-auto max-h-48 object-contain" 
              onError={(e) => {
                toast({
                  variant: "destructive",
                  title: "Image error",
                  description: "Failed to load image",
                  icon: <AlertCircle className="h-4 w-4" />,
                });
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTI5IDE2NlYyMzRIMTg3VjE2NkgxMjlaIiBmaWxsPSIjOTRBM0IzIi8+PHBhdGggZD0iTTIxMiAxMzJWMjY4SDI3MFYxMzJIMjEyWiIgZmlsbD0iIzk0QTNCMyIvPjxwYXRoIGQ9Ik0xNTQgMTMyQzE1NCAxMTMuMjIyIDE2OS4yMjIgOTggMTg4IDk4QzIwNi43NzggOTggMjIyIDExMy4yMjIgMjIyIDEzMkMyMjIgMTUwLjc3OCAyMDYuNzc4IDE2NiAxODggMTY2QzE2OS4yMjIgMTY2IDE1NCAxNTAuNzc4IDE1NCAxMzJaIiBmaWxsPSIjOTRBM0IzIi8+PC9zdmc+';
              }}
            />
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          {selectedFiles && selectedFiles.length > 0 ? (
            <p>This will update album art for {selectedFiles.length} file(s).</p>
          ) : (
            <p>Select MP3 files in the file browser to apply this album art.</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            // Clean up any created object URLs
            if (previewUrl && uploadedFile) {
              URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl("");
            setUploadedFile(null);
            setAlbumCoverUrl("");
            onOpenChange(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Apply Cover</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { AlbumCoverUploadProps };
