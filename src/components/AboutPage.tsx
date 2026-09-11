import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Layers, Mail, Instagram } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';
import Card3D from './Card3D.tsx';

function KineticWord({ word, progress, range }: { word: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const color = useTransform(progress, range, ['rgba(161, 161, 170, 0.35)', 'rgba(255, 255, 255, 1)']);
  return (
    <motion.span style={{ opacity, color }} className="inline-block mr-[0.28em] transition-colors duration-150">
      {word}
    </motion.span>
  );
}

function KineticQuote({ text }: { text: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end 45%'],
  });
  const words = text.split(' ');

  return (
    <p ref={containerRef} className="text-sm sm:text-base md:text-lg leading-relaxed font-normal italic">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.8 / words.length);
        return (
          <KineticWord
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

interface AboutPageProps {
  onNavigateServices: () => void;
  onNavigateContact: () => void;
}

export default function AboutPage({ onNavigateServices, onNavigateContact }: AboutPageProps) {
  const steps = [
    {
      step: '01',
      title: 'Pick Your Service',
      desc: 'Select from 2D Websites ($500), 3D WebGL ($1,000), AI Agents ($200), Video Generation ($100), or Content Creation ($99).',
    },
    {
      step: '02',
      title: 'Tell Us What To Build',
      desc: 'Provide your guidelines, ideas, or references in minutes — no technical background or complex prompts required.',
    },
    {
      step: '03',
      title: 'The Rest Is On Us',
      desc: 'Our team harnesses the best AI engines and design craftsmanship to produce ready-to-launch results.',
    },
  ];

  const pillars = [
    {
      title: '1. Website Architecture',
      charge: '$500 / $1,000',
      highlight: 'From responsive 2D layouts ($500) to cinema-grade interactive 3D WebGL digital worlds ($1,000).',
    },
    {
      title: '2. AI Agents',
      charge: '$200',
      highlight: 'Autonomous intelligence systems, multi-step workflow automation, and custom customer chat agents.',
    },
    {
      title: '3. Video Generation',
      charge: '$100',
      highlight: 'Cinematic visual commercials, social media clips, and promotional reels that command attention.',
    },
    {
      title: '4. Content Creation',
      charge: '$99',
      highlight: 'Persuasive sales copywriting, marketing articles, and complete brand social assets.',
    },
  ];

  return (
    <div id="about-page" className="pt-4 sm:pt-6 pb-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121c13]/90 border border-white/10 shadow-lg mb-3">
          <OwlLogo className="w-4 h-4 text-[#f7cc46]" />
          <span className="text-xs text-zinc-300 font-medium">About Genowl</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Intelligence that <span className="text-[#c6f554] font-serif-italic">delivers</span> without the headache.
        </h1>

        {/* The Core Mission Statement / Prompt Quote with 3D Tilt and Kinetic Scroll Scrub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card3D className="p-5 sm:p-8 rounded-3xl bg-[#0e1610]/95 border border-[#c6f554]/25 shadow-[0_0_30px_rgba(198,245,84,0.08)] text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c6f554]/10 rounded-full blur-2xl pointer-events-none" />
            <h2
              style={{ transform: 'translateZ(20px)' }}
              className="text-xs uppercase tracking-widest text-[#c6f554] font-bold mb-3"
            >
              Our Core Philosophy
            </h2>
            <div style={{ transform: 'translateZ(25px)' }}>
              <KineticQuote text="&quot;In today's world, everybody knows that for almost every service possible there is an AI tool. But of course they don't have much time to use and master every tool. That is exactly why you choose Genowl: all you have to do is buy our service and tell us what to build — the rest is on us.&quot;" />
            </div>
          </Card3D>
        </motion.div>
      </div>

      {/* 3 Step Process */}
      <div className="mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How It Works</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">A simple, friction-free way to build and grow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -5,
                transition: { type: 'spring', stiffness: 350, damping: 25 },
              }}
              className="p-5 sm:p-7 rounded-2xl bg-[#0c130d]/80 border border-white/[0.08] hover:border-[#c6f554]/40 backdrop-blur-xl relative shadow-xl transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-[#172318] border border-[#c6f554]/30 flex items-center justify-center text-[#c6f554] font-mono font-bold text-sm mb-4 shadow-[0_0_12px_rgba(198,245,84,0.2)]">
                {s.step}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Services Breakdown on About */}
      <div className="mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">The Services We Provide</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Four specialized pillars, each at a flat $99 fee</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:auto-rows-fr gap-5 items-stretch">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              whileHover={{
                y: -4,
                transition: { type: 'spring', stiffness: 350, damping: 25 },
              }}
              className="p-5 sm:p-6 rounded-2xl bg-[#0d150e]/90 border border-white/10 hover:border-[#c6f554]/40 transition-colors flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white">{p.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1b2a1c] text-[#c6f554] border border-[#c6f554]/30">
                    {p.charge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{p.highlight}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The Founding Team */}
      <div className="mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121c13]/90 border border-[#c6f554]/20 text-[#c6f554] text-xs font-mono mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c6f554] animate-pulse" />
            <span>LEADERSHIP &amp; VISION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">The Founding Team</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">The five minds driving Genowl Studio's mission and architecture</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            {
              name: 'Antriksh',
              role: 'Co-Founder',
              tag: 'Architecture & Vision',
              accent: '#c6f554',
              badge: 'AS',
            },
            {
              name: 'Bilal',
              role: 'Co-Founder',
              tag: 'Strategy & Execution',
              accent: '#f7cc46',
              badge: 'B',
            },
            {
              name: 'Maulik',
              role: 'Co-Founder',
              tag: 'Design & Systems',
              accent: '#c6f554',
              badge: 'M',
            },
            {
              name: 'Jaywardhan',
              role: 'Co-Founder',
              tag: 'Operations & Scale',
              accent: '#f7cc46',
              badge: 'J',
            },
            {
              name: 'Ritesh',
              role: 'Co-Founder',
              tag: 'Tech & Innovation',
              accent: '#c6f554',
              badge: 'R',
            },
          ].map((founder, idx) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -4,
                transition: { type: 'spring', stiffness: 350, damping: 25 },
              }}
              className="p-4 sm:p-5 rounded-2xl bg-[#0c130d]/80 border border-white/10 hover:border-[#c6f554]/40 transition-all flex flex-col items-center text-center relative group overflow-hidden"
            >
              {/* Subtle Ambient Glow */}
              <div
                className="absolute top-0 inset-x-0 h-1 rounded-t-2xl opacity-75 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: founder.accent }}
              />

              {/* Avatar Pill */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-lg border transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: '#121c13',
                  borderColor: `${founder.accent}55`,
                  color: founder.accent,
                  boxShadow: `0 0 16px ${founder.accent}22`,
                }}
              >
                {founder.badge}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">{founder.name}</h3>
              <span
                className="text-[11px] font-mono font-semibold uppercase tracking-wider mt-0.5"
                style={{ color: founder.accent }}
              >
                {founder.role}
              </span>
              <p className="text-[11px] text-zinc-400 mt-2 font-light leading-snug">{founder.tag}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Direct Contact Banner */}
      <div className="rounded-3xl bg-[#0c130d] border border-white/10 p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Connect with the Genowl Team</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed break-words">
            Reach out via 24/7 AI Phone <a href="tel:+16282459578" className="text-[#c6f554] font-semibold font-mono hover:underline">+1 (628) 245-9578</a>, Hostinger <span className="text-[#c6f554] font-semibold font-mono">support@genowl.tech</span>, Gmail <span className="text-[#f7cc46] font-semibold font-mono">genowlai@gmail.com</span>, Instagram <span className="text-zinc-300 font-semibold">@genowl_tech</span>, or X <span className="text-[#c6f554] font-semibold font-mono">@GENOWL_TECH</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onNavigateServices}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-md transition-all cursor-pointer text-center"
          >
            Explore Services ($99)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onNavigateContact}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-zinc-200 bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer text-center"
          >
            Contact Page
          </motion.button>
        </div>
      </div>
    </div>
  );
}
