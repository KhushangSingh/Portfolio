import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { favoriteTrack } from '../constants/favoriteTrack';

// --- BUILT-IN CHILL LO-FI AUDIO ENGINE (Fallback if streaming is blocked) ---
class VinylAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.noiseNode = null;
    this.noiseGain = null;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  playNeedleDrop() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.1);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // A failed needle sound should leave the fallback playing.
    }
  }

  startVinylCrackle() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.985 ? 0.35 : 0.02);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 1.2;

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    noise.start();
    this.noiseNode = noise;
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.playNeedleDrop();
    this.startVinylCrackle();
  }

  stop() {
    this.isPlaying = false;
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // The browser may already have stopped this one-shot source.
      }
      this.noiseNode = null;
    }
  }
}

const audioEngine = new VinylAudioEngine();

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to detect if user has scrolled past the hero section
  const checkIsPastHero = () => {
    if (typeof window === 'undefined') return false;

    const heroEl = document.getElementById('hero-page');
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      return rect.bottom <= 120;
    }

    return window.scrollY > 300;
  };

  // Track scroll position relative to the hero section
  const [isPastHero, setIsPastHero] = useState(() => checkIsPastHero());

  // Start as closed/tucked so it can smoothly slide out on mount
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Track when player has completely finished its exit animation and is fully removed/hidden
  const [isPlayerFullyHidden, setIsPlayerFullyHidden] = useState(() => checkIsPastHero());

  const audioRef = useRef(null);
  const playbackRequest = useRef(0);
  const wantsMusic = useRef(false);

  function playMusic() {
    const audio = audioRef.current;
    if (!audio || wantsMusic.current) return;

    wantsMusic.current = true;
    const request = ++playbackRequest.current;
    audio.volume = 0.85;
    audio.playbackRate = 1;
    setIsPlaying(true);
    audio.play()?.catch(() => {
      if (request === playbackRequest.current) audioEngine.start();
    });
  }

  function pauseMusic() {
    wantsMusic.current = false;
    playbackRequest.current += 1;
    audioRef.current?.pause();
    audioEngine.stop();
    setIsPlaying(false);
  }

  const handleHeaderPlayClick = () => {
    if (wantsMusic.current) pauseMusic();
    else playMusic();
  };

  // Scroll listener to detect when user scrolls past or returns to the hero section (RAF throttled)
  useEffect(() => {
    let ticking = false;
    const checkPast = () => {
      const past = checkIsPastHero();
      setIsPastHero(past);
      if (!past) {
        setIsPlayerFullyHidden(false);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkPast);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkPast();

    // Re-verify after initial paint and browser scroll restoration
    const t1 = setTimeout(checkPast, 40);
    const t2 = setTimeout(checkPast, 150);
    const t3 = setTimeout(checkPast, 350);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <MusicContext.Provider value={{
      isPlaying,
      setIsPlaying,
      isPlayerOpen,
      setIsPlayerOpen,
      isPastHero,
      setIsPastHero,
      isPlayerFullyHidden,
      setIsPlayerFullyHidden,
      handleHeaderPlayClick,
      playMusic,
      pauseMusic
    }}>
      <audio ref={audioRef} loop preload="auto" playsInline>
        <source src={favoriteTrack.audioUrl} type="audio/mp4" />
      </audio>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    return {
      isPlaying: false,
      setIsPlaying: () => {},
      isPlayerOpen: false,
      setIsPlayerOpen: () => {},
      isPastHero: false,
      setIsPastHero: () => {},
      isPlayerFullyHidden: false,
      setIsPlayerFullyHidden: () => {},
      handleHeaderPlayClick: () => {},
      playMusic: () => {},
      pauseMusic: () => {}
    };
  }
  return context;
};

