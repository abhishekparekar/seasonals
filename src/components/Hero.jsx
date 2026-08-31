import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { ShoppingBag } from 'lucide-react';

export default function Hero() {
  const { heroConfig } = useSiteConfig();

  const heroBgImage = heroConfig?.bgImage || heroConfig?.backgroundImage || "/images/herobg2.png";

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

  return (
    <section
      id="home"
      className="relative flex items-center justify-center text-white py-14 sm:py-20 md:py-24 overflow-hidden bg-cover bg-center bg-no-repeat font-inter transition-all duration-300"
      style={{ backgroundImage: `url(${JSON.stringify(heroBgImage)})` }}
    >
      {/* Centered Content Container for all devices */}
      <div className="w-full px-3.5 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Festive Badge Tag */}
        <div className="inline-flex items-center justify-center bg-[#1b072a]/85 backdrop-blur-md border border-[#fdb927]/40 px-4 py-1.5 rounded-full mb-4 shadow-lg">
          <span className="text-xs sm:text-sm font-semibold text-[#fdb927] tracking-wide flex items-center gap-1.5">
            <span>✨</span>
            <span>{heroConfig.badgeText || "Pure Terracotta • Handcrafted with Gold Scalloped Rim"}</span>
          </span>
        </div>

        {/* Main Centered Heading */}
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.18] tracking-tight mb-3 sm:mb-4 text-white">
          {heroConfig.titleLine1 || "Celebrate Joy."}{' '}
          <span className="text-[#fdb927] drop-shadow-[0_2px_15px_rgba(253,185,39,0.5)] block sm:inline">
            {heroConfig.titleHighlight || "Gift with Purpose."}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-4 sm:mb-5 leading-relaxed font-medium">
          {heroConfig.subtitle || "Discover beautiful handmade festive products, thoughtfully created by talented children with physical challenges. Every purchase celebrates their creativity and helps create meaningful opportunities."}
        </p>

        {/* Price & CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Price Pill Highlight (Displayed only if enabled) */}
          {heroConfig.showPricePill !== false && heroConfig.offerTag && (
            <div className="inline-flex items-center gap-2 bg-[#1b072a]/90 backdrop-blur-md border border-[#fdb927]/60 px-4 sm:px-5 py-2.5 rounded-full shadow-lg">
              <span className="text-xs sm:text-sm font-bold text-[#fdb927] flex items-center gap-1.5">
                <span>🪔</span>
                <span>{heroConfig.offerTag}</span>
              </span>
            </div>
          )}

          {/* Primary Button (Displayed only when Admin turns it ON) */}
          {heroConfig.showPrimaryBtn !== false && heroConfig.primaryBtnText && (
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#fdb927] to-[#e69500] hover:from-[#ffc84a] hover:to-[#fdb927] text-[#1b072a] font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-[0_4px_18px_rgba(253,185,39,0.4)] hover:scale-105 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{heroConfig.primaryBtnText}</span>
            </button>
          )}

          {/* Secondary Button (Displayed only when Admin turns it ON) */}
          {heroConfig.showSecondaryBtn && heroConfig.secondaryBtnText && (
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center justify-center gap-2 bg-black/50 hover:bg-black/70 border border-[#fdb927]/60 text-white hover:text-[#fdb927] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all backdrop-blur-md"
            >
              <span>{heroConfig.secondaryBtnText}</span>
            </button>
          )}
        </div>

      </div>

      {/* Curved Bottom Transition into White Section */}
      <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          className="relative block w-full h-6 sm:h-9 md:h-11 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
