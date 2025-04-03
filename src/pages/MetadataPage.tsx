
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
  Folder, RefreshCw, Music, List, Check,
  Image, Download, AlertCircle, Search,
  ChevronUp, FileImage
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

type FileItem = {
  name: string;
  type: "file" | "folder";
  size?: string;
  lastModified?: string;
  path?: string;
  selected?: boolean;
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isProcessingDialogOpen, setIsProcessingDialogOpen] = useState(false);
  const [processType, setProcessType] = useState("");
  const [processPath, setProcessPath] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [isAlbumCoverDialogOpen, setIsAlbumCoverDialogOpen] = useState(false);
  const [albumCoverUrl, setAlbumCoverUrl] = useState("");

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

  // Filter and sort files
  const filteredFiles = files.filter(file => 
    searchQuery ? file.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  ).sort((a, b) => {
    if (sortBy === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === "date" && a.lastModified && b.lastModified) {
      return sortDirection === "asc" 
        ? a.lastModified.localeCompare(b.lastModified) 
        : b.lastModified.localeCompare(a.lastModified);
    } else if (sortBy === "size" && a.size && b.size) {
      const getSize = (size: string) => parseFloat(size.split(' ')[0]);
      return sortDirection === "asc" 
        ? getSize(a.size) - getSize(b.size) 
        : getSize(b.size) - getSize(a.size);
    }
    return 0;
  });

  const handleFileSelect = (file: FileItem) => {
    if (selectMode) {
      // Toggle selection in multi-select mode
      const updatedFiles = files.map(f => {
        if (f.name === file.name) {
          return { ...f, selected: !f.selected };
        }
        return f;
      });
      setFiles(updatedFiles);
      return;
    }
    
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
      description: `${file.name} has been deleted`,
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
    if (!selectedFile) return;
    
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
    
    // Get selected files or use all MP3 files in current directory
    const selectedMp3Files = selectMode
      ? files.filter(f => f.selected && f.name.endsWith(".mp3"))
      : files.filter(f => f.name.endsWith(".mp3"));
    
    if (selectedMp3Files.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one MP3 file for the playlist",
      });
      return;
    }
    
    // In a real app, this would call your backend API
    toast({
      title: "Playlist created",
      description: `Created playlist: ${playlistName}.m3u with ${selectedMp3Files.length} tracks`,
    });
    
    // Add the new playlist to the file list
    setFiles([
      ...files, 
      { 
        name: `${playlistName}.m3u`, 
        type: "file",
        size: `${(selectedMp3Files.length * 0.1).toFixed(1)} KB`,
        lastModified: new Date().toISOString().split("T")[0],
        path: `${currentPath}/${playlistName}.m3u`
      }
    ]);
    
    // Exit selection mode if active
    if (selectMode) setSelectMode(false);
    
    // Clear selections
    const updatedFiles = files.map(f => ({ ...f, selected: false }));
    setFiles(updatedFiles);
    
    setIsCreatePlaylistDialogOpen(false);
    setPlaylistName("");
  };

  const handleCreateFolder = () => {
    if (!folderName) return;
    
    // In a real app, this would call your backend API
    toast({
      title: "Folder created",
      description: `Created folder: ${folderName}`,
    });
    
    // Add the new folder to the file list
    setFiles([
      ...files,
      {
        name: folderName,
        type: "folder",
        path: `${currentPath}/${folderName}`
      }
    ]);
    
    setIsCreateFolderDialogOpen(false);
    setFolderName("");
  };

  const handleUpdateMetadata = (index: number, value: string) => {
    const updatedMetadata = [...metadata];
    updatedMetadata[index] = { ...updatedMetadata[index], value };
    setMetadata(updatedMetadata);
  };

  const handleEmbedLyrics = () => {
    const selectedMp3Files = selectMode
      ? files.filter(f => f.selected && f.name.endsWith(".mp3"))
      : (selectedFile && selectedFile.name.endsWith(".mp3")) ? [selectedFile] : [];
    
    if (selectedMp3Files.length === 0) {
      toast({
        variant: "destructive",
        title: "No MP3 files selected",
        description: "Please select at least one MP3 file to embed lyrics",
      });
      return;
    }
    
    setProcessType("embed_lyrics");
    setProcessPath(currentPath);
    setIsProcessingDialogOpen(true);
    
    // In a real app, this would call your backend API
    // Simulating API call
    setTimeout(() => {
      setIsProcessingDialogOpen(false);
      toast({
        title: "Lyrics embedded",
        description: `Embedded lyrics into ${selectedMp3Files.length} files`,
      });
      
      // Exit selection mode if active
      if (selectMode) setSelectMode(false);
      
      // Clear selections
      const updatedFiles = files.map(f => ({ ...f, selected: false }));
      setFiles(updatedFiles);
    }, 1500);
  };

  const handleToggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (!selectMode) {
      // Clear any existing selections when entering select mode
      const updatedFiles = files.map(f => ({ ...f, selected: false }));
      setFiles(updatedFiles);
      setSelectedFile(null);
    }
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
    
    const selectedMp3Files = selectMode
      ? files.filter(f => f.selected && f.name.endsWith(".mp3"))
      : (selectedFile && selectedFile.name.endsWith(".mp3")) ? [selectedFile] : [];
    
    if (selectedMp3Files.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one MP3 file to update album art",
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
        description: `Updated album artwork for ${selectedMp3Files.length} file(s)`,
        icon: <CheckCircle2 className="h-4 w-4" />
      });
      setIsAlbumCoverDialogOpen(false);
      setAlbumCoverUrl("");
    }, 1500);
  };

  const handleToggleSort = (field: "name" | "date" | "size") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const selectedCount = files.filter(f => f.selected).length;

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Audio Metadata Manager</h1>
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
            variant={selectMode ? "secondary" : "outline"}
            onClick={handleToggleSelectMode}
            size="sm"
          >
            {selectMode ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {selectedCount} selected
              </>
            ) : (
              "Select mode"
            )}
          </Button>
          
          {selectMode && selectedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreatePlaylistDialogOpen(true)}
            >
              <List className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          )}
          
          {selectMode && selectedCount > 0 && files.some(f => f.selected && f.name.endsWith(".mp3")) && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEmbedLyrics}
              >
                <Music className="w-4 h-4 mr-2" />
                Embed Lyrics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAlbumCoverDialogOpen(true)}
              >
                <Image className="w-4 h-4 mr-2" />
                Set Cover
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* File browser section */}
        <Card className="md:col-span-2 border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">File Browser</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNavigateUp}
                disabled={currentPath === "/audio"}
              >
                <ChevronUp className="w-4 h-4 mr-1" />
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
                variant="outline" 
                size="sm"
                onClick={() => setIsCreateFolderDialogOpen(true)}
              >
                <Folder className="w-4 h-4 mr-1" />
                New Folder
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsCreatePlaylistDialogOpen(true)}
              >
                <List className="w-4 h-4 mr-1" />
                Create Playlist
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search files..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentPath}
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {selectMode && <TableHead className="w-[50px]"></TableHead>}
                        <TableHead 
                          className="cursor-pointer hover:text-primary"
                          onClick={() => handleToggleSort("name")}
                        >
                          Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:text-primary"
                          onClick={() => handleToggleSort("size")}
                        >
                          Size {sortBy === "size" && (sortDirection === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:text-primary"
                          onClick={() => handleToggleSort("date")}
                        >
                          Modified {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiles.length > 0 ? (
                        filteredFiles.map((file) => (
                          <TableRow 
                            key={file.name}
                            className={`file-item ${(selectedFile?.name === file.name || file.selected) ? "selected" : ""}`}
                            onClick={() => handleFileSelect(file)}
                          >
                            {selectMode && (
                              <TableCell>
                                <Checkbox 
                                  checked={file.selected} 
                                  onCheckedChange={() => {
                                    const updatedFiles = files.map(f => {
                                      if (f.name === file.name) {
                                        return { ...f, selected: !f.selected };
                                      }
                                      return f;
                                    });
                                    setFiles(updatedFiles);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="flex items-center">
                                {file.type === "folder" ? (
                                  <Folder className="h-4 w-4 mr-2 file-icon" />
                                ) : file.name.endsWith(".mp3") ? (
                                  <FileAudio className="h-4 w-4 mr-2 file-icon" />
                                ) : file.name.endsWith(".jpg") || file.name.endsWith(".png") ? (
                                  <FileImage className="h-4 w-4 mr-2 file-icon" />
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
                          <TableCell colSpan={selectMode ? 5 : 4} className="text-center py-8">
                            {searchQuery ? "No matching files found" : "No files found in this directory"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metadata section */}
        <Card className="border">
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
                          className="bg-background"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 bg-primary hover:bg-primary/80"
                    onClick={handleSaveMetadata}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Metadata
                  </Button>
                  
                  {selectedFile.name.endsWith(".mp3") && (
                    <div className="flex gap-2 w-full">
                      <Button 
                        className="flex-1"
                        variant="outline"
                        onClick={handleEmbedLyrics}
                      >
                        <Music className="mr-2 h-4 w-4" />
                        Embed Lyrics
                      </Button>
                      <Button 
                        className="flex-1"
                        variant="outline"
                        onClick={() => setIsAlbumCoverDialogOpen(true)}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Set Cover
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="lyrics">
                  <div className="space-y-2">
                    <Label htmlFor="lyrics">Synchronized Lyrics</Label>
                    <Textarea
                      id="lyrics"
                      value={lyrics}
                      onChange={(e) => setLyrics(e.target.value)}
                      className="min-h-[300px] font-mono text-sm bg-background"
                    />
                    
                    <Button 
                      className="w-full mt-2 bg-primary hover:bg-primary/80"
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
        <DialogContent className="sm:max-w-md">
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
                className="bg-background"
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
                className="bg-background"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {selectMode && selectedCount > 0 ? 
                `${selectedCount} files will be added to the playlist.` : 
                "All MP3 files in the current folder will be added to the playlist."}
            </p>
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
                className="bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Processing Dialog */}
      <Dialog open={isProcessingDialogOpen} onOpenChange={setIsProcessingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {processType === "embed_lyrics" ? "Embedding Lyrics" : "Processing"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center">
              {processType === "embed_lyrics" 
                ? "Embedding lyrics into selected MP3 files..." 
                : "Processing files..."}
            </p>
          </div>
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
                className="bg-background"
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
              This will update the album artwork for the selected files.
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
