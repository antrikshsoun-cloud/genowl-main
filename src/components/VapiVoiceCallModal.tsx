import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Sparkles, X, ShieldCheck, CheckCircle2, Calendar, Mail, User, ArrowRight, RefreshCw } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import OwlLogo from './OwlLogo.tsx';
import { UserProfile } from './AuthModal.tsx';
import { OFFICIAL_PHONE_DISPLAY, OFFICIAL_PHONE_TEL, sendSlotBookingEmail } from '../services/emailService.ts';
import { submitProjectLeadToHostinger, submitBookingToHostinger, extractKeywordsFromText } from '../services/hostingerDbService.ts';
import { syncOrderToSupabase } from '../services/supabaseClient.ts';

const VAPI_PUBLIC_KEY = '985f0bb7-f6a5-4c59-95cb-eb346e331609';
const VAPI_ASSISTANT_ID = '9facf4ab-efc8-45f4-a270-50713b8d4592';

interface VapiVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onOpenOrder?: (service?: string) => void;
}

// Helper to parse emails even if spoken verbally (e.g., "antriksh at gmail dot com")
function parseSpokenEmail(text: string): string | null {
  if (!text) return null;
  // 1. Direct standard email match
  const directMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  if (directMatch) return directMatch[0].toLowerCase();

  // 2. Spoken format: "username at domain dot com" or "first dot last at gmail dot com"
  const spokenMatch = text.match(/([a-zA-Z0-9._%+-]+)\s*(?:at|@)\s*([a-zA-Z0-9.-]+)\s*(?:dot|\.)\s*([a-zA-Z]{2,})/i);
  if (spokenMatch) {
    const user = spokenMatch[1].replace(/\s*dot\s*/gi, '.').replace(/\s+/g, '');
    const domain = spokenMatch[2].replace(/\s+/g, '');
    const tld = spokenMatch[3].replace(/\s+/g, '');
    return `${user}@${domain}.${tld}`.toLowerCase();
  }
  return null;
}

// Helper to parse phone numbers from spoken stream
function parseSpokenPhone(text: string): string | null {
  if (!text) return null;
  const match = text.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/);
  if (match && match[0].replace(/\D/g, '').length >= 7) {
    return match[0].trim();
  }
  return null;
}

// Helper to parse service requested
function parseSpokenService(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('3d') || lower.includes('webgl') || lower.includes('interactive')) return '3D WebGL Experience ($2,500)';
  if (lower.includes('video') || lower.includes('commercial') || lower.includes('ad')) return 'AI Video Commercial ($99)';
  if (lower.includes('agent') || lower.includes('yzer') || lower.includes('voice')) return 'Autonomous AI Agent ($200)';
  if (lower.includes('content') || lower.includes('copy')) return 'Content Creation ($99)';
  if (lower.includes('2d') || lower.includes('website') || lower.includes('saas')) return '2D High-Converting Web ($500)';
  return 'General Consultation ($99)';
}

// Helper to parse meeting or slot intent
function parseSpokenMeetingSlot(text: string): string | null {
  const lower = text.toLowerCase();
  if (
    lower.includes('meeting') ||
    lower.includes('slot') ||
    lower.includes('schedule') ||
    lower.includes('tomorrow') ||
    lower.includes('monday') ||
    lower.includes('tuesday') ||
    lower.includes('wednesday') ||
    lower.includes('thursday') ||
    lower.includes('friday') ||
    lower.includes('saturday') ||
    lower.includes('sunday') ||
    lower.includes('am') ||
    lower.includes('pm') ||
    lower.includes("o'clock")
  ) {
    return text.trim();
  }
  return null;
}

