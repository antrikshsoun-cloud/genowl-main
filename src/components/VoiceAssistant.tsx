import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, ChevronRight, MessageSquare, Compass, ArrowRight } from 'lucide-react';
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
  const [transcript, setTranscript] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('Tap the mic or ask: "Show services", "How does it work?", or "Book a project".');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('Listening to your voice...');
        };

        recognition.onresult = (event: any) => {
          const speechText = event.results[0][0].transcript.toLowerCase();
          setTranscript(`"${speechText}"`);
          handleCommand(speechText);
        };

        recognition.onerror = (event: any) => {
          console.warn('[Voice Assistant] Error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setAssistantMessage('Microphone access denied. You can still tap the suggestion chips below!');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
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
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Text-To-Speech Output
  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // cancel any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best available English voice
    const voices = synthRef.current.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setAssistantMessage(text);
    synthRef.current.speak(utterance);
  };

  // Stop speaking & listening
  const stopAll = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsSpeaking(false);
    setIsListening(false);
  };

  // Process voice & tap commands
  const handleCommand = (cmd: string) => {
    const text = cmd.toLowerCase();

    // 1. Stop / Mute Command
    if (text.includes('stop') || text.includes('quiet') || text.includes('mute') || text.includes('shut up') || text.includes('silence')) {
      stopAll();
      setAssistantMessage('Silenced. Tap mic whenever you need me!');
      return;
    }

    // 2. Pricing & Services
    if (text.includes('service') || text.includes('pricing') || text.includes('cost') || text.includes('price') || text.includes('plan') || text.includes('package')) {
      onNavigate('services');
      speak(
        'Here are our services. We build high-converting 2D websites for $500, cinema-grade 3D WebGL for $2,500, and $99 packages for video and AI, all with 100% IP transfer.'
      );
      return;
    }

    // 3. 3D Website specific
    if (text.includes('3d')) {
      onNavigate('services');
      speak('Our 3D WebGL websites are $2,500 with custom shaders, 60 FPS physics, and scroll animations.');
      return;
    }

    // 4. 2D Website specific
    if (text.includes('2d')) {
      onNavigate('services');
      speak('Our 2D websites start at $500 with mobile optimization and 48 to 72-hour turnaround.');
      return;
    }

    // 5. Booking / Order Project
    if (text.includes('book') || text.includes('order') || text.includes('buy') || text.includes('start') || text.includes('hire')) {
      if (text.includes('3d')) {
        onOpenOrder('3D Website');
      } else {
        onOpenOrder('2D Website');
      }
      speak('Opening your project reservation desk. We confirm project slots with a 30-minute callback.');
      return;
    }

    // 6. About & Philosophy / How It Works
    if (text.includes('about') || text.includes('how it work') || text.includes('who are you') || text.includes('philosophy')) {
      onNavigate('about');
      speak(
        'Our philosophy is simple: you pick your service, tell us what to build, and our studio handles the rest in 48 to 72 hours.'
      );
      return;
    }

    // 7. Contact / Email / Report
    if (text.includes('contact') || text.includes('support') || text.includes('email') || text.includes('report') || text.includes('reach') || text.includes('phone')) {
      if (onOpenContact) onOpenContact();
      else onNavigate('contact');
      speak('Navigating to our direct studio desk. You can reach us at support@genowl.tech or message us here.');
      return;
    }

    // 8. Home
    if (text.includes('home') || text.includes('top') || text.includes('beginning')) {
      onNavigate('home');
      speak('Taking you back to the home page.');
      return;
    }

    // Default Fallback
    speak('I am here to help you navigate Genowl. Try saying: "Show services", "Tell me about pricing", or "Book a project".');
  };

  // Start Voice Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
    } else {
      stopAll();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  return (
    <div id="genowl-voice-assistant" className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* EXPANDED CONTROL DIALOG */}
      {isOpen && (
        <div className="mb-3 w-[320px] sm:w-[360px] p-4 rounded-3xl bg-[#0c130e]/95 border border-[#c6f554]/30 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#141f16] border border-[#f7cc46]/50 flex items-center justify-center shadow-[0_0_10px_rgba(247,204,70,0.3)]">
                <OwlLogo className="w-4 h-4 text-[#f7cc46]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Genowl AI Voice Guide</h4>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-400 animate-ping' : isSpeaking ? 'bg-[#c6f554] animate-pulse' : 'bg-[#c6f554]'}`} />
                  <span>{isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready for commands'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopAll}
                  title="Silence audio"
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

          {/* Transcript / Subtitle Box */}
          <div className="p-3 rounded-2xl bg-[#121c13] border border-white/[0.08] min-h-[64px] flex flex-col justify-center">
            {transcript && (
              <div className="text-[11px] font-mono text-[#c6f554] mb-1 truncate">
                You: {transcript}
              </div>
            )}
            <p className="text-xs text-zinc-200 leading-relaxed">
              {assistantMessage}
            </p>
          </div>

          {/* Equalizer Sound Wave Animation when speaking/listening */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center justify-center gap-1 py-1">
              {[40, 70, 100, 60, 90, 50, 80, 45].map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-[#c6f554] animate-pulse"
                  style={{
                    height: `${isListening || isSpeaking ? h * 0.22 : 4}px`,
                    animationDuration: `${0.4 + i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Mic Action Bar */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={toggleListening}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-gradient-to-r from-[#baf345] to-[#d6fa66] text-black shadow-[0_0_15px_rgba(198,245,84,0.3)] hover:brightness-105'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? 'Stop Listening' : 'Tap to Speak'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleCommand('pricing')}
              className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white font-medium transition-all cursor-pointer"
            >
              Services
            </button>
          </div>

          {/* Quick Command Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-zinc-400">Quick:</span>
            {[
              { label: 'Pricing ($500 / $99)', cmd: 'show services and pricing' },
              { label: 'How it works', cmd: 'how does it work' },
              { label: 'Book Project', cmd: 'book a project' },
              { label: 'Contact', cmd: 'contact support' },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setTranscript(`"${chip.cmd}"`);
                  handleCommand(chip.cmd);
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
