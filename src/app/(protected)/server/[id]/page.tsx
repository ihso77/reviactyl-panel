'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { servers, consoleLines, databases, backups, schedules } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Terminal,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Play,
  Square,
  RotateCcw,
  Skull,
  Circle,
  Database,
  Clock,
  FolderOpen,
  Wifi,
  Users,
  Send,
  Download,
  Trash2,
  Plus,
  Power,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServerPage() {
  const params = useParams();
  const server = servers.find((s) => s.id === params.id) || servers[0];
  const [commandInput, setCommandInput] = useState('');
  const [lines, setLines] = useState(consoleLines);
  const [activeTab, setActiveTab] = useState('console');
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    cpu: server.cpu,
    memory: server.memory,
  });

  // Simulate stats fluctuation
  useEffect(() => {
    if (server.status !== 'online') return;
    const interval = setInterval(() => {
      setStats((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 8)),
        memory: Math.max(0, Math.min(server.memoryLimit, prev.memory + (Math.random() - 0.5) * 200)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [server.status, server.memoryLimit]);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSendCommand = () => {
    if (!commandInput.trim()) return;
    const newLine = {
      id: lines.length + 1,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      content: `> ${commandInput}`,
      type: 'command' as const,
    };
    setLines((prev) => [...prev, newLine]);

    // Simulate response
    setTimeout(() => {
      const responses = [
        { content: `[INFO] Command executed successfully.`, type: 'info' as const },
        { content: `[WARN] Unknown command. Type "help" for available commands.`, type: 'warn' as const },
        { content: `Command output: OK`, type: 'success' as const },
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setLines((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          ...response,
        },
      ]);
    }, 300 + Math.random() * 500);

    setCommandInput('');
  };

  const handlePowerAction = (action: string) => {
    const labels: Record<string, string> = {
      start: 'Starting',
      stop: 'Stopping',
      restart: 'Restarting',
      kill: 'Force killing',
    };
    toast.success(`${labels[action]} server "${server.name}"...`);
  };

  const getLineClass = (type: string) => {
    switch (type) {
      case 'warn': return 'text-warning';
      case 'error': return 'text-destructive';
      case 'success': return 'text-success';
      case 'command': return 'text-chart-2';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Server Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge
            className={
              server.status === 'online'
                ? 'bg-success/10 text-success hover:bg-success/15 border-0'
                : 'bg-destructive/10 text-destructive hover:bg-destructive/15 border-0'
            }
          >
            <Circle className="mr-1.5 h-2 w-2 fill-current" />
            {server.status}
          </Badge>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{server.name}</h1>
            <p className="text-sm text-muted-foreground">{server.node} • {server.egg}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="default" className="gap-1.5 bg-success hover:bg-success/90" onClick={() => handlePowerAction('start')}>
            <Play className="h-3.5 w-3.5" /> Start
          </Button>
          <Button size="sm" variant="default" className="gap-1.5 bg-warning hover:bg-warning/90" onClick={() => handlePowerAction('restart')}>
            <RotateCcw className="h-3.5 w-3.5" /> Restart
          </Button>
          <Button size="sm" variant="default" className="gap-1.5 bg-destructive hover:bg-destructive/90" onClick={() => handlePowerAction('stop')}>
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handlePowerAction('kill')}>
            <Skull className="h-3.5 w-3.5" /> Kill
          </Button>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'CPU', value: `${stats.cpu.toFixed(1)}%`, icon: Cpu, percent: stats.cpu, color: stats.cpu > 80 ? 'text-destructive' : stats.cpu > 60 ? 'text-warning' : 'text-success' },
          { label: 'Memory', value: `${(stats.memory / 1024).toFixed(1)} / ${(server.memoryLimit / 1024).toFixed(0)} GB`, icon: MemoryStick, percent: (stats.memory / server.memoryLimit) * 100, color: 'text-chart-2' },
          { label: 'Disk', value: `${(server.disk / 1024).toFixed(1)} / ${(server.diskLimit / 1024).toFixed(0)} GB`, icon: HardDrive, percent: (server.disk / server.diskLimit) * 100, color: 'text-chart-3' },
          { label: 'Network In', value: `${server.networkIn} MB/s`, icon: Network, percent: (server.networkIn / 20) * 100, color: 'text-chart-4' },
          { label: 'Network Out', value: `${server.networkOut} MB/s`, icon: Network, percent: (server.networkOut / 20) * 100, color: 'text-chart-5' },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-sm font-bold tabular-nums">{stat.value}</p>
              <Progress value={Math.min(100, stat.percent)} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="console" className="gap-1.5 text-xs">
            <Terminal className="h-3.5 w-3.5" /> Console
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-1.5 text-xs">
            <FolderOpen className="h-3.5 w-3.5" /> Files
          </TabsTrigger>
          <TabsTrigger value="databases" className="gap-1.5 text-xs">
            <Database className="h-3.5 w-3.5" /> Databases
          </TabsTrigger>
          <TabsTrigger value="backups" className="gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" /> Backups
          </TabsTrigger>
          <TabsTrigger value="schedules" className="gap-1.5 text-xs">
            <Clock className="h-3.5 w-3.5" /> Schedules
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-1.5 text-xs">
            <Wifi className="h-3.5 w-3.5" /> Network
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" /> Users
          </TabsTrigger>
        </TabsList>

        {/* Console Tab */}
        <TabsContent value="console" className="space-y-3">
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              {/* Console Output */}
              <ScrollArea className="h-[400px] bg-[#0d1117] console-output">
                <div className="p-4 space-y-0.5 text-[13px] leading-relaxed">
                  {lines.map((line) => (
                    <div key={line.id} className={getLineClass(line.type)}>
                      <span className="text-muted-foreground/50 mr-2 select-none">[{line.timestamp}]</span>
                      {line.content}
                    </div>
                  ))}
                  <div ref={consoleEndRef} />
                </div>
              </ScrollArea>
              {/* Command Input */}
              <div className="flex items-center gap-2 border-t border-border/50 bg-card p-3">
                <span className="text-xs text-muted-foreground font-mono">$</span>
                <Input
                  placeholder="Enter command..."
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                  className="font-mono text-sm h-9 border-0 focus-visible:ring-0 bg-transparent"
                />
                <Button size="sm" onClick={handleSendCommand} className="gap-1.5 h-9">
                  <Send className="h-3.5 w-3.5" /> Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">File Manager</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> New File
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <FolderOpen className="h-3.5 w-3.5" /> New Folder
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs">/home/container/</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[
                  { name: 'server.properties', type: 'file', size: '1.2 KB', modified: '2024-01-16 14:32' },
                  { name: 'world/', type: 'folder', size: '12.4 GB', modified: '2024-01-16 14:45' },
                  { name: 'plugins/', type: 'folder', size: '340 MB', modified: '2024-01-15 09:00' },
                  { name: 'logs/', type: 'folder', size: '56 MB', modified: '2024-01-16 14:50' },
                  { name: 'spigot.jar', type: 'file', size: '52.1 MB', modified: '2024-01-10 12:00' },
                  { name: 'eula.txt', type: 'file', size: '0.3 KB', modified: '2024-01-01 10:00' },
                  { name: 'start.sh', type: 'file', size: '0.8 KB', modified: '2024-01-01 10:05' },
                ].map((file) => (
                  <div key={file.name} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      {file.type === 'folder' ? (
                        <FolderOpen className="h-4 w-4 text-chart-3" />
                      ) : (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{file.size}</span>
                      <span>{file.modified}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Databases Tab */}
        <TabsContent value="databases">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Databases</CardTitle>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> New Database
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {databases.map((db) => (
                  <div key={db.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{db.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{db.username}@{db.host}:{db.port}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Connections</p>
                        <p className="text-sm font-medium">{db.connections}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Reset Password
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Backups</CardTitle>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Create Backup
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{backup.name}</p>
                        <p className="text-xs text-muted-foreground">{backup.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={backup.status === 'completed' ? 'default' : 'secondary'}
                        className={
                          backup.status === 'completed'
                            ? 'bg-success/10 text-success border-0'
                            : backup.status === 'in_progress'
                            ? 'bg-warning/10 text-warning border-0'
                            : 'bg-destructive/10 text-destructive border-0'
                        }
                      >
                        {backup.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{backup.size}</span>
                      <Button size="sm" variant="outline" className="text-xs gap-1">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs gap-1">
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Schedules</CardTitle>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> New Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{schedule.name}</p>
                        <Badge variant="outline" className="text-[10px] font-mono">{schedule.cron}</Badge>
                        {!schedule.isActive && (
                          <Badge variant="secondary" className="text-[10px]">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Last run: {schedule.lastRun}</span>
                        <span>Next run: {schedule.nextRun}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                      <Button size="sm" variant="outline" className="text-xs">Run Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Network Allocation</CardTitle>
              <CardDescription>Manage IP addresses and ports for this server.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_80px_80px] gap-4 px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground">
                  <span>Address</span>
                  <span>Port</span>
                  <span>Default</span>
                  <span>Actions</span>
                </div>
                {[
                  { ip: server.ip, port: server.port, isDefault: true },
                  { ip: server.ip, port: server.port + 1, isDefault: false },
                  { ip: server.ip, port: server.port + 2, isDefault: false },
                ].map((alloc, i) => (
                  <div key={i} className="grid grid-cols-[1fr_100px_80px_80px] gap-4 items-center px-4 py-3 border-t border-border/50 text-sm">
                    <span className="font-mono text-xs">{alloc.ip}</span>
                    <span className="font-mono text-xs">{alloc.port}</span>
                    {alloc.isDefault ? (
                      <Badge className="text-[10px] bg-primary/10 text-primary border-0">Primary</Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs h-6">Make Primary</Button>
                    )}
                    <Button size="sm" variant="outline" className="text-xs text-destructive hover:bg-destructive/10 h-6">Delete</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-3 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Allocation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Subusers</CardTitle>
                  <CardDescription>Manage who can access this server.</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add Subuser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      AU
                    </div>
                    <div>
                      <p className="text-sm font-medium">Admin User <Badge variant="outline" className="text-[10px] ml-1">Owner</Badge></p>
                      <p className="text-xs text-muted-foreground">admin@example.com</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-success/10 text-success border-0">Full Access</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2 text-white text-xs font-bold">
                      MO
                    </div>
                    <div>
                      <p className="text-sm font-medium">Moderator One</p>
                      <p className="text-xs text-muted-foreground">mod@example.com</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Console, Files</Badge>
                    <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                    <Button size="sm" variant="outline" className="text-xs text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
