import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Box, Sparkles, Cpu, Zap, Activity, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface TechNode {
  id: number;
  name: string;
  category: '3D WebGL' | 'AI & Voice' | 'Performance' | 'Infrastructure';
  coord: string;
  latency: string;
  desc: string;
}

const TECH_NODES: TechNode[] = [
  { id: 1, name: 'Three.js Canvas Sequence', category: '3D WebGL', coord: '[-1, 0, 3]', latency: '0.4ms', desc: 'Pre-rendered 240-frame high-DPR Apple-style scroll canvas pipeline with zero letterboxing.' },
  { id: 2, name: 'Retina 2x DPR Scaler', category: 'Performance', coord: '[-1, 0, 2]', latency: '0.2ms', desc: 'Dynamic aspect-ratio cover math matching high-DPI displays without GPU memory leaks.' },
  { id: 3, name: 'GLSL Custom Fragment Shaders', category: '3D WebGL', coord: '[-1, 0, 1]', latency: '0.5ms', desc: 'Cinema-grade lighting, chromatic aberration, and holographic glass refraction.' },
  { id: 4, name: 'GPGPU Curl Noise Particles', category: '3D WebGL', coord: '[0, 0, 3]', latency: '0.8ms', desc: '100,000 parallel GPU physics particles computed via floating-point textures.' },
  { id: 5, name: 'InstancedMesh Batching', category: 'Performance', coord: '[0, 0, 2]', latency: '0.1ms', desc: 'Single draw-call batching eliminating CPU-to-GPU render pipeline bottlenecks.' },
  { id: 6, name: 'Specular Normal Maps', category: '3D WebGL', coord: '[0, 0, 1]', latency: '0.3ms', desc: 'Photorealistic PBR metalness and micro-surface roughness calculation.' },
  { id: 7, name: 'WebGL Viewport Culling', category: 'Performance', coord: '[1, 0, 3]', latency: '0.2ms', desc: 'Zero off-screen GPU memory consumption via dynamic observer intersection.' },
  { id: 8, name: 'Vapi WebRTC Voice Engine', category: 'AI & Voice', coord: '[1, 0, 2]', latency: '280ms', desc: '100% free in-browser telephony bypassing Indian & international cellular ISD limits.' },
  { id: 9, name: 'YZER Masculine Pitch Core', category: 'AI & Voice', coord: '[1, 0, 1]', latency: '12ms', desc: 'Deep authoritative voice synthesis (pitch 0.88, rate 1.10) with $0 native Web Speech.' },

  { id: 10, name: 'AudioContext Buffer Safeguard', category: 'AI & Voice', coord: '[-1, -1, 3]', latency: '0.1ms', desc: 'Strict zero-hardware conflict management protecting microphone streams from Chromium clipping.' },
  { id: 11, name: 'Event-Chained Guided Tour', category: 'AI & Voice', coord: '[-1, -1, 2]', latency: '1.0s', desc: 'Sequential utterance.onend listeners ensuring voice explanations never cut off mid-speech.' },
  { id: 12, name: 'Spelled Voice Email Parser', category: 'AI & Voice', coord: '[-1, -1, 1]', latency: '45ms', desc: 'Automated regex & phonetic token engine transcribing spoken alphabet letters into verified emails.' },
  { id: 13, name: 'LiteSpeed Edge Cache Engine', category: 'Infrastructure', coord: '[0, -1, 3]', latency: '18ms', desc: 'Hostinger Cloud enterprise edge caching delivering sub-second TTFB worldwide.' },
  { id: 14, name: 'Single-Bundle Inline Pipeline', category: 'Performance', coord: '[0, -1, 2]', latency: '0.0ms', desc: 'Zero-chunk standalone compilation eliminating Vite 404 MIME-type routing mismatches.' },
  { id: 15, name: 'Hostinger MySQL Auth Bridge', category: 'Infrastructure', coord: '[0, -1, 1]', latency: '35ms', desc: 'Real-time database user synchronization and granular authentication logging.' },
  { id: 16, name: 'Google OAuth 2.0 Web Client', category: 'Infrastructure', coord: '[1, -1, 3]', latency: '120ms', desc: '1-click secure token authorization pulling real avatars and verified email identity.' },
  { id: 17, name: '7-Day Encrypted Session Persistence', category: 'Infrastructure', coord: '[1, -1, 2]', latency: '0.1ms', desc: 'Hardened localStorage encryption keeping verified clients authenticated across visits.' },
  { id: 18, name: 'Master .htaccess SPA Rewriter', category: 'Infrastructure', coord: '[1, -1, 1]', latency: '0.2ms', desc: 'Apache/LiteSpeed canonical HTTPS enforcement and static asset 1-year cache headers.' },

  { id: 19, name: 'GEO AI Bot Crawler Directives', category: 'Performance', coord: '[-1, 1, 3]', latency: '0.1ms', desc: 'Comprehensive robots.txt whitelist empowering GPTBot, ClaudeBot, and Perplexity indexing.' },
  { id: 20, name: 'Founders Entity Schema Graph', category: 'Infrastructure', coord: '[-1, 1, 2]', latency: '0.1ms', desc: 'JSON-LD knowledge graphs cementing Antriksh, Bilal, Maulik, Jaywardhan, and Ritesh leadership.' },
  { id: 21, name: 'AEO 5-Question FAQ Snippets', category: 'Performance', coord: '[-1, 1, 1]', latency: '0.1ms', desc: 'Structured Position Zero schema ready for Google Assistant and AI voice answers.' },
  { id: 22, name: 'Multi-Resolution Square Favicon Suite', category: 'Infrastructure', coord: '[0, 1, 3]', latency: '0.2ms', desc: 'Google Search Console verified SVG, 48x48, 192x192, and 512x512 PWA icons.' },
  { id: 23, name: '4K Commercial AI Video Engine', category: 'AI & Voice', coord: '[0, 1, 2]', latency: '4.2s', desc: 'Hollywood-grade cinematic product reveals with multi-format 16:9 & 9:16 export.' },
  { id: 24, name: 'Fluid Kinetic Typography', category: 'Performance', coord: '[0, 1, 1]', latency: '0.3ms', desc: 'Scroll-scrubbed Syne, Outfit, and Instrument Serif heading typography.' },
  { id: 25, name: 'Magnetic 3D Cursor Tilt Lerp', category: '3D WebGL', coord: '[1, 1, 3]', latency: '16ms', desc: 'requestAnimationFrame floating physics dynamically tracking user mouse direction.' },
  { id: 26, name: 'Bespoke 100% IP Transfer', category: 'Infrastructure', coord: '[1, 1, 2]', latency: '0.0ms', desc: 'Complete client ownership of all production source code, 3D meshes, and brand assets.' },
  { id: 27, name: '24/7 Silicon Valley Voice Hotline', category: 'AI & Voice', coord: '[1, 1, 1]', latency: '180ms', desc: 'Direct telephonic routing via +1 (628) 245-9578 connected directly to YZER AI.' },
];

