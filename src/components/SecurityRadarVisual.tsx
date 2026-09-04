import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SecurityRadarVisual() {
  return (
    <div id="security-radar-visual" className="relative w-full h-52 flex items-center justify-center pt-2 select-none overflow-hidden">
      {/* Ambient background glow in center */}
      <div className="absolute w-32 h-32 bg-[#c6f554]/15 rounded-full blur-2xl pointer-events-none animate-pulse-glow" />

      {/* SVG Concentric Radar Rings & Orbit Points */}
      <svg
        className="w-48 h-48 sm:w-52 sm:h-52"
        viewBox="0 0 200 200"
        fill="none"
      >
        <defs>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <radialGradient id="radarSweepGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c6f554" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#c6f554" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#c6f554" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Outer Ring */}
        <circle
          cx="100"
          cy="100"
          r="84"
          stroke="#c6f554"
          strokeOpacity="0.2"
          strokeWidth="1"
        />

        {/* Middle Ring */}
        <circle
          cx="100"
          cy="100"
          r="58"
          stroke="#c6f554"
          strokeOpacity="0.3"
          strokeWidth="1"
        />

        {/* Inner Ring */}
        <circle
          cx="100"
          cy="100"
          r="34"
          stroke="#c6f554"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />

        {/* Diagonal Crosshair Guide Lines */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="#c6f554" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="#c6f554" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 2" />

        {/* Orbiting / Stationed Glowing Nodes */}
        {/* Node 1 on Outer Ring (Top Left: ~135 deg -> x=41, y=41) */}
        <circle cx="43" cy="48" r="4.5" fill="#c6f554" fillOpacity="0.25" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="43" cy="48" r="3.5" fill="#e2fb7b" filter="url(#nodeGlow)" />

        {/* Node 2 on Outer Ring (Top Right: ~45 deg -> x=160, y=45) */}
        <circle cx="160" cy="48" r="4.5" fill="#c6f554" fillOpacity="0.25" className="animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        <circle cx="160" cy="48" r="3.5" fill="#e2fb7b" filter="url(#nodeGlow)" />

        {/* Node 3 on Outer Ring (Bottom Left: x=43, y=152) */}
        <circle cx="43" cy="152" r="3.5" fill="#c6f554" filter="url(#nodeGlow)" />

        {/* Node 4 on Outer Ring (Bottom Right: x=163, y=152) */}
        <circle cx="163" cy="152" r="3.5" fill="#e2fb7b" filter="url(#nodeGlow)" />

        {/* Node 5 on Middle Ring (Right: x=158, y=100) */}
        <circle cx="158" cy="100" r="3" fill="#c6f554" filter="url(#nodeGlow)" opacity="0.9" />

        {/* Center Target Ring highlight */}
        <circle
          cx="100"
          cy="100"
          r="18"
          fill="#162218"
          stroke="#c6f554"
          strokeWidth="1.5"
          className="shadow-lg"
        />
      </svg>

      {/* Central Shield Icon */}
      <div 
        id="radar-center-shield"
        className="absolute z-10 w-9 h-9 rounded-full bg-[#172319] border border-[#c6f554] flex items-center justify-center text-[#c6f554] shadow-[0_0_20px_rgba(198,245,84,0.6)] cursor-pointer hover:scale-110 transition-transform"
      >
        <ShieldCheck className="w-4 h-4 text-[#d8fc77] fill-[#c6f554]/20" />
      </div>
    </div>
  );
}
