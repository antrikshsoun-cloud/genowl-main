import React, { useState } from 'react';
import {
  PenTool,
  Image as ImageIcon,
  Sparkles,
  ArrowUpRight,
  ZoomIn,
  Layers,
  Palette,
  CheckCircle2,
} from 'lucide-react';

interface ContentVisualShowcaseProps {
  onBookNow: () => void;
}

export default function ContentVisualShowcase({ onBookNow }: ContentVisualShowcaseProps) {
  const [zoomActive, setZoomActive] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<'perfume' | 'campaign' | 'social'>('perfume');

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080d09] overflow-hidden shadow-2xl">
      {/* Visual Header */}
      <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-[#c6f554]" />
          <span className="text-[11px] font-mono text-zinc-300 font-bold">
            Photorealistic Asset &amp; Creative Studio
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30">
            8K Resolution
          </span>
        </div>

        {/* Zoom Inspection Toggle */}
        <button
          type="button"
          onClick={() => setZoomActive(!zoomActive)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 border transition-all cursor-pointer ${
            zoomActive
              ? 'bg-[#c6f554] text-black border-[#c6f554]'
              : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
          }`}
        >
          <ZoomIn className="w-3 h-3" />
          <span>{zoomActive ? 'Reset View' : 'Inspect 2X Macro'}</span>
        </button>
      </div>

      {/* Visual Asset Container */}
      <div className="relative group overflow-hidden bg-black aspect-[16/9] max-h-[360px] flex items-center justify-center select-none">
        <img
          src="/assets/content_showcase.jpg"
          alt="Genowl 8K Photorealistic Product Visual Creation"
          className={`w-full h-full object-cover transition-all duration-700 ${
            zoomActive ? 'scale-150 origin-center' : 'group-hover:scale-105'
          }`}
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Spec Badges */}
        <div className="absolute top-3 left-4 z-10 flex flex-wrap gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-black/70 border border-white/15 backdrop-blur-md text-[10px] font-mono text-zinc-200">
            PBR Caustics &amp; Volumetric Atmosphere
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-black/70 border border-[#c6f554]/30 backdrop-blur-md text-[10px] font-mono text-[#c6f554]">
            Macro Detail 8192 x 4608 px
          </div>
        </div>

        {/* Bottom Metadata Banner */}
        <div className="absolute bottom-3 left-4 right-4 z-10 p-3 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c6f554]" />
              <span>Obsidian Elixir &bull; Commercial Advertising Asset</span>
            </div>
            <div className="text-[10.5px] text-zinc-400">
              Tailored visual direction for luxury brands, e-commerce &amp; social packaging
            </div>
          </div>

          <div className="hidden sm:block text-right font-mono text-[10px] text-zinc-400">
            <div>Color Profile: DCI-P3</div>
            <div className="text-[#c6f554]">Full Commercial IP Rights</div>
          </div>
        </div>
      </div>

      {/* Deliverables Breakdown & Conversion */}
      <div className="p-4 bg-black/90 border-t border-white/10 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Asset Formats</div>
            <div className="font-mono font-bold text-white">PNG, WebP, SVG &amp; PSD</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Copywriting</div>
            <div className="font-mono font-bold text-[#c6f554]">High-Converting Copy</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Brand Voice</div>
            <div className="font-mono font-bold text-white">100% On-Brand Tone</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Delivery SLA</div>
            <div className="font-mono font-bold text-amber-300">24 - 48 Hours</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-white/5">
          <div className="text-xs text-zinc-400">
            Complete creative package including visuals, brand copy, and multi-channel social hooks.
          </div>

          <button
            type="button"
            onClick={onBookNow}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(198,245,84,0.3)] flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Book Content Creation ($99)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
