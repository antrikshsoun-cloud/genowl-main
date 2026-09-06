import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Check, X, Sparkles, Shield, Clock, Award } from 'lucide-react';

export default function ServicesFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does Genowl\'s transparent pricing model work?',
      answer:
        'We believe in absolute upfront transparency: $500 for high-converting 2D Websites, $2,500 for cutting-edge 3D WebGL interactive experiences, and $99 for specialized AI, Video Generation, and Content packages. There are zero surprise fees, no complex hourly billing, and no recurring subscriptions. You select your tier, submit your brief, and we execute.',
    },
    {
      question: 'What is the difference between 2D and 3D Websites?',
      answer:
        'Our 2D Websites ($500) are sleek, responsive, and mobile-optimized landing pages and multi-page sites with modern typography and fast load speeds. Our 3D Websites ($2,500) are cinema-grade interactive WebGL & Three.js experiences featuring custom 3D models, shaders, particle simulations, and scroll-driven camera movements for brands looking to stand out in the top 1% of the web.',
    },
    {
      question: 'What is the typical delivery turnaround time?',
      answer:
        'Standard deliverables are completed and delivered within 48 to 72 hours. For expedited requests, we prioritize delivery within 24 to 48 hours. You will receive updates directly via email.',
    },
    {
      question: 'What if I need changes or revisions?',
      answer:
        'Every project includes comprehensive revision rounds to ensure the final deliverable matches your exact vision. If something needs tuning or refinement, simply reply with your feedback and our team executes the revisions promptly.',
    },
    {
      question: 'Do I own 100% intellectual property (IP) rights?',
      answer:
        'Yes. Upon delivery, 100% full commercial intellectual property and copyright are transferred directly to you. You own all design files, source code, visual assets, and copy with zero restrictions or licensing royalties.',
    },
    {
      question: 'Can I combine multiple services into one package?',
      answer:
        'Yes! You can order multiple services simultaneously (e.g. 2D Website + Video Generation for a complete product launch), or reach out via our contact form for a coordinated multi-asset delivery schedule.',
    },
    {
      question: 'What information do I need to provide when ordering?',
      answer:
        'No technical jargon is needed! Just tell us your brand name, what you want built, your target audience, and any reference links or visual styles you like. Our AI engine and design specialists handle everything else.',
    },
  ];

  const comparisons = [
    {
      feature: 'Pricing Model',
      genowl: 'Transparent flat rates ($99 - $2,500)',
      traditional: '$3,000 - $10,000 monthly retainers',
      freelance: 'Unpredictable hourly rates ($50-$150/hr)',
    },
    {
      feature: 'Turnaround Time',
      genowl: '48 - 72 hours rapid delivery',
      traditional: '3 to 6 weeks of meetings',
      freelance: 'Variable, often delayed',
    },
    {
      feature: 'Intellectual Property',
      genowl: '100% full IP transfer to client',
      traditional: 'Licensing constraints or royalties',
      freelance: 'Often ambiguous contracts',
    },
    {
      feature: 'Quality Assurance',
      genowl: 'AI speed + human design review',
      traditional: 'Slow manual agency layers',
      freelance: 'Inconsistent skill levels',
    },
  ];

  return (
    <div className="mt-16 space-y-16">
      {/* 1. Comparison Matrix: Genowl vs Traditional Agencies */}
      <div className="rounded-3xl bg-[#0b120c]/90 border border-white/10 p-4 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden w-full max-w-full">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c6f554]/10 border border-[#c6f554]/30 text-[#c6f554] text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Why Choose Genowl</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How We Compare
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Modern high-speed execution versus outdated agency models.
          </p>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-center text-[10px] text-zinc-500 mb-2 font-mono flex items-center justify-center gap-1">
          <span>&larr; Scroll sideways to view all dimensions &rarr;</span>
        </div>

        <div className="overflow-x-auto w-full max-w-full touch-pan-x rounded-2xl border border-white/5">
          <table className="w-full min-w-[540px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Dimension</th>
                <th className="py-3.5 px-4 text-[#c6f554] font-bold bg-[#c6f554]/[0.06] rounded-t-xl">
                  Genowl ($99 Flat)
                </th>
                <th className="py-3.5 px-4 text-zinc-400">Traditional Agencies</th>
                <th className="py-3.5 px-4 text-zinc-400">Freelance Platforms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisons.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{item.feature}</td>
                  <td className="py-3.5 px-4 font-bold text-[#c6f554] bg-[#c6f554]/[0.04]">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#c6f554] shrink-0" />
                      <span>{item.genowl}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span>{item.traditional}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span>{item.freelance}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Frequently Asked Questions Accordion */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#c6f554]" />
            <span>Common Questions</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Everything you need to know about our services, flat rates, and delivery workflow.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-[#0c120e]/80 backdrop-blur-md overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="font-semibold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#c6f554] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
