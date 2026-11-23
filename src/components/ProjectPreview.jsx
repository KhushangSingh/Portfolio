import { useEffect, useRef, useState } from 'react';
import { playSoundEffect } from '../utils/soundEffects';

export default function ProjectPreview({
  src, alt, videoSrc, className = '', loading = 'lazy', fetchPriority, autoPlay = false, active = true,
}) {
  const videoRef = useRef(null);
  const [playback, setPlayback] = useState('poster');
  const showVideo = playback === 'playing' || playback === 'paused' || (!autoPlay && playback === 'ended');
  const previewLabel = { playing: 'Pause preview', ended: 'Replay preview' }[playback] ?? 'Play preview';

  useEffect(() => {
    const video = videoRef.current;
    if (!autoPlay || !active || !video || typeof IntersectionObserver !== 'function') return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isInView = false;

    const syncPlayback = () => {
      if (isInView && !motion.matches && !document.hidden && !video.ended) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.intersectionRatio >= 0.55;
      syncPlayback();
    }, { threshold: 0.55 });

    observer.observe(video);
    motion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [active, autoPlay, videoSrc]);

  function togglePlayback() {
    const video = videoRef.current;
    playSoundEffect('select');
    if (!video.paused) {
      video.pause();
      return;
    }
    video.play().catch(() => {});
  }

  return (
    <div className={`relative bg-[#111] ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 block size-full object-contain" loading={loading} fetchPriority={fetchPriority} decoding="async" />
      {videoSrc && (
        <>
          <video
            ref={videoRef}
            src={videoSrc}
            className={`pointer-events-none absolute inset-0 size-full bg-[#111] object-contain ${showVideo ? '' : 'opacity-0'}`}
            preload="none"
            muted
            playsInline
            aria-hidden="true"
            onPlaying={() => setPlayback('playing')}
            onPause={() => setPlayback(current => current === 'playing' ? 'paused' : current)}
            onEnded={() => setPlayback('ended')}
            onError={() => setPlayback('error')}
          />
          {!autoPlay && playback !== 'error' && (
            <button
              type="button"
              aria-label={`${previewLabel} for ${alt}`}
              className="absolute bottom-3 right-3 z-10 min-h-12 rounded-md border border-white/25 bg-[#161515]/95 px-3 text-sm font-semibold text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={togglePlayback}
            >
              {previewLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
