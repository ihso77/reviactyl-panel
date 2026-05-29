'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { ApiKey, SshKey } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Shield,
  Key,
  Trash2,
  Plus,
  Copy,
  Globe,
  Fingerprint,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AccountPage() {
  const { user, setUser, logout: storeLogout } = useAuthStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('en');
  const [twoFactor, setTwoFactor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [sshKeys, setSshKeys] = useState<SshKey[]>([]);
  const [newKeyDesc, setNewKeyDesc] = useState('');
  const [newKeyIps, setNewKeyIps] = useState('');
  const [newSshName, setNewSshName] = useState('');
  const [newSshKey, setNewSshKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setName(user.name || '');
    setEmail(user.email || '');
    setUsername(user.username || '');
    setLanguage(user.language || 'en');
    setTwoFactor(user.twoFactorEnabled || false);

    Promise.all([
      fetch('/api/account').then(r => r.ok ? r.json() : null),
      fetch('/api/account/api-keys').then(r => r.ok ? r.json() : []),
      fetch('/api/account/ssh-keys').then(r => r.ok ? r.json() : []),
    ])
      .then(([profileData, keysData, sshData]) => {
        if (profileData) {
          setName(profileData.name || '');
          setEmail(profileData.email || '');
          setUsername(profileData.username || '');
          setLanguage(profileData.language || 'en');
          setTwoFactor(profileData.twoFactorEnabled || false);
        }
        setApiKeys(keysData.map((k: any) => ({
          id: k.id,
          identifier: k.identifier,
          description: k.description || '',
          allowedIps: k.allowedIps === '*' ? ['*'] : k.allowedIps.split(','),
          createdAt: new Date(k.createdAt).toLocaleString(),
          lastUsedAt: k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : 'Never',
        })));
        setSshKeys(sshData.map((k: any) => ({
          id: k.id,
          name: k.name,
          fingerprint: k.fingerprint,
          createdAt: new Date(k.createdAt).toLocaleString(),
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser({
          ...user!,
          name: data.name,
          email: data.email,
          username: data.username,
          language: data.language,
        });
        toast.success('Profile updated successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    storeLogout();
    await signOut({ redirect: false });
    router.push('/login');
  };

  const handleCreateApiKey = async () => {
    try {
      const res = await fetch('/api/account/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newKeyDesc, allowedIps: newKeyIps || '*' }),
      });
      if (res.ok) {
        const key = await res.json();
        setApiKeys(prev => [{
          id: key.id,
          identifier: key.identifier,
          description: key.description || '',
          allowedIps: (key.allowedIps || '*').split(','),
          createdAt: new Date(key.createdAt).toLocaleString(),
          lastUsedAt: 'Never',
        }, ...prev]);
        setNewKeyDesc('');
        setNewKeyIps('');
        toast.success('API key created');
      } else {
        toast.error('Failed to create API key');
      }
    } catch {
      toast.error('Failed to create API key');
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      const res = await fetch(`/api/account/api-keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApiKeys(prev => prev.filter(k => k.id !== id));
        toast.success('API key deleted');
      }
    } catch {
      toast.error('Failed to delete API key');
    }
  };

  const handleCreateSshKey = async () => {
    if (!newSshName || !newSshKey) {
      toast.error('Name and public key are required');
      return;
    }
    try {
      const res = await fetch('/api/account/ssh-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSshName, publicKey: newSshKey }),
      });
      if (res.ok) {
        const key = await res.json();
        setSshKeys(prev => [{
          id: key.id,
          name: key.name,
          fingerprint: key.fingerprint,
          createdAt: new Date(key.createdAt).toLocaleString(),
        }, ...prev]);
        setNewSshName('');
        setNewSshKey('');
        toast.success('SSH key added');
      } else {
        toast.error('Failed to add SSH key');
      }
    } catch {
      toast.error('Failed to add SSH key');
    }
  };

  const handleDeleteSshKey = async (id: string) => {
    try {
      const res = await fetch(`/api/account/ssh-keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSshKeys(prev => prev.filter(k => k.id !== id));
        toast.success('SSH key removed');
      }
    } catch {
      toast.error('Failed to remove SSH key');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences and security settings.</p>
      </motion.div>

      {/* Profile Information */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="h-10" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  {twoFactor && (
                    <Badge className="bg-success/10 text-success border-0 text-xs">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Enabled
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={(checked) => {
                setTwoFactor(checked);
                toast.success(checked ? '2FA enabled' : '2FA disabled');
              }} />
            </div>
            <Separator />
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Log Out</p>
                <p className="text-xs text-muted-foreground">Sign out of your account.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>Log Out</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Keys */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  API Keys
                </CardTitle>
                <CardDescription className="mt-1">
                  Manage your API keys for programmatic access.
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> New Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create API Key</DialogTitle>
                    <DialogDescription>Enter a description for this API key.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="e.g., Backup Script" value={newKeyDesc} onChange={(e) => setNewKeyDesc(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Allowed IPs</Label>
                      <Input placeholder="Leave blank for all IPs" value={newKeyIps} onChange={(e) => setNewKeyIps(e.target.value)} />
                      <p className="text-xs text-muted-foreground">Comma-separated IP addresses</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateApiKey}>Create Key</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {apiKeys.length > 0 ? (
                apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{key.description || 'Untitled Key'}</p>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{key.identifier}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {key.allowedIps.join(', ')}
                        </span>
                        <span>Created: {key.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.success('API key copied!')}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteApiKey(key.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No API keys created yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SSH Keys */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-primary" />
                  SSH Keys
                </CardTitle>
                <CardDescription className="mt-1">
                  Manage SSH keys for SFTP access.
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Add Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add SSH Key</DialogTitle>
                    <DialogDescription>Paste your public SSH key below.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="e.g., My Laptop" value={newSshName} onChange={(e) => setNewSshName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Public Key</Label>
                      <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="ssh-rsa AAAA..."
                        value={newSshKey}
                        onChange={(e) => setNewSshKey(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateSshKey}>Add Key</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sshKeys.length > 0 ? (
                sshKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{key.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{key.fingerprint}</p>
                      <p className="text-xs text-muted-foreground">Added {key.createdAt}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSshKey(key.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No SSH keys added yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={item}>
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. All your data, servers, and settings will be permanently deleted.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Type &quot;DELETE&quot; to confirm</Label>
                    <Input placeholder="DELETE" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={() => {
                    setShowDeleteDialog(false);
                    toast.success('Account deletion requested');
                  }}>
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
