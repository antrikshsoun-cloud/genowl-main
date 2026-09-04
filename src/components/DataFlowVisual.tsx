import React from 'react';
import { Database, Cloud, FileText, Code2, Leaf } from 'lucide-react';

export default function DataFlowVisual() {
  const sources = [
    { icon: Database, id: 'db' },
    { icon: Cloud, id: 'cloud' },
    { icon: FileText, id: 'file' },
    { icon: Code2, id: 'code' },
  ];

  return (
    <div id="data-flow-visual" className="relative w-full h-52 flex items-center justify-between px-2 pt-2 select-none">
      {/* Left Column - 4 Data Sources */}
      <div className="flex flex-col justify-between h-full py-1 z-10 space-y-2">
        {sources.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={`source-node-${idx}`}
              className="w-9 h-9 rounded-xl bg-[#131b14]/90 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#c6f554] hover:border-[#c6f554]/40 transition-all duration-300 shadow-md group"
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
          );
        })}
      </div>

      {/* SVG Connecting Curves */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 300 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c6f554" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#c6f554" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d8fc77" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 4 Dotted/Curved Connector Lines converging into target */}
        {/* Node 1 (y ≈ 24) -> Center Target (x=240, y=100) */}
        <path
          d="M 45 25 C 130 25, 170 100, 240 100"
          stroke="url(#curveGradient)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="opacity-70"
        />
        {/* Node 2 (y ≈ 75) -> Center Target */}
        <path
          d="M 45 75 C 120 75, 170 100, 240 100"
          stroke="url(#curveGradient)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="opacity-80"
        />
        {/* Node 3 (y ≈ 125) -> Center Target */}
        <path
          d="M 45 125 C 120 125, 170 100, 240 100"
          stroke="url(#curveGradient)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="opacity-80"
        />
        {/* Node 4 (y ≈ 175) -> Center Target */}
        <path
          d="M 45 175 C 130 175, 170 100, 240 100"
          stroke="url(#curveGradient)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="opacity-70"
        />

        {/* Ambient subtle energy flow line */}
        <path
          d="M 45 100 C 130 100, 180 100, 240 100"
          stroke="#c6f554"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      </svg>

      {/* Right Target - Glowing Verdant Leaf Node */}
      <div className="relative mr-4 z-10 flex items-center justify-center">
        {/* Radial ambient glow backdrop */}
        <div className="absolute w-28 h-28 bg-[#c6f554]/25 rounded-full blur-xl pointer-events-none animate-pulse-glow" />
        <div className="absolute w-16 h-16 bg-[#c6f554]/40 rounded-2xl blur-md pointer-events-none" />

        {/* Central Glowing Verdant Leaf Badge */}
        <div
          id="target-node"
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1b261a] to-[#0f1710] border-2 border-[#c6f554]/80 flex items-center justify-center text-[#c6f554] shadow-[0_0_25px_rgba(198,245,84,0.45)] group cursor-pointer hover:scale-105 transition-transform"
        >
          <Leaf className="w-7 h-7 text-[#d8fc77] fill-[#c6f554]/30" />
        </div>
      </div>
    </div>
  );
}
