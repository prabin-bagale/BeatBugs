'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Music2,
  TrendingUp,
  Users,
  Headphones,
  Zap,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BeatCard } from './beat-card';
import { useAppStore, type Beat, type User } from '@/stores/beatbazaar-store';

/* Visual flow steps for How It Works */
const FLOW_STEPS = [
  {
    icon: '🎹',
    label: 'Create',
    sub: 'Producer makes a beat',
    color: 'from-violet-500/20 to-purple-600/20',
    ring: 'ring-violet-500/30',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    icon: '🚀',
    label: 'Upload',
    sub: 'Beat goes live instantly',
    color: 'from-emerald-500/20 to-teal-600/20',
    ring: 'ring-emerald-500/30',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: '🔍',
    label: 'Discover',
    sub: 'Buyers find & preview',
    color: 'from-sky-500/20 to-cyan-600/20',
    ring: 'ring-sky-500/30',
    glow: 'rgba(14,165,233,0.15)',
  },
  {
    icon: '💳',
    label: 'License',
    sub: 'Pick tier & pay securely',
    color: 'from-amber-500/20 to-orange-600/20',
    ring: 'ring-amber-500/30',
    glow: 'rgba(245,158,11,0.15)',
  },
  {
    icon: '📥',
    label: 'Download',
    sub: 'Get beat & license file',
    color: 'from-rose-500/20 to-pink-600/20',
    ring: 'ring-rose-500/30',
    glow: 'rgba(244,63,94,0.15)',
  },
  {
    icon: '💰',
    label: 'Earn',
    sub: 'Producer gets paid',
    color: 'from-emerald-500/20 to-green-600/20',
    ring: 'ring-emerald-500/30',
    glow: 'rgba(16,185,129,0.2)',
  },
];

/* Floating music symbols for the hero background */
type MusicSymbol = {
  symbol: string;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  color: string;
  floatRange: number;
};

const MUSIC_SYMBOLS: MusicSymbol[] = [
  { symbol: '♪', size: 32, x: 5, y: 15, delay: 0, duration: 6, color: 'text-emerald-400', floatRange: 18 },
  { symbol: '♫', size: 28, x: 15, y: 75, delay: 1.5, duration: 7, color: 'text-teal-400', floatRange: 14 },
  { symbol: '🎵', size: 26, x: 85, y: 20, delay: 0.8, duration: 8, color: '', floatRange: 20 },
  { symbol: '🎶', size: 30, x: 90, y: 60, delay: 2.2, duration: 7, color: '', floatRange: 16 },
  { symbol: '♩', size: 24, x: 75, y: 80, delay: 1.2, duration: 6.5, color: 'text-emerald-300', floatRange: 12 },
  { symbol: '♬', size: 36, x: 8, y: 50, delay: 3, duration: 9, color: 'text-teal-300', floatRange: 22 },
  { symbol: '🎵', size: 22, x: 70, y: 10, delay: 0.5, duration: 7.5, color: '', floatRange: 15 },
  { symbol: '♪', size: 20, x: 45, y: 5, delay: 2.8, duration: 6, color: 'text-emerald-500', floatRange: 10 },
  { symbol: '🎼', size: 24, x: 35, y: 88, delay: 1.8, duration: 8, color: '', floatRange: 16 },
  { symbol: '♫', size: 34, x: 93, y: 40, delay: 0.3, duration: 7, color: 'text-teal-400', floatRange: 20 },
  { symbol: '♪', size: 18, x: 25, y: 30, delay: 4, duration: 6.5, color: 'text-emerald-400', floatRange: 10 },
  { symbol: '🔊', size: 22, x: 55, y: 3, delay: 1, duration: 7.5, color: '', floatRange: 14 },
  { symbol: '♬', size: 26, x: 80, y: 50, delay: 2.5, duration: 8, color: 'text-teal-300', floatRange: 18 },
  { symbol: '🎤', size: 20, x: 2, y: 80, delay: 3.5, duration: 7, color: '', floatRange: 12 },
  { symbol: '♪', size: 28, x: 60, y: 85, delay: 0.7, duration: 6, color: 'text-emerald-500', floatRange: 15 },
  { symbol: '🎧', size: 22, x: 42, y: 70, delay: 2, duration: 8.5, color: '', floatRange: 14 },
  { symbol: '♫', size: 20, x: 18, y: 8, delay: 1.3, duration: 7, color: 'text-teal-500', floatRange: 12 },
  { symbol: '🎹', size: 20, x: 95, y: 85, delay: 3.2, duration: 9, color: '', floatRange: 10 },
  { symbol: '♪', size: 24, x: 50, y: 42, delay: 0.2, duration: 6.5, color: 'text-emerald-300', floatRange: 16 },
  { symbol: '♬', size: 30, x: 30, y: 55, delay: 1.7, duration: 7.5, color: 'text-teal-400', floatRange: 18 },
];

