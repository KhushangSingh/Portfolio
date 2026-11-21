/**
 * Audio Preloader Utility
 * 
 * Preloads portfolio audio tracks in the background using requestIdleCallback / low-priority fetch
 * so that both the Hero Turntable and the Mood Board Vinyl Disc play instantly with 0ms delay.
 */

const PRELOAD_TRACKS = [
  '/audio/bad_bunny_dtmf.m4a',
  '/audio/bad_bunny_dtmf.mp3',
  '/audio/shape_of_you.m4a'
];

const preloadedAudioElements = new Map();

export function initAudioPreload() {
  if (typeof window === 'undefined') return;

  const startPreload = () => {
    PRELOAD_TRACKS.forEach((src) => {
      // 1. Warm up browser HTTP cache via low-priority fetch
      try {
        fetch(src, { cache: 'force-cache', priority: 'low' }).catch(() => {
          // Silent fallback if browser doesn't support priority
          fetch(src, { cache: 'force-cache' }).catch(() => {});
        });
      } catch (err) {
        // Fallback for older environments
      }

      // 2. Warm up browser Media Pipeline / decoder metadata
      try {
        if (!preloadedAudioElements.has(src)) {
          const audio = new Audio();
          audio.preload = 'auto';
          audio.src = src;
          // Trigger initial buffer load
          audio.load();
          preloadedAudioElements.set(src, audio);
        }
      } catch (err) {
        // Ignore audio pipeline restrictions
      }
    });
  };

  // Schedule preloading during browser idle time so it never blocks page rendering or LCP
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(startPreload, { timeout: 1500 });
  } else {
    setTimeout(startPreload, 800);
  }
}

