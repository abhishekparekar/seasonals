import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { SiteConfigProvider } from './context/SiteConfigContext';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import MissionPage from './pages/MissionPage';
import StoryPage from './pages/StoryPage';
import BulkGiftingPage from './pages/BulkGiftingPage';
import ContactPage from './pages/ContactPage';

// Shared Components & Modals
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import WhatsAppButton from './components/WhatsAppButton';
import LegalModal from './components/LegalModal';
import { AnimatePresence, motion } from 'framer-motion';

function parseCurrentRoute() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace('#', '');
  const search = window.location.search.toLowerCase();

  // Admin Check
  if (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === 'admin' ||
    search.includes('admin=true')
  ) {
    return 'admin';
  }

  // Shop Check
  if (path === '/shop' || hash === 'shop' || hash === 'bestsellers' || hash === 'products') {
    return 'shop';
  }

  // Mission Check
  if (path === '/mission' || path === '/csr' || hash === 'mission' || hash === 'about') {
    return 'mission';
  }

  // Story Check
  if (path === '/story' || hash === 'story') {
    return 'story';
  }

  // Bulk & Corporate Gifting Check
  if (path === '/bulk-gifting' || path === '/corporate' || path === '/inquiry' || hash === 'inquiry' || hash === 'bulk-gifting') {
    return 'bulk-gifting';
  }

  // Contact Check
  if (path === '/contact' || hash === 'contact') {
    return 'contact';
  }

  // Default Home
  return 'home';
}

function getPathForRoute(pageId) {
  switch (pageId) {
    case 'admin':
      return '/admin';
    case 'shop':
      return '/shop';
    case 'mission':
      return '/mission';
    case 'story':
      return '/story';
    case 'bulk-gifting':
      return '/bulk-gifting';
    case 'contact':
      return '/contact';
    case 'home':
    default:
      return '/';
  }
}

function MainContent() {
  const { toastMessage } = useCart();
  const [activePage, setActivePage] = useState(() => parseCurrentRoute());
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState('privacy');

  // Listen to browser Back / Forward events
  useEffect(() => {
    const handleLocationChange = () => {
      setActivePage(parseCurrentRoute());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (pageId) => {
    setActivePage(pageId);
    try {
      const targetPath = getPathForRoute(pageId);
      window.history.pushState({ pageId }, '', targetPath);
    } catch (e) {
      window.location.hash = `#${pageId}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLegalModal = (docType = 'privacy') => {
    setActiveLegalDoc(docType);
    setLegalModalOpen(true);
  };

  // If active page is admin, show Admin Panel
  if (activePage === 'admin') {
    return <AdminPanel onBackToHome={() => navigate('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#fdb927] selection:text-[#1b072a] font-inter bg-white text-darkText">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#210833] text-[#F6B92A] px-5 py-3 rounded-full shadow-2xl border border-[#F6B92A]/40 text-xs sm:text-sm font-semibold flex items-center gap-2 pointer-events-none"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Global Navigation Bar with active page tab */}
      <Navbar
        activePage={activePage}
        onNavigate={navigate}
        onOpenAdmin={() => navigate('admin')}
      />

      {/* 2. Active Page Content with smooth transition */}
      <main className="flex-1 w-full">
        {activePage === 'home' && <HomePage onNavigate={navigate} />}
        {activePage === 'shop' && <ShopPage onNavigate={navigate} />}
        {activePage === 'mission' && <MissionPage onNavigate={navigate} />}
        {activePage === 'story' && <StoryPage onNavigate={navigate} />}
        {activePage === 'bulk-gifting' && <BulkGiftingPage onNavigate={navigate} />}
        {activePage === 'contact' && <ContactPage onNavigate={navigate} />}
      </main>

      {/* 3. Global Footer with Multi-Page Links */}
      <Footer onOpenLegal={openLegalModal} onNavigate={navigate} />

      {/* 4. Global Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* 5. In-App Order Form Modal (Razorpay + COD) */}
      <ProductModal />

      {/* 6. Multi-Item Cart Drawer */}
      <CartDrawer />

      {/* 7. Legal Policies Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        activeDoc={activeLegalDoc}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </SiteConfigProvider>
  );
}
