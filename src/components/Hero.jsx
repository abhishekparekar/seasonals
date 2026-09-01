import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import BannerBackground from './BannerBackground';

export default function Hero({ onNavigate }) {
  const { heroConfig } = useSiteConfig();

  const heroImages = Array.isArray(heroConfig?.bgImages) && heroConfig.bgImages.length > 0
    ? heroConfig.bgImages
    : (heroConfig?.bgImage || heroConfig?.backgroundImage ? [heroConfig.bgImage || heroConfig.backgroundImage] : []);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center text-white py-14 sm:py-20 md:py-24 overflow-hidden font-inter transition-all duration-300 min-h-[360px] sm:min-h-[440px] border-b-2 border-[#fdb927]/40 shadow-lg"
    >
      {/* Dynamic Animated Multi-Image Background */}
      <BannerBackground
        images={heroImages}
      />

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
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.18] tracking-tight mb-3 sm:mb-4 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)] [text-shadow:_0_2px_12px_rgba(0,0,0,1),_0_1px_4px_rgba(0,0,0,1)]">
          {heroConfig.titleLine1 || "Celebrate Joy."}{' '}
          <span className="text-[#FFF5C0] drop-shadow-[0_4px_16px_rgba(0,0,0,1)] [text-shadow:_0_2px_14px_rgba(0,0,0,1),_0_0_10px_rgba(0,0,0,1)] block sm:inline font-extrabold">
            {heroConfig.titleHighlight || "Gift with Purpose."}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-4 sm:mb-5 leading-relaxed font-semibold drop-shadow-[0_3px_12px_rgba(0,0,0,1)] [text-shadow:_0_1px_8px_rgba(0,0,0,1),_0_2px_4px_rgba(0,0,0,1)]">
          {heroConfig.subtitle || "Discover beautiful handmade festive products, thoughtfully created by talented children with physical challenges. Every purchase celebrates their creativity and helps create meaningful opportunities."}
        </p>

        {/* Offer Tag Pill */}
        {heroConfig.showPricePill !== false && heroConfig.offerTag && (
          <div className="inline-flex items-center gap-2 bg-[#1b072a]/90 backdrop-blur-md border border-[#fdb927]/60 px-4 sm:px-5 py-2.5 rounded-full shadow-lg mt-2">
            <span className="text-xs sm:text-sm font-bold text-[#fdb927] flex items-center gap-1.5">
              <span>🪔</span>
              <span>{heroConfig.offerTag}</span>
            </span>
          </div>
        )}

      </div>
    </section>
  );
}
