
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface FolderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFolder: (name: string, dir: string) => void;
  initialDir: string;
  title?: string;
}

export default function FolderDialog({ 
  isOpen, 
  onOpenChange,
  onCreateFolder,
  initialDir,
  title = "Create New Folder"
}: FolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [parentDir, setParentDir] = useState(initialDir);
  
  const { toast } = useToast();
  
  const handleCreateFolder = () => {
    if (!folderName) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a folder name"
      });
      return;
    }
    
    onCreateFolder(folderName, parentDir);
    setFolderName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
              value={parentDir}
              onChange={(e) => setParentDir(e.target.value)}
              className="bg-background border"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreateFolder}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
