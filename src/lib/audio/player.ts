/**
 * Shared audio player utility - singleton HTMLAudioElement
 * Ensures only one beat plays at a time across the entire app.
 */

let audioElement: HTMLAudioElement | null = null;

export function getAudioElement(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = 'auto';
  }
  return audioElement;
}

export function getAudioDuration(): number {
  const el = getAudioElement();
  if (el.duration && isFinite(el.duration)) {
    return el.duration;
  }
  return 0;
}

export function getAudioCurrentTime(): number {
  return getAudioElement().currentTime;
}

export function getAudioProgress(): number {
  const el = getAudioElement();
  if (el.duration && isFinite(el.duration)) {
    return (el.currentTime / el.duration) * 100;
  }
  return 0;
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if an audioPreviewUrl is actually playable.
 * Valid: data:audio/... URIs, http/https URLs
 * Invalid: '#', empty string, relative paths like '/audio/x.mp3' (no public files)
 */
export function isValidAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('data:audio/') || url.startsWith('http://') || url.startsWith('https://');
}