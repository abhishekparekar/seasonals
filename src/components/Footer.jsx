import React from 'react';
import { Sparkles, ShieldCheck, MapPin, Lock, FileText, Truck, HeartHandshake } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Footer({ onOpenLegal, onNavigate }) {
  const { footerConfig, whatsappConfig } = useSiteConfig();

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappConfig.defaultMessage || "Hello Seasonals! 🪔 I have an inquiry regarding your Handcrafted Festive Clay Diya Sets. Could you please share product availability & delivery details? Thank you!")}`;

  const handleLink = (e, pageId) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  return (
    <footer id="contact" className="bg-gradient-to-b from-[#180528] via-[#120220] to-[#0a0112] text-white border-t-2 border-[#fdb927]/30 pt-8 sm:pt-10 pb-5 sm:pb-6 relative overflow-hidden font-inter w-full shadow-2xl">
      {/* Background ambient golden glow decoration */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-80 h-32 bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-80 h-32 bg-[#7b1fa2]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-white/10">
          
          {/* Column 1: Brand & Craftsmanship */}
          <div className="space-y-3">
            <button
              onClick={(e) => handleLink(e, 'home')}
              className="relative inline-block group focus:outline-none py-0.5 cursor-pointer text-left"
            >
              <div className="absolute -inset-1.5 bg-[#fdb927]/20 rounded-full blur-md group-hover:bg-[#fdb927]/30 transition-all pointer-events-none"></div>
              <img
                src="/images/logo3.png"
                alt="Seasonals Logo"
                className="relative z-10 h-9 sm:h-10 w-auto max-w-[155px] sm:max-w-[175px] object-contain brightness-110 contrast-105 drop-shadow-[0_2px_10px_rgba(253,185,39,0.4)] group-hover:scale-105 transition-transform"
              />
            </button>

            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              {footerConfig.brandBio || "Handcrafted organic clay diyas made with traditional terracotta pottery and hand-painted metallic gold rims to bring auspicious light and joy to your festive celebrations."}
            </p>
          </div>

          {/* Column 2: Explore Pages */}
          <div>
            <h4 className="font-playfair text-sm sm:text-base font-bold uppercase tracking-wider text-[#fdb927] mb-3">
              Explore Pages
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <button onClick={(e) => handleLink(e, 'home')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Home Page
                </button>
              </li>
              <li>
                <button onClick={(e) => handleLink(e, 'shop')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Handcrafted Diya Shop
                </button>
              </li>
              <li>
                <button onClick={(e) => handleLink(e, 'mission')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Our Social Mission (CSR)
                </button>
              </li>
              <li>
                <button onClick={(e) => handleLink(e, 'story')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> The Seasonals Story
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Business & Inquiries */}
          <div>
            <h4 className="font-playfair text-sm sm:text-base font-bold uppercase tracking-wider text-[#fdb927] mb-3">
              Services & Gifting
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <button onClick={(e) => handleLink(e, 'bulk-gifting')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Bulk & Corporate Gifting
                </button>
              </li>
              <li>
                <button onClick={(e) => handleLink(e, 'contact')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Contact & Support Desk
                </button>
              </li>
              <li>
                <button onClick={(e) => handleLink(e, 'bulk-gifting')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Custom Color Inquiries
                </button>
              </li>
              <li>
                <button onClick={(e) => handleLink(e, 'shop')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer text-left">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Value Combos & Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Support, Policies & WhatsApp */}
          <div className="space-y-3">
            <h4 className="font-playfair text-sm sm:text-base font-bold uppercase tracking-wider text-[#fdb927]">
              Customer Care & Orders
            </h4>
            
            <div className="space-y-2.5 text-xs text-white/80">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#fdb927]/50 transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center flex-shrink-0 text-sm">
                  💬
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-bold">WhatsApp Direct Orders:</div>
                  <div className="font-mono font-bold text-white group-hover:text-[#fdb927] transition-colors text-xs">
                    {footerConfig.supportPhone || "+91 91353 13565"}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-2 text-xs text-white/70 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#fdb927]" />
                <span>Safe Transit Bubble Packaging Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Truck className="w-4 h-4 text-[#fdb927]" />
                <span>Doorstep Fast Dispatch & Delivery</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Legal Links */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>
            <p>© 2026 Seasonals. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-white/70">
            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('privacy')}
              className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#fdb927]" />
              <span>Privacy Policy</span>
            </button>

            <span className="text-white/20 hidden sm:inline">•</span>

            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('terms')}
              className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#fdb927]" />
              <span>Terms & Conditions</span>
            </button>

            <span className="text-white/20 hidden sm:inline">•</span>

            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('shipping')}
              className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-[#fdb927]" />
              <span>Shipping & Returns</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
