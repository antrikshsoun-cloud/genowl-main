import React, { useState, useEffect } from 'react';
import { Mail, Instagram, Send, Check, Copy, ArrowRight, MessageSquare, Clock, ShieldCheck, Sparkles, AlertCircle, HelpCircle, Lock, Phone } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';
import { sendProblemOrInquiryEmail, OFFICIAL_GENOWL_GMAIL, OFFICIAL_INSTAGRAM } from '../services/emailService.ts';
import { syncInquiryToSupabase } from '../services/supabaseClient.ts';
import { UserProfile } from './AuthModal.tsx';

interface ContactPageProps {
  initialService?: string;
  onNavigateServices?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export default function ContactPage({
  initialService = '',
  onNavigateServices,
  currentUser,
  onOpenAuth,
}: ContactPageProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [contactMode, setContactMode] = useState<'project' | 'problem'>('project');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [service, setService] = useState(initialService || 'Web design');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const instagramId = OFFICIAL_INSTAGRAM;
  const gmailAccount = OFFICIAL_GENOWL_GMAIL;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(gmailAccount);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyInsta = () => {
    navigator.clipboard.writeText(instagramId);
    setCopiedInsta(true);
    setTimeout(() => setCopiedInsta(false), 2000);
  };

  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    // Strict check: User must be logged in before submitting any inquiry or problem report
    if (!currentUser) {
      onOpenAuth?.('signin');
      return;
    }

    // Phone format validation (without glitches, supports international & standard digits)
    const cleanPhone = phone.trim();
    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || digitsOnly.length < 7 || digitsOnly.length > 15) {
      setPhoneError('Please enter a valid phone or WhatsApp number (7 to 15 digits, country code optional e.g. +91 9876543210).');
      return;
    }

    setIsSending(true);

    const isProblem = contactMode === 'problem';
    const id = (isProblem ? 'PRB-' : 'INQ-') + Math.floor(100000 + Math.random() * 900000);
    setTicketId(id);

    const clientName = currentUser.name.trim();
    const clientEmail = currentUser.email.trim();

    try {
      const raw = localStorage.getItem('genowl_client_inquiries');
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        id,
        name: clientName,
        email: clientEmail,
        phone: cleanPhone,
        service: isProblem ? `[Problem] ${service}` : service,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('genowl_client_inquiries', JSON.stringify(list));
    } catch {}

    // Stream real-time inquiry to Supabase Cloud PostgreSQL with phone
    syncInquiryToSupabase({
      id,
      name: clientName,
      email: clientEmail,
      phone: cleanPhone,
      service: isProblem ? `[Problem] ${service}` : service,
      message: message.trim(),
    }).catch(() => {});

    // Dispatch real email with golden owl logo to client and forward to genowlai@gmail.com
    try {
      await sendProblemOrInquiryEmail(
        clientName,
        clientEmail,
        isProblem ? `Problem Report: ${service}` : service,
        message.trim(),
        id,
        cleanPhone
      );
    } catch (err) {
      console.warn('Mail dispatch warning:', err);
    }

    setIsSending(false);
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="pt-4 sm:pt-6 pb-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121c13]/90 border border-white/10 shadow-lg mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-[#c6f554]" />
          <span className="text-xs text-zinc-300 font-medium">Get in Touch</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
          Contact <span className="text-[#c6f554] font-serif-italic">Genowl</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
          Ready to build? Send us your requirements or reach out directly on our official channels.
          All services are a flat rate of <span className="text-[#c6f554] font-semibold">$99</span> each.
        </p>
      </div>

