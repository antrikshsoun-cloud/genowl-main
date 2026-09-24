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

## 2. Core Service Catalog & "We Book • We Build" Model

Genowl Studio operates on a bespoke **"We Book • We Build"** appointment booking model. All fixed pricing packages have been eliminated from the platform in favor of tailored technical consultation and custom build quotes with 100% intellectual property transfer:
1. **High-Converting 2D Responsive Architecture**:
   - Ultra-fast, zero-bloat responsive business sites, lead-generation pages, full IP transfer, fluid typography, and SEO optimization.
2. **Interactive 3D WebGL Experiences**:
   - Cinema-grade 3D scroll canvas, custom WebGL/Three.js shaders, 60 FPS motion, high-DPI retina rendering.
3. **Autonomous AI Voice & Operational Agents**:
   - Intelligent conversational agents, WebRTC voice hotlines, automated customer qualification, and real-time CRM database synchronization.
4. **4K Commercial AI Video & Advertisement Production**:
   - High-impact promotional video spots, AI voiceovers, multi-format exports for social media campaigns, investor pitch decks.

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

4. **Service Booking & Spelled Email Verification Architecture**:
   - Interactive 4-step voice dialogue: strictly records `service_type`, `customizations`, `meeting_time_slot`, and `customer_email`.
   - Voice & phone email parser `parseSpelledEmail()`: accurately decodes spelled-out letters (`"a n t r i k s h at gmail dot com"`), digit words, phonetic symbols, and noisy prefixes.
   - Database schema & API update: `genowl_project_leads` table auto-migrated with `customizations` column; strictly validates email and prevents dummy callers.
   - Dual Web & Phone Hotline synchronicity: both in-browser YZER modal and phone hotline (`+1 628 245-9578`) use the identical 4-field booking payload.

