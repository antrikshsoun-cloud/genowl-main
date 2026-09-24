import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Activity, ArrowRight, RefreshCw, Layers } from 'lucide-react';

interface TechNode {
  id: number;
  name: string;
  tier: 'Tier 3: Experience & 3D' | 'Tier 2: Intelligence & Voice' | 'Tier 1: Cloud & Security';
  tierColor: string;
  neonColor: string;
  glowColor: string;
  coord: string;
  latency: string;
  desc: string;
}

// 27 Architectural Nodes arranged so that sweeping across the cube lights up:
// Green -> Yellow -> Blue -> Pink -> Prismatic Multi-Color Mix
const TECH_NODES: TechNode[] = [
  // --- TIER 3: EXPERIENCE & 3D (Green / Electric Lime / Emerald) ---
  { 
    id: 1, 
    name: 'Three.js Canvas Sequence', 
    tier: 'Tier 3: Experience & 3D', 
    tierColor: '#c6f554', 
    neonColor: '#c6f554', 
    glowColor: 'rgba(198, 245, 84, 0.95)', 
    coord: 'Layer 3 • Node [1, 1]', 
    latency: '0.4ms', 
    desc: 'Pre-rendered 240-frame high-DPR Apple-style scroll canvas pipeline with zero letterboxing.' 
  },
  { 
    id: 2, 
    name: 'Retina 2x DPR Scaler', 
    tier: 'Tier 3: Experience & 3D', 
    tierColor: '#c6f554', 
    neonColor: '#10b981', 
    glowColor: 'rgba(16, 185, 129, 0.95)', 
    coord: 'Layer 3 • Node [1, 2]', 
    latency: '0.2ms', 
    desc: 'Dynamic aspect-ratio cover math matching high-DPI displays without GPU memory leaks.' 
  },
  { 
    id: 3, 
    name: 'Custom GLSL Shaders', 
    tier: 'Tier 3: Experience & 3D', 
    tierColor: '#c6f554', 
    neonColor: '#4ade80', 
    glowColor: 'rgba(74, 222, 128, 0.95)', 
    coord: 'Layer 3 • Node [1, 3]', 
    latency: '0.5ms', 
    desc: 'Cinema-grade lighting, chromatic aberration, and holographic glass refraction.' 
  },
  { 
    id: 4, 
    name: 'GPGPU Curl Noise Particles', 
    tier: 'Tier 3: Experience & 3D', 
    tierColor: '#c6f554', 
    neonColor: '#84cc16', 
    glowColor: 'rgba(132, 204, 22, 0.95)', 
    coord: 'Layer 3 • Node [2, 1]', 
    latency: '0.8ms', 
    desc: '100,000 parallel GPU physics particles computed via floating-point textures.' 
  },
  { 
    id: 5, 
    name: 'InstancedMesh Batching', 
    tier: 'Tier 3: Experience & 3D', 
    tierColor: '#c6f554', 
    neonColor: '#a3e635', 
    glowColor: 'rgba(163, 230, 53, 0.95)', 
    coord: 'Layer 3 • Node [2, 2]', 
    latency: '0.1ms', 
    desc: 'Single draw-call batching eliminating CPU-to-GPU render pipeline bottlenecks.' 
  },
  { 
    id: 6, 
    name: 'Specular Normal Maps', 
    tier: 'Tier 3: Experience & 3D', 
    tierColor: '#c6f554', 
    neonColor: '#22c55e', 
    glowColor: 'rgba(34, 197, 94, 0.95)', 
    coord: 'Layer 3 • Node [2, 3]', 
    latency: '0.3ms', 
    desc: 'Photorealistic PBR metalness and micro-surface roughness calculation.' 
  },
  { 
    id: 7, 
    name: '4K Commercial AI Video', 
    tier: 'Tier 3: Experience & 3D', 
    tierColor: '#c6f554', 
    neonColor: '#6ee7b7', 
    glowColor: 'rgba(110, 231, 183, 0.95)', 
    coord: 'Layer 3 • Node [3, 1]', 
    latency: '4.2s', 
    desc: 'Hollywood-grade cinematic product reveals with multi-format 16:9 & 9:16 export.' 
  },

  // --- TIER 2: INTELLIGENCE & VOICE (Yellow / Cyber Gold / Amber) ---
  { 
    id: 8, 
    name: 'Vapi WebRTC Voice Engine', 
    tier: 'Tier 2: Intelligence & Voice', 
    tierColor: '#f7cc46', 
    neonColor: '#facc15', 
    glowColor: 'rgba(250, 204, 21, 0.95)', 
    coord: 'Layer 2 • Node [1, 1]', 
    latency: '280ms', 
    desc: '100% free in-browser telephony bypassing Indian & international cellular ISD limits.' 
  },
  { 
    id: 9, 
    name: 'YZER Masculine Pitch Core', 
    tier: 'Tier 2: Intelligence & Voice', 
    tierColor: '#f7cc46', 
    neonColor: '#f7cc46', 
    glowColor: 'rgba(247, 204, 70, 0.95)', 
    coord: 'Layer 2 • Node [1, 2]', 
    latency: '12ms', 
    desc: 'Deep authoritative voice synthesis (pitch 0.88, rate 1.10) with $0 native Web Speech.' 
  },
  { 
    id: 10, 
    name: 'AudioContext Buffer Safeguard', 
    tier: 'Tier 2: Intelligence & Voice', 
    tierColor: '#f7cc46', 
    neonColor: '#fbbf24', 
    glowColor: 'rgba(251, 191, 36, 0.95)', 
    coord: 'Layer 2 • Node [1, 3]', 
    latency: '0.1ms', 
    desc: 'Strict zero-hardware conflict management protecting microphone streams from Chromium clipping.' 
  },
  { 
    id: 11, 
    name: 'Event-Chained Guided Tour', 
    tier: 'Tier 2: Intelligence & Voice', 
    tierColor: '#f7cc46', 
    neonColor: '#f59e0b', 
    glowColor: 'rgba(245, 158, 11, 0.95)', 
    coord: 'Layer 2 • Node [2, 1]', 
    latency: '1.0s', 
    desc: 'Sequential utterance.onend listeners ensuring voice explanations never cut off mid-speech.' 
  },
  { 
    id: 12, 
    name: 'Spelled Voice Email Parser', 
    tier: 'Tier 2: Intelligence & Voice', 
    tierColor: '#f7cc46', 
    neonColor: '#fb923c', 
    glowColor: 'rgba(251, 146, 60, 0.95)', 
    coord: 'Layer 2 • Node [2, 2]', 
    latency: '45ms', 
    desc: 'Automated regex & phonetic token engine transcribing spoken alphabet letters into verified emails.' 
  },
  { 
    id: 13, 
    name: 'Silicon Valley Hotline (+1 628)', 
    tier: 'Tier 2: Intelligence & Voice', 
    tierColor: '#f7cc46', 
    neonColor: '#f97316', 
    glowColor: 'rgba(249, 115, 22, 0.95)', 
    coord: 'Layer 2 • Node [2, 3]', 
    latency: '180ms', 
    desc: 'Direct telephonic routing via +1 (628) 245-9578 connected directly to YZER AI.' 
  },
  { 
    id: 14, 
    name: 'Autonomous Lead Qualification', 
    tier: 'Tier 2: Intelligence & Voice', 
    tierColor: '#f7cc46', 
    neonColor: '#ea580c', 
    glowColor: 'rgba(234, 88, 12, 0.95)', 
    coord: 'Layer 2 • Node [3, 1]', 
    latency: '150ms', 
    desc: '4-step conversational qualification extracting project scope, budget, and contact info.' 
  },

  // --- TIER 1: CLOUD EDGE & INFRASTRUCTURE (Cyan / Blue / Magenta / Pink) ---
  { 
    id: 15, 
    name: 'LiteSpeed Edge Cache Engine', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#38bdf8', 
    neonColor: '#38bdf8', 
    glowColor: 'rgba(56, 189, 248, 0.95)', 
    coord: 'Layer 1 • Node [1, 1]', 
    latency: '18ms', 
    desc: 'Hostinger Cloud enterprise edge caching delivering sub-second TTFB worldwide.' 
  },
  { 
    id: 16, 
    name: 'Single-Bundle Inline Pipeline', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#38bdf8', 
    neonColor: '#0ea5e9', 
    glowColor: 'rgba(14, 165, 233, 0.95)', 
    coord: 'Layer 1 • Node [1, 2]', 
    latency: '0.0ms', 
    desc: 'Zero-chunk standalone compilation eliminating Vite 404 MIME-type routing mismatches.' 
  },
  { 
    id: 17, 
    name: 'Hostinger MySQL Auth Bridge', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#38bdf8', 
    neonColor: '#0284c7', 
    glowColor: 'rgba(2, 132, 199, 0.95)', 
    coord: 'Layer 1 • Node [1, 3]', 
    latency: '35ms', 
    desc: 'Real-time database user synchronization and granular authentication logging.' 
  },
  { 
    id: 18, 
    name: 'Google OAuth 2.0 Web Client', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#38bdf8', 
    neonColor: '#60a5fa', 
    glowColor: 'rgba(96, 165, 250, 0.95)', 
    coord: 'Layer 1 • Node [2, 1]', 
    latency: '120ms', 
    desc: '1-click secure token authorization pulling real avatars and verified email identity.' 
  },
  { 
    id: 19, 
    name: '7-Day Encrypted Session Persistence', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#38bdf8', 
    neonColor: '#818cf8', 
    glowColor: 'rgba(129, 140, 248, 0.95)', 
    coord: 'Layer 1 • Node [2, 2]', 
    latency: '0.1ms', 
    desc: 'Hardened localStorage encryption keeping verified clients authenticated across visits.' 
  },
  { 
    id: 20, 
    name: 'Master .htaccess SPA Rewriter', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#38bdf8', 
    neonColor: '#a855f7', 
    glowColor: 'rgba(168, 85, 247, 0.95)', 
    coord: 'Layer 1 • Node [2, 3]', 
    latency: '0.2ms', 
    desc: 'Apache/LiteSpeed canonical HTTPS enforcement and static asset 1-year cache headers.' 
  },
  { 
    id: 21, 
    name: 'GEO AI Bot Whitelist (GPT/Claude)', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#ec4899', 
    neonColor: '#c084fc', 
    glowColor: 'rgba(192, 132, 252, 0.95)', 
    coord: 'Layer 1 • Node [3, 1]', 
    latency: '0.1ms', 
    desc: 'Comprehensive robots.txt whitelist empowering GPTBot, ClaudeBot, and Perplexity indexing.' 
  },
  { 
    id: 22, 
    name: 'Founders Entity Schema Graph', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#ec4899', 
    neonColor: '#d946ef', 
    glowColor: 'rgba(217, 70, 239, 0.95)', 
    coord: 'Layer 1 • Node [3, 2]', 
    latency: '0.1ms', 
    desc: 'JSON-LD knowledge graphs cementing Antriksh, Bilal, Maulik, Jaywardhan, and Ritesh leadership.' 
  },
  { 
    id: 23, 
    name: 'AEO 5-Question FAQ Snippets', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#ec4899', 
    neonColor: '#e879f9', 
    glowColor: 'rgba(232, 121, 249, 0.95)', 
    coord: 'Layer 1 • Node [3, 3]', 
    latency: '0.1ms', 
    desc: 'Structured Position Zero schema ready for Google Assistant and AI voice answers.' 
  },
  { 
    id: 24, 
    name: 'Multi-Resolution Square Favicon Suite', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#ec4899', 
    neonColor: '#f43f5e', 
    glowColor: 'rgba(244, 63, 94, 0.95)', 
    coord: 'Layer 1 • Node [2, 1]', 
    latency: '0.2ms', 
    desc: 'Google Search Console verified SVG, 48x48, 192x192, and 512x512 PWA icons.' 
  },
  { 
    id: 25, 
    name: 'Fluid Kinetic Typography', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#ec4899', 
    neonColor: '#ec4899', 
    glowColor: 'rgba(236, 72, 153, 0.95)', 
    coord: 'Layer 1 • Node [1, 2]', 
    latency: '0.3ms', 
    desc: 'Scroll-scrubbed Syne, Outfit, and Instrument Serif heading typography.' 
  },
  { 
    id: 26, 
    name: 'Magnetic 3D Cursor Tilt Lerp', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#ec4899', 
    neonColor: '#fb7185', 
    glowColor: 'rgba(251, 113, 133, 0.95)', 
    coord: 'Layer 1 • Node [2, 3]', 
    latency: '16ms', 
    desc: 'requestAnimationFrame floating physics dynamically tracking user mouse direction.' 
  },
  { 
    id: 27, 
    name: 'Bespoke 100% IP Transfer', 
    tier: 'Tier 1: Cloud & Security', 
    tierColor: '#ec4899', 
    neonColor: '#fda4af', 
    glowColor: 'rgba(253, 164, 175, 0.95)', 
    coord: 'Layer 1 • Node [3, 3]', 
    latency: '0.0ms', 
    desc: 'Complete client ownership of all production source code, 3D meshes, and brand assets.' 
  },
];

