import React from 'react';
import { Home, Layers, MessageSquare, ArrowRight, User } from 'lucide-react';
import { UserProfile } from './AuthModal.tsx';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenOrder: (service?: string) => void;
  currentUser: UserProfile | null;
  onOpenProfile: () => void;
}

export default function MobileBottomNav({
  currentPage,
  onNavigate,
  onOpenOrder,
  currentUser,
  onOpenProfile,
}: MobileBottomNavProps) {
  return (
    <div
      id="mobile-bottom-dock"
      className="fixed bottom-3 left-3 right-3 z-40 md:hidden pointer-events-none"
    >
      <div className="pointer-events-auto max-w-md mx-auto flex items-center justify-between p-1.5 rounded-2xl bg-[#0a110c]/90 backdrop-blur-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.85)]">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex-1 py-2 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer ${
            currentPage.toLowerCase() === 'home'
              ? 'text-[#c6f554] font-semibold bg-white/[0.06]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Tab 2: Services & Pricing */}
        <button
          type="button"
          onClick={() => onNavigate('services')}
          className={`flex-1 py-2 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer ${
            currentPage.toLowerCase() === 'services'
              ? 'text-[#c6f554] font-semibold bg-white/[0.06]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Services</span>
        </button>

        {/* Tab 3: Contact & Problem Reports */}
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className={`flex-1 py-2 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer ${
            currentPage.toLowerCase() === 'contact'
              ? 'text-[#c6f554] font-semibold bg-white/[0.06]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Contact</span>
        </button>

        {/* Tab 4: Profile or Get Started Button */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex-1 py-2 flex flex-col items-center justify-center gap-0.5 rounded-xl text-[#c6f554] hover:text-white cursor-pointer bg-white/[0.06]"
          >
            <div className="w-4 h-4 rounded-full bg-[#c6f554]/20 border border-[#c6f554] flex items-center justify-center text-[9px] font-bold text-[#c6f554]">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] tracking-tight">My Hub</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onOpenOrder('2D Website')}
            className="px-3.5 py-2 rounded-xl text-[11px] font-bold text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] shadow-[0_0_12px_rgba(198,245,84,0.35)] flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Order</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
