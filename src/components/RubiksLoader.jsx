import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';
import { useTheme } from '../context/ThemeContext';

/**
 * RubiksLoader Component
 * 
 * 3D Rubik's Cube animated solver loader.
 * Color Palette: Bespoke anodized metallic orange shades (matching vinyl player base & selected works),
 * brushed liquid platinum, champagne titanium, and obsidian black chrome.
 * Only displays when an operation takes longer than the delay threshold (e.g. 450ms).
 */
export default function RubiksLoader() {
  const { isLoading, loadingMessage } = useLoading();
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (!isLoading || !stageRef.current) return;

    let isDisposed = false;
    let animFrameId = null;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(5.8, 5.0, 7.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

    // Studio Environment Map for authentic metallic reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;

    const stageEl = stageRef.current;
    stageEl.appendChild(renderer.domElement);

    // Lights - High-contrast studio lighting tuned for metallic luster
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    // Key directional light: crisp white specular highlight
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    // Warm metallic rim light: deep anodized orange sheen (matching vinyl base & selected works)
    const rimLight = new THREE.DirectionalLight(0xff7a38, 1.8);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Specular fill light
    const fillLight = new THREE.PointLight(0xffeedd, 1.2);
    fillLight.position.set(0, -4, 5);
    scene.add(fillLight);

    // Container Groups
    const world = new THREE.Group();
    scene.add(world);

    const cubeRoot = new THREE.Group();
    world.add(cubeRoot);

    // --- 2. BESPOKE ANODIZED METALLIC PALETTE ---
    // Matches the anodized aluminum turntable base and selected works orange gradients
    const COLORS = {
      U: 0xf4f7fb, // Up    → Brushed Platinum / Liquid Silver White
      D: 0xe8e2d8, // Down  → Satin Champagne Titanium White
      L: 0xff5e1a, // Left  → Signature Brand Vibrant Anodized Orange
      R: 0xc73c02, // Right → Deep Metallic Terracotta / Burnt Orange Plinth
      F: 0xff7a38, // Front → Luminous Amber Gold Anodized Orange
      B: 0x14151a, // Back  → Obsidian Gunmetal / Black Chrome
      BODY: 0x0c0d12, // Brushed Dark Titanium Core
      EDGE: 0x3a3f50    // Subtle metallic structural seam
    };

    const cubieSize = 0.96;
    const gap = 1.02;
    const stickerSize = 0.84;
    const stickerLift = 0.02;

    const bodyGeom = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);
    const bodyMat = new THREE.MeshPhysicalMaterial({ 
      color: COLORS.BODY, 
      roughness: 0.35, 
      metalness: 0.85,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25
    });

    const cubelets = [];

    // Metallic anodized sticker material with clearcoat lacquer sheen
    function makeSticker(color) {
      const g = new THREE.PlaneGeometry(stickerSize, stickerSize);
      return new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({
        color, 
        roughness: 0.20, // Silky satin metallic sheen
        metalness: 0.84, // Strong anodized metal response matching vinyl player & selected works
        clearcoat: 0.65, // Rich lacquer / clear anodized protective layer
        clearcoatRoughness: 0.15,
        reflectivity: 0.95
      }));
    }

    function addStickers(mesh, x, y, z) {
      const off = cubieSize / 2 + stickerLift;
      if (x === +1) { const s = makeSticker(COLORS.R); s.position.x = +off; s.rotation.y = -Math.PI / 2; mesh.add(s); }
      if (x === -1) { const s = makeSticker(COLORS.L); s.position.x = -off; s.rotation.y = +Math.PI / 2; mesh.add(s); }
      if (y === +1) { const s = makeSticker(COLORS.U); s.position.y = +off; s.rotation.x = -Math.PI / 2; mesh.add(s); }
      if (y === -1) { const s = makeSticker(COLORS.D); s.position.y = -off; s.rotation.x = +Math.PI / 2; mesh.add(s); }
      if (z === +1) { const s = makeSticker(COLORS.F); s.position.z = +off; mesh.add(s); }
      if (z === -1) { const s = makeSticker(COLORS.B); s.position.z = -off; s.rotation.y = Math.PI; mesh.add(s); }
    }

    function buildCube() {
      while (cubeRoot.children.length) cubeRoot.remove(cubeRoot.children[0]);
      cubelets.length = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const body = new THREE.Mesh(bodyGeom, bodyMat.clone());
            body.position.set(x * gap, y * gap, z * gap);
            body.add(new THREE.LineSegments(
              new THREE.EdgesGeometry(bodyGeom),
              new THREE.LineBasicMaterial({ color: COLORS.EDGE, transparent: true, opacity: 0.5 })
            ));
            addStickers(body, x, y, z);
            cubeRoot.add(body);
            cubelets.push({ mesh: body });
          }
        }
      }
    }

    buildCube();

    // --- 3. TRANSFORMS & MOVES ---
    const AXIS = { U: 'y', D: 'y', L: 'x', R: 'x', F: 'z', B: 'z' };
    const LAYER = { U: +1, D: -1, L: -1, R: +1, F: +1, B: -1 };
    const BASE  = { U: -1, D: +1, L: +1, R: -1, F: -1, B: +1 };
    const VEC   = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

    const idx = (v) => Math.round(v / gap);
    const onLayer = (m, axis, layer) => idx(m.position[axis]) === layer;

    function selectLayer(axis, layer) {
      return cubelets.filter(c => onLayer(c.mesh, axis, layer));
    }

    function moveSpec(tok) {
      const f = tok[0], axis = AXIS[f], layer = LAYER[f];
      const mult = tok.endsWith("2") ? 2 : 1;
      const prime = tok.endsWith("'") ? -1 : 1;
      const angle = BASE[f] * prime * (Math.PI / 2) * mult;
      return { axis, layer, angle };
    }

    function snapCubie(m) {
      m.position.set(idx(m.position.x) * gap, idx(m.position.y) * gap, idx(m.position.z) * gap);
      const q = Math.PI / 2;
      m.rotation.x = Math.round(m.rotation.x / q) * q;
      m.rotation.y = Math.round(m.rotation.y / q) * q;
      m.rotation.z = Math.round(m.rotation.z / q) * q;
    }

    function applyMove(token, duration) {
      return new Promise(resolve => {
        if (isDisposed) return resolve();
        const { axis, layer, angle } = moveSpec(token);
        const parts = selectLayer(axis, layer);
        const g = new THREE.Group();
        cubeRoot.add(g);
        parts.forEach(p => g.attach(p.mesh));

        const axisVec = VEC[axis];
        const start = performance.now();
        const baseRot = g.rotation.clone();

        function anim(now) {
          if (isDisposed) {
            cubeRoot.remove(g);
            return resolve();
          }
          const t = Math.min(1, (now - start) / duration);
          const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          g.rotation.copy(baseRot);
          g.rotateOnAxis(axisVec, angle * e);
          renderer.render(scene, camera);

          if (t < 1) {
            requestAnimationFrame(anim);
          } else {
            while (g.children.length) {
              const m = g.children[0];
              cubeRoot.attach(m);
              snapCubie(m);
            }
            cubeRoot.remove(g);
            resolve();
          }
        }
        requestAnimationFrame(anim);
      });
    }

    // Move Generator
    const FACES = ["U", "D", "L", "R", "F", "B"];
    const AX_OF = { U: 'y', D: 'y', L: 'x', R: 'x', F: 'z', B: 'z' };

    function generateScramble(count = 10) {
      const out = [];
      let prev = null;
      for (let i = 0; i < count; i++) {
        let f;
        do { f = FACES[(Math.random() * FACES.length) | 0]; } while (AX_OF[f] === prev);
        prev = AX_OF[f];
        const suf = Math.random() < 0.5 ? "" : (Math.random() < 0.5 ? "'" : "2");
        out.push(f + suf);
      }
      return out;
    }

    const inverseMoves = (arr) => arr.slice().reverse().map(t => t.endsWith("2") ? t : (t.endsWith("'") ? t.slice(0, -1) : t + "'"));

    // Continuous Solving Loop
    let isLoopRunning = true;
    async function loopSolver() {
      const MOVE_SPEED = 145; // Smooth, snappy solving turn rate
      while (isLoopRunning && !isDisposed) {
        const scramble = generateScramble(9);
        for (const m of scramble) {
          if (!isLoopRunning || isDisposed) return;
          await applyMove(m, MOVE_SPEED);
        }
        await new Promise(r => setTimeout(r, 220));

        const solveMoves = inverseMoves(scramble);
        for (const m of solveMoves) {
          if (!isLoopRunning || isDisposed) return;
          await applyMove(m, MOVE_SPEED);
        }
        // Satisfying hold on solved state
        await new Promise(r => setTimeout(r, 700));
      }
    }

    loopSolver();

    // --- 4. RESIZE & ORBIT CONTROLS ---
    function fit() {
      if (!stageEl) return;
      const w = stageEl.clientWidth || 220;
      const h = stageEl.clientHeight || 220;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    fit();
    window.addEventListener('resize', fit, { passive: true });

    let autoRotate = true;
    let dragging = false;
    let last = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      dragging = true;
      autoRotate = false;
      last = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      world.rotation.y += dx * 0.007;
      world.rotation.x += dy * 0.005;
    };

    const onPointerUp = () => {
      dragging = false;
      setTimeout(() => { autoRotate = true; }, 1400);
    };

    stageEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Render loop
    function render() {
      if (isDisposed) return;
      if (autoRotate) {
        world.rotation.y += 0.005;
        world.rotation.x += 0.002;
      }
      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(render);
    }
    render();

    // Cleanup
    return () => {
      isDisposed = true;
      isLoopRunning = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', fit);
      stageEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      pmremGenerator.dispose();
      envMap.dispose();
      renderer.dispose();
      while (stageEl.firstChild) {
        stageEl.removeChild(stageEl.firstChild);
      }
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing pointer-events-auto"
          style={{
            backgroundColor: isDark ? 'rgba(5, 5, 5, 0.82)' : 'rgba(248, 248, 245, 0.85)'
          }}
        >
          {/* 3D Rubik's Cube Stage */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="relative flex items-center justify-center"
          >
            <div 
              ref={stageRef} 
              className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] flex items-center justify-center pointer-events-auto"
            />
          </motion.div>

          {/* Clean Bespoke Loading Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className={`mt-4 px-3.5 py-1.5 rounded-lg border backdrop-blur-md shadow-xl flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider ${
              isDark 
                ? 'bg-[#121318]/90 text-[#ff5e1a] border-white/10' 
                : 'bg-white/95 text-[#ff5e1a] border-black/10'
            }`}
          >
            <span className="font-semibold tracking-widest">
              {loadingMessage || 'Solving Architecture'}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
