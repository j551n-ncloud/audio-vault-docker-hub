
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User, Settings } from "@/components/settings/icons";
import { useToast } from "@/hooks/use-toast";

interface UserSettings {
  email: string;
  darkMode: boolean;
  outputDirectory: string;
  thumbnailsEnabled: boolean;
}

export default function SettingsPage() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { toast } = useToast();
  const [settings, setSettings] = useLocalStorage<UserSettings>("user-settings", {
    email: "admin@example.com",
    darkMode: true,
    outputDirectory: "/audio",
    thumbnailsEnabled: true
  });

  const handleSaveSettings = () => {
    setSettings({
      ...settings,
      darkMode: isDarkMode
    });
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully."
    });
  };

  useEffect(() => {
    setIsDarkMode(settings.darkMode);
  }, [settings.darkMode]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Application Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Switch
                id="theme-toggle"
                checked={isDarkMode}
                onCheckedChange={(checked) => {
                  setIsDarkMode(checked);
                  setSettings({ ...settings, darkMode: checked });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="output-dir">Output Directory</Label>
              <Input
                id="output-dir"
                value={settings.outputDirectory}
                onChange={(e) => setSettings({ ...settings, outputDirectory: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="thumbnails-toggle">Enable Thumbnails</Label>
              <Switch
                id="thumbnails-toggle"
                checked={settings.thumbnailsEnabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, thumbnailsEnabled: checked })
                }
              />
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
