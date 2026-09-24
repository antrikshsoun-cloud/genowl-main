# PROJECT STATE & RESUMPTION CHECKPOINT

**Timestamp:** 2026-09-24T18:25:00+05:30  
**Founders:** Antriksh Soun, Bilal, Maulik, Jaywardhan, and Ritesh (Co-Founders of Genowl Studio)  
**Lead AI Engineer:** Antigravity (GOAT 3D Web Architect)  
**Target Domain:** `https://genowl.tech` (Hostinger LiteSpeed Web Server)  
**Git Branch:** `main` (Repository: `antrikshsoun-cloud/genowl-main`)  

---

## 1. What We Built & Accomplished:

1. **3D Interactive Floating Architecture Cube (`src/components/ServicePillarCube3D.tsx`)**:
   - Installed in the Services section (`ServicesPage.tsx`).
   - 6-faced CSS 3D cube representing Genowl's core capabilities (2D Web, 3D WebGL, AI Agents, AI Video, Full IP Ownership, Security).
   - Perpetual 60 FPS ambient floating animation (independent of user interaction).
   - Magnetic directional cursor tracking: Smoothly tilts towards the cursor position using lerped `requestAnimationFrame` math.
   - Dynamic specular lighting and sheen effects (`.cube-face::before` & `.cube-face::after`).
   - Quick preset focus buttons allowing immediate rotation to inspect any face.

2. **3D Extruded Isometric Social Touchpoints Dock (`src/components/IsometricSocialDock.tsx`)**:
   - Integrated into the Footer (`Footer.tsx`) directly beneath the 4-column matrix.
   - Clean extruded 3D isometric cards representing Genowl's 4 channels:
     - 𝕏 (Twitter): `@GENOWL_TECH`
     - Instagram: `@genowl_tech`
     - YZER Voice AI Hotline: `+1 (628) 245-9578` (with quick dial)
     - Official Support: `support@genowl.tech`
   - Responsive layout (`.iso-grid`): 2x2 grid on mobile devices and 4x1 horizontal bar on tablet/desktop.
   - Bounded skew/rotation angles (`rotate(-18deg) skew(16deg)`) ensuring zero overlapping, zero clipping, and full on-screen visibility.
   - Mobile viewport fix: Ensured natural document flow on mobile (`relative md:fixed md:bottom-0`), eliminating overlap with `MobileBottomNav`.

3. **Header Navbar Integrity**:
   - Verified and maintained the clean obsidian glassmorphism navbar in `src/components/Navbar.tsx` with smooth spring active pill indicators.

4. **Production Build Pipeline**:
   - Rebuilt Vite production assets (`bundle.js`, `bundle.css`).
   - Generated the standalone inlined single-bundle `index.html` via `node build_standalone.js` (eliminating Vite chunking 404s and MIME type errors on Hostinger).

---

## 2. Resumption Protocol:

Whenever you return, simply say **"hey"** and our full context, memory anchors, and technical pipelines will resume instantly!
