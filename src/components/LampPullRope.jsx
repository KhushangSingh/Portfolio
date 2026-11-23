import { playCustomEffect } from '../utils/soundEffects';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

// Physics parameters adapted from Framer RopeToggle simulation
const SEGMENTS = 16;
const ITER = 18; // Length constraint relaxation passes
const REST_ROPE_LENGTH = 64; // Elegant resting length
const ANCHOR_X = 140; // SVG center anchor point (wide 280px canvas gives 140px clearance on left & right)
const ANCHOR_Y = 6;
const PULL_TRIGGER_DISTANCE = 20; // Pull down >= 20px to immediately trigger theme switch mid-pull
const MAX_STRETCH = 115; // Generous downward stretch limit
const OVER_STRETCH_THRESHOLD = 105; // Blowout ONLY when pulled to extreme limit >= 105px stretch (~120px drag)

export const LampPullRope = () => {
  const { isDark, toggleTheme, isBulbBroken, bulbRepairCountdown, breakBulb } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [initialHintVisible, setInitialHintVisible] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRepairHintActive, setIsRepairHintActive] = useState(false);
  const pullHistoryRef = useRef([]);
  const hasExplodedRef = useRef(false);
  const hasCrossedThresholdRef = useRef(false);
  const hasSwitchedThisPullRef = useRef(false);
  const hasCycledThisPullRef = useRef(false);
  const currentPullYRef = useRef(0);
  const pointerDownTimeRef = useRef(0);

  // Automatically show the appearance rope hint for ~2.6s on newly opened or refreshed page
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialHintVisible(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  // Render state driven synchronously by physics loop
  const [ropePath, setRopePath] = useState(`M ${ANCHOR_X} ${ANCHOR_Y} L ${ANCHOR_X} ${ANCHOR_Y + REST_ROPE_LENGTH}`);
  const [handleState, setHandleState] = useState({
    x: ANCHOR_X,
    y: ANCHOR_Y + REST_ROPE_LENGTH,
    angle: 0
  });

  // Physics simulation refs
  const ropeRef = useRef({
    pts: [],
    ax: ANCHOR_X,
    ay: ANCHOR_Y,
    len: REST_ROPE_LENGTH,
    dragging: false,
    tx: ANCHOR_X,
    ty: ANCHOR_Y + REST_ROPE_LENGTH,
    quiet: 0
  });

  const animFrameRef = useRef(null);
  const runningRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasTriggeredRef = useRef(false);
  const startCoordRef = useRef({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef(Date.now());
  const lastMovePosRef = useRef({ x: 0, y: 0 });
  const releaseVelocityRef = useRef({ vx: 0, vy: 0 });

  // Initialize 16-segment rope nodes
  const resetRope = useCallback(() => {
    const r = ropeRef.current;
    const seg = r.len / SEGMENTS;
    r.pts = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const y = r.ay + seg * i;
      r.pts.push({ x: r.ax, y, px: r.ax, py: y });
    }
    r.quiet = 0;
  }, []);

  if (ropeRef.current.pts.length === 0) {
    resetRope();
  }

  // Tighten rope nodes towards resting segment length (velocity-preserving)
  const tightenRope = (r, k) => {
    const pts = r.pts;
    const seg = r.len / SEGMENTS;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1e-4;
      const cx = (a.x + (dx / d) * seg - b.x) * k;
      const cy = (a.y + (dy / d) * seg - b.y) * k;
      b.x += cx;
      b.y += cy;
      b.px += cx;
      b.py += cy;
    }
  };

  // Step Verlet physics: inertia, damping, velocity cap and length constraints
  const stepRope = (r) => {
    const pts = r.pts;
    const seg = r.len / SEGMENTS;
    const friction = 0.98; // Fluid air resistance for realistic sustained pendulum swing
    const g = 0.48; // Natural gravity

    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      let vx = (p.x - p.px) * friction;
      let vy = (p.y - p.py) * friction;

      // Velocity cap: prevents rope from violent snaps while allowing wide swings
      const sp = Math.hypot(vx, vy);
      if (sp > 16) {
        vx *= 16 / sp;
        vy *= 16 / sp;
      }

      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + g;
    }

    // Drag target point constrained within stretch limit
    let tx = r.tx;
    let ty = r.ty;
    if (r.dragging) {
      const dx = tx - r.ax;
      const dy = ty - r.ay;
      const d = Math.hypot(dx, dy) || 1;
      const max = r.len + MAX_STRETCH; // Max downward stretch limit (increased 40%)
      if (d > max) {
        tx = r.ax + (dx / d) * max;
        ty = r.ay + (dy / d) * max;
      }
    }

    const last = pts[pts.length - 1];

    // Constraint relaxation passes
    for (let k = 0; k < ITER; k++) {
      pts[0].x = r.ax;
      pts[0].y = r.ay;

      if (r.dragging) {
        last.x = tx;
        last.y = ty;
      }

      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1e-4;
        const diff = (d - seg) / d;

        const wa = i === 0 ? 0 : 0.5;
        const wb = r.dragging && i === pts.length - 2 ? 0 : i === 0 ? 1 : 0.5;
        const s = wa + wb || 1;

        dx *= diff;
        dy *= diff;
        a.x += dx * (wa / s);
        a.y += dy * (wa / s);
        b.x -= dx * (wb / s);
        b.y -= dy * (wb / s);
      }
    }

    pts[0].x = r.ax;
    pts[0].y = r.ay;
    if (r.dragging) {
      last.x = tx;
      last.y = ty;
    }

    // Finishing pass: pull nodes towards length without killing velocity
    if (!r.dragging) {
      tightenRope(r, 0.42);
    }
  };

  // Generate smooth SVG curve through nodes (midpoint quadratic bezier)
  const generateRopePath = (pts) => {
    if (pts.length < 2) return '';
    let d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      d += ' Q ' + pts[i].x.toFixed(1) + ' ' + pts[i].y.toFixed(1) + ', ' + mx.toFixed(1) + ' ' + my.toFixed(1);
    }
    const l = pts[pts.length - 1];
    d += ' L ' + l.x.toFixed(1) + ' ' + l.y.toFixed(1);
    return d;
  };

  // Mechanical switch audio synthesis
  const playClickSound = useCallback((nextIsLight) => {
    playCustomEffect(.045, (ctx, output, t) => {
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(nextIsLight ? 1800 : 1200, t);
      osc.frequency.exponentialRampToValueAtTime(nextIsLight ? 600 : 320, t + 0.04);
      
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      
      osc.connect(gain);
      gain.connect(output);
      
      osc.start(t);
      osc.stop(t + 0.045);
    });
  }, []);

  // Realistic electrical arc blowout & glass shatter audio synthesis
  const playBulbShatterSound = useCallback(() => {
    playCustomEffect(.65, (ctx, output, t) => {

      // 1. High-voltage electrical arc crack
      const arcOsc = ctx.createOscillator();
      const arcGain = ctx.createGain();
      arcOsc.type = 'sawtooth';
      arcOsc.frequency.setValueAtTime(3200, t);
      arcOsc.frequency.exponentialRampToValueAtTime(120, t + 0.12);
      arcGain.gain.setValueAtTime(0.38, t);
      arcGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      arcOsc.connect(arcGain);
      arcGain.connect(output);
      arcOsc.start(t);
      arcOsc.stop(t + 0.13);

      // 2. High-frequency glass shatter noise burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.65);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.14));
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3200, t);
      filter.frequency.linearRampToValueAtTime(5500, t + 0.35);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.44, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.58);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(output);
      noiseSource.start(t);
      noiseSource.stop(t + 0.62);

      // 3. Low resonant "thump" of the pressurized glass envelope exploding
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(170, t);
      popOsc.frequency.exponentialRampToValueAtTime(30, t + 0.18);
      popGain.gain.setValueAtTime(0.5, t);
      popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.19);
      popOsc.connect(popGain);
      popGain.connect(output);
      popOsc.start(t);
      popOsc.stop(t + 0.2);
    });
  }, []);

  // Dull mechanical dud click when attempting to pull while bulb is repairing
  const playDudPullSound = useCallback(() => {
    playCustomEffect(.09, (ctx, output, t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.setValueAtTime(60, t + 0.05);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(output);
      osc.start(t);
      osc.stop(t + 0.09);
    });
  }, []);

  const repairHintTimerRef = useRef(null);

  const showRepairHint = useCallback(() => {
    setIsRepairHintActive(true);
    if (repairHintTimerRef.current) clearTimeout(repairHintTimerRef.current);
    repairHintTimerRef.current = setTimeout(() => {
      setIsRepairHintActive(false);
    }, 2400);
  }, []);

  useEffect(() => {
    return () => {
      if (repairHintTimerRef.current) clearTimeout(repairHintTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isBulbBroken) {
      setIsRepairHintActive(false);
      pullHistoryRef.current = [];
      hasExplodedRef.current = false;
    }
  }, [isBulbBroken]);

  // Trigger bulb explosion sequence
  const triggerBulbExplosion = useCallback(() => {
    if (isBulbBroken) return;
    playBulbShatterSound();
    breakBulb();
    showRepairHint();

    // Add violent whip reaction to the rope upon explosion
    const r = ropeRef.current;
    const last = r.pts[r.pts.length - 1];
    if (last) {
      last.px = last.x + (Math.random() > 0.5 ? 28 : -28);
      last.py = last.y + 38;
    }
    if (ropeRef.current?.wake) ropeRef.current.wake();
  }, [breakBulb, isBulbBroken, playBulbShatterSound, showRepairHint]);

  // Perform switch action
  const executeSwitch = useCallback(() => {
    if (isBulbBroken || hasExplodedRef.current) {
      playDudPullSound();
      showRepairHint();
      return;
    }

    const nextIsLight = isDark;
    playClickSound(nextIsLight);
    
    // Resolve exact bulb center coordinate for circular transition
    let bulbPos = null;
    if (typeof document !== 'undefined') {
      const bulbEl = document.getElementById('khushang-bulb-button') || document.querySelector('header button');
      if (bulbEl) {
        const rect = bulbEl.getBoundingClientRect();
        bulbPos = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
    }

    toggleTheme(bulbPos);
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 240);
  }, [isBulbBroken, isDark, playClickSound, playDudPullSound, showRepairHint, toggleTheme]);

  // Main Animation Frame Physics Loop
  useEffect(() => {
    let isMounted = true;

    const stopLoop = () => {
      runningRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };

    const loop = () => {
      if (!runningRef.current || !isMounted) return;

      const r = ropeRef.current;
      stepRope(r);

      const pts = r.pts;
      if (pts.length >= 2) {
        setRopePath(generateRopePath(pts));

        const a = pts[pts.length - 2];
        const b = pts[pts.length - 1];
        // Tangent angle of the final segment to tilt the handle naturally with the cord
        const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI - 90;
        const clampedAngle = Math.max(-42, Math.min(42, ang));

        // The handle position EXACTLY matches the rope endpoint b.x and b.y
        setHandleState({
          x: b.x,
          y: b.y,
          angle: clampedAngle
        });
      }

      // Check motion settlement: sleep when idle to consume 0% CPU
      let maxMove = 0;
      for (const q of pts) {
        maxMove = Math.max(maxMove, Math.abs(q.x - q.px), Math.abs(q.y - q.py));
      }

      if (!r.dragging && maxMove < 0.06) {
        r.quiet = (r.quiet || 0) + 1;
      } else {
        r.quiet = 0;
      }

      if (r.quiet > 50) {
        tightenRope(r, 1);
        for (const q of pts) {
          q.px = q.x;
          q.py = q.y;
        }
        stopLoop();
        return;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (runningRef.current || !isMounted) return;
      runningRef.current = true;
      ropeRef.current.quiet = 0;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    ropeRef.current.wake = wake;

    return () => {
      isMounted = false;
      stopLoop();
    };
  }, []);

  const wake = useCallback(() => {
    if (ropeRef.current?.wake) {
      ropeRef.current.wake();
    }
  }, []);

  // Handle pointer down (Mouse, Trackpad, Touch)
  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBulbBroken) {
      playDudPullSound();
      showRepairHint();
    }

    const r = ropeRef.current;
    const last = r.pts[r.pts.length - 1];
    if (!last) return;

    pointerDownTimeRef.current = Date.now();
    isDraggingRef.current = true;
    setIsDragging(true);
    hasCrossedThresholdRef.current = false;
    hasSwitchedThisPullRef.current = false;
    hasCycledThisPullRef.current = false;
    hasExplodedRef.current = false;
    currentPullYRef.current = 0;

    startCoordRef.current = { x: e.clientX, y: e.clientY };
    lastMoveTimeRef.current = Date.now();
    lastMovePosRef.current = { x: e.clientX, y: e.clientY };
    releaseVelocityRef.current = { vx: 0, vy: 0 };

    r.dragging = true;
    r.tx = last.x;
    r.ty = last.y;

    wake();

    const onPointerMove = (moveEv) => {
      if (!isDraggingRef.current) return;

      const now = Date.now();
      const dt = Math.max(1, now - lastMoveTimeRef.current);
      const vx = ((moveEv.clientX - lastMovePosRef.current.x) / dt) * 16;
      const vy = ((moveEv.clientY - lastMovePosRef.current.y) / dt) * 16;
      releaseVelocityRef.current = { vx, vy };
      lastMoveTimeRef.current = now;
      lastMovePosRef.current = { x: moveEv.clientX, y: moveEv.clientY };

      const deltaX = moveEv.clientX - startCoordRef.current.x;
      const deltaY = moveEv.clientY - startCoordRef.current.y;

      // Only pull down when deltaY > 0
      const pullY = Math.max(0, deltaY);
      currentPullYRef.current = pullY;
      const stretchAmount = Math.min(MAX_STRETCH, pullY * 0.88);
      const targetY = ANCHOR_Y + REST_ROPE_LENGTH + stretchAmount;
      // Generous left-right swing clearance: +/- 95px of natural lateral displacement
      const targetX = ANCHOR_X + Math.max(-95, Math.min(95, deltaX * 0.85));

      r.tx = targetX;
      r.ty = targetY;

      // 1. OVER-STRETCH BLOWOUT: only when pulled to extreme limit >= OVER_STRETCH_THRESHOLD (105px)
      if (stretchAmount >= OVER_STRETCH_THRESHOLD && !hasExplodedRef.current && !isBulbBroken) {
        hasExplodedRef.current = true;
        triggerBulbExplosion();
        wake();
        return;
      }

      // 2. IMMEDIATE THEME SWITCH: Switch when pulled past trigger length without waiting for release
      if (pullY >= PULL_TRIGGER_DISTANCE && !hasSwitchedThisPullRef.current) {
        hasSwitchedThisPullRef.current = true;
        hasCrossedThresholdRef.current = true;
        if (!isBulbBroken && !hasExplodedRef.current) {
          executeSwitch();
        } else if (isBulbBroken) {
          playDudPullSound();
          showRepairHint();
        }
      }

      // Reset switch trigger lock if user moves cord back up near resting position
      if (pullY < 8) {
        hasSwitchedThisPullRef.current = false;
        hasCycledThisPullRef.current = false;
      }

      // 3. Track frantic rapid pull cycles (only 5+ rapid yanks within 2.2s will blow fuse)
      if (pullY >= PULL_TRIGGER_DISTANCE + 8 && !hasCycledThisPullRef.current) {
        hasCycledThisPullRef.current = true;
        if (!isBulbBroken && !hasExplodedRef.current) {
          pullHistoryRef.current = pullHistoryRef.current.filter((t) => now - t < 2200);
          pullHistoryRef.current.push(now);

          if (pullHistoryRef.current.length >= 5) {
            hasExplodedRef.current = true;
            triggerBulbExplosion();
            pullHistoryRef.current = [];
          }
        }
      }

      wake();
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      const wasExploded = hasExplodedRef.current;
      const duration = Date.now() - pointerDownTimeRef.current;
      const deltaX = lastMovePosRef.current.x - startCoordRef.current.x;
      const deltaY = lastMovePosRef.current.y - startCoordRef.current.y;
      const isQuickClick = duration < 350 && Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12;
      const didSwitchMidPull = hasSwitchedThisPullRef.current;

      hasSwitchedThisPullRef.current = false;
      hasCrossedThresholdRef.current = false;
      hasCycledThisPullRef.current = false;
      hasExplodedRef.current = false;

      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      r.dragging = false;

      // Only perform action on release if it did NOT already switch mid-pull
      if (isBulbBroken || wasExploded) {
        if (!didSwitchMidPull && isQuickClick) {
          playDudPullSound();
          showRepairHint();
        }
      } else if (!didSwitchMidPull && isQuickClick) {
        // Quick click tap without dragging to pull length
        const lastPt = r.pts[r.pts.length - 1];
        if (lastPt) {
          lastPt.py = lastPt.y + 24;
          lastPt.px = lastPt.x - 3;
        }
        executeSwitch();
      }

      // Transfer release velocity or natural pendulum impulse upon release
      const last = r.pts[r.pts.length - 1];
      if (last) {
        const dx = last.x - ANCHOR_X;
        const throwVx = Math.max(-12, Math.min(12, releaseVelocityRef.current.vx * 0.55));
        // If pulled straight down with low lateral velocity, add a subtle natural swing impulse
        const naturalSwing = Math.abs(dx) < 2 
          ? (Math.random() > 0.5 ? 3.2 : -3.2) 
          : (dx * 0.1);

        last.px = last.x - (Math.abs(throwVx) > 0.8 ? throwVx : naturalSwing);
        last.py = last.y - Math.max(-8, Math.min(8, releaseVelocityRef.current.vy * 0.5));
      }

      wake();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Keyboard accessibility (Space or Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isBulbBroken) {
        playDudPullSound();
        showRepairHint();
        return;
      }
      const now = Date.now();
      pullHistoryRef.current = pullHistoryRef.current.filter((t) => now - t < 2200);
      pullHistoryRef.current.push(now);
      const isFrantic = pullHistoryRef.current.length >= 5;

      if (isFrantic) {
        triggerBulbExplosion();
        pullHistoryRef.current = [];
      } else {
        executeSwitch();
      }
      const last = ropeRef.current.pts[ropeRef.current.pts.length - 1];
      if (last) {
        last.py += 26;
        last.px -= 4;
      }
      wake();
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center select-none w-0 h-0"
      data-no-cursor="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
        UNIFIED PHYSICAL SVG CANVAS:
        Width 280px, Height 240px. Centered on anchor point at (140, 6).
        Gives 140px of clear space to both left and right for expansive swing arcs.
        Both the cord AND handle are rendered inside this SAME coordinate space,
        making it physically impossible for the handle to detach from the cord!
      */}
      <svg 
        width="280" 
        height="300" 
        viewBox="0 0 280 300"
        style={{
          position: 'absolute',
          top: 0,
          left: -ANCHOR_X,
          overflow: 'visible',
          pointerEvents: 'none'
        }}
        className="select-none z-20"
      >
        <defs>
          <filter id="handle-drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow 
              dx="0" 
              dy="3" 
              stdDeviation="3" 
              floodColor={isDark ? "rgba(255, 94, 26, 0.45)" : "rgba(0, 0, 0, 0.25)"} 
            />
          </filter>
        </defs>

        {/* 1. TOP ANCHOR MOUNT (Fixed to nameplate bottom - Never moves) */}
        <g id="top-anchor-mount">
          {/* Anodized Bracket */}
          <rect 
            x={ANCHOR_X - 8} 
            y={0} 
            width={16} 
            height={3.5} 
            rx={1} 
            fill="#ff5e1a" 
            className="transition-colors duration-300"
          />
          {/* Eyelet Ring */}
          <circle 
            cx={ANCHOR_X} 
            cy={ANCHOR_Y} 
            r={5} 
            fill="#ff5e1a" 
            className="transition-colors duration-300"
          />
          {/* Eyelet Hole: switches between dark black and light offwhite */}
          <circle 
            cx={ANCHOR_X} 
            cy={ANCHOR_Y} 
            r={2.2} 
            fill={isDark ? "#050505" : "#f4f4ee"} 
            className="transition-colors duration-300"
          />
        </g>

        {/* 2. BRAIDED ROPE CORD (Continuous physical path from anchor to handle) */}
        <g id="braided-cord">
          {/* Base Braided Cord Stroke: Consistent vivid brand orange in both themes */}
          <path
            d={ropePath}
            fill="none"
            stroke="#ff5e1a"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-colors duration-300"
          />
          {/* Textured Braided Flecks */}
          <path
            d={ropePath}
            fill="none"
            stroke={isDark ? "rgba(255, 235, 210, 0.45)" : "rgba(255, 255, 255, 0.55)"}
            strokeWidth="1.2"
            strokeDasharray="2.5 3.5"
            strokeLinecap="round"
          />
        </g>

        {/* 
          3. TACTILE KNURLED PULL HANDLE (Physically fused to rope endpoint [handleState.x, handleState.y])
          Renders at exact coordinates of rope tip in the SAME canvas. 0% chance of separation!
        */}
        <g 
          id="knurled-handle"
          transform={`translate(${handleState.x}, ${handleState.y}) rotate(${handleState.angle})`}
          data-no-cursor="true"
          className="cursor-grab active:cursor-grabbing pointer-events-auto outline-none"
          tabIndex={0}
          role="button"
          aria-label={
            isBulbBroken 
              ? `Light bulb broken. Repairing... ${bulbRepairCountdown}s remaining.` 
              : `Lamp pull rope. Currently ${isDark ? 'Dark Mode' : 'Light Mode'}. Pull down to switch.`
          }
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
        >
          {/* Generous hit area for effortless touch & pointer grab */}
          <rect 
            x={-24} 
            y={-8} 
            width={48} 
            height={56} 
            fill="#000000"
            fillOpacity={0.001}
            pointerEvents="all"
            className="cursor-grab active:cursor-grabbing"
          />

          {/* Metal Collar Cap (Enclosing the tip of the rope at 0, 0) */}
          <rect 
            x={-4.5} 
            y={-1} 
            width={9} 
            height={4} 
            rx={1.5} 
            fill="#ff7a3d" 
            className="transition-colors duration-300"
          />

          {/* Knurled Handle Body: Pure orange in both modes, white on flash */}
          <rect 
            x={-7.5} 
            y={3} 
            width={15} 
            height={28} 
            rx={5} 
            fill={isFlashing ? "#ffffff" : "#ff5e1a"} 
            filter="url(#handle-drop-shadow)"
            className="transition-colors duration-200"
          />

          {/* Tactile Lathe Knurling Grooves */}
          <line 
            x1={-5.5} 
            y1={10} 
            x2={5.5} 
            y2={10} 
            stroke="#c74006" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
          />
          <line 
            x1={-5.5} 
            y1={14} 
            x2={5.5} 
            y2={14} 
            stroke="#c74006" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
          />
          <line 
            x1={-5.5} 
            y1={18} 
            x2={5.5} 
            y2={18} 
            stroke="#c74006" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
          />

          {/* Contrasting Bottom Jewel: offwhite in light mode, deep black in dark mode */}
          <circle 
            cx={0} 
            cy={24} 
            r={3.2} 
            fill={isFlashing ? "#ffffff" : (isDark ? "#050505" : "#f4f4ee")} 
            stroke="#ff7a3d" 
            strokeWidth={0.8}
            className="transition-colors duration-200"
          />

          {/* Micro Down Arrow Indicator */}
          <text 
            x={0} 
            y={40} 
            textAnchor="middle" 
            fontSize={9} 
            fontFamily="ui-monospace, monospace" 
            fontWeight="bold"
            fill="#ff5e1a" 
            opacity={isHovered ? 0.9 : 0.4}
            className="transition-opacity duration-200 pointer-events-none"
          >
            ↓
          </text>
        </g>
      </svg>

      {/* 4. APPEARANCE ROPE TOOLTIP HINT (Visible on load for ~2.6s, on hover or when repairing) */}
      <div 
        className={`absolute left-7 top-[60px] whitespace-nowrap pointer-events-none transition-all duration-500 z-30 ${
          isHovered || initialHintVisible || (isBulbBroken && (isRepairHintActive || isHovered))
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-2'
        }`}
      >
        <div 
          className={`relative px-3 py-1.5 rounded-lg shadow-xl border backdrop-blur-md flex items-center font-sans font-bold text-xs tracking-tight select-none transition-colors duration-300 ${
            isDark 
              ? 'bg-[#0a0a0a]/95 text-[#ff5e1a] border-[#ff5e1a]/40 shadow-black/80' 
              : 'bg-white/95 text-[#ff5e1a] border-[#ff5e1a]/30 shadow-black/10'
          }`}
        >
          {/* Triangular Outward Pointed Beak pointing towards the rope on the left */}
          <div 
            className={`absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-l border-b transition-colors duration-300 ${
              isDark 
                ? 'bg-[#0a0a0a] border-[#ff5e1a]/40' 
                : 'bg-white border-[#ff5e1a]/30'
            }`} 
          />

          <span className="relative z-10 leading-none">
            {isBulbBroken 
              ? (bulbRepairCountdown > 0 ? `Repairing bulb... ${bulbRepairCountdown}s` : 'Repairing bulb...')
              : (isDark ? 'Pull for Light' : 'Pull for Dark')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LampPullRope;