5. **Complete Genowl Studio Safeguard Vault & Git Status**:
   - **Isolated Local Vault**: [`C:\Users\Antriksh\Downloads\GENOWL_STUDIO_COMPLETE_VAULT`](file:///C:/Users/Antriksh/Downloads/GENOWL_STUDIO_COMPLETE_VAULT) — contains all source code (`src/`), 240 WebP canvas frames (`frames/`), Hostinger PHP backends (`api/`), build scripts, blueprints, and docs completely preserved.
   - **Portable Zip Archive**: [`C:\Users\Antriksh\Downloads\GENOWL_STUDIO_ARCHIVE_FINAL.zip`](file:///C:/Users/Antriksh/Downloads/GENOWL_STUDIO_ARCHIVE_FINAL.zip) (91.9 MB).
   - **GitHub Repository**: Synced & pushed to `origin/main` (commit `26bd65a`).

6. **Lusion.co WebGL Analysis & YZER Native Voice Masterclass (Today)**:
   - **Lusion 3D Architecture**: Decoded why it runs 60 FPS on integrated GPUs (GPGPU 3D curl noise parallel vertex compute, single draw call `InstancedMesh` batching, procedural PBR/MatCap lighting without heavy shadow passes, and resolution DPR clamping). Clarified difference with Genowl's 240-frame sequence.
   - **YZER Zero-Cost Architecture**: Documented why YZER runs 100% free with $0 API cost and zero API keys using native browser W3C Web Speech API (`webkitSpeechRecognition` + `speechSynthesis`), masculine pitch tuning (`0.88`), and event-driven `utterance.onend` chaining for the 4-step guided tour.
   - **Workspace Integrity**: Verified clean git tree (`nothing to commit, working tree clean`), production bundle compiled, all experimental test files purged. Everything intact and ready to resume.

7. **Luxury Watch Showcase (`CHRONOS | Haute Horlogerie 4K`) Activation**:
   - **Location**: `c:\Users\Antriksh\Downloads\antigravitygenowl project\luxury-watch-showcase\`
   - **Dedicated Memory Restore**: [`WATCH_MEMORY_RESTORE.md`](file:///c:/Users/Antriksh/Downloads/antigravitygenowl%20project/luxury-watch-showcase/WATCH_MEMORY_RESTORE.md)
   - **Asset Pipeline**: 480 clean, watermark-free 4K frames (`frame_001.jpg` to `frame_480.jpg`) with cubic Hermite smoothstep optical zoom cross-dissolve (Frames 236–243).
   - **Active Dev Server**: Running on port `5190` via `npm run dev` (`http://localhost:5190/` and `http://10.61.226.104:5190/`).
   - **Next Phase**: Ready to build floating editorial typography, component callouts, and luxury navigation overlay.

8. **Google Search Branding, Favicon Resolution & GSC Ownership (Today)**:
   - **Root Cause Eliminated**: Fixed the 404 error on Google favicon requests caused by legacy `/dist/` prefixes and premature `.htaccess` rewrite rules.
   - **1:1 Square Multi-Resolution Suite Generated**: Vector-sampled 512x512 master badge with Golden Owl silhouette, `#070908` obsidian squircle, cyber gold gradient, and safe-zone padding. Generated `favicon.svg`, `favicon.ico` (16/32/48), `favicon-48x48.png` (Google standard), `icon-192x192.png` (Android/mobile), `icon-512x512.png` (HD Schema), `apple-touch-icon.png` (iOS), and `og-image.png` (1200x630 cinema social preview).
   - **Google Search Console Ownership Verified**: Added DNS TXT token (`google-site-verification=7W7u1FClacGfGr1N7M2t4qxijoU6jRt-UkbU1nfWXow`) in Hostinger DNS and baked it into `index.html`. Domain ownership verified in GSC and live re-crawl requested.
   - **Production Confirmed**: All assets live at `https://genowl.tech` returning HTTP 200 OK with CORS (`*`) and 1-year CDN caching.

9. **Complete Price Elimination & Advanced SEO / AEO / GEO Architecture (September 23, 2026)**:
   - **"We Book • We Build" Paradigm Shift**:
     - Completely removed all fixed price figures (`$500`, `$2,500`, `$99`, `$1,000`, etc.) across all components (`ServicesPage`, `ServicesFAQ`, `OrderModal`, `TrustMetrics`, `AboutPage`, `Footer`, `Hero`, `serviceStyles`, `VoiceAssistant`, `VapiVoiceCallModal`, `emailService`, and database services).
     - Prominently integrated signature tagline **"We Book • We Build"** across the Hero banner, service headers, trust metric badges, and footer.
     - CTAs transitioned to pure appointment booking: *"Book Appointment"*, *"Book Slot"*, *"Reserve Project"*.
   - **Advanced GEO (Generative Engine Optimization)**:
     - Whitelisted all major AI crawlers in `robots.txt` (`GPTBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`, `Bytespider`, `Meta-ExternalAgent`).
     - Injected comprehensive JSON-LD `@graph` with **Founders Entity Schema**: Antriksh (Co-Founder), Bilal (Co-Founder), Maulik (Co-Founder), Jaywardhan (Co-Founder), and Ritesh (Co-Founder).
     - Injected `knowsAbout` topical authority entities: WebGL, Three.js, Canvas Sequences, AI Agents, 4K Video Production.
   - **AEO (Answer Engine Optimization)**:
     - Injected 5-question `FAQPage` Schema for Google Position Zero featured snippets and voice assistants.
   - **SEO & Production Deployment**:
     - Enriched title: `Genowl Studio — Bespoke 3D WebGL, Next-Gen Web Development & AI Production`.
     - Rebuilt standalone production bundle `index.html` (1.12 MB) via `node build_standalone.js`.
     - Committed and pushed to GitHub `main` (commit `c42625a`).
     - Verified live deployment on Hostinger LiteSpeed Edge CDN (`https://genowl.tech/`) returning `HTTP 200 OK` with all new metadata, schema, and robots directives live.

10. **Google Identity & OAuth 2.0 1-Click Sign-In (September 24, 2026)**:
    - **Google Cloud Web OAuth Client ID**: 651977285691-0p0bhei1nvotuf4jql8iu43fs2g5drq4.apps.googleusercontent.com configured in .env and hardcoded as permanent fallback in AuthModal.tsx.
    - **Prominent Vector SVG Button**: Replaced fragile async iframe-only container with an obsidian-glass button equipped with the official 4-color Google 'G' vector SVG icon (Blue #4285F4, Green #34A853, Yellow #FBBC05, Red #EA4335).
    - **Universal OAuth2 Popup Client**: Integrated window.google.accounts.oauth2.initTokenClient with Google Userinfo API (/oauth2/v3/userinfo) alongside Google Identity Services (/gsi/client) for 1-click cross-platform Google account selection.
    - **Session & Avatar Synchronization**: Automatically pulls verified Google name, email, profile picture (picture), and Google sub ID; saves 7-day session (genowl_current_session); dynamically renders real Google profile photos in Navbar.tsx and ProfileModal.tsx; syncs user to Supabase in the background.
    - **Production Compilation**: Rebuilt standalone single-bundle index.html (1.13 MB) via 
ode build_standalone.js and updated deploy_hostinger_latest.zip.

11. **Hostinger MySQL User Authentication & Login Audit Pipeline (September 24, 2026)**:
    - **Hostinger Database Backend (pi/users.php)**: Auto-provisions and synchronizes two dedicated MySQL tables:
      1. genowl_users: Master user registry storing id, 
ame, email, vatar, provider (google or email), erified, login_count, last_login_at, and created_at.
      2. genowl_login_logs: Granular audit log recording every single login and registration event with user_id, email, 
ame, provider, ction, ip_address, user_agent, and login_at.
    - **Frontend Hostinger Client Service (src/services/hostingerDbService.ts)**: Added 
ecordUserLoginToHostinger() to dispatch live background sync calls to /api/users.php.
    - **Omni-Auth Event Integration (AuthModal.tsx)**: All login pathways (Google OAuth Credential, Google OAuth Custom Popup Client, Manual Email Sign-In, and Manual Email Sign-Up) now instantly record the user and their login event to the Hostinger LiteSpeed MySQL database.
    - **Production Packaging**: Rebuilt standalone single bundle index.html (1.13 MB) and updated deploy_hostinger_latest.zip including the /api suite.

12. **3D Floating Architecture Cube, Isometric Social Dock & Hostinger Package (September 24, 2026)**:
    - **3D Interactive Floating Architecture Cube (ServicePillarCube3D.tsx)**: 6-faced CSS 3D cube embedded in ServicesPage.tsx showcasing Genowl core offerings with perpetual 60 FPS floating, magnetic directional cursor tilt via equestAnimationFrame lerping, specular sheen, and quick-focus face selectors.
    - **3D Extruded Isometric Social Touchpoints Dock (IsometricSocialDock.tsx)**: Responsive isometric 3D channel dock embedded in Footer.tsx (2x2 on mobile, 4x1 on desktop) linking ?? (@GENOWL_TECH), Instagram (@genowl_tech), YZER Voice Hotline (+1 628 245-9578), and Support desk (support@genowl.tech).
    - **Hostinger LiteSpeed Production Packaging**: Recompiled production standalone index.html (1.16 MB) via 
ode build_standalone.js and regenerated deploy_hostinger_latest.zip (556 KB) containing .htaccess, pi/, search engine directives, and high-DPR favicon suite.

13. **Autonomous Voxel Architecture Matrix (TechVoxelMatrix.tsx) (September 24, 2026)**:
    - **Interactive 3x3x3 Isometric Voxel Matrix**: 27 interlocking hardware-accelerated CSS pseudo-element blocks (skewX, skewY, 	ranslate) in AboutPage.tsx.
    - **Phosphor Light-Painting Decay**: Blocks illuminate instantly on hover/touch with neon drop-shadows and smoothly decay over 1.4s.
    - **Telemetry HUD**: Displays real-time latency, coordinate, category, and technical capability for all 27 Genowl engineering modules.
    - **Palette Swapping & Wave Cascade**: Interactive palette buttons (Electric Lime, Cyber Gold, Cyan, Magenta) and automated sequential light sweep.
    - **Production Verification**: Single-bundle standalone index.html (1.17 MB) and deploy_hostinger_latest.zip (561 KB) updated and synced.

14. **Voxel Engine Architectural Alignment & Dynamic Multi-Color Sweep (September 24, 2026)**:
    - **Logical Architecture Anchoring**: Positioned as the visual manifestation of Genowl's core value proposition ("We build for you � 27 complex modules stacked into one production"). Explicit 3-tier strata: Tier 3 (3D Experience / Green), Tier 2 (Intelligence & Voice / Yellow), Tier 1 (Cloud & Security / Blue & Pink).
    - **Dynamic Multi-Color Flow**: Eliminated manual color pickers; sweeping across the cube lights up Green -> Yellow -> Blue -> Pink, blooming into an organic multi-color neon matrix with a 1.5s phosphor decay trail.
    - **Eliminated Obscured Text**: Removed overlapping hint pills; guaranteed full vertical stage clearance (min-h-[460px]).
    - **Production Sync**: Rebuilt standalone index.html (1.18 MB), updated deploy_hostinger_latest.zip (562 KB), committed and pushed to origin/main.
