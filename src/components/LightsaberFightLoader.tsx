import React from 'react';

interface LightsaberFightLoaderProps {
  label?: string;
  sublabel?: string;
  scale?: number;
  className?: string;
}

export default function LightsaberFightLoader({
  label = 'Synthesizing Custom Architecture...',
  sublabel,
  scale = 1,
  className = '',
}: LightsaberFightLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center select-none py-2 ${className}`}>
      {/* 100% CSS Lightsaber Combat Animation */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: `${80 * scale}px`,
          height: `${48 * scale}px`,
        }}
      >
        <div 
          className="ls-loader"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* 5 Collision Sparks */}
          <div className="ls-particles ls-part-1" />
          <div className="ls-particles ls-part-2" />
          <div className="ls-particles ls-part-3" />
          <div className="ls-particles ls-part-4" />
          <div className="ls-particles ls-part-5" />

          {/* Left Green Lightsaber (#87c054) */}
          <div className="lightsaber ls-left ls-green" />

          {/* Right Red Lightsaber (#f06363) */}
          <div className="lightsaber ls-right ls-red" />
        </div>
      </div>

      {/* Optional Status Label */}
      {label && (
        <div className="mt-2 text-center">
          <p className="text-xs font-mono font-semibold text-white tracking-wide flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#87c054] animate-pulse" />
            <span>{label}</span>
          </p>
          {sublabel && (
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
