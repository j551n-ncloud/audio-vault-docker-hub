
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

interface UserSettings {
  email: string;
  darkMode: boolean;
  outputDirectory: string;
  thumbnailsEnabled: boolean;
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
})
.refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required to change email")
});

export default function SettingsPage() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { toast } = useToast();
  const { user } = useAuth();
  const [settings, setSettings] = useLocalStorage<UserSettings>("user-settings", {
    email: user?.email || "admin@example.com",
    darkMode: true,
    outputDirectory: "/audio",
    thumbnailsEnabled: true
  });
  
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: settings.email,
      password: ""
    }
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

  const onChangePassword = (values: z.infer<typeof passwordSchema>) => {
    // In a real app, this would call an API to change the password
    console.log("Changing password:", values);
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    
    passwordForm.reset();
  };

  const onChangeEmail = (values: z.infer<typeof emailSchema>) => {
    // In a real app, this would call an API to change the email
    console.log("Changing email:", values);
    
    setSettings({
      ...settings,
      email: values.email
    });
    
    toast({
      title: "Email updated",
      description: "Your email has been changed successfully."
    });
    
    emailForm.reset({
      email: values.email,
      password: ""
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
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="email-display">Email</Label>
              <Input
                id="email-display"
                type="email"
                value={settings.email}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Email</h3>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onChangeEmail)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="new.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Email</Button>
                </form>
              </Form>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Password</Button>
                </form>
              </Form>
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
