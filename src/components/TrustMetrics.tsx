import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Award, Sparkles, CheckCircle2, Clock, Scale, FileCode, Check } from 'lucide-react';

export default function TrustMetrics() {
  const [projectsDelivered, setProjectsDelivered] = useState<string>('24+');

  // Load dynamically configured count from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem('genowl_projects_delivered');
    if (saved) {
      setProjectsDelivered(saved);
    }

    // Listen for live updates from admin portal
    const handleStorage = () => {
      const updated = localStorage.getItem('genowl_projects_delivered');
      if (updated) setProjectsDelivered(updated);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const metrics = [
    { label: 'Projects Delivered', value: projectsDelivered, detail: 'Updated directly by Genowl team' },
    { label: 'Average Turnaround', value: '48h', detail: 'Rapid execution without delay' },
    { label: 'Commercial IP Rights', value: '100%', detail: 'Full copyright transferred to you' },
    { label: 'Flat Rate Pricing', value: '$99', detail: 'Zero recurring fees or retainers' },
  ];

  const guarantees = [
    {
      icon: Scale,
      title: '100% Full IP Transfer',
      desc: 'You legally own all intellectual property, source files, and design assets upon completion. No royalties, no recurring licensing fees.',
    },
    {
      icon: Clock,
      title: '48-Hour Rapid Sprints',
      desc: 'Our AI-assisted design pipeline delivers your completed project in 48 to 72 hours, eliminating the typical 4-week agency wait.',
    },
    {
      icon: CheckCircle2,
      title: 'Comprehensive Revisions',
      desc: 'We refine the work until it meets your requirements. You provide the feedback, and our team executes the updates.',
    },
    {
      icon: FileCode,
      title: 'Production-Ready Assets',
      desc: 'From responsive website code to 4K video exports and custom AI prompts, everything delivered is ready for immediate commercial deployment.',
    },
  ];

  return (
    <div className="my-16 space-y-12">
      {/* 4 Performance Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#0b120c]/80 border border-white/10 shadow-2xl backdrop-blur-xl">
        {metrics.map((m, i) => (
          <div key={i} className="text-center sm:text-left p-3">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#c6f554] tracking-tight font-mono">
              {m.value}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-1">{m.label}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">{m.detail}</div>
          </div>
        ))}
      </div>

      {/* Honest Service Guarantees (No fake testimonials) */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c6f554]/10 border border-[#c6f554]/30 text-[#c6f554] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Our Commitment</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How We Protect &amp; Deliver For You
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Built on transparent pricing, legal IP ownership transfer, and predictable delivery times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {guarantees.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0c130d]/80 border border-white/10 hover:border-[#c6f554]/30 backdrop-blur-xl shadow-xl flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#172318] border border-[#c6f554]/30 flex items-center justify-center text-[#c6f554] mb-4 shadow-[0_0_12px_rgba(198,245,84,0.2)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{g.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
