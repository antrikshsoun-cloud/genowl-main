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

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Stay active while user is speaking
        recognition.interimResults = true; // Stream words in real time
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const liveText = finalTranscript || interimTranscript;
          if (liveText.trim()) {
            // Live type into the bar in real time!
            setQueryText(liveText.trim());

            // Reset silence timer to auto-execute after user finishes utterance
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              if (liveText.trim()) {
                handleExecuteQuery(liveText.trim());
                stopListening();
              }
            }, 1400); // 1.4s pause triggers automatic execution
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[Voice Assistant] Speech error:', event.error);
          if (event.error === 'no-speech') {
            // Normal silence pause on PC: do NOT kill listening session!
            return;
          }
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            isListeningRef.current = false;
            setIsListening(false);
            setAssistantMessage('Microphone access is blocked in your browser. Please click the lock icon in your address bar and Allow Microphone, or type below!');
            return;
          }
          // For transient network/audio-capture glitches, let onend handle graceful restart
        };

        recognition.onend = () => {
          // Robust PC Chrome keepalive: DO NOT call recognition.start() synchronously inside onend
          // Calling synchronously in onend throws InvalidStateError on Desktop Chrome!
          if (isListeningRef.current) {
            if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
            restartTimerRef.current = setTimeout(() => {
              if (isListeningRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (err) {
                  // Silently ignore if already starting or active
                }
              }
            }, 250); // 250ms tick allows browser audio thread to reset cleanly
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }

      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
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

  // Text-To-Speech
  const speak = (text: string) => {
    setAssistantMessage(text);

    if (!synthRef.current) return;
    try {
      synthRef.current.cancel(); // Stop any previous speech immediately
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = synthRef.current.getVoices();
      const naturalVoice =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))) ||
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

  // Stop everything
  const stopAll = () => {
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (synthRef.current) synthRef.current.cancel();
    stopListening();
    setIsSpeaking(false);
  };

  // Start continuous listening (with explicit PC microphone permission check)
  const startListening = async () => {
    stopAll(); // Silence TTS before starting mic so there is zero audio feedback

    // Request PC microphone stream explicitly to unlock Windows/Chrome audio capture
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release stream tracks immediately so WebSpeechRecognition has exclusive audio hardware access
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err: any) {
      console.warn('[Voice Assistant] PC Mic access check:', err);
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
      setAssistantMessage('Listening on PC mic... Speak your question or say "Hello"!');
      recognitionRef.current.start();
    } catch (e: any) {
      // If recognition is already running, avoid throwing
      console.warn('[Voice Assistant] Start notice:', e?.message);
    }
  };

  // Stop listening
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

  // Core Genowl Knowledge Base & Intent Classifier
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

    // 2. Greetings (Hello / Hi / Hey / Good Morning)
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
      text.includes('good evening')
    ) {
      speak(
        'Hello! Welcome to Genowl. I am your AI assistant. I can explain our 2D websites ($500), 3D interactive WebGL experiences ($2,500), AI video production ($99), or book a project consultation for you. What would you like to build?'
      );
      return;
    }

    // 3. Who are you / Assistant Identity
    if (
      text.includes('who are you') ||
      text.includes('what are you') ||
      text.includes('what is your name') ||
      text.includes('what can you do') ||
      text.includes('help me')
    ) {
      speak(
        'I am the Genowl AI Guide. You can speak to me or type to navigate sections, learn about our 2D and 3D WebGL services, get exact pricing, or reserve a direct consultation slot.'
      );
      return;
    }

    // 4. Booking / Ordering / Hire Studio
    if (
      text.includes('book') ||
      text.includes('order') ||
      text.includes('buy') ||
      text.includes('hire') ||
      text.includes('start project') ||
      text.includes('reserve') ||
      text.includes('consultation')
    ) {
      let chosenService = '2D Website';
      if (text.includes('3d') || text.includes('webgl') || text.includes('interactive')) {
        chosenService = '3D Website';
      } else if (text.includes('ai') || text.includes('video')) {
        chosenService = 'AI Video & Prompts';
      }
      onOpenOrder(chosenService);
      speak(`Opening the project reservation desk for ${chosenService}. We will confirm your slot and scope with a 30-minute consultation.`);
      return;
    }

    // 5. Pricing Specific Inquiries
    if (
      text.includes('price') ||
      text.includes('pricing') ||
      text.includes('cost') ||
      text.includes('fee') ||
      text.includes('package') ||
      text.includes('rate') ||
      text.includes('how much')
    ) {
      onNavigate('services');
      if (text.includes('2d')) {
        speak('Our 2D Websites start at $500 with mobile responsiveness, SEO, and a 3 to 5 day delivery timeline.');
      } else if (text.includes('3d') || text.includes('webgl')) {
        speak('Our 3D Interactive WebGL websites start at $2,500, featuring 60 frames per second physics, custom shaders, and interactive scroll dynamics.');
      } else if (text.includes('ai') || text.includes('video')) {
        speak('Our AI and Video Production package is just $99, providing custom 4K renders and commercial video assets.');
      } else {
        speak(
          'Genowl offers transparent pricing: $500 for high-converting 2D Websites, $2,500 for Cinema-grade 3D WebGL, and $99 for AI Video generation. All packages come with 100% intellectual property transfer.'
        );
      }
      return;
    }

    // 6. Services Overview
    if (
      text.includes('service') ||
      text.includes('what do you do') ||
      text.includes('what can you build') ||
      text.includes('features') ||
      text.includes('portfolio') ||
      text.includes('offer')
    ) {
      onNavigate('services');
      speak(
        'We craft high-performance digital experiences: 2D modern responsive websites, interactive 3D WebGL experiences, and tailored AI video production. Scrolling to our services now.'
      );
      return;
    }

    // 7. 3D WebGL Specific
    if (text.includes('3d') || text.includes('three.js') || text.includes('webgl') || text.includes('shader')) {
      onNavigate('services');
      speak(
        'Our 3D WebGL experiences feature silky-smooth 60 frames per second animations, custom canvas shaders, and interactive models starting at $2,500.'
      );
      return;
    }

    // 8. 2D Website Specific
    if (text.includes('2d') || text.includes('landing page') || text.includes('react')) {
      onNavigate('services');
      speak(
        'Our 2D websites start at $500. They are built with React and Tailwind, load instantly, and have a 3 to 5-day turnaround.'
      );
      return;
    }

    // 9. About Genowl / Philosophy / Studio Details
    if (
      text.includes('about') ||
      text.includes('who is genowl') ||
      text.includes('philosophy') ||
      text.includes('how it works') ||
      text.includes('location') ||
      text.includes('where are you')
    ) {
      onNavigate('about');
      speak(
        'Genowl is a modern creative engineering studio founded in New Delhi, India. Our philosophy is simple: zero template bloat, cinema-grade visuals, and 100% full intellectual property transfer to our clients.'
      );
      return;
    }

    // 10. Contact & Social Channels
    if (
      text.includes('contact') ||
      text.includes('email') ||
      text.includes('support') ||
      text.includes('phone') ||
      text.includes('reach') ||
      text.includes('twitter') ||
      text.includes('instagram') ||
      text.includes('x.com') ||
      text.includes('message')
    ) {
      if (onOpenContact) onOpenContact();
      else onNavigate('contact');
      speak(
        'You can reach our studio directly at support@genowl.tech, or on official X at GENOWL_TECH. Scrolling to the contact desk.'
      );
      return;
    }

    // 11. Timeline / Delivery Speed
    if (text.includes('time') || text.includes('how long') || text.includes('delivery') || text.includes('turnaround') || text.includes('days')) {
      speak(
        'Our turnaround is ultra-fast: 3 to 5 days for 2D Websites, 7 to 14 days for 3D WebGL projects, and 24 to 48 hours for AI video deliverables.'
      );
      return;
    }

    // 12. Refund & Guarantee Policy
    if (text.includes('refund') || text.includes('guarantee') || text.includes('money back') || text.includes('cancel')) {
      speak(
        'We offer a 100% money-back refund guarantee before milestone production begins, plus unlimited revisions during the initial wireframe phase.'
      );
      return;
    }

    // 13. Navigation: Go to Top / Home
    if (text.includes('home') || text.includes('top') || text.includes('header') || text.includes('start over')) {
      onNavigate('home');
      speak('Navigating back to the top home section.');
      return;
    }

    // 14. Navigation: Go to Services
    if (text.includes('show services') || text.includes('go to services') || text.includes('scroll to services')) {
      onNavigate('services');
      speak('Here is our full services catalogue.');
      return;
    }

    // 15. Navigation: Go to About
    if (text.includes('go to about') || text.includes('show about') || text.includes('scroll to about')) {
      onNavigate('about');
      speak('Here is the Genowl studio story and our core philosophy.');
      return;
    }

    // 16. Navigation: Go to Contact
    if (text.includes('go to contact') || text.includes('show contact') || text.includes('scroll to contact')) {
      if (onOpenContact) onOpenContact();
      else onNavigate('contact');
      speak('Here is the direct contact and project inquiry desk.');
      return;
    }

    // 17. OUT-OF-SCOPE GUARDRAIL (Strictly website-focused)
    speak(
      'I am Genowl’s AI guide, trained exclusively on our web engineering services, 3D interactive design, pricing ($500 2D / $2,500 3D / $99 AI), and project bookings. Would you like to check our pricing, book a consultation, or explore our services?'
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
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#c6f554]/20 text-[#c6f554] font-mono">2.0</span>
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

          {/* Equalizer Sound Wave Animation */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center justify-center gap-1 py-1">
              {[35, 65, 95, 55, 85, 45, 75, 40].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full ${isListening ? 'bg-red-400' : 'bg-[#c6f554]'} animate-pulse`}
                  style={{
                    height: `${isListening || isSpeaking ? h * 0.22 : 4}px`,
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
                placeholder={isListening ? 'Listening on PC mic... Speak now' : 'Speak or type a question...'}
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
              title={isListening ? 'Stop listening' : 'Start speaking on PC mic'}
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
              { label: 'Say "Hello"', cmd: 'hello' },
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
