'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import type { Server, Database, Backup, Schedule, ConsoleLine } from '@/lib/types';
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
import { motion } from 'framer-motion';

export default function ServerPage() {
  const params = useParams();
  const serverId = params.id as string;
  const [server, setServer] = useState<Server | null>(null);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [activeTab, setActiveTab] = useState('console');
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serverId) return;

    Promise.all([
      fetch(`/api/servers/${serverId}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/servers/${serverId}/databases`).then(r => r.ok ? r.json() : []),
      fetch(`/api/servers/${serverId}/backups`).then(r => r.ok ? r.json() : []),
      fetch(`/api/servers/${serverId}/schedules`).then(r => r.ok ? r.json() : []),
      fetch(`/api/servers/${serverId}/console`).then(r => r.ok ? r.json() : []),
    ])
      .then(([serverData, databasesData, backupsData, schedulesData, consoleData]) => {
        if (serverData) {
          setServer({
            id: serverData.id,
            name: serverData.name,
            description: serverData.description || '',
            status: serverData.status,
            node: serverData.node?.name || '',
            category: serverData.category || '',
            egg: serverData.egg || '',
            cpu: serverData.cpu,
            memory: serverData.memory,
            memoryLimit: serverData.memoryLimit,
            disk: serverData.disk,
            diskLimit: serverData.diskLimit,
            networkIn: serverData.networkIn,
            networkOut: serverData.networkOut,
            players: serverData.players,
            maxPlayers: serverData.maxPlayers,
            ip: serverData.ip || '',
            port: serverData.port,
          });
        }
        setDatabases(databasesData.map((d: any) => ({
          id: d.id,
          name: d.name,
          host: d.host,
          port: d.port,
          username: d.username,
          connections: d.connections,
        })));
        setBackups(backupsData.map((b: any) => ({
          id: b.id,
          name: b.name,
          size: b.size || '—',
          createdAt: b.createdAt,
          status: b.status,
        })));
        setSchedules(schedulesData.map((s: any) => ({
          id: s.id,
          name: s.name,
          cron: s.cron,
          lastRun: s.lastRun || '—',
          nextRun: s.nextRun || '—',
          isActive: s.isActive,
        })));
        setConsoleLines(consoleData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [serverId]);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLines]);

  const handleSendCommand = () => {
    if (!commandInput.trim()) return;
    const newLine: ConsoleLine = {
      id: consoleLines.length + 1,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      content: `> ${commandInput}`,
      type: 'command',
    };
    setConsoleLines((prev) => [...prev, newLine]);
    setCommandInput('');
    toast.info('Command sent to server');
  };

  const handlePowerAction = async (action: string) => {
    const statusMap: Record<string, string> = {
      start: 'online',
      stop: 'offline',
      restart: 'starting',
      kill: 'offline',
    };
    const labels: Record<string, string> = {
      start: 'Starting',
      stop: 'Stopping',
      restart: 'Restarting',
      kill: 'Force killing',
    };

    try {
      const res = await fetch(`/api/servers/${serverId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusMap[action] }),
      });
      if (res.ok) {
        const data = await res.json();
        setServer(prev => prev ? { ...prev, status: data.status } : null);
        toast.success(`${labels[action]} server "${server?.name}"...`);
      }
    } catch {
      toast.error('Failed to update server status');
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Power className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">Server not found</h3>
        <p className="text-sm text-muted-foreground">This server does not exist or you do not have access.</p>
      </div>
    );
  }

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
          { label: 'CPU', value: `${server.cpu.toFixed(1)}%`, icon: Cpu, percent: server.cpu, color: server.cpu > 80 ? 'text-destructive' : server.cpu > 60 ? 'text-warning' : 'text-success' },
          { label: 'Memory', value: `${(server.memory / 1024).toFixed(1)} / ${(server.memoryLimit / 1024).toFixed(0)} GB`, icon: MemoryStick, percent: server.memoryLimit > 0 ? (server.memory / server.memoryLimit) * 100 : 0, color: 'text-chart-2' },
          { label: 'Disk', value: `${(server.disk / 1024).toFixed(1)} / ${(server.diskLimit / 1024).toFixed(0)} GB`, icon: HardDrive, percent: server.diskLimit > 0 ? (server.disk / server.diskLimit) * 100 : 0, color: 'text-chart-3' },
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
              <ScrollArea className="h-[400px] bg-[#0d1117] console-output">
                <div className="p-4 space-y-0.5 text-[13px] leading-relaxed">
                  {consoleLines.length > 0 ? (
                    consoleLines.map((line) => (
                      <div key={line.id} className={getLineClass(line.type)}>
                        <span className="text-muted-foreground/50 mr-2 select-none">[{line.timestamp}]</span>
                        {line.content}
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground/50 py-8 text-center">
                      No console output yet. Start the server to see logs.
                    </div>
                  )}
                  <div ref={consoleEndRef} />
                </div>
              </ScrollArea>
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
              <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                Connect a node to manage server files.
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
              </div>
            </CardHeader>
            <CardContent>
              {databases.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No databases configured.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Backups</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {backups.length > 0 ? (
                <div className="space-y-2">
                  {backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">{backup.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(backup.createdAt).toLocaleString()}</p>
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
                        <Button size="sm" variant="outline" className="text-xs">
                          Restore
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No backups yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Schedules</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {schedules.length > 0 ? (
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
                          <span>Last run: {typeof schedule.lastRun === 'string' && !schedule.lastRun.includes('—') ? new Date(schedule.lastRun).toLocaleString() : schedule.lastRun}</span>
                          <span>Next run: {typeof schedule.nextRun === 'string' && !schedule.nextRun.includes('—') ? new Date(schedule.nextRun).toLocaleString() : schedule.nextRun}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                        <Button size="sm" variant="outline" className="text-xs">Run Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No schedules configured.
                </div>
              )}
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
                <div className="grid grid-cols-[1fr_100px_80px_80px] gap-4 items-center px-4 py-3 border-t border-border/50 text-sm">
                  <span className="font-mono text-xs">{server.ip || 'Not assigned'}</span>
                  <span className="font-mono text-xs">{server.port}</span>
                  <Badge className="text-[10px] bg-primary/10 text-primary border-0">Primary</Badge>
                  <span className="text-xs text-muted-foreground">—</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Server Owner</CardTitle>
                  <CardDescription>Server ownership information.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {(server.node || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Server Owner <Badge variant="outline" className="text-[10px] ml-1">Owner</Badge></p>
                      <p className="text-xs text-muted-foreground">You</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-success/10 text-success border-0">Full Access</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
