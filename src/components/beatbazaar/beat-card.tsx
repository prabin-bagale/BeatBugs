'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Eye, ShoppingCart, BadgeCheck, Music, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore, type Beat } from '@/stores/beatbazaar-store';

interface BeatCardProps {
  beat: Beat;
  index?: number;
}

export function BeatCard({ beat, index = 0 }: BeatCardProps) {
  const { selectBeat, playBeat, pauseBeat, currentlyPlaying, isPlaying, showToast } = useAppStore();

  const isCurrentBeat = currentlyPlaying?.id === beat.id;
  const hasAudio = !!beat.audioPreviewUrl;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasAudio) {
      showToast('No audio file for this beat', 'info');
      return;
    }
    if (isCurrentBeat && isPlaying) {
      pauseBeat();
    } else {
      playBeat(beat);
    }
  };

  const handleClick = () => {
    selectBeat(beat);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="beat-card-glow group cursor-pointer overflow-hidden bg-card border-border/50 hover:border-emerald-500/30 transition-all duration-300"
        onClick={handleClick}
      >
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={beat.coverUrl}
            alt={beat.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              className={`w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg ${
                hasAudio
                  ? 'bg-emerald-500 shadow-emerald-500/30'
                  : 'bg-secondary shadow-secondary/30'
              }`}
            >
              {isCurrentBeat && isPlaying ? (
                <Pause className="w-6 h-6 text-black fill-black" />
              ) : (
                <Play className={`w-6 h-6 ml-0.5 ${hasAudio ? 'text-black fill-black' : 'text-muted-foreground'}`} />
              )}
            </motion.button>
          </div>
          {/* Playing indicator */}
          {isCurrentBeat && isPlaying && (
            <div className="absolute bottom-3 left-3 flex items-center gap-0.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full wave-bar"
                />
              ))}
            </div>
          )}
          {/* Genre badge */}
          <Badge className="absolute top-3 left-3 bg-black/70 text-white border-0 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            {beat.genre}
          </Badge>
          {/* Price tag */}
          <div className="absolute top-3 right-3 bg-emerald-500/90 text-black text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
            NPR {beat.basicPrice.toLocaleString()}
          </div>
          {/* Audio status badge */}
          {!hasAudio && (
            <div className="absolute bottom-3 right-3 bg-amber-500/80 text-black text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              No audio
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
            {beat.title}
          </h3>

          {/* Producer */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {beat.producer?.avatar ? (
              <img
                src={beat.producer.avatar}
                alt={beat.producer.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted" />
            )}
            <span className="text-xs text-muted-foreground truncate">
              {beat.producer?.name || 'Unknown'}
            </span>
            {beat.producer?.verified && (
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {beat.plays}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" />
              {beat.sales}
            </span>
            <span>{beat.bpm} BPM</span>
            <span className="ml-auto font-mono text-[10px]">{beat.key}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
