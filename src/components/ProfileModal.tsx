import React, { useState, useEffect } from 'react';
import { X, User, ShoppingBag, CheckCircle2, Clock, CreditCard, ArrowRight, Download, ExternalLink, ShieldCheck, Camera, LogOut } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';
import { UserProfile } from './AuthModal.tsx';
import { ClientOrder } from './AdminModal.tsx';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSignOut: () => void;
  onOpenOrder: (service: string) => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSignOut,
  onOpenOrder,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'payments'>('active');
  const [userOrders, setUserOrders] = useState<ClientOrder[]>([]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>('');

  // Load orders for this specific user
  const refreshUserOrders = () => {
    if (!currentUser) return;
    try {
      const raw = localStorage.getItem('genowl_client_orders');
      const allOrders: any[] = raw ? JSON.parse(raw) : [];
      // Filter orders placed with this user's email
      const mine = allOrders.filter(
        (o) => o.email?.toLowerCase().trim() === currentUser.email?.toLowerCase().trim()
      );
      setUserOrders(mine);
    } catch {
      setUserOrders([]);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      refreshUserOrders();
      const savedPhoto = localStorage.getItem(`genowl_avatar_${currentUser.email}`);
      if (savedPhoto) {
        setCustomAvatarUrl(savedPhoto);
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  // Derive real photo from unavatar / Google lookup, custom upload, or initial
  const avatarSrc =
    customAvatarUrl ||
    currentUser.avatar ||
    `https://unavatar.io/${encodeURIComponent(currentUser.email)}?fallback=false`;

  // Filter active vs completed
  const activeProjects = userOrders.filter((o: any) => o.status !== 'completed');
  const completedProjects = userOrders.filter((o: any) => o.status === 'completed');

  // Handle local avatar upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomAvatarUrl(base64);
        localStorage.setItem(`genowl_avatar_${currentUser.email}`, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        id="profile-modal-dialog"
        className="relative w-full max-w-2xl rounded-3xl bg-[#0c120e] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-28 bg-[#c6f554]/12 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-profile-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer z-10"
          aria-label="Close profile"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-white/10 shrink-0">
          {/* Avatar with live photo and upload overlay */}
          <div className="relative group shrink-0">
            <img
              src={avatarSrc}
              alt={currentUser.name}
              onError={(e) => {
                // Fallback to stylized SVG monogram if unavatar has no image for this email
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  currentUser.name
                )}&backgroundColor=c6f554&textColor=000000`;
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#c6f554]/60 shadow-[0_0_20px_rgba(198,245,84,0.3)] bg-black"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
              title="Update profile photo"
            >
              <Camera className="w-5 h-5 text-[#c6f554]" />
              <span className="text-[9px] font-medium mt-0.5">Edit</span>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">{currentUser.name}</h2>
                <div className="font-mono text-xs text-zinc-400 mt-0.5">{currentUser.email}</div>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c6f554] animate-pulse" />
                  Active 7-Day Session
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 bg-white/5 hover:bg-white/10 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-4 mt-4 text-xs text-zinc-400 justify-center sm:justify-start">
              <div>
                <strong className="text-white font-mono">{activeProjects.length}</strong> Active Project{activeProjects.length !== 1 ? 's' : ''}
              </div>
              <span>&bull;</span>
              <div>
                <strong className="text-white font-mono">{completedProjects.length}</strong> Completed
              </div>
              <span>&bull;</span>
              <div>
                <strong className="text-white font-mono">{userOrders.length}</strong> Total Orders
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 py-3 border-b border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-[#c6f554] text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Projects ({activeProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-[#c6f554] text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-[#c6f554] text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment History</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="overflow-y-auto flex-1 py-4 pr-1">
          {/* TAB 1: ACTIVE PROJECTS */}
          {activeTab === 'active' && (
            <div className="space-y-3">
              {activeProjects.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">No active orders right now</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    Start a new project deliverable for flat $99 and our engineering team will begin production.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOrder('Web design');
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-black bg-[#c6f554] hover:brightness-105 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Order a Service ($99)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                activeProjects.map((ord: any) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-[#c6f554]/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#c6f554]">{ord.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            In Production
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1 capitalize">{ord.service}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">$99.00 Flat</div>
                        <div className="text-[10px] text-zinc-400">{new Date(ord.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <strong className="text-zinc-500 block text-[10px] uppercase font-mono mb-0.5">Brief:</strong>
                      {ord.details}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <div className="flex items-center gap-1.5 text-[#c6f554]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Estimated delivery: within 48 hours</span>
                      </div>
                      <span className="text-zinc-500">Speed: {ord.speed || 'Standard'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: COMPLETED PROJECTS */}
          {activeTab === 'completed' && (
            <div className="space-y-3">
              {completedProjects.length === 0 ? (
                <div className="py-10 text-center space-y-2 text-zinc-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-zinc-600" />
                  <p>No completed projects yet. As soon as your deliverables are approved, they will appear here with source downloads.</p>
                </div>
              ) : (
                completedProjects.map((ord: any) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-400">{ord.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30">
                            Delivered &amp; IP Transferred
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1 capitalize">{ord.service}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#c6f554]">$99.00 Paid</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Completed and delivered on {new Date(ord.createdAt).toLocaleDateString()}. Full commercial IP rights transferred to client.
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PAYMENT HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="py-10 text-center text-zinc-500 text-xs">
                  No payment history found.
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/30">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">Receipt</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {userOrders.map((ord: any) => (
                        <tr key={ord.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 font-mono text-zinc-300">{ord.id}</td>
                          <td className="py-3 px-4 font-semibold text-white capitalize">{ord.service}</td>
                          <td className="py-3 px-4 font-mono text-[#c6f554] font-bold">{ord.amount || '$99.00'}</td>
                          <td className="py-3 px-4 text-zinc-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#c6f554]/15 text-[#c6f554]">
                              Confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