export default function VapiVoiceCallModal({
  isOpen,
  onClose,
  currentUser,
  onOpenOrder,
}: VapiVoiceCallModalProps) {
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extracted intelligence from the live conversation
  const [detectedEmail, setDetectedEmail] = useState(currentUser?.email || '');
  const [detectedPhone, setDetectedPhone] = useState('');
  const [detectedName, setDetectedName] = useState(currentUser?.name || '');
  const [detectedService, setDetectedService] = useState('2D High-Converting Web ($500)');
  const [detectedMeetingSlot, setDetectedMeetingSlot] = useState('');
  
  // Database submission state
  const [isSavedToDb, setIsSavedToDb] = useState(false);
  const [dbReceiptId, setDbReceiptId] = useState('');
  const [isManualSaving, setIsManualSaving] = useState(false);

  const vapiRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const fullTranscriptRef = useRef<string>('');
  const callSummaryRef = useRef<string>('');
  const hasSavedRef = useRef<boolean>(false);

  // Keep state updated if currentUser logs in
  useEffect(() => {
    if (currentUser) {
      if (!detectedEmail) setDetectedEmail(currentUser.email);
      if (!detectedName) setDetectedName(currentUser.name);
    }
  }, [currentUser]);

  // Master function: Persists the call transcript, extracted email/phone, and booking slot to Hostinger MySQL
  const persistCallToHostinger = async (overrideData?: {
    email?: string;
    phone?: string;
    name?: string;
    service?: string;
    meetingSlot?: string;
  }) => {
    if (hasSavedRef.current && !overrideData) return;
    hasSavedRef.current = true;

    const emailToSave = (overrideData?.email ?? detectedEmail).trim();
    const phoneToSave = (overrideData?.phone ?? detectedPhone).trim();
    const nameToSave = (overrideData?.name ?? detectedName).trim() || (emailToSave ? emailToSave.split('@')[0] : 'Voice Caller');
    const serviceToSave = overrideData?.service ?? detectedService;
    const slotToSave = (overrideData?.meetingSlot ?? detectedMeetingSlot).trim() || 'Immediate Call Follow-Up';
    const transcriptToSave = fullTranscriptRef.current.trim();
    const summaryToSave = callSummaryRef.current.trim();

    // If caller spoke nothing and provided no details, skip
    if (!transcriptToSave && !emailToSave && !phoneToSave) {
      return;
    }

    const ticketId = dbReceiptId || `GENOWL-VOICE-${Math.floor(100000 + Math.random() * 900000)}`;
    setDbReceiptId(ticketId);

    const projectScope = summaryToSave
      ? `YZER Voice Call Summary: ${summaryToSave}\n\nFull Call Transcript:\n${transcriptToSave}`
      : `YZER In-Browser Voice Call Transcript:\n${transcriptToSave || 'Client consulted live with YZER AI Assistant.'}`;

    const keywords = extractKeywordsFromText(`${serviceToSave} ${projectScope}`);

    try {
      // 1. Primary Sync: Hostinger MySQL genowl_project_leads
      const leadResult = await submitProjectLeadToHostinger({
        receipt_id: ticketId,
        customer_name: nameToSave,
        customer_email: emailToSave,
        customer_phone: phoneToSave || 'Captured via WebRTC Voice Call',
        service_type: serviceToSave,
        turnaround_speed: 'standard',
        quoted_price: serviceToSave.includes('2,500') ? '$2,500' : (serviceToSave.includes('200') ? '$200' : '$500'),
        payment_status: 'pending',
        meeting_time_slot: slotToSave,
        meeting_platform: 'WebRTC AI Voice Call / Google Meet',
        project_scope: projectScope,
        extracted_keywords: keywords,
        voice_transcript: transcriptToSave,
        lead_source: 'YZER AI In-Browser Voice Call',
        project_metadata: {
          call_duration_seconds: callDuration,
          has_spoken_email: !!emailToSave,
          has_spoken_phone: !!phoneToSave,
          submitted_at: new Date().toISOString(),
        },
      });

      // 2. Legacy Redundancy: Hostinger bookings table
      submitBookingToHostinger({
        name: nameToSave,
        email: emailToSave || `voice_call_${ticketId.toLowerCase()}@client.genowl.tech`,
        service_type: serviceToSave,
        budget: '$500',
        preferred_time: slotToSave,
        project_scope: projectScope,
      }).catch(() => {});

      // 3. Local Client Hub Store so visitor sees it in their Profile Hub
      try {
        const rawExisting = localStorage.getItem('genowl_client_orders');
        const orders = rawExisting ? JSON.parse(rawExisting) : [];
        const newOrder = {
          id: ticketId,
          service: serviceToSave,
          name: nameToSave,
          email: emailToSave || 'Voice Call Lead',
          phone: phoneToSave,
          details: projectScope,
          preferredTime: slotToSave,
          speed: 'standard',
          amount: serviceToSave.includes('2,500') ? '$2,500' : '$500',
          status: 'pending_slot_call',
          createdAt: new Date().toISOString(),
        };
        orders.unshift(newOrder);
        localStorage.setItem('genowl_client_orders', JSON.stringify(orders));
        window.dispatchEvent(new Event('storage'));

        // Supabase Cloud Sync
        syncOrderToSupabase(newOrder).catch(() => {});
      } catch (storageErr) {
        console.warn('Local client orders note:', storageErr);
      }

      // 4. Email notification to client & founders if email was provided
      if (emailToSave && emailToSave.includes('@') && !emailToSave.includes('@client.genowl.tech')) {
        sendSlotBookingEmail(
          nameToSave,
          emailToSave,
          phoneToSave || '+1 628 245 9578 (Voice Call)',
          serviceToSave,
          '$500',
          `Voice Consultation with YZER AI. Slot: ${slotToSave}\n\n${projectScope}`,
          'standard',
          ticketId,
          'https://genowl.tech',
          slotToSave,
          'YZER Voice Consultation'
        ).catch(() => {});
      }

      setIsSavedToDb(true);
    } catch (err: any) {
      console.warn('Could not complete automated lead sync:', err);
    }
  };

  // Initialize Vapi client once
  useEffect(() => {
    try {
      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setCallStatus('connected');
        setErrorMessage(null);
        setCallDuration(0);
        hasSavedRef.current = false;
        fullTranscriptRef.current = '';
        callSummaryRef.current = '';
        setIsSavedToDb(false);

        timerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      });

      // Stream live speech transcripts and events
      vapi.on('message', (message: any) => {
        if (!message) return;

        // A. Real-Time Transcript capture
        if (message.type === 'transcript') {
          const role = message.role === 'user' ? 'Client' : 'YZER';
          const text = (message.transcript || '').trim();

          if (text) {
            if (message.transcriptType === 'final') {
              fullTranscriptRef.current += `\n[${role}]: ${text}`;

              // If the user spoke, automatically detect email, phone, slot, service
              if (message.role === 'user') {
                const foundEmail = parseSpokenEmail(text);
                if (foundEmail) {
                  setDetectedEmail(foundEmail);
                }
                const foundPhone = parseSpokenPhone(text);
                if (foundPhone) {
                  setDetectedPhone(foundPhone);
                }
                const foundSlot = parseSpokenMeetingSlot(text);
                if (foundSlot) {
                  setDetectedMeetingSlot(foundSlot);
                }
                const foundSrv = parseSpokenService(text);
                if (foundSrv) {
                  setDetectedService(foundSrv);
                }
              }
            }
          }
        }

        // B. Function/Tool Call capture from Vapi
        if (message.type === 'function-call' || message.type === 'tool-calls') {
          const args = message.functionCall?.parameters || message.toolCalls?.[0]?.function?.arguments;
          if (args) {
            if (typeof args === 'object') {
              if (args.email) setDetectedEmail(args.email);
              if (args.phone) setDetectedPhone(args.phone);
              if (args.name) setDetectedName(args.name);
              if (args.meeting_date || args.slot || args.time) {
                setDetectedMeetingSlot(`${args.meeting_date || ''} ${args.slot || args.time || ''}`.trim());
              }
            }
          }
        }

        // C. End of Call Report (Includes complete server-side transcript & AI summary)
        if (message.type === 'end-of-call-report') {
          if (message.transcript) {
            fullTranscriptRef.current = message.transcript;
          }
          if (message.summary || message.analysis?.summary) {
            callSummaryRef.current = message.summary || message.analysis?.summary || '';
          }
          // Immediately save to Hostinger database!
          persistCallToHostinger();
        }
      });

      vapi.on('call-end', () => {
        setCallStatus('ended');
        setIsSpeaking(false);
        setVolumeLevel(0);
        if (timerRef.current) clearInterval(timerRef.current);
        // Automatically persist call to database on hang-up
        setTimeout(() => {
          persistCallToHostinger();
        }, 300);
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
        persistCallToHostinger();
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
    hasSavedRef.current = false;
    setIsSavedToDb(false);
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
    // Ensure data is saved immediately
    persistCallToHostinger();
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

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsManualSaving(true);
    await persistCallToHostinger({
      email: detectedEmail,
      phone: detectedPhone,
      name: detectedName,
      service: detectedService,
      meetingSlot: detectedMeetingSlot,
    });
    setIsManualSaving(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
          className="relative w-full max-w-lg my-auto max-h-[94vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0f1a11] via-[#09110a] to-[#040805] border border-[#c6f554]/40 shadow-[0_0_60px_rgba(198,245,84,0.25)] p-5 sm:p-7 flex flex-col items-center text-center z-10"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162618] border border-[#c6f554]/40 text-[#c6f554] text-xs font-mono font-semibold mb-3 shadow-[0_0_15px_rgba(198,245,84,0.2)]">
            <OwlLogo className="w-3.5 h-3.5 text-[#f7cc46]" />
            <span>GENOWL AI VOICE HOTLINE</span>
          </div>

          {/* Assistant Title & Status */}
          <h2 className="text-2xl font-black text-white tracking-tight">
            YZER <span className="text-[#c6f554] font-serif-italic font-normal">(Wiser)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Executive AI Creative Director &bull; Genowl Studio
          </p>

          {/* Call Status Indicator */}
          <div className="mt-2 mb-4">
            {callStatus === 'connecting' && (
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#f7cc46]">
                <span className="w-2 h-2 rounded-full bg-[#f7cc46] animate-ping" />
                <span>Connecting live audio stream...</span>
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="flex flex-col items-center gap-1">
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
              <div className="text-xs text-zinc-300">
                {errorMessage ? (
                  <span className="text-red-400">{errorMessage}</span>
                ) : (
                  <span className="text-[#c6f554] font-medium">
                    Call finished ({formatTimer(callDuration)}). Details recorded below.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ANIMATED WAVEFORM OR POST-CALL INTELLIGENCE DOCK */}
          {callStatus !== 'ended' ? (
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-6">
              {/* Outer pulsating aura rings */}
              <motion.div
                animate={{
                  scale: callStatus === 'connected' ? 1 + volumeLevel * 1.6 : 1,
                  opacity: callStatus === 'connected' ? 0.3 + volumeLevel * 0.7 : 0.1,
                }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c6f554]/30 via-[#f7cc46]/20 to-[#c6f554]/30 blur-xl"
              />

              {/* Inner Core Disc */}
              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#192b1b] to-[#0a140b] border-2 border-[#c6f554]/60 flex items-center justify-center shadow-[0_0_30px_rgba(198,245,84,0.35)]">
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
          ) : (
            /* POST-CALL RECORDED INTELLIGENCE DOCK (Live Hostinger Database Sync) */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-[#0a130b]/90 border border-white/10 rounded-2xl p-4 mb-4 text-left shadow-lg"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c6f554]" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    Hostinger Database Intelligence Sync
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c6f554]/10 text-[#c6f554] border border-[#c6f554]/30">
                  {dbReceiptId || 'LIVE SYNC'}
                </span>
              </div>

              {/* Status Badge */}
              <div className="mb-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-300 flex items-center justify-between">
                <span>Database Table: <strong className="text-white font-mono">genowl_project_leads</strong></span>
                <span className="text-[#c6f554] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c6f554] animate-pulse" />
                  {isSavedToDb ? 'Saved in MySQL' : 'Auto-Saving...'}
                </span>
              </div>

              {/* Interactive Confirmation Form for Contact Info */}
              <form onSubmit={handleManualSave} className="space-y-2.5">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">
                    Your Email (For Meeting Invite &amp; Confirmation)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      value={detectedEmail}
                      onChange={(e) => setDetectedEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 focus:border-[#c6f554] text-xs text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">
                      Phone / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. +1 (555) 000-0000"
                        value={detectedPhone}
                        onChange={(e) => setDetectedPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 focus:border-[#c6f554] text-xs text-white outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">
                      Service Discussed
                    </label>
                    <input
                      type="text"
                      value={detectedService}
                      onChange={(e) => setDetectedService(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 focus:border-[#c6f554] text-xs text-white outline-none transition-colors font-medium text-[#c6f554]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-1">
                    Meeting Slot / Timing Preference
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Tomorrow 4:00 PM IST or As Soon As Possible"
                      value={detectedMeetingSlot}
                      onChange={(e) => setDetectedMeetingSlot(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 focus:border-[#c6f554] text-xs text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isManualSaving}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#baf345] to-[#d6fa66] text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-105 shadow-[0_0_15px_rgba(198,245,84,0.3)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isManualSaving ? 'Updating...' : 'Save & Confirm Lead in Database'}</span>
                  </button>
                  {onOpenOrder && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenOrder(detectedService);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Open full project brief builder"
                    >
                      <span>Studio Form</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {/* Controls Bar */}
          <div className="flex items-center gap-4 w-full justify-center">
            {callStatus === 'connected' ? (
              <>
                {/* Mute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Big Red End Call Button */}
                <button
                  type="button"
                  onClick={endCall}
                  className="px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4 fill-current" />
                  <span>End &amp; Save Call</span>
                </button>
              </>
            ) : (
              /* Reconnect / Start Call Button */
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={startCall}
                  className="px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_25px_rgba(198,245,84,0.4)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 fill-black" />
                  <span>{callStatus === 'connecting' ? 'Connecting...' : 'Call YZER Live'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-full font-medium text-xs text-zinc-300 bg-white/10 hover:bg-white/15 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Bottom Security / 100% Free info note */}
          <div className="mt-4 text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c6f554]" />
            <span>Direct WebRTC &bull; Transcripts auto-synced to Genowl Hostinger Database</span>
          </div>

          {/* Direct Cellular Phone Call Fallback for Mobile */}
          <a
            href={`tel:${OFFICIAL_PHONE_TEL}`}
            className="mt-2 text-[11px] text-zinc-400 hover:text-[#c6f554] underline decoration-zinc-600 hover:decoration-[#c6f554] underline-offset-2 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Dial direct from your phone's cellular carrier"
          >
            <Phone className="w-3 h-3 text-[#c6f554]" />
            <span>Or dial official line from phone: {OFFICIAL_PHONE_DISPLAY}</span>
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
