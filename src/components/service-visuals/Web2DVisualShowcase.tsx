import React, { useState } from 'react';
import {
  Globe,
  Layout,
  TrendingUp,
  BarChart3,
  Smartphone,
  Monitor,
  CheckCircle2,
  ExternalLink,
  Shield,
  Zap,
  Users,
  ArrowUpRight,
  Activity,
} from 'lucide-react';

interface Web2DVisualShowcaseProps {
  onBookNow: () => void;
}

export default function Web2DVisualShowcase({ onBookNow }: Web2DVisualShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'conversions' | 'mobile'>('analytics');
  const [metricMultiplier, setMetricMultiplier] = useState(1);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080d09] overflow-hidden shadow-2xl">
      {/* Browser Chrome Header */}
      <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 ml-2 hidden sm:inline">
            Interactive 2D Frontend Sandbox
          </span>
        </div>

        {/* Address Bar */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300 w-52 sm:w-64 truncate">
          <Shield className="w-3 h-3 text-[#c6f554] shrink-0" />
          <span className="text-zinc-500">https://</span>
          <span className="text-white">genowl.tech/preview/enterprise-ui</span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab !== 'mobile' ? 'text-[#c6f554] bg-[#c6f554]/10' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab === 'mobile' ? 'text-[#c6f554] bg-[#c6f554]/10' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Mobile Responsiveness Preview"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Live Frontend Canvas */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#09110a] via-[#080d09] to-[#060a07] min-h-[360px]">
        {activeTab === 'mobile' ? (
          /* Mobile Viewport Simulation */
          <div className="max-w-[280px] mx-auto rounded-3xl border-2 border-white/20 p-3 bg-black shadow-2xl space-y-3">
            <div className="w-20 h-3.5 bg-white/20 rounded-full mx-auto" />
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-xs text-white">GENOWL</span>
              <div className="px-2 py-0.5 rounded-full bg-[#c6f554]/20 text-[#c6f554] text-[9px] font-bold">
                100% Mobile Fluid
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#132416] to-[#0c160e] border border-[#c6f554]/30 space-y-2">
              <div className="text-[10px] text-zinc-400">Mobile Conversion Rate</div>
              <div className="text-xl font-extrabold text-white">4.82% <span className="text-[#c6f554] text-xs">+38%</span></div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-[#c6f554] h-full w-4/5 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[9px] text-zinc-400">Avg Speed</div>
                <div className="text-xs font-mono font-bold text-white">0.38s</div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[9px] text-zinc-400">Lighthouse</div>
                <div className="text-xs font-mono font-bold text-[#c6f554]">99 / 100</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onBookNow}
              className="w-full py-2 rounded-xl text-center font-bold text-[11px] bg-[#c6f554] text-black cursor-pointer shadow-md"
            >
              Book 2D Website &bull; $500
            </button>
          </div>
        ) : (
          /* Desktop Luxury SaaS Layout */
          <div className="space-y-4">
            {/* Top Micro-Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#c6f554]/20 border border-[#c6f554] flex items-center justify-center text-[#c6f554] text-xs font-black">
                  G
                </div>
                <span className="text-xs font-bold text-white">Nexus Enterprise OS</span>
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">&bull; 2D Custom Suite</span>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('analytics');
                    setMetricMultiplier(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-[#c6f554] text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Metrics Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('conversions');
                    setMetricMultiplier(1.4);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer ${
                    activeTab === 'conversions'
                      ? 'bg-[#c6f554] text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Funnel &amp; Revenue
                </button>
              </div>
            </div>

            {/* Interactive Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#c6f554]/40 transition-all">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span>Monthly MRR</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#c6f554]" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  ${Math.round(48250 * metricMultiplier).toLocaleString()}
                </div>
                <div className="text-[10px] text-[#c6f554] font-medium mt-1">
                  +{18.4 * metricMultiplier}% vs prior cycle
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#c6f554]/40 transition-all">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span>Checkout Conversion</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {(4.92 * metricMultiplier).toFixed(2)}%
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  Industry avg: 1.8% (2.7x higher)
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#c6f554]/40 transition-all">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span>Active Clients</span>
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {Math.round(2840 * metricMultiplier).toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  Zero churn recorded
                </div>
              </div>
            </div>

            {/* Interactive Graph / Visual Module */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121f14] via-[#0d160e] to-[#0a100b] border border-[#c6f554]/30 shadow-[0_0_20px_rgba(198,245,84,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#c6f554]" />
                    <span>Real-Time User Velocity &amp; Pipeline</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Click bars below to test live interactive state response</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c6f554]/20 text-[#c6f554] border border-[#c6f554]/30">
                  Live Preview
                </span>
              </div>

              {/* Dynamic Bar Simulator */}
              <div className="grid grid-cols-7 gap-2 items-end h-20 pt-2">
                {[45, 68, 52, 85, 94, 72, 98].map((val, idx) => {
                  const adjusted = Math.min(100, Math.round(val * (metricMultiplier === 1 ? 1 : 1.15)));
                  return (
                    <div
                      key={idx}
                      onClick={() => setMetricMultiplier(1 + (idx * 0.08))}
                      className="group flex flex-col items-center gap-1 cursor-pointer"
                      title={`Day ${idx + 1}: ${adjusted}% throughput`}
                    >
                      <div className="w-full bg-white/5 rounded-t-lg overflow-hidden h-16 flex items-end">
                        <div
                          style={{ height: `${adjusted}%` }}
                          className="w-full bg-gradient-to-t from-[#86b527] to-[#c6f554] group-hover:from-[#a0dd30] group-hover:to-white transition-all rounded-t-sm shadow-[0_0_8px_rgba(198,245,84,0.3)]"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-zinc-400 group-hover:text-white">
                        D{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c6f554]" />
            <span>Semantic HTML &bull; 95+ PageSpeed &bull; Tailored to your exact branding</span>
          </div>

          <button
            type="button"
            onClick={onBookNow}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shadow-[0_0_15px_rgba(198,245,84,0.25)] flex items-center justify-center gap-1.5"
          >
            <span>Book 2D Website ($500)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
