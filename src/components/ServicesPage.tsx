import React, { useState } from 'react';
import { Globe, Video, Brain, PenTool, CheckCircle2, ArrowRight, Sparkles, Box, Layers, X, Check } from 'lucide-react';
import ServicesFAQ from './ServicesFAQ.tsx';
import TrustMetrics from './TrustMetrics.tsx';

interface ServicesPageProps {
  onSelectService: (serviceName: string) => void;
  onNavigateContact: () => void;
}

export default function ServicesPage({ onSelectService, onNavigateContact }: ServicesPageProps) {
  // Website Tier Selection: '2d' ($500) vs '3d' ($2,500)
  const [webTier, setWebTier] = useState<'2d' | '3d'>('2d');
  const [webOptionsModalOpen, setWebOptionsModalOpen] = useState(false);

  const websiteTiers = {
    '2d': {
      title: '2D Website',
      price: '$500',
      badge: 'High-Converting',
      tagline: 'Modern, high-converting responsive 2D websites engineered for business growth.',
      description:
        'Transform your brand with a bespoke, fast-loading, mobile-first 2D website designed with clean typography, conversion-focused CTAs, and semantic modern code.',
      features: [
        'Bespoke responsive 2D layout & wireframing',
        'Mobile, tablet & desktop cross-browser optimization',
        'Sleek modern typography & micro-interactions',
        'Interactive forms, lead capture & CTA integration',
        'Semantic HTML/React structure & 95+ PageSpeed score',
        '100% full source code, deployment & 48-72h turnaround',
      ],
    },
    '3d': {
      title: '3D Website',
      price: '$2,500',
      badge: 'Cinema-Grade WebGL',
      tagline: 'Immersive Three.js & WebGL 3D interactive digital worlds.',
      description:
        'Elevate into the top 1% of the internet with immersive 3D WebGL scenes, custom 3D models, physics-driven lighting, shaders, and scroll-driven camera sequences.',
      features: [
        'Custom interactive 3D WebGL & Three.js canvas architecture',
        '3D model asset integration, lighting & material shaders',
        'Scroll-driven 3D camera animations & gyroscope dynamics',
        'Interactive particle systems & physics simulations',
        '60FPS GPU performance optimization across mobile & desktop',
        'Full 3D source code, GLTF assets & direct deployment',
      ],
    },
  };

  const currentWebConfig = websiteTiers[webTier];

  const standardServices = [
    {
      id: 'video-generation',
      category: 'video',
      number: '02',
      title: 'Video Generation',
      price: '$99',
      pricePeriod: 'per project',
      icon: Video,
      tagline: 'Stunning AI-powered promo videos, reels, and cinematic clips.',
      description:
        'Captivate your target audience with high-impact visual storytelling, dynamic product showcases, and social-ready commercial assets.',
      features: [
        'High-definition video rendering (1080p/4K)',
        'Custom voiceover & ambient audio integration',
        'Optimized for Reels, TikTok, YouTube & Ads',
        'Brand logo & visual identity integration',
        'Dynamic motion transitions & visual effects',
        'Fast turnaround with iterative revisions',
      ],
      badge: 'Trending',
    },
    {
      id: 'personalized-ai',
      category: 'ai',
      number: '03',
      title: 'Personalized AI',
      price: '$99',
      pricePeriod: 'per project',
      icon: Brain,
      tagline: 'Custom AI systems and intelligent workflow automation.',
      description:
        'Empower your team with tailored AI assistants, custom knowledge agents, and automated workflows tailored strictly to your operations.',
      features: [
        'Custom prompt & context engineering',
        'Intelligent customer service assistant setup',
        'Workflow automation for repetitive tasks',
        'Data extraction & document insights',
        'Integration with your existing tool stack',
        'Ongoing tuning & performance evaluation',
      ],
      badge: 'Advanced',
    },
    {
      id: 'content-creation',
      category: 'content',
      number: '04',
      title: 'Content Creation',
      price: '$99',
      pricePeriod: 'per project',
      icon: PenTool,
      tagline: 'Engaging copy, branded visuals, and complete social packages.',
      description:
        'Elevate your digital footprint with persuasive copywriting, striking graphics, and strategic multi-channel content tailored to your audience.',
      features: [
        'High-converting landing page & ad copy',
        'Branded social media visual posts & banners',
        'SEO-optimized articles and blog posts',
        'Brand tone-of-voice alignment',
        'Multi-format assets ready to publish',
        'Comprehensive content calendars available',
      ],
      badge: 'High Impact',
    },
  ];

  return (
    <div id="services-page" className="pt-4 sm:pt-6 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121c13]/90 border border-white/10 shadow-lg mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#c6f554]" />
          <span className="text-xs text-zinc-300 font-medium">Transparent Upfront Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
          Our Services &amp; <span className="text-[#c6f554] font-serif-italic">Pricing</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
          From high-converting <span className="text-white font-semibold">2D Websites ($500)</span> and cinema-grade <span className="text-[#c6f554] font-semibold">3D WebGL ($2,500)</span>, to rapid <span className="text-white font-semibold">$99 packages</span> for AI, Video &amp; Content. 100% IP ownership guaranteed.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
        
        {/* CARD 01: WEBSITE SERVICE WITH 2D ($500) & 3D ($2,500) OPTIONS */}
        <div
          id="service-card-web-design"
          className="group relative rounded-3xl bg-[#0d140e]/95 border border-[#c6f554]/30 hover:border-[#c6f554]/60 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,245,84,0.2)] overflow-hidden"
        >
          {/* Ambient lighting */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#c6f554]/[0.07] rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#172318] border border-[#c6f554]/40 flex items-center justify-center text-[#c6f554] shadow-[0_0_15px_rgba(198,245,84,0.3)]">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-[#c6f554] font-semibold tracking-wider">
                    SERVICE #01
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Website Service
                  </h2>
                </div>
              </div>

              {/* Dynamic Price Display based on chosen tier */}
              <div className="text-right">
                <div className="inline-flex items-baseline gap-1 px-3.5 py-1 rounded-xl bg-[#19271a] border border-[#c6f554]/50 shadow-[0_0_15px_rgba(198,245,84,0.25)]">
                  <span className="text-2xl sm:text-3xl font-black text-[#c6f554] tracking-tight font-mono transition-all">
                    {currentWebConfig.price}
                  </span>
                </div>
                <span className="block text-[11px] text-zinc-400 mt-1">flat project fee</span>
              </div>
            </div>

            {/* INTERACTIVE 2D vs 3D SELECTION TABS */}
            <div className="mb-5 p-1 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <div className="px-3 py-1 text-[11px] text-zinc-400 font-medium flex items-center justify-between">
                <span>Select Website Tier:</span>
                <button
                  type="button"
                  onClick={() => setWebOptionsModalOpen(true)}
                  className="text-[10px] text-[#c6f554] hover:underline cursor-pointer"
                >
                  Compare Details
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {/* 2D Option Button ($500) */}
                <button
                  type="button"
                  onClick={() => setWebTier('2d')}
                  className={`py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                    webTier === '2d'
                      ? 'bg-[#c6f554] text-black shadow-[0_0_15px_rgba(198,245,84,0.4)]'
                      : 'text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>2D Website ($500)</span>
                </button>

                {/* 3D Option Button ($2,500) */}
                <button
                  type="button"
                  onClick={() => setWebTier('3d')}
                  className={`py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                    webTier === '3d'
                      ? 'bg-[#c6f554] text-black shadow-[0_0_15px_rgba(198,245,84,0.4)]'
                      : 'text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 shrink-0" />
                  <span>3D Website ($2,500)</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-zinc-200 font-medium mb-2">
              {currentWebConfig.tagline}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              {currentWebConfig.description}
            </p>

            {/* Features List */}
            <div className="border-t border-white/[0.08] pt-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Included in {currentWebConfig.title}:
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c6f554]/10 text-[#c6f554] border border-[#c6f554]/30 font-medium">
                  {currentWebConfig.badge}
                </span>
              </div>
              <ul className="space-y-2">
                {currentWebConfig.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#c6f554] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => onSelectService(currentWebConfig.title)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)] hover:shadow-[0_0_30px_rgba(198,245,84,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
            >
              <span>Order {currentWebConfig.title} ({currentWebConfig.price})</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => setWebOptionsModalOpen(true)}
              className="w-full py-2 text-center text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              View Side-by-Side 2D vs 3D Specs
            </button>
          </div>
        </div>

        {/* CARDS 02, 03, 04: STANDARD $99 SERVICES */}
        {standardServices.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group relative rounded-3xl bg-[#0d140e]/90 border border-white/[0.08] hover:border-[#c6f554]/40 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,245,84,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#c6f554]/[0.04] group-hover:bg-[#c6f554]/[0.08] rounded-full blur-2xl pointer-events-none transition-colors" />

              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#172318] border border-[#c6f554]/30 flex items-center justify-center text-[#c6f554] shadow-[0_0_15px_rgba(198,245,84,0.25)] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-[#c6f554] font-semibold tracking-wider">
                        SERVICE #{service.number}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-[#19271a] border border-[#c6f554]/40 shadow-[0_0_12px_rgba(198,245,84,0.2)]">
                      <span className="text-2xl sm:text-3xl font-black text-[#c6f554] tracking-tight font-mono">
                        {service.price}
                      </span>
                    </div>
                    <span className="block text-[11px] text-zinc-400 mt-1">flat rate</span>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 font-medium mb-3">
                  {service.tagline}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="border-t border-white/[0.08] pt-5 mb-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3.5">
                    What's included:
                  </h3>
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#c6f554] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.3)] hover:shadow-[0_0_30px_rgba(198,245,84,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                >
                  <span>Order {service.title} for {service.price}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Metrics & Live Delivery Counter */}
      <TrustMetrics />

      {/* Value Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0f1911] via-[#142317] to-[#0f1911] border border-white/10 p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl mb-16">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Need a combination or custom bundle?
          </h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Reach out directly to discuss your specific requirements. All you do is tell us what you need built, and we take care of the entire execution.
          </p>
          <button
            type="button"
            onClick={onNavigateContact}
            className="px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-zinc-200 bg-white/10 hover:bg-white/15 border border-white/15 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Contact Our Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comparison Matrix & Interactive FAQ */}
      <ServicesFAQ />

      {/* 2D vs 3D WEBSITE SELECTION MODAL */}
      {webOptionsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setWebOptionsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-[#0e1610] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-mono text-[#c6f554] font-semibold">CHOOSE ARCHITECTURE</span>
                <h2 className="text-2xl font-bold text-white">Select Your Website Tier</h2>
              </div>
              <button
                type="button"
                onClick={() => setWebOptionsModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: 2D Website ($500) */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#c6f554]/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white">2D Architecture</span>
                    <span className="text-xl font-black text-[#c6f554] font-mono">$500</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">2D Website</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    High-converting responsive landing pages &amp; corporate websites with sleek 2D graphics and lightning-fast speeds.
                  </p>
                  <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c6f554] shrink-0" />
                      <span>Custom Responsive 2D Layout</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c6f554] shrink-0" />
                      <span>Mobile &amp; Tablet Cross-Browser</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c6f554] shrink-0" />
                      <span>High-Conversion Form &amp; CTAs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c6f554] shrink-0" />
                      <span>48 - 72h Rapid Turnaround</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWebOptionsModalOpen(false);
                    onSelectService('2D Website');
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer"
                >
                  Choose 2D Website ($500)
                </button>
              </div>

              {/* Option 2: 3D Website ($2,500) */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#142317] to-[#0a120b] border border-[#c6f554]/50 shadow-[0_0_25px_rgba(198,245,84,0.15)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#c6f554] text-black">Top 1% Immersive</span>
                    <span className="text-xl font-black text-[#c6f554] font-mono">$2,500</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">3D Website</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    Cinema-grade interactive WebGL &amp; Three.js 3D environments with dynamic models, shaders, and camera sequences.
                  </p>
                  <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c6f554] shrink-0" />
                      <span>Interactive Three.js / WebGL Scene</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c6f554] shrink-0" />
                      <span>Custom 3D Model &amp; Shader Lighting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c6f554] shrink-0" />
                      <span>Scroll-Driven Camera Movements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c6f554] shrink-0" />
                      <span>Full 3D Assets &amp; GLTF Source Files</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWebOptionsModalOpen(false);
                    onSelectService('3D Website');
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.4)] transition-all cursor-pointer"
                >
                  Choose 3D Website ($2,500)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
