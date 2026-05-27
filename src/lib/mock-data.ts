import type {
  Server,
  ConsoleLine,
  Database,
  Backup,
  Schedule,
  ApiKey,
  SshKey,
  ActivityLog,
  NodeStats,
} from './types';

// ── Servers ──────────────────────────────────────────────────────────
export const servers: Server[] = [
  {
    id: 'srv-001',
    name: 'Survival SMP',
    description: 'Vanilla Minecraft Survival server with custom plugins',
    status: 'online',
    node: 'US-East-1',
    category: 'Minecraft',
    egg: 'Paper',
    cpu: 23.5,
    memory: 4096,
    memoryLimit: 8192,
    disk: 12800,
    diskLimit: 51200,
    networkIn: 1.2,
    networkOut: 3.8,
    players: 47,
    maxPlayers: 100,
    ip: '192.168.1.10',
    port: 25565,
  },
  {
    id: 'srv-002',
    name: 'Creative World',
    description: 'Minecraft Creative Mode server',
    status: 'online',
    node: 'US-East-1',
    category: 'Minecraft',
    egg: 'Paper',
    cpu: 12.1,
    memory: 2048,
    memoryLimit: 4096,
    disk: 3200,
    diskLimit: 25600,
    networkIn: 0.5,
    networkOut: 1.2,
    players: 12,
    maxPlayers: 50,
    ip: '192.168.1.10',
    port: 25566,
  },
  {
    id: 'srv-003',
    name: 'Rust Main',
    description: 'Rust survival main server',
    status: 'online',
    node: 'EU-West-1',
    category: 'Rust',
    egg: 'Rust',
    cpu: 68.4,
    memory: 10240,
    memoryLimit: 16384,
    disk: 28900,
    diskLimit: 102400,
    networkIn: 5.6,
    networkOut: 12.3,
    players: 189,
    maxPlayers: 250,
    ip: '10.0.0.5',
    port: 28015,
  },
  {
    id: 'srv-004',
    name: 'CS2 Competitive',
    description: 'Counter-Strike 2 Competitive server',
    status: 'offline',
    node: 'US-West-1',
    category: 'Source Engine',
    egg: 'CS2',
    cpu: 0,
    memory: 0,
    memoryLimit: 4096,
    disk: 15600,
    diskLimit: 30720,
    networkIn: 0,
    networkOut: 0,
    players: 0,
    maxPlayers: 64,
    ip: '172.16.0.10',
    port: 27015,
  },
  {
    id: 'srv-005',
    name: 'Terraria Adventure',
    description: 'Terraria journey mode server',
    status: 'online',
    node: 'EU-West-1',
    category: 'Other',
    egg: 'Terraria',
    cpu: 8.3,
    memory: 1024,
    memoryLimit: 2048,
    disk: 1800,
    diskLimit: 10240,
    networkIn: 0.3,
    networkOut: 0.7,
    players: 6,
    maxPlayers: 32,
    ip: '10.0.0.12',
    port: 7777,
  },
  {
    id: 'srv-006',
    name: 'Proxy Server',
    description: 'Velocity proxy server',
    status: 'online',
    node: 'US-East-1',
    category: 'Proxy',
    egg: 'Velocity',
    cpu: 3.2,
    memory: 512,
    memoryLimit: 1024,
    disk: 256,
    diskLimit: 5120,
    networkIn: 8.4,
    networkOut: 16.2,
    players: 65,
    maxPlayers: 500,
    ip: '192.168.1.10',
    port: 25577,
  },
];

