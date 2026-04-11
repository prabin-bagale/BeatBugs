'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  ArrowLeft,
  Eye,
  ShoppingCart,
  Music,
  BadgeCheck,
  Shield,
  Download,
  Share2,
  Heart,
  Loader2,
  Crown,
  Diamond,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BeatCard } from './beat-card';
import { useAppStore, type Beat } from '@/stores/beatbazaar-store';
import { getAudioElement, formatTime } from '@/lib/audio-player';

const LICENSE_TIERS = [
  {
    id: 'basic' as const,
    name: 'Basic Lease',
    price: (beat: Beat) => beat.basicPrice,
    icon: Shield,
    color: 'emerald',
    borderClass: 'border-emerald-500/50 bg-emerald-500/5',
    selectedClass: 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30',
    features: [
      'Non-exclusive license',
      'YouTube & TikTok usage',
      'Up to 10,000 streams',
      '1 year validity',
      'MP3 file included',
    ],
  },
  {
    id: 'premium' as const,
    name: 'Premium Lease',
    price: (beat: Beat) => beat.premiumPrice,
    icon: Crown,
    color: 'amber',
    borderClass: 'border-amber-500/50 bg-amber-500/5',
    selectedClass: 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30',
    features: [
      'Non-exclusive license',
      'All platforms + Spotify',
      'Up to 100,000 streams',
      'Lifetime validity',
      'MP3 + WAV files',
    ],
  },
  {
    id: 'exclusive' as const,
    name: 'Exclusive',
    price: (beat: Beat) => beat.exclusivePrice,
    icon: Diamond,
    color: 'purple',
    borderClass: 'border-purple-500/50 bg-purple-500/5',
    selectedClass: 'border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/30',
    features: [
      'Exclusive ownership',
      'All platforms + sync licensing',
      'Unlimited streams',
      'Lifetime validity',
      'Stems + WAV + MP3',
    ],
  },
];

