import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ShieldCheck, Mail, Instagram, Clock, Link as LinkIcon, Zap, Layers, Box, CreditCard, AlertCircle } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';
import { UserProfile } from './AuthModal.tsx';
import { processRazorpayPayment, RazorpayPaymentResult, getRazorpayKey } from '../services/razorpayService.ts';
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
  const [email, setEmail] = useState(currentUser?.email || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [details, setDetails] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [speed, setSpeed] = useState<'standard' | 'priority'>('standard');
  const [submitted, setSubmitted] = useState(false);
  const [orderReceiptId, setOrderReceiptId] = useState('');

  // Payment processing states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<RazorpayPaymentResult | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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
  const currentKey = getRazorpayKey();
  const isLiveGateway = currentKey && !currentKey.includes('demo');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setIsProcessingPayment(true);

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderReceiptId(orderId);

    // Extract numeric amount for Razorpay checkout ($500 -> 500, $2,500 -> 2500, $99 -> 99)
    const numericAmount = parseInt(currentPrice.replace(/[^0-9]/g, ''), 10) || 99;

    try {
      // 1. Trigger Official Razorpay Payment Flow
      const payment = await processRazorpayPayment({
        amount: numericAmount,
        currency: 'USD',
        serviceTitle: selectedService,
        clientName: name.trim(),
        clientEmail: email.trim(),
      });

      setPaymentResult(payment);

      const newOrder = {
        id: orderId,
        service: selectedService,
        name: name.trim(),
        email: email.trim(),
        details: details.trim(),
        referenceUrl: referenceUrl.trim(),
        speed,
        amount: currentPrice,
        status: 'in_progress',
        paymentId: payment.paymentId,
        paymentMethod: payment.method || 'Razorpay',
        createdAt: new Date().toISOString(),
      };

      // 2. Persist order in local client orders database
      try {
        const existingRaw = localStorage.getItem('genowl_client_orders');
        const orders = existingRaw ? JSON.parse(existingRaw) : [];
        orders.push(newOrder);
        localStorage.setItem('genowl_client_orders', JSON.stringify(orders));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.warn('Local storage order note:', err);
      }

      // 3. Sync to Supabase Cloud Database asynchronously
      syncOrderToSupabase(newOrder).catch((err) => {
        console.warn('Supabase cloud sync background note:', err);
      });

      setIsProcessingPayment(false);
      setSubmitted(true);
    } catch (err: any) {
      setIsProcessingPayment(false);
      setPaymentError(err?.message || 'Payment window was closed or could not be completed.');
    }
  };

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        id="order-modal-dialog"
        className="relative w-full max-w-lg rounded-3xl bg-[#0e1610] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#c6f554]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-order-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1f1a0e] border border-[#f7cc46]/40 flex items-center justify-center text-[#f7cc46]">
              <OwlLogo className="w-5 h-5 text-[#f7cc46]" />
            </div>
            <div>
              <span className="font-bold text-xs tracking-[0.18em] text-white">GENOWL CHECKOUT</span>
              <span className="block text-[10px] text-zinc-400">Razorpay Verified Gateway • 100% IP Transfer</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c6f554]/10 border border-[#c6f554]/30 text-[11px] font-semibold text-[#c6f554] mr-8">
            <Clock className="w-3 h-3" />
            <span>48h Turnaround</span>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#c6f554]/20 border border-[#c6f554] flex items-center justify-center text-[#c6f554] mx-auto shadow-[0_0_20px_rgba(198,245,84,0.4)] animate-pulse">
              <Check className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Payment Confirmed &amp; Order Live!</h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">Receipt ID: {orderReceiptId}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Service:</span>
                <span className="font-semibold text-white">{selectedService}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Amount Paid:</span>
                <span className="font-bold text-[#c6f554]">{currentPrice} (Flat)</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Gateway:</span>
                <span className="font-medium text-emerald-400">Razorpay Verified</span>
              </div>
              {paymentResult?.paymentId && (
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Transaction Ref:</span>
                  <span className="font-mono text-[11px] text-zinc-300">{paymentResult.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Estimated Delivery:</span>
                <span className="font-medium text-white">{speed === 'priority' ? '24 - 48 Hours' : '48 - 72 Hours'}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Client Email:</span>
                <span className="font-mono text-zinc-200">{email}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Your transaction has been confirmed and assigned to production. You can track real-time progress and download deliverables directly in your Client Profile Hub.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-semibold text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shadow-lg"
            >
              Back to Client Hub
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Order &amp; Checkout
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Upfront transparent pricing with 100% full commercial IP rights &amp; revisions included.
              </p>
            </div>

            {paymentError && (
              <div className="mb-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Service Selection Chips */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Select Deliverable
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

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all"
                  />
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Delivery Speed
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSpeed('standard')}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      speed === 'standard'
                        ? 'bg-[#1b2b1d] border-[#c6f554] text-white'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400'
                    }`}
                  >
                    <div className="font-semibold text-white">Standard Delivery</div>
                    <div className="text-[10px] text-zinc-400">48 - 72 Hours</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeed('priority')}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      speed === 'priority'
                        ? 'bg-[#1b2b1d] border-[#c6f554] text-white'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400'
                    }`}
                  >
                    <div className="font-semibold text-[#c6f554] flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Priority Sprint
                    </div>
                    <div className="text-[10px] text-zinc-400">24 - 48 Hours</div>
                  </button>
                </div>
              </div>

              {/* Brief */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Project Brief (What should we build?)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize your requirements, target audience, preferred visual style, and key goals..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all resize-none"
                />
              </div>

              {/* Reference Links (Figma / Web / Inspiration) */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Reference Link (Optional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="url"
                    placeholder="https://figma.com/... or reference URL"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all"
                  />
                </div>
              </div>

              {/* Payment Methods Supported Banner */}
              <div className="p-3 rounded-2xl bg-[#142317]/80 border border-[#c6f554]/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#c6f554]" />
                    <span>Razorpay Secure Gateway</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c6f554]/20 text-[#c6f554] font-medium font-mono">
                    {isLiveGateway ? 'Live Gateway' : 'Test Sandbox Active'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-zinc-300">UPI (GPay, PhonePe, Paytm)</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-zinc-300">Cards (Visa, Master, RuPay, Amex)</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-zinc-300">Net Banking</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white text-sm">
                  <span>Total Amount Due:</span>
                  <span className="text-[#c6f554] font-mono">{currentPrice} Flat</span>
                </div>
              </div>

              {/* Terms and conditions notice */}
              {onOpenLegal && (
                <p className="text-[11px] text-zinc-400 text-center leading-normal">
                  By confirming, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal('terms')}
                    className="text-[#c6f554] underline hover:brightness-125 cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal('refund')}
                    className="text-[#c6f554] underline hover:brightness-125 cursor-pointer"
                  >
                    Refund Policy
                  </button>
                  .
                </p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {currentPrice} via Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-[#f7cc46]">
                <Instagram className="w-3 h-3" /> @genowl_tech
              </span>
              <span className="flex items-center gap-1 text-[#c6f554]">
                <Mail className="w-3 h-3" /> genowlai@gmail.com
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