// ── Console Lines ────────────────────────────────────────────────────
export const consoleLines: ConsoleLine[] = [
  { id: 1, timestamp: '14:32:01', content: '[INFO] Starting Minecraft server version 1.21.4', type: 'info' },
  { id: 2, timestamp: '14:32:02', content: '[INFO] Loading properties', type: 'info' },
  { id: 3, timestamp: '14:32:02', content: '[INFO] Default game type: SURVIVAL', type: 'info' },
  { id: 4, timestamp: '14:32:02', content: '[INFO] Generating keypair', type: 'info' },
  { id: 5, timestamp: '14:32:03', content: '[INFO] Starting Minecraft server on *:25565', type: 'info' },
  { id: 6, timestamp: '14:32:03', content: '[INFO] Using default channel type', type: 'info' },
  { id: 7, timestamp: '14:32:04', content: '[INFO] Preparing level "world"', type: 'info' },
  { id: 8, timestamp: '14:32:05', content: '[INFO] Preparing start region for dimension minecraft:overworld', type: 'info' },
  { id: 9, timestamp: '14:32:12', content: '[INFO] Time elapsed: 7.842s', type: 'info' },
  { id: 10, timestamp: '14:32:12', content: '[INFO] Done! Server started successfully.', type: 'success' },
  { id: 11, timestamp: '14:32:12', content: '[INFO] Type "help" for a list of commands.', type: 'info' },
  { id: 12, timestamp: '14:35:22', content: 'Steve joined the game', type: 'success' },
  { id: 13, timestamp: '14:36:01', content: 'Alex joined the game', type: 'success' },
  { id: 14, timestamp: '14:38:45', content: '[WARN] Can\'t keep up! Is the server overloaded? Running 2842ms behind', type: 'warn' },
  { id: 15, timestamp: '14:40:12', content: 'Notch joined the game', type: 'success' },
  { id: 16, timestamp: '14:42:33', content: '<Steve> Hey everyone!', type: 'command' },
  { id: 17, timestamp: '14:43:01', content: '<Alex> Welcome to the server!', type: 'command' },
  { id: 18, timestamp: '14:45:22', content: '[WARN] Player_Notch moved too quickly! 23.5 blocks', type: 'warn' },
  { id: 19, timestamp: '14:47:55', content: 'Steve left the game', type: 'info' },
  { id: 20, timestamp: '14:50:11', content: '[INFO] Server tick took 142ms (should be 50ms max)', type: 'warn' },
];

// ── Databases ────────────────────────────────────────────────────────
export const databases: Database[] = [
  { id: 'db-001', name: 'smp_world', host: 'localhost', port: 3306, username: 'smp_user', connections: 23 },
  { id: 'db-002', name: 'smp_essentials', host: 'localhost', port: 3306, username: 'smp_user', connections: 5 },
  { id: 'db-003', name: 'smp_economy', host: 'localhost', port: 3306, username: 'smp_user', connections: 12 },
];

// ── Backups ──────────────────────────────────────────────────────────
export const backups: Backup[] = [
  { id: 'bk-001', name: 'auto-daily-2024-01-15', size: '2.4 GB', createdAt: '2024-01-15 03:00', status: 'completed' },
  { id: 'bk-002', name: 'auto-daily-2024-01-14', size: '2.3 GB', createdAt: '2024-01-14 03:00', status: 'completed' },
  { id: 'bk-003', name: 'manual-pre-update', size: '2.4 GB', createdAt: '2024-01-13 18:30', status: 'completed' },
  { id: 'bk-004', name: 'auto-weekly-2024-01-12', size: '2.2 GB', createdAt: '2024-01-12 03:00', status: 'completed' },
  { id: 'bk-005', name: 'auto-daily-2024-01-16', size: '—', createdAt: '2024-01-16 03:00', status: 'in_progress' },
];

// ── Schedules ────────────────────────────────────────────────────────
export const schedules: Schedule[] = [
  { id: 'sch-001', name: 'Daily Restart', cron: '0 4 * * *', lastRun: '2024-01-16 04:00', nextRun: '2024-01-17 04:00', isActive: true },
  { id: 'sch-002', name: 'Auto Backup', cron: '0 3 * * *', lastRun: '2024-01-16 03:00', nextRun: '2024-01-17 03:00', isActive: true },
  { id: 'sch-003', name: 'Clear Entities', cron: '0 */6 * * *', lastRun: '2024-01-16 12:00', nextRun: '2024-01-16 18:00', isActive: false },
];

