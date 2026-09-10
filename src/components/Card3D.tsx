import React, { useRef, useState } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  hasLaserBeam?: boolean;
}

export default function Card3D({ children, className = '', hasLaserBeam = false }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const updateCoords = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setSpotlightPos({ x, y });
    setIsHovered(true);

    // Calculate rotation (-12deg to +12deg for crisp, tangible 3D feel)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = Math.max(-12, Math.min(12, ((y - centerY) / centerY) * -12));
    const rY = Math.max(-12, Math.min(12, ((x - centerX) / centerX) * 12));

    setRotateX(rX);
    setRotateY(rY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    updateCoords(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateCoords(e.clientX, e.clientY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setSpotlightPos({ x: -1000, y: -1000 });
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setSpotlightPos({ x: -1000, y: -1000 });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        perspective: '1200px',
      }}
      className="relative rounded-3xl group h-full w-full flex flex-col cursor-default"
    >
      {/* Continuous Orbiting Laser Border Beam (Flagship Tier only) */}
      {hasLaserBeam && (
        <div className="absolute -inset-[1.5px] rounded-3xl overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,#c6f554_330deg,#f7cc46_360deg)] opacity-70" />
        </div>
      )}

      {/* Main 3D Card Chassis with preserve-3d */}
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative z-10 w-full h-full flex flex-col flex-1 rounded-3xl overflow-hidden ${className}`}
      >
        {/* Real-time Cursor-Tracking Specular Spotlight Mask */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-200 z-30"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(500px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(198, 245, 84, 0.22), rgba(247, 204, 70, 0.08) 35%, transparent 75%)`,
          }}
        />

        {/* Specular Edge Glow on Border */}
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-200 z-30"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(198, 245, 84, 0.8), rgba(247, 204, 70, 0.45) 40%, transparent 75%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1.5px',
          }}
        />

        {/* Card Content with 3D Spatial Depth */}
        <div className="flex flex-col justify-between h-full w-full flex-1 relative z-20">
          {children}
        </div>
      </div>
    </div>
  );
}