interface TechVoxelMatrixProps {
  onNavigateContact?: () => void;
  onOpenOrder?: (serviceName: string) => void;
}

export default function TechVoxelMatrix({ onNavigateContact, onOpenOrder }: TechVoxelMatrixProps) {
  const [activeNode, setActiveNode] = useState<TechNode>(TECH_NODES[0]);
  const [cascadeIndex, setCascadeIndex] = useState<number | null>(null);
  const [isCascading, setIsCascading] = useState(false);
  const cascadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger rapid chromatic wave sweeping Green -> Yellow -> Blue -> Pink
  const triggerPrismaticCascade = () => {
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
    }, 75);
  };

  useEffect(() => {
    return () => {
      if (cascadeTimerRef.current) clearInterval(cascadeTimerRef.current);
    };
  }, []);

  const handleBlockHover = (nodeIndex: number) => {
    if (!isCascading && TECH_NODES[nodeIndex]) {
      setActiveNode(TECH_NODES[nodeIndex]);
    }
  };

  // Mobile finger drag continuous light-painting handler
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isCascading) return;
    const touch = e.touches[0];
    if (!touch) return;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains('voxel-block')) {
      const idxStr = element.getAttribute('data-node-index');
      if (idxStr !== null) {
        const idx = parseInt(idxStr, 10);
        if (!isNaN(idx) && TECH_NODES[idx]) {
          setActiveNode(TECH_NODES[idx]);
          element.classList.add('is-active');
          setTimeout(() => element.classList.remove('is-active'), 1200);
        }
      }
    }
  };

  // 3 Layers (each 3 columns of 3 blocks = 9 * 3 = 27 blocks)
  const columnsData = [
    { x: -1, y: 0, items: [3, 2, 1] },
    { x: 0, y: 0, items: [3, 2, 1] },
    { x: 1, y: 0, items: [3, 2, 1] }
  ];

  return (
    <div id="tech-voxel-matrix" className="w-full my-16 sm:my-24">
      {/* 1. Header with Direct Architectural Purpose */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121c13]/90 border border-[#c6f554]/30 shadow-lg mb-3">
          <Cpu className="w-3.5 h-3.5 text-[#c6f554]" />
          <span className="text-xs text-zinc-300 font-mono tracking-wider">THE GENOWL STACK ARCHITECTURE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
          27 Building Blocks. <span className="text-[#c6f554] font-serif-italic">Zero Headache for You.</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          You don't need to learn or connect 27 disparate technologies. Move your cursor across the cube to ignite the stack: Genowl integrates these 3 core architectural tiers into one seamless production for your brand.
        </p>

        {/* 3-Tier Spectrum Legend: Green -> Yellow -> Blue -> Pink */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-5 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c6f554] shadow-[0_0_8px_#c6f554]" />
            <span className="text-zinc-300">Tier 3: 3D Experience (Green)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7cc46] shadow-[0_0_8px_#f7cc46]" />
            <span className="text-zinc-300">Tier 2: Intelligence & Voice (Yellow)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span className="text-zinc-300">Tier 1: Cloud & Security (Blue & Pink)</span>
          </div>
        </div>
      </div>

      {/* 2. Main Interactive Stage (Clean Split Layout, ZERO Overlapping Text) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0a100b]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl relative overflow-hidden">
        
        {/* Dynamic Prismatic Ambient Background Glow */}
        <div 
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25 transition-colors duration-500"
          style={{ backgroundColor: activeNode.neonColor }}
        />

        {/* LEFT: 3D Isometric Voxel Cube Stage (7 Columns on Desktop) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[420px] sm:min-h-[460px] py-4">
          
          {/* Top Stage Action Bar */}
          <div className="w-full flex items-center justify-between gap-3 mb-4 z-20">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Layers className="w-3.5 h-3.5 text-[#c6f554]" />
              <span>Full-Stack 3D Matrix</span>
            </div>

            {/* Prismatic Light Cascade Trigger */}
            <button
              onClick={triggerPrismaticCascade}
              disabled={isCascading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#142217] hover:bg-[#1a2d1e] text-xs font-mono font-medium text-white border border-[#c6f554]/30 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 text-[#c6f554] ${isCascading ? 'animate-bounce' : ''}`} />
              <span>{isCascading ? 'Sweeping Spectrum...' : 'Trigger Prismatic Wave'}</span>
            </button>
          </div>

          {/* Isometric Voxel Cube Stage (Strictly Sized, Mobile Touch-Drag Enabled) */}
          <div 
            onTouchMove={handleTouchMove}
            className="voxel-stage w-full scale-[0.74] sm:scale-90 md:scale-100 transition-transform touch-none"
          >
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
                        const node = TECH_NODES[globalIndex] || TECH_NODES[0];
                        const isLightActive = cascadeIndex === globalIndex;
                        
                        return (
                          <span
                            key={itemIdx}
                            data-node-index={globalIndex}
                            className={`voxel-block ${isLightActive ? 'is-active' : ''}`}
                            style={{
                              '--i': itemI,
                              '--block-color': node.neonColor,
                              '--block-glow': node.glowColor,
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
        </div>

        {/* RIGHT: Live Telemetry & Module Inspector HUD (5 Columns on Desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#0d140e]/95 border border-white/10 rounded-2xl p-6 sm:p-7 relative z-20 shadow-xl">
          <div>
            {/* HUD Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full animate-pulse transition-colors duration-300"
                  style={{ backgroundColor: activeNode.neonColor }} 
                />
                <span className="text-xs font-mono font-bold tracking-wider text-white">ACTIVE MODULE TELEMETRY</span>
              </div>
              <span 
                className="text-[11px] font-mono px-2 py-0.5 rounded-full border transition-colors duration-300"
                style={{ 
                  backgroundColor: `${activeNode.neonColor}15`, 
                  color: activeNode.neonColor,
                  borderColor: `${activeNode.neonColor}40` 
                }}
              >
                ONLINE • 60 FPS
              </span>
            </div>

            {/* Active Node Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span 
                  className="text-xs font-mono font-semibold uppercase tracking-wider transition-colors duration-300"
                  style={{ color: activeNode.tierColor }}
                >
                  {activeNode.tier}
                </span>
                <span className="text-xs font-mono text-zinc-400 bg-[#121c13] px-2 py-0.5 rounded border border-white/10">
                  {activeNode.coord}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeNode.name}
              </h3>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#142318] text-[#c6f554] border border-[#c6f554]/20 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-[#c6f554]" />
                  Latency: <strong>{activeNode.latency}</strong>
                </span>
                <span 
                  className="text-xs font-mono px-2.5 py-1 rounded-lg border font-semibold transition-colors duration-300"
                  style={{ 
                    color: activeNode.neonColor, 
                    borderColor: `${activeNode.neonColor}40`,
                    backgroundColor: `${activeNode.neonColor}10` 
                  }}
                >
                  Illuminated
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
              onClick={triggerPrismaticCascade}
              className="p-2.5 rounded-xl bg-[#142217] hover:bg-[#1a2d1e] text-[#c6f554] border border-[#c6f554]/30 flex items-center justify-center transition-colors"
              title="Rescan Spectrum"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
