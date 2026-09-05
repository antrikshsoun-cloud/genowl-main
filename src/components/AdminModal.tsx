import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, Users, Key, Search, Trash2, Download, Check, AlertCircle, Clock, Calendar, ShoppingBag, MessageSquare, RefreshCw, ExternalLink, Award, Mail, Send, CreditCard, Database, Copy, Phone } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';
import {
  EmailLog,
  getDispatchedEmails,
  sendWelcomeEmail,
  getStoredEmailApiKey,
  saveEmailApiKey,
  getGoogleScriptUrl,
  saveGoogleScriptUrl,
  testGoogleAppsScriptDispatch,
  OFFICIAL_GENOWL_GMAIL,
} from '../services/emailService.ts';
import { getRazorpayKey, saveRazorpayKey } from '../services/razorpayService.ts';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection, SUPABASE_SQL_SCHEMA } from '../services/supabaseClient.ts';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface ClientOrder {
  id: string;
  service: string;
  name: string;
  email: string;
  phone?: string;
  details: string;
  referenceUrl?: string;
  speed?: string;
  amount: string;
  status?: string;
  createdAt: string;
}

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  // Permanent Master Admin Password (Strictly locked - cannot be altered via website)
  const MASTER_ADMIN_PASSWORD = 'CristianoMessi@2005';

  // Auth states — Setup screen and password alteration via website are permanently disabled
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('genowl_admin_authenticated') === 'true';
  });

  // Current active admin tab (Security tab removed)
  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'emails' | 'inquiries' | 'metrics' | 'gateway'>('users');
  
  // Login fields
  const [enteredPassword, setEnteredPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable Live Metrics state
  const [projectsCounter, setProjectsCounter] = useState<string>(() => {
    return localStorage.getItem('genowl_projects_delivered') || '24+';
  });

  // Razorpay Gateway State
  const [razorpayKeyInput, setRazorpayKeyInput] = useState<string>(() => {
    return getRazorpayKey();
  });

  // Supabase Backend State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>(() => {
    return getSupabaseConfig().url;
  });
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>(() => {
    return getSupabaseConfig().anonKey;
  });
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{ testing: boolean; message: string | null; success: boolean | null }>({
    testing: false,
    message: null,
    success: null,
  });
  const [schemaCopied, setSchemaCopied] = useState(false);

  // Email API Key State (Resend / Brevo)
  const [emailApiKeyInput, setEmailApiKeyInput] = useState<string>(() => {
    return getStoredEmailApiKey();
  });

  // Google Apps Script Webhook URL State (genowlai@gmail.com)
  const [googleScriptUrlInput, setGoogleScriptUrlInput] = useState<string>(() => {
    return getGoogleScriptUrl();
  });
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);

  const handleSaveGoogleScriptUrl = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoogleScriptUrl(googleScriptUrlInput);
    setSuccessMessage('Google Apps Script Mailer Webhook updated and active!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailStatus('Dispatching live test email via Google Apps Script...');
    const result = await testGoogleAppsScriptDispatch(OFFICIAL_GENOWL_GMAIL);
    setIsSendingTestEmail(false);
    setTestEmailStatus(result.message);
    setTimeout(() => setTestEmailStatus(null), 7000);
  };

  const handleSaveEmailApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailApiKey(emailApiKeyInput);
    setSuccessMessage('Outbound Email API Key saved and activated!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handlers for Razorpay & Supabase
  const handleSaveRazorpayKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveRazorpayKey(razorpayKeyInput);
    setSuccessMessage('Razorpay API Key successfully updated and activated!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    setSuccessMessage('Supabase credentials saved successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleTestSupabase = async () => {
    setSupabaseTestStatus({ testing: true, message: 'Testing cloud connection...', success: null });
    const result = await testSupabaseConnection(supabaseUrlInput, supabaseKeyInput);
    setSupabaseTestStatus({ testing: false, message: result.message, success: result.success });
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setSchemaCopied(true);
    setTimeout(() => setSchemaCopied(false), 2500);
  };

  // Data states
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle toggling order between pending_slot_call, in_progress, and completed
  const handleToggleOrderStatus = (orderId: string) => {
    const updated = orders.map((o: any) => {
      if (o.id === orderId) {
        let nextStatus = 'in_progress';
        if (o.status === 'pending_slot_call') nextStatus = 'in_progress';
        else if (o.status === 'in_progress') nextStatus = 'completed';
        else nextStatus = 'pending_slot_call';

        return {
          ...o,
          status: nextStatus,
        };
      }
      return o;
    });
    localStorage.setItem('genowl_client_orders', JSON.stringify(updated));
    setOrders(updated);
  };

  // Handle saving editable projects metric live
  const handleSaveProjectsMetric = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('genowl_projects_delivered', projectsCounter.trim());
    window.dispatchEvent(new Event('storage'));
    setSuccessMessage(`Live "Projects Delivered" counter updated to "${projectsCounter.trim()}"!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Refresh all databases from localStorage
  const refreshAllData = () => {
    try {
      const rawUsers = localStorage.getItem('genowl_registered_users');
      setUsers(rawUsers ? JSON.parse(rawUsers) : []);

      const rawOrders = localStorage.getItem('genowl_client_orders');
      setOrders(rawOrders ? JSON.parse(rawOrders) : []);

      const rawInquiries = localStorage.getItem('genowl_client_inquiries');
      setInquiries(rawInquiries ? JSON.parse(rawInquiries) : []);

      setEmails(getDispatchedEmails());
    } catch {
      setUsers([]);
      setOrders([]);
      setInquiries([]);
      setEmails([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsUnlocked(sessionStorage.getItem('genowl_admin_authenticated') === 'true');
      setAuthError(null);
      setSuccessMessage(null);
      refreshAllData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Authenticate with Master Password (Locked strictly to CristianoMessi@2005)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (enteredPassword.trim() === MASTER_ADMIN_PASSWORD) {
      sessionStorage.setItem('genowl_admin_authenticated', 'true');
      try {
        localStorage.removeItem('genowl_admin_master_password');
      } catch {}
      setIsUnlocked(true);
      setEnteredPassword('');
      refreshAllData();
    } else {
      setAuthError('Incorrect Admin Password. Access denied.');
    }
  };

  // 4. Logout of Admin Session
  const handleAdminLogout = () => {
    sessionStorage.removeItem('genowl_admin_authenticated');
    setIsUnlocked(false);
    setEnteredPassword('');
  };

  // 5. Delete a user account from registry
  const handleDeleteUser = (userId: string, email: string) => {
    if (window.confirm(`Delete user account: ${email}?`)) {
      const updated = users.filter((u) => u.id !== userId);
      localStorage.setItem('genowl_registered_users', JSON.stringify(updated));
      setUsers(updated);
    }
  };

  // 6. Delete a client order
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      const updated = orders.filter((o) => o.id !== orderId);
      localStorage.setItem('genowl_client_orders', JSON.stringify(updated));
      setOrders(updated);
    }
  };

  // 7. Delete an inquiry
  const handleDeleteInquiry = (inqId: string) => {
    if (window.confirm(`Delete inquiry ${inqId}?`)) {
      const updated = inquiries.filter((i) => i.id !== inqId);
      localStorage.setItem('genowl_client_inquiries', JSON.stringify(updated));
      setInquiries(updated);
    }
  };

  // 8. Export accounts to JSON
  const handleExportData = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      registeredUsers: users,
      clientOrders: orders,
      inquiries: inquiries,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `genowl_full_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered lists
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if a user's session is active (< 7 days)
  const isSessionActive = (lastLogin: string) => {
    if (!lastLogin) return false;
    const loginTime = new Date(lastLogin).getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - loginTime < sevenDaysMs;
  };

  return (
    <div
      id="admin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        id="admin-modal-dialog"
        className="relative w-full max-w-4xl rounded-3xl bg-[#0c120e] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-28 bg-[#f7cc46]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-admin-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1f1a0e] border border-[#f7cc46]/50 flex items-center justify-center text-[#f7cc46] shadow-[0_0_14px_rgba(247,204,70,0.3)]">
              <ShieldCheck className="w-5 h-5 text-[#f7cc46]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wider">GENOWL MASTER COMMAND CENTER</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f7cc46]/15 text-[#f7cc46] border border-[#f7cc46]/30">
                  Secured
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Users, Client Orders, and System Intelligence</p>
            </div>
          </div>

          {isUnlocked && (
            <button
              type="button"
              onClick={handleAdminLogout}
              className="text-xs text-zinc-400 hover:text-rose-400 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors cursor-pointer mr-8"
            >
              Lock Admin
            </button>
          )}
        </div>

        {/* CONTENT AREA */}
        <div className="overflow-y-auto flex-1 pr-1">
          {!isUnlocked ? (
            /* LOCKED — ENTER MASTER PASSWORD */
            <div className="max-w-md mx-auto py-8 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#f7cc46]/15 border border-[#f7cc46]/40 flex items-center justify-center text-[#f7cc46] mx-auto shadow-[0_0_20px_rgba(247,204,70,0.25)]">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Admin Authentication Required</h3>
                <p className="text-xs text-zinc-400">
                  Enter the Master Admin Password to unlock the command center.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Master Password</label>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="••••••••"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#f7cc46] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-[#f7cc46] to-[#ffe082] hover:brightness-105 shadow-[0_0_18px_rgba(247,204,70,0.35)] transition-all cursor-pointer"
                >
                  Unlock Command Center
                </button>
              </form>
            </div>
          ) : (
            /* CASE 3: UNLOCKED — FULL REGISTERED ACCOUNTS & ORDERS DASHBOARD */
            <div className="space-y-5">
              {successMessage && (
                <div className="p-3 rounded-xl bg-[#c6f554]/10 border border-[#c6f554]/30 flex items-center gap-2 text-xs text-[#c6f554]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('users')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === 'users'
                        ? 'bg-[#c6f554] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Registered Users ({users.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === 'orders'
                        ? 'bg-[#c6f554] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Client Orders ({orders.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('emails')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === 'emails'
                        ? 'bg-[#c6f554] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Welcome Emails ({emails.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('inquiries')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === 'inquiries'
                        ? 'bg-[#c6f554] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquiries ({inquiries.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('metrics')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === 'metrics'
                        ? 'bg-[#c6f554] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Live Metrics</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('gateway')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === 'gateway'
                        ? 'bg-[#c6f554] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Razorpay &amp; Supabase</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={refreshAllData}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-white/5 border border-white/10"
                    title="Refresh Data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleExportData}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-black bg-[#c6f554] hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: USERS */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#c6f554] transition-all"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/30">
                    {filteredUsers.length === 0 ? (
                      <div className="py-12 text-center text-zinc-500 text-xs">No registered users found.</div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Registered</th>
                            <th className="py-3 px-4">7-Day Session</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4 font-semibold text-white">{user.name}</td>
                              <td className="py-3 px-4 font-mono text-zinc-300">{user.email}</td>
                              <td className="py-3 px-4 text-zinc-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4">
                                {isSessionActive(user.lastLoginAt) ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#c6f554]/15 text-[#c6f554] border border-[#c6f554]/30">
                                    Active (Logged In)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-700/40 text-zinc-400 border border-zinc-700">
                                    Requires Sign-In
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CLIENT ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/30">
                    {filteredOrders.length === 0 ? (
                      <div className="py-12 text-center text-zinc-500 text-xs">No client orders placed yet. Project slot reservations will appear here.</div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Client</th>
                            <th className="py-3 px-4">Brief Details</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4 font-mono text-[#c6f554] font-bold">{ord.id}</td>
                              <td className="py-3 px-4 font-semibold text-white">{ord.service}</td>
                              <td className="py-3 px-4 text-zinc-300">
                                <div className="font-semibold text-white">{ord.name}</div>
                                <div className="text-[10px] text-zinc-400 font-mono">{ord.email}</div>
                                {ord.phone && (
                                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] text-emerald-400">
                                    <Phone className="w-3 h-3 text-[#c6f554]" />
                                    <a href={`tel:${ord.phone.replace(/[^0-9+]/g, '')}`} className="hover:underline font-semibold" title="Click to Call Client">
                                      {ord.phone}
                                    </a>
                                    <a
                                      href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[9px] font-sans font-medium"
                                      title="Open WhatsApp Chat"
                                    >
                                      WhatsApp
                                    </a>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4 text-zinc-300 max-w-xs truncate" title={ord.details}>
                                {ord.details}
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-[#c6f554]">{ord.amount}</td>
                              <td className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() => handleToggleOrderStatus(ord.id)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer border transition-all ${
                                    (ord as any).status === 'completed'
                                      ? 'bg-[#c6f554]/15 text-[#c6f554] border-[#c6f554]/30'
                                      : (ord as any).status === 'pending_slot_call'
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                      : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                  }`}
                                  title="Click to cycle status: Call Client (30m) -> In Production -> Completed"
                                >
                                  {(ord as any).status === 'completed'
                                    ? '✓ Completed'
                                    : (ord as any).status === 'pending_slot_call'
                                    ? '📞 Call Client (30m)'
                                    : '⚡ In Production'}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/30">
                    {filteredInquiries.length === 0 ? (
                      <div className="py-12 text-center text-zinc-500 text-xs">No contact form inquiries yet. Messages sent via the Contact page will appear here.</div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                            <th className="py-3 px-4">Ticket</th>
                            <th className="py-3 px-4">Client</th>
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Message</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredInquiries.map((inq) => (
                            <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4 font-mono text-amber-400 font-semibold">{inq.id}</td>
                              <td className="py-3 px-4 text-white">
                                <div>{inq.name}</div>
                                <div className="text-[10px] text-zinc-500 font-mono">{inq.email}</div>
                              </td>
                              <td className="py-3 px-4 text-zinc-300">{inq.service}</td>
                              <td className="py-3 px-4 text-zinc-300 max-w-xs truncate" title={inq.message}>
                                {inq.message}
                              </td>
                              <td className="py-3 px-4 text-zinc-400 text-[11px]">
                                {new Date(inq.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DISPATCHED WELCOME & OTP EMAILS */}
              {activeTab === 'emails' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#c6f554]" />
                        <span>Security Verification OTPs &amp; Welcome Emails</span>
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Logs of all 6-digit security codes and official welcome greetings dispatched to client inboxes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://mail.hostinger.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#c6f554]" />
                        <span>Open Hostinger Webmail</span>
                      </a>
                      <div className="px-3 py-1 rounded-full bg-[#c6f554]/10 border border-[#c6f554]/30 text-[#c6f554] text-xs font-semibold">
                        {emails.length} Dispatched
                      </div>
                    </div>
                  </div>

                  {/* Primary Google Apps Script Outbound Mailer Configuration */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121c15] to-[#0d140f] border border-[#c6f554]/30 space-y-3 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#c6f554]/20 border border-[#c6f554] flex items-center justify-center">
                          <Mail className="w-3.5 h-3.5 text-[#c6f554]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Google Apps Script Mailer Engine</span>
                          <span className="text-[10px] text-zinc-400">
                            Dispatches directly from <span className="text-[#c6f554] font-semibold">{OFFICIAL_GENOWL_GMAIL}</span> &bull; 500 free emails/day
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#c6f554]/15 border border-[#c6f554]/40 text-[#c6f554] text-[10px] font-bold">
                          ● Google Cloud Active
                        </span>
                        <button
                          type="button"
                          onClick={handleSendTestEmail}
                          disabled={isSendingTestEmail}
                          className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Send className={`w-3 h-3 text-[#f7cc46] ${isSendingTestEmail ? 'animate-pulse' : ''}`} />
                          <span>{isSendingTestEmail ? 'Sending Test...' : 'Send Test Email'}</span>
                        </button>
                      </div>
                    </div>

                    {testEmailStatus && (
                      <div className="px-3 py-2 rounded-xl bg-[#c6f554]/10 border border-[#c6f554]/30 text-[#c6f554] text-[11px] flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>{testEmailStatus}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveGoogleScriptUrl} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={googleScriptUrlInput}
                        onChange={(e) => setGoogleScriptUrlInput(e.target.value)}
                        className="flex-1 px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#c6f554] transition-all"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl font-bold text-xs text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shrink-0"
                      >
                        Save URL
                      </button>
                    </form>
                    <p className="text-[10px] text-zinc-400">
                      * All client verification codes, welcome greetings, and problem receipts are instantly routed through this webhook directly from your Google inbox.
                    </p>
                  </div>

                  {/* Secondary Redundant API Key Fallback */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-zinc-300">
                        Optional Secondary Provider (Resend / Brevo API Key)
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {emailApiKeyInput ? 'Secondary Key Saved' : 'Standby Mode'}
                      </span>
                    </div>
                    <form onSubmit={handleSaveEmailApiKey} className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Optional backup key: re_... or xkeysib-..."
                        value={emailApiKeyInput}
                        onChange={(e) => setEmailApiKeyInput(e.target.value)}
                        className="flex-1 px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-zinc-400 transition-all"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-xl font-medium text-xs text-zinc-300 bg-white/10 hover:bg-white/15 transition-all cursor-pointer shrink-0"
                      >
                        Save Backup Key
                      </button>
                    </form>
                  </div>

                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/30">
                    {emails.length === 0 ? (
                      <div className="py-12 text-center text-zinc-500 text-xs">
                        No emails dispatched yet. When a user requests a verification code or registers, it will be recorded here.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="bg-white/5 text-zinc-400 font-medium border-b border-white/10">
                          <tr>
                            <th className="py-3 px-4">Client Recipient</th>
                            <th className="py-3 px-4">Subject</th>
                            <th className="py-3 px-4">Security Code</th>
                            <th className="py-3 px-4">Dispatched Date</th>
                            <th className="py-3 px-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {emails.map((log) => (
                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4 text-white">
                                <div className="font-semibold">{log.recipientName}</div>
                                <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#c6f554]" />
                                  <span>{log.recipientEmail}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-zinc-300 font-medium">
                                {log.subject}
                              </td>
                              <td className="py-3 px-4 font-mono">
                                {log.code ? (
                                  <span className="text-sm font-bold text-[#c6f554] tracking-widest bg-black/40 px-2 py-0.5 rounded border border-[#c6f554]/30">
                                    {log.code}
                                  </span>
                                ) : (
                                  <span className="text-zinc-400 text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10">
                                    {log.type === 'problem_forward'
                                      ? 'Problem Forward'
                                      : log.type === 'inquiry_receipt'
                                      ? 'Client Receipt'
                                      : 'Welcome Email'}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                                {new Date(log.dispatchedAt).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Delivered</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: LIVE METRICS */}
              {activeTab === 'metrics' && (
                <div className="max-w-md mx-auto py-6 space-y-5">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-white">Live Site Metrics Configuration</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Update the official number of projects delivered shown on the website's guarantees bar.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProjectsMetric} className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Projects Delivered Counter (e.g. 24+, 50+, 100+)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 24+ or 50+"
                        value={projectsCounter}
                        onChange={(e) => setProjectsCounter(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-[#c6f554] transition-all"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        * Updates the guarantees bar live across all visitor browsers immediately.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-400 space-y-1">
                      <div className="text-white font-medium">Current Live Preview:</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-[#c6f554]">{projectsCounter || '24+'}</span>
                        <span className="text-zinc-300">Projects Delivered</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl font-bold text-xs text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer"
                    >
                      Save &amp; Update Website Live
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: GATEWAY & BACKEND CONFIGURATION */}
              {activeTab === 'gateway' && (
                <div className="max-w-2xl mx-auto py-4 space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#c6f554]" />
                      <span>Razorpay Gateway &amp; Supabase Cloud Backend</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Configure your Indian payment gateway credentials and connect your cloud PostgreSQL database.
                    </p>
                  </div>

                  {/* 1. RAZORPAY CONFIGURATION CARD */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#142317] border border-[#c6f554]/40 flex items-center justify-center text-[#c6f554]">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Razorpay Payment Gateway</h4>
                          <span className="text-[11px] text-zinc-400">UPI, Indian Debit/Credit Cards &amp; Net Banking</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                        razorpayKeyInput && !razorpayKeyInput.includes('demo')
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {razorpayKeyInput && !razorpayKeyInput.includes('demo') ? 'Live Key Active' : 'Test Sandbox'}
                      </span>
                    </div>

                    <form onSubmit={handleSaveRazorpayKey} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Razorpay Key ID (rzp_test_... or rzp_live_...)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="rzp_live_xxxxxxxxxxxxxx"
                          value={razorpayKeyInput}
                          onChange={(e) => setRazorpayKeyInput(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#c6f554] transition-all"
                        />
                        <p className="text-[11px] text-zinc-500 mt-1">
                          * Found in your Razorpay Dashboard &gt; Settings &gt; API Keys. Payouts deposit automatically into your bank account.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px] text-zinc-400">
                          Supports: <strong className="text-white">GPay, PhonePe, Paytm, Cards, UPI</strong>
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl font-bold text-xs text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shadow-md"
                        >
                          Save Razorpay Key
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* 2. SUPABASE BACKEND CONFIGURATION CARD */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#142317] border border-[#c6f554]/40 flex items-center justify-center text-[#c6f554]">
                          <Database className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Supabase Cloud Database</h4>
                          <span className="text-[11px] text-zinc-400">Free PostgreSQL Database &amp; Global Cross-Device Sync</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                        supabaseUrlInput && supabaseKeyInput
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-white/10'
                      }`}>
                        {supabaseUrlInput && supabaseKeyInput ? 'Configured' : 'Local Storage Mode'}
                      </span>
                    </div>

                    <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1">
                            Supabase Project URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://xyzcompany.supabase.co"
                            value={supabaseUrlInput}
                            onChange={(e) => setSupabaseUrlInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#c6f554] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1">
                            Supabase Anon Public API Key
                          </label>
                          <input
                            type="password"
                            placeholder="eyJhbGciOiJIUzI1NiIs..."
                            value={supabaseKeyInput}
                            onChange={(e) => setSupabaseKeyInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#c6f554] transition-all"
                          />
                        </div>
                      </div>

                      {supabaseTestStatus.message && (
                        <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                          supabaseTestStatus.success
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          {supabaseTestStatus.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                          <span>{supabaseTestStatus.message}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleTestSupabase}
                            disabled={supabaseTestStatus.testing || !supabaseUrlInput}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer disabled:opacity-40"
                          >
                            {supabaseTestStatus.testing ? 'Testing...' : 'Test Connection'}
                          </button>
                          <button
                            type="button"
                            onClick={handleCopySchema}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#c6f554] bg-[#c6f554]/10 hover:bg-[#c6f554]/20 border border-[#c6f554]/30 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{schemaCopied ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
                          </button>
                        </div>

                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl font-bold text-xs text-black bg-[#c6f554] hover:brightness-105 transition-all cursor-pointer shadow-md"
                        >
                          Save Credentials
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
