import React from 'react';
import { Globe, Video, Brain, PenTool, CheckCircle2 } from 'lucide-react';

export default function ServicesListVisual() {
  const services = [
    {
      num: '1',
      title: 'Websites (2D / 3D)',
      icon: Globe,
    },
    {
      num: '2',
      title: 'Video generation',
      icon: Video,
    },
    {
      num: '3',
      title: 'Personalized AI',
      icon: Brain,
    },
    {
      num: '4',
      title: 'content creation',
      icon: PenTool,
    },
  ];

  return (
    <div id="services-list-visual" className="w-full flex flex-col justify-center space-y-2.5 py-1">
      {services.map((service, idx) => {
        const Icon = service.icon;
        return (
          <div
            key={service.num}
            id={`service-item-${idx + 1}`}
            className="group/item relative flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-[#c6f554]/30 transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {/* Serial Number Badge */}
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#142016] border border-[#c6f554]/30 text-[#c6f554] text-xs font-bold font-mono shadow-[0_0_8px_rgba(198,245,84,0.15)] group-hover/item:scale-105 group-hover/item:border-[#c6f554]/60 transition-all">
                {service.num}
              </span>
              
              {/* Service Title */}
              <span className="text-sm font-medium text-zinc-200 group-hover/item:text-white transition-colors">
                {service.title}
              </span>
            </div>

            {/* Price Badge and Trailing Icon */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-[#c6f554] bg-[#162417] border border-[#c6f554]/30">
                $99
              </span>
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 group-hover/item:text-[#c6f554] transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
