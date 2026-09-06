import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ArrowRight,
  ShieldCheck,
  Mail,
  Instagram,
  Clock,
  Link as LinkIcon,
  Zap,
  Layers,
  Box,
  Phone,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';
import { UserProfile } from './AuthModal.tsx';
import { sendSlotBookingEmail } from '../services/emailService.ts';
import { syncOrderToSupabase } from '../services/supabaseClient.ts';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  currentUser?: UserProfile | null;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refund') => void;
}

export default function OrderModal({
  isOpen,
  onClose,
  initialService = '2D Website',
  currentUser,
  onOpenLegal,
}: OrderModalProps) {
  // Normalize incoming service title
  const normalizeService = (srv: string) => {
    if (!srv) return '2D Website';
    if (srv.toLowerCase() === 'web design' || srv.toLowerCase() === 'website') return '2D Website';
    return srv;
  };

  const [selectedService, setSelectedService] = useState(() => normalizeService(initialService));
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [speed, setSpeed] = useState<'standard' | 'priority' | 'urgent'>('standard');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderReceiptId, setOrderReceiptId] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const services = [
    { title: '2D Website', price: '$500', rawPrice: 500, category: 'Website', icon: Layers },
    { title: '3D Website', price: '$2,500', rawPrice: 2500, category: 'Website', icon: Box },
    { title: 'Video generation', price: '$99', rawPrice: 99, category: 'Media' },
    { title: 'Personalized AI', price: '$99', rawPrice: 99, category: 'AI' },
    { title: 'content creation', price: '$99', rawPrice: 99, category: 'Content' },
  ];

  const getServicePrice = (srvTitle: string): string => {
    const match = services.find((s) => s.title.toLowerCase() === srvTitle.toLowerCase());
    if (match) return match.price;
    if (srvTitle.toLowerCase().includes('3d')) return '$2,500';
    if (srvTitle.toLowerCase().includes('2d') || srvTitle.toLowerCase().includes('web')) return '$500';
    return '$99';
  };

  const currentPrice = getServicePrice(selectedService);

  const speedLabels = {
    standard: 'Standard Sprint (48 - 72 Hours)',
    priority: 'Priority Fast-Track (24 - 48 Hours)',
    urgent: 'Urgent Blocker (Same Day / 24h)',
  };

  useEffect(() => {
    if (initialService) {
      setSelectedService(normalizeService(initialService));
    }
  }, [initialService]);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      setName(currentUser.name);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Strict Validation: Required Phone, Details/Brief, Turnaround, Name & Email
  const cleanPhoneDigits = phone.replace(/\D/g, '');
  const isPhoneValid = cleanPhoneDigits.length >= 7;
  const isDetailsValid = details.trim().length >= 10;
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = email.trim().length >= 5 && email.includes('@');

  const isFormValid = isPhoneValid && isDetailsValid && isNameValid && isEmailValid && Boolean(speed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setSubmitError('Please complete all required fields (Project Brief and Phone Number) to book your slot.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const ticketId = 'SLOT-' + Math.floor(100000 + Math.random() * 900000);
    setOrderReceiptId(ticketId);

    const newOrder = {
      id: ticketId,
      service: selectedService,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      details: details.trim(),
      referenceUrl: referenceUrl.trim(),
      speed: speedLabels[speed],
      amount: currentPrice,
      status: 'pending_slot_call',
      paymentMethod: 'Direct Studio Consultation (Discord / Zoom Meeting Agreement)',
      createdAt: new Date().toISOString(),
    };

    // 1. Persist order in local client orders database
    try {
      const existingRaw = localStorage.getItem('genowl_client_orders');
      const orders = existingRaw ? JSON.parse(existingRaw) : [];
      orders.unshift(newOrder);
      localStorage.setItem('genowl_client_orders', JSON.stringify(orders));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('Local storage order note:', err);
    }

    // 2. Sync to Supabase Cloud PostgreSQL
    syncOrderToSupabase(newOrder).catch((err) => {
      console.warn('Supabase cloud sync background note:', err);
    });

    // 3. Dispatch automated confirmation to client & urgent lead alert to admins
    try {
      await sendSlotBookingEmail(
        newOrder.name,
        newOrder.email,
        newOrder.phone,
        newOrder.service,
        newOrder.amount,
        newOrder.details,
        newOrder.speed,
        ticketId,
        newOrder.referenceUrl
      );
    } catch (err) {
      console.warn('Email slot dispatch error:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        id="order-modal-dialog"
        className="relative w-full max-w-xl rounded-3xl bg-[#0e1610] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-24 bg-[#c6f554]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-order-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1f1a0e] border border-[#f7cc46]/40 flex items-center justify-center text-[#f7cc46] shadow-[0_0_15px_rgba(247,204,70,0.25)]">
              <OwlLogo className="w-5 h-5 text-[#f7cc46]" />
            </div>
            <div>
              <span className="font-bold text-xs tracking-[0.18em] text-white uppercase block">GENOWL STUDIO</span>
              <span className="block text-[10px] text-[#c6f554] font-medium">Direct Project Brief &amp; Slot Booking</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c6f554]/10 border border-[#c6f554]/30 text-[11px] font-semibold text-[#c6f554] mr-8">
            <Clock className="w-3.5 h-3.5" />
            <span>30-Min Team Response</span>
          </div>
        </div>

        {submitted ? (
          /* STEP 2: INSTANT ON-SCREEN CONFIRMATION */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#c6f554]/20 border border-[#c6f554] flex items-center justify-center text-[#c6f554] mx-auto shadow-[0_0_30px_rgba(198,245,84,0.45)] animate-pulse">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#c6f554]/15 border border-[#c6f554]/40 text-[#c6f554] text-[11px] font-bold">
                ✓ SLOT RESERVATION RECEIVED
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Project Slot Booked!</h3>
              <p className="text-xs text-zinc-400 font-mono">Reference Ticket: #{orderReceiptId}</p>
            </div>

            {/* Prominent 30-Minute Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#142617] via-[#1a311e] to-[#142617] border border-[#c6f554]/50 shadow-[0_0_25px_rgba(198,245,84,0.2)] text-left space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Phone className="w-4 h-4 text-[#c6f554] shrink-0" />
                <span>Our team will contact you within half an hour!</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                We have forwarded your project brief to our lead engineering desk. Our team will reach out directly to your phone / WhatsApp number (<strong className="text-[#c6f554] font-mono">{phone}</strong>) within 30 minutes to finalize your slot schedule and discuss details.
              </p>
            </div>

            {/* Ticket Summary Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Service:</span>
                <span className="font-semibold text-white">{selectedService}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Flat Rate:</span>
                <span className="font-bold text-[#c6f554]">{currentPrice}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Turnaround:</span>
                <span className="text-zinc-200">{speedLabels[speed]}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Contact Phone:</span>
                <span className="font-mono text-[#c6f554]">{phone}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Confirmation Sent To:</span>
                <span className="font-mono text-zinc-200">{email}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              A formal confirmation receipt has been dispatched to your email address from <strong className="text-white">genowlai@gmail.com</strong>.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-bold text-xs text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(198,245,84,0.3)]"
            >
              Done &bull; Return to Studio
            </button>
          </div>
        ) : (
          /* STEP 1: PROJECT BRIEF & SLOT BOOKING FORM */
          <div>
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Book Project Slot
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Tell us what to build. Fill in your brief and phone number to reserve your dedicated studio slot.
              </p>
            </div>

            {submitError && (
              <div className="mb-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Service Selection Chips */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  1. Select Service Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map((s) => {
                    const isSelected = selectedService.toLowerCase() === s.title.toLowerCase();
                    return (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => setSelectedService(s.title)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b2b1d] border-[#c6f554] text-[#c6f554] shadow-[0_0_12px_rgba(198,245,84,0.2)]'
                            : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {s.icon && <s.icon className="w-3.5 h-3.5 shrink-0 text-[#c6f554]" />}
                          <span className="capitalize truncate font-semibold">{s.title}</span>
                        </div>
                        <span className="font-mono font-bold text-[#c6f554] shrink-0 ml-2">{s.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Client Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Your Name <span className="text-[#c6f554]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Your Email <span className="text-[#c6f554]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all"
                  />
                </div>
              </div>

              {/* 3. Phone / WhatsApp Number (Required for 30-Min Call) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#c6f554]" />
                    <span>Phone / WhatsApp Number <span className="text-[#c6f554]">*</span></span>
                  </label>
                  <span className="text-[10px] text-[#c6f554] font-medium">Team will call/WhatsApp within 30 min</span>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555-0199 or +91 9876543210 (include country code)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border text-white text-xs placeholder-zinc-500 focus:outline-none transition-all font-mono ${
                      phone.trim() && !isPhoneValid
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-white/15 focus:border-[#c6f554]'
                    }`}
                  />
                </div>
                {phone.trim() && !isPhoneValid && (
                  <p className="text-[10px] text-rose-400 mt-1">
                    Please enter a valid phone number with country code (at least 7 digits).
                  </p>
                )}
              </div>

              {/* 4. Preferred Turnaround Time (Required) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  4. Preferred Turnaround Speed <span className="text-[#c6f554]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSpeed('standard')}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      speed === 'standard'
                        ? 'bg-[#1b2b1d] border-[#c6f554] text-white shadow-[0_0_10px_rgba(198,245,84,0.15)]'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-white">Standard</div>
                    <div className="text-[10px] text-zinc-400">48 - 72 Hours</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeed('priority')}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      speed === 'priority'
                        ? 'bg-[#1b2b1d] border-[#c6f554] text-white shadow-[0_0_10px_rgba(198,245,84,0.15)]'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-[#c6f554] flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Priority
                    </div>
                    <div className="text-[10px] text-zinc-400">24 - 48 Hours</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeed('urgent')}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      speed === 'urgent'
                        ? 'bg-[#1b2b1d] border-[#f7cc46] text-white shadow-[0_0_10px_rgba(247,204,70,0.2)]'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-[#f7cc46] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Urgent
                    </div>
                    <div className="text-[10px] text-zinc-400">Same Day / Sprint</div>
                  </button>
                </div>
              </div>

              {/* 5. Project Brief (Required) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    5. Project Brief &amp; What to Build <span className="text-[#c6f554]">*</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">
                    {details.trim().length < 10
                      ? `${10 - details.trim().length} more characters needed`
                      : '✓ Brief provided'}
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what you need built, your brand, target audience, key features, or design vision..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all resize-none"
                />
              </div>

              {/* 6. Reference Link (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Reference Link or Figma (Optional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="url"
                    placeholder="https://figma.com/... or existing website reference"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all"
                  />
                </div>
              </div>

              {/* Studio Guarantees Banner */}
              <div className="p-3.5 rounded-2xl bg-[#142317]/80 border border-[#c6f554]/30 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#c6f554]" />
                    <span>Studio Slot Reservation Guarantee</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c6f554]/20 text-[#c6f554] font-semibold">
                    No Upfront Card Required
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Booking a slot reserves your dedicated engineering sprint. You review the final scope and invoice terms directly with our team.
                </p>
                <div className="pt-1.5 border-t border-white/10 flex justify-between font-bold text-white text-xs">
                  <span>Package Price:</span>
                  <span className="text-[#c6f554] font-mono">{currentPrice} Flat &bull; 100% IP Transfer</span>
                </div>
              </div>

              {/* Terms and conditions notice */}
              {onOpenLegal && (
                <p className="text-[10px] text-zinc-500 text-center leading-normal">
                  By booking a slot, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal('terms')}
                    className="text-[#c6f554] underline hover:brightness-125 cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </button>{' '}
                  and 100% Client IP transfer guarantees.
                </p>
              )}

              {/* SUBMIT BUTTON: STRICTLY DISABLED UNTIL ALL REQUIRED FIELDS ARE FILLED */}
              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isFormValid && !isSubmitting
                      ? 'text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_25px_rgba(198,245,84,0.4)] cursor-pointer'
                      : 'text-zinc-500 bg-white/5 border border-white/10 cursor-not-allowed opacity-60'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Reserving Your Slot...</span>
                    </div>
                  ) : isFormValid ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Book a Slot &bull; Reserve Project ({currentPrice})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <span>Fill Required Phone &amp; Brief to Book a Slot</span>
                  )}
                </button>

                {!isFormValid && (
                  <p className="text-[10px] text-zinc-500 text-center mt-1.5">
                    * Please enter your Phone Number and Project Brief (10+ characters) to enable slot booking.
                  </p>
                )}
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-[#f7cc46]">
                <Instagram className="w-3 h-3" /> @genowl_tech
              </span>
              <span className="flex items-center gap-1 text-[#c6f554] font-mono text-[10px]">
                <Mail className="w-3 h-3" /> support@genowl.tech
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
