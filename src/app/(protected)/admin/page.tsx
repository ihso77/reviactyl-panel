'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import type { NodeStats, ActivityLog } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Server,
  HardDrive,
  Globe,
  Activity,
  TrendingUp,
  Database,
  Circle,
  ArrowUpRight,
  Settings,
  UserPlus,
  RotateCcw,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface AdminStats {
  totalUsers: number;
  totalServers: number;
  totalNodes: number;
  totalDatabases: number;
  activeServers: number;
  suspendedServers: number;
}

const actionIcons = [
  { label: 'New User', icon: UserPlus, href: '#' },
  { label: 'New Server', icon: Plus, href: '#' },
  { label: 'New Node', icon: Globe, href: '#' },
  { label: 'View Settings', icon: Settings, href: '#' },
  { label: 'Restart Panel', icon: RotateCcw, href: '#' },
];

export default function AdminPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [nodes, setNodes] = useState<NodeStats[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) return;

    Promise.all([
      fetch('/api/admin/stats').then(r => r.ok ? r.json() : null),
      fetch('/api/nodes').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/activity').then(r => r.ok ? r.json() : []),
    ])
      .then(([statsData, nodesData, activityData]) => {
        setStats(statsData);
        setNodes(nodesData.map((n: any) => ({
          id: n.id,
          name: n.name,
          location: n.location,
          cpu: n.cpu,
          memory: n.memory,
          disk: n.disk,
          servers: n._count?.servers || 0,
          status: n.status,
        })));
        setActivity(activityData.map((a: any) => ({
          id: a.id,
          action: a.action,
          description: a.description,
          user: a.user?.username || 'Unknown',
          timestamp: new Date(a.createdAt).toLocaleString(),
          ip: a.ip || '',
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.isAdmin]);

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldAlert className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">Access Denied</h3>
        <p className="text-sm text-muted-foreground">You do not have admin access.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const s = stats || { totalUsers: 0, totalServers: 0, totalNodes: 0, totalDatabases: 0, activeServers: 0, suspendedServers: 0 };

  const statCards = [
    { label: 'Total Users', value: s.totalUsers.toString(), icon: Users, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Total Servers', value: s.totalServers.toString(), icon: Server, color: 'text-success', bgColor: 'bg-success/10' },
    { label: 'Total Nodes', value: s.totalNodes.toString(), icon: Globe, color: 'text-chart-2', bgColor: 'bg-chart-2/10' },
    { label: 'Databases', value: s.totalDatabases.toString(), icon: Database, color: 'text-chart-3', bgColor: 'bg-chart-3/10' },
    { label: 'Active Servers', value: s.activeServers.toString(), icon: Activity, color: 'text-chart-4', bgColor: 'bg-chart-4/10' },
    { label: 'Suspended', value: s.suspendedServers.toString(), icon: ShieldAlert, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldAlert className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              System overview and management tools.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Nodes Overview */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Node Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nodes.length > 0 ? (
                nodes.map((node) => (
                  <div key={node.id} className="rounded-lg border border-border/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
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
                      <Badge
                        variant={node.status === 'online' ? 'default' : 'secondary'}
                        className={
                          node.status === 'online'
                            ? 'bg-success/10 text-success border-0 text-xs'
                            : 'bg-destructive/10 text-destructive border-0 text-xs'
                        }
                      >
                        {node.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">CPU</span>
                          <span className="font-medium">{node.cpu}%</span>
                        </div>
                        <Progress value={node.cpu} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Memory</span>
                          <span className="font-medium">{node.memory}%</span>
                        </div>
                        <Progress value={node.memory} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Disk</span>
                          <span className="font-medium">{node.disk}%</span>
                        </div>
                        <Progress value={node.disk} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No nodes configured yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {actionIcons.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start gap-3 h-11"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className="h-4 w-4 text-muted-foreground" />
                    {action.label}
                    <ArrowUpRight className="ml-auto h-3 w-3 text-muted-foreground" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Log */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions across the panel.</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.length > 0 ? (
              <div className="space-y-1">
                {activity.map((log, i) => (
                  <div key={log.id}>
                    <div className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                          {log.user.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm truncate">{log.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.user} {log.ip ? `• ${log.ip}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">{log.action}</Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                      </div>
                    </div>
                    {i < activity.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                No activity recorded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
