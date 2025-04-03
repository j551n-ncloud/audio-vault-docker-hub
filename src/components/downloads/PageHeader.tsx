
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Folder, Settings } from "lucide-react";

interface PageHeaderProps {
  title: string;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
  onCreateFolder: () => void;
  onOpenSettings: () => void;
}

export default function PageHeader({
  title,
  isDarkMode,
  setIsDarkMode,
  onCreateFolder,
  onOpenSettings
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-medium">{title}</h1>
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
