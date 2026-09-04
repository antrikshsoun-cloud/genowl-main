import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Ban, ChevronRight } from 'lucide-react';

interface HeroProps {
  onStartTrial?: () => void;
}

export default function Hero({ onStartTrial }: HeroProps) {
  return (
    <section id="hero-section" className="relative pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 text-center px-4">
      {/* Subtle green ambient light pool behind headline */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[480px] h-[300px] bg-[#c6f554]/[0.07] rounded-full blur-3xl pointer-events-none" />

      {/* Announcement Pill Badge */}
      <div className="inline-block mb-6 sm:mb-8">
        <a
          href="#whats-new"
          id="hero-announcement-badge"
          className="group inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121c13]/90 border border-white/10 hover:border-[#c6f554]/30 shadow-lg backdrop-blur-md transition-all duration-200 cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#c6f554]/15 text-[#c6f554] text-[11px] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c6f554] shadow-[0_0_6px_#c6f554]" />
            New
          </span>
          <span className="text-xs text-zinc-300 font-normal">
            Genowl 2.0 is now available
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Hero Headline */}
      <h1
        id="hero-title"
        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] select-none"
      >
        <span>Intelligence that</span>
        <br />
        <span className="font-serif-italic font-normal text-[#c6f554] drop-shadow-[0_0_25px_rgba(198,245,84,0.35)] mr-2">
          grows
        </span>
        <span>with you.</span>
      </h1>

      {/* Subtitle */}
      <p
        id="hero-subtitle"
        className="mt-5 text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed"
      >
        The all-in-one platform for teams who want clarity, speed, and sustainable growth.
      </p>

      {/* CTA Button */}
      <div className="mt-8 flex flex-col items-center">
        <button
          id="hero-cta-button"
          type="button"
          onClick={onStartTrial}
          className="group relative px-7 py-3 rounded-full font-semibold text-sm sm:text-base text-black bg-gradient-to-b from-[#d8fb6a] to-[#bbf344] hover:from-[#e1fd7a] hover:to-[#c6f554] shadow-[0_0_35px_rgba(198,245,84,0.4)] hover:shadow-[0_0_50px_rgba(198,245,84,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <span>Start Free Trial</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Value Proposition Badges */}
        <div
          id="hero-value-props"
          className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-[11px] sm:text-xs text-zinc-400 mt-6"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>6-day free trial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ban className="w-3.5 h-3.5 text-zinc-500" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
