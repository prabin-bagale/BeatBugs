'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAudioStore } from '@/stores/audio-store';
import {
  getAudioElement,
  isValidAudioUrl,
} from '@/stores/audio/player';

export function useAudioPlayer() {
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
  } = useAudioStore();

  const animFrameRef = useRef<number | null>(null);
  const audioReadyRef = useRef(false);
  const lastBeatIdRef = useRef<string | null>(null);

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

  // Effect 1: Load source when beat changes
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
      audio.removeEventListener('loadeddata', onLoadedData);
      audio.removeEventListener('canplaythrough', onReady);
    };
  }, [currentlyPlaying?.id, startTicking]);

  // Effect 2: Play/Pause toggle
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

  // Effect 3: Global audio events
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

  const handleSeek = useCallback((percent: number) => {
    const audio = getAudioElement();
    if (audio.duration && isFinite(audio.duration)) {
      const seekTime = (percent / 100) * audio.duration;
      audio.currentTime = seekTime;
      updateAudioTime(seekTime, audio.duration);
    }
  }, [updateAudioTime]);

  const handleSkipBack = useCallback(() => {
    const audio = getAudioElement();
    audio.currentTime = 0;
    updateAudioTime(0, audio.duration || 0);
  }, [updateAudioTime]);

  const handleSkipForward = useCallback(() => {
    const audio = getAudioElement();
    if (audio.duration && isFinite(audio.duration)) {
      audio.currentTime = audio.duration * 0.9;
    }
  }, []);

  const handleClose = useCallback(() => {
    const audio = getAudioElement();
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
    audioReadyRef.current = false;
    lastBeatIdRef.current = null;
    stopTicking();
    stopBeat();
  }, [stopBeat, stopTicking]);

  return {
    currentlyPlaying,
    isPlaying,
    audioDuration,
    audioCurrentTime,
    audioProgress,
    isMuted: false,
    hasAudio: currentlyPlaying ? isValidAudioUrl(currentlyPlaying.audioPreviewUrl) : false,
    play: isPlaying ? pauseBeat : resumeBeat,
    seek: handleSeek,
    skipBack: handleSkipBack,
    skipForward: handleSkipForward,
    close: handleClose,
    toggleMute: () => {},
  };
}