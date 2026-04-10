'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/stores/beatbazaar-store';

export function AudioPlayerBar() {
  const { currentlyPlaying, isPlaying, pauseBeat, resumeBeat, stopBeat } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated track duration: 30 seconds
  const totalDuration = 30;

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isPlaying && currentlyPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= totalDuration) {
            // Loop back
            return 0;
          }
          setProgress((next / totalDuration) * 100);
          return next;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentlyPlaying]);

  const handleSeek = (value: number[]) => {
    const seekTime = (value[0] / 100) * totalDuration;
    setCurrentTime(seekTime);
    setProgress(value[0]);
  };

  if (!currentlyPlaying) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl"
      >
        {/* Progress bar (thin line at top) */}
        <div className="h-0.5 bg-secondary relative cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percent = (x / rect.width) * 100;
          handleSeek([percent]);
        }}>
          <div
            className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Beat info */}
            <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none sm:w-56">
              <img
                src={currentlyPlaying.coverUrl}
                alt={currentlyPlaying.title}
                className="w-10 h-10 rounded-md object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentlyPlaying.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentlyPlaying.producer?.name}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-white hidden sm:flex"
                onClick={() => { setCurrentTime(0); setProgress(0); }}
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => isPlaying ? pauseBeat() : resumeBeat()}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-white hidden sm:flex"
                onClick={() => { setCurrentTime(0); setProgress(0); }}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Time + slider */}
            <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs text-muted-foreground font-mono w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground font-mono w-10">
                {formatTime(totalDuration)}
              </span>
            </div>

            {/* Volume + Close */}
            <div className="flex items-center gap-2 ml-auto">
              <Volume2 className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-white"
                onClick={stopBeat}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
