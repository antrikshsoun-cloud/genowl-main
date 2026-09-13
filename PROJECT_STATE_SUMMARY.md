# PROJECT STATE & RESUMPTION CHECKPOINT

**Timestamp:** 2026-09-13T15:20:00+05:30  
**Founders:** Antriksh Soun, Bilal, Maulik, Jaywardhan, and Ritesh (Co-Founders of Genowl Studio)  
**Lead AI Engineer:** Antigravity (GOAT 3D Web Architect)  
**Target Domain:** `https://genowl.tech` (Hostinger LiteSpeed)  
**Git Branch:** `main` (Repository: `antrikshsoun-cloud/genowl-main`)  
**Current Git Status:** Clean (`nothing to commit, working tree clean`, up to date with `origin/main` commit `26bd65a`)

---

## 1. What We Analyzed & Documented Today:

1. **Lusion.co Award-Winning WebGL Architecture Reverse-Engineered**:
   - Analyzed how `lusion.co` runs silky-smooth 60 FPS animations on computers without dedicated GPUs.
   - Identified the 4 core pillars:
     - **GPGPU Ping-Pong FBOs & 3D Curl Noise**: Hardware-parallel vertex math on integrated GPU execution cores instead of single-threaded JavaScript.
     - **1 Draw Call Batching**: `THREE.InstancedMesh` / single continuous geometries eliminating CPU-GPU driver bottlenecks.
     - **Procedural PBR & MatCap Lighting**: Faked high-end studio lighting (Fresnel rim math) without heavy 2048x2048 real-time shadow maps.
     - **Resolution Throttling (DPR Capping)**: `Math.min(window.devicePixelRatio, 1.5 - 2)` reducing pixel fill rate overhead by up to 75%.
   - Clarified the difference between Genowl's 240-frame scrubbed canvas (Apple-style photorealistic sequence) and Lusion's real-time WebGL code.

2. **Complete YZER AI Voice Guide Architectural Breakdown**:
   - Documented the exact reason why YZER in `src/components/VoiceAssistant.tsx` runs **100% free with ZERO API keys**:
     - Uses native browser **W3C Web Speech API** (`SpeechRecognition` for listening, `SpeechSynthesis` for talking).
     - Relies entirely on the visitor's local operating system / browser engines (zero OpenAI/ElevenLabs fees).
     - Timbre tuning: `pitch = 0.88` (deep, resonant masculine tone), `rate = 1.10` (dynamic natural pace).
     - Zero audio hardware starvation: releases microphone immediately to prevent Chromium locks.
     - Event-driven tour chaining: uses `utterance.onend` + 1.0s natural breathing pauses so speech never cuts off mid-sentence across the 4-page automated tour.

3. **Workspace Integrity & Clean State Safeguard**:
   - All experimental watch assets and codes were completely removed.
   - `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/VoiceAssistant.tsx`, and `vite.config.ts` are 100% restored.
   - Re-verified Git status: `nothing to commit, working tree clean`.
   - Production standalone bundle `index.html` (1.12 MB) and dev server are perfectly intact.

---

## 2. Status & Next Steps for Later:

- **Local Dev Server**: Active on `http://localhost:3000/`.
- **Genowl Studio Vault**: Fully intact locally and synced on GitHub `origin/main`.
- Whenever you return, simply say **"hey"** to resume pairing!
