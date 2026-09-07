import React, { useState } from 'react';
import {
  Brain,
  MessageSquare,
  PhoneCall,
  Database,
  CalendarCheck,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  Cpu,
} from 'lucide-react';

interface AiAgentVisualShowcaseProps {
  onBookNow: () => void;
}

export default function AiAgentVisualShowcase({ onBookNow }: AiAgentVisualShowcaseProps) {
  const [selectedNode, setSelectedNode] = useState<'whatsapp' | 'voice' | 'knowledge' | 'crm'>('whatsapp');

  const nodeDetails = {
    whatsapp: {
      title: 'WhatsApp & Omnichannel Inbound',
      status: 'Active • 24/7 Webhook Listening',
      latency: '42ms',
      metric: '100% Instant Response Rate',
      simulatedAction:
        'Client texts: "Looking for an enterprise 3D website". Agent answers with custom pricing breakdown, qualifies budget, and asks for phone callback time.',
      icon: MessageSquare,
      color: '#25D366',
    },
    voice: {
      title: 'Real-Time Voice AI Agent Engine',
      status: 'Low Latency Web Speech & SIP Trunk',
      latency: '68ms',
      metric: 'Human-Parity Natural Timbre',
      simulatedAction:
        'Client dials phone hotline. Voice agent greets by name, answers technical architectural questions, and guides them step-by-step through slot booking.',
      icon: PhoneCall,
      color: '#c6f554',
    },
    knowledge: {
      title: 'Vector Knowledge Base & RAG Core',
      status: 'Synchronized with Docs, PDFs & FAQs',
      latency: '24ms',
      metric: 'Zero Hallucination Retrieval',
      simulatedAction:
        'Agent embeds queries into high-dimensional vector embeddings, retrieves exact company policies, pricing sheets, and engineering specs in milliseconds.',
      icon: Database,
      color: '#38bdf8',
    },
    crm: {
      title: 'Automated CRM & Calendar Dispatch',
      status: 'Connected to Google Cal, Stripe & HubSpot',
      latency: '85ms',
      metric: '1-Click Calendar Meeting Lock',
      simulatedAction:
        'Agent locks slot directly on Google Calendar, dispatches dual notification emails to leadership team, and syncs client record to internal database.',
      icon: CalendarCheck,
      color: '#f59e0b',
    },
  };

  const active = nodeDetails[selectedNode];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080d09] overflow-hidden shadow-2xl space-y-0">
      {/* Visual Header */}
      <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#c6f554] animate-ping" />
          <span className="text-[11px] font-mono text-zinc-300 font-bold">
            Autonomous Agent Nervous System
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30">
            Multi-Node Pipeline
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <Activity className="w-3 h-3 text-[#c6f554]" />
          <span>Average SLA: &lt; 85ms</span>
        </div>
      </div>

      {/* Main 3D Architecture Visual Container */}
      <div className="relative group overflow-hidden bg-black aspect-[16/9] max-h-[360px]">
        <img
          src="/assets/ai_agent_network.jpg"
          alt="Genowl AI Agent Multi-System Architecture"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 opacity-90"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d09] via-transparent to-black/40 pointer-events-none" />

        {/* Interactive Clickable Node Pills Overlaid */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
          {(Object.keys(nodeDetails) as Array<keyof typeof nodeDetails>).map((key) => {
            const node = nodeDetails[key];
            const isSelected = selectedNode === key;
            const Icon = node.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedNode(key)}
                className={`px-2.5 py-1 rounded-xl text-[10.5px] font-semibold border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#182a1b] border-[#c6f554] text-[#c6f554] shadow-[0_0_12px_rgba(198,245,84,0.35)]'
                    : 'bg-black/60 border-white/15 text-zinc-300 hover:border-white/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: node.color }} />
                <span>{node.title.split(' ')[0]} Node</span>
              </button>
            );
          })}
        </div>

        {/* Live Active Data Stream Banner inside Visual */}
        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md space-y-1.5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <active.icon className="w-4 h-4" style={{ color: active.color }} />
              <span className="text-xs font-bold text-white">{active.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#c6f554] bg-[#c6f554]/10 px-2 py-0.5 rounded-full border border-[#c6f554]/20">
                ⚡ {active.latency}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">{active.status}</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
            {active.simulatedAction}
          </p>
        </div>
      </div>

      {/* Feature Pills & Bottom Conversion */}
      <div className="p-4 bg-black/90 border-t border-white/10 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Response Speed</div>
            <div className="font-mono font-bold text-white">&lt; 1 Second</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Multi-Channel</div>
            <div className="font-mono font-bold text-[#c6f554]">WhatsApp, Voice &amp; Web</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Operating Cost</div>
            <div className="font-mono font-bold text-white">90% Less than Staff</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-zinc-500 text-[9.5px]">Deployment</div>
            <div className="font-mono font-bold text-amber-300">48h Full Pipeline</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-white/5">
          <div className="text-xs text-zinc-400">
            Autonomous agent customized strictly to your company docs, database &amp; workflows.
          </div>

          <button
            type="button"
            onClick={onBookNow}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(198,245,84,0.3)] flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Book AI Agent ($200)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
