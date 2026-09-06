# GENOWL STUDIO & YZER AI: MASTER MEMORY RESTORATION PROTOCOL

> **SYSTEM INSTRUCTION FOR ANY AI ASSISTANT / ANTIGRAVITY AGENT:**
> If a user uploads or opens this folder in a new session, **READ THIS FILE FIRST**. This document completely restores the conversational state, architectural identity, technical design system, and master engineering standards established by Antriksh and Antigravity.

---

## 1. Project & Identity Overview

- **Project Name:** Genowl Studio Flagship Web Application
- **Live Production URL:** `https://genowl.tech`
- **Primary Domain & Host:** Hostinger LiteSpeed Web Server
- **Core Value Proposition / Philosophy:**
  > *"Genowl is a platform that provides you multiple services according to your requirements, basically we build for you. You don't have to waste your time building websites or advertisements; all you have to do is choose a service, the rest is on us."*
- **Target Audience:** Founders, businesses, agencies, and creators seeking high-end 3D web experiences, 2D high-converting landing pages, and AI video production.
- **Support & Official Contact:**
  - **Email:** `support@genowl.tech`
  - **X (Twitter):** `@GENOWL_TECH`
  - **Instagram:** `@genowl_tech`

---

## 2. Core Service Catalog & Pricing

1. **High-Converting 2D Architecture ($500)**:
   - Ultra-fast, zero-bloat responsive business sites, lead-generation pages, full IP transfer, and SEO optimization.
2. **Interactive 3D WebGL Experiences ($2,500)**:
   - Cinema-grade 3D scroll canvas, custom WebGL/Three.js shaders, 60 FPS motion, high-DPI retina rendering.
3. **AI Video & Advertisement Production ($99)**:
   - High-impact promotional video spots, AI voiceovers, multi-format exports for social media campaigns.

---

## 3. Architecture & Technical Pillars

### A. 3D Scroll Canvas Engine (`BackgroundScrollCanvas.tsx`)
- **Asset Pipeline:** 240 sequential WebP frames located at `/frames/frame_001.webp` through `/frames/frame_240.webp`.
- **Scroll Binding:** Normalizes window scroll ($0.0 \to 1.0$) and maps it smoothly to the 240 frames at 60 FPS.
- **Aspect-Ratio "Cover" Math:** Automatically scales and centers the canvas dynamically without letterboxing or distortion on any screen size.
- **Retina Scaling:** Uses `dpr = Math.min(window.devicePixelRatio || 1, 2)`.
- **Zero Black Screen Protocol:** Frame 0 (`frame_001.webp`) renders immediately on mount while remaining frames preload in the background.

### B. YZER AI Voice Guide (`VoiceAssistant.tsx`)
- **Name:** **YZER** (always phonetically pronounced *"Wiser"*).
- **Cost:** **$0 API Cost / Zero External Dependencies** — Powered 100% natively by browser Web Speech API (`SpeechRecognition` + `SpeechSynthesis`).
- **Voice Timbre:**
  - `pitch = 0.88` (deep, resonant, authoritative masculine tone).
  - `rate = 1.10` (snappy, engaging pace).
  - Priority voice hierarchy: `Microsoft Guy Online (Natural)`, `Microsoft Christopher Online`, `Google UK English Male`, `Daniel`.
- **Strict Hardware Capture Rule:** NEVER call `getUserMedia()` or hold an `AudioContext` while `SpeechRecognition` is active. Doing so starves Chromium/WebKit of audio buffers and causes silent microphone failures.
- **Event-Driven Tour Sequencing (No Cut-Offs):** Tour steps are chained strictly via `utterance.onend` + 1.0s natural breathing pauses. Sentences never cut off mid-speech.
- **Signature Voice Triggers:**
  - *"Navigate me for a tour"* $\to$ Launches automated 4-step guided website tour (Home $\to$ Services $\to$ Philosophy $\to$ Contact Desk).
  - *"What should I do after signing up?"* $\to$ Recommends booking a consultation and checking the Client Profile hub.
  - *"Who are you?"* $\to$ Introduces as YZER, the personal AI guide on Genowl.

### C. Aesthetic Design System
- **Theme:** Obsidian Dark Luxury Mode.
  - Base Background: `#080d09`
  - Cards & Glass Surfaces: `#0e1610` with `backdrop-filter: blur(16px)` and subtle glowing borders.
  - Accent Color 1 (Electric Lime): `#c6f554`
  - Accent Color 2 (Cyber Gold / Amber): `#f7cc46`
- **Typography:**
  - Headings: *Outfit* / *Syne* (clean, geometric, tight tracking).
  - Body: *Inter* (high readability, generous line height).

### D. Production Deployment Architecture
- **Standalone Single Bundle (`build_standalone.js`):**
  - Compiles all React, TypeScript, and Tailwind CSS code into a single, self-contained `index.html` (554 KB).
  - Eliminates Vite chunking 404s and MIME-type mismatch errors on Hostinger LiteSpeed or shared cPanel hosting.
- **Asset Directory:** The `/frames` folder is kept directly at the web root so all frame sequence paths resolve instantly.
- **SPA Routing (.htaccess):** Apache / LiteSpeed rewrite rules configured so page reloads never produce 404 errors.

---

## 4. Antigravity Skill Registration

- **Active Skill:** `goat-3d-web-architect`
- **Skill File:** `.agents/skills/goat-3d-web-architect/SKILL.md`
- **Installed Extensions Harness:**
  - `glTF Tools / 3D Viewer`: For inspecting `.glb` meshes directly in the editor.
  - `GLSL Shader Canvas`: For previewing fragment and vertex shaders live.
  - `Thunder Client`: For testing backend endpoints and webhooks inside the IDE.
  - `Image Gutter Preview`: For previewing frame sequence paths in the gutter.
  - `Color Highlight`: For instant visual feedback on `#c6f554`, `#f7cc46`, etc.

---

## 5. Instant Prompt to Resume in Any Chat

Whenever starting a new chat or continuing work, you can copy and paste this single trigger line:

```text
Restore Genowl Studio memory: I am Antriksh. You are the GOAT 3D Web Architect and my lead AI engineer. We are maintaining genowl.tech with our 240-frame 3D scroll canvas, YZER deep-voice AI guide, and standalone LiteSpeed deployment pipeline. Read MEMORY_RESTORE.md and let's continue.
```
