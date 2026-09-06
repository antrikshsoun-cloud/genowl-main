import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Send, Sparkles, Compass, HelpCircle, CheckCircle2, UserCheck, LogIn, Play } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';

interface VoiceAssistantProps {
  onNavigate: (page: string) => void;
  onOpenOrder: (serviceName?: string) => void;
  onOpenContact?: () => void;
  currentUser?: { name?: string; email?: string } | null;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onOpenProfile?: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refund') => void;
  onOpenAdmin?: () => void;
}

// Phonetic text sanitizer to completely eliminate pronunciation flutter/stutter
// and guarantee YZER is pronounced naturally as "Wiser"
function sanitizeForSpeech(raw: string): string {
  return raw
    .replace(/\bYZER\b/gi, 'Wiser')
    .replace(/\$2,500/g, 'twenty-five hundred dollars')
    .replace(/\$500/g, 'five hundred dollars')
    .replace(/\$99/g, 'ninety-nine dollars')
    .replace(/\$([0-9]+)/g, '$1 dollars')
    .replace(/60\s*fps/gi, 'sixty frames per second')
    .replace(/2D/gi, 'two D')
    .replace(/3D/gi, 'three D')
    .replace(/100%\s*IP/gi, 'one hundred percent intellectual property')
    .replace(/100%/gi, 'one hundred percent')
    .replace(/WebGL/gi, 'web G L')
    .replace(/UI\/UX/gi, 'U I and U X')
    .replace(/support@genowl\.tech/gi, 'support at genowl dot tech')
    .replace(/@GENOWL_TECH/gi, 'GENOWL TECH on X');
}

