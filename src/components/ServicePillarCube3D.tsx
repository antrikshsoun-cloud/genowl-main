import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Sparkles, Globe, Brain, Video, ShieldCheck, ArrowRight, RotateCw } from 'lucide-react';

interface ServicePillarCube3DProps {
  onSelectService?: (serviceName: string) => void;
}

export default function ServicePillarCube3D({ onSelectService }: ServicePillarCube3DProps) {
  // Current rendered rotation angles
  const [rotX, setRotX] = useState<number>(-12);
  const [rotY, setRotY] = useState<number>(25);
  const [activeFace, setActiveFace] = useState<string>('3d');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // References for continuous smooth animation and physics
  const stageRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Motion physics state in refs (prevents stutter & re-render lag)
  const physicsRef = useRef({
    baseX: -12,
    baseY: 25,
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    userOffsetAngleX: 0,
    userOffsetAngleY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartAngleX: 0,
    dragStartAngleY: 0,
    snapTargetY: null as number | null,
    snapTargetX: null as number | null,
  });

  // Continuous floating + smooth interactive cursor tracker loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1); // clamp delta to avoid jumps
      lastTime = time;

      const p = physicsRef.current;

      // 1. Smoothly interpolate cursor tilt (magnetic tracking)
      p.currentTiltX += (p.targetTiltX - p.currentTiltX) * 0.08;
      p.currentTiltY += (p.targetTiltY - p.currentTiltY) * 0.08;

      // 2. Handle snap animation to face preset, or continuous ambient float
      if (p.snapTargetY !== null && p.snapTargetX !== null) {
        // Smoothly interpolate towards snap target
        p.userOffsetAngleY += (p.snapTargetY - p.userOffsetAngleY) * 0.08;
        p.userOffsetAngleX += (p.snapTargetX - p.userOffsetAngleX) * 0.08;

        if (
          Math.abs(p.snapTargetY - p.userOffsetAngleY) < 0.2 &&
          Math.abs(p.snapTargetX - p.userOffsetAngleX) < 0.2
        ) {
          p.baseY = p.userOffsetAngleY;
          p.baseX = p.userOffsetAngleX;
          p.snapTargetY = null;
          p.snapTargetX = null;
        }
      } else if (!p.isDragging) {
        // Continuous ambient rotation & subtle floating bob
        p.baseY = (p.baseY + delta * 15) % 360;
        p.baseX = -12 + Math.sin(time / 1600) * 6;
      }

      // 3. Compute final rendered angles
      const finalX = p.baseX + p.userOffsetAngleX + p.currentTiltX;
      const finalY = (p.baseY + p.userOffsetAngleY + p.currentTiltY) % 360;

      setRotX(finalX);
      setRotY(finalY);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Smooth Cursor Hover & Directional Tilt Tracker
  const handlePointerMove = (e: React.PointerEvent) => {
    const p = physicsRef.current;

    // If dragging with pointer down
    if (p.isDragging) {
      const deltaX = e.clientX - p.dragStartX;
      const deltaY = e.clientY - p.dragStartY;

      p.userOffsetAngleY = p.dragStartAngleY + deltaX * 0.6;
      p.userOffsetAngleX = Math.max(-80, Math.min(80, p.dragStartAngleX - deltaY * 0.6));
      return;
    }

    // Interactive Hover Tracking: Tilt smoothly towards cursor direction
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // -1 to +1
      const normY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // -1 to +1

      // Dynamic tilt: cursor right tilts cube right, cursor up tilts cube up
      p.targetTiltY = normX * 45;
      p.targetTiltX = -normY * 35;
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    const p = physicsRef.current;
    // Smoothly return interactive tilt to center
    p.targetTiltX = 0;
    p.targetTiltY = 0;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const p = physicsRef.current;
    p.isDragging = true;
    p.snapTargetX = null;
    p.snapTargetY = null;
    p.dragStartX = e.clientX;
    p.dragStartY = e.clientY;
    p.dragStartAngleX = p.userOffsetAngleX;
    p.dragStartAngleY = p.userOffsetAngleY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const p = physicsRef.current;
    p.isDragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Face preset snap positions (smoothly transitions)
  const snapToFace = useCallback((face: '3d' | '2d' | 'ai' | 'video' | 'build' | 'ip') => {
    setActiveFace(face);
    const p = physicsRef.current;

    let targetY = 0;
    let targetX = -10;

    switch (face) {
      case '3d': // Front
        targetY = 0;
        targetX = -10;
        break;
      case '2d': // Right
        targetY = -90;
        targetX = -10;
        break;
      case 'ai': // Back
        targetY = -180;
        targetX = -10;
        break;
      case 'video': // Left
        targetY = 90;
        targetX = -10;
        break;
      case 'build': // Top
        targetY = 0;
        targetX = -85;
        break;
      case 'ip': // Bottom
        targetY = 0;
        targetX = 85;
        break;
    }

    // Set snap target for smooth lerp
    p.baseY = 0;
    p.baseX = 0;
    p.userOffsetAngleY = rotY % 360;
    p.userOffsetAngleX = rotX;
    p.snapTargetY = targetY;
    p.snapTargetX = targetX;
  }, [rotX, rotY]);

  const resetOrientation = () => {
    const p = physicsRef.current;
    p.baseX = -12;
    p.baseY = 25;
    p.userOffsetAngleX = 0;
    p.userOffsetAngleY = 0;
    p.targetTiltX = 0;
    p.targetTiltY = 0;
    p.snapTargetX = null;
    p.snapTargetY = null;
    setActiveFace('3d');
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0d160f]/90 via-[#0a0f0b]/95 to-[#070a07] border border-[#c6f554]/25 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#c6f554]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#f7cc46]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162418] border border-[#c6f554]/30 mb-2">
            <Box className="w-3.5 h-3.5 text-[#c6f554] animate-pulse" />
            <span className="text-[11px] font-mono text-[#c6f554] font-semibold uppercase tracking-wider">
              3D Architecture Core &bull; Interactive Cube
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Explore Genowl Services in 3D
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Hover &amp; move cursor to steer directions &bull; Drag to spin &bull; Tap any face to book.
          </p>
        </div>

        {/* Ambient Float Status & Reset */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 font-mono shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#c6f554] animate-pulse shadow-[0_0_8px_#c6f554]" />
            <span className="text-zinc-200">
              {isHovered ? 'Interactive Tracking' : 'Floating in 3D'}
            </span>
          </div>

          <button
            type="button"
            onClick={resetOrientation}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-[#c6f554] hover:bg-white/10 transition-colors cursor-pointer"
            title="Reset Orientation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D CUBE STAGE (Tracks Hover, Directional Movement & Drag) */}
      <div
        ref={stageRef}
        className="relative w-full h-[290px] sm:h-[330px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        style={{ perspective: '1100px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {/* Dynamic Floor Shadow */}
        <div
          className="absolute bottom-6 w-48 sm:w-60 h-8 rounded-full bg-black/85 blur-xl pointer-events-none transition-transform duration-200"
          style={{
            transform: `scale(${1 + Math.sin((rotX * Math.PI) / 180) * 0.15}) rotate(${rotY * 0.1}deg)`,
          }}
        />

        {/* Box Card 3D Object with Silky Smooth Directional Movement */}
        <div
          className="relative will-change-transform"
          style={{
            width: '200px',
            height: '200px',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: 'none', // Handled smoothly in 60 FPS requestAnimationFrame loop
          }}
        >
          {/* Internal Glowing Neon Core */}
          <div
            className="absolute inset-0 m-auto w-16 h-16 rounded-full pointer-events-none"
            style={{
              transform: 'translateZ(0px)',
              background: 'radial-gradient(circle, #c6f554 0%, #f7cc46 40%, rgba(0,0,0,0) 70%)',
              boxShadow: '0 0 50px 18px rgba(198, 245, 84, 0.45)',
              filter: 'blur(3px)',
            }}
          />

          {/* FACE 1: FRONT -> 3D WebGL */}
          <div
            className="cube-face cube-front absolute inset-0 rounded-2xl p-4 flex flex-col justify-between text-left border-2 backdrop-blur-md cursor-pointer group"
            style={{
              transform: 'translateZ(100px)',
              background: 'linear-gradient(145deg, rgba(20, 32, 22, 0.92), rgba(10, 16, 11, 0.95))',
              borderColor: '#c6f554',
              boxShadow: 'inset 0 0 25px rgba(198, 245, 84, 0.2), 0 0 20px rgba(198, 245, 84, 0.25)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectService?.('3D Website');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#c6f554]/20 text-[#c6f554] border border-[#c6f554]/40">
                01 &bull; 3D WEBGL
              </span>
              <Box className="w-4 h-4 text-[#c6f554]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#c6f554] transition-colors">
                3D WebGL World
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                Cinema-grade Three.js scenes &amp; 60 FPS scroll canvas sequences.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-[#c6f554] font-medium font-mono">
              <span>Book Appointment</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* FACE 2: RIGHT -> 2D High-Converting Web */}
          <div
            className="cube-face cube-right absolute inset-0 rounded-2xl p-4 flex flex-col justify-between text-left border-2 backdrop-blur-md cursor-pointer group"
            style={{
              transform: 'translateX(100px) rotateY(90deg)',
              background: 'linear-gradient(145deg, rgba(32, 28, 16, 0.92), rgba(16, 14, 8, 0.95))',
              borderColor: '#f7cc46',
              boxShadow: 'inset 0 0 25px rgba(247, 204, 70, 0.2), 0 0 20px rgba(247, 204, 70, 0.25)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectService?.('2D Website');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#f7cc46]/20 text-[#f7cc46] border border-[#f7cc46]/40">
                02 &bull; 2D WEB
              </span>
              <Globe className="w-4 h-4 text-[#f7cc46]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#f7cc46] transition-colors">
                2D Architecture
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                Fast, mobile-first responsive architecture with 95+ PageSpeed.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-[#f7cc46] font-medium font-mono">
              <span>Book Appointment</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* FACE 3: BACK -> YZER AI Voice Agents */}
          <div
            className="cube-face cube-back absolute inset-0 rounded-2xl p-4 flex flex-col justify-between text-left border-2 backdrop-blur-md cursor-pointer group"
            style={{
              transform: 'translateZ(-100px) rotateY(180deg)',
              background: 'linear-gradient(145deg, rgba(14, 28, 36, 0.92), rgba(7, 14, 18, 0.95))',
              borderColor: '#00f2fe',
              boxShadow: 'inset 0 0 25px rgba(0, 242, 254, 0.2), 0 0 20px rgba(0, 242, 254, 0.25)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectService?.('Personalized AI');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40">
                03 &bull; AI VOICE
              </span>
              <Brain className="w-4 h-4 text-[#00f2fe]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#00f2fe] transition-colors">
                YZER AI Agents
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                Autonomous voice hotlines, WebRTC calling &amp; automated CRM leads.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-[#00f2fe] font-medium font-mono">
              <span>Book Appointment</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* FACE 4: LEFT -> 4K Commercial Video */}
          <div
            className="cube-face cube-left absolute inset-0 rounded-2xl p-4 flex flex-col justify-between text-left border-2 backdrop-blur-md cursor-pointer group"
            style={{
              transform: 'translateX(-100px) rotateY(-90deg)',
              background: 'linear-gradient(145deg, rgba(36, 14, 24, 0.92), rgba(18, 7, 12, 0.95))',
              borderColor: '#ff3366',
              boxShadow: 'inset 0 0 25px rgba(255, 51, 102, 0.2), 0 0 20px rgba(255, 51, 102, 0.25)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectService?.('Video Generation');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366]/40">
                04 &bull; 4K VIDEO
              </span>
              <Video className="w-4 h-4 text-[#ff3366]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#ff3366] transition-colors">
                Commercial AI Video
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                Cinematic promotional video spots, AI voiceovers &amp; viral reels.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-[#ff3366] font-medium font-mono">
              <span>Book Appointment</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* FACE 5: TOP -> We Book • We Build */}
          <div
            className="cube-face cube-top absolute inset-0 rounded-2xl p-4 flex flex-col justify-between text-center border-2 backdrop-blur-md cursor-pointer group"
            style={{
              transform: 'translateY(-100px) rotateX(90deg)',
              background: 'linear-gradient(145deg, rgba(20, 30, 20, 0.94), rgba(10, 16, 10, 0.97))',
              borderColor: '#c6f554',
              boxShadow: 'inset 0 0 25px rgba(198, 245, 84, 0.25)',
            }}
          >
            <div className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#c6f554]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                We Book &bull; We Build
              </h4>
              <p className="text-[10px] text-zinc-300 mt-1 leading-tight">
                No fixed limits. 100% bespoke engineering built for your needs.
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#c6f554]">GENOWL STUDIO</span>
          </div>

          {/* FACE 6: BOTTOM -> 100% Commercial IP Transfer */}
          <div
            className="cube-face cube-bottom absolute inset-0 rounded-2xl p-4 flex flex-col justify-between text-center border-2 backdrop-blur-md cursor-pointer group"
            style={{
              transform: 'translateY(100px) rotateX(-90deg)',
              background: 'linear-gradient(145deg, rgba(28, 16, 36, 0.94), rgba(14, 8, 18, 0.97))',
              borderColor: '#a855f7',
              boxShadow: 'inset 0 0 25px rgba(168, 85, 247, 0.25)',
            }}
          >
            <div className="flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#a855f7]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                100% IP Transfer
              </h4>
              <p className="text-[10px] text-zinc-300 mt-1 leading-tight">
                Complete code ownership, GitHub sync &amp; zero vendor lock-in.
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#a855f7]">ENTERPRISE GRADE</span>
          </div>
        </div>
      </div>

      {/* QUICK PRESET BUTTONS */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-2">
        <span className="text-[11px] font-mono text-zinc-400 mr-1 hidden sm:inline">Snap to:</span>

        <button
          type="button"
          onClick={() => snapToFace('3d')}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer border ${
            activeFace === '3d'
              ? 'bg-[#c6f554]/20 border-[#c6f554] text-[#c6f554] shadow-[0_0_12px_rgba(198,245,84,0.3)]'
              : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
          }`}
        >
          ✦ 3D WebGL
        </button>

        <button
          type="button"
          onClick={() => snapToFace('2d')}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer border ${
            activeFace === '2d'
              ? 'bg-[#f7cc46]/20 border-[#f7cc46] text-[#f7cc46] shadow-[0_0_12px_rgba(247,204,70,0.3)]'
              : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
          }`}
        >
          ✦ 2D Web
        </button>

        <button
          type="button"
          onClick={() => snapToFace('ai')}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer border ${
            activeFace === 'ai'
              ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
              : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
          }`}
        >
          ✦ AI Voice
        </button>

        <button
          type="button"
          onClick={() => snapToFace('video')}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer border ${
            activeFace === 'video'
              ? 'bg-[#ff3366]/20 border-[#ff3366] text-[#ff3366] shadow-[0_0_12px_rgba(255,51,102,0.3)]'
              : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
          }`}
        >
          ✦ 4K Video
        </button>

        <button
          type="button"
          onClick={() => snapToFace('build')}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer border ${
            activeFace === 'build'
              ? 'bg-[#c6f554]/20 border-[#c6f554] text-[#c6f554]'
              : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
          }`}
        >
          ✦ We Build
        </button>
      </div>
    </div>
  );
}
