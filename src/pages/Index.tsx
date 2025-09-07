import { useState, useEffect } from "react";
import { SSHConnectionForm } from "@/components/SSHConnectionForm";
import { SavedConnections } from "@/components/SavedConnections";
import { TerminalInterface } from "@/components/TerminalInterface";
import { Terminal, Wifi } from "lucide-react";

export interface SSHConnection {
  id: string;
  name: string;
  ipAddress: string;
  username: string;
  port: number;
  createdAt: Date;
}

const Index = () => {
  const [connections, setConnections] = useState<SSHConnection[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentConnection, setCurrentConnection] = useState<SSHConnection | null>(null);

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

  const handleConnect = (connection: SSHConnection) => {
    setCurrentConnection(connection);
    setTerminalOutput([]);
    setShowTerminal(true);
    
    // Simulate terminal connection process
    const commands = [
      `C:\\Users\\ssh>ssh ${connection.username}@${connection.ipAddress} -p ${connection.port}`,
      `Connecting to ${connection.ipAddress}:${connection.port}...`,
      `The authenticity of host '${connection.ipAddress}:${connection.port}' can't be established.`,
      `ECDSA key fingerprint is SHA256:${generateFingerprint()}.`,
      `Are you sure you want to continue connecting (yes/no/[fingerprint])? yes`,
      `Warning: Permanently added '${connection.ipAddress}:${connection.port}' (ECDSA) to the list of known hosts.`,
      `${connection.username}@${connection.ipAddress}'s password: `,
    ];
    
    // Simulate typing each command with delay
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        setTerminalOutput(prev => [...prev, cmd]);
      }, index * 800);
    });
  };

  const generateFingerprint = () => {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('').match(/.{2}/g)?.join(':') || '';
  };

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
        {!showTerminal && (
          <div className="mb-8">
            <SSHConnectionForm onSave={saveConnection} onConnect={handleConnect} />
          </div>
        )}

        {/* Terminal Interface */}
        {showTerminal && (
          <TerminalInterface 
            output={terminalOutput}
            connection={currentConnection}
            onClose={() => setShowTerminal(false)}
          />
        )}

        {/* Saved Connections */}
        {!showTerminal && connections.length > 0 && (
          <SavedConnections 
            connections={connections} 
            onDelete={deleteConnection}
            onConnect={handleConnect}
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