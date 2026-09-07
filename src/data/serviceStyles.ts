// src/data/serviceStyles.ts
// Curated visual style archetypes and reference presets for Genowl Studio services

export interface ServiceStyleArchetype {
  id: string;
  title: string;
  badge: string;
  vibe: string;
  description: string;
  visualHighlights: string[];
  gradient: string;
  accentColor: string;
}

export const SERVICE_STYLES: Record<string, ServiceStyleArchetype[]> = {
  '2d-website': [
    {
      id: '2d-dark-linear',
      title: 'Sleek Dark Modernism (Linear Style)',
      badge: 'Most Popular',
      vibe: 'Deep black canvas, crisp typography, neon lime edge glow, ultra-modern tech feel',
      description:
        'Engineered for modern software companies and high-growth startups. Clean grid systems, subtle micro-borders, and 99+ PageSpeed score.',
      visualHighlights: ['Deep #070908 canvas with lime glows', 'High-contrast typography & icons', 'Conversion-engineered sticky CTA dock'],
      gradient: 'from-[#0f1d11] via-[#142317] to-[#0a140c]',
      accentColor: '#c6f554',
    },
    {
      id: '2d-high-converting-saas',
      title: 'High-Conversion SaaS & Product Launch',
      badge: 'Conversion Focused',
      vibe: 'Floating UI mockups, interactive pricing calculator, bold customer proof',
      description:
        'Designed to turn cold visitors into paying users. Prominent value metrics, feature tabs, interactive tabs, and frictionless lead forms.',
      visualHighlights: ['Floating glassmorphic dashboard cards', 'Dynamic pricing tier selectors', 'Multi-step frictionless lead capture'],
      gradient: 'from-[#171b26] via-[#121921] to-[#0c1017]',
      accentColor: '#60a5fa',
    },
    {
      id: '2d-minimal-luxury',
      title: 'Minimalist Luxury & Glassmorphism',
      badge: 'Boutique Aesthetic',
      vibe: 'Editorial typography, frosted glass blur, smooth transitions, elite agency feel',
      description:
        'Tailored for premium brands, architecture studios, and creative agencies. Focuses on breathing room, curated serif typography, and tactile hover states.',
      visualHighlights: ['Frosted backdrop-blur glass panels', 'Curated editorial serif headlines', 'Subtle magnetic hover interactions'],
      gradient: 'from-[#221c12] via-[#1a150c] to-[#0f0c07]',
      accentColor: '#f7cc46',
    },
  ],

  '3d-website': [
    {
      id: '3d-apple-scroll',
      title: 'Apple-Style High-DPR Scroll Sequence',
      badge: 'Flagship Benchmark',
      vibe: '60FPS fluid scroll-linked image sequence reacting to visitor scroll speed',
      description:
        'The exact architectural pattern used on the Genowl flagship. Ultra-fast WebP sequence rendered at 2x Retina DPR on high-performance 2D canvas.',
      visualHighlights: ['Silky 60FPS scroll-scrubbing mechanics', 'Zero WebGL lag across low-end mobile devices', 'Cinema-grade lighting and product motion'],
      gradient: 'from-[#122216] via-[#0e1c11] to-[#08120a]',
      accentColor: '#c6f554',
    },
    {
      id: '3d-product-orbit',
      title: 'Interactive 3D Product Orbit & GLTF Viewer',
      badge: 'Interactive WebGL',
      vibe: 'Real-time 3D object rotation, material shaders, and zoom controls',
      description:
        'Empower customers to drag, spin, and inspect your hardware, fashion, or digital product in 360-degree real-time WebGL space.',
      visualHighlights: ['Full 360-degree mouse/touch orbit controls', 'PBR metallic and roughness reflections', 'Dynamic hotspot annotations and feature pins'],
      gradient: 'from-[#151c27] via-[#0f151f] to-[#0a0d14]',
      accentColor: '#38bdf8',
    },
    {
      id: '3d-cyberpunk-particles',
      title: 'Immersive Cyberpunk & WebGL Particle World',
      badge: 'Cinema Grade',
      vibe: 'Dynamic particle swarms, mouse-reactive lighting, futuristic sci-fi depth',
      description:
        'Built with Three.js custom shaders. Thousands of responsive particles drift and react to mouse gestures, creating an unforgettable digital spectacle.',
      visualHighlights: ['GPU-accelerated particle flow fields', 'Cursor-reactive volumetric light rays', 'Custom GLSL bloom and chromatic shaders'],
      gradient: 'from-[#24132b] via-[#1a0c20] to-[#0f0714]',
      accentColor: '#e879f9',
    },
  ],

  'ai-agents': [
    {
      id: 'ai-voice-concierge',
      title: 'Autonomous Voice & Chat Concierge (YZER Style)',
      badge: 'Interactive Voice',
      vibe: 'Multilingual conversational voice guide with instant text responses and speech synthesis',
      description:
        'Inspired by Genowl’s native YZER assistant. Greets your site visitors, guides them through your offerings, answers FAQs, and books slots 24/7.',
      visualHighlights: ['Zero-lag Web Speech API integration', 'Audio waveform visualizers & pulse rings', 'Guided step-by-step interactive tours'],
      gradient: 'from-[#142316] via-[#0f1b11] to-[#081009]',
      accentColor: '#c6f554',
    },
    {
      id: 'ai-lead-closer',
      title: 'Lead Qualification & CRM Closer Agent',
      badge: 'Revenue Multiplier',
      vibe: 'Smart conversational intake that qualifies budget, scope, and timeline automatically',
      description:
        'Replaces boring static forms. The agent conducts an interactive interview, evaluates lead quality, and instantly pings your team via WhatsApp or CRM.',
      visualHighlights: ['Automated budget and timeline discovery', 'Instant WhatsApp and email webhook alerts', 'Auto-sync to Supabase/Postgres databases'],
      gradient: 'from-[#1c1a10] via-[#15130b] to-[#0c0b06]',
      accentColor: '#f7cc46',
    },
    {
      id: 'ai-knowledge-agent',
      title: 'Internal Knowledge Base & Document Intelligence',
      badge: 'Enterprise Grade',
      vibe: 'Trained on company documentation, PDFs, and manuals for instant query resolution',
      description:
        'Empower your team or customers with instant answers extracted accurately from manuals, technical specs, or contracts without hallucinations.',
      visualHighlights: ['Context-aware vector semantic search', 'PDF and markdown document ingestion', 'Strict source attribution & citations'],
      gradient: 'from-[#101e25] via-[#0b161b] to-[#060c0f]',
      accentColor: '#2dd4bf',
    },
  ],

  'video-generation': [
    {
      id: 'video-cinematic-commercial',
      title: 'Hyper-Realistic AI Cinematic Commercial',
      badge: '4K Commercial',
      vibe: 'Photorealistic studio lighting, dynamic camera reveals, and deep AI voiceover',
      description:
        'High-impact video advertisements crafted for paid campaigns, homepage hero banners, and investor pitch decks that look like a $20K production.',
      visualHighlights: ['Photorealistic 4K product motion sweeps', 'Hollywood-grade sound design & VO', 'Custom brand color grading and typography'],
      gradient: 'from-[#1e1511] via-[#160e0a] to-[#0d0705]',
      accentColor: '#fb923c',
    },
    {
      id: 'video-viral-social-reel',
      title: 'Viral Kinetic Social Reel (TikTok / IG / Shorts)',
      badge: 'High Retention',
      vibe: 'High-energy fast cuts, animated captions, sound effects, retention-optimized',
      description:
        'Engineered to conquer social media algorithms. Hook-first structure, dynamic captions, kinetic motion transitions, and punchy visual pacing.',
      visualHighlights: ['Hook in the first 1.5 seconds', 'Dynamic animated subtitle captions', '9:16 vertical cross-platform optimization'],
      gradient: 'from-[#251218] via-[#1a0b10] to-[#0f0609]',
      accentColor: '#f43f5e',
    },
    {
      id: 'video-tech-explainer',
      title: 'Futuristic 3D Motion Graphics Explainer',
      badge: 'Tech Showcase',
      vibe: 'Holographic interfaces, floating 3D elements, cybernetic transitions',
      description:
        'Break down complex software, crypto, AI, or hardware concepts into sleek, visual animations that captivate enterprise decision-makers.',
      visualHighlights: ['Holographic UI animations and HUDs', 'Kinetic typography with cyber sound design', 'Clean structural product walkthroughs'],
      gradient: 'from-[#141b27] via-[#0d131d] to-[#070a10]',
      accentColor: '#38bdf8',
    },
  ],
};

/**
 * Returns matching style archetypes for a given service title string
 */
export function getStylesForService(serviceTitle: string): ServiceStyleArchetype[] {
  const lower = serviceTitle.toLowerCase();
  if (lower.includes('3d')) return SERVICE_STYLES['3d-website'];
  if (lower.includes('agent') || lower.includes('ai') || lower.includes('personalized')) return SERVICE_STYLES['ai-agents'];
  if (lower.includes('video')) return SERVICE_STYLES['video-generation'];
  return SERVICE_STYLES['2d-website'];
}
