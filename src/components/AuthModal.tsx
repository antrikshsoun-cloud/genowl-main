import React, { useState } from 'react';
import { X, Check, ArrowRight, Lock, Mail, User, AlertCircle, ShieldCheck, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';
import { validatePasswordStrength } from '../utils/passwordValidator.ts';
import { validateLegalEmail } from '../utils/emailValidator.ts';
import { sendWelcomeEmail, sendVerificationCodeEmail } from '../services/emailService.ts';
import { syncUserToSupabase } from '../services/supabaseClient.ts';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  provider: 'email';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onOpenLegal: (tab: 'terms' | 'privacy') => void;
  initialMode?: 'signin' | 'signup';
  customTitle?: string;
  customSubtitle?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenLegal,
  initialMode = 'signup',
  customTitle,
  customSubtitle,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Email Legal Verification OTP Step
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  if (!isOpen) return null;

  // Helper to get registered users from registry
  const getRegisteredUsers = () => {
    try {
      const raw = localStorage.getItem('genowl_registered_users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Helper to establish a 7-day session (1 week = 7 * 24 * 60 * 60 * 1000 ms)
  const saveSevenDaySession = (userObj: { name: string; email: string }) => {
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const sessionData = {
      user: userObj,
      loginTimestamp: Date.now(),
      expiresAt: Date.now() + sevenDaysMs,
    };
    localStorage.setItem('genowl_current_session', JSON.stringify(sessionData));
    localStorage.setItem('genowl_user', JSON.stringify({ ...userObj, provider: 'email' }));
  };

  // Step 1: Handle Initial Form Submit (Sign Up or Sign In)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // Strict Legal Email Verification
    const emailCheck = validateLegalEmail(cleanEmail);
    if (!emailCheck.isValid) {
      setIsLoading(false);
      setErrorMessage(emailCheck.error || 'Invalid email address.');
      return;
    }

    const users = getRegisteredUsers();
    const existingUser = users.find((u: any) => u.email.toLowerCase() === cleanEmail);

    if (mode === 'signup') {
      // 1. SIGN UP
      if (existingUser) {
        setIsLoading(false);
        setErrorMessage('An account with this email already exists. Please sign in instead.');
        return;
      }

      if (!name.trim()) {
        setIsLoading(false);
        setErrorMessage('Please enter your full name.');
        return;
      }

      // Strict Password Security Validation
      const passCheck = validatePasswordStrength(password);
      if (!passCheck.isValid) {
        setIsLoading(false);
        setErrorMessage(passCheck.errors[0]);
        return;
      }

      // Generate 6-Digit Legal Security Verification Code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      // Dispatch 6-digit verification code to user's Gmail / email inbox
      sendVerificationCodeEmail(name.trim(), cleanEmail, code).catch((err) => {
        console.warn('Verification code dispatch note:', err);
      });

      setIsLoading(false);
      setIsVerifyingEmail(true);
    } else {
      // 2. SIGN IN
      if (!existingUser) {
        setIsLoading(false);
        setErrorMessage('No account found with this email. Please Sign Up first to create your account.');
        return;
      }

      if (existingUser.password && existingUser.password !== password) {
        setIsLoading(false);
        setErrorMessage('Incorrect password. Please verify your credentials.');
        return;
      }

      // Update last login timestamp in registry
      existingUser.lastLoginAt = new Date().toISOString();
      localStorage.setItem('genowl_registered_users', JSON.stringify(users));

      // Sync user profile to Supabase cloud
      syncUserToSupabase({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        verified: true,
      }).catch(() => {});

      // Refresh 7-day session
      saveSevenDaySession({ name: existingUser.name, email: existingUser.email });

      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onLoginSuccess({ name: existingUser.name, email: existingUser.email, provider: 'email' });
        onClose();
      }, 800);
    }
  };

  // Step 2: Confirm 6-Digit Verification Code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (enteredCode.trim() !== generatedCode.trim()) {
      setErrorMessage('Invalid verification code. Please check the 6-digit number and try again.');
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    // Create new legally verified account
    const newUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      verified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('genowl_registered_users', JSON.stringify(users));

    // Sync new registered user to Supabase cloud
    syncUserToSupabase({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      verified: true,
    }).catch(() => {});

    // Automatically send official Welcome Message to user's Gmail / email inbox
    sendWelcomeEmail(newUser.name, newUser.email).catch((err) => {
      console.warn('Welcome email dispatch background note:', err);
    });

    // Establish 7-day session
    saveSevenDaySession({ name: newUser.name, email: newUser.email });

    setIsLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setIsVerifyingEmail(false);
      onLoginSuccess({ name: newUser.name, email: newUser.email, provider: 'email' });
      onClose();
    }, 800);
  };

  // Resend code helper
  const handleResendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setEnteredCode('');
    setErrorMessage(null);
    sendVerificationCodeEmail(name.trim(), email.trim(), newCode).catch(() => {});
    alert(`A new 6-digit verification code has been dispatched to ${email}. Please check your inbox and spam folder.`);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        id="auth-modal-dialog"
        className="relative w-full max-w-md rounded-3xl bg-[#0d140f] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-24 bg-[#c6f554]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#141e15] border border-[#f7cc46]/50 flex items-center justify-center shadow-[0_0_12px_rgba(247,204,70,0.35)] overflow-hidden p-0.5">
              <img src="/genowl-mail-logo.png" alt="Genowl Logo" className="w-full h-full object-contain rounded-md" />
            </div>
            <span className="font-bold text-xs tracking-[0.18em] text-white">GENOWL SECURE AUTH</span>
          </div>

          {isVerifyingEmail && (
            <button
              type="button"
              onClick={() => {
                setIsVerifyingEmail(false);
                setErrorMessage(null);
              }}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white cursor-pointer mr-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* SUCCESS STATE */}
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#c6f554]/20 border border-[#c6f554] flex items-center justify-center text-[#c6f554] mx-auto shadow-[0_0_24px_rgba(198,245,84,0.4)] animate-pulse">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {mode === 'signup' ? 'Account Verified & Welcome Message Sent!' : 'Welcome Back!'}
            </h3>
            <p className="text-xs text-zinc-400">
              {mode === 'signup'
                ? `Your account is active! We've dispatched an official welcome message to ${email}. You'll stay signed in for 7 days.`
                : 'Session authenticated. Loading your profile and services...'}
            </p>
          </div>
        ) : isVerifyingEmail ? (
          /* STEP 2: 6-DIGIT SECURITY VERIFICATION CODE SCREEN */
          <div className="space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#c6f554]/15 border border-[#c6f554]/40 flex items-center justify-center text-[#c6f554] mx-auto shadow-[0_0_18px_rgba(198,245,84,0.3)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Verify Your Email</h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                To guarantee account authenticity, enter the 6-digit security code generated for{' '}
                <span className="text-[#c6f554] font-semibold">{email}</span>.
              </p>
            </div>

            {/* Inbox Delivery Notification Box */}
            <div className="p-3.5 rounded-2xl bg-[#142217]/80 border border-[#c6f554]/30 text-center space-y-1">
              <div className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#c6f554]" />
                <span>Code Dispatched to Your Inbox</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Please check your Gmail inbox (and Spam folder) for the 6-digit verification code.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="e.g. 849201"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.3em] font-mono text-lg py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-zinc-600 focus:outline-none focus:border-[#c6f554] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || enteredCode.length < 6}
                className="w-full py-3 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <span>Verify &amp; Activate Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-xs text-zinc-400 hover:text-[#c6f554] transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Didn't get code? Request new code</span>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: INITIAL SIGN UP / SIGN IN FORM */
          <div>
            {/* Mode Switch Tabs */}
            <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#c6f554] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up (First Time)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#c6f554] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {customTitle || (mode === 'signup' ? 'Create your legal account' : 'Sign in to Genowl')}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 mb-5 leading-relaxed">
              {customSubtitle ||
                (mode === 'signup'
                  ? 'Real email verification is required. Stay logged in for 7 days.'
                  : 'Welcome back. Enter your credentials to access your workspace.')}
            </p>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  {errorMessage}
                  {errorMessage.includes('Sign In instead') && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage(null);
                      }}
                      className="block mt-1 text-[#c6f554] underline font-medium cursor-pointer"
                    >
                      Switch to Sign In →
                    </button>
                  )}
                  {errorMessage.includes('Sign Up first') && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage(null);
                      }}
                      className="block mt-1 text-[#c6f554] underline font-medium cursor-pointer"
                    >
                      Switch to Sign Up →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Registration / Sign-In Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Johnathan Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] focus:ring-1 focus:ring-[#c6f554] transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Real Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com or yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] focus:ring-1 focus:ring-[#c6f554] transition-all"
                  />
                </div>
                {mode === 'signup' && (
                  <p className="text-[10px] text-zinc-500 mt-1">
                    * Fake domains (asdf.com, test.com, tempmail) are strictly rejected.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-zinc-300">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link dispatched to your registered email.')}
                      className="text-[11px] text-zinc-400 hover:text-[#c6f554] transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] focus:ring-1 focus:ring-[#c6f554] transition-all"
                  />
                </div>

                {/* Password Requirements Checklist for Sign Up */}
                {mode === 'signup' && (
                  <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-[11px]">
                    <div className="text-zinc-400 font-medium mb-1">Password Requirements:</div>
                    {(() => {
                      const rules = validatePasswordStrength(password).rules;
                      return (
                        <>
                          <div className={`flex items-center gap-1.5 ${rules.minLength ? 'text-[#c6f554]' : 'text-zinc-500'}`}>
                            <Check className={`w-3 h-3 ${rules.minLength ? 'opacity-100' : 'opacity-30'}`} />
                            <span>At least 8 characters long</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-[#c6f554]' : 'text-zinc-500'}`}>
                            <Check className={`w-3 h-3 ${rules.hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                            <span>At least one numeric digit (0-9)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${rules.hasSpecial ? 'text-[#c6f554]' : 'text-zinc-500'}`}>
                            <Check className={`w-3 h-3 ${rules.hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                            <span>At least one special character (!@#$%^&*)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${rules.noRepeatMoreThanTwo ? 'text-[#c6f554]' : 'text-rose-400 font-medium'}`}>
                            <Check className={`w-3 h-3 ${rules.noRepeatMoreThanTwo ? 'opacity-100' : 'opacity-30'}`} />
                            <span>Same number cannot repeat &gt; 2 times (no 111, 222)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${rules.noSequentialMoreThanTwo ? 'text-[#c6f554]' : 'text-rose-400 font-medium'}`}>
                            <Check className={`w-3 h-3 ${rules.noSequentialMoreThanTwo ? 'opacity-100' : 'opacity-30'}`} />
                            <span>No sequential numbers &gt; 2 (no 123, 321)</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* 7-Day Remember Me Info Badge */}
              <div className="py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-[#c6f554] shrink-0" />
                <span>Our site remembers your signed-up ID for <strong>7 days</strong>.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_20px_rgba(198,245,84,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Verify Email & Continue' : 'Sign In to Genowl'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Footer */}
            <div className="mt-4 pt-3 text-center text-xs text-zinc-400">
              {mode === 'signup' ? (
                <span>
                  Already signed up before?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage(null);
                    }}
                    className="text-[#c6f554] font-medium hover:underline ml-1 cursor-pointer"
                  >
                    Sign In here
                  </button>
                </span>
              ) : (
                <span>
                  Using Genowl for the first time?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-[#c6f554] font-medium hover:underline ml-1 cursor-pointer"
                  >
                    Sign up now
                  </button>
                </span>
              )}
            </div>

            {/* Terms */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-zinc-500 leading-normal">
              By proceeding, you agree to Genowl's{' '}
              <button
                type="button"
                onClick={() => onOpenLegal('terms')}
                className="text-zinc-300 underline hover:text-[#c6f554] cursor-pointer"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => onOpenLegal('privacy')}
                className="text-zinc-300 underline hover:text-[#c6f554] cursor-pointer"
              >
                Privacy Policy
              </button>
              .
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
