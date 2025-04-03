
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fingerprint, Key, User } from "lucide-react";

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
  
  const [securitySettings, setSecuritySettings] = useLocalStorage("security-settings", {
    passkeysEnabled: false,
  });
  
  const handleUpdateProfile = () => {
    if (!password) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter your current password to make changes"
      });
      return;
    }
    
    // Save theme preference to local storage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    
    onUpdateProfile();
  };

  const handleEnablePasskeys = () => {
    // In a real app, this would start the passkey registration process
    setSecuritySettings({
      ...securitySettings,
      passkeysEnabled: true
    });
    
    toast({
      title: "Passkeys enabled",
      description: "You can now use biometrics to sign in"
    });
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
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Passkeys</h4>
                  <p className="text-sm text-muted-foreground">
                    Use biometrics for faster and more secure sign-in
                  </p>
                </div>
                <Switch 
                  checked={securitySettings.passkeysEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleEnablePasskeys();
                    } else {
                      setSecuritySettings({
                        ...securitySettings,
                        passkeysEnabled: false
                      });
                      toast({
                        title: "Passkeys disabled",
                        description: "Biometric sign-in has been disabled"
                      });
                    }
                  }}
                />
              </div>
              
              {securitySettings.passkeysEnabled && (
                <div className="bg-primary/10 border border-primary/20 rounded-md p-3 mt-2">
                  <div className="flex items-start gap-3">
                    <Fingerprint className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Passkey registered</h5>
                      <p className="text-sm text-muted-foreground">
                        You can use your device biometrics to sign in
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