function FloatingMusicSymbol({ symbol, size, x, y, delay, duration, color, floatRange }: MusicSymbol) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 0.5, 0.7, 0.5, 0.3, 0.5, 0],
        scale: [0, 1.4, 1, 1.2, 0.9, 1.1, 0],
        y: [0, -floatRange, floatRange * 0.5, -floatRange * 0.7, floatRange * 0.3, -floatRange * 0.4, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <span
        className={`font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] ${color}`}
        style={{ fontSize: size, lineHeight: 1 }}
      >
        {symbol}
      </span>
    </motion.div>
  );
}

/* Pulsing equalizer bars */
function EqualizerBars() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-[3px] h-8 pointer-events-none">
      {[0.4, 0.7, 1, 0.6, 0.8, 0.5, 0.9, 0.3, 0.7, 0.55, 0.85, 0.45, 0.65, 0.35, 0.75].map((maxH, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-emerald-500/25"
          animate={{
            height: [4, maxH * 28 + 4, 4],
          }}
          transition={{
            duration: 1.2 + (i * 0.1),
            delay: i * 0.08,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function HomeView() {
  const { setView, selectBeat, selectProducer, setSelectedGenre, setSearchQuery, currentUser, openAuth, showToast } = useAppStore();
  const [featuredBeats, setFeaturedBeats] = useState<Beat[]>([]);
  const [recentBeats, setRecentBeats] = useState<Beat[]>([]);
  const [topProducers, setTopProducers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double fetch in StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchData() {
      try {
        const [beatsRes, recentRes, producersRes] = await Promise.all([
          fetch('/api/beats?sortBy=popular&limit=6'),
          fetch('/api/beats?sortBy=newest&limit=12'),
          fetch('/api/auth?role=producer'),
        ]);

        const beatsData = await beatsRes.json();
        const recentData = await recentRes.json();
        const producersData = await producersRes.json();

        setFeaturedBeats(beatsData.beats || []);
        setRecentBeats(recentData.beats || []);
        setTopProducers((producersData.users || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef) return;
    const scrollAmount = 320;
    carouselRef.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />

        {/* Floating music symbols */}
        {MUSIC_SYMBOLS.map((sym, i) => (
          <FloatingMusicSymbol key={i} {...sym} />
        ))}

        {/* Pulsing equalizer bars at bottom */}
        <EqualizerBars />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-xs font-semibold">
              <Zap className="w-3 h-3 mr-1.5" />
              Welcome to BeatBugs
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-3">
              Find Your Next
              <br />
              <span className="gradient-text">Hit Beat</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              Buy and sell beats with local payments, instant delivery, and legal licensing.
              Built for Nepal&apos;s music creators.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setView('browse')}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-10 px-6 text-sm shadow-lg shadow-emerald-500/20"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Browse Beats
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  if (!currentUser) {
                    showToast('Please sign up as a producer to sell beats', 'info');
                    openAuth('signup');
                    return;
                  }
                  if (currentUser.role === 'producer') {
                    setView('producer-dashboard');
                  } else {
                    showToast('You need a producer account to sell beats', 'info');
                  }
                }}
                className="border-border/50 h-10 px-6 text-sm hover:bg-secondary"
              >
                Sell Your Beats
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Beats Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Trending Beats</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Most popular beats right now</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border/50"
              onClick={() => scrollCarousel('left')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border/50"
              onClick={() => scrollCarousel('right')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          ref={setCarouselRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? [...Array(6)].map((_, i) => (
                <Card key={i} className="flex-shrink-0 w-60 bg-card border-border/50 overflow-hidden">
                  <div className="aspect-square bg-secondary animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-secondary rounded animate-pulse" />
                    <div className="h-3 bg-secondary rounded animate-pulse w-2/3" />
                  </div>
                </Card>
              ))
            : featuredBeats.map((beat, i) => (
                <div key={beat.id} className="flex-shrink-0 w-60 snap-start">
                  <BeatCard beat={beat} index={i} />
                </div>
              ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Recently Added
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Fresh beats just uploaded by producers</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-500 hover:text-emerald-400 text-xs"
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('');
              useAppStore.getState().setSortBy('newest');
              setView('browse');
            }}
          >
            View All
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {recentBeats.length === 0 && !loading ? (
          <Card className="bg-card border-border/50 p-8 text-center">
            <Music2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No beats yet</h3>
            <p className="text-sm text-muted-foreground">Be the first to upload a beat!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading
              ? [...Array(12)].map((_, i) => (
                  <Card key={i} className="bg-card border-border/50 overflow-hidden">
                    <div className="aspect-square bg-secondary animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-secondary rounded animate-pulse" />
                      <div className="h-3 bg-secondary rounded animate-pulse w-2/3" />
                    </div>
                  </Card>
                ))
              : recentBeats.slice(0, 12).map((beat, i) => (
                  <BeatCard key={beat.id} beat={beat} index={i} />
                ))}
          </div>
        )}
      </section>

      {/* Top Producers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold">Top Producers</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Meet the talented creators behind the beats</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? [...Array(5)].map((_, i) => (
                <Card key={i} className="bg-card border-border/50 p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-secondary animate-pulse" />
                    <div className="h-3 bg-secondary rounded animate-pulse w-20" />
                  </div>
                </Card>
              ))
            : topProducers.map((producer, i) => (
                <motion.div
                  key={producer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                  <Card
                    className="cursor-pointer bg-card border-border/50 hover:border-emerald-500/30 transition-all duration-300 group p-4 text-center"
                    onClick={() => selectProducer(producer.id)}
                  >
                    <div className="relative inline-block mb-2">
                      <img
                        src={producer.avatar || `https://picsum.photos/seed/${producer.id}/200/200`}
                        alt={producer.name}
                        className="w-12 h-12 rounded-full object-cover mx-auto ring-2 ring-transparent group-hover:ring-emerald-500/50 transition-all duration-300"
                      />
                      {producer.verified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <BadgeCheck className="w-2.5 h-2.5 text-black" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {producer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Producer</p>
                  </Card>
                </motion.div>
              ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Beats', value: '18+', icon: Music2 },
              { label: 'Producers', value: '5', icon: Users },
              { label: 'Transactions', value: '100+', icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="w-5 h-5 text-emerald-500" />
                <span className="text-xl sm:text-2xl font-bold">{stat.value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works — Visual Flow */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <Badge className="mb-3 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-xs font-semibold">
              <Zap className="w-3 h-3 mr-1.5" />
              Simple Process
            </Badge>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">How It Works</h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
              From creation to cash — the entire beat marketplace in one visual flow
            </p>
          </motion.div>

          {/* Flow Container */}
          <div className="relative">
            {/* Connecting line behind the steps (desktop: horizontal, mobile: hidden — handled per-step) */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-px">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500/30 via-emerald-500/40 via-amber-500/30 to-emerald-500/30"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
              {/* Animated dot traveling along the line */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                initial={{ left: '0%' }}
                whileInView={{ left: '100%' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 2.5, ease: 'linear', delay: 0.8 }}
              />
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
              {FLOW_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Mobile vertical connector (hidden on lg) */}
                  {i > 0 && i % 2 !== 0 && (
                    <div className="lg:hidden absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-transparent to-border/40" />
                  )}
                  {/* Mobile arrow down for odd-to-even connection */}
                  {i > 0 && i % 2 === 0 && (
                    <div className="lg:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-border/30" />
                  )}

                  {/* Glowing circle */}
                  <motion.div
                    className={`relative w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] lg:w-[110px] lg:h-[110px] rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} ring-1 ${step.ring} mb-4 z-10`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* Pulse ring animation */}
                    <motion.div
                      className={`absolute inset-0 rounded-full ring-2 ${step.ring}`}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                    />
                    {/* Glow */}
                    <div
                      className="absolute inset-[-8px] rounded-full blur-xl opacity-40"
                      style={{ background: step.glow }}
                    />
                    {/* Icon */}
                    <span className="relative text-3xl sm:text-4xl lg:text-[42px] select-none drop-shadow-lg">
                      {step.icon}
                    </span>
                  </motion.div>

                  {/* Label */}
                  <h4 className="font-bold text-sm sm:text-base text-foreground">{step.label}</h4>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 max-w-[120px] leading-snug">
                    {step.sub}
                  </p>

                  {/* Desktop arrow between steps */}
                  {i < FLOW_STEPS.length - 1 && (
                    <motion.div
                      className="hidden lg:flex absolute -right-2 top-[55px] items-center text-muted-foreground/30"
                      initial={{ opacity: 0, x: -5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.12 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom visual labels — Producer / Buyer */}
            <div className="flex justify-between items-center mt-8 sm:mt-10 px-2 sm:px-8">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className="text-base">🎹</span>
                <span className="font-medium">Producer Side</span>
              </motion.div>

              {/* Center divider with emoji */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6, type: 'spring' }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/30"
              >
                <span className="text-sm">🎵</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">BeatBugs</span>
                <span className="text-sm">🐛</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className="font-medium">Buyer Side</span>
                <span className="text-base">🎧</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20 overflow-hidden">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Ready to Sell Your Beats?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Join Nepal&apos;s growing community of music producers. Upload your beats, 
              set your prices, and start earning today.
            </p>
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-10 px-6"
              onClick={() => {
                if (!currentUser) {
                  showToast('Please sign up as a producer to sell beats', 'info');
                  openAuth('signup');
                  return;
                }
                if (currentUser.role === 'producer') {
                  setView('producer-dashboard');
                } else {
                  showToast('You need a producer account to sell beats', 'info');
                }
              }}
            >
              <Music2 className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
}
