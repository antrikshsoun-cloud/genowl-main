import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Instagram, Mail, ArrowUpRight, ShieldCheck, ArrowUp, Sparkles, ArrowRight, Phone, Mic } from 'lucide-react';
import { GENOWL_LOGO_BASE64 } from '../services/logoAsset.ts';
import {
  OFFICIAL_HOSTINGER_EMAIL,
  OFFICIAL_GENOWL_GMAIL,
  OFFICIAL_PHONE_DISPLAY,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_INSTAGRAM,
  OFFICIAL_X,
  OFFICIAL_X_URL,
} from '../services/emailService.ts';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refund') => void;
  onOpenAdmin?: () => void;
  onOpenOrder?: (service?: string) => void;
  onOpenBrowserCall?: () => void;
}

export default function Footer({
  onNavigate,
  currentPage,
  onOpenLegal,
  onOpenAdmin,
  onOpenOrder,
  onOpenBrowserCall,
}: FooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position of the reveal container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Smooth cinematic emergence transforms
  const contentY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.85, 1]);
  const auraGlow = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.5, 1]);

  const instagramId = OFFICIAL_INSTAGRAM;
  const xHandle = OFFICIAL_X;
  const xUrl = OFFICIAL_X_URL;
  const hostingerEmail = OFFICIAL_HOSTINGER_EMAIL;
  const gmailAccount = OFFICIAL_GENOWL_GMAIL;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      id="sticky-footer-reveal-wrapper"
      className="relative w-full overflow-hidden pointer-events-auto"
      style={{
        clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)',
      }}
    >
      {/* Structural placeholder that establishes scroll depth */}
      <div className="relative w-full h-[760px] sm:h-[640px] md:h-[540px]">
        {/* Fixed Under-Page Canvas: Glued to viewport bottom, unmasked as container scrolls up */}
        <div className="fixed bottom-0 left-0 w-full h-[760px] sm:h-[640px] md:h-[540px] z-0 flex flex-col justify-between bg-[#030603] text-zinc-400 border-t border-white/[0.08] shadow-[0_-25px_60px_rgba(0,0,0,0.85)]">
          {/* Top Neon Ambient Radial Aura */}
          <motion.div
            style={{ opacity: auraGlow }}
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[160px] bg-radial from-[#c6f554]/20 via-transparent to-transparent blur-3xl"
          />

          {/* Top Crisp Laser Line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c6f554]/50 to-transparent z-20" />

          {/* Animated Internal Content Container */}
          <motion.div
            style={{
              y: contentY,
              scale: contentScale,
              opacity: contentOpacity,
            }}
            className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-10 pb-28 md:pb-8 flex flex-col justify-between will-change-transform"
          >
            {/* ROW 1: Hero Call-to-Action Billboard */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
              <div className="flex flex-col gap-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#c6f554]/10 border border-[#c6f554]/30 text-[#c6f554] text-[11px] font-mono tracking-wide w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#c6f554] animate-pulse" />
                  <span>DISPATCH WITHIN 24–48 HOURS &bull; Q1 CLIENT SLOTS OPEN</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight font-serif">
                  Ready to build something <span className="text-[#c6f554] italic">extraordinary</span>?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Genowl is a platform that provides you multiple services according to your requirements. Basically, we build for you.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => (onOpenOrder ? onOpenOrder('2D Website') : onNavigate('contact'))}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-[#baf345] to-[#d6fa66] text-black font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 hover:brightness-110 shadow-[0_0_20px_rgba(198,245,84,0.35)] transition-all cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer text-center"
                >
                  Talk with Us
                </button>
              </div>
            </div>

            {/* ROW 2: Multi-Column Studio Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4 sm:py-6 text-xs">
              {/* Col 1: Brand & Slogan */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#141e15] border border-[#f7cc46]/50 flex items-center justify-center shadow-[0_0_12px_rgba(247,204,70,0.35)] overflow-hidden p-0.5">
                    <img
                      src={GENOWL_LOGO_BASE64}
                      alt="Genowl Logo"
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                  <span className="font-bold text-base tracking-[0.2em] text-white">GENOWL</span>
                </div>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Engineered with cinema-grade 3D WebGL, 60FPS scroll animations, and Hollywood-tier AI video pipelines.
                </p>
              </div>

              {/* Col 2: Services with Flat Transparent Pricing */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[10px] tracking-widest text-[#c6f554] uppercase font-semibold">
                  Services &amp; Pricing
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => (onOpenOrder ? onOpenOrder('2D Website') : onNavigate('services'))}
                    className="flex items-center justify-between text-zinc-300 hover:text-[#c6f554] transition-colors cursor-pointer text-left"
                  >
                    <span>2D High-Converting Web</span>
                    <span className="font-mono text-[#c6f554] font-semibold">$500</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => (onOpenOrder ? onOpenOrder('3D WebGL') : onNavigate('services'))}
                    className="flex items-center justify-between text-zinc-300 hover:text-[#f7cc46] transition-colors cursor-pointer text-left"
                  >
                    <span>3D WebGL Experience</span>
                    <span className="font-mono text-[#f7cc46] font-semibold">$2,500</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => (onOpenOrder ? onOpenOrder('AI Video') : onNavigate('services'))}
                    className="flex items-center justify-between text-zinc-300 hover:text-[#c6f554] transition-colors cursor-pointer text-left"
                  >
                    <span>AI Video Commercials</span>
                    <span className="font-mono text-[#c6f554] font-semibold">$99</span>
                  </button>
                </div>
              </div>

              {/* Col 3: Navigation */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase font-semibold">
                  Navigation
                </span>
                <div className="flex flex-col gap-1.5">
                  {['Home', 'Services', 'About', 'Contact'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onNavigate(item)}
                      className={`text-left transition-colors cursor-pointer flex items-center gap-1.5 ${
                        currentPage.toLowerCase() === item.toLowerCase()
                          ? 'text-[#c6f554] font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Col 4: Official Communication Channels */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase font-semibold">
                  Direct Inquiries
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${OFFICIAL_PHONE_TEL}`}
                    title="24/7 AI Voice Hotline"
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#c6f554]/40 text-zinc-300 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#c6f554]" />
                      <span className="font-mono text-[11px]">{OFFICIAL_PHONE_DISPLAY}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#c6f554]/10 text-[#c6f554] border border-[#c6f554]/20">24/7 AI</span>
                  </a>

                  {onOpenBrowserCall && (
                    <button
                      type="button"
                      onClick={onOpenBrowserCall}
                      title="Call YZER AI Voice Guide Live (Free)"
                      className="flex items-center justify-between p-2 rounded-lg bg-[#c6f554]/10 hover:bg-[#c6f554]/15 border border-[#c6f554]/30 hover:border-[#c6f554]/60 text-[#c6f554] transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5 text-[#c6f554] animate-pulse" />
                        <span className="font-semibold text-[11px]">Call YZER Live</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#c6f554] text-black">FREE</span>
                    </button>
                  )}

                  <a
                    href={`mailto:${hostingerEmail}`}
                    title="Official Hostinger Support"
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#c6f554]/40 text-zinc-300 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#c6f554]" />
                      <span className="font-mono text-[11px]">{hostingerEmail}</span>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white" />
                  </a>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://instagram.com/${instagramId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram Profile"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#f7cc46]/40 text-zinc-300 hover:text-white transition-all"
                    >
                      <Instagram className="w-3.5 h-3.5 text-[#f7cc46]" />
                      <span className="text-[11px]">@{instagramId}</span>
                    </a>
                    <a
                      href={xUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="X (Twitter) Profile"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#c6f554]/40 text-zinc-300 hover:text-white transition-all"
                    >
                      <svg className="w-3 h-3 fill-current text-zinc-300" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-[11px]">@{xHandle}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: Bottom Legal & Back to Top Dock */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
              <div className="flex items-center gap-3">
                <span>© {new Date().getFullYear()} Genowl Technologies. All rights reserved.</span>
                <span className="hidden sm:inline text-zinc-700">&bull;</span>
                <span className="hidden sm:inline text-zinc-400">Hostinger LiteSpeed Web Engine</span>
              </div>

              <div className="flex items-center gap-4">
                {onOpenLegal && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <button
                      type="button"
                      onClick={() => onOpenLegal('terms')}
                      className="hover:text-[#c6f554] transition-colors cursor-pointer"
                    >
                      Terms
                    </button>
                    <span className="text-zinc-700">&bull;</span>
                    <button
                      type="button"
                      onClick={() => onOpenLegal('privacy')}
                      className="hover:text-[#c6f554] transition-colors cursor-pointer"
                    >
                      Privacy
                    </button>
                    <span className="text-zinc-700">&bull;</span>
                    <button
                      type="button"
                      onClick={() => onOpenLegal('refund')}
                      className="hover:text-[#c6f554] transition-colors cursor-pointer"
                    >
                      Refund
                    </button>
                  </div>
                )}

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1 text-zinc-400 hover:text-[#f7cc46] transition-colors cursor-pointer"
                    title="Studio Admin & Supabase Integration"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#f7cc46]" />
                    <span className="text-[10px]">Admin</span>
                  </button>
                )}

                {/* Back to Top Floating Pill */}
                <button
                  type="button"
                  onClick={scrollToTop}
                  title="Scroll to Top"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#c6f554]/50 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <ArrowUp className="w-3 h-3 text-[#c6f554]" />
                  <span className="text-[10px] font-mono uppercase">Top</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
