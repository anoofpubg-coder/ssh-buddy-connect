import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Terminal, Save } from "lucide-react";

interface SSHConnectionFormProps {
  onSave: (connection: { name: string; ipAddress: string; username: string; port: number }) => void;
  onConnect: (connection: { name: string; ipAddress: string; username: string; port: number; id: string; createdAt: Date }) => void;
}

export const SSHConnectionForm = ({ onSave, onConnect }: SSHConnectionFormProps) => {
  const [ipAddress, setIpAddress] = useState("");
  const [username, setUsername] = useState("");
  const [connectionName, setConnectionName] = useState("");
  const [port, setPort] = useState("");
  const { toast } = useToast();

  const validateForm = () => {
    if (!ipAddress.trim()) {
      toast({
        title: "IP Address Required",
        description: "Please enter a valid IP address",
        variant: "destructive",
      });
      return false;
    }

    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username",
        variant: "destructive",
      });
      return false;
    }

    // Basic IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress.trim())) {
      toast({
        title: "Invalid IP Address",
        description: "Please enter a valid IPv4 address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleConnect = () => {
    if (!validateForm()) return;

    const portNumber = port.trim() ? parseInt(port.trim()) : 22;
    const connectionData = {
      id: crypto.randomUUID(),
      name: connectionName.trim() || `${username}@${ipAddress}`,
      ipAddress: ipAddress.trim(),
      username: username.trim(),
      port: portNumber,
      createdAt: new Date(),
    };

    onConnect(connectionData);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const portNumber = port.trim() ? parseInt(port.trim()) : 22;
    const name = connectionName.trim() || `${username}@${ipAddress}`;
    onSave({
      name,
      ipAddress: ipAddress.trim(),
      username: username.trim(),
      port: portNumber,
    });

    toast({
      title: "Connection Saved",
      description: `${name} has been saved to your connections`,
    });

    // Clear form
    setIpAddress("");
    setUsername("");
    setConnectionName("");
    setPort("");
  };

  return (
    <Card className="bg-gradient-card border-border shadow-terminal">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground font-mono">
          <Terminal className="w-5 h-5 text-primary" />
          New Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="connectionName" className="text-foreground font-mono text-sm">
            Connection Name (Optional)
          </Label>
          <Input
            id="connectionName"
            placeholder="My Server"
            value={connectionName}
            onChange={(e) => setConnectionName(e.target.value)}
            className="bg-input border-border text-foreground font-mono placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ipAddress" className="text-foreground font-mono text-sm">
            IP Address *
          </Label>
          <Input
            id="ipAddress"
            placeholder="192.168.1.100"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className="bg-input border-border text-foreground font-mono placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="username" className="text-foreground font-mono text-sm">
              Username *
            </Label>
            <Input
              id="username"
              placeholder="root"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-input border-border text-foreground font-mono placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="w-24 space-y-2">
            <Label htmlFor="port" className="text-foreground font-mono text-sm">
              Port
            </Label>
            <Input
              id="port"
              placeholder="22"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="bg-input border-border text-foreground font-mono placeholder:text-muted-foreground text-center"
              type="number"
              min="1"
              max="65535"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleConnect}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-mono shadow-glow"
          >
            Connect
          </Button>
          <Button
            onClick={handleSave}
            variant="outline"
            className="bg-secondary hover:bg-secondary/80 border-border text-secondary-foreground font-mono"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};