# GENOWL STUDIO & YZER AI: MASTER MEMORY RESTORATION PROTOCOL

> **SYSTEM INSTRUCTION FOR ANY AI ASSISTANT / ANTIGRAVITY AGENT:**
> If a user uploads or opens this folder in a new session, **READ THIS FILE FIRST**. This document completely restores the conversational state, architectural identity, technical design system, and master engineering standards established by Antriksh and Antigravity.

---

## 1. Project & Identity Overview

- **Project Name:** Genowl Studio Flagship Web Application
- **Live Production URL:** `https://genowl.tech`
- **Primary Domain & Host:** Hostinger LiteSpeed Web Server
- **Founding Team & Leadership:** **Antriksh**, **Bilal**, **Maulik**, **Jaywardhan**, and **Ritesh** (Co-Founders of Genowl).
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

Whenever starting a new chat or continuing work, you can simply say **"hey"** (or use the trigger below):

```text
Restore Genowl Studio memory: I am Antriksh (Co-Founder of Genowl Studio alongside Bilal, Maulik, Jaywardhan, and Ritesh). You are the GOAT 3D Web Architect and my lead AI engineer. We are maintaining genowl.tech with our 240-frame 3D scroll canvas, YZER deep-voice AI guide, and standalone LiteSpeed deployment pipeline. Read MEMORY_RESTORE.md and let's continue.
```

---

## 6. Complete Session History & "Hey" Recap Snapshot

> **MANDATORY INSTRUCTION FOR "HEY" GREETINGS:**
> When Antriksh says **"hey"**, greet him warmly as Co-Founder of Genowl Studio (founded by Antriksh, Bilal, Maulik, Jaywardhan, and Ritesh), and immediately provide this exact progress recap:

### What We Built & Solved in Our Last Session:
1. **YZER Live AI Voice Calling & 24/7 Hotline**:
   - Integrated full telephonic & WebRTC calling for Genowl Studio's AI agent **YZER** (pronounced *"Wiser"*).
   - Official US Phone Number: **`+1 (628) 245-9578`** (San Francisco / Silicon Valley area code).
   - Vapi Voice Engine API Credentials:
     - **Assistant ID (`A`)**: `9facf4ab-efc8-45f4-a270-50713b8d4592`
     - **Public Key (`P`)**: `985f0bb7-f6a5-4c59-95cb-eb346e331609`

2. **The 100% Free ($0) Calling Solution**:
   - Solved the Indian cellular ISD carrier restriction problem.
   - Built real-time **in-browser WebRTC voice calling** using `@vapi-ai/web`.
   - Users and visitors can talk directly to YZER using their browser microphone with zero ISD or carrier fees, using Vapi's complimentary grant.

3. **Complete Smartphone / Mobile Architecture**:
   - **Mobile Bottom Dock (`MobileBottomNav.tsx`)**: Added a dedicated, glowing **"Call AI"** thumb button with pulsing mic icon in the persistent mobile navigation bar (`Home | Services | Call AI | Contact | Hub`). 1-tap calling from any page on mobile!
   - **Mobile Drawer Menu (`Navbar.tsx`)**: Added a prominent **"Call YZER Live (100% Free)"** button to the top of the mobile hamburger menu.
   - **Mobile-Responsive Modal (`VapiVoiceCallModal.tsx`)**: Sized for smartphone screens (`max-h-[92vh] overflow-y-auto`, responsive disc `w-36` to `w-44`, live waveform, mute toggle, call timer).
   - **Cellular Dialer Fallback**: Added direct `tel:+16282459578` fallback links in the call modal and contact banner so mobile users can tap to open their phone's native dialer if preferred.
   - **Interactive Voice Assistant (`VoiceAssistant.tsx`)**: Added "Call Live" header button, "📞 Call YZER Live" suggestion chip, and automatic voice/text intent detection ("call", "phone", "voice call") that instantly launches the live call.

4. **Production Build & Git Status**:
   - Clean TypeScript compile: `npx tsc --noEmit` passed with exit code 0.
   - Production bundle: `node build_standalone.js` successfully generated self-contained `index.html` (1.08 MB).
   - Pushed to GitHub: `antrikshsoun-cloud/genowl-main` on branch `main` (commit `5299d7d`).
   - Dev Server: Running and serving 200 OK at `http://localhost:3000/`.

