'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Music2,
  TrendingUp,
  Users,
  Headphones,
  Zap,
  Play,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BeatCard } from './beat-card';
import { useAppStore, type Beat, type User } from '@/stores/beatbazaar-store';

const GENRES = [
  { name: 'NepHop', color: 'from-emerald-500 to-teal-600', icon: '🎤' },
  { name: 'Lo-Fi', color: 'from-amber-500 to-orange-600', icon: '🎧' },
  { name: 'Drill', color: 'from-red-500 to-rose-600', icon: '🔥' },
  { name: 'Trap', color: 'from-purple-500 to-fuchsia-600', icon: '💥' },
  { name: 'Folk Fusion', color: 'from-yellow-500 to-amber-600', icon: '🪕' },
  { name: 'R&B', color: 'from-pink-500 to-rose-600', icon: '🎶' },
  { name: 'Afrobeat', color: 'from-orange-500 to-red-600', icon: '🥁' },
  { name: 'Hip-Hop', color: 'from-teal-500 to-cyan-600', icon: '🎤' },
];

export function HomeView() {
  const { setView, selectBeat, selectProducer, setSelectedGenre, setSearchQuery } = useAppStore();
  const [featuredBeats, setFeaturedBeats] = useState<Beat[]>([]);
  const [topProducers, setTopProducers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [beatsRes, producersRes] = await Promise.all([
          fetch('/api/beats?sortBy=popular&limit=6'),
          fetch('/api/auth?role=producer'),
        ]);

        const beatsData = await beatsRes.json();
        const producersData = await producersRes.json();

        setFeaturedBeats(beatsData.beats || []);
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

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    setView('browse');
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1.5 text-xs font-semibold">
              <Zap className="w-3 h-3 mr-1.5" />
              Nepal&apos;s First Digital Beat Marketplace
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Find Your Next
              <br />
              <span className="gradient-text">Hit Beat</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Buy and sell beats with local payments, instant delivery, and legal licensing.
              Built for Nepal&apos;s music creators.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setView('browse')}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 px-8 text-base shadow-lg shadow-emerald-500/20"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Browse Beats
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setView('browse');
                }}
                className="border-border/50 h-12 px-8 text-base hover:bg-secondary"
              >
                Sell Your Beats
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Beats', value: '18+', icon: Music2 },
              { label: 'Producers', value: '5', icon: Users },
              { label: 'Transactions', value: '100+', icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="w-5 h-5 text-emerald-500" />
                <span className="text-2xl sm:text-3xl font-bold">{stat.value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Beats Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Trending Beats</h2>
            <p className="text-sm text-muted-foreground mt-1">Most popular beats right now</p>
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
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
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

      {/* Genre Browsing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Browse by Genre</h2>
          <p className="text-sm text-muted-foreground mt-1">Find beats that match your style</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {GENRES.map((genre, i) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                className="cursor-pointer overflow-hidden bg-card border-border/50 hover:border-emerald-500/30 transition-all duration-300 group"
                onClick={() => handleGenreClick(genre.name)}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${genre.color} flex items-center justify-center text-lg sm:text-xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {genre.icon}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white">{genre.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Producers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Top Producers</h2>
          <p className="text-sm text-muted-foreground mt-1">Meet the talented creators behind the beats</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? [...Array(5)].map((_, i) => (
                <Card key={i} className="bg-card border-border/50 p-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-secondary animate-pulse" />
                    <div className="h-4 bg-secondary rounded animate-pulse w-24" />
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
                    className="cursor-pointer bg-card border-border/50 hover:border-emerald-500/30 transition-all duration-300 group p-6 text-center"
                    onClick={() => selectProducer(producer.id)}
                  >
                    <div className="relative inline-block mb-3">
                      <img
                        src={producer.avatar || `https://picsum.photos/seed/${producer.id}/200/200`}
                        alt={producer.name}
                        className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-transparent group-hover:ring-emerald-500/50 transition-all duration-300"
                      />
                      {producer.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <BadgeCheck className="w-3 h-3 text-black" />
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

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20 overflow-hidden">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Sell Your Beats?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Join Nepal&apos;s growing community of music producers. Upload your beats, 
              set your prices, and start earning today.
            </p>
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 px-8"
              onClick={() => setView('browse')}
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
