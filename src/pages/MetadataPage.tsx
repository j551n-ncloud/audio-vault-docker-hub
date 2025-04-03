
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileAudio, Save, Upload, Trash } from "lucide-react";

export default function MetadataPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const [metadata, setMetadata] = useState({
    title: "",
    artist: "",
    album: "",
    year: "",
    genre: "",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      
      // Simulate reading metadata from file
      const filename = files[0].name;
      
      // Attempt to extract artist - title from filename (common format)
      let title = filename;
      let artist = "";
      
      if (filename.includes(" - ")) {
        const parts = filename.split(" - ");
        if (parts.length >= 2) {
          artist = parts[0];
          // Remove file extension for title
          title = parts[1].replace(/\.[^/.]+$/, "");
        }
      } else {
        // Just remove the extension for the title
        title = filename.replace(/\.[^/.]+$/, "");
      }
      
      setMetadata({
        title,
        artist,
        album: "",
        year: new Date().getFullYear().toString(),
        genre: "",
      });
      
      toast({
        title: "File loaded",
        description: `${files[0].name} loaded for editing`,
      });
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveMetadata = () => {
    // In a real app, this would use EyeD3 through an API
    toast({
      title: "Metadata saved",
      description: "Audio file metadata has been updated successfully",
    });
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setMetadata({
      title: "",
      artist: "",
      album: "",
      year: "",
      genre: "",
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Metadata Editor</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-card/60 backdrop-blur-sm md:col-span-1">
          <CardHeader>
            <CardTitle>Audio File</CardTitle>
            <CardDescription>Select an audio file to edit metadata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 bg-black/30">
                {selectedFile ? (
                  <div className="text-center space-y-2">
                    <FileAudio className="h-12 w-12 mx-auto text-audio-purple" />
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handleClearFile}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                    <Button 
                      variant="outline" 
                      asChild 
                      className="bg-audio-purple/10 hover:bg-audio-purple/20 text-audio-purple border-audio-purple/20"
                    >
                      <label>
                        <input
                          type="file"
                          className="sr-only"
                          accept="audio/*"
                          onChange={handleFileChange}
                        />
                        Browse Files
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Metadata</CardTitle>
            <CardDescription>Using EyeD3 to modify audio tag information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={metadata.title}
                    onChange={handleMetadataChange}
                    placeholder="Song title"
                    disabled={!selectedFile}
                    className="bg-black/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    name="artist"
                    value={metadata.artist}
                    onChange={handleMetadataChange}
                    placeholder="Song artist"
                    disabled={!selectedFile}
                    className="bg-black/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="album">Album</Label>
                  <Input
                    id="album"
                    name="album"
                    value={metadata.album}
                    onChange={handleMetadataChange}
                    placeholder="Album name"
                    disabled={!selectedFile}
                    className="bg-black/30"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      value={metadata.year}
                      onChange={handleMetadataChange}
                      placeholder="Release year"
                      disabled={!selectedFile}
                      className="bg-black/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      name="genre"
                      value={metadata.genre}
                      onChange={handleMetadataChange}
                      placeholder="Music genre"
                      disabled={!selectedFile}
                      className="bg-black/30"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-audio-purple hover:bg-audio-purple/80"
                onClick={handleSaveMetadata}
                disabled={!selectedFile}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Metadata
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
