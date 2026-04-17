import { create } from 'zustand';
import type { Beat } from './types';

interface AudioState {
  currentlyPlaying: Beat | null;
  isPlaying: boolean;
  audioDuration: number;
  audioCurrentTime: number;
  audioProgress: number;
  playBeat: (beat: Beat) => void;
  pauseBeat: () => void;
  resumeBeat: () => void;
  stopBeat: () => void;
  seekTo: (percent: number) => void;
  updateAudioTime: (currentTime: number, duration: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentlyPlaying: null,
  isPlaying: false,
  audioDuration: 0,
  audioCurrentTime: 0,
  audioProgress: 0,
  playBeat: (beat) =>
    set({
      currentlyPlaying: beat,
      isPlaying: true,
      audioProgress: 0,
      audioCurrentTime: 0,
      audioDuration: 0,
    }),
  pauseBeat: () => set({ isPlaying: false }),
  resumeBeat: () => set({ isPlaying: true }),
  stopBeat: () =>
    set({
      currentlyPlaying: null,
      isPlaying: false,
      audioProgress: 0,
      audioCurrentTime: 0,
      audioDuration: 0,
    }),
  seekTo: (percent) => set({ audioProgress: percent }),
  updateAudioTime: (currentTime, duration) =>
    set({
      audioCurrentTime: currentTime,
      audioDuration: duration,
      audioProgress: duration > 0 ? (currentTime / duration) * 100 : 0,
    }),
}));