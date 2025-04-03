
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useDownloadStatus } from "@/hooks/useDownloadStatus";

// Import the refactored components
import PageHeader from "@/components/downloads/PageHeader";
import SpotifyDownloadTab from "@/components/downloads/SpotifyDownloadTab";
import YoutubeDownloadTab from "@/components/downloads/YoutubeDownloadTab";
import PlaylistDialog from "@/components/downloads/PlaylistDialog";
import FolderDialog from "@/components/downloads/FolderDialog";
import AlbumCoverDialog from "@/components/downloads/AlbumCoverDialog";
import ProfileSettingsDialog from "@/components/settings/ProfileSettingsDialog";

export default function DownloadsPage() {
  // Directory states
  const [outputDir, setOutputDir] = useState("/audio");
  const [youtubeOutputDir, setYoutubeOutputDir] = useState("/youtube");
  
  // Dialog states
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isAlbumCoverDialogOpen, setIsAlbumCoverDialogOpen] = useState(false);
  const [isCreateYoutubeFolderDialogOpen, setIsCreateYoutubeFolderDialogOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState("spotify");
  
  const { toast } = useToast();
  const { embedStatus, playlistStatus, createPlaylist } = useDownloadStatus();

  // Handlers
  const handleCreatePlaylist = (playlistName: string, dir: string) => {
    const success = createPlaylist(playlistName, dir);
    if (success) {
      setTimeout(() => setIsCreatePlaylistDialogOpen(false), 2000);
    }
    return success;
  };

  const handleCreateFolder = (folderName: string, dir: string) => {
    toast({
      title: "Creating folder",
      description: `Creating folder: ${folderName}`
    });
    
    setTimeout(() => {
      toast({
        title: "Folder created",
        description: `${folderName} has been created at ${dir}/${folderName}`
      });
      setIsCreateFolderDialogOpen(false);
      setOutputDir(`${dir}/${folderName}`);
    }, 1000);
  };

  const handleCreateYoutubeFolder = (folderName: string, dir: string) => {
    toast({
      title: "Creating YouTube folder",
      description: `Creating folder: ${folderName}`
    });
    
    setTimeout(() => {
      toast({
        title: "YouTube folder created",
        description: `${folderName} has been created at ${dir}/${folderName}`
      });
      setIsCreateYoutubeFolderDialogOpen(false);
      setYoutubeOutputDir(`${dir}/${folderName}`);
    }, 1000);
  };

  const handleSetAlbumCover = () => {
    toast({
      title: "Setting album cover",
      description: "Updating album artwork..."
    });
    
    const interval = setInterval(() => {
      embedStatus.progress += 5;
      if (embedStatus.progress >= 100) {
        clearInterval(interval);
        toast({
          title: "Album cover updated",
          description: "Album artwork has been updated successfully"
        });
        setIsAlbumCoverDialogOpen(false);
      }
    }, 100);
  };

  const handleUpdateProfile = () => {
    toast({
      title: "Updating profile",
      description: "Processing your changes..."
    });
    
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      setIsProfileDialogOpen(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Audio Downloader"
        onCreateFolder={() => setIsCreateFolderDialogOpen(true)}
        onOpenSettings={() => setIsProfileDialogOpen(true)}
      />

      <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
        <Tabs 
          defaultValue="spotify" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full justify-start bg-muted border-b px-3">
            <TabsTrigger value="spotify" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Spotify
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              YouTube
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spotify" className="p-6">
            <SpotifyDownloadTab 
              onCreatePlaylist={() => setIsCreatePlaylistDialogOpen(true)} 
              onEditCover={() => setIsAlbumCoverDialogOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="youtube" className="p-6">
            <YoutubeDownloadTab 
              onCreatePlaylist={() => setIsCreatePlaylistDialogOpen(true)}
              onEditCover={() => setIsAlbumCoverDialogOpen(true)}
              onCreateFolder={() => setIsCreateYoutubeFolderDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs */}
      <PlaylistDialog 
        isOpen={isCreatePlaylistDialogOpen}
        onOpenChange={setIsCreatePlaylistDialogOpen}
        onCreatePlaylist={handleCreatePlaylist}
        playlistStatus={playlistStatus}
        outputDir={activeTab === "youtube" ? youtubeOutputDir : outputDir}
        isYoutube={activeTab === "youtube"}
      />

      <FolderDialog 
        isOpen={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
        initialDir={outputDir}
        title="Create New Folder"
      />
      
      <FolderDialog
        isOpen={isCreateYoutubeFolderDialogOpen}
        onOpenChange={setIsCreateYoutubeFolderDialogOpen}
        onCreateFolder={handleCreateYoutubeFolder}
        initialDir={youtubeOutputDir}
        title="Create YouTube Folder"
      />
      
      <AlbumCoverDialog
        isOpen={isAlbumCoverDialogOpen}
        onOpenChange={setIsAlbumCoverDialogOpen}
        onSetAlbumCover={handleSetAlbumCover}
        embedStatus={embedStatus}
        outputDir={activeTab === "youtube" ? youtubeOutputDir : outputDir}
      />
      
      <ProfileSettingsDialog
        isOpen={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
}
