
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
  const { toast } = useToast();
  
  const handleUpdateProfile = () => {
    onUpdateProfile();
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Profile Settings</DialogTitle>
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
              <p className="text-xs text-muted-foreground">
                For full account management, visit the Settings page.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="py-2">
                <p className="text-sm text-muted-foreground">
                  Security settings, including password changes, have been moved to the main Settings page. Please visit the Settings page to manage security options.
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
