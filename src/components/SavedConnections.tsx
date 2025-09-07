import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Terminal, Clock, User, Globe } from "lucide-react";
import { SSHConnection } from "@/pages/Index";

interface SavedConnectionsProps {
  connections: SSHConnection[];
  onDelete: (id: string) => void;
  onConnect: (connection: SSHConnection) => void;
}

export const SavedConnections = ({ connections, onDelete, onConnect }: SavedConnectionsProps) => {
  const { toast } = useToast();

  const handleConnect = (connection: SSHConnection) => {
    onConnect(connection);
  };

  const handleDelete = (connection: SSHConnection) => {
    onDelete(connection.id);
    toast({
      title: "Connection Deleted",
      description: `${connection.name} has been removed`,
      variant: "destructive",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-terminal">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground font-mono">
          <Terminal className="w-5 h-5 text-primary" />
          Saved Connections ({connections.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="bg-secondary/50 border border-border rounded-lg p-4 hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-mono text-foreground font-semibold text-sm mb-1">
                    {connection.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Globe className="w-3 h-3" />
                      <span className="font-mono">{connection.ipAddress}:{connection.port}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <User className="w-3 h-3" />
                      <span className="font-mono">{connection.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{formatDate(connection.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDelete(connection)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={() => handleConnect(connection)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-sm shadow-glow"
              >
                Connect to {connection.username}@{connection.ipAddress}:{connection.port}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};