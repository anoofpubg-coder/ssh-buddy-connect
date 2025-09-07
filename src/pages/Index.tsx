import { useState, useEffect } from "react";
import { SSHConnectionForm } from "@/components/SSHConnectionForm";
import { SavedConnections } from "@/components/SavedConnections";
import { Terminal, Wifi } from "lucide-react";

export interface SSHConnection {
  id: string;
  name: string;
  ipAddress: string;
  username: string;
  createdAt: Date;
}

const Index = () => {
  const [connections, setConnections] = useState<SSHConnection[]>([]);

  useEffect(() => {
    const savedConnections = localStorage.getItem("ssh-connections");
    if (savedConnections) {
      const parsed = JSON.parse(savedConnections);
      setConnections(parsed.map((conn: any) => ({
        ...conn,
        createdAt: new Date(conn.createdAt)
      })));
    }
  }, []);

  const saveConnection = (connection: Omit<SSHConnection, "id" | "createdAt">) => {
    const newConnection: SSHConnection = {
      ...connection,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    const updatedConnections = [newConnection, ...connections];
    setConnections(updatedConnections);
    localStorage.setItem("ssh-connections", JSON.stringify(updatedConnections));
  };

  const deleteConnection = (id: string) => {
    const updatedConnections = connections.filter(conn => conn.id !== id);
    setConnections(updatedConnections);
    localStorage.setItem("ssh-connections", JSON.stringify(updatedConnections));
  };

  return (
    <div className="min-h-screen bg-gradient-terminal">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Terminal className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-mono text-foreground">SSH Connect</h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            Secure Shell Connection Manager
          </p>
        </div>

        {/* Connection Form */}
        <div className="mb-8">
          <SSHConnectionForm onSave={saveConnection} />
        </div>

        {/* Saved Connections */}
        {connections.length > 0 && (
          <SavedConnections 
            connections={connections} 
            onDelete={deleteConnection}
          />
        )}

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 mt-8 text-terminal-glow">
          <Wifi className="w-4 h-4" />
          <span className="font-mono text-xs">Ready to connect</span>
        </div>
      </div>
    </div>
  );
};

export default Index;