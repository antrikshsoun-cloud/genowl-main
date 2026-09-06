import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Send, Sparkles, Compass, HelpCircle, CheckCircle2 } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';

interface VoiceAssistantProps {
  onNavigate: (page: string) => void;
  onOpenOrder: (serviceName?: string) => void;
  onOpenContact?: () => void;
}

export default function VoiceAssistant({ onNavigate, onOpenOrder, onOpenContact }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [assistantMessage, setAssistantMessage] = useState(
    'Ask me anything about Genowl services, pricing, timeline, or say "Book a project"!'
  );
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef<any>(null);
  const restartTimerRef = useRef<any>(null);

  // Cache available voices
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

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

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
          setAssistantMessage('Listening... Speak your question now.');
        };

        recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            fullTranscript += event.results[i][0].transcript;
          }

          const liveText = fullTranscript.trim();
          if (liveText) {
            // Live type into input bar in real time
            setQueryText(liveText);

            // Auto-execute after 1.2s pause
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              if (liveText) {
                handleExecuteQuery(liveText);
                stopListening();
              }
            }, 1200);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[Voice Assistant] Speech recognition event:', event.error);
          if (event.error === 'no-speech') {
            // Normal pause in speaking, do not cancel
            return;
          }
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            isListeningRef.current = false;
            setIsListening(false);
            setAssistantMessage('Microphone access is blocked in your browser. Please click the lock icon in your address bar and Allow Microphone, or type below!');
            return;
          }
        };

        recognition.onend = () => {
          // Asynchronous restart with 250ms tick to keep listening alive cleanly on both PC & Mobile
          if (isListeningRef.current) {
            if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
            restartTimerRef.current = setTimeout(() => {
              if (isListeningRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (err) {
                  // Silently ignore if already active
                }
              }
            }, 250);
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }

    return () => {
      isListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Text-To-Speech with Crisp Natural Voice & Professional Speed
  const speak = (text: string) => {
    setAssistantMessage(text);

    if (!synthRef.current) return;
    try {
      synthRef.current.cancel(); // Cancel any existing audio immediately

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.15; // Crisp, energetic, professional pace
      utterance.pitch = 1.0;

      // Select natural studio voice
      const voices = voicesRef.current.length > 0 ? voicesRef.current : synthRef.current.getVoices();
      
      const naturalVoice =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online'))) ||
        voices.find((v) => v.name.includes('Google US English') || v.name.includes('Google UK English Female')) ||
        voices.find((v) => v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Serena')) ||
        voices.find((v) => v.lang.startsWith('en') && !v.name.includes('Desktop')) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const stopAll = () => {
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (synthRef.current) synthRef.current.cancel();
    stopListening();
    setIsSpeaking(false);
  };

  // Start continuous listening with zero hardware stream conflict
  const startListening = async () => {
    stopAll(); // Silence TTS before starting mic

    // Request permissions if needed, but immediately stop stream so SpeechRecognition gets exclusive hardware access!
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err: any) {
      console.warn('[Voice Assistant] Permission check:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setAssistantMessage('Microphone access is blocked in your browser. Click the lock icon in your address bar to Allow Microphone!');
        setIsListening(false);
        isListeningRef.current = false;
        return;
      }
    }

    if (!recognitionRef.current) return;

    try {
      isListeningRef.current = true;
      setIsListening(true);
      setAssistantMessage('Listening... Speak clearly now.');
      recognitionRef.current.start();
    } catch (e: any) {
      console.warn('[Voice Assistant] Recognition start:', e?.message);
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
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
      text.includes('pause')
    ) {
      stopAll();
      setAssistantMessage('Silenced. Feel free to type or tap the mic anytime.');
      return;
    }

    // 2. Greetings (Hello, Hi, Hey, Good Morning, Namaste)
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
        'Hello! Welcome to Genowl. How can I assist you with our services, pricing, or booking today?'
      );
      return;
    }

    // 3. ABOUT GENOWL (Exact Core Studio Statement requested)
    if (
      text.includes('about') ||
      text.includes('what is genowl') ||
      text.includes('who is genowl') ||
      text.includes('tell me about genowl') ||
      text.includes('what do you do') ||
      text.includes('what does genowl do') ||
      text.includes('who are you') ||
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

    // 4. Booking, Ordering & Slot Reservation
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

    // 5. 3D WebGL / Interactive Specific
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

    // 6. 2D Websites / Landing Pages Specific
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

    // 7. AI & Video Generation / Commercials / Advertisements
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

    // 8. General Pricing & Rates
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

    // 9. All Services Overview
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

    // 10. Turnaround / Delivery Timeline / Delivery Speed
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

    // 11. Refund, Revisions & Guarantee Policy
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
      speak(
        'We provide a 100% money-back refund guarantee before milestone development begins, plus unlimited revisions during the initial wireframing and design phase.'
      );
      return;
    }

    // 12. Contact, Support, Email & Socials
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

    // 13. Mobile Responsiveness / Cross-device
    if (
      text.includes('mobile') ||
      text.includes('phone') ||
      text.includes('responsive') ||
      text.includes('tablet') ||
      text.includes('cross platform')
    ) {
      speak(
        'Yes, every digital product we create is 100% responsive and optimized for fluid 60 frames per second performance on phones, tablets, and desktops.'
      );
      return;
    }

    // 14. Technology Stack / Code Quality
    if (
      text.includes('tech') ||
      text.includes('technology') ||
      text.includes('framework') ||
      text.includes('code') ||
      text.includes('language') ||
      text.includes('stack')
    ) {
      speak(
        'We build using React, TypeScript, Tailwind CSS, Vite, and Three.js WebGL shaders to ensure maximum performance and clean architecture.'
      );
      return;
    }

    // 15. Portfolio, Examples & Past Work
    if (
      text.includes('portfolio') ||
      text.includes('example') ||
      text.includes('sample') ||
      text.includes('demo') ||
      text.includes('work') ||
      text.includes('past projects')
    ) {
      onNavigate('home');
      speak(
        'The Genowl website you are currently viewing is an interactive demonstration of our 3D scroll architecture and modern design capabilities.'
      );
      return;
    }

    // 16. Navigation Shortcuts
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

    // 17. OUT-OF-SCOPE GUARDRAIL
    speak(
      'I am Genowl’s AI guide, trained on our web services, 3D interactive engineering, video generation, and project booking. How can our team build for you today?'
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
                  Genowl AI Voice Guide
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#c6f554]/20 text-[#c6f554] font-mono">Neural</span>
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isListening ? 'bg-red-400 animate-ping' : isSpeaking ? 'bg-[#c6f554] animate-pulse' : 'bg-[#c6f554]'
                    }`}
                  />
                  <span>
                    {isListening ? 'Listening (speak now)...' : isSpeaking ? 'Speaking...' : 'Ready for voice or text'}
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

          {/* ACTIVE MIC STATUS BAR (Universal for Mobile and PC) */}
          {isListening && (
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                <Mic className="w-3 h-3 text-red-400 animate-pulse" />
                <span>Mic Status:</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#c6f554] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                <span>Listening actively...</span>
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
                placeholder={isListening ? 'Listening to your voice...' : 'Speak or type any question...'}
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
              title={isListening ? 'Stop listening' : 'Start speaking'}
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
              title="Submit command"
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#baf345] to-[#d6fa66] text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition-all cursor-pointer shadow-[0_0_12px_rgba(198,245,84,0.25)] flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Instant Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-zinc-400">Quick:</span>
            {[
              { label: 'About Genowl', cmd: 'tell me about genowl' },
              { label: 'Pricing ($500 / $99)', cmd: 'show services and pricing' },
              { label: '3D WebGL ($2,500)', cmd: 'tell me about 3D WebGL website' },
              { label: 'Book Project', cmd: 'book a project' },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setQueryText(chip.cmd);
                  handleExecuteQuery(chip.cmd);
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-medium bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-[#c6f554] border border-white/10 transition-all cursor-pointer"
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
            speak('Welcome to Genowl. How can I guide you today?');
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
          AI Voice Guide
        </span>

        <div className="w-5 h-5 rounded-full bg-[#1b2b1d] border border-[#c6f554]/30 flex items-center justify-center text-[#c6f554]">
          {isSpeaking ? <Volume2 className="w-3 h-3 animate-pulse" /> : <Mic className="w-3 h-3" />}
        </div>
      </button>
    </div>
  );
}
