import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  ArrowUpRight,
  Film,
  RotateCcw,
  Layers,
  Zap,
} from 'lucide-react';

interface VideoVisualShowcaseProps {
  onBookNow: () => void;
}

export default function VideoVisualShowcase({ onBookNow }: VideoVisualShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<'commercial' | 'social' | 'explainer'>('commercial');

  // Simulated video playback timeline loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.8));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Derived timecode string
  const totalSeconds = 45;
  const currentSec = Math.floor((progress / 100) * totalSeconds);
  const currentFrames = Math.floor(((progress / 100) * totalSeconds * 24) % 24);
  const timeStr = `00:00:${String(currentSec).padStart(2, '0')}:${String(currentFrames).padStart(2, '0')}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080d09] overflow-hidden shadow-2xl">
      {/* Cinema Player Top Bar */}
      <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-[#c6f554]" />
          <span className="text-[11px] font-mono text-zinc-300 font-bold">
            Cinematic AI Video Generation Engine
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            4K MASTER
          </span>
        </div>

        {/* Video Type Filter */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setSelectedFormat('commercial')}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              selectedFormat === 'commercial' ? 'bg-[#c6f554] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            3D Commercial
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat('social')}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              selectedFormat === 'social' ? 'bg-[#c6f554] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Social Reel (9:16)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat('explainer')}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              selectedFormat === 'explainer' ? 'bg-[#c6f554] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tech Motion
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative group overflow-hidden bg-black aspect-[16/9] max-h-[360px] flex items-center justify-center select-none">
        <img
          src="/assets/video_showcase.jpg"
          alt="Genowl 4K Cinema Video Generation Showcase"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
        />

        {/* Dynamic Scanline & Volumetric Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Center Interactive Play/Pause Button Overlay */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute z-20 w-14 h-14 rounded-full bg-black/60 border border-[#c6f554]/60 text-[#c6f554] flex items-center justify-center backdrop-blur-md hover:scale-110 transition-all cursor-pointer shadow-[0_0_25px_rgba(198,245,84,0.4)]"
          title={isPlaying ? 'Pause Preview' : 'Play Showcase'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>

        {/* Top Camera Metadata HUD */}
        <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between text-[10px] font-mono text-zinc-300 drop-shadow-md">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/15">
              CAM A &bull; 60.00 FPS &bull; RAW LOG
            </span>
            <span className="text-[#c6f554] hidden sm:inline">&bull; 3D CAMERA ORBIT ACTIVE</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Real-time Audio EQ Visualizer */}
            <div className="flex items-end gap-0.5 h-3 px-1.5 py-0.5 bg-black/60 rounded border border-white/10">
              {[40, 85, 60, 100, 50, 75, 90].map((h, i) => (
                <div
                  key={i}
                  style={{ height: isPlaying ? `${h}%` : '20%' }}
                  className="w-0.5 bg-[#c6f554] transition-all duration-150"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded bg-black/60 border border-white/15 text-zinc-300 hover:text-white cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#c6f554]" />}
            </button>
          </div>
        </div>

        {/* Bottom Cinema Scrubber & Controls */}
        <div className="absolute bottom-3 left-4 right-4 z-20 space-y-1.5">
          {/* Timeline Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setProgress(Math.max(0, Math.min(100, (clickX / rect.width) * 100)));
            }}
            className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer relative hover:h-2 transition-all"
          >
            <div
              style={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-[#a0dd30] to-[#c6f554] h-full rounded-full relative shadow-[0_0_8px_rgba(198,245,84,0.6)]"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
            <span className="text-[#c6f554] font-bold">{timeStr}</span>
            <span className="text-zinc-400">00:00:45:00 &bull; Studio Render</span>
          </div>
        </div>
      </div>

      {/* Deliverable Specifications */}
      <div className="p-4 bg-black/90 border-t border-white/10 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Master Quality</div>
            <div className="font-mono font-bold text-white">4K UHD (60 FPS)</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Audio Pipeline</div>
            <div className="font-mono font-bold text-[#c6f554]">Studio SFX + Voiceover</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Aspect Ratios</div>
            <div className="font-mono font-bold text-white">16:9 / 9:16 / 1:1</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Commercial Rights</div>
            <div className="font-mono font-bold text-amber-300">100% Client Owned</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-white/5">
          <div className="text-xs text-zinc-400">
            Cinema-grade commercial videos, 3D product animations &amp; viral reels delivered in 48 hours.
          </div>

          <button
            type="button"
            onClick={onBookNow}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(198,245,84,0.3)] flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Book Video Generation ($100)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
