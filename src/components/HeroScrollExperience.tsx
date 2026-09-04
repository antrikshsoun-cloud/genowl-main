import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Ban, ChevronRight, ChevronDown } from 'lucide-react';

interface HeroScrollExperienceProps {
  onStartTrial?: () => void;
}

const TOTAL_FRAMES = 240;
const LERP_FACTOR = 0.085; // Calibrated damping factor for buttery smooth momentum

export default function HeroScrollExperience({ onStartTrial }: HeroScrollExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroTranslateY, setHeroTranslateY] = useState(0);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);
  const [canvasOpacity, setCanvasOpacity] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let currentFrameIndex = 1;
    let animationFrameId: number;

    // Cache-busting version token to guarantee browser loads the clean frames
    const cacheKey = `v_clean_${Date.now()}`;

    // 1. Preload 240 clean frames into memory
    const frames: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${numStr}.jpg?v=${cacheKey}`;
      img.onload = () => {
        if (i === 1 && currentFrameIndex === 1) {
          renderFrame(1);
        }
      };
      frames[i] = img;
    }
    imagesRef.current = frames;

    // 2. High-DPI Canvas Resize with Cover Aspect Ratio
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      renderFrame(currentFrameIndex);
    };

    // 3. Render image to canvas with cover fitting & guaranteed watermark removal
    const renderFrame = (frameNum: number) => {
      if (!canvas || !ctx) return;
      const safeNum = Math.max(1, Math.min(TOTAL_FRAMES, frameNum));
      
      let img = frames[safeNum];
      if (!img || !img.complete) {
        for (let off = 1; off < 15; off++) {
          if (frames[safeNum - off]?.complete) {
            img = frames[safeNum - off];
            break;
          }
          if (frames[safeNum + off]?.complete) {
            img = frames[safeNum + off];
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const screenRatio = w / h;

      let drawW: number, drawH: number, offX: number, offY: number;

      if (screenRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        offX = 0;
        offY = (h - drawH) / 2;
      } else {
        drawW = h * imgRatio;
        drawH = h;
        offX = (w - drawW) / 2;
        offY = 0;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, offX, offY, drawW, drawH);

      // AIRTIGHT WATERMARK ERASER GUARANTEE:
      // Even if browser has cached frames, patch the bottom-right corner (1739, 900)
      // by sampling neighboring background from (1644, 900)
      const patchSizeW = (90 / 1920) * drawW;
      const patchSizeH = (90 / 1080) * drawH;
      const starTargetX = offX + (1739 / 1920) * drawW - patchSizeW / 2;
      const starTargetY = offY + (900 / 1080) * drawH - patchSizeH / 2;
      const srcSampleX = offX + ((1739 - 100) / 1920) * drawW - patchSizeW / 2;
      const srcSampleY = starTargetY;

      ctx.save();
      // Feathered patch overlay
      ctx.beginPath();
      ctx.arc(
        starTargetX + patchSizeW / 2,
        starTargetY + patchSizeH / 2,
        patchSizeW * 0.48,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(
        img,
        1739 - 100 - 45, 900 - 45, 90, 90,
        starTargetX, starTargetY, patchSizeW, patchSizeH
      );
      ctx.restore();

      currentFrameIndex = safeNum;
    };

    // 4. Bulletproof Scroll Tracking
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      
      if (scrollableDistance <= 0) return;

      const scrolledFromTop = -rect.top;
      const rawProgress = scrolledFromTop / scrollableDistance;
      const progress = Math.max(0, Math.min(1, rawProgress));
      targetProgress = progress;

      // Hero text fades out smoothly within first 14% of scroll
      const fadeProgress = Math.min(1, progress / 0.14);
      setHeroOpacity(1 - fadeProgress);
      setHeroTranslateY(-fadeProgress * 40);

      setShowScrollPrompt(progress < 0.04);

      // When user scrolls past the animation container into FeatureCards,
      // keep canvas pinned or gently fade as user goes very deep
      if (rawProgress > 1.0) {
        const exitProgress = Math.min(1, (rawProgress - 1.0) / 0.5);
        setCanvasOpacity(1 - exitProgress * 0.4);
      } else {
        setCanvasOpacity(1);
      }
    };

    // 5. Smooth Lerp Animation Loop
    const loop = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * LERP_FACTOR;
      } else {
        currentProgress = targetProgress;
      }

      const frameIdx = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(currentProgress * (TOTAL_FRAMES - 1)) + 1)
      );

      if (frameIdx !== currentFrameIndex) {
        renderFrame(frameIdx);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleResize();
    handleScroll();
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-scroll-container"
      className="relative w-full"
      style={{ height: '340vh' }} // Calibrated track: shows full animation with zero dead black gap
    >
      {/* BULLETPROOF FIXED VIEWPORT:
          Never gets scrolled away prematurely, stays pinned through full 240-frame sequence */}
      <div
        className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#070a07] pointer-events-none"
        style={{
          zIndex: 0,
          opacity: canvasOpacity,
        }}
      >
        {/* Canvas with OLED Color Tuning */}
        <canvas
          ref={canvasRef}
          id="heroScrollCanvas"
          className="w-full h-full block"
          style={{
            filter: 'contrast(1.25) saturate(1.45) brightness(1.03)',
            transform: 'translateZ(0)',
          }}
        />

        {/* Top Vignette Blend for Floating Navbar */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#070a07] via-[#070a07]/60 to-transparent pointer-events-none" />

        {/* Bottom Ambient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#070a07] via-[#070a07]/70 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Overlay (fixed at top, fades out naturally as user scrolls) */}
      <div
        className="fixed inset-0 z-20 flex flex-col items-center justify-center text-center px-4 transition-transform duration-75 ease-out pointer-events-none"
        style={{
          opacity: heroOpacity,
          transform: `translateY(${heroTranslateY}px)`,
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center pointer-events-auto" style={{ pointerEvents: heroOpacity < 0.1 ? 'none' : 'auto' }}>
          
          {/* Announcement Pill Badge */}
          <div className="inline-block mb-6 sm:mb-8">
            <a
              href="#features-section"
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
            className="mt-5 text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl mx-auto font-normal leading-relaxed drop-shadow-md"
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

            {/* Value Props */}
            <div
              id="hero-value-props"
              className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-[11px] sm:text-xs text-zinc-300 mt-6 drop-shadow"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c6f554]" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c6f554]" />
                <span>6-day free trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-[#c6f554]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Elegant Floating Scroll Prompt */}
          <div
            className={`mt-12 flex flex-col items-center gap-2 transition-opacity duration-300 ${
              showScrollPrompt ? 'opacity-70' : 'opacity-0 pointer-events-none'
            }`}
          >
            <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-zinc-400">Scroll to explore</span>
            <ChevronDown className="w-4 h-4 text-[#c6f554] animate-bounce" />
          </div>

        </div>
      </div>
    </div>
  );
}
