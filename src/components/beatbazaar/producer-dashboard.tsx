'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Music2,
  ShoppingCart,
  TrendingUp,
  Upload,
  Plus,
  Loader2,
  Eye,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppStore, type Beat, type Order } from '@/stores/beatbazaar-store';

const GENRES = [
  'NepHop', 'Lo-Fi', 'Drill', 'Trap', 'Folk Fusion', 'R&B', 'Afrobeat', 'Hip-Hop',
];

const MOODS = [
  'Chill', 'Dark', 'Energetic', 'Melancholic', 'Aggressive', 'Happy', 'Romantic', 'Epic',
];

const KEYS = [
  'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm',
];

interface DashboardData {
  producer: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    verified?: boolean;
    role: string;
  };
  stats: {
    totalBeats: number;
    totalSales: number;
    totalEarnings: number;
  };
  recentOrders: (Order & {
    beat?: {
      id: string;
      title: string;
      coverUrl: string;
      genre: string;
      basicPrice: number;
      premiumPrice: number;
      exclusivePrice: number;
      producer?: { id: string; name: string; avatar?: string };
    };
    buyer?: { id: string; name: string; avatar?: string };
  })[];
  myBeats: Beat[];
}

export function ProducerDashboard() {
  const { currentUser } = useAppStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    title: '',
    genre: '',
    bpm: '',
    key: 'Cm',
    mood: '',
    basicPrice: '999',
    premiumPrice: '2999',
    exclusivePrice: '9999',
  });

  useEffect(() => {
    if (!currentUser?.id) return;
    async function fetchDashboard() {
      try {
        const res = await fetch(`/api/dashboard?producerId=${currentUser.id}`);
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [currentUser?.id]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const res = await fetch('/api/beats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          bpm: parseInt(uploadForm.bpm),
          basicPrice: parseFloat(uploadForm.basicPrice),
          premiumPrice: parseFloat(uploadForm.premiumPrice),
          exclusivePrice: parseFloat(uploadForm.exclusivePrice),
          producerId: currentUser?.id,
          coverUrl: `https://picsum.photos/seed/${uploadForm.title.replace(/\s/g, '')}/600/600`,
          audioPreviewUrl: '#',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        useAppStore.getState().showToast('Beat uploaded successfully!', 'success');
        setUploadOpen(false);
        setUploadForm({
          title: '',
          genre: '',
          bpm: '',
          key: 'Cm',
          mood: '',
          basicPrice: '999',
          premiumPrice: '2999',
          exclusivePrice: '9999',
        });
        // Refresh dashboard
        const dashRes = await fetch(`/api/dashboard?producerId=${currentUser?.id}`);
        setDashboard(await dashRes.json());
      } else {
        useAppStore.getState().showToast('Failed to upload beat', 'error');
      }
    } catch {
      useAppStore.getState().showToast('Network error', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="h-8 bg-secondary rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card border-border/50">
              <CardContent className="p-6 animate-pulse">
                <div className="h-4 bg-secondary rounded w-24 mb-2" />
                <div className="h-8 bg-secondary rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const { stats, recentOrders, myBeats } = dashboard;
  const avgPrice = myBeats.length > 0
    ? Math.round(myBeats.reduce((a, b) => a + b.basicPrice, 0) / myBeats.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Producer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your beats and track sales</p>
        </div>

        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Upload Beat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card border-border/50 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload New Beat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Beat Title</Label>
                <Input
                  placeholder="Enter beat title"
                  className="bg-secondary border-border/50"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Genre</Label>
                  <Select value={uploadForm.genre} onValueChange={(v) => setUploadForm({ ...uploadForm, genre: v })}>
                    <SelectTrigger className="bg-secondary border-border/50">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      {GENRES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">BPM</Label>
                  <Input
                    type="number"
                    placeholder="140"
                    className="bg-secondary border-border/50"
                    value={uploadForm.bpm}
                    onChange={(e) => setUploadForm({ ...uploadForm, bpm: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Key</Label>
                  <Select value={uploadForm.key} onValueChange={(v) => setUploadForm({ ...uploadForm, key: v })}>
                    <SelectTrigger className="bg-secondary border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      {KEYS.map((k) => (
                        <SelectItem key={k} value={k}>{k}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Mood</Label>
                  <Select value={uploadForm.mood} onValueChange={(v) => setUploadForm({ ...uploadForm, mood: v })}>
                    <SelectTrigger className="bg-secondary border-border/50">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      {MOODS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-3">
                <Label className="text-sm font-semibold">License Pricing (NPR)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Basic</Label>
                    <Input
                      type="number"
                      placeholder="999"
                      className="bg-secondary border-border/50"
                      value={uploadForm.basicPrice}
                      onChange={(e) => setUploadForm({ ...uploadForm, basicPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Premium</Label>
                    <Input
                      type="number"
                      placeholder="2999"
                      className="bg-secondary border-border/50"
                      value={uploadForm.premiumPrice}
                      onChange={(e) => setUploadForm({ ...uploadForm, premiumPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Exclusive</Label>
                    <Input
                      type="number"
                      placeholder="9999"
                      className="bg-secondary border-border/50"
                      value={uploadForm.exclusivePrice}
                      onChange={(e) => setUploadForm({ ...uploadForm, exclusivePrice: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload Beat
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Beats', value: stats.totalBeats, icon: Music2, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Total Sales', value: stats.totalSales, icon: ShoppingCart, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Total Earnings', value: `NPR ${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-purple-500 bg-purple-500/10' },
          { label: 'Avg. Price', value: `NPR ${avgPrice.toLocaleString()}`, icon: TrendingUp, color: 'text-teal-500 bg-teal-500/10' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-card border-border/50 mb-10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Beat Title</TableHead>
                    <TableHead className="text-muted-foreground">Buyer</TableHead>
                    <TableHead className="text-muted-foreground">License</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.slice(0, 10).map((order) => (
                    <TableRow key={order.id} className="border-border/30">
                      <TableCell className="font-medium text-sm">
                        {order.beat?.title || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.buyer?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            order.licenseType === 'exclusive'
                              ? 'border-purple-500/30 text-purple-500'
                              : order.licenseType === 'premium'
                              ? 'border-amber-500/30 text-amber-500'
                              : 'border-emerald-500/30 text-emerald-500'
                          }
                        >
                          {order.licenseType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        NPR {order.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Beats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">My Beats</h2>
        <div className="overflow-x-auto">
          <Table className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground w-16"></TableHead>
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Genre</TableHead>
                <TableHead className="text-muted-foreground">BPM</TableHead>
                <TableHead className="text-muted-foreground flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Plays</TableHead>
                <TableHead className="text-muted-foreground flex items-center gap-1"><ShoppingCart className="w-3.5 h-3.5" /> Sales</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myBeats.map((beat) => (
                <TableRow key={beat.id} className="border-border/30">
                  <TableCell>
                    <img src={beat.coverUrl} alt={beat.title} className="w-10 h-10 rounded-md object-cover" />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{beat.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border/50 text-muted-foreground text-xs">
                      {beat.genre}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{beat.bpm}</TableCell>
                  <TableCell className="text-sm">{beat.plays}</TableCell>
                  <TableCell className="text-sm">{beat.sales}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        beat.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : beat.status === 'sold_exclusive'
                          ? 'bg-purple-500/10 text-purple-500'
                          : 'bg-secondary text-muted-foreground'
                      }
                    >
                      {beat.status === 'active' ? 'Active' : beat.status === 'sold_exclusive' ? 'Exclusive Sold' : beat.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}
