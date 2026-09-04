import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';
import OwlLogo from './OwlLogo.tsx';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'refund';
}

export default function LegalModal({ isOpen, onClose, initialTab = 'terms' }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        id="legal-modal-dialog"
        className="relative w-full max-w-2xl rounded-3xl bg-[#0c120e] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 bg-[#c6f554]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Row */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1f1a0e] border border-[#f7cc46]/40 flex items-center justify-center text-[#f7cc46]">
              <OwlLogo className="w-4 h-4 text-[#f7cc46]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Legal &amp; Compliance Center
              </h2>
              <p className="text-[11px] text-zinc-400">Genowl Technologies &bull; Last updated: September 2026</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-[#c6f554] text-black shadow-[0_0_12px_rgba(198,245,84,0.3)]'
                : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms &amp; Conditions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-[#c6f554] text-black shadow-[0_0_12px_rgba(198,245,84,0.3)]'
                : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'refund'
                ? 'bg-[#c6f554] text-black shadow-[0_0_12px_rgba(198,245,84,0.3)]'
                : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Refund &amp; Guarantee</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-2 py-4 text-xs sm:text-sm text-zinc-300 space-y-5 leading-relaxed">
          {activeTab === 'terms' && (
            <>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">1. Acceptance of Terms</h3>
                <p>
                  By accessing, browsing, or utilizing any services provided by Genowl ("the Company", "we", "our", "us"), including creating an account, signing in, or ordering our digital services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">2. Service Fulfillment &amp; Transparent Fee Structure</h3>
                <p>
                  Genowl offers bespoke digital services—including 2D &amp; 3D Websites, Video Generation, Personalized AI, and Content Creation. Upon payment and requirement submission:
                </p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-zinc-400">
                  <li>Project scope begins immediately upon receiving project brief and guidelines.</li>
                  <li>Initial deliverables are provided within standard timelines communicated in your confirmation.</li>
                  <li>Clients receive up to two rounds of revisions included within the standard fee.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">3. Intellectual Property Rights</h3>
                <p>
                  Upon full payment of the agreed service fee, <strong>all intellectual property rights, source files, and commercial usage rights for the final deliverables transfer entirely to the client</strong>. Genowl retains no ownership over your branded assets, codebases, or generated videos.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">4. Client Responsibilities</h3>
                <p>
                  Clients are responsible for providing clear specifications, logos, and brand guidelines necessary for timely project completion. You represent that any materials you supply do not infringe on any third-party copyrights or trademarks.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">5. Limitation of Liability</h3>
                <p>
                  In no event shall Genowl be liable for indirect, incidental, or consequential damages arising from the use of delivered websites, AI systems, or creative assets beyond the direct amount paid for that specific service.
                </p>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">1. Information We Collect</h3>
                <p>
                  We prioritize user privacy and data security. When you authenticate or register on our platform, we only request:
                </p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-zinc-400">
                  <li>Your basic profile information (Full Name, verified Email address).</li>
                  <li>Project details and specifications submitted through our inquiry or checkout forms.</li>
                  <li>Technical telemetry strictly required for session management and website performance.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">2. User Account Privacy &amp; Data Protection</h3>
                <p>
                  Genowl complies strictly with modern data privacy and encryption standards. We never sell, rent, or distribute your personal data or email address to third-party data brokers or advertisers. Data is utilized strictly to authenticate your account and securely associate your orders.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">3. Data Security &amp; Encryption</h3>
                <p>
                  All communications between your client device and Genowl are encrypted using industry-standard TLS/SSL encryption protocols. Your authentication tokens and account identifiers are handled securely and never exposed in unencrypted channels.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">4. Cookies &amp; Local Storage</h3>
                <p>
                  We utilize lightweight local browser storage to keep you securely signed in and preserve your active preferences across sessions. You may clear your browser cookies and storage at any time.
                </p>
              </div>
            </>
          )}

          {activeTab === 'refund' && (
            <>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">1. 6-Day Trial Guarantee</h3>
                <p>
                  New users eligible for trial access can explore our platform workflows and previews for 6 days with zero obligation. You can cancel at any time directly through your account dashboard or by contacting our team.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">2. Satisfaction &amp; Revision Policy</h3>
                <p>
                  Because our custom creative and technical work begins immediately upon order placement, we stand behind the quality of our work. If an initial delivery does not meet your specifications, our team provides tailored revision rounds to align the output with your exact brief.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">3. Cancellation Terms</h3>
                <p>
                  If a project has not yet begun production within 24 hours of submission, clients may request a full cancellation and refund by contacting <span className="text-[#c6f554] font-mono">genowlai@gmail.com</span>.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-[#c6f554]" />
            <span>Compliant with standard digital service agreements</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full font-semibold text-xs text-black bg-gradient-to-r from-[#baf345] to-[#d6fa66] hover:brightness-105 transition-all cursor-pointer"
          >
            I Understand &amp; Agree
          </button>
        </div>

      </div>
    </div>
  );
}
