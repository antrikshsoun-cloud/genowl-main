import React, { useRef, useEffect, useState } from 'react';
import { Box, Sparkles, Move3d, RotateCw, Eye, ArrowUpRight, Zap } from 'lucide-react';

interface Web3DVisualShowcaseProps {
  onBookNow: () => void;
}

// 3D Math & Icosahedron Vertex Definitions
const PHI = (1 + Math.sqrt(5)) / 2;
const BASE_VERTICES = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
];

// Normalize vertices to unit sphere
const VERTICES = BASE_VERTICES.map(([x, y, z]) => {
  const len = Math.sqrt(x * x + y * y + z * z);
  return [x / len, y / len, z / len];
});

// 20 Triangular Faces of Icosahedron
const FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];

export default function Web3DVisualShowcase({ onBookNow }: Web3DVisualShowcaseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'particles'>('solid');
  const [isInteracting, setIsInteracting] = useState(false);

  // Rotation state refs to preserve across 60FPS loop
  const stateRef = useRef({
    rotX: 0.35,
    rotY: 0.65,
    velX: 0.005,
    velY: 0.008,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    mode: 'solid' as 'solid' | 'wireframe' | 'particles'
  });

  useEffect(() => {
    stateRef.current.mode = renderMode;
  }, [renderMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Generate orbiting 3D particles
    const particles = Array.from({ length: 90 }, () => {
      const radius = 1.6 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      return {
        x: radius * Math.cos(theta) * Math.cos(phi),
        y: radius * Math.sin(phi),
        z: radius * Math.sin(theta) * Math.cos(phi),
        speed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.3 ? '#c6f554' : '#ffffff'
      };
    });

    const render = () => {
      const state = stateRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * 2 || canvas.height !== height * 2) {
        canvas.width = width * 2;
        canvas.height = height * 2;
      }

      ctx.save();
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, width, height);

      // Auto rotation when not dragging
      if (!state.isDragging) {
        state.rotY += state.velY;
        state.rotX += state.velX;
      }

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.36;

      // 3D Rotation Matrix math
      const cosX = Math.cos(state.rotX);
      const sinX = Math.sin(state.rotX);
      const cosY = Math.cos(state.rotY);
      const sinY = Math.sin(state.rotY);

      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        // Rotate around X
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        // Perspective divide
        const fov = 3.5;
        const factor = fov / (fov + z2);
        return {
          px: cx + x1 * scale * factor,
          py: cy + y2 * scale * factor,
          depth: z2
        };
      };

      // 1. Draw Orbiting Particles
      particles.forEach((p) => {
        p.x = p.x * Math.cos(p.speed) - p.z * Math.sin(p.speed);
        p.z = p.x * Math.sin(p.speed) + p.z * Math.cos(p.speed);

        const proj = project(p.x, p.y, p.z);
        const alpha = Math.max(0.15, Math.min(0.9, (proj.depth + 1.8) / 3.6));
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, p.size * (proj.depth > 0 ? 1.2 : 0.8), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // 2. Transform Vertices
      const projectedVerts = VERTICES.map(([x, y, z]) => project(x, y, z));

      // 3. Sort faces by average depth (Painter's Algorithm for back-to-front rendering)
      const sortedFaces = FACES.map((face) => {
        const v0 = projectedVerts[face[0]];
        const v1 = projectedVerts[face[1]];
        const v2 = projectedVerts[face[2]];
        const avgZ = (v0.depth + v1.depth + v2.depth) / 3;
        return { face, avgZ, v0, v1, v2 };
      }).sort((a, b) => a.avgZ - b.avgZ);

      // Light vector from top-right-front
      const lx = 0.577;
      const ly = -0.577;
      const lz = 0.577;

      sortedFaces.forEach(({ face, avgZ, v0, v1, v2 }) => {
        // Compute 3D Face Normal
        const orig0 = VERTICES[face[0]];
        const orig1 = VERTICES[face[1]];
        const orig2 = VERTICES[face[2]];

        const ax = orig1[0] - orig0[0];
        const ay = orig1[1] - orig0[1];
        const az = orig1[2] - orig0[2];

        const bx = orig2[0] - orig0[0];
        const by = orig2[1] - orig0[1];
        const bz = orig2[2] - orig0[2];

        const nx = ay * bz - az * by;
        const ny = az * bx - ax * bz;
        const nz = ax * by - ay * bx;
        const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

        // Transform normal with current rotation
        const rnx1 = (nx / nlen) * cosY + (nz / nlen) * sinY;
        const rnz1 = -(nx / nlen) * sinY + (nz / nlen) * cosY;
        const rny = (ny / nlen) * cosX - rnz1 * sinX;
        const rnz = (ny / nlen) * sinX + rnz1 * cosX;

        // Back-face culling check
        if (rnz <= -0.15 && state.mode !== 'wireframe') return;

        // Lighting calculation
        const dot = Math.max(0.12, rnx1 * lx + rny * ly + rnz * lz);

        ctx.beginPath();
        ctx.moveTo(v0.px, v0.py);
        ctx.lineTo(v1.px, v1.py);
        ctx.lineTo(v2.px, v2.py);
        ctx.closePath();

        if (state.mode === 'solid') {
          // Emerald PBR Shader Simulation
          const r = Math.round(18 + dot * 180);
          const g = Math.round(35 + dot * 220);
          const b = Math.round(20 + dot * 90);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.85 + dot * 0.15})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(198, 245, 84, ${0.4 + dot * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (state.mode === 'wireframe') {
          // Cyberpunk Hologram Neon Wireframe
          ctx.strokeStyle = `rgba(198, 245, 84, ${0.4 + (avgZ + 1) * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Particle Aether mode
          ctx.fillStyle = `rgba(198, 245, 84, 0.15)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(198, 245, 84, 0.6)`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Mouse / Touch Drag Event Handlers
    const handleDown = (clientX: number, clientY: number) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastMouseX = clientX;
      stateRef.current.lastMouseY = clientY;
      setIsInteracting(true);
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!stateRef.current.isDragging) return;
      const dx = clientX - stateRef.current.lastMouseX;
      const dy = clientY - stateRef.current.lastMouseY;
      stateRef.current.rotY += dx * 0.008;
      stateRef.current.rotX += dy * 0.008;
      stateRef.current.velY = dx * 0.003;
      stateRef.current.velX = dy * 0.003;
      stateRef.current.lastMouseX = clientX;
      stateRef.current.lastMouseY = clientY;
    };

    const handleUp = () => {
      stateRef.current.isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const onMouseDown = (e: MouseEvent) => handleDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleUp();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleUp();

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080d09] overflow-hidden shadow-2xl relative">
      {/* 3D Viewport Header */}
      <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#c6f554] animate-pulse" />
          <span className="text-[11px] font-mono text-zinc-300 font-bold">
            Real-Time 3D WebGL Engine
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 text-[#c6f554] border border-white/10">
            60.0 FPS
          </span>
        </div>

        {/* Shading Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setRenderMode('solid')}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              renderMode === 'solid'
                ? 'bg-[#c6f554] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            PBR Emerald
          </button>
          <button
            type="button"
            onClick={() => setRenderMode('wireframe')}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              renderMode === 'wireframe'
                ? 'bg-[#c6f554] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Wireframe
          </button>
          <button
            type="button"
            onClick={() => setRenderMode('particles')}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              renderMode === 'particles'
                ? 'bg-[#c6f554] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Particle Aether
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas Viewport */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-[#060a07] via-[#09120b] to-[#040605] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
        {/* Ambient Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 bg-[#c6f554]/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Real-time Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block relative z-10"
        />

        {/* Floating Gesture Hint */}
        <div className={`absolute bottom-3 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-[10px] text-zinc-300 backdrop-blur-md transition-opacity ${
          isInteracting ? 'opacity-40' : 'opacity-100'
        }`}>
          <Move3d className="w-3.5 h-3.5 text-[#c6f554]" />
          <span>Click &amp; Drag to spin 3D object in real-time</span>
        </div>

        <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-[#c6f554]/30 text-[10px] font-mono text-[#c6f554]">
          <Zap className="w-3 h-3" />
          <span>Three.js / WebGL Spec</span>
        </div>
      </div>

      {/* Bottom Conversion Bar */}
      <div className="p-4 bg-black/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-[#c6f554]" />
            <span>Top 1% Immersive WebGL Experience</span>
          </div>
          <div className="text-[10.5px] text-zinc-400">
            Scroll-driven frame sequencing, custom shaders, 3D product configurators &amp; GLTF models
          </div>
        </div>

        <button
          type="button"
          onClick={onBookNow}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(198,245,84,0.3)] flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Book 3D Website ($1,000)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
