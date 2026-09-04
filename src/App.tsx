import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import FeatureCards from './components/FeatureCards.tsx';
import ServicesPage from './components/ServicesPage.tsx';
import AboutPage from './components/AboutPage.tsx';
import ContactPage from './components/ContactPage.tsx';
import Footer from './components/Footer.tsx';
import OrderModal from './components/OrderModal.tsx';
import AuthModal, { UserProfile } from './components/AuthModal.tsx';
import LegalModal from './components/LegalModal.tsx';
import AdminModal from './components/AdminModal.tsx';
import ProfileModal from './components/ProfileModal.tsx';
import BackgroundScrollCanvas from './components/BackgroundScrollCanvas.tsx';
import MobileBottomNav from './components/MobileBottomNav.tsx';

export default function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'services' | 'about' | 'contact'>('home');
  
  // Auth state with strict 7-day session persistence
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const sessionRaw = localStorage.getItem('genowl_current_session');
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        // Check if session is within the 7-day active window
        if (session.expiresAt && Date.now() < session.expiresAt) {
          return session.user;
        } else {
          // Session expired (> 7 days) -> remove session so user logs in again
          localStorage.removeItem('genowl_current_session');
          localStorage.removeItem('genowl_user');
          return null;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [pendingService, setPendingService] = useState<string | null>(null);

  // Order & Checkout Modal
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('2D Website');

  // Legal Modal (Terms & Conditions, Privacy Policy, Refund Policy)
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<'terms' | 'privacy' | 'refund'>('terms');

  // Admin Dashboard Modal (Master Password protected)
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Client Profile & Projects Hub Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Smooth scroll to requested section with floating navbar offset
  const handleNavigate = (sectionId: string) => {
    const id = sectionId.toLowerCase();
    setActiveSection(id as any);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - navOffset),
        behavior: 'smooth'
      });
    }
  };

  // Smart Gated "Get Started" & Service Order Trigger
  const handleOpenOrder = (serviceName: string = '2D Website') => {
    setSelectedService(serviceName);

    if (!currentUser) {
      // User is not signed in or session expired (> 7 days): prompt AuthModal!
      setPendingService(serviceName);

      // Check if any registered user accounts already exist
      let hasAccounts = false;
      try {
        const raw = localStorage.getItem('genowl_registered_users');
        hasAccounts = Boolean(raw && JSON.parse(raw).length > 0);
      } catch {}

      // Returning users get 'signin', brand new visitors get 'signup'
      setAuthMode(hasAccounts ? 'signin' : 'signup');
      setAuthModalOpen(true);
    } else {
      // User is already signed in (< 7 days): proceed straight to order modal without any login popup!
      setOrderModalOpen(true);
    }
  };

  // When user completes sign-up or sign-in
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (pendingService) {
      setSelectedService(pendingService);
      setOrderModalOpen(true);
      setPendingService(null);
    }
  };

  // Sign out handler (Clears active session, retains registered user in registry)
  const handleSignOut = () => {
    localStorage.removeItem('genowl_current_session');
    localStorage.removeItem('genowl_user');
    setCurrentUser(null);
  };

  // Open Legal Modal helper
  const handleOpenLegal = (tab: 'terms' | 'privacy' | 'refund' = 'terms') => {
    setActiveLegalTab(tab);
    setLegalModalOpen(true);
  };

  // ScrollSpy: dynamically updates Navbar active indicator
  useEffect(() => {
    const sectionIds = ['home', 'services', 'about', 'contact'];
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportOffset = window.innerHeight * 0.35;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY + viewportOffset >= top && scrollY + viewportOffset < top + height) {
            setActiveSection(id as any);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#070a07] text-white selection:bg-[#c6f554]/30 selection:text-[#c6f554] relative overflow-x-clip">
      
      {/* 1. Persistent 240-Frame Canvas Scroll Animation in Background */}
      <BackgroundScrollCanvas />

      {/* 2. Floating Top Navbar with Auth State */}
      <Navbar
        currentPage={activeSection}
        onNavigate={handleNavigate}
        onOpenOrder={handleOpenOrder}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setPendingService(null);
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* 3. Sequential Scroll-Based Pages */}
      <main className="relative z-10 flex flex-col w-full">
        
        {/* PAGE 1: Home (Hero & FeatureCards) */}
        <section id="home" className="w-full flex flex-col justify-between pt-6 sm:pt-8 pb-16">
          <Hero onStartTrial={() => handleOpenOrder('2D Website')} />
          <div className="pt-4">
            <FeatureCards />
          </div>
        </section>

        {/* PAGE 2: Services & Transparent Pricing */}
        <section id="services" className="w-full min-h-screen flex flex-col justify-center py-12">
          <ServicesPage
            onSelectService={(srv) => handleOpenOrder(srv)}
            onNavigateContact={() => handleNavigate('contact')}
          />
        </section>

        {/* PAGE 3: About & Core Philosophy */}
        <section id="about" className="w-full min-h-screen flex flex-col justify-center py-12">
          <AboutPage
            onNavigateServices={() => handleNavigate('services')}
            onNavigateContact={() => handleNavigate('contact')}
          />
        </section>

        {/* PAGE 4: Contact & Direct Inquiries */}
        <section id="contact" className="w-full min-h-screen flex flex-col justify-center py-12">
          <ContactPage
            initialService={selectedService}
            onNavigateServices={() => handleNavigate('services')}
          />
        </section>

        {/* Persistent Footer with Legal Compliance & Admin Portal Access */}
        <Footer
          currentPage={activeSection}
          onNavigate={handleNavigate}
          onOpenLegal={handleOpenLegal}
          onOpenAdmin={() => setAdminModalOpen(true)}
        />

        {/* Mobile Floating Thumb Navigation Dock (Hidden on PC, active on Mobile) */}
        <MobileBottomNav
          currentPage={activeSection}
          onNavigate={handleNavigate}
          onOpenOrder={handleOpenOrder}
          currentUser={currentUser}
          onOpenProfile={() => setProfileModalOpen(true)}
        />
      </main>

      {/* Native Sign-Up & Sign-In Modal (7-Day Persistent Memory) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingService(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        onOpenLegal={handleOpenLegal}
        initialMode={authMode}
        customTitle={pendingService ? `Sign in to order ${pendingService}` : undefined}
        customSubtitle={
          pendingService
            ? `Please sign up or sign in to proceed with your $99 ${pendingService} order.`
            : undefined
        }
      />

      {/* Service Order & Checkout Modal ($99 flat fee) */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        initialService={selectedService}
        currentUser={currentUser}
        onOpenLegal={handleOpenLegal}
      />

      {/* Comprehensive Legal Center (Terms & Conditions, Privacy Policy, Refund Policy) */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={activeLegalTab}
      />

      {/* Master Password Protected Admin Dashboard */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {/* Live Client Profile, Active Projects & Payment History Hub */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenOrder={handleOpenOrder}
      />
    </div>
  );
}
