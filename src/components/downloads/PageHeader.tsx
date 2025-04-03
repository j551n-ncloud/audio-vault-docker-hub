
import { Button } from "@/components/ui/button";
import { Folder, Settings } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onCreateFolder: () => void;
  onOpenSettings: () => void;
}

export default function PageHeader({
  title,
  onCreateFolder,
  onOpenSettings
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-medium">{title}</h1>
      <div className="flex gap-2 items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCreateFolder}
        >
          <Folder className="mr-2 h-4 w-4" />
          New Folder
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
