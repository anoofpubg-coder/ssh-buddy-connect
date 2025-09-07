import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X, Minimize2 } from "lucide-react";
import { SSHConnection } from "@/pages/Index";
import { useEffect, useRef } from "react";

interface TerminalInterfaceProps {
  output: string[];
  connection: SSHConnection | null;
  onClose: () => void;
}

export const TerminalInterface = ({ output, connection, onClose }: TerminalInterfaceProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  if (!connection) return null;

  return (
    <Card className="bg-black border-primary/30 shadow-terminal min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between p-2 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-primary/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-white font-mono text-sm ml-2">
            SSH - {connection.username}@{connection.ipAddress}:{connection.port}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 text-white hover:bg-white/20"
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 text-white hover:bg-red-500/50"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={terminalRef}
          className="bg-black text-primary font-mono text-sm p-4 h-96 overflow-y-auto"
        >
          <div className="space-y-1">
            {output.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line.includes("password:") ? (
                  <div className="flex">
                    <span>{line}</span>
                    <span className="animate-pulse ml-1">▌</span>
                  </div>
                ) : (
                  <div>
                    {line}
                    {index === output.length - 1 && !line.includes("password:") && (
                      <span className="animate-pulse ml-1">▌</span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {output.length === 0 && (
              <div className="text-primary/70">
                Microsoft Windows [Version 10.0.22631.4317]<br/>
                (c) Microsoft Corporation. All rights reserved.<br/><br/>
                <span className="animate-pulse">▌</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-900 border-t border-primary/30 p-2">
          <div className="flex items-center justify-between text-xs text-primary/70 font-mono">
            <span>Terminal Ready</span>
            <span>SSH Connection Simulator</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};