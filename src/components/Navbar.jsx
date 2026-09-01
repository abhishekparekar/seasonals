import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { ShoppingBag, Menu, X, ChevronRight, Sparkles, PhoneCall, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ activePage = 'home', onNavigate, onOpenAdmin }) {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { footerConfig, whatsappConfig } = useSiteConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

          // Always show at top of page
          if (currentScrollY <= 40) {
            setIsVisible(true);
            setIsScrolled(false);
          } else {
            setIsScrolled(true);

            // If scrolling down by at least 8px -> hide
            if (currentScrollY > lastScrollY.current + 8) {
              setIsVisible(false);
            }
            // If scrolling up by at least 6px -> show
            else if (currentScrollY < lastScrollY.current - 6) {
              setIsVisible(true);
            }
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' },
    { name: 'Our Mission', id: 'mission' },
    { name: 'Our Story', id: 'story' },
    { name: 'Bulk & Corporate Gifting', id: 'bulk-gifting' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (pageId) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  return (
    <>
      {/* Fixed Header with Hardware Accelerated Auto-Hide Animation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out w-full font-inter transform-gpu ${
          isVisible || isMobileMenuOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          isScrolled
            ? 'bg-[#FFFDF9]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(40,10,62,0.08)] border-b border-[#fdb927]/30'
            : 'bg-[#FFFDF9] border-b border-[#fdb927]/20'
        }`}
      >
        <div className="w-full px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center group focus:outline-none cursor-pointer bg-transparent border-0 p-0"
              aria-label="Seasonals Home"
            >
              <img
                src="/images/logo3.png"
                alt="Seasonals"
                className="h-8 sm:h-9 md:h-10 w-auto max-w-[125px] sm:max-w-[155px] md:max-w-[185px] object-contain drop-shadow-[0_1px_4px_rgba(253,185,39,0.2)] group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Desktop Navigation Links with Active Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-[13px] xl:text-[14px] font-extrabold tracking-tight transition-all duration-200 relative py-2 px-3 xl:px-3.5 whitespace-nowrap cursor-pointer rounded-xl border border-transparent ${
                    isActive
                      ? 'text-[#8f3f00] font-black bg-[#fdb927]/15 border-[#fdb927]/40 shadow-xs'
                      : 'text-[#1b072a] hover:text-[#b45309] hover:bg-[#fdb927]/10'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-[-2px] left-2 right-2 h-[3px] bg-gradient-to-r from-[#fdb927] via-[#ffc84a] to-[#fdb927] rounded-full shadow-[0_2px_8px_rgba(253,185,39,0.6)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Support Their Craft -> Cart -> Order Now + Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Desktop Only: Luxury Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
              className="hidden md:inline-flex relative items-center gap-1.5 sm:gap-2 bg-[#FFF8EB] hover:bg-[#FFF1D6] active:scale-95 text-[#1b072a] font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border-2 border-[#fdb927]/80 shadow-[0_2px_10px_rgba(253,185,39,0.2)] hover:shadow-[0_4px_14px_rgba(253,185,39,0.35)] transition-all cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#9a6400] group-hover:scale-110 transition-transform" />
              </div>

              <span className="text-[12px] xl:text-[13px] font-extrabold text-[#1b072a]">
                Cart
              </span>

              {totalItemsCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#280a3e] text-[#fdb927] text-[10px] md:text-[11px] font-black px-2 py-0.5 rounded-full border border-[#fdb927]/60 shadow-sm animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Desktop Only: "Order Now" CTA Button */}
            <button
              onClick={() => handleLinkClick('shop')}
              className="hidden lg:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#220536] via-[#3d0f5e] to-[#220536] hover:from-[#2f084a] hover:via-[#4c1374] hover:to-[#2f084a] text-[#fdb927] hover:text-[#fff1c2] font-black text-[12px] xl:text-[13px] tracking-wide px-3.5 sm:px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(34,5,54,0.35)] hover:shadow-[0_6px_22px_rgba(253,185,39,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#fdb927]/70 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fdb927] fill-[#fdb927]" />
              <span>Order Now</span>
            </button>

            {/* Mobile / Tablet Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-[#1b072a] hover:text-[#9a6400] rounded-xl transition-colors md:hidden bg-[#1b072a]/5 hover:bg-[#1b072a]/10 border border-[#fdb927]/35 cursor-pointer shadow-sm"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to guarantee proper document flow behind fixed navbar */}
      <div className="h-14 sm:h-16 w-full flex-shrink-0 pointer-events-none" />

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0f0417]/80 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 w-72 sm:w-80 max-w-[85vw] bg-[#FFFDF9] border-l border-[#fdb927]/35 shadow-2xl z-50 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto md:hidden text-[#1b072a] font-inter"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#fdb927]/30">
                  <img
                    src="/images/logo3.png"
                    alt="Seasonals"
                    className="h-8 w-auto max-w-[130px] object-contain"
                  />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-[#fdb927] text-gray-700 hover:text-[#1b072a] transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Clean Navigation Links with Active state */}
                <nav className="mt-4 flex flex-col space-y-1.5">
                  {navLinks.map((link) => {
                    const isActive = activePage === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleLinkClick(link.id)}
                        className={`flex items-center justify-between text-xs sm:text-sm font-extrabold py-2.5 px-3.5 rounded-xl transition-all border text-left cursor-pointer w-full ${
                          isActive
                            ? 'bg-gradient-to-r from-[#1b072a] via-[#330c4e] to-[#1b072a] text-[#fdb927] border-[#fdb927]/70 shadow-md font-black'
                            : 'text-[#1b072a] hover:text-[#b45309] hover:bg-[#fdb927]/15 border-transparent hover:border-[#fdb927]/30'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#fdb927]' : 'text-[#b45309]'}`} />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Quick Actions */}
              <div className="pt-4 border-t border-[#fdb927]/25 space-y-2.5">
                {/* Mobile Drawer Cart Button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full flex items-center justify-between bg-[#FFF8EB] hover:bg-[#FFF1D6] text-[#1b072a] font-bold text-xs py-2.5 px-4 rounded-xl border border-[#fdb927]/60 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#9a6400]" />
                    <span>My Shopping Cart</span>
                  </div>
                  <span className="bg-[#280a3e] text-[#fdb927] font-black text-[11px] px-2 py-0.5 rounded-full border border-[#fdb927]/50">
                    {totalItemsCount}
                  </span>
                </button>

                {/* Mobile Drawer Order Now Button */}
                <button
                  onClick={() => handleLinkClick('shop')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#220536] via-[#3d0f5e] to-[#220536] hover:from-[#2f084a] hover:via-[#4c1374] text-[#fdb927] font-black text-xs py-2.5 rounded-xl shadow-md transition-transform active:scale-95 border-2 border-[#fdb927]/60 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#fdb927] fill-[#fdb927]" />
                  <span>Order Now</span>
                </button>

                {/* Direct WhatsApp Support */}
                <div className="text-center pt-1">
                  <a
                    href={`https://wa.me/91${(whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "")}?text=${encodeURIComponent(whatsappConfig.defaultMessage || "Hello Seasonals! 🪔 I have an inquiry regarding your Handcrafted Festive Clay Diya Sets.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-gray-600 hover:text-[#280a3e] font-semibold"
                  >
                    <PhoneCall className="w-3 h-3 text-[#280a3e]" />
                    <span>WhatsApp: <strong className="text-[#280a3e] underline">{footerConfig.supportPhone || "+91 91353 13565"}</strong></span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