type ThemeColor = 'lime' | 'gold' | 'cyan' | 'magenta';

interface TechVoxelMatrixProps {
  onNavigateContact?: () => void;
  onOpenOrder?: (serviceName: string) => void;
}

export default function TechVoxelMatrix({ onNavigateContact, onOpenOrder }: TechVoxelMatrixProps) {
  const [activeNode, setActiveNode] = useState<TechNode>(TECH_NODES[0]);
  const [theme, setTheme] = useState<ThemeColor>('lime');
  const [cascadeIndex, setCascadeIndex] = useState<number | null>(null);
  const [isCascading, setIsCascading] = useState(false);
  const cascadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger automated wave of light cascading through all 27 blocks
  const triggerCascade = () => {
    if (isCascading) return;
    setIsCascading(true);
    let current = 0;
    
    if (cascadeTimerRef.current) clearInterval(cascadeTimerRef.current);
    
    cascadeTimerRef.current = setInterval(() => {
      if (current < 27) {
        setCascadeIndex(current);
        setActiveNode(TECH_NODES[current]);
        current++;
      } else {
        if (cascadeTimerRef.current) clearInterval(cascadeTimerRef.current);
        setCascadeIndex(null);
        setIsCascading(false);
      }
    }, 90);
  };

  useEffect(() => {
    return () => {
      if (cascadeTimerRef.current) clearInterval(cascadeTimerRef.current);
    };
  }, []);

  const handleBlockHover = (nodeIndex: number) => {
    if (!isCascading) {
      setActiveNode(TECH_NODES[nodeIndex]);
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'gold': return 'voxel-theme-gold';
      case 'cyan': return 'voxel-theme-cyan';
      case 'magenta': return 'voxel-theme-magenta';
      default: return 'voxel-theme-lime';
    }
  };

  const getThemeHex = () => {
    switch (theme) {
      case 'gold': return '#f7cc46';
      case 'cyan': return '#38bdf8';
      case 'magenta': return '#ec4899';
      default: return '#c6f554';
    }
  };

  // 3 Layers (each 3 columns of 3 blocks = 9 * 3 = 27 blocks)
  const columnsData = [
    { x: -1, y: 0, items: [3, 2, 1] },
    { x: 0, y: 0, items: [3, 2, 1] },
    { x: 1, y: 0, items: [3, 2, 1] }
  ];

  return (
    <div id="tech-voxel-matrix" className="w-full my-16 sm:my-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121c13]/90 border border-[#c6f554]/30 shadow-lg mb-3">
          <Cpu className="w-3.5 h-3.5 text-[#c6f554]" />
          <span className="text-xs text-zinc-300 font-mono tracking-wider">MODULAR ARCHITECTURE MATRIX</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
          The Autonomous <span className="text-[#c6f554] font-serif-italic">Voxel Engine</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Hover or tap any of the 27 isometric voxel nodes. We never deliver cookie-cutter templates — every client build is dynamically engineered by stacking bespoke, high-performance technology modules.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0a100b]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div 
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-700"
          style={{ backgroundColor: getThemeHex() }}
        />

        {/* LEFT / CENTER: The 3D Isometric Voxel Cube Stage (7 Columns on Desktop) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[440px]">
          
          {/* Controls Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 z-20">
            {/* Color Palette Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111c13] border border-white/10">
              <button
                onClick={() => setTheme('lime')}
                className={`w-6 h-6 rounded-lg transition-transform flex items-center justify-center ${theme === 'lime' ? 'scale-110 ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: '#c6f554' }}
                title="Electric Lime"
              />
              <button
                onClick={() => setTheme('gold')}
                className={`w-6 h-6 rounded-lg transition-transform flex items-center justify-center ${theme === 'gold' ? 'scale-110 ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: '#f7cc46' }}
                title="Cyber Gold"
              />
              <button
                onClick={() => setTheme('cyan')}
                className={`w-6 h-6 rounded-lg transition-transform flex items-center justify-center ${theme === 'cyan' ? 'scale-110 ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: '#38bdf8' }}
                title="Quantum Cyan"
              />
              <button
                onClick={() => setTheme('magenta')}
                className={`w-6 h-6 rounded-lg transition-transform flex items-center justify-center ${theme === 'magenta' ? 'scale-110 ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: '#ec4899' }}
                title="Hyper Magenta"
              />
            </div>

            {/* Light Cascade Trigger Button */}
            <button
              onClick={triggerCascade}
              disabled={isCascading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#142217] hover:bg-[#1a2d1e] text-xs font-mono font-medium text-white border border-[#c6f554]/30 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 text-[#c6f554] ${isCascading ? 'animate-bounce' : ''}`} />
              <span>{isCascading ? 'Cascading...' : 'Trigger Light Cascade'}</span>
            </button>
          </div>

          {/* Isometric Voxel Stage */}
          <div className={`voxel-stage w-full scale-[0.78] sm:scale-90 md:scale-100 transition-all ${getThemeClass()}`}>
            <div className="voxel-container">
              {[0, 1, 2].map((layerIndex) => (
                <div key={layerIndex} className="voxel-layer">
                  {columnsData.map((col, colIdx) => (
                    <div
                      key={colIdx}
                      className="voxel-column"
                      style={{
                        '--x': col.x,
                        '--y': col.y,
                      } as React.CSSProperties}
                    >
                      {col.items.map((itemI, itemIdx) => {
                        const globalIndex = layerIndex * 9 + colIdx * 3 + itemIdx;
                        const isLightActive = cascadeIndex === globalIndex;
                        
                        return (
                          <span
                            key={itemIdx}
                            className={`voxel-block ${isLightActive ? 'is-active' : ''}`}
                            style={{
                              '--i': itemI,
                            } as React.CSSProperties}
                            onMouseEnter={() => handleBlockHover(globalIndex)}
                            onTouchStart={() => handleBlockHover(globalIndex)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="mt-8 flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-[#0e1610] px-3 py-1 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c6f554] animate-ping" />
            <span>SWIPE OR MOVE CURSOR ACROSS VOXELS TO PAINT NEON ILLUMINATION</span>
          </div>
        </div>

        {/* RIGHT: Live Telemetry & Module Inspector HUD (5 Columns on Desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#0d140e]/95 border border-white/10 rounded-2xl p-6 sm:p-7 relative z-20 shadow-xl">
          <div>
            {/* HUD Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c6f554] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-white">NODE TELEMETRY HUD</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#1b2b1d] text-[#c6f554] border border-[#c6f554]/30">
                ONLINE • 60 FPS
              </span>
            </div>

            {/* Active Node Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase">Selected Module</span>
                <span className="text-xs font-mono text-[#c6f554] bg-[#121c13] px-2 py-0.5 rounded border border-[#c6f554]/20">
                  {activeNode.coord}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                {activeNode.name}
              </h3>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 border border-white/10">
                  Category: <strong className="text-white">{activeNode.category}</strong>
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#142318] text-[#c6f554] border border-[#c6f554]/20 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-[#c6f554]" />
                  Latency: <strong>{activeNode.latency}</strong>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-2">
                {activeNode.desc}
              </p>
            </div>
          </div>

          {/* Footer Call to Action in HUD */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigateContact ? onNavigateContact() : onOpenOrder?.('3D Website')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c6f554] to-[#f7cc46] text-[#070a07] font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(198,245,84,0.3)] hover:shadow-[0_0_25px_rgba(198,245,84,0.5)] transition-all active:scale-95"
            >
              <span>Build Custom Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={triggerCascade}
              className="p-2.5 rounded-xl bg-[#142217] hover:bg-[#1a2d1e] text-[#c6f554] border border-[#c6f554]/30 flex items-center justify-center transition-colors"
              title="Rescan Nodes"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
