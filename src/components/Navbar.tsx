import React, { useState } from 'react';
import { ArrowRight, Menu, X, Lock } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';

import { UserProfile } from './AuthModal.tsx';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenOrder?: (service?: string) => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onSignOut?: () => void;
  onOpenProfile?: () => void;
  onOpenAdmin?: () => void;
}

export default function Navbar({
  currentPage,
  onNavigate,
  onOpenOrder,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenProfile,
  onOpenAdmin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header id="main-header" className="fixed top-0 left-0 right-0 z-50 pt-5 px-4 sm:px-8 md:px-12 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left Top Corner - Genowl Brand & Owl Logo */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          id="brand-logo"
          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0d140e]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] group cursor-pointer select-none hover:border-[#f7cc46]/50 transition-all duration-300"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#141e15] border border-[#f7cc46]/50 flex items-center justify-center shadow-[0_0_14px_rgba(247,204,70,0.4)] group-hover:scale-105 transition-transform overflow-hidden p-0.5">
            <img src="/genowl-mail-logo.png" alt="Genowl Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-[0.18em] text-white group-hover:text-[#f7cc46] transition-colors">
            GENOWL
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#c6f554]/10 border border-[#c6f554]/25 text-[10px] font-mono text-[#c6f554]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c6f554] animate-pulse" />
            Operational
          </span>
        </button>

        {/* Right Top Corner - Navigation Bar & Get Started */}
        <nav
          id="navbar-container"
          className="relative flex items-center gap-6 px-4 sm:px-6 py-2 rounded-full bg-[#0d140e]/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300"
        >
          {/* Desktop Navigation Links */}
          <ul id="desktop-nav-links" className="hidden md:flex items-center gap-8 text-xs font-medium">
            {navLinks.map((link) => {
              const isActive = currentPage.toLowerCase() === link.id.toLowerCase();
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c6f554] shadow-[0_0_6px_#c6f554]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Action Buttons */}
          <div id="nav-actions" className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/[0.06] border border-white/10 hover:border-[#c6f554]/40 transition-all">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  title="View Profile, Active Projects & Orders"
                  className="flex items-center gap-2 cursor-pointer group text-left"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#c6f554]/60 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#c6f554]/20 border border-[#c6f554]/60 text-[#c6f554] font-bold text-[11px] flex items-center justify-center group-hover:bg-[#c6f554]/30 transition-colors">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-200 font-semibold max-w-[90px] truncate group-hover:text-[#c6f554] transition-colors">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-[#c6f554]/80 font-medium leading-none">Client Hub</span>
                  </div>
                </button>
                <div className="w-px h-4 bg-white/10 mx-0.5" />
                <button
                  type="button"
                  onClick={onSignOut}
                  title="Sign out"
                  className="text-[10px] text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer px-1 py-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth?.('signin')}
                className="text-xs font-medium text-zinc-300 hover:text-white px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                Log In
              </button>
            )}

            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                title="Admin Command Center"
                className="text-xs text-zinc-400 hover:text-[#f7cc46] flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-[#f7cc46]/30"
              >
                <Lock className="w-3 h-3 text-[#f7cc46]" />
                <span className="font-medium">Admin</span>
              </button>
            )}

            <button
              id="nav-get-started-btn"
              type="button"
              onClick={() => onOpenOrder?.('2D Website')}
              className="group px-4 py-1.5 rounded-full text-xs font-semibold text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 shadow-[0_0_18px_rgba(198,245,84,0.35)] hover:shadow-[0_0_24px_rgba(198,245,84,0.55)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-zinc-300 hover:text-white bg-white/5 border border-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="max-w-7xl mx-auto px-4 mt-2 pointer-events-auto">
          <div
            id="mobile-menu"
            className="md:hidden p-4 rounded-2xl bg-[#0d140e]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-3"
          >
            {/* User status in mobile */}
            {currentUser && (
              <div className="pb-3 border-b border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#c6f554]/60"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#c6f554]/20 border border-[#c6f554]/60 text-[#c6f554] font-bold text-[10px] flex items-center justify-center">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-white truncate max-w-[140px]">{currentUser.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSignOut?.();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-400 hover:underline text-xs"
                  >
                    Logout
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile?.();
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-black bg-[#c6f554] hover:bg-[#d6fa66] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(198,245,84,0.3)]"
                >
                  <span>My Profile, Orders & Live Status</span>
                </button>
              </div>
            )}

            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentPage.toLowerCase() === link.id.toLowerCase()
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-white/10 space-y-2">
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.('signin');
                  }}
                  className="w-full py-2 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-all text-center cursor-pointer"
                >
                  Log In / Sign In
                </button>
              )}

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-[#f7cc46] bg-white/5 border border-white/10 hover:border-[#f7cc46]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#f7cc46]" />
                  <span>Admin Command Center</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrder?.('2D Website');
                }}
                className="w-full py-2.5 rounded-full text-sm font-semibold text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
