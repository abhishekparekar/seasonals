import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function WhatsAppButton() {
  const { whatsappConfig } = useSiteConfig();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappConfig.defaultMessage || "Hello Seasonals! 🪔 I have an inquiry regarding your Handcrafted Festive Clay Diya Sets. Could you please share product details, pricing, and bulk delivery options? Thank you!")}`;

  return (
    <div className="fixed bottom-10 sm:bottom-12 right-3.5 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto font-inter">
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b072a] text-[#fdb927] border border-[#fdb927]/40 shadow-lg hover:bg-[#fdb927] hover:text-[#1b072a] flex items-center justify-center transition-all duration-300 group"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Action Button */}
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Support"
        className="relative group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl transition-all duration-300"
      >
        {/* Soft pulse ripple */}
        <span className="absolute -inset-1 rounded-full bg-green-500 opacity-40 blur group-hover:opacity-75 animate-ping pointer-events-none"></span>

        {/* WhatsApp Icon */}
        <div className="relative z-10 w-5 h-5 flex items-center justify-center text-sm sm:text-base">
          💬
        </div>

        {/* Text tooltip / label */}
        <span className="relative z-10 text-xs font-semibold tracking-wide pr-1">
          WhatsApp Support
        </span>
      </motion.a>
    </div>
  );
}