export default function VoiceAssistant({
  onNavigate,
  onOpenOrder,
  onOpenContact,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenLegal,
  onOpenAdmin,
}: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [assistantMessage, setAssistantMessage] = useState(
    'I am YZER, your Genowl AI guide. Ask me anything, or tap "Give me a tour"!'
  );
  const [isSupported, setIsSupported] = useState(true);

  const activeRecognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef<any>(null);
  const restartTimerRef = useRef<any>(null);
  const tourTimerRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Check device type
  const isMobile =
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Initialize Speech Synthesis & preload natural voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateVoices = () => {
        if ('speechSynthesis' in window) {
          voicesRef.current = window.speechSynthesis.getVoices();
        }
      };

      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }

    return () => {
      stopAll();
    };
  }, []);

  // Text-To-Speech with Phonetic Sanitizer, Deep Clear Male Resonance & onComplete Callback
  const speak = (text: string, onComplete?: () => void) => {
    setAssistantMessage(text);

    if (!synthRef.current) return;
    try {
      synthRef.current.cancel(); // Stop active speech immediately

      // Sanitize raw text to pronounce YZER as "Wiser" and eliminate flutter
      const cleanPronunciation = sanitizeForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanPronunciation);

      // Energetic, snappier cadence (1.10x) with deep, resonant, clear male pitch (0.88)
      utterance.rate = 1.10;
      utterance.pitch = 0.88;

      // Select deep, clear natural male studio voice
      const voices = voicesRef.current.length > 0 ? voicesRef.current : synthRef.current.getVoices();
      const maleVoice =
        // Windows/Edge Microsoft Online Natural male voices (Guy, Christopher, Ryan, Eric)
        voices.find((v) => (v.name.includes('Guy') || v.name.includes('Christopher') || v.name.includes('Ryan') || v.name.includes('Eric')) && (v.name.includes('Natural') || v.name.includes('Online'))) ||
        // Chrome / Google Natural male voices
        voices.find((v) => v.name.includes('Google UK English Male') || v.name.includes('Google US English Male')) ||
        // Apple / Safari natural male voices (Daniel, Oliver, Tom, Alex)
        voices.find((v) => v.name.includes('Daniel') || v.name.includes('Oliver') || v.name.includes('Tom') || v.name.includes('Alex')) ||
        // High quality fallback male voices
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('George'))) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (maleVoice) utterance.voice = maleVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onComplete) onComplete();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  // Factory to create a fresh, clean SpeechRecognition session
  const createSpeechSession = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      setAssistantMessage('YZER is listening... Speak your question now.');
    };

    recognition.onresult = (event: any) => {
      let accumulated = '';
      for (let i = 0; i < event.results.length; ++i) {
        accumulated += event.results[i][0].transcript;
      }

      const spoken = accumulated.trim();
      if (spoken) {
        setQueryText(spoken);

        // Auto execute after natural pause
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (spoken) {
            handleExecuteQuery(spoken);
            stopListening();
          }
        }, 1200);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('[Voice Assistant] Recognition event:', event.error);
      if (event.error === 'no-speech') {
        return;
      }
      if (event.error === 'network') {
        isListeningRef.current = false;
        setIsListening(false);
        setAssistantMessage('Cloud speech connection was blocked. If using Brave browser or an ad-blocker, please disable shields for mic access or type your question in the bar below!');
        return;
      }
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        isListeningRef.current = false;
        setIsListening(false);
        setAssistantMessage('Microphone access was blocked. Please click the lock/tune icon in your address bar and choose "Allow Microphone", or type below!');
        return;
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            try {
              const freshSession = createSpeechSession();
              activeRecognitionRef.current = freshSession;
              freshSession?.start();
            } catch (err) {
              console.warn('[Voice Assistant] Restart catch:', err);
            }
          }
        }, 200);
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  };

  // Start continuous listening natively
  const startListening = () => {
    stopAll();

    try {
      isListeningRef.current = true;
      setIsListening(true);
      setAssistantMessage('YZER is listening... Speak your question now.');

      const session = createSpeechSession();
      activeRecognitionRef.current = session;
      session?.start();
    } catch (e: any) {
      console.warn('[Voice Assistant] Start exception:', e?.message);
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (activeRecognitionRef.current) {
      try {
        activeRecognitionRef.current.stop();
      } catch {}
      activeRecognitionRef.current = null;
    }
  };

  const stopAll = () => {
    if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (synthRef.current) synthRef.current.cancel();
    setIsTourActive(false);
    stopListening();
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // GUIDED WEBSITE TOUR: Sequences smoothly onComplete so sentences never get cut off!
  const startWebsiteTour = () => {
    stopAll();
    setIsTourActive(true);
    setIsOpen(true);

    // STEP 1: Home Page
    onNavigate('home');
    const step1 =
      'We are Genowl, your all-in-one digital service partner. Here on our home page, you can experience our cinema-grade 3D scroll architecture and discover how we craft high-performance digital experiences without template bloat. Next, let us explore our services.';
    
    speak(step1, () => {
      // Step 2 triggers ONLY after Step 1 has 100% finished speaking!
      tourTimerRef.current = setTimeout(() => {
        onNavigate('services');
        const step2 =
          'Here in our services catalog, we offer three core solutions: high-converting 2D websites at $500, interactive 3D WebGL experiences at $2,500, and AI video and advertisement production for $99. Every service comes with full intellectual property transfer. Now let us look at our core philosophy.';
        
        speak(step2, () => {
          // Step 3 triggers ONLY after Step 2 has 100% finished speaking!
          tourTimerRef.current = setTimeout(() => {
            onNavigate('about');
            const step3 =
              'Here is our core philosophy: basically, we build for you. You do not have to waste your time building websites or advertisements; all you have to do is choose a service, the rest is on us. Finally, let us see how you can reach our team.';
            
            speak(step3, () => {
              // Step 4 triggers ONLY after Step 3 has 100% finished speaking!
              tourTimerRef.current = setTimeout(() => {
                if (onOpenContact) onOpenContact();
                else onNavigate('contact');
                const step4 =
                  'And here is our direct contact desk where you can message our team, email support@genowl.tech, or reach out on X at @GENOWL_TECH. You can also book a consultation slot anytime. Tour complete! How can YZER build for you today?';
                
                speak(step4, () => {
                  setIsTourActive(false);
                });
              }, 1000);
            });
          }, 1000);
        });
      }, 1000);
    });
  };

  // Comprehensive Genowl Knowledge Base & Natural Language Classifier
  const handleExecuteQuery = (rawInput: string) => {
    const text = rawInput.trim().toLowerCase();
    if (!text) return;

    // 1. Audio Silence / Stop Command
    if (
      text.includes('stop') ||
      text.includes('quiet') ||
      text.includes('mute') ||
      text.includes('shut up') ||
      text.includes('silence') ||
      text.includes('pause') ||
      text.includes('cancel tour')
    ) {
      stopAll();
      setAssistantMessage('Silenced. Feel free to type or tap the mic anytime.');
      return;
    }

    // 2. GUIDED WEBSITE TOUR COMMAND (including "navigate me for a tour")
    if (
      text.includes('tour') ||
      text.includes('navigate me for a tour') ||
      text.includes('navigate me') ||
      text.includes('walk me through') ||
      text.includes('show me around') ||
      text.includes('guide me through') ||
      text.includes('explain the website') ||
      text.includes('give me a tour')
    ) {
      startWebsiteTour();
      return;
    }

    // 3. WHAT SHOULD I DO AFTER SIGNING UP? (Direct, Actionable Advice)
    if (
      (text.includes('after') && (text.includes('sign') || text.includes('log') || text.includes('account') || text.includes('register'))) ||
      text.includes('what should i do after signing up') ||
      text.includes('what to do next') ||
      text.includes('signed up now what') ||
      (text.includes('what should i do') && (text.includes('signed up') || text.includes('registered')))
    ) {
      speak(
        'Now that you have signed up, here is what you can do: First, head over to our services section and click "Book Project" on any service to reserve your consultation slot. Second, check your Client Profile at the top right to view your active bookings and track project scope. Our studio will connect with you within thirty minutes for your kickoff call!'
      );
      return;
    }

    // 4. ASSISTANT NAME & IDENTITY: YZER (Pronounced "Wiser")
    if (
      text.includes('who are you') ||
      text.includes('what is your name') ||
      text.includes('your name') ||
      text.includes('yzer') ||
      text.includes('what are you') ||
      text.includes('who made you')
    ) {
      speak(
        'I am YZER, your personal AI guide on Genowl. Just like Brave has Leo and Google has Gemini, I am here to guide you through our services, explain our pricing, walk you through the website, and help you book your project.'
      );
      return;
    }

    // 5. SIGN UP / REGISTER ACCOUNT FLOW
    if (
      text.includes('sign up') ||
      text.includes('signup') ||
      text.includes('register') ||
      text.includes('create account') ||
      text.includes('new account') ||
      text.includes('join')
    ) {
      if (currentUser) {
        speak(
          `You are already signed in as ${currentUser.name || currentUser.email}. You can check your active projects in your profile hub.`
        );
        return;
      } else {
        if (onOpenAuth) onOpenAuth('signup');
        speak(
          'Opening the sign up portal for you now. Please enter your name, email, and password to register your account.'
        );
        return;
      }
    }

    // 6. LOG IN / SIGN IN ACCOUNT FLOW
    if (
      text.includes('log in') ||
      text.includes('login') ||
      text.includes('sign in') ||
      text.includes('signin')
    ) {
      if (currentUser) {
        speak(
          `You are already logged in as ${currentUser.name || currentUser.email}.`
        );
        return;
      } else {
        if (onOpenAuth) onOpenAuth('signin');
        speak('Opening the sign in window. Enter your email and password to log in.');
        return;
      }
    }

    // 7. CLIENT PROFILE / MY PROJECTS / DASHBOARD
    if (
      text.includes('profile') ||
      text.includes('my account') ||
      text.includes('my project') ||
      text.includes('dashboard') ||
      text.includes('booking records')
    ) {
      if (currentUser) {
        if (onOpenProfile) onOpenProfile();
        speak('Opening your client profile hub where you can view your active bookings and project scope.');
        return;
      } else {
        if (onOpenAuth) onOpenAuth('signin');
        speak('Please sign in first to access your client profile.');
        return;
      }
    }

    // 8. GREETINGS (Hello, Hi, Hey, Namaste, Good morning)
    if (
      text === 'hello' ||
      text === 'hi' ||
      text === 'hey' ||
      text.startsWith('hello') ||
      text.startsWith('hi ') ||
      text.startsWith('hey ') ||
      text.includes('how are you') ||
      text.includes('good morning') ||
      text.includes('good afternoon') ||
      text.includes('good evening') ||
      text.includes('namaste') ||
      text.includes("what's up")
    ) {
      speak(
        'Hello! I am YZER. Welcome to Genowl. How can I assist you with our services, pricing, or booking today?'
      );
      return;
    }

    // 9. ABOUT GENOWL (Exact Core Studio Statement requested)
    if (
      text.includes('about') ||
      text.includes('what is genowl') ||
      text.includes('who is genowl') ||
      text.includes('tell me about genowl') ||
      text.includes('what do you do') ||
      text.includes('what does genowl do') ||
      text.includes('what is this website') ||
      text.includes('what is this platform') ||
      text.includes('how does it work') ||
      text.includes('how it works') ||
      text.includes('philosophy') ||
      text.includes('why genowl')
    ) {
      onNavigate('about');
      speak(
        'Genowl is a platform that provides you multiple services according to your requirements, basically we build for you. You don’t have to waste your time in building a website or an advertisement, video generation, our team handles it for you. All you have to do is choose a service, rest is on us.'
      );
      return;
    }

    // 10. BOOKING, ORDERING & SLOT RESERVATION
    if (
      text.includes('book') ||
      text.includes('order') ||
      text.includes('buy') ||
      text.includes('hire') ||
      text.includes('start project') ||
      text.includes('reserve') ||
      text.includes('consultation') ||
      text.includes('get started') ||
      text.includes('deal') ||
      text.includes('contract')
    ) {
      let chosenService = '2D Website';
      if (text.includes('3d') || text.includes('webgl') || text.includes('interactive')) {
        chosenService = '3D Website';
      } else if (text.includes('ai') || text.includes('video') || text.includes('ad') || text.includes('commercial')) {
        chosenService = 'AI Video & Prompts';
      }
      onOpenOrder(chosenService);
      speak(`Opening your project reservation desk for ${chosenService}. Choose your preferred date, and our team will confirm your slot.`);
      return;
    }

    // 11. 3D WEBGL / INTERACTIVE WEBSITES
    if (
      text.includes('3d') ||
      text.includes('three.js') ||
      text.includes('threejs') ||
      text.includes('webgl') ||
      text.includes('shader') ||
      text.includes('canvas animation') ||
      text.includes('interactive website')
    ) {
      onNavigate('services');
      speak(
        'Our 3D Interactive WebGL websites start at $2,500. They feature silky-smooth 60 frames per second physics, custom canvas shaders, interactive models, and 100% intellectual property transfer.'
      );
      return;
    }

    // 12. 2D WEBSITES / LANDING PAGES
    if (
      text.includes('2d') ||
      text.includes('landing page') ||
      text.includes('standard website') ||
      text.includes('basic website') ||
      text.includes('react')
    ) {
      onNavigate('services');
      speak(
        'Our 2D Websites start at $500. Built with React and modern responsive architecture, they feature ultra-fast load times, SEO optimization, and a 3 to 5-day turnaround.'
      );
      return;
    }

    // 13. AI & VIDEO GENERATION / ADVERTISEMENTS
    if (
      text.includes('video') ||
      text.includes('advertisement') ||
      text.includes('ad') ||
      text.includes('commercial') ||
      text.includes('promo') ||
      text.includes('ai generation') ||
      text.includes('prompt')
    ) {
      onNavigate('services');
      speak(
        'Our AI and Video Production package is just $99. We craft tailored marketing visuals, 4K promotional renders, and video advertisements ready for your campaigns.'
      );
      return;
    }

    // 14. GENERAL PRICING & RATES
    if (
      text.includes('price') ||
      text.includes('pricing') ||
      text.includes('cost') ||
      text.includes('fee') ||
      text.includes('package') ||
      text.includes('rate') ||
      text.includes('how much') ||
      text.includes('cheap') ||
      text.includes('affordable') ||
      text.includes('expensive')
    ) {
      onNavigate('services');
      speak(
        'Genowl pricing is completely transparent: $500 for high-converting 2D Websites, $2,500 for Cinema-grade 3D WebGL, and $99 for AI Video generation. All services include full code and IP transfer.'
      );
      return;
    }

    // 15. ALL SERVICES OVERVIEW
    if (
      text.includes('service') ||
      text.includes('what can you build') ||
      text.includes('what do you offer') ||
      text.includes('features') ||
      text.includes('catalog') ||
      text.includes('options')
    ) {
      onNavigate('services');
      speak(
        'We offer three primary services: 2D modern websites for $500, interactive 3D WebGL websites for $2,500, and AI video and advertisement generation for $99. Scrolling to the services catalog now.'
      );
      return;
    }

    // 16. TURNAROUND / TIMELINE / DELIVERY SPEED
    if (
      text.includes('time') ||
      text.includes('how long') ||
      text.includes('delivery') ||
      text.includes('turnaround') ||
      text.includes('days') ||
      text.includes('fast') ||
      text.includes('urgent') ||
      text.includes('speed')
    ) {
      speak(
        'Our turnaround is fast: 3 to 5 days for 2D Websites, 7 to 14 days for 3D WebGL interactive builds, and 24 to 48 hours for AI video advertisements.'
      );
      return;
    }

    // 17. REFUND, REVISIONS & GUARANTEE POLICY
    if (
      text.includes('refund') ||
      text.includes('guarantee') ||
      text.includes('money back') ||
      text.includes('cancel') ||
      text.includes('revision') ||
      text.includes('modify') ||
      text.includes('policy') ||
      text.includes('safe')
    ) {
      if (text.includes('show') || text.includes('page') || text.includes('open')) {
        if (onOpenLegal) onOpenLegal('refund');
      }
      speak(
        'We provide a 100% money-back refund guarantee before milestone development begins, plus unlimited revisions during the initial wireframing and design phase.'
      );
      return;
    }

    // 18. LEGAL CENTER (Terms, Privacy Policy)
    if (text.includes('terms') || text.includes('condition')) {
      if (onOpenLegal) onOpenLegal('terms');
      speak('Opening our studio Terms and Conditions.');
      return;
    }
    if (text.includes('privacy')) {
      if (onOpenLegal) onOpenLegal('privacy');
      speak('Opening our Privacy Policy.');
      return;
    }

    // 19. ADMIN PORTAL ACCESS
    if (text.includes('admin') || text.includes('database') || text.includes('master password')) {
      if (onOpenAdmin) onOpenAdmin();
      speak('Opening the Master Password protected Studio Admin Portal.');
      return;
    }

    // 20. CONTACT, SUPPORT, EMAIL & SOCIALS
    if (
      text.includes('contact') ||
      text.includes('email') ||
      text.includes('support') ||
      text.includes('phone') ||
      text.includes('talk to human') ||
      text.includes('reach') ||
      text.includes('twitter') ||
      text.includes('instagram') ||
      text.includes('x.com') ||
      text.includes('message') ||
      text.includes('help desk')
    ) {
      if (onOpenContact) onOpenContact();
      else onNavigate('contact');
      speak(
        'You can reach our team directly at support@genowl.tech, or message us on official X at GENOWL_TECH. Scrolling to the contact desk now.'
      );
      return;
    }

    // 21. 2D VS 3D DIFFERENCE & COMPARISON
    if (
      (text.includes('difference') && (text.includes('2d') || text.includes('3d'))) ||
      text.includes('compare') ||
      text.includes('which service') ||
      text.includes('which one should i choose')
    ) {
      onNavigate('services');
      speak(
        'Our 2D websites at $500 are high-speed conversion machines ideal for businesses and landing pages. Our 3D websites at $2,500 feature cinema-grade WebGL physics, shaders, and 60 frames per second scroll animations for luxury brands looking to truly stand out.'
      );
      return;
    }

    // 22. CUSTOM WEB APPS, SAAS & ENTERPRISE
    if (
      text.includes('custom') ||
      text.includes('enterprise') ||
      text.includes('saas') ||
      text.includes('web app') ||
      text.includes('backend') ||
      text.includes('database') ||
      text.includes('complex')
    ) {
      onNavigate('services');
      speak(
        'For custom web applications, SaaS platforms, and enterprise databases, our studio designs tailored architectures. Book a consultation slot and we will scope your exact requirements.'
      );
      return;
    }

    // 23. BRANDING, LOGOS & GRAPHIC DESIGN
    if (
      text.includes('logo') ||
      text.includes('branding') ||
      text.includes('graphic') ||
      text.includes('design') ||
      text.includes('identity')
    ) {
      speak(
        'Every project includes complete brand styling, typography, color palettes, and asset optimization so your digital presence looks world-class.'
      );
      return;
    }

    // 24. HOSTING, DOMAIN & MAINTENANCE
    if (
      text.includes('hosting') ||
      text.includes('domain') ||
      text.includes('deploy') ||
      text.includes('maintenance') ||
      text.includes('update')
    ) {
      speak(
        'We handle full deployment on Hostinger, Vercel, or your custom server with zero downtime, and hand over complete production files and documentation.'
      );
      return;
    }

    // 25. PAYMENT & MILESTONE PROCESS
    if (
      text.includes('how to pay') ||
      text.includes('payment') ||
      text.includes('milestone') ||
      text.includes('invoice')
    ) {
      speak(
        'We work on transparent milestone agreements. You book a consultation slot, we finalize scope and delivery dates, and work begins with a 100% money-back guarantee.'
      );
      return;
    }

    // 26. COMPLIMENTS & PRAISE
    if (
      text.includes('great website') ||
      text.includes('awesome') ||
      text.includes('cool') ||
      text.includes('amazing') ||
      text.includes('love this') ||
      text.includes('beautiful') ||
      text.includes('good job') ||
      text.includes('nice work')
    ) {
      speak(
        'Thank you so much! Our studio puts intense craftsmanship into every single pixel and animation. Let us know if you would like us to build something extraordinary for you!'
      );
      return;
    }

    // 27. THANK YOU / THANKS
    if (text === 'thank you' || text === 'thanks' || text.startsWith('thank you') || text.startsWith('thanks')) {
      speak('You are very welcome! Feel free to ask anytime or book a consultation when you are ready.');
      return;
    }

    // 28. NAVIGATION SHORTCUTS
    if (text.includes('home') || text.includes('top') || text.includes('start over')) {
      onNavigate('home');
      speak('Navigating to the top home section.');
      return;
    }
    if (text.includes('services') || text.includes('catalog')) {
      onNavigate('services');
      speak('Here are our services.');
      return;
    }
    if (text.includes('contact') || text.includes('desk')) {
      if (onOpenContact) onOpenContact();
      else onNavigate('contact');
      speak('Here is our direct contact desk.');
      return;
    }

    // 29. OUT-OF-SCOPE GUARDRAIL
    speak(
      'I am YZER, Genowl’s AI guide. I am trained on our web services, 3D interactive engineering, video generation, and project booking. How can our team build for you today?'
    );
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    stopListening();
    handleExecuteQuery(queryText);
  };

  return (
    <div id="genowl-voice-assistant" className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* EXPANDED INTERACTIVE CONTROL DIALOG */}
      {isOpen && (
        <div className="mb-3 w-[330px] sm:w-[380px] p-4 rounded-3xl bg-[#0c130e]/95 border border-[#c6f554]/30 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.9)] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#141f16] border border-[#f7cc46]/50 flex items-center justify-center shadow-[0_0_10px_rgba(247,204,70,0.3)]">
                <OwlLogo className="w-4 h-4 text-[#f7cc46]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span>YZER</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#c6f554]/20 text-[#c6f554] font-mono">
                    AI Guide
                  </span>
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isListening ? 'bg-red-400 animate-ping' : isSpeaking ? 'bg-[#c6f554] animate-pulse' : 'bg-[#c6f554]'
                    }`}
                  />
                  <span>
                    {isListening
                      ? 'YZER is listening...'
                      : isSpeaking
                      ? 'YZER is speaking...'
                      : isTourActive
                      ? 'Tour in progress...'
                      : 'Ask YZER anything'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopAll}
                  title="Silence voice"
                  className="p-1 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5 text-zinc-300" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  stopAll();
                  setIsOpen(false);
                }}
                className="p-1 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Response Subtitle & Live Status */}
          <div className="p-3 rounded-2xl bg-[#121c13] border border-white/[0.08] min-h-[60px] flex flex-col justify-center">
            <p className="text-xs text-zinc-200 leading-relaxed font-normal">
              {assistantMessage}
            </p>
          </div>

          {/* ACTIVE MIC STATUS BAR */}
          {isListening && (
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                <Mic className="w-3 h-3 text-red-400 animate-pulse" />
                <span>Microphone:</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#c6f554] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                <span>YZER is listening actively...</span>
              </div>
            </div>
          )}

          {/* Equalizer Sound Wave Animation */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center justify-center gap-1 py-1">
              {[35, 65, 95, 55, 85, 45, 75, 40].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full ${isListening ? 'bg-red-400' : 'bg-[#c6f554]'} animate-pulse`}
                  style={{
                    height: `${isListening ? (i % 2 === 0 ? 16 : 8) : isSpeaking ? h * 0.22 : 4}px`,
                    animationDuration: `${0.35 + i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* REAL-TIME TYPING & COMMAND INPUT BAR */}
          <form onSubmit={handleInputSubmit} className="relative flex items-center gap-1.5 pt-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder={isListening ? 'YZER is listening...' : 'Ask YZER or type a question...'}
                className={`w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-[#131d14] border text-xs text-white placeholder-zinc-500 focus:outline-none transition-all ${
                  isListening
                    ? 'border-red-500/70 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                    : 'border-white/15 focus:border-[#c6f554]/60'
                }`}
              />

              {queryText && (
                <button
                  type="button"
                  onClick={() => setQueryText('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Start speaking with YZER'}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-white/[0.06] hover:bg-white/10 text-[#c6f554] border-white/15 hover:border-[#c6f554]/50'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Submit Arrow Button */}
            <button
              type="submit"
              disabled={!queryText.trim()}
              title="Submit command to YZER"
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#baf345] to-[#d6fa66] text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition-all cursor-pointer shadow-[0_0_12px_rgba(198,245,84,0.25)] flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Instant Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-zinc-400">Quick:</span>
            {[
              { label: 'Navigate me for a tour 🚀', cmd: 'navigate me for a tour' },
              { label: 'After Sign Up?', cmd: 'what should I do after signing up?' },
              { label: 'About Genowl', cmd: 'tell me about genowl' },
              { label: 'Pricing ($500 / $99)', cmd: 'show services and pricing' },
              { label: 'Book Project', cmd: 'book a project' },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setQueryText(chip.cmd);
                  handleExecuteQuery(chip.cmd);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer border ${
                  chip.label.includes('tour')
                    ? 'bg-[#c6f554]/15 hover:bg-[#c6f554]/25 text-[#c6f554] border-[#c6f554]/40 font-semibold'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-[#c6f554] border-white/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FLOATING COLLAPSED TRIGGER BADGE */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && !isSpeaking) {
            speak('Welcome to Genowl. I am YZER. How can I guide you today?');
          }
        }}
        id="voice-assistant-badge"
        className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl cursor-pointer ${
          isOpen
            ? 'bg-[#121c13] border-[#c6f554]/50 shadow-[0_0_20px_rgba(198,245,84,0.3)]'
            : 'bg-[#0a110c]/90 border-white/15 hover:border-[#c6f554]/50 hover:shadow-[0_0_20px_rgba(198,245,84,0.25)]'
        }`}
      >
        <div className="relative w-6 h-6 rounded-full bg-[#162318] border border-[#f7cc46]/50 flex items-center justify-center">
          <OwlLogo className="w-3.5 h-3.5 text-[#f7cc46]" />
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#c6f554] animate-ping" />
          )}
        </div>

        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
          Ask YZER
        </span>

        <div className="w-5 h-5 rounded-full bg-[#1b2b1d] border border-[#c6f554]/30 flex items-center justify-center text-[#c6f554]">
          {isSpeaking ? <Volume2 className="w-3 h-3 animate-pulse" /> : <Mic className="w-3 h-3" />}
        </div>
      </button>
    </div>
  );
}
