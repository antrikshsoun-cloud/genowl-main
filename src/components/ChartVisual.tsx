import React from 'react';

export default function ChartVisual() {
  return (
    <div id="chart-visual" className="relative w-full h-52 flex flex-col justify-end pt-4 pb-1 select-none overflow-hidden">
      {/* Highlight Tooltip Badge `↑ 32%` */}
      <div 
        id="chart-badge"
        className="absolute top-8 right-16 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#18241a]/95 border border-[#c6f554]/50 text-[#c6f554] text-xs font-semibold shadow-[0_0_15px_rgba(198,245,84,0.3)] animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <span className="text-[11px]">↑</span>
        <span>32%</span>
      </div>

      {/* Ambient glow behind chart peak */}
      <div className="absolute top-12 right-20 w-24 h-24 bg-[#c6f554]/20 rounded-full blur-xl pointer-events-none" />

      {/* SVG Chart */}
      <svg
        className="w-full h-44 overflow-visible"
        viewBox="0 0 320 160"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main green gradient fill */}
          <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c6f554" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#c6f554" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#c6f554" stopOpacity="0.0" />
          </linearGradient>

          {/* Secondary background line gradient */}
          <linearGradient id="secondaryAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8db832" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8db832" stopOpacity="0.0" />
          </linearGradient>

          {/* Glowing stroke gradient */}
          <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8db832" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#c6f554" stopOpacity="1" />
            <stop offset="100%" stopColor="#e2fb7b" stopOpacity="0.9" />
          </linearGradient>

          <filter id="peakGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Vertical thin grid lines */}
        <line x1="40" y1="10" x2="40" y2="160" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="100" y1="10" x2="100" y2="160" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="160" y1="10" x2="160" y2="160" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="220" y1="10" x2="220" y2="160" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="280" y1="10" x2="280" y2="160" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="2 2" />

        {/* Base line */}
        <line x1="0" y1="155" x2="320" y2="155" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />

        {/* Background wave curve fill */}
        <path
          d="M 0 130 Q 50 145 90 115 T 180 120 T 235 60 T 320 80 L 320 160 L 0 160 Z"
          fill="url(#secondaryAreaGradient)"
        />

        {/* Secondary wave stroke */}
        <path
          d="M 0 130 Q 50 145 90 115 T 180 120 T 235 60 T 320 80"
          stroke="#7ca929"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Foreground prominent wave area fill */}
        <path
          d="M 0 120 C 30 120, 45 100, 75 100 C 105 100, 120 135, 150 125 C 180 115, 205 60, 235 48 C 265 36, 290 85, 320 70 L 320 160 L 0 160 Z"
          fill="url(#chartAreaGradient)"
        />

        {/* Foreground glowing wave stroke */}
        <path
          d="M 0 120 C 30 120, 45 100, 75 100 C 105 100, 120 135, 150 125 C 180 115, 205 60, 235 48 C 265 36, 290 85, 320 70"
          stroke="url(#strokeGradient)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Drop lines from peaks */}
        <line x1="75" y1="100" x2="75" y2="160" stroke="#c6f554" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="235" y1="48" x2="235" y2="160" stroke="#c6f554" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Peak indicator dots */}
        <circle cx="75" cy="100" r="3" fill="#c6f554" opacity="0.8" />
        
        {/* Main High Peak Point */}
        <circle cx="235" cy="48" r="7" fill="#c6f554" fillOpacity="0.3" className="animate-ping" style={{ animationDuration: '2.5s' }} />
        <circle cx="235" cy="48" r="5" fill="#e2fb7b" filter="url(#peakGlow)" />
        <circle cx="235" cy="48" r="2.5" fill="#0c140d" />
      </svg>
    </div>
  );
}
