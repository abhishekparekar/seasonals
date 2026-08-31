import React from 'react';
import { Sparkles, ShieldCheck, MapPin, Lock, FileText, Truck } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Footer({ onOpenLegal }) {
  const { footerConfig, whatsappConfig } = useSiteConfig();

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappConfig.defaultMessage || "Hello Seasonals! 🪔 I have an inquiry regarding your Handcrafted Festive Clay Diya Sets. Could you please share product availability & delivery details? Thank you!")}`;

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId) || document.getElementById(targetId.replace('#', ''));
    if (element) {
      const navOffset = 65;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer id="contact" className="bg-gradient-to-b from-[#180528] via-[#120220] to-[#0a0112] text-white border-t-2 border-[#fdb927]/30 pt-6 sm:pt-7 pb-4 sm:pb-5 relative overflow-hidden font-inter w-full shadow-2xl">
      {/* Background ambient golden glow decoration */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-80 h-32 bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-80 h-32 bg-[#7b1fa2]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 3-Column Compact Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 lg:gap-8 pb-5 border-b border-white/10">
          
          {/* Column 1: Brand & Craftsmanship */}
          <div className="space-y-2.5 pl-1 sm:pl-3">
            <button onClick={(e) => scrollToSection(e, '#home')} className="relative inline-block group focus:outline-none py-0.5 cursor-pointer text-left">
              <div className="absolute -inset-1.5 bg-[#fdb927]/20 rounded-full blur-md group-hover:bg-[#fdb927]/30 transition-all pointer-events-none"></div>
              <img
                src="/images/logo3.png"
                alt="Seasonals Logo"
                className="relative z-10 h-8 sm:h-9 md:h-10 w-auto max-w-[150px] sm:max-w-[170px] object-contain brightness-110 contrast-105 drop-shadow-[0_2px_10px_rgba(253,185,39,0.4)] group-hover:scale-105 transition-transform"
              />
            </button>

            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              {footerConfig.brandBio || "Handcrafted organic clay diyas made with traditional terracotta pottery and hand-painted metallic gold rims to bring auspicious light and joy to your Diwali festivities."}
            </p>
            
            <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/30 px-2.5 py-1 rounded-lg text-xs text-[#fdb927] font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{footerConfig.specialPriceTag || "Special Pack: ₹120 for Pack of 4"}</span>
            </div>
          </div>

          {/* Column 2: Quick Links & Navigation */}
          <div>
            <h4 className="font-playfair text-sm sm:text-base font-bold uppercase tracking-wider text-[#fdb927] mb-2.5">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-white/80">
              <li>
                <button onClick={(e) => scrollToSection(e, '#home')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Home
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, '#bestsellers')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Handcrafted Diya Sets
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, '#reviews')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Customer Reviews (4.9 ★)
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, '#about')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Our Social Mission (CSR)
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, '#inquiry')} className="hover:text-[#fdb927] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[#fdb927] text-xs font-bold">›</span> Bulk Inquiry & Customization
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support, Policies & WhatsApp */}
          <div className="space-y-2.5">
            <h4 className="font-playfair text-sm sm:text-base font-bold uppercase tracking-wider text-[#fdb927]">
              Customer Support & Policies
            </h4>
            
            <div className="space-y-2 text-xs text-white/80">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#fdb927]/50 transition-all group shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center flex-shrink-0 text-sm">
                  💬
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-bold">WhatsApp Direct Orders & Support:</div>
                  <div className="font-mono font-bold text-white group-hover:text-[#fdb927] transition-colors text-xs">
                    {footerConfig.supportPhone || "+91 91353 13565"}
                  </div>
                </div>
              </a>


              <div className="flex items-center gap-2 text-xs text-white/60 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#fdb927]" />
                <span>Safe Transit Bubble Packaging Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <MapPin className="w-3.5 h-3.5 text-[#fdb927]" />
                <span>Pan-India Fast Dispatch Available</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Legal Links */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
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
