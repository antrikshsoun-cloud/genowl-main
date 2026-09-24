import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';
import {
  OFFICIAL_HOSTINGER_EMAIL,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_INSTAGRAM,
  OFFICIAL_X,
  OFFICIAL_X_URL,
} from '../services/emailService.ts';

interface IsometricSocialDockProps {
  onOpenBrowserCall?: () => void;
}

export default function IsometricSocialDock({ onOpenBrowserCall }: IsometricSocialDockProps) {
  const instagramId = OFFICIAL_INSTAGRAM;
  const xHandle = OFFICIAL_X;
  const xUrl = OFFICIAL_X_URL;
  const hostingerEmail = OFFICIAL_HOSTINGER_EMAIL;
  const phoneTel = OFFICIAL_PHONE_TEL;

  return (
    <div className="w-full my-4 sm:my-5 flex flex-col items-center">
      {/* Subtle Section Divider & Label */}
      <div className="w-full flex items-center justify-between gap-3 mb-3 px-1">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#c6f554] flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-[#142016] border border-[#c6f554]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c6f554] animate-pulse" />
          Official 3D Social Touchpoints
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* 3D Isometric Grid: 2x2 on Mobile, 4x1 on Desktop (Zero Overlap Guaranteed) */}
      <div className="w-full">
        <div className="iso-grid">
          {/* TILE 1: 𝕏 (TWITTER) */}
          <div className="iso-grid-item">
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="iso-card iso-card-x group"
              title="Official 𝕏 (Twitter) Channel"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#c6f554] transition-colors">
                <span className="font-bold text-sm text-white group-hover:text-[#c6f554] transition-colors">
                  𝕏
                </span>
              </div>
              <div className="min-w-0 pr-1">
                <span className="block text-xs font-bold text-white group-hover:text-[#c6f554] transition-colors truncate">
                  Twitter / 𝕏
                </span>
                <span className="block text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
                  @{xHandle}
                </span>
              </div>
            </a>
          </div>

          {/* TILE 2: INSTAGRAM */}
          <div className="iso-grid-item">
            <a
              href={`https://instagram.com/${instagramId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="iso-card iso-card-instagram group"
              title="Official Instagram Profile"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/40 transition-colors">
                <Instagram className="w-4 h-4 text-[#f7cc46] group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0 pr-1">
                <span className="block text-xs font-bold text-white transition-colors truncate">
                  Instagram
                </span>
                <span className="block text-[10px] font-mono text-zinc-400 group-hover:text-white/90 transition-colors truncate">
                  @{instagramId}
                </span>
              </div>
            </a>
          </div>

          {/* TILE 3: YZER AI VOICE HOTLINE */}
          <div className="iso-grid-item">
            <a
              href={onOpenBrowserCall ? '#call-yzer' : `tel:${phoneTel}`}
              onClick={(e) => {
                if (onOpenBrowserCall) {
                  e.preventDefault();
                  onOpenBrowserCall();
                }
              }}
              className="iso-card iso-card-voice group"
              title="24/7 AI Voice Hotline & Free In-Browser Call"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#00f2fe] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#00f2fe] group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white group-hover:text-[#00f2fe] transition-colors truncate">
                    YZER Voice
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
                </div>
                <span className="block text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
                  Free Live Call
                </span>
              </div>
            </a>
          </div>

          {/* TILE 4: SUPPORT EMAIL DESK */}
          <div className="iso-grid-item">
            <a
              href={`mailto:${hostingerEmail}`}
              className="iso-card iso-card-email group"
              title="Official Hostinger Support Email Desk"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#f7cc46] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#f7cc46] group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0 pr-1">
                <span className="block text-xs font-bold text-white group-hover:text-[#f7cc46] transition-colors truncate">
                  Inquiries
                </span>
                <span className="block text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
                  {hostingerEmail}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
