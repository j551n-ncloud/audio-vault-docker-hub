
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Music2, Headphones, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: "Total Downloads",
      value: "128",
      description: "Audio files downloaded",
      icon: <Download className="h-5 w-5 text-audio-purple" />,
      change: "+15% from last month"
    },
    {
      title: "Library Size",
      value: "452 MB",
      description: "Total audio storage",
      icon: <Music2 className="h-5 w-5 text-audio-accent" />,
      change: "+32 MB added today"
    },
    {
      title: "Tools Ready",
      value: "4",
      description: "Docker containers",
      icon: <Headphones className="h-5 w-5 text-yellow-500" />,
      change: "All systems operational"
    }
  ];

  const tools = [
    {
      name: "SpotDL",
      description: "Download tracks from Spotify",
      path: "/downloads",
      icon: <Download className="h-5 w-5" />
    },
    {
      name: "YT-DLP",
      description: "Download audio from YouTube",
      path: "/downloads",
      icon: <Download className="h-5 w-5" />
    },
    {
      name: "EyeD3",
      description: "Edit audio metadata",
      path: "/metadata",
      icon: <FileAudio className="h-5 w-5" />
    }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool, index) => (
          <Card key={index} className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-audio-purple hover:bg-audio-purple/80"
                onClick={() => navigate(tool.path)}
              >
                {tool.icon}
                <span className="ml-2">Open Tool</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