      {/* Two Direct Contact Cards (Instagram & Gmail) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {/* Instagram Card */}
        <div
          id="contact-instagram-card"
          className="group relative p-6 sm:p-7 rounded-3xl bg-[#0e140f]/90 border border-white/10 hover:border-[#f7cc46]/50 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f7cc46]/[0.05] rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1c180d] border border-[#f7cc46]/40 flex items-center justify-center text-[#f7cc46] shadow-[0_0_15px_rgba(247,204,70,0.25)]">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f7cc46]/15 text-[#f7cc46] border border-[#f7cc46]/30">
                Official Instagram
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Direct Message on Instagram</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Connect with our creative team for quick updates, portfolio previews, and project chat.
            </p>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-4">
              <span className="font-mono text-sm sm:text-base text-zinc-200 font-semibold select-all">
                @{instagramId}
              </span>
              <button
                type="button"
                onClick={handleCopyInsta}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                title="Copy Instagram ID"
              >
                {copiedInsta ? <Check className="w-4 h-4 text-[#c6f554]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <a
            href={`https://instagram.com/${instagramId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-black bg-gradient-to-r from-[#f8d462] to-[#e4b52b] hover:brightness-105 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Open Instagram Profile</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Gmail Card */}
        <div
          id="contact-gmail-card"
          className="group relative p-6 sm:p-7 rounded-3xl bg-[#0e140f]/90 border border-white/10 hover:border-[#c6f554]/50 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c6f554]/[0.05] rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#142316] border border-[#c6f554]/40 flex items-center justify-center text-[#c6f554] shadow-[0_0_15px_rgba(198,245,84,0.25)]">
                <Mail className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30">
                Official Gmail
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Email Inquiries &amp; Briefs</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Send your project specifications, attachments, or custom partnership inquiries directly to our inbox.
            </p>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-4">
              <span className="font-mono text-sm sm:text-base text-zinc-200 font-semibold select-all">
                {gmailAccount}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                title="Copy Gmail Address"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-[#c6f554]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <a
            href={`mailto:${gmailAccount}?subject=Project%20Inquiry%20for%20Genowl`}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Send Email via Gmail</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Interactive Project Inquiry & Problem Reporting Form */}
      <div className="rounded-3xl bg-[#0c130d]/90 border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl bg-white/[0.04] border border-white/10 mb-8 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                setContactMode('project');
                setService('Web design');
              }}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                contactMode === 'project'
                  ? 'bg-[#c6f554] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Order ($99)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setContactMode('problem');
                setService('Website Bug / UI Issue');
              }}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                contactMode === 'problem'
                  ? 'bg-[#f7cc46] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Report a Problem / Support</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {contactMode === 'project' ? 'Send a Direct Project Request' : 'Report a Problem or Issue'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              {contactMode === 'project'
                ? 'Tell us what you want to build — we will review and confirm within 24 hours.'
                : `Have an issue? We will forward your details directly to our operations desk at ${gmailAccount} with instant ticket tracking.`}
            </p>
          </div>

          {!currentUser ? (
            <div className="py-12 px-6 sm:px-10 rounded-3xl bg-[#0e1610]/95 border border-white/10 text-center space-y-4 max-w-md mx-auto shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#c6f554]/15 border border-[#c6f554]/30 text-[#c6f554] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(198,245,84,0.25)]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Log In Required to Submit</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                To prevent anonymous spam, ensure ticket security, and track your inquiry under your account, please log in or sign up before submitting.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('signin')}
                  className="w-full py-3 rounded-full text-xs font-bold text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)] cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Log In / Sign Up to Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-14 rounded-2xl bg-[#142016] border border-[#f7cc46]/50 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(247,204,70,0.35)] p-1">
                <img src="/genowl-mail-logo.png" alt="Genowl Logo" className="w-11 h-9 object-contain" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  Thank you, {currentUser.name}!
                </h3>
                <p className="text-xs text-[#c6f554] font-medium mt-1">
                  Your {contactMode === 'problem' ? 'problem report' : 'project inquiry'} has been logged &amp; forwarded.
                </p>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">Ticket Reference: {ticketId}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Client:</span>
                  <span className="font-semibold text-white">{currentUser.name}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Category:</span>
                  <span className="font-semibold text-white">{service}</span>
                </div>
                {phone && (
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-500">Phone / WhatsApp:</span>
                    <span className="font-mono text-[#c6f554]">{phone}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Forwarded To:</span>
                  <span className="font-mono text-[#f7cc46]">{gmailAccount}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Receipt Sent To:</span>
                  <span className="font-mono text-zinc-200">{currentUser.email}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                A confirmation receipt with your ticket reference has been dispatched. Our team has received your problem brief and will reply to your Gmail shortly.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setPhone('');
                  }}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-zinc-300 bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Your Full Name</span>
                    <span className="text-[10px] text-[#c6f554] font-semibold">Logged In</span>
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    readOnly
                    value={currentUser.name}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm cursor-not-allowed opacity-90 select-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Your Gmail / Email</span>
                    <span className="text-[10px] text-[#c6f554] font-semibold">Verified</span>
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    readOnly
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm cursor-not-allowed opacity-90 select-none"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp Number Input with format validation */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Phone / WhatsApp Number (Required)</span>
                  <span className="text-[10px] text-zinc-400">Include country code</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="contact-phone-input"
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210 or +1 (555) 012-3456"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError(null);
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] focus:ring-1 focus:ring-[#c6f554] transition-all"
                  />
                </div>
                {phoneError && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{phoneError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  {contactMode === 'project' ? 'Select Service Category' : 'Select Problem / Issue Type'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(contactMode === 'project'
                    ? [
                        'Web design',
                        '2D Website ($500)',
                        '3D WebGL World ($2,500)',
                        'Video generation',
                        'Personalized AI',
                        'content creation',
                      ]
                    : [
                        'Website Bug / UI Issue',
                        'Account & Login Problem',
                        'Payment / Checkout Issue',
                        'Project Delay Question',
                        'Deliverable Revision Request',
                        'General Technical Help',
                      ]
                  ).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setService(s)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        service === s
                          ? contactMode === 'project'
                            ? 'bg-[#1b2b1d] border-[#c6f554] text-[#c6f554] shadow-[0_0_12px_rgba(198,245,84,0.2)]'
                            : 'bg-[#221c0e] border-[#f7cc46] text-[#f7cc46] shadow-[0_0_12px_rgba(247,204,70,0.2)]'
                          : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:border-white/20'
                      }`}
                    >
                      <span className="block font-semibold">{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  {contactMode === 'project'
                    ? 'Tell Us What To Build (Project Details)'
                    : 'Describe the Problem (What happened & what needs fixing)'}
                </label>
                <textarea
                  id="contact-message-input"
                  required
                  rows={4}
                  placeholder={
                    contactMode === 'project'
                      ? 'Describe your goals, requirements, references, or specific features needed...'
                      : 'Describe the exact issue you encountered, error message if any, or how we can assist you immediately...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] focus:ring-1 focus:ring-[#c6f554] transition-all resize-y"
                />
              </div>

              {/* Delivery info notice */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#c6f554]" />
                  <span>Forwarding to: <strong className="text-white font-mono">{gmailAccount}</strong></span>
                </span>
                <span className="text-[#c6f554] font-medium">Receipt with Logo to your Gmail</span>
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={isSending}
                className={`w-full py-3 px-6 rounded-xl font-bold text-sm text-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  contactMode === 'project'
                    ? 'bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)]'
                    : 'bg-gradient-to-r from-[#f7cc46] to-[#ffe082] hover:brightness-105 shadow-[0_0_20px_rgba(247,204,70,0.35)]'
                }`}
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {contactMode === 'project' ? 'Submit Project Brief' : 'Dispatch Problem to Support Team'}
                    </span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
