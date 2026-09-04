import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signup' | 'login';
}

export default function TrialModal({ isOpen, onClose, initialMode = 'signup' }: TrialModalProps) {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        id="auth-modal-dialog"
        className="relative w-full max-w-md rounded-2xl bg-[#0e1610] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-[#f7cc46]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#1f1a0e] border border-[#f7cc46]/40 flex items-center justify-center text-[#f7cc46]">
            <OwlLogo className="w-5 h-5 text-[#f7cc46]" />
          </div>
          <span className="font-bold text-xs tracking-[0.18em] text-white">GENOWL</span>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f7cc46]/20 border border-[#f7cc46] flex items-center justify-center text-[#f7cc46] mx-auto shadow-[0_0_20px_rgba(247,204,70,0.4)]">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {mode === 'signup' ? 'Welcome to Genowl!' : 'Signed in successfully'}
            </h3>
            <p className="text-xs text-zinc-400">Setting up your secure workspace environment...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {mode === 'signup' ? 'Start your 6-day free trial' : 'Welcome back'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              {mode === 'signup'
                ? 'No credit card required. Cancel anytime in one click.'
                : 'Enter your credentials to access your Genowl account.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Work Email
                </label>
                <input
                  id="modal-email-input"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] focus:ring-1 focus:ring-[#c6f554] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Password
                </label>
                <input
                  id="modal-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] focus:ring-1 focus:ring-[#c6f554] transition-all"
                />
              </div>

              <button
                id="modal-submit-btn"
                type="submit"
                className="w-full mt-2 py-3 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[#c6f554] font-medium hover:underline ml-1"
                  >
                    Log in
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-[#c6f554] font-medium hover:underline ml-1"
                  >
                    Start Free Trial
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
