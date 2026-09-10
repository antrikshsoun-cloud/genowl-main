import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface HeroProps {
  onStartTrial?: () => void;
  onOpenBrowserCall?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Hero({ onStartTrial, onOpenBrowserCall }: HeroProps) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      id="hero-section"
      className="relative pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 text-center px-4 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[70vh]"
    >
      {/* Subtle green ambient light pool behind headline */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[480px] h-[300px] bg-[#c6f554]/[0.07] rounded-full blur-3xl pointer-events-none" />

      {/* Announcement & YZER AI Guide Highlight Badge */}
      <motion.div variants={itemVariants} className="inline-flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8 max-w-full px-1">
        <div
          id="hero-yzer-badge"
          onClick={onOpenBrowserCall}
          className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#121c13]/90 border border-[#c6f554]/30 shadow-[0_0_20px_rgba(198,245,84,0.15)] backdrop-blur-md max-w-full ${
            onOpenBrowserCall ? 'cursor-pointer hover:border-[#c6f554] hover:shadow-[0_0_25px_rgba(198,245,84,0.3)] transition-all' : ''
          }`}
          title={onOpenBrowserCall ? 'Click to call YZER directly from your browser' : undefined}
        >
          <span className="w-2 h-2 rounded-full bg-[#c6f554] animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-xs text-zinc-300 font-normal leading-relaxed text-center sm:text-left">
            Meet <strong className="text-[#c6f554] font-semibold">YZER</strong> — Your AI Creative Director • <span className="underline decoration-[#c6f554]/70 underline-offset-2 text-white font-medium hover:text-[#c6f554]">Call Live from Browser (Free)</span>
          </span>
        </div>
      </motion.div>

      {/* Hero Headline */}
      <motion.h1
        variants={itemVariants}
        id="hero-title"
        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] select-none"
      >
        <span>Intelligence that</span>
        <br />
        <span className="font-serif-italic font-normal text-[#c6f554] drop-shadow-[0_0_25px_rgba(198,245,84,0.35)] mr-2">
          grows
        </span>
        <span>with you.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        id="hero-subtitle"
        className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed"
      >
        High-converting 2D websites, cinema-grade 3D WebGL experiences, and custom AI production — engineered for visionary brands.
      </motion.p>

      {/* CTA Button */}
      <motion.div variants={itemVariants} className="mt-8 sm:mt-10 flex flex-col items-center">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          id="hero-cta-button"
          type="button"
          onClick={onStartTrial}
          className="group relative px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-black bg-gradient-to-b from-[#d8fb6a] to-[#bbf344] hover:from-[#e1fd7a] hover:to-[#c6f554] shadow-[0_0_35px_rgba(198,245,84,0.4)] hover:shadow-[0_0_50px_rgba(198,245,84,0.65)] transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <span>Book Project</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>


        {/* Value Proposition Badges */}
        <div
          id="hero-value-props"
          className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-[11px] sm:text-xs text-zinc-400 mt-6"
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#c6f554]" />
            <span>48–72h Turnaround</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#f7cc46]" />
            <span>100% Commercial IP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c6f554] animate-pulse" />
            <span className="text-[#c6f554] font-medium">30-Min Call Confirmation</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
