
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, User } from "lucide-react";

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
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Key className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 py-4">
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
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="py-2">
                <p className="text-sm text-muted-foreground">
                  Security settings have been moved to the main Settings page. Please visit the Settings page to manage security options.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile}>Update Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
