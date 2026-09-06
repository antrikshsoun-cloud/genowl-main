import React, { useState, useEffect } from 'react';
import { Mail, Instagram, Send, Check, Copy, ArrowRight, MessageSquare, ShieldCheck, Sparkles, AlertCircle, FileText, HelpCircle, Lock, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import { sendProblemOrInquiryEmail, OFFICIAL_HOSTINGER_EMAIL, OFFICIAL_GENOWL_GMAIL, OFFICIAL_INSTAGRAM, OFFICIAL_X, OFFICIAL_X_URL } from '../services/emailService.ts';
import { GENOWL_LOGO_BASE64 } from '../services/logoAsset.ts';
import { syncInquiryToSupabase } from '../services/supabaseClient.ts';
import { submitContactToHostinger } from '../services/hostingerDbService.ts';
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
  const [copiedHostinger, setCopiedHostinger] = useState(false);
  const [copiedGmail, setCopiedGmail] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [copiedX, setCopiedX] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // 3 Official Report Issuance Modes
  const [reportType, setReportType] = useState<'project' | 'problem' | 'inquiry'>('project');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [category, setCategory] = useState(initialService || '2D Website ($500)');
  const [priority, setPriority] = useState<'standard' | 'high' | 'urgent'>('standard');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [mailtoBackupUrl, setMailtoBackupUrl] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const hostingerEmail = OFFICIAL_HOSTINGER_EMAIL;
  const gmailAccount = OFFICIAL_GENOWL_GMAIL;
  const instagramId = OFFICIAL_INSTAGRAM;
  const xHandle = OFFICIAL_X;
  const xUrl = OFFICIAL_X_URL;

  const handleCopyHostinger = () => {
    navigator.clipboard.writeText(hostingerEmail);
    setCopiedHostinger(true);
    setTimeout(() => setCopiedHostinger(false), 2000);
  };

  const handleCopyGmail = () => {
    navigator.clipboard.writeText(gmailAccount);
    setCopiedGmail(true);
    setTimeout(() => setCopiedGmail(false), 2000);
  };

  const handleCopyInsta = () => {
    navigator.clipboard.writeText(instagramId);
    setCopiedInsta(true);
    setTimeout(() => setCopiedInsta(false), 2000);
  };

  const handleCopyX = () => {
    navigator.clipboard.writeText(`@${xHandle}`);
    setCopiedX(true);
    setTimeout(() => setCopiedX(false), 2000);
  };

  const handleCopyTicketId = () => {
    navigator.clipboard.writeText(`#${ticketId}`);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const getCategoryOptions = () => {
    switch (reportType) {
      case 'project':
        return [
          '2D Custom Website ($500)',
          '3D WebGL World ($2,500)',
          'AI Video Production ($99)',
          'Personalized AI Solution ($99)',
          'Content & Creative Sprint ($99)',
          'Full Custom Architecture',
        ];
      case 'problem':
        return [
          'Website Bug / UI Issue',
          'Account & Login Assistance',
          'Consultation & Booking Support',
          'Deliverable Revision Request',
          'Performance / Slow Loading',
          'Critical Blocker',
        ];
      case 'inquiry':
      default:
        return [
          'Studio Consultation',
          'Enterprise Licensing & IP',
          'Custom Solution Request',
          'Partnership & Collaboration',
          'Client Feedback',
          'General Question',
        ];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    // Strict check: User must be logged in before issuing any report or inquiry
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

    if (description.trim().length < 10) {
      alert('Please provide at least 10 characters describing your report or brief.');
      return;
    }

    setIsSending(true);

    const prefix = reportType === 'problem' ? 'PRB-' : reportType === 'project' ? 'PRJ-' : 'INQ-';
    const id = prefix + Math.floor(100000 + Math.random() * 900000);
    setTicketId(id);

    const clientName = (name.trim() || currentUser.name).trim();
    const clientEmail = currentUser.email.trim();
    const priorityLabel = priority === 'urgent' ? 'Urgent Blocker' : priority === 'high' ? 'High Priority (2-4h)' : 'Standard (24h)';

    // Save to local storage
    try {
      const raw = localStorage.getItem('genowl_client_inquiries');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        id,
        name: clientName,
        email: clientEmail,
        phone: cleanPhone,
        service: `[${reportType.toUpperCase()}] ${category}`,
        priority: priorityLabel,
        referenceUrl: referenceUrl.trim() || undefined,
        message: description.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('genowl_client_inquiries', JSON.stringify(list));
    } catch {}

    // Stream real-time report to Supabase Cloud PostgreSQL
    syncInquiryToSupabase({
      id,
      name: clientName,
      email: clientEmail,
      phone: cleanPhone,
      service: `[${reportType.toUpperCase()}] ${category}`,
      message: `${priorityLabel} | ${referenceUrl ? `Ref: ${referenceUrl.trim()} | ` : ''}${description.trim()}`,
    }).catch(() => {});

    // Save directly to Hostinger MySQL Database
    submitContactToHostinger({
      name: clientName,
      email: clientEmail,
      subject: `[${reportType.toUpperCase()}] ${category} (${priorityLabel})`,
      message: `Phone: ${cleanPhone} | ${referenceUrl ? `Ref: ${referenceUrl.trim()} | ` : ''}${description.trim()}`,
    }).catch(() => {});

    // Dispatch real email with golden owl logo to client, forward to Hostinger (support@genowl.tech) AND Gmail (genowlai@gmail.com)
    try {
      const result = await sendProblemOrInquiryEmail(
        clientName,
        clientEmail,
        category,
        description.trim(),
        id,
        cleanPhone,
        priorityLabel,
        referenceUrl.trim()
      );
      if (result.mailtoLink) {
        setMailtoBackupUrl(result.mailtoLink);
      }
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
          <FileText className="w-3.5 h-3.5 text-[#c6f554]" />
          <span className="text-xs text-zinc-300 font-medium tracking-wide">Official Report &amp; Inquiry Desk</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
          Issue a <span className="text-[#c6f554] font-serif-italic">Report</span> or Inquiry
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
          Submit an official project brief, report a technical issue, or issue an inquiry. Every ticket is logged into our central cloud queue and forwarded directly to our Hostinger and Gmail engineering desks.
        </p>
      </div>

      {/* Direct Contact Channels: Hostinger Mail, Operations Gmail, Instagram & X */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {/* Hostinger Official Support Card */}
        <div
          id="contact-hostinger-card"
          className="group relative p-5 rounded-3xl bg-[#0e140f]/90 border border-white/10 hover:border-[#c6f554]/50 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#c6f554]/[0.06] rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#142316] border border-[#c6f554]/40 flex items-center justify-center text-[#c6f554] shadow-[0_0_12px_rgba(198,245,84,0.25)]">
                <Mail className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30">
                Hostinger
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-1">Official Support</h3>
            <p className="text-[11px] text-zinc-400 mb-3">
              Corporate mailbox for formal briefs &amp; inquiries.
            </p>

            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-3 min-w-0">
              <span className="font-mono text-xs text-zinc-200 font-semibold select-all truncate mr-1.5">
                {hostingerEmail}
              </span>
              <button
                type="button"
                onClick={handleCopyHostinger}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Copy Hostinger Mail"
              >
                {copiedHostinger ? <Check className="w-3.5 h-3.5 text-[#c6f554]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
          </div>

          <a
            href={`mailto:${hostingerEmail}?subject=Official%20Report%20/%20Inquiry%20for%20Genowl`}
            className="w-full py-2 px-3 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Send Email</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Operations Gmail Card */}
        <div
          id="contact-gmail-card"
          className="group relative p-5 rounded-3xl bg-[#0e140f]/90 border border-white/10 hover:border-[#f7cc46]/50 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#f7cc46]/[0.05] rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#1c180d] border border-[#f7cc46]/40 flex items-center justify-center text-[#f7cc46] shadow-[0_0_12px_rgba(247,204,70,0.25)]">
                <Mail className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f7cc46]/15 text-[#f7cc46] border border-[#f7cc46]/30">
                Gmail Ops
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-1">Operations Desk</h3>
            <p className="text-[11px] text-zinc-400 mb-3">
              Direct inbox for technical dispatches &amp; backup.
            </p>

            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-3 min-w-0">
              <span className="font-mono text-xs text-zinc-200 font-semibold select-all truncate mr-1.5">
                {gmailAccount}
              </span>
              <button
                type="button"
                onClick={handleCopyGmail}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Copy Gmail Address"
              >
                {copiedGmail ? <Check className="w-3.5 h-3.5 text-[#c6f554]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
          </div>

          <a
            href={`mailto:${gmailAccount}?subject=Engineering%20Dispatch%20for%20Genowl`}
            className="w-full py-2 px-3 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-[#f8d462] to-[#e4b52b] hover:brightness-105 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Send Gmail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Instagram Card */}
        <div
          id="contact-instagram-card"
          className="group relative p-5 rounded-3xl bg-[#0e140f]/90 border border-white/10 hover:border-white/30 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#141a15] border border-white/20 flex items-center justify-center text-zinc-200">
                <Instagram className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-zinc-300 border border-white/15">
                Instagram
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-1">Design Showcase</h3>
            <p className="text-[11px] text-zinc-400 mb-3">
              Direct chat &amp; previews with design department.
            </p>

            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-3 min-w-0">
              <span className="font-mono text-xs text-zinc-200 font-semibold select-all truncate mr-1.5">
                @{instagramId}
              </span>
              <button
                type="button"
                onClick={handleCopyInsta}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Copy Instagram Handle"
              >
                {copiedInsta ? <Check className="w-3.5 h-3.5 text-[#c6f554]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
          </div>

          <a
            href={`https://instagram.com/${instagramId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/15 border border-white/15 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Instagram</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Official X (Twitter) Card */}
        <div
          id="contact-x-card"
          className="group relative p-5 rounded-3xl bg-[#0e140f]/90 border border-white/10 hover:border-[#c6f554]/50 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#c6f554]/[0.05] rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#142016] border border-[#c6f554]/40 flex items-center justify-center text-[#c6f554] shadow-[0_0_12px_rgba(198,245,84,0.2)]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30">
                Official X
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-1">X Updates &amp; DMs</h3>
            <p className="text-[11px] text-zinc-400 mb-3">
              Official updates, release notes, and studio announcements.
            </p>

            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-3 min-w-0">
              <span className="font-mono text-xs text-zinc-200 font-semibold select-all truncate mr-1.5">
                @{xHandle}
              </span>
              <button
                type="button"
                onClick={handleCopyX}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Copy X Handle"
              >
                {copiedX ? <Check className="w-3.5 h-3.5 text-[#c6f554]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
          </div>

          <a
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Open X Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Official Report Issuance Center Form */}
      <div className="rounded-3xl bg-[#0c130d]/95 border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          {/* 3 Report Type Selector Tabs (Responsive on Mobile) */}
          <div className="flex p-1 rounded-2xl bg-white/[0.04] border border-white/10 mb-8 max-w-lg mx-auto w-full">
            <button
              type="button"
              onClick={() => {
                setReportType('project');
                setCategory('2D Custom Website ($500)');
              }}
              className={`flex-1 py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 min-w-0 truncate ${
                reportType === 'project'
                  ? 'bg-[#c6f554] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Project Scope</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportType('problem');
                setCategory('Website Bug / UI Issue');
              }}
              className={`flex-1 py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 min-w-0 truncate ${
                reportType === 'problem'
                  ? 'bg-[#f7cc46] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Issue / Bug</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportType('inquiry');
                setCategory('Studio Consultation');
              }}
              className={`flex-1 py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 min-w-0 truncate ${
                reportType === 'inquiry'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Inquiry</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {reportType === 'project'
                ? 'Issue a Project Brief & Specification Report'
                : reportType === 'problem'
                ? 'Issue an Official Problem or Bug Report'
                : 'Issue a Studio Consultation & Inquiry Report'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              {reportType === 'project'
                ? 'Specify what you need engineered. Our architects review briefs and reply with timeline & architecture in 2-4 hours.'
                : reportType === 'problem'
                ? `Encountered an issue or glitch? Report it directly to our operations team with immediate priority logging.`
                : 'Have a question regarding custom engineering, enterprise IP transfer, or partnership? Issue a formal inquiry ticket.'}
            </p>
          </div>

          {!currentUser ? (
            <div className="py-12 px-6 sm:px-10 rounded-3xl bg-[#0e1610]/95 border border-white/10 text-center space-y-4 max-w-md mx-auto shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#c6f554]/15 border border-[#c6f554]/30 text-[#c6f554] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(198,245,84,0.25)]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Log In Required to Issue Reports</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                To bind every ticket to an authentic client identity, prevent spam, and enable permanent tracking in your Client Hub, please log in or sign up first.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('signin')}
                  className="w-full py-3 rounded-full text-xs font-bold text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)] cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Log In / Sign Up to Issue Report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : submitted ? (
            /* OFFICIAL REPORT CONFIRMATION CARD */
            <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#142016] border border-[#c6f554]/60 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(198,245,84,0.35)] p-1.5">
                <img
                  src={GENOWL_LOGO_BASE64}
                  alt="Genowl Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30 inline-block mb-2">
                  &check; Report Officially Registered
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Thank You, {currentUser.name}!
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Your official report has been logged to the cloud database and simultaneously dispatched to our Hostinger and Gmail operations desks.
                </p>
              </div>

              {/* Ticket Badge with 1-Click Copy */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/15 shadow-inner">
                <div className="text-left">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Tracking Ticket ID</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-[#c6f554]">#{ticketId}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTicketId}
                  className="p-2 rounded-xl text-zinc-300 hover:text-white bg-white/10 hover:bg-white/15 transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
                >
                  {copiedTicket ? <Check className="w-4 h-4 text-[#c6f554]" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTicket ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Structured Receipt Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-left text-xs space-y-2.5 max-w-md mx-auto shadow-xl">
                <div className="flex justify-between text-zinc-300 pb-2 border-b border-white/5">
                  <span className="text-zinc-500">Reporter:</span>
                  <span className="font-semibold text-white">{currentUser.name}</span>
                </div>
                <div className="flex justify-between text-zinc-300 pb-2 border-b border-white/5">
                  <span className="text-zinc-500">Verified Email:</span>
                  <span className="font-mono text-zinc-200">{currentUser.email}</span>
                </div>
                {phone && (
                  <div className="flex justify-between text-zinc-300 pb-2 border-b border-white/5">
                    <span className="text-zinc-500">Phone / WhatsApp:</span>
                    <span className="font-mono text-[#c6f554]">{phone}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-300 pb-2 border-b border-white/5">
                  <span className="text-zinc-500">Report Category:</span>
                  <span className="font-semibold text-white">{category}</span>
                </div>
                <div className="flex justify-between text-zinc-300 pb-2 border-b border-white/5">
                  <span className="text-zinc-500">Hostinger Mail:</span>
                  <span className="font-mono text-[#c6f554] font-medium">{hostingerEmail}</span>
                </div>
                <div className="flex justify-between text-zinc-300 pb-2 border-b border-white/5">
                  <span className="text-zinc-500">Operations Gmail:</span>
                  <span className="font-mono text-[#f7cc46] font-medium">{gmailAccount}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Cloud Sync:</span>
                  <span className="text-[#c6f554] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Supabase PostgreSQL Logged
                  </span>
                </div>
              </div>

              {/* Action Buttons: Native Mail App Backup and Reset */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                {mailtoBackupUrl && (
                  <a
                    href={mailtoBackupUrl}
                    className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open in Email App (Backup)</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setDescription('');
                    setReferenceUrl('');
                  }}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-300 bg-white/10 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Issue Another Report</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Row 1: Name and Email (read-only verified) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Client / Reporter Name</span>
                    <span className="text-[10px] text-[#c6f554] font-semibold">Active Session</span>
                  </label>
                  <input
                    id="report-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c6f554] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Verified Client Email</span>
                    <span className="text-[10px] text-[#c6f554] font-semibold">Receipt Destination</span>
                  </label>
                  <input
                    id="report-email-input"
                    type="email"
                    readOnly
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm cursor-not-allowed opacity-90 select-none font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Validated Phone & WhatsApp Number */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Phone / WhatsApp Number (Required for Direct Contact)</span>
                  <span className="text-[10px] text-zinc-400">Include country code</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="report-phone-input"
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

              {/* Row 3: Category Selector */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  {reportType === 'project'
                    ? 'Select Engineering Pillar / Scope'
                    : reportType === 'problem'
                    ? 'Select Problem / Issue Classification'
                    : 'Select Inquiry Classification'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {getCategoryOptions().map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCategory(opt)}
                      className={`p-2 sm:p-2.5 rounded-xl text-[11px] sm:text-xs font-medium border text-center transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                        category === opt
                          ? reportType === 'problem'
                            ? 'bg-[#221c0e] border-[#f7cc46] text-[#f7cc46] shadow-[0_0_12px_rgba(247,204,70,0.2)]'
                            : 'bg-[#1b2b1d] border-[#c6f554] text-[#c6f554] shadow-[0_0_12px_rgba(198,245,84,0.2)]'
                          : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:border-white/20'
                      }`}
                    >
                      <span className="block font-semibold leading-snug break-words">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Priority SLA & Optional Reference URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Priority / SLA Requirement
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPriority('standard')}
                      className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium border transition-all cursor-pointer text-center truncate ${
                        priority === 'standard'
                          ? 'bg-[#1b2b1d] border-[#c6f554] text-[#c6f554]'
                          : 'bg-white/[0.02] border-white/10 text-zinc-400'
                      }`}
                    >
                      Standard (24h)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('high')}
                      className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium border transition-all cursor-pointer text-center truncate ${
                        priority === 'high'
                          ? 'bg-[#221c0e] border-[#f7cc46] text-[#f7cc46]'
                          : 'bg-white/[0.02] border-white/10 text-zinc-400'
                      }`}
                    >
                      High (2-4h)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('urgent')}
                      className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium border transition-all cursor-pointer text-center truncate ${
                        priority === 'urgent'
                          ? 'bg-rose-950/40 border-rose-500 text-rose-400'
                          : 'bg-white/[0.02] border-white/10 text-zinc-400'
                      }`}
                    >
                      Urgent
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Reference URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. Figma link, GitHub, reference site"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all"
                  />
                </div>
              </div>

              {/* Row 5: Detailed Description / Brief */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>
                    {reportType === 'project'
                      ? 'Project Brief & Scope Specifications (Min. 10 chars)'
                      : reportType === 'problem'
                      ? 'Problem Report Details (What happened & expected behavior)'
                      : 'Inquiry & Message Specifications'}
                  </span>
                  <span className="text-[10px] text-zinc-500">{description.length} chars</span>
                </label>
                <textarea
                  id="report-description-input"
                  required
                  rows={4}
                  placeholder={
                    reportType === 'project'
                      ? 'Describe your project requirements, target audience, preferred style, pages needed, or references...'
                      : reportType === 'problem'
                      ? 'Describe the exact bug, page URL, error message or revision needed so our engineers can reproduce and fix it immediately...'
                      : 'Describe your question or partnership proposal in detail...'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] focus:ring-1 focus:ring-[#c6f554] transition-all resize-y"
                />
              </div>

              {/* Transparent Delivery Dispatch Footer Notice */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#c6f554]" />
                  <span>
                    Dispatched to: <strong className="text-white font-mono">{hostingerEmail}</strong> &amp; <strong className="text-[#f7cc46] font-mono">{gmailAccount}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#c6f554]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Logged to Supabase Cloud</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="report-submit-btn"
                type="submit"
                disabled={isSending}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  reportType === 'problem'
                    ? 'bg-gradient-to-r from-[#f7cc46] to-[#ffe082] hover:brightness-105 shadow-[0_0_20px_rgba(247,204,70,0.35)]'
                    : 'bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)]'
                }`}
              >
                {isSending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Issuing Official Report &amp; Registering Ticket...</span>
                  </div>
                ) : (
                  <>
                    <span>
                      {reportType === 'project'
                        ? 'Issue Official Project Brief Report'
                        : reportType === 'problem'
                        ? 'Issue Official Problem Report to Support Desk'
                        : 'Issue Official Studio Inquiry Ticket'}
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
