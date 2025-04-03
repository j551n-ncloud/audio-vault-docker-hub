
import { Button } from "@/components/ui/button";
import { Folder, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  onCreateFolder: () => void;
}

export default function PageHeader({
  title,
  onCreateFolder
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
          asChild
        >
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  );
}
