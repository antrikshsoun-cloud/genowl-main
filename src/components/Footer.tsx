import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Instagram, Mail, ArrowUpRight, ShieldCheck, ArrowUp } from 'lucide-react';
import { GENOWL_LOGO_BASE64 } from '../services/logoAsset.ts';
import {
  OFFICIAL_HOSTINGER_EMAIL,
  OFFICIAL_GENOWL_GMAIL,
  OFFICIAL_INSTAGRAM,
  OFFICIAL_X,
  OFFICIAL_X_URL,
} from '../services/emailService.ts';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refund') => void;
  onOpenAdmin?: () => void;
}

export default function Footer({ onNavigate, currentPage, onOpenLegal, onOpenAdmin }: FooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion Sticky Reveal Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Parallax translation, depth scaling, and luminosity reveal
  const translateY = useTransform(scrollYProgress, [0, 1], [-60, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.4, 0.85, 1]);
  const neonGlow = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0.4, 0.9]);

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
      id="main-footer-container"
      className="relative w-full mt-auto overflow-hidden pointer-events-auto"
    >
      {/* Top Neon Ambient Radial Glow Line */}
      <motion.div
        style={{ opacity: neonGlow }}
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[120px] bg-radial from-[#c6f554]/15 via-transparent to-transparent blur-2xl"
      />

      {/* Top Laser Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c6f554]/40 to-transparent z-20" />

      {/* Sticky Parallax Reveal Body */}
      <motion.footer
        id="main-footer"
        style={{
          y: translateY,
          scale: scale,
          opacity: opacity,
        }}
        className="relative z-10 w-full bg-[#040704]/95 backdrop-blur-2xl border-t border-white/[0.08] text-zinc-400 pt-12 pb-28 md:pb-12 px-4 sm:px-6 md:px-8 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] will-change-transform"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Brand info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#141e15] border border-[#f7cc46]/50 flex items-center justify-center shadow-[0_0_10px_rgba(247,204,70,0.35)] overflow-hidden p-0.5">
                <img
                  src={GENOWL_LOGO_BASE64}
                  alt="Genowl Logo"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              <span className="font-bold text-sm tracking-[0.18em] text-white">GENOWL</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase bg-[#c6f554]/10 text-[#c6f554] border border-[#c6f554]/30">
                Studio
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm">
              All you have to do is buy our service and tell us what to build — the rest is on us.
            </p>
          </div>

          {/* Center Page Quick Navigation */}
          <nav className="flex items-center gap-6 text-xs font-medium">
            {['Home', 'Services', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onNavigate(item)}
                className={`transition-colors cursor-pointer relative py-1 ${
                  currentPage.toLowerCase() === item.toLowerCase()
                    ? 'text-[#c6f554] font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item}
                {currentPage.toLowerCase() === item.toLowerCase() && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#c6f554] shadow-[0_0_6px_#c6f554]" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Contacts (Hostinger Mail, Gmail, Instagram, X) */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 text-xs">
            {/* Hostinger Official Mail */}
            <a
              href={`mailto:${hostingerEmail}`}
              title="Official Hostinger Support & Inquiries"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#c6f554]/50 text-zinc-300 hover:text-[#c6f554] transition-all group"
            >
              <Mail className="w-3.5 h-3.5 text-[#c6f554]" />
              <span className="font-mono text-[11px]">{hostingerEmail}</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
            </a>

            {/* Backup Operations Gmail */}
            <a
              href={`mailto:${gmailAccount}`}
              title="Direct Operations Gmail"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#f7cc46]/40 text-zinc-300 hover:text-white transition-all group"
            >
              <Mail className="w-3.5 h-3.5 text-[#f7cc46]" />
              <span className="font-mono text-[11px]">{gmailAccount}</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
            </a>

            {/* Instagram Handle */}
            <a
              href={`https://instagram.com/${instagramId}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Official Instagram Profile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#f7cc46]/40 text-zinc-300 hover:text-white transition-all group"
            >
              <Instagram className="w-3.5 h-3.5 text-[#f7cc46]" />
              <span>@{instagramId}</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
            </a>

            {/* Official X (Twitter) Handle */}
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Official X (Twitter) Profile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#c6f554]/50 text-zinc-300 hover:text-[#c6f554] transition-all group"
            >
              <svg className="w-3.5 h-3.5 fill-current text-zinc-300 group-hover:text-[#c6f554] transition-colors" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="font-medium">@{xHandle}</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
            </a>

            {/* Scroll Back to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              title="Back to Top"
              className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-[#c6f554]/40 text-zinc-400 hover:text-[#c6f554] transition-all cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.04] text-[11px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Genowl Technologies. All rights reserved.</span>

          {onOpenLegal && (
            <div className="flex items-center gap-5 text-zinc-400">
              <button
                type="button"
                onClick={() => onOpenLegal('terms')}
                className="hover:text-[#c6f554] transition-colors cursor-pointer"
              >
                Terms &amp; Conditions
              </button>
              <span className="text-zinc-700">&bull;</span>
              <button
                type="button"
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-[#c6f554] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-zinc-700">&bull;</span>
              <button
                type="button"
                onClick={() => onOpenLegal('refund')}
                className="hover:text-[#c6f554] transition-colors cursor-pointer"
              >
                Refund Policy
              </button>
              {onOpenAdmin && (
                <>
                  <span className="text-zinc-700">&bull;</span>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="hover:text-[#f7cc46] text-zinc-400 hover:underline transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#f7cc46]" />
                    <span>Admin Portal</span>
                  </button>
                </>
              )}
            </div>
          )}

          <span className="text-zinc-500">Services starting at flat $99 each.</span>
        </div>
      </motion.footer>
    </div>
  );
}
