import React from 'react';
import { ShieldCheck, FileText, Truck } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

// Clean, high-fidelity SVG brand icons with sharp rendering
function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer({ onOpenLegal, onNavigate }) {
  const { footerConfig, whatsappConfig, navbarConfig } = useSiteConfig();

  const instagramUrl = footerConfig.instagramUrl || "https://www.instagram.com/seasonals_india?utm_source=qr&stkn=eTZxbjBybGFmMG9o";
  const youtubeUrl = footerConfig.youtubeUrl || "https://www.youtube.com/@SeasonalsIndia";

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappConfig.defaultMessage || "Hello Seasonals! 🪔 I have an inquiry regarding your Handcrafted Festive Clay Diya Sets. Could you please share product availability & delivery details? Thank you!")}`;

  const handleLink = (e, pageId) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  const showHome = navbarConfig?.showHome !== false;
  const showShop = navbarConfig?.showShop !== false;
  const showMission = navbarConfig?.showMission !== false;
  const showStory = navbarConfig?.showStory !== false;
  const showBulk = navbarConfig?.showBulk !== false;
  const showContact = navbarConfig?.showContact !== false;

  return (
    <footer id="contact" className="bg-gradient-to-b from-[#180528] via-[#120220] to-[#0a0112] text-white border-t-2 border-[#fdb927]/30 pt-6 sm:pt-10 pb-6 sm:pb-8 relative overflow-hidden font-inter w-full shadow-2xl">
      {/* Background ambient golden glow decoration */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-80 h-32 bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-80 h-32 bg-[#7b1fa2]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Layout: Clean, compact on mobile, 4-column on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 pb-5 sm:pb-8 border-b border-white/10">
          
          {/* Column 1: Brand Logo & Bio */}
          <div className="space-y-2.5 sm:space-y-3">
            <button
              onClick={(e) => handleLink(e, 'home')}
              className="relative inline-block group focus:outline-none py-0.5 cursor-pointer text-left"
            >
              <div className="absolute -inset-1.5 bg-[#fdb927]/20 rounded-full blur-md group-hover:bg-[#fdb927]/30 transition-all pointer-events-none"></div>
              <img
                src="/images/logo3.png"
                alt="Seasonals Logo"
                className="relative z-10 h-8 sm:h-9 w-auto max-w-[145px] sm:max-w-[170px] object-contain brightness-110 contrast-105 drop-shadow-[0_2px_10px_rgba(253,185,39,0.4)] group-hover:scale-105 transition-transform"
              />
            </button>

            <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed max-w-sm line-clamp-2 sm:line-clamp-none">
              {footerConfig.brandBio || "Handcrafted organic clay diyas made with traditional terracotta pottery and hand-painted metallic gold rims to bring auspicious light and joy to your festive celebrations."}
            </p>
          </div>

          {/* Columns 2 & 3: Compact Side-by-Side 2-Column Grid on Mobile, individual columns on Desktop */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 col-span-1 md:col-span-2 lg:col-span-2 lg:grid-cols-2 py-3 sm:py-0 border-y sm:border-y-0 border-white/10">
            {/* Explore Pages */}
            <div>
              <h4 className="font-playfair text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fdb927] mb-2 sm:mb-3">
                Explore
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs text-white/80">
                {showHome && (
                  <li>
                    <button onClick={(e) => handleLink(e, 'home')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1 cursor-pointer text-left">
                      <span className="text-[#fdb927] text-[10px] font-bold">›</span> Home
                    </button>
                  </li>
                )}
                {showShop && (
                  <li>
                    <button onClick={(e) => handleLink(e, 'shop')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1 cursor-pointer text-left">
                      <span className="text-[#fdb927] text-[10px] font-bold">›</span> Diya Shop
                    </button>
                  </li>
                )}
                {showMission && (
                  <li>
                    <button onClick={(e) => handleLink(e, 'mission')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1 cursor-pointer text-left">
                      <span className="text-[#fdb927] text-[10px] font-bold">›</span> Our Mission
                    </button>
                  </li>
                )}
                {showStory && (
                  <li>
                    <button onClick={(e) => handleLink(e, 'story')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1 cursor-pointer text-left">
                      <span className="text-[#fdb927] text-[10px] font-bold">›</span> Our Story
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Services & Gifting */}
            <div>
              <h4 className="font-playfair text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fdb927] mb-2 sm:mb-3">
                Services
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs text-white/80">
                {showBulk && (
                  <li>
                    <button onClick={(e) => handleLink(e, 'bulk-gifting')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1 cursor-pointer text-left">
                      <span className="text-[#fdb927] text-[10px] font-bold">›</span> Bulk Gifting
                    </button>
                  </li>
                )}
                {showContact && (
                  <li>
                    <button onClick={(e) => handleLink(e, 'contact')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1 cursor-pointer text-left">
                      <span className="text-[#fdb927] text-[10px] font-bold">›</span> Contact Support
                    </button>
                  </li>
                )}
                {showBulk && (
                  <li>
                    <button onClick={(e) => handleLink(e, 'bulk-gifting')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1 cursor-pointer text-left">
                      <span className="text-[#fdb927] text-[10px] font-bold">›</span> Custom Orders
                    </button>
                  </li>
                )}
                {showShop && (
                  <li>
                    <button onClick={(e) => handleLink(e, 'shop')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1 cursor-pointer text-left">
                      <span className="text-[#fdb927] text-[10px] font-bold">›</span> Value Combos
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Column 4: Customer Care & WhatsApp Orders */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="font-playfair text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fdb927]">
              Customer Care
            </h4>
            
            <div className="space-y-2 text-xs text-white/80">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#fdb927]/50 transition-all group shadow-sm"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                  💬
                </div>
                <div>
                  <div className="text-[9px] text-white/50 uppercase font-bold tracking-tight">WhatsApp Direct Orders:</div>
                  <div className="font-mono font-bold text-white group-hover:text-[#fdb927] transition-colors text-xs">
                    {footerConfig.supportPhone || "+91 91353 13565"}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#fdb927] flex-shrink-0" />
                <span>Safe Transit Bubble Packaging</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/70">
                <Truck className="w-3.5 h-3.5 text-[#fdb927] flex-shrink-0" />
                <span>Fast Doorstep Courier Delivery</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright on Left, Social Media with 'Follow Here' in Center, Legal Links on Right */}
        <div className="pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-white/70">
          
          {/* Copyright: Left on Desktop, Bottom on Mobile */}
          <div className="text-center md:text-left order-3 md:order-1">
            <p className="text-[11px] sm:text-xs text-white/60 font-medium">
              © 2026 Seasonals. All rights reserved.
            </p>
          </div>

          {/* Center: Prominent Social Media with 'Follow Here' (Top on Mobile, Center on Desktop) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 order-1 md:order-2">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#fdb927]">
              Follow Here:
            </span>
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Instagram Button */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Seasonals on Instagram (@seasonals_india)"
                title="Follow Seasonals on Instagram"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md hover:shadow-[0_0_18px_rgba(220,39,67,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/25 cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm" />
              </a>

              {/* YouTube Button */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to Seasonals on YouTube (@SeasonalsIndia)"
                title="Subscribe to Seasonals on YouTube"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow-md hover:shadow-[0_0_18px_rgba(255,0,0,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/25 cursor-pointer"
              >
                <YoutubeIcon className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm" />
              </a>
            </div>
          </div>

          {/* Legal Policies: Right on Desktop, Middle on Mobile */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-2.5 sm:gap-x-4 gap-y-1 text-[11px] sm:text-xs text-white/70 order-2 md:order-3">
            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('privacy')}
              className="hover:text-[#fdb927] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-[#fdb927]" />
              <span>Privacy Policy</span>
            </button>

            <span className="text-white/20">•</span>

            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('terms')}
              className="hover:text-[#fdb927] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <FileText className="w-3 h-3 text-[#fdb927]" />
              <span>Terms & Conditions</span>
            </button>

            <span className="text-white/20">•</span>

            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('shipping')}
              className="hover:text-[#fdb927] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <Truck className="w-3 h-3 text-[#fdb927]" />
              <span>Shipping & Returns</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
