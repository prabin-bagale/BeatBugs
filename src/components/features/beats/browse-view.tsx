'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BeatCard } from '@/components/shared/beat-card';
import { useAppStore } from '@/stores/app-store';
import type { Beat } from '@/stores/types';

const GENRES = [
  'NepHop', 'Lo-Fi', 'Drill', 'Trap', 'Folk Fusion', 'R&B', 'Afrobeat', 'Hip-Hop',
];

const MOODS = [
  'Chill', 'Dark', 'Energetic', 'Melancholic', 'Aggressive', 'Happy', 'Romantic', 'Epic',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'best_selling', label: 'Best Selling' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

export function BrowseView() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedMood,
    setSelectedMood,
    sortBy,
    setSortBy,
  } = useAppStore();

  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [bpmMin, setBpmMin] = useState('');
  const [bpmMax, setBpmMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchBeats = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (selectedGenre) params.set('genre', selectedGenre);
        if (selectedMood) params.set('mood', selectedMood);
        if (bpmMin) params.set('bpmMin', bpmMin);
        if (bpmMax) params.set('bpmMax', bpmMax);
        if (sortBy) params.set('sortBy', sortBy);
        params.set('page', pageNum.toString());
        params.set('limit', '12');

        const res = await fetch(`/api/beats?${params.toString()}`);
        const data = await res.json();

        if (append) {
          setBeats((prev) => [...prev, ...data.beats]);
        } else {
          setBeats(data.beats || []);
        }
        setTotal(data.total || 0);
        setPage(pageNum);
      } catch (err) {
        console.error('Failed to fetch beats:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, selectedGenre, selectedMood, sortBy, bpmMin, bpmMax]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    fetchBeats(1);
  }, [fetchBeats]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedMood('');
    setSortBy('newest');
    setBpmMin('');
    setBpmMax('');
  };

  const hasActiveFilters = searchQuery || selectedGenre || selectedMood || bpmMin || bpmMax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Browse Beats</h1>
        <p className="text-muted-foreground">
          {total > 0 ? `${total} beats found` : 'Search through our beat library'}
        </p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search beats by title, genre, mood..."
            className="pl-10 bg-secondary border-border/50 focus:border-emerald-500/50 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className={
            showFilters
              ? 'bg-emerald-500 hover:bg-emerald-600 text-black h-10'
              : 'border-border/50 h-10'
          }
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="bg-card border border-border/50 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Genre */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Genre</Label>
                <Select value={selectedGenre} onValueChange={(v) => setSelectedGenre(v === '__all__' ? '' : v)}>
                  <SelectTrigger className="bg-secondary border-border/50 h-9 text-sm">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="__all__">All Genres</SelectItem>
                    {GENRES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mood */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Mood</Label>
                <Select value={selectedMood} onValueChange={(v) => setSelectedMood(v === '__all__' ? '' : v)}>
                  <SelectTrigger className="bg-secondary border-border/50 h-9 text-sm">
                    <SelectValue placeholder="All Moods" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="__all__">All Moods</SelectItem>
                    {MOODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* BPM Range */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">BPM Min</Label>
                <Input
                  type="number"
                  placeholder="60"
                  min="40"
                  max="300"
                  className="bg-secondary border-border/50 h-9 text-sm"
                  value={bpmMin}
                  onChange={(e) => setBpmMin(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">BPM Max</Label>
                <Input
                  type="number"
                  placeholder="300"
                  min="40"
                  max="300"
                  className="bg-secondary border-border/50 h-9 text-sm"
                  value={bpmMax}
                  onChange={(e) => setBpmMax(e.target.value)}
                />
              </div>

              {/* Sort */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-secondary border-border/50 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-destructive text-xs"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border/50 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-secondary" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-secondary rounded" />
                <div className="h-3 bg-secondary rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : beats.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No beats found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-border/50"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {beats.map((beat, i) => (
              <BeatCard key={beat.id} beat={beat} index={i} />
            ))}
          </div>

          {/* Load More */}
          {beats.length < total && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                onClick={() => fetchBeats(page + 1, true)}
                disabled={loadingMore}
                className="border-border/50 h-10 px-8"
              >
                {loadingMore ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Load More Beats
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