// ── API Keys ─────────────────────────────────────────────────────────
export const apiKeys: ApiKey[] = [
  {
    id: 'ak-001',
    identifier: 'pterodactyl_cli_abc123',
    description: 'CLI Access Token',
    allowedIps: ['*'],
    createdAt: '2024-01-01 12:00',
    lastUsedAt: '2024-01-16 14:22',
  },
  {
    id: 'ak-002',
    identifier: 'custom_script_xyz789',
    description: 'Backup Automation Script',
    allowedIps: ['10.0.0.1', '10.0.0.2'],
    createdAt: '2024-01-05 09:30',
    lastUsedAt: '2024-01-16 03:00',
  },
];

// ── SSH Keys ─────────────────────────────────────────────────────────
export const sshKeys: SshKey[] = [
  { id: 'ssh-001', name: 'My Laptop', fingerprint: 'SHA256:abc123def456...', createdAt: '2024-01-01 12:00' },
  { id: 'ssh-002', name: 'Work Desktop', fingerprint: 'SHA256:789xyz012abc...', createdAt: '2024-01-10 08:45' },
];

// ── Activity Logs ────────────────────────────────────────────────────
export const activityLogs: ActivityLog[] = [
  { id: 'log-001', action: 'server:start', description: 'Started server "Survival SMP"', user: 'admin', timestamp: '2024-01-16 14:32', ip: '192.168.1.100' },
  { id: 'log-002', action: 'server:command', description: 'Sent command "/say Welcome!"', user: 'admin', timestamp: '2024-01-16 14:35', ip: '192.168.1.100' },
  { id: 'log-003', action: 'backup:create', description: 'Created backup "manual-pre-update"', user: 'admin', timestamp: '2024-01-13 18:30', ip: '192.168.1.100' },
  { id: 'log-004', action: 'user:create', description: 'Created user "player1"', user: 'admin', timestamp: '2024-01-12 10:15', ip: '10.0.0.1' },
  { id: 'log-005', action: 'server:stop', description: 'Stopped server "CS2 Competitive"', user: 'admin', timestamp: '2024-01-11 22:00', ip: '192.168.1.100' },
  { id: 'log-006', action: 'server:restart', description: 'Restarted server "Rust Main"', user: 'admin', timestamp: '2024-01-10 06:00', ip: '10.0.0.1' },
  { id: 'log-007', action: 'node:update', description: 'Updated node "US-East-1" settings', user: 'admin', timestamp: '2024-01-09 15:30', ip: '192.168.1.100' },
  { id: 'log-008', action: 'database:create', description: 'Created database "smp_economy"', user: 'admin', timestamp: '2024-01-08 11:45', ip: '10.0.0.1' },
];

// ── Node Stats ───────────────────────────────────────────────────────
export const nodeStats: NodeStats[] = [
  { id: 'node-001', name: 'US-East-1', location: 'New York, US', cpu: 35.2, memory: 52.1, disk: 41.3, servers: 12, status: 'online' },
  { id: 'node-002', name: 'EU-West-1', location: 'Frankfurt, DE', cpu: 67.8, memory: 72.4, disk: 55.6, servers: 8, status: 'online' },
  { id: 'node-003', name: 'US-West-1', location: 'Los Angeles, US', cpu: 12.3, memory: 28.5, disk: 33.1, servers: 5, status: 'online' },
  { id: 'node-004', name: 'AP-Southeast-1', location: 'Singapore, SG', cpu: 0, memory: 0, disk: 15.2, servers: 0, status: 'offline' },
];

// ── Admin Stats ──────────────────────────────────────────────────────
export const adminStats = {
  totalUsers: 1247,
  totalServers: 156,
  totalNodes: 4,
  totalDatabases: 312,
  activeServers: 98,
  suspendedServers: 12,
  totalAllocations: 1024,
  usedAllocations: 687,
};
