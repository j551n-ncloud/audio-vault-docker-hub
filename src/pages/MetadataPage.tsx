
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Edit, Trash2, Save, File, FileAudio, 
  Folder, RefreshCw, Music, List 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FileItem = {
  name: string;
  type: "file" | "folder";
  size?: string;
  lastModified?: string;
  path?: string;
};

type MetadataField = {
  key: string;
  value: string;
  editable?: boolean;
};

export default function MetadataPage() {
  const [currentPath, setCurrentPath] = useState("/audio");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [metadata, setMetadata] = useState<MetadataField[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const { toast } = useToast();

  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  // Simulate fetching files - this would be replaced with actual API calls
  useEffect(() => {
    // In a real application, this would be an API call to your backend
    // For this demo, we're mocking the data
    setIsLoading(true);
    
    setTimeout(() => {
      const mockFiles: FileItem[] = [
        { name: "Song 1.mp3", type: "file", size: "8.2 MB", lastModified: "2023-04-12", path: "/audio/Song 1.mp3" },
        { name: "Song 2.mp3", type: "file", size: "7.5 MB", lastModified: "2023-04-12", path: "/audio/Song 2.mp3" },
        { name: "Playlist", type: "folder", path: "/audio/Playlist" },
        { name: "Song 3.mp3", type: "file", size: "9.1 MB", lastModified: "2023-04-11", path: "/audio/Song 3.mp3" },
        { name: "Song 3.lrc", type: "file", size: "2.1 KB", lastModified: "2023-04-11", path: "/audio/Song 3.lrc" },
        { name: "My Playlist.m3u", type: "file", size: "0.5 KB", lastModified: "2023-04-13", path: "/audio/My Playlist.m3u" },
      ];
      
      setFiles(mockFiles);
      setIsLoading(false);
    }, 800);
  }, [currentPath]);

  const handleFileSelect = (file: FileItem) => {
    if (file.type === "folder") {
      // Navigate into folder
      setCurrentPath(`${currentPath}/${file.name}`);
      return;
    }
    
    setSelectedFile(file);
    
    // Simulate fetching metadata - in a real app, this would call your backend
    const mockMetadata: MetadataField[] = [
      { key: "Title", value: file.name.replace(".mp3", ""), editable: true },
      { key: "Artist", value: "Unknown Artist", editable: true },
      { key: "Album", value: "Unknown Album", editable: true },
      { key: "Year", value: "2023", editable: true },
      { key: "Genre", value: "Pop", editable: true },
      { key: "Duration", value: "3:45", editable: false },
      { key: "Bitrate", value: "320kbps", editable: false },
      { key: "Format", value: "MP3", editable: false },
    ];
    
    setMetadata(mockMetadata);
    
    // If it's an MP3 file, simulate checking for lyrics
    if (file.name.endsWith(".mp3")) {
      const hasLyrics = file.name === "Song 3.mp3"; // Simulate that Song 3 has lyrics
      if (hasLyrics) {
        setLyrics("[00:00.00]Sample lyrics for demonstration\n[00:03.50]This would be actual synchronized lyrics\n[00:07.20]From the .lrc file");
      } else {
        setLyrics("");
      }
    } else if (file.name.endsWith(".lrc")) {
      // If it's a lyrics file, show its content
      setLyrics("[00:00.00]Sample lyrics for demonstration\n[00:03.50]This would be actual synchronized lyrics\n[00:07.20]From the .lrc file");
    } else {
      setLyrics("");
    }
  };

  const handleDeleteFile = (file: FileItem) => {
    // In a real app, this would call your backend API
    toast({
      title: "File deleted",
      description: `${file.name} would be deleted in a real application`,
    });
    
    // Update UI
    setFiles(files.filter(f => f.name !== file.name));
    if (selectedFile && selectedFile.name === file.name) {
      setSelectedFile(null);
      setMetadata([]);
      setLyrics("");
    }
  };

  const handleRenameFile = () => {
    if (!selectedFile || !newFileName) return;
    
    // In a real app, this would call your backend API
    toast({
      title: "File renamed",
      description: `Renamed ${selectedFile.name} to ${newFileName}`,
    });
    
    // Update UI
    const updatedFiles = files.map(f => {
      if (f.name === selectedFile.name) {
        return { ...f, name: newFileName };
      }
      return f;
    });
    
    setFiles(updatedFiles);
    setSelectedFile({ ...selectedFile, name: newFileName });
    setIsEditDialogOpen(false);
  };

  const handleSaveMetadata = () => {
    // In a real app, this would call your backend API
    toast({
      title: "Metadata saved",
      description: "File metadata has been updated",
    });
  };

  const handleNavigateUp = () => {
    if (currentPath === "/audio") return;
    
    const pathParts = currentPath.split("/");
    pathParts.pop();
    setCurrentPath(pathParts.join("/") || "/audio");
  };

  const handleRefresh = () => {
    // Refresh the current directory
    setIsLoading(true);
    
    // In a real app, this would refresh data from the backend
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Refreshed",
        description: "File list has been refreshed",
      });
    }, 500);
  };

  const handleCreatePlaylist = () => {
    if (!playlistName) return;
    
    // In a real app, this would call your backend API
    toast({
      title: "Playlist created",
      description: `Created playlist: ${playlistName}.m3u`,
    });
    
    // Add the new playlist to the file list
    setFiles([
      ...files, 
      { 
        name: `${playlistName}.m3u`, 
        type: "file",
        size: "0.1 KB",
        lastModified: new Date().toISOString().split("T")[0],
        path: `${currentPath}/${playlistName}.m3u`
      }
    ]);
    
    setIsCreatePlaylistDialogOpen(false);
    setPlaylistName("");
  };

  const handleUpdateMetadata = (index: number, value: string) => {
    const updatedMetadata = [...metadata];
    updatedMetadata[index] = { ...updatedMetadata[index], value };
    setMetadata(updatedMetadata);
  };

  const handleEmbedLyrics = () => {
    if (!selectedFile || !selectedFile.name.endsWith(".mp3")) return;
    
    // Check if we have a matching .lrc file
    const baseName = selectedFile.name.replace(".mp3", "");
    const hasLyricsFile = files.some(file => file.name === `${baseName}.lrc`);
    
    if (hasLyricsFile) {
      toast({
        title: "Lyrics embedded",
        description: `Embedded lyrics into ${selectedFile.name}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No matching .lrc file found for ${selectedFile.name}`,
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Audio Metadata Manager</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* File browser section */}
        <Card className="md:col-span-2 bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">File Browser</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNavigateUp}
                disabled={currentPath === "/audio"}
              >
                <Folder className="w-4 h-4 mr-1" />
                Up
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setIsCreatePlaylistDialogOpen(true)}
              >
                <List className="w-4 h-4 mr-1" />
                Create Playlist
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Current path: {currentPath}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <RefreshCw className="h-6 w-6 animate-spin text-audio-purple" />
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.length > 0 ? (
                      files.map((file) => (
                        <TableRow 
                          key={file.name}
                          className={selectedFile?.name === file.name ? "bg-muted/50" : ""}
                          onClick={() => handleFileSelect(file)}
                        >
                          <TableCell>
                            <div className="flex items-center">
                              {file.type === "folder" ? (
                                <Folder className="h-4 w-4 mr-2 text-audio-purple" />
                              ) : file.name.endsWith(".mp3") ? (
                                <FileAudio className="h-4 w-4 mr-2 text-audio-purple" />
                              ) : (
                                <File className="h-4 w-4 mr-2 text-muted-foreground" />
                              )}
                              {file.name}
                            </div>
                          </TableCell>
                          <TableCell>{file.size || "-"}</TableCell>
                          <TableCell>{file.lastModified || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFile(file);
                                  setNewFileName(file.name);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(file);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          No files found in this directory
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metadata section */}
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">File Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <Tabs defaultValue="metadata">
                <TabsList className="mb-4">
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  {(selectedFile.name.endsWith(".mp3") || selectedFile.name.endsWith(".lrc")) && (
                    <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="metadata" className="space-y-4">
                  <h3 className="text-lg font-medium">{selectedFile.name}</h3>
                  
                  {metadata.map((field, index) => (
                    <div key={field.key} className="space-y-1">
                      <Label htmlFor={`meta-${field.key}`}>{field.key}</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`meta-${field.key}`}
                          value={field.value}
                          onChange={(e) => handleUpdateMetadata(index, e.target.value)}
                          disabled={!field.editable}
                          className="bg-black/20"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 bg-audio-purple hover:bg-audio-purple/80"
                    onClick={handleSaveMetadata}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Metadata
                  </Button>
                  
                  {selectedFile.name.endsWith(".mp3") && (
                    <Button 
                      className="w-full mt-2"
                      variant="secondary"
                      onClick={handleEmbedLyrics}
                    >
                      <Music className="mr-2 h-4 w-4" />
                      Embed Lyrics
                    </Button>
                  )}
                </TabsContent>
                
                <TabsContent value="lyrics">
                  <div className="space-y-2">
                    <Label htmlFor="lyrics">Synchronized Lyrics</Label>
                    <Textarea
                      id="lyrics"
                      value={lyrics}
                      onChange={(e) => setLyrics(e.target.value)}
                      className="min-h-[300px] font-mono text-sm bg-black/20"
                    />
                    
                    <Button 
                      className="w-full mt-2 bg-audio-purple hover:bg-audio-purple/80"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Lyrics
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileAudio className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to view and edit metadata</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filename">New filename</Label>
              <Input
                id="filename"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="bg-black/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameFile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
