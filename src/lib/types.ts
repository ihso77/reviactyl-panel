export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: string;
  language: string;
  twoFactorEnabled: boolean;
}

export interface Server {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'starting' | 'stopping';
  node: string;
  category: string;
  egg: string;
  cpu: number;
  memory: number;
  memoryLimit: number;
  disk: number;
  diskLimit: number;
  networkIn: number;
  networkOut: number;
  players: number;
  maxPlayers: number;
  ip: string;
  port: number;
}

export interface ServerStats {
  cpu: number;
  memory: number;
  memoryLimit: number;
  disk: number;
  diskLimit: number;
  networkIn: number;
  networkOut: number;
  uptime: string;
  status: 'online' | 'offline' | 'starting' | 'stopping';
}

export interface ConsoleLine {
  id: number;
  timestamp: string;
  content: string;
  type: 'info' | 'warn' | 'error' | 'success' | 'command';
}

export interface Database {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  connections: number;
}

export interface Backup {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  status: 'completed' | 'in_progress' | 'failed';
}

export interface Schedule {
  id: string;
  name: string;
  cron: string;
  lastRun: string;
  nextRun: string;
  isActive: boolean;
}

export interface ApiKey {
  id: string;
  identifier: string;
  description: string;
  allowedIps: string[];
  createdAt: string;
  lastUsedAt: string;
}

export interface SshKey {
  id: string;
  name: string;
  fingerprint: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  ip: string;
}

export interface NodeStats {
  id: string;
  name: string;
  location: string;
  cpu: number;
  memory: number;
  disk: number;
  servers: number;
  status: 'online' | 'offline';
}
