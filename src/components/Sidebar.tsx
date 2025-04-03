
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Download,
  Music,
  Settings,
  LogOut,
  LayoutDashboard,
  FileSpreadsheet,
  UploadCloud
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/dashboard"
    },
    {
      name: "Downloads",
      icon: <Download className="h-5 w-5" />,
      path: "/downloads"
    },
    {
      name: "Library",
      icon: <Music className="h-5 w-5" />,
      path: "/library"
    },
    {
      name: "Metadata",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      path: "/metadata"
    },
    {
      name: "Upload",
      icon: <UploadCloud className="h-5 w-5" />,
      path: "/upload"
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings"
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-2xl font-semibold tracking-tight text-audio-purple">
            AudioVault
          </h2>
          <div className="px-2 mb-8">
            <p className="text-xs text-muted-foreground">Docker Music Toolbox</p>
          </div>
          
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.path 
                    ? "bg-audio-purple/20 text-audio-purple" 
                    : "hover:bg-audio-purple/10 hover:text-audio-purple"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {user && (
          <div className="px-4 py-2 mt-auto">
            <div className="bg-card/30 rounded-lg px-3 py-2 mb-2">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start hover:bg-destructive/20 hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
