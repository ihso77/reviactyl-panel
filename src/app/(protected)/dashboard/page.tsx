'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { servers, nodeStats } from '@/lib/mock-data';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Activity,
  Server as ServerIcon,
  Users,
  Globe,
  TrendingUp,
  ArrowRight,
  Circle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const onlineServers = servers.filter((s) => s.status === 'online').length;
  const totalPlayers = servers.reduce((sum, s) => sum + s.players, 0);
  const avgCpu = Math.round(servers.filter((s) => s.status === 'online').reduce((sum, s) => sum + s.cpu, 0) / onlineServers);
  const totalMemory = servers.filter((s) => s.status === 'online').reduce((sum, s) => sum + s.memory, 0);
  const totalMemoryLimit = servers.reduce((sum, s) => sum + s.memoryLimit, 0);

  const categories = [...new Set(servers.map((s) => s.category))];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Header */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s an overview of your servers and resources.
            </p>
          </div>
          <p className="text-sm text-muted-foreground tabular-nums">{currentTime}</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <ServerIcon className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onlineServers}</p>
                <p className="text-xs text-muted-foreground">Online Servers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgCpu}%</p>
                <p className="text-xs text-muted-foreground">Avg. CPU Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <MemoryStick className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(totalMemory / 1024).toFixed(1)} GB</p>
                <p className="text-xs text-muted-foreground">Memory Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <Users className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPlayers}</p>
                <p className="text-xs text-muted-foreground">Total Players</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resource Usage */}
      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">CPU</span>
                <span className="font-medium">{avgCpu}%</span>
              </div>
              <Progress value={avgCpu} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Memory</span>
                <span className="font-medium">{(totalMemory / 1024).toFixed(1)} / {(totalMemoryLimit / 1024).toFixed(1)} GB</span>
              </div>
              <Progress value={(totalMemory / totalMemoryLimit) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Disk</span>
                <span className="font-medium">63.5 / 225.3 GB</span>
              </div>
              <Progress value={28.2} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Nodes Overview */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nodeStats.map((node) => (
                <div key={node.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center gap-3">
                    <Circle
                      className={`h-2.5 w-2.5 fill-current ${
                        node.status === 'online' ? 'text-success' : 'text-destructive'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{node.name}</p>
                      <p className="text-xs text-muted-foreground">{node.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{node.servers} servers</p>
                    <p className="text-xs text-muted-foreground">{node.cpu}% CPU</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Servers by Category */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Servers</h2>
          <Link href="/dashboard/servers">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {servers.slice(0, 6).map((server) => (
            <Link key={server.id} href={`/server/${server.id}`}>
              <Card className="border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={server.status === 'online' ? 'default' : 'secondary'}
                        className={
                          server.status === 'online'
                            ? 'bg-success/10 text-success hover:bg-success/15 border-0'
                            : 'bg-destructive/10 text-destructive hover:bg-destructive/15 border-0'
                        }
                      >
                        <Circle className="mr-1.5 h-2 w-2 fill-current" />
                        {server.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-normal">{server.category}</Badge>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="text-base font-semibold mt-2">{server.name}</CardTitle>
                  <CardDescription className="text-xs">{server.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">CPU</p>
                      <div className="flex items-center gap-2">
                        <Progress value={server.cpu} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium">{server.cpu}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Memory</p>
                      <div className="flex items-center gap-2">
                        <Progress value={(server.memory / server.memoryLimit) * 100} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium">{(server.memory / 1024).toFixed(1)}G</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Players</p>
                      <p className="text-xs font-medium">{server.players}/{server.maxPlayers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Node</p>
                      <p className="text-xs font-medium">{server.node}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
