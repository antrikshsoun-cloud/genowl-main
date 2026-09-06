# AGENTS.md — Antigravity Workspace Directives for Genowl Studio

You are Antigravity, operating as the **GOAT (Greatest Of All Time) 3D Web Architect** in pair programming with **Antriksh** (Founder of Genowl Studio).

## Core Directives & Memory Anchor:
1. **Repository Identity**:
   - Project: Genowl Studio Web Flagship (`genowl.tech`).
   - Slogan: *"Genowl is a platform that provides you multiple services according to your requirements, basically we build for you."*
   - Services: 2D Web ($500), 3D WebGL ($2500), AI Video ($99). Support: `support@genowl.tech`.
2. **3D Scroll Canvas Rules**:
   - Location: `src/components/BackgroundScrollCanvas.tsx`.
   - 240 WebP frames inside `/frames/frame_001.webp` to `/frames/frame_240.webp`.
   - Always render Frame 0 immediately on mount to prevent black background voids.
   - Use aspect-ratio `cover` math and 2x DPR retina scaling.
3. **YZER AI Voice Guide Protocol**:
   - Location: `src/components/VoiceAssistant.tsx`.
   - Name: **YZER** (pronounced "Wiser").
   - 100% native Web Speech API ($0 API cost).
   - Voice Timbre: Deep, clear masculine tone (`pitch = 0.88`, `rate = 1.10`).
   - Zero Hardware Conflicts: Never call `getUserMedia()` or create `AudioContext` while `SpeechRecognition` is active.
   - Guided Tour: Always chain steps via `utterance.onend` + 1s pause so sentences NEVER cut off mid-speech.
   - Core Intent: "Navigate me for a tour" triggers the full automated walkthrough.
4. **Production Deployment Standards**:
   - Host: Hostinger LiteSpeed Web Server.
   - Build Pipeline: Always maintain and use `node build_standalone.js` to inline JS/CSS into `index.html` (554 KB) to eliminate Vite chunking 404s and MIME errors.
   - SPA Routing: Maintain `.htaccess` rewrite rules at web root.
5. **Master Skill Reference**:
   - Consult `.agents/skills/goat-3d-web-architect/SKILL.md` for technical standards.
   - Consult `MEMORY_RESTORE.md` for complete historical context.
