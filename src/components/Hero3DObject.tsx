import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Hero3DObject() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 320;
    let height = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    // 2. High-Performance Renderer with Alpha Transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 3. Central 3D Cyber Crystal Geometry
    const group = new THREE.Group();
    scene.add(group);

    // A. Faceted Outer Polyhedron (Icosahedron)
    const geomOuter = new THREE.IcosahedronGeometry(1.8, 0);
    const matOuterFaces = new THREE.MeshStandardMaterial({
      color: 0x07150a,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75,
      wireframe: false,
    });
    const meshOuter = new THREE.Mesh(geomOuter, matOuterFaces);
    group.add(meshOuter);

    // B. Luminous Electric Lime Wireframe Lattice
    const wireframeGeom = new THREE.WireframeGeometry(geomOuter);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc6f554,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const wireframeLines = new THREE.LineSegments(wireframeGeom, lineMat);
    group.add(wireframeLines);

    // C. Glowing Inner Core (Octahedron)
    const geomInner = new THREE.OctahedronGeometry(0.9, 0);
    const matInner = new THREE.MeshStandardMaterial({
      color: 0xf7cc46,
      emissive: 0xf7cc46,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.8,
    });
    const meshInner = new THREE.Mesh(geomInner, matInner);
    group.add(meshInner);

    // D. Orbiting Particle Cloud Rings
    const particleCount = 180;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      // Gradient between electric lime (0.78, 0.96, 0.33) and gold (0.97, 0.8, 0.27)
      if (i % 2 === 0) {
        colors[i * 3] = 0.78;
        colors[i * 3 + 1] = 0.96;
        colors[i * 3 + 2] = 0.33;
      } else {
        colors[i * 3] = 0.97;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.27;
      }
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const particleCloud = new THREE.Points(particleGeom, particleMat);
    group.add(particleCloud);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightLime = new THREE.PointLight(0xc6f554, 2.5, 15);
    pointLightLime.position.set(3, 3, 4);
    scene.add(pointLightLime);

    const pointLightGold = new THREE.PointLight(0xf7cc46, 2.0, 15);
    pointLightGold.position.set(-3, -3, 3);
    scene.add(pointLightGold);

    // 5. Interactive Mouse & Drag Physics
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = (e.clientX - centerX) / (window.innerWidth / 2);
      const mouseY = (e.clientY - centerY) / (window.innerHeight / 2);

      if (!isDragging) {
        targetRotY = mouseX * 0.8;
        targetRotX = -mouseY * 0.6;
      } else {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        dragVelocityX = deltaX * 0.008;
        dragVelocityY = deltaY * 0.008;
        group.rotation.y += dragVelocityX;
        group.rotation.x += dragVelocityY;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    // 6. Sleep Optimization: Pause rendering when off-screen
    let isSleeping = false;
    let animationFrameId: number;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSleeping = !entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 7. Cinema 60FPS Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isSleeping) return;

      const elapsedTime = clock.getElapsedTime();

      // Continuous organic idle rotation
      if (!isDragging) {
        group.rotation.y += (targetRotY - group.rotation.y) * 0.05 + 0.003;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
      } else {
        group.rotation.y += dragVelocityX;
        group.rotation.x += dragVelocityY;
        dragVelocityX *= 0.95;
        dragVelocityY *= 0.95;
      }

      // Sine wave breathing floating motion
      group.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Spin inner core & particle ring in counter-rotation
      meshInner.rotation.x = elapsedTime * 0.6;
      meshInner.rotation.z = elapsedTime * 0.8;
      particleCloud.rotation.y = -elapsedTime * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Listener
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 320;
      height = container.clientHeight || 320;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup memory and WebGL context on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      geomOuter.dispose();
      matOuterFaces.dispose();
      wireframeGeom.dispose();
      lineMat.dispose();
      geomInner.dispose();
      matInner.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center pointer-events-auto select-none my-2 sm:my-3">
      {/* Dynamic Lime Ambient Glow Aura */}
      <div className="absolute w-56 h-56 bg-radial from-[#c6f554]/18 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        title="Click & Drag to Spin 3D Emblem"
        className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Micro-Interaction Hint Badge */}
      <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-[#121c13]/80 border border-[#c6f554]/25 text-[10px] font-mono text-zinc-400 tracking-wider shadow-lg flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c6f554] animate-pulse" />
        <span>3D WEBGL ENGINE &bull; INTERACTIVE</span>
      </div>
    </div>
  );
}
