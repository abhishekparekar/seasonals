import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BestSellers from './components/BestSellers';
import Reviews from './components/Reviews';
import AboutCSR from './components/AboutCSR';
import OurStory from './components/OurStory';
import PromoBanner from './components/PromoBanner';
import Features from './components/Features';
import InquiryForm from './components/InquiryForm';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import WhatsAppButton from './components/WhatsAppButton';
import LegalModal from './components/LegalModal';
import { AnimatePresence, motion } from 'framer-motion';

function checkIsAdminRoute() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#admin' ||
    search.includes('admin=true')
  );
}

function MainContent() {
  const { toastMessage } = useCart();
  const [isAdminView, setIsAdminView] = useState(() => checkIsAdminRoute());
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState('privacy');

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(checkIsAdminRoute());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const openAdmin = () => {
    try {
      window.history.pushState(null, '', '/admin');
    } catch (e) {}
    setIsAdminView(true);
  };

  const closeAdmin = () => {
    try {
      window.history.pushState(null, '', '/');
    } catch (e) {}
    setIsAdminView(false);
  };

  const openLegalModal = (docType = 'privacy') => {
    setActiveLegalDoc(docType);
    setLegalModalOpen(true);
  };

  const scrollToProducts = () => {
    const elem = document.querySelector('#bestsellers');
    if (elem) {
      const navOffset = 60;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // If path is /admin or #admin, render Admin Panel
  if (isAdminView) {
    return <AdminPanel onBackToHome={closeAdmin} />;
  }

  // Default Storefront Landing Page
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

      {/* 1. Navigation Header */}
      <Navbar onOpenAdmin={openAdmin} />

      {/* 2. Compact Centered Hero Section (Dynamic Texts & Floating Popping Diyas) */}
      <Hero />

      {/* 3. Products / Bestsellers Showcase (Clean Transparent Prices, No Discounts) */}
      <div id="products">
        <BestSellers onExploreMore={scrollToProducts} />
      </div>

      {/* 4. About Us & CSR Social Mission */}
      <AboutCSR />

      {/* 5. Our Story - The Inspiring Journey */}
      <OurStory />

      {/* 5. Promotional Festive Banner */}
      <PromoBanner />

      {/* 6. The Seasonals Promise / Why Choose Us */}
      <Features />

      {/* 7. Customer Testimonials & Verified Reviews (After The Seasonals Promise) */}
      <Reviews />

      {/* 8. Dedicated Inquiries & Bulk Orders Form (Connected to Firestore) */}
      <InquiryForm />

      {/* 9. Footer with Legal Policies & Direct Support */}
      <Footer onOpenLegal={openLegalModal} />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton />

      {/* Interactive Compact In-App Order Form Modal (No Image Preview, Clean Razorpay & COD) */}
      <ProductModal />

      {/* Cart Drawer for multi-item orders */}
      <CartDrawer />

      {/* Professional Legal Policy Modal (Privacy Policy / Terms / Shipping) */}
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
