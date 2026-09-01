import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, HandHeart, ShoppingBag, Share2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function AboutCSR({ onNavigate, isPreview = false }) {
  const { setQuickViewProduct } = useCart();
  const { products, missionConfig } = useSiteConfig();
  const [currentShowcaseIdx, setCurrentShowcaseIdx] = useState(0);

  const badgeText = missionConfig?.badgeText || "Our Mission";
  const title = missionConfig?.title || "More Than a Product. A Story of Possibility.";
  const leadText = missionConfig?.leadText || "Behind every handmade creation is a child with imagination, patience and talent.";
  const believeText = missionConfig?.believeText || "We believe physical challenges should never limit a child's opportunity to create, learn and contribute.";
  const descText = missionConfig?.descText || "Our products are made with care by children with physical challenges, giving them a platform to express their creativity, develop skills and experience the pride of seeing their work become part of someone's celebration.";

  // Multi-image showcase array from admin
  const rawShowcase = Array.isArray(missionConfig?.showcaseImages) && missionConfig.showcaseImages.length > 0
    ? missionConfig.showcaseImages
    : (missionConfig?.missionImage ? [missionConfig.missionImage] : []);

  const showcaseImages = rawShowcase.filter(Boolean);

  useEffect(() => {
    if (showcaseImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentShowcaseIdx((prev) => (prev + 1) % showcaseImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [showcaseImages.length]);

  const prevShowcase = () => {
    setCurrentShowcaseIdx((prev) => (prev === 0 ? showcaseImages.length - 1 : prev - 1));
  };

  const nextShowcase = () => {
    setCurrentShowcaseIdx((prev) => (prev + 1) % showcaseImages.length);
  };

  const handleSupportOrder = () => {
    if (products && products.length > 0) {
      setQuickViewProduct(products[0]);
    } else if (onNavigate) {
      onNavigate('shop');
    }
  };

  const shareText = "🪔 Seasonals - A small act of kindness empowers specially-abled artisans. This Diwali, bring home authentic handcrafted terracotta diyas made with devotion:";
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + (typeof window !== 'undefined' ? window.location.origin : ''))}`;

  return (
    <section id="mission" className="py-8 sm:py-12 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] w-full font-inter relative overflow-hidden">
      {/* Decorative subtle festive glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#280a3e]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading matching exact Bestsellers design */}
        <div className="text-center w-full mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/35 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#1b072a] mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
            <span>{badgeText}</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-[1.5px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-[#fdb927]"></span>
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h2>
            <span className="h-[1.5px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-[#fdb927]"></span>
          </div>

          {leadText && (
            <p className="max-w-2xl mx-auto text-xs sm:text-sm font-semibold text-[#8a4209] leading-relaxed">
              {leadText}
            </p>
          )}
        </div>

        {/* Full-Screen Edge-to-Edge Mission Banner Multi-Image Showcase Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#1b072a] rounded-3xl border-2 border-[#fdb927]/40 shadow-xl overflow-hidden mb-6 sm:mb-8 w-full relative min-h-[260px] sm:min-h-[420px] md:min-h-[500px] max-h-[580px] flex items-center justify-center"
        >
          {showcaseImages.length > 0 ? (
            <>
              {showcaseImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentShowcaseIdx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`Artisanal Crafting Showcase ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Prev / Next Arrows if Multiple Showcase Images */}
              {showcaseImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevShowcase}
                    aria-label="Previous image"
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-[#fdb927]/50 flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextShowcase}
                    aria-label="Next image"
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-[#fdb927]/50 flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    {showcaseImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentShowcaseIdx(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentShowcaseIdx ? 'w-6 bg-[#fdb927]' : 'w-2 bg-white/50 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Image Counter Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 bg-black/70 backdrop-blur-md border border-[#fdb927]/40 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black text-[#fdb927]">
                    📷 {currentShowcaseIdx + 1} / {showcaseImages.length}
                  </div>
                </>
              )}
            </>
          ) : null}
        </motion.div>

        {/* Dedicated Premium Mission Belief & Purpose Card (Rich UI/UX) */}
        {(believeText || descText) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6 sm:mb-8 bg-gradient-to-br from-[#1b072a] via-[#2a0b42] to-[#1b072a] rounded-3xl p-5 sm:p-7 border-2 border-[#fdb927]/50 shadow-xl relative overflow-hidden text-white"
          >
            {/* Background Festive Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fdb927]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 justify-between">
              <div className="space-y-2.5 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/20 border border-[#fdb927]/40 px-3 py-1 rounded-full text-[11px] font-extrabold text-[#fdb927]">
                  <span>🪔</span>
                  <span>OUR CORE BELIEF & PURPOSE</span>
                </div>

                {believeText && (
                  <blockquote className="font-playfair text-base sm:text-xl font-bold text-[#FFF5C0] italic leading-snug">
                    "{believeText}"
                  </blockquote>
                )}

                {descText && (
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
                    {descText}
                  </p>
                )}
              </div>

              {/* Decorative Trust Badge */}
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-[#fdb927]/30 rounded-2xl p-3.5 text-center hidden lg:block min-w-[170px]">
                <span className="text-2xl block mb-1">✨</span>
                <span className="text-[11px] font-bold text-[#fdb927] uppercase tracking-wider block">
                  100% Handcrafted
                </span>
                <span className="text-[10px] text-white/70 block mt-0.5">
                  By Specially-Abled Artisans
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3 Core Impact Pillars - Compact & Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 w-full mb-6 sm:mb-8">
          
          {/* Pillar 1 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-gradient-to-b from-[#FAF7F2] via-white to-white p-3.5 sm:p-5 rounded-2xl border border-[#fdb927]/30 shadow-sm hover:border-[#fdb927] hover:shadow-[0_8px_20px_rgba(40,10,62,0.12)] transition-all group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-[#280a3e] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <HandHeart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-playfair text-xs sm:text-base font-bold text-gray-900 mb-1 leading-snug group-hover:text-[#280a3e] transition-colors">
              Celebrating Pure Talent & Capability
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
              We spotlight creativity and skill, ensuring children with physical challenges receive 100% fair compensation and full respect for their artistic talent.
            </p>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="bg-gradient-to-b from-[#FAF7F2] via-white to-white p-3.5 sm:p-5 rounded-2xl border border-[#fdb927]/30 shadow-sm hover:border-[#fdb927] hover:shadow-[0_8px_20px_rgba(253,185,39,0.18)] transition-all group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-playfair text-xs sm:text-base font-bold text-gray-900 mb-1 leading-snug group-hover:text-[#b37400] transition-colors">
              Handcrafted & Eco-Friendly
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
              Crafted from pure organic terracotta clay with traditional floral patterns and finished with festive metallic gold scalloped rims.
            </p>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="bg-gradient-to-b from-[#FAF7F2] via-white to-white p-3.5 sm:p-5 rounded-2xl border border-[#fdb927]/30 shadow-sm hover:border-[#fdb927] hover:shadow-[0_8px_20px_rgba(16,185,129,0.12)] transition-all group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-playfair text-xs sm:text-base font-bold text-gray-900 mb-1 leading-snug group-hover:text-emerald-700 transition-colors">
              Empowering Creative Talent
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
              Your festive purchase directly supports skill workshops, artistic development, and long-term empowerment for children with physical challenges.
            </p>
          </motion.div>
        </div>

        {/* Read Full Mission CTA if Preview */}
        {isPreview && onNavigate && (
          <div className="text-center mb-6">
            <button
              onClick={() => onNavigate('mission')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#b45309] hover:text-[#92400e] bg-[#fdb927]/15 hover:bg-[#fdb927]/25 px-5 py-2.5 rounded-full transition-all border border-[#fdb927]/40 cursor-pointer"
            >
              <span>Read Our Complete Social Impact Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Call to Action Box - Full Width English */}
        <div className="bg-[#1b072a] text-white rounded-3xl p-5 sm:p-8 w-full border border-[#fdb927]/30 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[#fdb927] text-xs font-bold uppercase tracking-wider block">
              Celebrate With Purpose • The True Joy of Giving
            </span>
            <h4 className="font-playfair text-lg sm:text-xl font-bold text-white">
              Support Children With Physical Challenges & Bring Home Auspicious Light
            </h4>
            <p className="text-xs text-white/75">
              Each handcrafted pack ordered directly celebrates their creativity and supports self-sufficiency and dignified expression.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleSupportOrder}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_16px_rgba(253,185,39,0.35)] hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Handcrafted Diyas</span>
            </button>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-white/90 hover:text-[#fdb927] px-5 py-3 rounded-full border border-white/20 hover:border-[#fdb927] bg-white/5 transition-all"
              title="Share cause on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp 💬</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
