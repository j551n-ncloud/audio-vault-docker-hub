
import { Label } from "@/components/ui/label";
import { Terminal } from "lucide-react";

interface CommandDisplayProps {
  command: string;
}

export default function CommandDisplay({ command }: CommandDisplayProps) {
  return (
    <div>
      <Label className="text-xs flex items-center gap-1 mb-1">
        <Terminal className="h-3 w-3" />
        Command
      </Label>
      <div className="command-display">
        $ {command}
      </div>
    </div>
  );
}
