'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudioStore } from '@/stores/audio-store';
import { useAppStore } from '@/stores/app-store';
import { getAudioElement, formatTime, isValidAudioUrl } from '@/lib/audio/player';

export function AudioPlayerBar() {
  const {
    currentlyPlaying,
    isPlaying,
    audioDuration,
    audioCurrentTime,
    audioProgress,
    pauseBeat,
    resumeBeat,
    stopBeat,
    updateAudioTime,
    seekTo,
  } = useAudioStore();

  const animFrameRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioReadyRef = useRef(false);
  const lastBeatIdRef = useRef<string | null>(null);

  // --- Audio playback helpers ---

  const startTicking = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const tick = () => {
      const el = getAudioElement();
      if (el.duration && isFinite(el.duration)) {
        updateAudioTime(el.currentTime, el.duration);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [updateAudioTime]);

  const stopTicking = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // --- Effect 1: Load source when beat changes ---
  useEffect(() => {
    const audio = getAudioElement();
    const beatId = currentlyPlaying?.id || null;

    if (!beatId) return;
    if (beatId === lastBeatIdRef.current) return;
    lastBeatIdRef.current = beatId;

    audioReadyRef.current = false;

    const src = currentlyPlaying?.audioPreviewUrl;
    if (!isValidAudioUrl(src)) return;

    audio.pause();
    audio.currentTime = 0;
    audio.src = src;
    audio.load();

    const onReady = () => {
      audioReadyRef.current = true;
      if (useAudioStore.getState().isPlaying) {
        audio.play().catch(() => {
          useAudioStore.getState().pauseBeat();
        });
        startTicking();
      }
    };

    const onLoadedData = () => {
      audioReadyRef.current = true;
      if (useAudioStore.getState().isPlaying) {
        audio.play().catch(() => {
          useAudioStore.getState().pauseBeat();
        });
        startTicking();
      }
    };

    audio.addEventListener('loadeddata', onLoadedData);
    audio.addEventListener('canplaythrough', onReady);

    return () => {
      audio.removeEventListener('canplaythrough', onReady);
      audio.removeEventListener('loadeddata', onLoadedData);
    };
  }, [currentlyPlaying?.id, startTicking]);

  // --- Effect 2: Play/Pause toggle ---
  useEffect(() => {
    const audio = getAudioElement();

    if (isPlaying) {
      if (audioReadyRef.current) {
        audio.play().catch(() => {
          pauseBeat();
        });
        startTicking();
      }
    } else {
      audio.pause();
      stopTicking();
    }
  }, [isPlaying, pauseBeat, startTicking, stopTicking]);

  // --- Effect 3: Global audio events ---
  useEffect(() => {
    const audio = getAudioElement();

    const handleEnded = () => {
      stopBeat();
      stopTicking();
      audioReadyRef.current = false;
    };

    const handleError = () => {
      pauseBeat();
      stopTicking();
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      stopTicking();
    };
  }, [stopBeat, pauseBeat, stopTicking]);

  const handleSeek = (value: number[]) => {
    const percent = value[0];
    const audio = getAudioElement();
    if (audio.duration && isFinite(audio.duration)) {
      const seekTime = (percent / 100) * audio.duration;
      audio.currentTime = seekTime;
      updateAudioTime(seekTime, audio.duration);
      seekTo(percent);
    }
  };

  const handleSkipBack = () => {
    const audio = getAudioElement();
    audio.currentTime = 0;
    updateAudioTime(0, audio.duration || 0);
  };

  const handleSkipForward = () => {
    const audio = getAudioElement();
    if (audio.duration && isFinite(audio.duration)) {
      audio.currentTime = audio.duration * 0.9;
    }
  };

  const toggleMute = () => {
    const audio = getAudioElement();
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleClose = () => {
    const audio = getAudioElement();
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
    audioReadyRef.current = false;
    lastBeatIdRef.current = null;
    stopTicking();
    stopBeat();
  };

  if (!currentlyPlaying) return null;

  const hasAudio = isValidAudioUrl(currentlyPlaying.audioPreviewUrl);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl"
      >
        {/* Progress bar */}
        <div
          className="h-1 bg-secondary relative cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            handleSeek([percent]);
          }}
        >
          <div
            className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-100"
            style={{ width: `${audioProgress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${audioProgress}%`, transform: `translateX(-50%) translateY(-50%)` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Beat info */}
            <div
              className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none sm:w-56 cursor-pointer"
              onClick={() => useAppStore.getState().selectBeat(currentlyPlaying)}
            >
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
                  {!hasAudio && (
                    <span className="text-amber-500 ml-1">(no audio)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-white hidden sm:flex"
                onClick={handleSkipBack}
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => {
                  if (!hasAudio) {
                    useAppStore.getState().showToast('No audio file uploaded for this beat', 'info');
                    return;
                  }
                  if (isPlaying) pauseBeat();
                  else resumeBeat();
                }}
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
                onClick={handleSkipForward}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Time + slider */}
            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
              <span className="text-xs text-muted-foreground font-mono w-10 text-right">
                {formatTime(audioCurrentTime)}
              </span>
              <Slider
                value={[audioProgress]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground font-mono w-10">
                {formatTime(audioDuration)}
              </span>
            </div>

            {/* Volume + Close */}
            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-white hidden sm:flex"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-white"
                onClick={handleClose}
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