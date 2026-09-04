import React, { useRef, useEffect } from 'react';

const TOTAL_FRAMES = 240;
const LERP_FACTOR = 0.085; // Damping constant for smooth cinematic inertia

export default function BackgroundScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let currentFrameIndex = 1;
    let animationFrameId: number;

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

    // 3. Render frame to canvas with centered cover sizing & watermark removal
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

      // Airtight watermark patch
      const patchSizeW = (90 / 1920) * drawW;
      const patchSizeH = (90 / 1080) * drawH;
      const starTargetX = offX + (1739 / 1920) * drawW - patchSizeW / 2;
      const starTargetY = offY + (900 / 1080) * drawH - patchSizeH / 2;

      ctx.save();
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

    // 4. Track scroll across the entire website document
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      targetProgress = Math.max(0, Math.min(1, window.scrollY / scrollable));
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
      id="background-scroll-canvas-container"
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* High-Performance Canvas with OLED Tuning */}
      <canvas
        ref={canvasRef}
        id="bgScrollCanvas"
        className="w-full h-full block"
        style={{
          filter: 'contrast(1.25) saturate(1.45) brightness(1.03)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Atmospheric Scrim to keep text perfectly legible */}
      <div className="absolute inset-0 bg-[#070a07]/35 pointer-events-none" />

      {/* Radial depth glow matching the brand's electric lime */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#070a07]/20 to-[#070a07]/60 pointer-events-none" />
    </div>
  );
}
