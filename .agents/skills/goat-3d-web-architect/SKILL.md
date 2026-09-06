---
name: goat-3d-web-architect
description: >-
  The definitive, master-level engineering standard for building award-winning,
  cinema-grade 3D websites. Covers Apple-style high-DPR scroll canvas sequences,
  WebGL/Three.js/GSAP/Lenis architectures, zero-cost AI voice assistants,
  full-stack backend connectivity, curated free 3D/PBR asset pipelines,
  FWA/Awwwards aesthetic benchmarks, and zero-downtime production deployment.
---

# GOAT 3D Web Architect: The Master Blueprint

This skill codifies the highest engineering and design standards for creating award-winning, cinema-grade 3D web experiences. It eliminates guesswork, enforces elite visual aesthetics, prevents performance bottlenecks, and guarantees flawless production stability.

---

## 1. Engineering Philosophy & The GOAT Mindset

1. **Never Settle for Ordinary**: Plain flat websites and generic templates are unacceptable. Every website must deliver an immediate "WOW" factor within the first 1.5 seconds.
2. **Performance is Luxury**: A stuttering 3D website is an unpolished website. Maintain 60 FPS on mobile and desktop by decoupling CPU-heavy logic from the GPU render loop.
3. **Zero-Cost Sovereignty**: Build intelligent, interactive capabilities (such as real-time voice agents) using native web standards with zero recurring API costs or vendor lock-in.
4. **Bulletproof Deployment**: The site must run flawlessly across all hosting architectures (Hostinger, cPanel, LiteSpeed, Vercel, Netlify) without MIME-type errors, white screens, or 404 asset failures.

---

## 2. Pillar 1: Cinema-Grade 3D Scroll & Canvas Engine

### Architecture Overview
Choose the right 3D rendering approach based on project requirements:
- **Frame Sequence Scroll Canvas (Apple Pro Style)**: Best for photorealistic product reveals, complex cinematic camera moves, raytraced glass/metal reflections, and guaranteed 60 FPS cross-device performance without high GPU battery drain.
- **Three.js / WebGL / React Three Fiber (R3F)**: Best for real-time generative particles, interactive raycasting, dynamic lighting, and user-manipulable 3D meshes.

### Apple-Style Frame Sequence Canvas Protocol
When building frame-interpolated 3D scroll canvas experiences:

```typescript
// 1. High-DPI Canvas Initialization with Aspect "Cover" Math
const renderFrame = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2.0 to balance crispness and VRAM
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  
  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }
  
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  // Aspect Ratio "Cover" Math - Never stretch or letterbox awkwardly
  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;
  let drawW = width;
  let drawH = height;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasAspect > imgAspect) {
    drawH = width / imgAspect;
    offsetY = (height - drawH) / 2;
  } else {
    drawW = height * imgAspect;
    offsetX = (width - drawW) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  ctx.restore();
};
```

### Preloading & Anti-Black Screen Protocol
1. **Always render Frame 0 immediately** once loaded; never leave the background black while waiting for other frames.
2. **Prioritize Primary Path**: Try root `/frames/`, fallback to relative `./frames/`, and handle CDN fallbacks gracefully.
3. **Smooth Scroll Binding**: Bind scroll progress ($0.0 \to 1.0$) to frame index using Lenis smooth scrolling or GSAP ScrollTrigger for organic inertia.

---

## 3. Pillar 2: Zero-Cost Native AI Voice Agent Engine (The YZER Protocol)

Create a state-of-the-art interactive voice companion without relying on paid OpenAI/ElevenLabs APIs by leveraging the native Web Speech API.

### Critical Rules for Voice Engineering
1. **Strict Hardware Capture Rule**: NEVER call `navigator.mediaDevices.getUserMedia` or hold an open `AudioContext` while running `SpeechRecognition`. Chromium locks the audio input exclusively, starving the speech recognition engine and causing silent input failures.
2. **Vocal Timbre Configuration**:
   - Deep, clear male voice: Set `utterance.pitch = 0.88`, `utterance.rate = 1.10`.
   - Priority voice selection hierarchy:
     - Windows/Edge: `Microsoft Guy Online (Natural)`, `Microsoft Christopher Online (Natural)`, `Microsoft Ryan Online (Natural)`.
     - Chrome: `Google UK English Male`, `Google US English Male`.
     - Safari/iOS: `Daniel`, `Oliver`, `Tom`.
3. **Event-Driven Tour Sequencing (No Cut-Offs)**:
   - NEVER use arbitrary `setTimeout` intervals to schedule conversational steps.
   - Always bind transitions to `utterance.onend`:
     ```typescript
     speak(stepOneText, () => {
       setTimeout(() => {
         onNavigate('services');
         speak(stepTwoText, () => {
           // Step 3 executes only after Step 2 finishes 100%
         });
       }, 1000); // 1.0s natural breathing pause
     });
     ```
