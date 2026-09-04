import React from 'react';
import { Instagram, Mail, ArrowUpRight, ShieldCheck } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';

import { OFFICIAL_HOSTINGER_EMAIL, OFFICIAL_GENOWL_GMAIL, OFFICIAL_INSTAGRAM } from '../services/emailService.ts';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refund') => void;
  onOpenAdmin?: () => void;
}

export default function Footer({ onNavigate, currentPage, onOpenLegal, onOpenAdmin }: FooterProps) {
  const instagramId = OFFICIAL_INSTAGRAM;
  const hostingerEmail = OFFICIAL_HOSTINGER_EMAIL;
  const gmailAccount = OFFICIAL_GENOWL_GMAIL;

  return (
    <footer id="main-footer" className="border-t border-white/[0.08] bg-[#050805] text-zinc-400 pt-12 pb-24 md:pb-12 px-4 sm:px-6 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Brand info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#141e15] border border-[#f7cc46]/50 flex items-center justify-center shadow-[0_0_10px_rgba(247,204,70,0.35)] overflow-hidden p-0.5">
              <img src="/genowl-mail-logo.png" alt="Genowl Logo" className="w-full h-full object-contain rounded-md" />
            </div>
            <span className="font-bold text-sm tracking-[0.18em] text-white">GENOWL</span>
          </div>
          <p className="text-xs text-zinc-500 max-w-sm">
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
              className={`transition-colors cursor-pointer ${
                currentPage.toLowerCase() === item.toLowerCase()
                  ? 'text-[#c6f554] font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right Contacts (Hostinger Mail, Gmail, Instagram) */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#f7cc46]/40 text-zinc-300 hover:text-white transition-all group"
          >
            <Instagram className="w-3.5 h-3.5 text-[#f7cc46]" />
            <span>@{instagramId}</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
          </a>
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

        <span>Services starting at flat $99 each.</span>
      </div>
    </footer>
  );
}
