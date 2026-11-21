import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Minus, Square, Terminal, Code2, Sparkles, Music2, 
  Gamepad2, Box, MessageSquare, BookOpen, Trophy, 
  ExternalLink, Play, Pause, SkipForward, Volume2, 
  Layers, CheckCircle2, ChevronRight, Send, Search,
  Flame, Wifi, Battery, Clock, Compass, Power
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function MonitorOS({ onCloseZone }) {
  const { isDark } = useTheme();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isPoweringOff, setIsPoweringOff] = useState(false);
  
  // Day apps: figma, vscode, gemini, illustrator, spotify
  // Night apps: steam, blender, discord, otakucircle, sports
  const defaultApp = isDark ? 'steam' : 'vscode';
  const [activeApp, setActiveApp] = useState(defaultApp);
  const [openApps, setOpenApps] = useState([defaultApp]);
  const [isMaximized, setIsMaximized] = useState(false);

  // Gemini chat interactive state
  const [geminiMessages, setGeminiMessages] = useState([
    { role: 'assistant', text: 'Hey Khushang! Systems are nominal. What interface or architecture challenge are we tackling right now?' }
  ]);
  const [geminiInput, setGeminiInput] = useState('');

  // Code editor tabs
  const [codeFile, setCodeFile] = useState('Hero.jsx');

  // Spotify player state
  const [isPlayingSpotify, setIsPlayingSpotify] = useState(true);

  // Broadcast monitor view lifecycle to remove music button & name bulb in global header
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('monitor-view-open'));
    return () => {
      window.dispatchEvent(new CustomEvent('monitor-view-close'));
    };
  }, []);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Graceful power off transition back to studio
  const handlePowerOff = () => {
    setIsPoweringOff(true);
    window.dispatchEvent(new CustomEvent('monitor-view-close'));
    setTimeout(() => {
      if (onCloseZone) onCloseZone();
    }, 280);
  };

  // Escape key powers off and exits cleanly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handlePowerOff();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When theme changes, switch default if current app belongs to opposite theme
  useEffect(() => {
    const nextApp = isDark ? 'steam' : 'vscode';
    setActiveApp(nextApp);
    setOpenApps(prev => prev.includes(nextApp) ? prev : [...prev, nextApp]);
  }, [isDark]);

  const handleLaunchApp = (appId) => {
    if (!openApps.includes(appId)) {
      setOpenApps([...openApps, appId]);
    }
    setActiveApp(appId);
  };

  const handleCloseApp = (appId, e) => {
    e?.stopPropagation();
    const updated = openApps.filter(id => id !== appId);
    setOpenApps(updated);
    if (activeApp === appId) {
      setActiveApp(updated.length > 0 ? updated[updated.length - 1] : null);
    }
  };

  const handleSendGemini = (e) => {
    e?.preventDefault();
    if (!geminiInput.trim()) return;
    const userText = geminiInput.trim();
    setGeminiMessages(prev => [...prev, { role: 'user', text: userText }]);
    setGeminiInput('');

    setTimeout(() => {
      let reply = "Analyzing viewport physics: Consider using Framer Motion springs with stiffness: 240, damping: 28 for zero-overshoot tactile snap.";
      if (userText.toLowerCase().includes('color') || userText.toLowerCase().includes('orange')) {
        reply = "Recommended palette token: #FF5E1A for laser accents against #121319 obsidian ground. High contrast, WCAG AA compliant.";
      } else if (userText.toLowerCase().includes('anime') || userText.toLowerCase().includes('manga')) {
        reply = "OtakuCircle database sync: Jujutsu Kaisen chapter 271 cached. Blender 3D rigged model ready for animation render.";
      }
      setGeminiMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 700);
  };

  // Day App Definitions
  const dayApps = [
    { id: 'figma', name: 'Figma', icon: Layers, color: '#F24E1E', label: 'Design Tokens' },
    { id: 'vscode', name: 'VS Code', icon: Code2, color: '#007ACC', label: 'React Engine' },
    { id: 'gemini', name: 'Gemini AI', icon: Sparkles, color: '#8E75FF', label: 'Spatial AI' },
    { id: 'illustrator', name: 'Illustrator', icon: Compass, color: '#FF9A00', label: 'Vector Studio' },
    { id: 'spotify', name: 'Spotify', icon: Music2, color: '#1DB954', label: 'Lo-Fi Chill' },
  ];

  // Night App Definitions
  const nightApps = [
    { id: 'steam', name: 'Steam Rig', icon: Gamepad2, color: '#1B2838', label: 'Cyberpunk / 144 FPS' },
    { id: 'blender', name: 'Blender 3D', icon: Box, color: '#EA7600', label: 'Viewport Shading' },
    { id: 'discord', name: 'Discord', icon: MessageSquare, color: '#5865F2', label: '#dev-guild' },
    { id: 'otakucircle', name: 'OtakuCircle', icon: BookOpen, color: '#FF5E1A', label: 'Manga Vault' },
    { id: 'sports', name: 'NBA & Vball', icon: Trophy, color: '#1D428A', label: 'Live Court Feeds' },
  ];

  const currentDockApps = isDark ? nightApps : dayApps;

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden select-none"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 50% 30%, #151828 0%, #0c0d14 60%, #06070a 100%)'
          : 'radial-gradient(ellipse at 50% 20%, #f1ede6 0%, #e5dfd5 60%, #cfc7bc 100%)'
      }}
    >
      {/* Subtle Background Grid Mesh */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,94,26,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

          {/* ==============================================================
          TOP SYSTEM STATUS BAR (EDGE-TO-EDGE)
          ============================================================== */}
      <div className={`w-full h-8 sm:h-9 px-3 sm:px-5 flex items-center justify-between text-[11px] sm:text-xs font-mono backdrop-blur-md border-b z-40 shrink-0 ${
        isDark 
          ? 'bg-black/60 border-white/10 text-white/80' 
          : 'bg-white/70 border-black/10 text-neutral-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-[#ff5e1a]">
            <span className="w-2 h-2 rounded-full bg-[#ff5e1a] animate-pulse" />
            <span>STUDIO OS</span>
          </div>
          <span className="opacity-30">/</span>
          <span className="hidden sm:inline font-sans opacity-75">
            {isDark ? 'Night Creativity & Gaming Rig' : 'Daylight Engineering & Design Suite'}
          </span>
        </div>

        {/* Center: Active Application Indicator */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-sans font-medium px-3 py-0.5 rounded-full bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Workspace:</span>
          <span className="font-bold uppercase tracking-wider text-[#ff5e1a]">
            {activeApp || 'Desktop'}
          </span>
        </div>

        {/* Right: Network, Battery, Clock, and POWER OFF BUTTON */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 opacity-80">
            <Wifi className="w-3.5 h-3.5 text-[#ff5e1a]" />
            <span className="hidden sm:inline">1.2 Gbps</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">100%</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5 text-[#ff5e1a]" />
            <span>{time}</span>
          </div>

          {/* DEDICATED POWER OFF / SHUT DOWN BUTTON */}
          <button
            onClick={handlePowerOff}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/15 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 hover:border-transparent transition-all font-mono text-[11px] font-bold cursor-pointer group shadow-xs active:scale-95 ml-1"
            title="Power off monitor and exit to Studio"
          >
            <Power className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Power Off</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          DESKTOP WINDOW WORKSPACE (EDGE-TO-EDGE FLUID STAGE)
          ============================================================== */}
      <div className="relative flex-1 w-full p-2 sm:p-4 md:p-6 overflow-hidden flex items-center justify-center">
        
        <AnimatePresence mode="wait">
          {activeApp && (
            <motion.div
              key={activeApp}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ type: 'spring', damping: 26, stiffness: 290 }}
              className={`relative w-full transition-all duration-300 ${
                isMaximized 
                  ? 'h-full max-w-none rounded-xl' 
                  : 'max-w-[1240px] h-[92%] max-h-[820px] rounded-2xl'
              } shadow-2xl border flex flex-col overflow-hidden backdrop-blur-xl ${
                isDark 
                  ? 'bg-[#10121a]/95 border-white/15 text-white' 
                  : 'bg-white/95 border-black/15 text-neutral-900 shadow-neutral-900/10'
              }`}>
                  {/* Window Chrome Titlebar */}
                  <div className={`h-8 sm:h-9 px-3 flex items-center justify-between border-b shrink-0 ${
                    isDark ? 'bg-white/[0.04] border-white/10' : 'bg-black/[0.03] border-black/10'
                  }`}>
                    {/* Traffic Light Window Controls */}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={(e) => handleCloseApp(activeApp, e)}
                        className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] hover:brightness-125 transition-all"
                        title="Close Window"
                      />
                      <button 
                        onClick={() => setActiveApp(null)}
                        className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] hover:brightness-125 transition-all"
                        title="Minimize"
                      />
                      <button 
                        onClick={() => setIsMaximized(!isMaximized)}
                        className="w-2.5 h-2.5 rounded-full bg-[#27C93F] hover:brightness-125 transition-all"
                        title="Toggle Size"
                      />
                      <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5e1a]">
                        {activeApp}
                      </span>
                    </div>

                    <div className="font-mono text-[9px] sm:text-[10px] opacity-60 truncate px-2">
                      {isDark ? `Khushang ~ NightLab / ${activeApp}` : `Khushang ~ CreativeSuite / ${activeApp}`}
                    </div>

                    <div className="w-12 flex justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Window Interactive Content Body */}
                  <div className="flex-1 overflow-auto p-3 sm:p-4 font-sans text-xs">
                    
                    {/* APP 1: FIGMA (Day) */}
                    {activeApp === 'figma' && (
                      <div className="h-full flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b pb-2 border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#F24E1E]/20 text-[#F24E1E] font-mono font-bold text-[10px]">DESIGN TOKENS</span>
                            <span className="font-bold">Portfolio 2.0 Design System</span>
                          </div>
                          <span className="font-mono text-[10px] opacity-60">100% Zoom · Master Canvas</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { name: 'Plinth Orange', hex: '#FF5E1A', role: 'Brand Core' },
                            { name: 'Obsidian Ground', hex: '#121319', role: 'Dark Surface' },
                            { name: 'Machined Chrome', hex: '#CBD5E1', role: 'Specular Sheen' },
                            { name: 'Parchment Warm', hex: '#F4F4EE', role: 'Light Ground' },
                          ].map((token) => (
                            <div key={token.name} className="p-2.5 rounded-lg border border-white/10 bg-white/5 flex flex-col gap-1.5">
                              <div className="w-full h-8 rounded" style={{ backgroundColor: token.hex }} />
                              <div className="font-bold text-[11px] truncate">{token.name}</div>
                              <div className="font-mono text-[9px] text-[#ff5e1a]">{token.hex}</div>
                              <div className="text-[9px] opacity-50">{token.role}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 rounded-lg border border-white/10 bg-black/20 p-3 flex flex-col justify-center items-center gap-2 text-center">
                          <div className="font-mono text-xs font-bold text-[#ff5e1a]">Tactile Mechanical Switch Prototype</div>
                          <div className="text-gray-400 text-[11px] max-w-md">Real-time spring physics: Mass 0.85, Damping 22, Zero layout jank. Bespoke SVG shaders for 3D depth without AI boilerplate.</div>
                        </div>
                      </div>
                    )}

                    {/* APP 2: VS CODE / REACT (Day) */}
                    {activeApp === 'vscode' && (
                      <div className="h-full flex flex-col gap-2 font-mono">
                        <div className="flex items-center gap-1 border-b border-white/10 pb-1 text-[10px]">
                          {['Hero.jsx', 'VinylPlayer.jsx', 'GymBadgeCase.jsx'].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setCodeFile(tab)}
                              className={`px-2.5 py-1 rounded-t flex items-center gap-1.5 ${
                                codeFile === tab 
                                  ? 'bg-[#ff5e1a]/20 text-[#ff5e1a] font-bold border-b-2 border-[#ff5e1a]' 
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                            >
                              <Code2 className="w-3 h-3" />
                              <span>{tab}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex-1 bg-black/40 rounded-lg p-3 text-[10.5px] leading-relaxed overflow-x-auto text-emerald-400">
                          {codeFile === 'Hero.jsx' && (
                            <pre className="text-white/90">
                              <span className="text-purple-400">export default function</span> <span className="text-yellow-300">StudioWorld</span>() &#123;<br />
                              &nbsp;&nbsp;<span className="text-blue-400">const</span> [activeZone, setActiveZone] = <span className="text-yellow-300">useState</span>(<span className="text-orange-400">null</span>);<br />
                              &nbsp;&nbsp;<span className="text-gray-500">// Real 3D camera dive coordinate transforms</span><br />
                              &nbsp;&nbsp;<span className="text-purple-400">const</span> cameraTarget = activeZone ? activeZone.coords : &#123; scale: <span className="text-orange-400">1</span> &#125;;<br />
                              &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br />
                              &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">motion.div</span> <span className="text-blue-300">animate</span>=&#123;cameraTarget&#125; <span className="text-blue-300">transition</span>=&#123;springDamped&#125;&gt;<br />
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-yellow-300">BattlestationMonitor</span> /&gt;<br />
                              &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-400">motion.div</span>&gt;<br />
                              &nbsp;&nbsp;);<br />
                              &#125;
                            </pre>
                          )}
                          {codeFile !== 'Hero.jsx' && (
                            <pre className="text-white/90">
                              <span className="text-purple-400">import</span> &#123; <span className="text-yellow-300">useTheme</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'../context/ThemeContext'</span>;<br />
                              <span className="text-gray-500">// Precision High-Fi Plinth Gradients</span><br />
                              <span className="text-blue-400">const</span> orangeGradient = <span className="text-emerald-300">'#ff7a3d -&gt; #ff5e1a -&gt; #c73c02'</span>;<br />
                              <span className="text-blue-400">const</span> machinedChrome = <span className="text-emerald-300">'#ffffff -&gt; #94a3b8 -&gt; #334155'</span>;<br />
                            </pre>
                          )}
                        </div>
                        <div className="h-6 px-2 rounded bg-black/60 flex items-center justify-between text-[9px] text-gray-400">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400">● Live Dev Server</span>
                            <span>vite: 5173</span>
                            <span>0 lint errors</span>
                          </div>
                          <span>UTF-8 · JavaScript React</span>
                        </div>
                      </div>
                    )}

                    {/* APP 3: GEMINI AI (Day) */}
                    {activeApp === 'gemini' && (
                      <div className="h-full flex flex-col gap-2.5">
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                          {geminiMessages.map((msg, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2.5 rounded-lg max-w-[85%] ${
                                msg.role === 'user' 
                                  ? 'ml-auto bg-[#ff5e1a] text-white' 
                                  : 'bg-white/10 text-white/90 border border-white/10'
                              }`}
                            >
                              <div className="font-mono text-[9px] opacity-75 mb-1 uppercase font-bold">
                                {msg.role === 'user' ? 'Khushang' : 'Gemini 2.5 Pro'}
                              </div>
                              <div className="text-[11px] leading-relaxed">{msg.text}</div>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendGemini} className="flex gap-2 pt-1 border-t border-white/10">
                          <input 
                            type="text"
                            value={geminiInput}
                            onChange={(e) => setGeminiInput(e.target.value)}
                            placeholder="Ask Gemini research engine or design query..."
                            className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#ff5e1a]"
                          />
                          <button 
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#ff5e1a] text-white font-bold font-mono text-xs flex items-center gap-1.5 hover:brightness-110"
                          >
                            <Send className="w-3 h-3" />
                            <span>Ask</span>
                          </button>
                        </form>
                      </div>
                    )}

                    {/* APP 4: ILLUSTRATOR (Day) */}
                    {activeApp === 'illustrator' && (
                      <div className="h-full flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b pb-2 border-white/10">
                          <span className="font-mono font-bold text-[#FF9A00]">VECTOR ARTBOARD: Monogram_Badge.svg</span>
                          <span className="font-mono text-[10px] opacity-60">Path: 14 Nodes · Bezier Smooth</span>
                        </div>
                        <div className="flex-1 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center p-4">
                          <svg viewBox="0 0 100 100" className="w-32 h-32">
                            <defs>
                              <linearGradient id="ill_orange" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#FF7A3D" />
                                <stop offset="100%" stopColor="#C73C02" />
                              </linearGradient>
                            </defs>
                            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="url(#ill_orange)" strokeWidth="3" />
                            <circle cx="50" cy="50" r="28" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2" />
                            <path d="M40 35 L40 65 M40 50 L60 35 M40 50 L60 65" stroke="#FF5E1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* APP 5: SPOTIFY (Day) */}
                    {activeApp === 'spotify' && (
                      <div className="h-full flex flex-col justify-between p-2">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#1DB954] to-black flex items-center justify-center text-white shadow-lg">
                            <Music2 className="w-10 h-10" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[#1DB954] font-mono text-[10px] font-bold uppercase tracking-wider">NOW PLAYING · FLOW STATE</span>
                            <span className="font-bold text-sm sm:text-base">Tokyo Twilight Chill Beats</span>
                            <span className="text-gray-400 text-xs">Japanese City Pop &amp; Bad Bunny Lo-Fi Reworks</span>
                          </div>
                        </div>
                        <div className="w-full bg-black/40 rounded-xl p-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between font-mono text-[10px] text-gray-400">
                            <span>02:14</span>
                            <div className="h-1 flex-1 mx-3 rounded-full bg-white/20 overflow-hidden">
                              <div className="h-full w-[65%] bg-[#1DB954] rounded-full" />
                            </div>
                            <span>03:45</span>
                          </div>
                          <div className="flex items-center justify-center gap-4">
                            <button 
                              onClick={() => setIsPlayingSpotify(!isPlayingSpotify)}
                              className="w-8 h-8 rounded-full bg-[#1DB954] text-black flex items-center justify-center font-bold hover:scale-105 transition-transform"
                            >
                              {isPlayingSpotify ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                            </button>
                            <span className="font-mono text-[10px] text-gray-400">320kbps Lossless Audio</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* NIGHT APPS */}
                    {/* ========================================================= */}

                    {/* APP 6: STEAM (Night) */}
                    {activeApp === 'steam' && (
                      <div className="h-full flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b pb-2 border-white/10">
                          <span className="font-mono font-bold text-[#ff5e1a]">STEAM RIG // RTX 4090 OC</span>
                          <span className="font-mono text-[10px] text-emerald-400">● 144 FPS Stable · 4K Ultrawide</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            { title: 'Cyberpunk 2077', hours: '240 hrs', tag: 'Ray Tracing Overdrive' },
                            { title: 'Elden Ring', hours: '185 hrs', tag: 'Level 180 Dex/Int' },
                            { title: 'Valorant', hours: '320 hrs', tag: 'Competitive Immortal' },
                          ].map((game) => (
                            <div key={game.title} className="p-3 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
                              <div>
                                <div className="font-bold text-xs text-white">{game.title}</div>
                                <div className="text-[10px] text-[#ff5e1a] font-mono">{game.tag}</div>
                              </div>
                              <div className="mt-2 text-[9px] text-gray-400">{game.hours} logged</div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 rounded-lg bg-[#ff5e1a]/10 border border-[#ff5e1a]/30 flex items-center justify-between">
                          <span className="font-mono text-xs">Ready to launch Night Gaming Session</span>
                          <button className="px-3 py-1 rounded bg-[#ff5e1a] text-white font-mono text-[10px] font-bold">READY</button>
                        </div>
                      </div>
                    )}

                    {/* APP 7: BLENDER 3D (Night) */}
                    {activeApp === 'blender' && (
                      <div className="h-full flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b pb-1.5 border-white/10">
                          <span className="font-mono font-bold text-[#EA7600]">BLENDER 4.2 // Turntable_Shader.blend</span>
                          <span className="font-mono text-[10px] text-gray-400">Cycles Render · 512 Samples</span>
                        </div>
                        <div className="flex-1 rounded-lg bg-black/50 border border-white/10 flex flex-col items-center justify-center p-3 relative overflow-hidden">
                          <div className="text-center space-y-1">
                            <Box className="w-12 h-12 mx-auto text-[#EA7600] animate-spin" style={{ animationDuration: '14s' }} />
                            <div className="font-mono text-xs text-white font-bold">Viewport Shading: Metallic Roughness 0.12</div>
                            <div className="font-mono text-[10px] text-gray-400">Anisotropic reflections mapped to vinyl turntable spindle</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* APP 8: DISCORD (Night) */}
                    {activeApp === 'discord' && (
                      <div className="h-full flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b pb-1.5 border-white/10 text-[10px]">
                          <span className="font-bold text-[#5865F2]">#dev-guild · Otaku Discord Server</span>
                          <span className="text-emerald-400 font-mono">14 Members Online</span>
                        </div>
                        <div className="flex-1 bg-black/40 rounded-lg p-2.5 space-y-2 overflow-y-auto font-mono text-[10px]">
                          <div className="text-gray-300"><span className="text-[#5865F2] font-bold">@alex:</span> did you push the new camera dive animation?</div>
                          <div className="text-gray-300"><span className="text-[#ff5e1a] font-bold">@khushang:</span> just shipped. 3D perspective scales straight into the ultrawide screen with zero lag.</div>
                          <div className="text-gray-300"><span className="text-purple-400 font-bold">@maya:</span> the day/night dock switch is clean af!</div>
                        </div>
                      </div>
                    )}

                    {/* APP 9: OTAKUCIRCLE (Night) */}
                    {activeApp === 'otakucircle' && (
                      <div className="h-full flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b pb-1.5 border-white/10">
                          <span className="font-mono font-bold text-[#ff5e1a]">OTAKUCIRCLE // MANGA ARCHIVE</span>
                          <span className="font-mono text-[10px] text-gray-400">Khushang's Curated Reading Vault</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                          {[
                            { title: 'Jujutsu Kaisen', ch: 'Ch. 271', status: 'Completed' },
                            { title: 'Chainsaw Man', ch: 'Part 2', status: 'Reading' },
                            { title: 'Berserk', ch: 'Vol. 42', status: 'Masterpiece' },
                            { title: 'Vagabond', ch: 'Vol. 37', status: 'Legendary' },
                          ].map((manga) => (
                            <div key={manga.title} className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
                              <div className="font-bold text-[11px] text-white">{manga.title}</div>
                              <div className="flex items-center justify-between text-[9px] font-mono mt-2">
                                <span className="text-[#ff5e1a]">{manga.ch}</span>
                                <span className="text-emerald-400">{manga.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* APP 10: SPORTS BROADCASTS (Night) */}
                    {activeApp === 'sports' && (
                      <div className="h-full flex flex-col gap-2.5">
                        <div className="flex items-center justify-between border-b pb-1.5 border-white/10">
                          <span className="font-mono font-bold text-[#1D428A]">LIVE SPORTS FEEDS · COURT HIGHLIGHTS</span>
                          <span className="font-mono text-[10px] text-red-500 animate-pulse font-bold">● LIVE REC</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                          <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
                            <div>
                              <div className="text-[10px] font-mono text-[#ff5e1a] uppercase font-bold">NBA Basketball Feeds</div>
                              <div className="font-bold text-sm text-white mt-1">Warriors vs Lakers</div>
                              <div className="font-mono text-xs text-emerald-400 mt-1">Q4 02:18 · 114 - 110</div>
                            </div>
                            <div className="text-[9px] text-gray-400 font-mono">Chase Center, SF</div>
                          </div>
                          <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between">
                            <div>
                              <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">Volleyball Tournament</div>
                              <div className="font-bold text-sm text-white mt-1">National Championship</div>
                              <div className="font-mono text-xs text-yellow-400 mt-1">Set 5 Tiebreaker · 14 - 13</div>
                            </div>
                            <div className="text-[9px] text-gray-400 font-mono">Match Point Spike</div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ==============================================================
          INTERACTIVE FLOATING BOTTOM DOCK
          ============================================================== */}
      <div className="w-full flex items-center justify-center pb-2.5 sm:pb-3.5 z-40 shrink-0">
        <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-xl border shadow-2xl transition-all ${
          isDark 
            ? 'bg-black/75 border-white/20 shadow-black' 
            : 'bg-white/85 border-black/15 shadow-black/10'
        }`}>
          {currentDockApps.map((app) => {
            const Icon = app.icon;
            const isOpen = openApps.includes(app.id);
            const isActive = activeApp === app.id;

            return (
              <motion.button
                key={app.id}
                whileHover={{ scale: 1.25, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLaunchApp(app.id)}
                className="relative group p-1.5 sm:p-2 rounded-xl flex flex-col items-center outline-none cursor-pointer"
                title={app.name}
              >
                <div 
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-all"
                  style={{ backgroundColor: app.color }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Active dot indicator under app */}
                <span className={`w-1 h-1 rounded-full mt-1 transition-all ${
                  isActive ? 'bg-[#ff5e1a] scale-125' : isOpen ? 'bg-white/70' : 'opacity-0'
                }`} />

                {/* Hover tooltip label */}
                <div className={`absolute -top-7 px-2 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md ${
                  isDark ? 'bg-neutral-900 text-[#ff5e1a] border border-white/20' : 'bg-white text-neutral-900 border border-black/15'
                }`}>
                  {app.name}
                </div>
              </motion.button>
            );
          })}

          <div className="w-px h-6 bg-black/15 dark:bg-white/15 mx-1" />

          {/* Quick Power Off button in dock */}
          <motion.button
            whileHover={{ scale: 1.2, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePowerOff}
            className="relative group p-1.5 sm:p-2 rounded-xl flex flex-col items-center outline-none cursor-pointer text-red-500 hover:text-red-400"
            title="Power Off monitor and exit to Studio"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-red-500/15 group-hover:bg-red-500 text-red-500 group-hover:text-white transition-all shadow-md">
              <Power className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="w-1 h-1 rounded-full mt-1 opacity-0" />
            <div className={`absolute -top-7 px-2 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md ${
              isDark ? 'bg-neutral-900 text-red-400 border border-white/20' : 'bg-white text-red-600 border border-black/15'
            }`}>
              Power Off
            </div>
          </motion.button>
        </div>
      </div>

      {/* POWER OFF SHUTDOWN ANIMATION */}
      <AnimatePresence>
        {isPoweringOff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* CRT / OLED collapse flash */}
            <motion.div
              initial={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              animate={{ scaleX: [1, 1.4, 0.05, 0], scaleY: [1, 0.04, 0.04, 0], opacity: [1, 1, 0.8, 0] }}
              transition={{ duration: 0.26, ease: 'easeInOut' }}
              className="w-full h-1 bg-white shadow-[0_0_30px_white]"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}