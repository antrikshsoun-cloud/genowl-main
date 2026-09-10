import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Sparkles, X, ShieldCheck } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import OwlLogo from './OwlLogo.tsx';

const VAPI_PUBLIC_KEY = '985f0bb7-f6a5-4c59-95cb-eb346e331609';
const VAPI_ASSISTANT_ID = '9facf4ab-efc8-45f4-a270-50713b8d4592';

interface VapiVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VapiVoiceCallModal({ isOpen, onClose }: VapiVoiceCallModalProps) {
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const vapiRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Vapi client once
  useEffect(() => {
    try {
      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setCallStatus('connected');
        setErrorMessage(null);
        setCallDuration(0);
        timerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      });

      vapi.on('call-end', () => {
        setCallStatus('ended');
        setIsSpeaking(false);
        setVolumeLevel(0);
        if (timerRef.current) clearInterval(timerRef.current);
      });

      vapi.on('speech-start', () => {
        setIsSpeaking(true);
      });

      vapi.on('speech-end', () => {
        setIsSpeaking(false);
      });

      vapi.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });

      vapi.on('error', (err: any) => {
        console.error('Vapi live call error:', err);
        setErrorMessage(err?.message || 'Connection error. Please check your mic permissions.');
        setCallStatus('ended');
        if (timerRef.current) clearInterval(timerRef.current);
      });
    } catch (err: any) {
      console.error('Failed to initialize Vapi:', err);
      setErrorMessage('Could not initialize audio client.');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Automatically start call when modal opens
  useEffect(() => {
    if (isOpen && vapiRef.current && callStatus === 'idle') {
      startCall();
    }
    if (!isOpen && callStatus === 'connected') {
      endCall();
    }
  }, [isOpen]);

  const startCall = async () => {
    if (!vapiRef.current) return;
    setCallStatus('connecting');
    setErrorMessage(null);
    try {
      await vapiRef.current.start(VAPI_ASSISTANT_ID);
    } catch (err: any) {
      console.error('Start call error:', err);
      setErrorMessage(err?.message || 'Could not access microphone.');
      setCallStatus('ended');
    }
  };

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
      } catch {}
    }
    setCallStatus('ended');
    setIsSpeaking(false);
    setVolumeLevel(0);
  };

  const toggleMute = () => {
    if (!vapiRef.current || callStatus !== 'connected') return;
    const nextMute = !isMuted;
    try {
      vapiRef.current.setMuted(nextMute);
      setIsMuted(nextMute);
    } catch (err) {
      console.error('Mute error:', err);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Call Chassis Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0f1a11] via-[#09110a] to-[#040805] border border-[#c6f554]/40 shadow-[0_0_60px_rgba(198,245,84,0.25)] p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden z-10"
        >
          {/* Ambient top light */}
          <div className="absolute top-0 inset-x-0 h-32 bg-radial from-[#c6f554]/15 via-transparent to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              endCall();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Assistant Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162618] border border-[#c6f554]/40 text-[#c6f554] text-xs font-mono font-semibold mb-6 shadow-[0_0_15px_rgba(198,245,84,0.2)]">
            <OwlLogo className="w-3.5 h-3.5 text-[#f7cc46]" />
            <span>GENOWL AI VOICE HOTLINE</span>
          </div>

          {/* Assistant Title & Status */}
          <h2 className="text-2xl font-black text-white tracking-tight">
            YZER <span className="text-[#c6f554] font-serif-italic font-normal">(Wiser)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Executive AI Creative Director &bull; Genowl Studio
          </p>

          {/* Call Status Indicator */}
          <div className="mt-4 mb-8">
            {callStatus === 'connecting' && (
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#f7cc46]">
                <span className="w-2 h-2 rounded-full bg-[#f7cc46] animate-ping" />
                <span>Connecting live audio stream...</span>
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#c6f554]">
                  <span className="w-2 h-2 rounded-full bg-[#c6f554] animate-pulse" />
                  <span>
                    {isSpeaking ? 'YZER is speaking...' : isMuted ? 'Your mic is muted' : 'YZER is listening to you'}
                  </span>
                </div>
                <div className="font-mono text-sm text-zinc-300 font-bold tracking-wider">
                  {formatTimer(callDuration)}
                </div>
              </div>
            )}

            {callStatus === 'ended' && (
              <div className="text-xs text-zinc-400">
                {errorMessage ? (
                  <span className="text-red-400">{errorMessage}</span>
                ) : (
                  <span>Call finished. Tap below to reconnect anytime.</span>
                )}
              </div>
            )}
          </div>

          {/* Animated Audio Wave Visualizer */}
          <div className="relative w-44 h-44 rounded-full flex items-center justify-center mb-8">
            {/* Outer pulsating aura rings based on real volume */}
            <motion.div
              animate={{
                scale: callStatus === 'connected' ? 1 + volumeLevel * 1.6 : 1,
                opacity: callStatus === 'connected' ? 0.3 + volumeLevel * 0.7 : 0.1,
              }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c6f554]/30 via-[#f7cc46]/20 to-[#c6f554]/30 blur-xl"
            />

            {/* Inner Core Disc */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-b from-[#192b1b] to-[#0a140b] border-2 border-[#c6f554]/60 flex items-center justify-center shadow-[0_0_30px_rgba(198,245,84,0.35)]">
              {callStatus === 'connected' ? (
                <div className="flex items-center gap-1">
                  {[40, 70, 100, 70, 40].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        height: isSpeaking ? [8, h * 0.45, 8] : [6, 12, 6],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: isSpeaking ? 0.45 : 1.2,
                        delay: i * 0.08,
                      }}
                      className="w-1 rounded-full bg-[#c6f554]"
                      style={{ height: 12 }}
                    />
                  ))}
                </div>
              ) : (
                <OwlLogo className="w-12 h-12 text-[#f7cc46]" />
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-5 w-full justify-center">
            {callStatus === 'connected' ? (
              <>
                {/* Mute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-4 rounded-full border transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                {/* Big Red End Call Button */}
                <button
                  type="button"
                  onClick={endCall}
                  className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PhoneOff className="w-5 h-5 fill-current" />
                  <span>End Call</span>
                </button>
              </>
            ) : (
              /* Reconnect / Start Call Button */
              <button
                type="button"
                onClick={startCall}
                className="px-8 py-3.5 rounded-full font-bold text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_25px_rgba(198,245,84,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-black" />
                <span>{callStatus === 'connecting' ? 'Connecting...' : 'Start Voice Call'}</span>
              </button>
            )}
          </div>

          {/* Bottom Security / 100% Free info note */}
          <div className="mt-6 text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c6f554]" />
            <span>Direct WebRTC stream &bull; 100% Free browser voice call</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
