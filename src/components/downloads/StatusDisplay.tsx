
import { Progress } from "@/components/ui/progress";

export interface ProcessInfo {
  status: "pending" | "active" | "complete" | "error";
  progress: number;
  message: string;
}

interface StatusDisplayProps {
  downloadStatus: ProcessInfo;
  embedStatus?: ProcessInfo;
  playlistStatus?: ProcessInfo;
}

export default function StatusDisplay({ downloadStatus, embedStatus, playlistStatus }: StatusDisplayProps) {
  const renderStatusItem = (info: ProcessInfo, label: string) => (
    <div className={`status-item status-${info.status}`}>
      <span className="status-indicator"></span>
      <span>{label}: {info.message}</span>
      {info.status === "active" && info.progress > 0 && info.progress < 100 && (
        <Progress value={info.progress} className="h-1 flex-1" />
      )}
    </div>
  );

  return (
    <div className="progress-status">
      {renderStatusItem(downloadStatus, "Download")}
      {embedStatus && renderStatusItem(embedStatus, "Processing")}
      {playlistStatus && renderStatusItem(playlistStatus, "Playlist")}
    </div>
  );
}
