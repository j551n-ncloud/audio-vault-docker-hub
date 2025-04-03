
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateProfile: () => void;
  initialEmail?: string;
}

export default function ProfileSettingsDialog({ 
  isOpen, 
  onOpenChange,
  onUpdateProfile,
  initialEmail = "admin@example.com"
}: ProfileSettingsDialogProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { toast } = useToast();
  
  const handleUpdateProfile = () => {
    if (!password) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter your current password to make changes"
      });
      return;
    }
    
    onUpdateProfile();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your current password"
              className="bg-background border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password (leave empty to keep current)</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="bg-background border"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="theme-toggle">Theme</Label>
            <div className="flex items-center space-x-2">
              <Switch 
                id="theme-toggle" 
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Label htmlFor="theme-toggle">{isDarkMode ? 'Dark' : 'Light'}</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile}>Update Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
