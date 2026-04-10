'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Music2,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BeatCard } from './beat-card';
import { useAppStore, type Beat, type User } from '@/stores/beatbazaar-store';

export function ProducerView() {
  const { selectedProducerId, goBack, setView } = useAppStore();
  const [producer, setProducer] = useState<User | null>(null);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducer() {
      if (!selectedProducerId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/beats?producerId=${selectedProducerId}&limit=50`);
        const data = await res.json();
        setBeats(data.beats || []);
        // Get producer info from first beat
        if (data.beats?.[0]?.producer) {
          setProducer(data.beats[0].producer as unknown as User);
        }
      } catch (err) {
        console.error('Failed to fetch producer:', err);
      } finally {
        setLoading(false);
      }
    }

    // Also try to get full user info
    async function fetchUserInfo() {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        const users = data.users || [];
        const found = users.find((u: User) => u.id === selectedProducerId);
        if (found) setProducer(found);
      } catch {}
    }

    fetchProducer();
    fetchUserInfo();
  }, [selectedProducerId]);

  const totalPlays = beats.reduce((acc, b) => acc + b.plays, 0);
  const totalSales = beats.reduce((acc, b) => acc + b.sales, 0);
  const memberSince = producer?.createdAt
    ? new Date(producer.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'N/A';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-secondary rounded w-20" />
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-secondary" />
            <div className="space-y-2">
              <div className="h-6 bg-secondary rounded w-48" />
              <div className="h-4 bg-secondary rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!producer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={goBack}
        className="mb-6 text-muted-foreground hover:text-white -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      {/* Banner Header */}
      <Card className="bg-card border-border/50 overflow-hidden mb-8">
        <div className="h-32 sm:h-48 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent" />
        <CardContent className="px-6 pb-6 -mt-10 sm:-mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative">
              <img
                src={producer.avatar || `https://picsum.photos/seed/${producer.id}/200/200`}
                alt={producer.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-card"
              />
              {producer.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-card">
                  <BadgeCheck className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{producer.name}</h1>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                  Producer
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {producer.bio || 'Music Producer from Nepal'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Beats', value: beats.length, icon: Music2 },
          { label: 'Total Sales', value: totalSales, icon: TrendingUp },
          { label: 'Total Plays', value: totalPlays.toLocaleString(), icon: Music2 },
          { label: 'Member Since', value: memberSince, icon: Calendar },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Beats Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">All Beats</h2>
        <p className="text-sm text-muted-foreground">{beats.length} beats by {producer.name}</p>
      </div>

      {beats.length === 0 ? (
        <div className="text-center py-16">
          <Music2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No beats published yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
          {beats.map((beat, i) => (
            <BeatCard key={beat.id} beat={beat} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