export function BeatDetailView() {
  const { selectedBeat, goBack, playBeat, pauseBeat, currentlyPlaying, isPlaying, startCheckout, showToast, selectBeat, selectProducer, updateAudioTime } = useAppStore();
  const [beat, setBeat] = useState<Beat | null>(selectedBeat);
  const [moreBeats, setMoreBeats] = useState<Beat[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<'basic' | 'premium' | 'exclusive'>('basic');
  const [loading, setLoading] = useState(true);
  const [localProgress, setLocalProgress] = useState(0);
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [localDuration, setLocalDuration] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  const isCurrentBeat = currentlyPlaying?.id === beat?.id;
  const beatIsPlaying = isCurrentBeat && isPlaying;
  const hasAudio = !!beat?.audioPreviewUrl;

  // Sync progress from the global audio player when this beat is playing
  useEffect(() => {
    if (beatIsPlaying) {
      const tick = () => {
        const el = getAudioElement();
        if (isCurrentBeat && el.duration && isFinite(el.duration)) {
          const ct = el.currentTime;
          const dur = el.duration;
          setLocalCurrentTime(ct);
          setLocalDuration(dur);
          setLocalProgress((ct / dur) * 100);
        }
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [beatIsPlaying, isCurrentBeat]);

  useEffect(() => {
    setLocalProgress(0);
    setLocalCurrentTime(0);
    setLocalDuration(0);
  }, [currentlyPlaying?.id]);

  useEffect(() => {
    async function fetchBeat() {
      if (!selectedBeat?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/beats/${selectedBeat.id}`);
        const data = await res.json();
        if (data.beat) {
          setBeat(data.beat);
          if (data.beat.producerId) {
            const moreRes = await fetch(`/api/beats?producerId=${data.beat.producerId}&limit=5`);
            const moreData = await moreRes.json();
            setMoreBeats(
              (moreData.beats || []).filter((b: Beat) => b.id !== data.beat.id).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch beat:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBeat();
  }, [selectedBeat?.id]);

  const handlePlay = () => {
    if (!beat) return;
    if (!hasAudio) {
      showToast('No audio file uploaded for this beat', 'info');
      return;
    }
    if (isCurrentBeat && isPlaying) {
      pauseBeat();
    } else {
      playBeat(beat);
    }
  };

  const handleLocalSeek = (e: React.MouseEvent) => {
    if (!beat || !hasAudio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    const audio = getAudioElement();
    if (audio.duration && isFinite(audio.duration)) {
      const seekTime = (percent / 100) * audio.duration;
      audio.currentTime = seekTime;
      setLocalCurrentTime(seekTime);
      setLocalProgress(percent);
    }
  };

  const handleBuy = () => {
    if (!beat) return;
    if (selectedLicense === 'exclusive' && beat.exclusiveSold) {
      showToast('Exclusive license already sold!', 'error');
      return;
    }
    startCheckout(beat, selectedLicense);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-secondary rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary rounded animate-pulse w-3/4" />
            <div className="h-4 bg-secondary rounded animate-pulse w-1/2" />
            <div className="h-4 bg-secondary rounded animate-pulse w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!beat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={goBack}
        className="mb-6 text-muted-foreground hover:text-white -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Cover Art */}
        <div className="lg:col-span-2">
          <div className="relative aspect-square rounded-xl overflow-hidden group">
            <img
              src={beat.coverUrl}
              alt={beat.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Play button overlay */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
            >
              {beatIsPlaying ? (
                <Pause className="w-7 h-7 text-black fill-black" />
              ) : (
                <Play className="w-7 h-7 text-black fill-black ml-1" />
              )}
            </motion.button>

            {/* Playing indicator */}
            {beatIsPlaying && (
              <div className="absolute bottom-6 left-6 flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 bg-emerald-500 rounded-full wave-bar" />
                ))}
              </div>
            )}

            {/* No audio badge */}
            {!hasAudio && (
              <div className="absolute top-3 right-3 bg-amber-500/90 text-black text-[10px] font-bold px-2 py-1 rounded-md">
                No Audio
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div
            className="mt-3 px-1 cursor-pointer group"
            onClick={handleLocalSeek}
          >
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden relative">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-100"
                style={{ width: `${localProgress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${localProgress}%`, transform: `translateX(-50%) translateY(-50%)` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground font-mono">
                {formatTime(localCurrentTime)}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {formatTime(localDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Beat Info */}
        <div className="lg:col-span-3">
          {/* Title & Producer */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{beat.title}</h1>
                <button
                  onClick={() => beat.producer && selectProducer(beat.producer.id)}
                  className="flex items-center gap-2 mt-2 hover:text-emerald-400 transition-colors"
                >
                  {beat.producer?.avatar ? (
                    <img src={beat.producer.avatar} alt={beat.producer.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted" />
                  )}
                  <span className="text-sm text-muted-foreground">{beat.producer?.name}</span>
                  {beat.producer?.verified && (
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  )}
                </button>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-rose-500">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{beat.plays.toLocaleString()} plays</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShoppingCart className="w-4 h-4" />
              <span>{beat.sales} sales</span>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500">
              {beat.genre}
            </Badge>
            {beat.mood && (
              <Badge variant="outline" className="border-border/50 text-muted-foreground">
                {beat.mood}
              </Badge>
            )}
            {hasAudio && (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <Music className="w-3 h-3 mr-1" />
                Audio Ready
              </Badge>
            )}
          </div>

          {/* Beat Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'BPM', value: beat.bpm },
              { label: 'Key', value: beat.key },
              { label: 'Status', value: beat.exclusiveSold ? 'Exclusive Sold' : beat.status },
              { label: 'Tags', value: beat.tags?.replace(/[\[\]"']/g, '') || 'None' },
            ].map((item) => (
              <div key={item.label} className="bg-secondary/50 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-medium truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {beat.description && (
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{beat.description}</p>
          )}

          {/* License Tiers */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Select License</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LICENSE_TIERS.map((tier) => {
                const TierIcon = tier.icon;
                const isSelected = selectedLicense === tier.id;
                const price = tier.price(beat);
                const isSold = tier.id === 'exclusive' && beat.exclusiveSold;

                return (
                  <Card
                    key={tier.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSold
                        ? 'opacity-50 pointer-events-none border-border/50'
                        : isSelected
                        ? tier.selectedClass
                        : tier.borderClass
                    }`}
                    onClick={() => !isSold && setSelectedLicense(tier.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TierIcon className={`w-4 h-4 ${
                            tier.color === 'emerald' ? 'text-emerald-500' :
                            tier.color === 'amber' ? 'text-amber-500' :
                            'text-purple-500'
                          }`} />
                          <span className="text-sm font-semibold">{tier.name}</span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <p className="text-xl font-bold mb-3">
                        NPR {price.toLocaleString()}
                      </p>

                      <ul className="space-y-1.5">
                        {tier.features.map((feature, fi) => (
                          <li key={fi} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {isSold && (
                        <Badge className="mt-3 w-full justify-center bg-destructive/10 text-destructive border-destructive/20">
                          Sold
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Buy Button */}
          <Button
            size="lg"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 px-8"
            onClick={handleBuy}
          >
            <Download className="w-5 h-5 mr-2" />
            Buy Now — NPR {
              selectedLicense === 'basic'
                ? beat.basicPrice.toLocaleString()
                : selectedLicense === 'premium'
                ? beat.premiumPrice.toLocaleString()
                : beat.exclusivePrice.toLocaleString()
            }
          </Button>
        </div>
      </div>

      {/* Producer Section */}
      {beat.producer && (
        <section className="mt-16">
          <Separator className="mb-8 bg-border/50" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <img
              src={beat.producer.avatar || `https://picsum.photos/seed/${beat.producer.id}/200/200`}
              alt={beat.producer.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{beat.producer.name}</h3>
                {beat.producer.verified && (
                  <BadgeCheck className="w-5 h-5 text-emerald-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {beat.producer.bio || 'Music Producer from Nepal'}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-border/50"
              onClick={() => selectProducer(beat.producer!.id)}
            >
              View Profile
            </Button>
          </div>
        </section>
      )}

      {/* More from Producer */}
      {moreBeats.length > 0 && (
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-6">More from {beat.producer?.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {moreBeats.map((b, i) => (
              <BeatCard key={b.id} beat={b} index={i} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
