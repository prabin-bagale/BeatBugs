'use client';

import { useState, useEffect, useRef } from 'react';
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
  ImageIcon,
  Music,
  X,
  AlertCircle,
  CheckCircle2,
  Home,
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
  'Chill', 'Dark', 'Energetic', 'Melancholic', 'Aggressive', 'Romantic', 'Mysterious', 'Uplifting',
];

const KEYS = [
  'Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m',
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
  const { currentUser, setView, openAuth, showToast } = useAppStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    title: '',
    genre: '',
    bpm: '',
    key: 'Cm',
    mood: '',
    description: '',
    tags: '',
    basicPrice: '999',
    premiumPrice: '2999',
    exclusivePrice: '9999',
  });

  // File states
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Audio preview player
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

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

  // Cleanup audio preview URL and audio element on unmount
  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, [audioPreviewUrl]);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac', 'audio/webm'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|aac|flac|webm|m4a)$/i)) {
      showToast('Please upload an audio file (MP3, WAV, OGG, AAC, FLAC)', 'error');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showToast('Audio file must be under 50MB', 'error');
      return;
    }

    setAudioFile(file);
    setFieldErrors(prev => ({ ...prev, audio: '' }));
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    const url = URL.createObjectURL(file);
    setAudioPreviewUrl(url);

    // Stop any currently playing preview
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload an image file (JPG, PNG, WebP)', 'error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Cover image must be under 10MB', 'error');
      return;
    }

    setCoverFile(file);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(URL.createObjectURL(file));
  };

  const togglePreviewPlay = () => {
    if (!audioPreviewUrl) return;

    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(audioPreviewUrl);
      previewAudioRef.current.addEventListener('ended', () => setIsPreviewPlaying(false));
    }

    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      previewAudioRef.current.play();
      setIsPreviewPlaying(true);
    }
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreviewUrl('');
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPreviewPlaying(false);
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const removeCoverFile = () => {
    setCoverFile(null);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl('');
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!audioFile) errors.audio = 'Audio file is required';
    if (!uploadForm.title.trim()) errors.title = 'Beat title is required';
    if (!uploadForm.genre) errors.genre = 'Please select a genre';
    if (!uploadForm.bpm || parseInt(uploadForm.bpm) < 30 || parseInt(uploadForm.bpm) > 300) {
      errors.bpm = 'BPM must be between 30 and 300';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side validation
    if (!validateForm()) {
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) showToast(firstError, 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioFile!);
      if (coverFile) formData.append('cover', coverFile);
      formData.append('title', uploadForm.title.trim());
      formData.append('description', uploadForm.description.trim());
      formData.append('genre', uploadForm.genre);
      formData.append('bpm', uploadForm.bpm);
      formData.append('key', uploadForm.key);
      formData.append('mood', uploadForm.mood);
      formData.append('tags', uploadForm.tags || '[]');
      formData.append('basicPrice', uploadForm.basicPrice);
      formData.append('premiumPrice', uploadForm.premiumPrice);
      formData.append('exclusivePrice', uploadForm.exclusivePrice);
      formData.append('producerId', currentUser!.id);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Beat uploaded successfully! Check Recently Added on the home page.', 'success');
        setUploadOpen(false);
        resetForm();
        // Refresh dashboard
        try {
          const dashRes = await fetch(`/api/dashboard?producerId=${currentUser!.id}`);
          setDashboard(await dashRes.json());
        } catch {}
        // Navigate to home to see the beat in Recently Added
        setTimeout(() => setView('home'), 600);
      } else {
        showToast(data.error || 'Failed to upload beat', 'error');
        if (data.error?.includes('Producer')) {
          setFieldErrors(prev => ({ ...prev, producer: data.error }));
        }
      }
    } catch {
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setUploadForm({
      title: '',
      genre: '',
      bpm: '',
      key: 'Cm',
      mood: '',
      description: '',
      tags: '',
      basicPrice: '999',
      premiumPrice: '2999',
      exclusivePrice: '9999',
    });
    setFieldErrors({});
    removeAudioFile();
    removeCoverFile();
  };

  // --- Auth gate ---
  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-4 py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <Music2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Sign in to Continue</h2>
        <p className="text-muted-foreground mb-6">You need a producer account to access the dashboard and upload beats.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => openAuth('login')}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
          >
            Log In
          </Button>
          <Button
            variant="outline"
            onClick={() => openAuth('signup')}
            className="border-border/50"
          >
            Create Producer Account
          </Button>
        </div>
      </motion.div>
    );
  }

  if (currentUser.role !== 'producer') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-4 py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Producer Account Required</h2>
        <p className="text-muted-foreground mb-6">Only producers can upload beats. Your current account is a buyer account.</p>
        <Button onClick={() => setView('home')} variant="outline" className="border-border/50">
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </motion.div>
    );
  }

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

        <Dialog open={uploadOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setUploadOpen(open);
        }}>
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

              {/* Audio File Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Music className="w-4 h-4 text-emerald-500" />
                  Audio File <span className="text-destructive">*</span>
                </Label>
                {!audioFile ? (
                  <label className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all group ${
                    fieldErrors.audio
                      ? 'border-destructive/50 hover:border-destructive bg-destructive/5'
                      : 'border-border/70 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      fieldErrors.audio ? 'bg-destructive/10' : 'bg-secondary group-hover:bg-emerald-500/10'
                    }`}>
                      <Upload className={`w-5 h-5 transition-colors ${
                        fieldErrors.audio ? 'text-destructive' : 'text-muted-foreground group-hover:text-emerald-500'
                      }`} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to upload audio</p>
                      <p className="text-xs text-muted-foreground mt-0.5">MP3, WAV, OGG, AAC, FLAC (max 50MB)</p>
                    </div>
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleAudioFileChange}
                    />
                  </label>
                ) : (
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Music2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{audioFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(audioFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={togglePreviewPlay}
                        >
                          {isPreviewPlaying ? (
                            <span className="flex gap-0.5 items-end h-4">
                              {[...Array(3)].map((_, i) => (
                                <span key={i} className="w-0.5 bg-emerald-500 rounded-full wave-bar" />
                              ))}
                            </span>
                          ) : (
                            <span className="text-xs text-emerald-500 font-semibold">▶</span>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={removeAudioFile}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {fieldErrors.audio && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.audio}
                  </p>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  Cover Image <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                {!coverFile ? (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border/70 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                      <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload cover art</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WebP (max 10MB)</p>
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <img
                      src={coverPreviewUrl}
                      alt="Cover preview"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{coverFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(coverFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={removeCoverFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Separator className="bg-border/50" />

              {/* Beat Details */}
              <div className="space-y-2">
                <Label className="text-sm">Beat Title <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Enter beat title"
                  className={`bg-secondary ${fieldErrors.title ? 'border-destructive/50 focus:border-destructive' : 'border-border/50'}`}
                  value={uploadForm.title}
                  onChange={(e) => {
                    setUploadForm({ ...uploadForm, title: e.target.value });
                    if (e.target.value.trim()) setFieldErrors(prev => ({ ...prev, title: '' }));
                  }}
                />
                {fieldErrors.title && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Genre <span className="text-destructive">*</span></Label>
                  <Select value={uploadForm.genre} onValueChange={(v) => {
                    setUploadForm({ ...uploadForm, genre: v });
                    setFieldErrors(prev => ({ ...prev, genre: '' }));
                  }}>
                    <SelectTrigger className={`bg-secondary ${fieldErrors.genre ? 'border-destructive/50' : 'border-border/50'}`}>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      {GENRES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.genre && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.genre}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">BPM <span className="text-destructive">*</span></Label>
                  <Input
                    type="number"
                    placeholder="140"
                    min={30}
                    max={300}
                    className={`bg-secondary ${fieldErrors.bpm ? 'border-destructive/50 focus:border-destructive' : 'border-border/50'}`}
                    value={uploadForm.bpm}
                    onChange={(e) => {
                      setUploadForm({ ...uploadForm, bpm: e.target.value });
                      setFieldErrors(prev => ({ ...prev, bpm: '' }));
                    }}
                  />
                  {fieldErrors.bpm && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.bpm}
                    </p>
                  )}
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

              <div className="space-y-2">
                <Label className="text-sm">Description</Label>
                <textarea
                  className="w-full bg-secondary border border-border/50 rounded-md p-3 text-sm resize-none focus:outline-none focus:border-emerald-500/50 min-h-[60px]"
                  placeholder="Describe your beat..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Tags (comma separated)</Label>
                <Input
                  placeholder="e.g. nephop, dark, 808, trap"
                  className="bg-secondary border-border/50"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                />
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
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold h-11"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Beat
                  </>
                )}
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
            <p className="text-sm text-muted-foreground py-8 text-center">No orders yet. Upload beats to start selling!</p>
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
        {myBeats.length === 0 ? (
          <Card className="bg-card border-border/50 p-8 text-center">
            <Music2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No beats uploaded yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload your first beat to start selling!</p>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
              onClick={() => setUploadOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Beat
            </Button>
          </Card>
        ) : (
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
                  <TableHead className="text-muted-foreground">Audio</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myBeats.map((beat) => (
                  <TableRow key={beat.id} className="border-border/30 cursor-pointer hover:bg-secondary/50" onClick={() => useAppStore.getState().selectBeat(beat)}>
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
                      {beat.audioPreviewUrl ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge>
                      ) : (
                        <Badge className="bg-secondary text-muted-foreground border-border/50 text-[10px]">
                          No audio
                        </Badge>
                      )}
                    </TableCell>
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
        )}
      </div>
    </motion.div>
  );
}