4. **Brave Browser & Privacy Shields Defense**:
   - Brave blocks speech recognition by default. Always catch `error === 'network'` and gracefully present the hybrid text query bar.

---

## 4. Pillar 3: Full-Stack & Backend Integration

Connect the frontend to backend infrastructure without disrupting the 3D rendering thread.

### Best Practice Architecture
1. **Supabase / Firebase / Appwrite**:
   - Initialize the client outside React rendering loops (singleton instance).
   - Use Row-Level Security (RLS) on public lead-capture tables (e.g. `bookings`, `contacts`).
2. **Non-Blocking Background Sync**:
   - Execute database writes, lead submissions, and notifications asynchronously:
     ```typescript
     export const submitBooking = async (payload: BookingData) => {
       try {
         const { data, error } = await supabase.from('bookings').insert([payload]);
         if (error) throw error;
         return { success: true, data };
       } catch (err: any) {
         console.error('[Booking Error]', err.message);
         return { success: false, error: err.message };
       }
     };
     ```
3. **Auth State Reflection in Voice Agent**:
   - Pass `currentUser` into the voice guide so it can dynamically differentiate between guest requests ("Please sign up first") and member requests ("You are already signed in as ...").

---

## 5. Pillar 4: Curated Free High-End 3D & Design Asset Ecosystem

Never pay for basic 3D models or textures. Use the following elite open-source and free repositories:

### 3D Models & PBR Textures
- **Poly Haven** (`polyhaven.com`): 100% CC0 free HDRIs (up to 16K), photorealistic PBR textures, and 3D models.
- **Sketchfab Creative Commons** (`sketchfab.com`): Filter by CC Attribution or CC0 for high-detail 3D geometry.
- **Kenney 3D** (`kenney.nl/assets`): Thousands of modular, lightweight 3D assets with zero copyright restrictions.
- **Blender Market / Gumroad ($0 Tier)**: High-quality character and vehicle models shared freely by digital artists.

### FFmpeg Pipeline for Ultra-Smooth WebP Frame Sequences
To convert high-resolution Blender/Cinema4D MP4 animations into optimized WebP sequence frames:
```bash
# Extract 240 frames at 1920x1080 with 85% WebP quality
ffmpeg -i render.mp4 -vf "fps=30,scale=1920:1080:force_original_aspect_ratio=decrease" -vcodec libwebp -lossless 0 -compression_level 6 -q:v 85 frames/frame_%03d.webp
```

---

## 6. Pillar 5: Awwwards & FWA-Level Aesthetic Rules

Ordinary web styling ruins 3D experiences. Adhere to these creative design laws:

### Typography
- **Headings**: Syne, Clash Display, Outfit, or Space Grotesk.
- **Body & Data**: Inter, Plus Jakarta Sans, or JetBrains Mono.
- **Rules**: High contrast, generous tracking on small caps (`tracking-wider`, `uppercase`), tight tracking on large display headers (`tracking-tight`).

### Color System & Materials
- **Obsidian Dark Modes**: Never use `#000000` flat black. Use layered dark tones:
  - Base: `#080d09` or `#060809`
  - Card/Surface: `#0e1610` with `backdrop-filter: blur(16px)`
  - Border: `rgba(255, 255, 255, 0.08)` to `rgba(198, 245, 84, 0.2)`
- **Vibrant Neon Accents**:
  - Lime / Acid Green: `#c6f554`
  - Cyber Gold / Amber: `#f7cc46`
  - Electric Violet: `#8b5cf6`

### Micro-Interactions & Physics
- Buttons must have soft glow blooms (`shadow-[0_0_20px_rgba(198,245,84,0.3)]`).
- Interactive elements must provide visual feedback on hover (`transform scale-105`, border brightness).

---

## 7. Pillar 6: Zero-Fail Production Deployment (Hostinger / cPanel / LiteSpeed)

Prevent the classic "works on localhost, breaks on production" syndrome.

### Standalone Compilation (`build_standalone.js`)
Hostinger LiteSpeed and shared cPanel hosts frequently fail to serve Vite chunked JavaScript files due to aggressive MIME type enforcement or missing subfolder rewrite rules.
- **Solution**: Compile production builds into a single self-contained `index.html` where JavaScript and CSS bundles are inlined.
- **Asset Directory**: Place the `frames/` folder directly at the web root so that all asset URLs (`/frames/frame_001.webp`) resolve cleanly.

### Apache / LiteSpeed `.htaccess` Fallback
Always place an `.htaccess` file at the root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
