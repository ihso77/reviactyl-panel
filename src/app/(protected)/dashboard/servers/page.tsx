'use client';

import { useState } from 'react';
import Link from 'next/link';
import { servers } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Circle,
  Cpu,
  MemoryStick,
  Users,
  HardDrive,
  Server as ServerIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function ServersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

  const categories = [...new Set(servers.map((s) => s.category))];

  const filtered = servers.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Servers</h1>
            <p className="text-sm text-muted-foreground">
              Manage all your game servers from here.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search servers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 h-9"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div variants={item} className="flex gap-2">
        {(['all', 'online', 'offline'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === 'all' ? 'All' : f}
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {f === 'all' ? servers.length : servers.filter((s) => s.status === f).length}
            </Badge>
          </Button>
        ))}
      </motion.div>

      {/* Server List by Category */}
      {categories.map((category) => {
        const categoryServers = filtered.filter((s) => s.category === category);
        if (categoryServers.length === 0) return null;

        return (
          <motion.div key={category} variants={item} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {category}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categoryServers.map((server) => (
                <Link key={server.id} href={`/server/${server.id}`}>
                  <Card className="border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group cursor-pointer h-full">
                    <CardHeader className="pb-2">
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
                            <Circle className="mr-1 h-1.5 w-1.5 fill-current" />
                            {server.status}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-normal">{server.egg}</Badge>
                        </div>
                      </div>
                      <CardTitle className="text-sm font-semibold mt-2">{server.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <p className="text-xs text-muted-foreground line-clamp-1">{server.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Cpu className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">CPU:</span>
                          <span className="font-medium">{server.cpu}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <MemoryStick className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">RAM:</span>
                          <span className="font-medium">{(server.memory / 1024).toFixed(1)} GB</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Players:</span>
                          <span className="font-medium">{server.players}/{server.maxPlayers}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <HardDrive className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Disk:</span>
                          <span className="font-medium">{(server.disk / 1024).toFixed(1)} GB</span>
                        </div>
                      </div>
                      {server.status === 'online' && (
                        <div className="space-y-1">
                          <Progress value={(server.memory / server.memoryLimit) * 100} className="h-1" />
                          <p className="text-[10px] text-muted-foreground text-right">
                            {(server.memory / 1024).toFixed(1)} / {(server.memoryLimit / 1024).toFixed(0)} GB
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        );
      })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ServerIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">No servers found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter.</p>
        </div>
      )}
    </motion.div>
  );
}
