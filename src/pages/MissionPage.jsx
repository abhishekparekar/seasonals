import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useCart } from '../context/CartContext';
import BannerBackground from '../components/BannerBackground';
import { Sparkles, Heart, HandHeart, ShoppingBag, Share2, Award, Users, Leaf, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MissionPage({ onNavigate }) {
  const { products, missionConfig } = useSiteConfig();
  const { setQuickViewProduct } = useCart();
  const [currentShowcaseIdx, setCurrentShowcaseIdx] = useState(0);

  const missionImages = Array.isArray(missionConfig?.bgImages) && missionConfig.bgImages.length > 0
    ? missionConfig.bgImages
    : (missionConfig?.bgImage ? [missionConfig.bgImage] : []);

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

  const badgeText = missionConfig?.badgeText || "Our Mission & Purpose";
  const title = missionConfig?.title || "More Than a Product. A Story of Possibility.";
  const leadText = missionConfig?.leadText || "Behind every handmade creation is a child with imagination, patience and talent.";
  const believeText = missionConfig?.believeText || "We believe physical challenges should never limit a child's opportunity to create, learn and contribute.";
  const descText = missionConfig?.descText || "Our products are made with care by children with physical challenges, giving them a platform to express their creativity, develop skills and experience the pride of seeing their work become part of someone's celebration.";

  const handleSupportOrder = () => {
    if (products && products.length > 0) {
      setQuickViewProduct(products[0]);
    } else if (onNavigate) {
      onNavigate('shop');
    }
  };

  const shareText = "🪔 Seasonals - A small act of kindness empowers specially-abled artisans. This Diwali, bring home authentic handcrafted terracotta diyas made with devotion:";
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + (typeof window !== 'undefined' ? window.location.origin : ''))}`;

  const defaultStatIcons = [Users, Sparkles, Leaf, Award];
  const activeImpactStats = (Array.isArray(missionConfig?.impactStats) && missionConfig.impactStats.length > 0)
    ? missionConfig.impactStats
    : [
      { number: "50+", label: "Artisans Supported", desc: "Children receiving skill training & fair wages" },
      { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth" },
      { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically" },
      { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance through talent" }
    ];

  const craftSteps = [
    {
      step: "01",
      title: "Pure Clay Sourcing & Shaping",
      desc: "Authentic terracotta clay is traditionally kneaded and hand-molded into deep-reservoir diyas for steady, long-lasting burning."
    },
    {
      step: "02",
      title: "Sun-Cured & Kiln Baking",
      desc: "Each diya is slowly cured under natural sunlight and fired in traditional kilns to achieve robust strength and a warm terracotta hue."
    },
    {
      step: "03",
      title: "Intricate Floral Center Painting",
      desc: "Our young artisans patiently hand-paint rich festive colors (crimson, peacock cyan, royal magenta, emerald) in delicate petal motifs."
    },
    {
      step: "04",
      title: "Gold Scalloped Rim Detailing",
      desc: "A final layer of radiant metallic gold paint is delicately applied along the scalloped rim, creating a regal festive accent."
    }
  ];

  return (
    <div className="w-full font-inter bg-[#FFFDF9] min-h-screen pb-16">

      {/* 1. Page Header matching Hero Section Size */}
      <section className="relative flex items-center justify-center text-white py-14 sm:py-20 md:py-24 overflow-hidden font-inter transition-all duration-300 min-h-[360px] sm:min-h-[440px] border-b-2 border-[#fdb927]/40 shadow-lg">
        <BannerBackground images={missionImages} />

        <div className="w-full px-3.5 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center bg-[#1b072a]/85 backdrop-blur-md border border-[#fdb927]/40 px-4 py-1.5 rounded-full mb-3 sm:mb-4 shadow-lg text-xs sm:text-sm font-semibold text-[#fdb927] tracking-wide gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#fdb927]" />
              <span>{badgeText}</span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold leading-[1.18] tracking-tight mb-3 sm:mb-4 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)] [text-shadow:_0_2px_12px_rgba(0,0,0,1),_0_1px_4px_rgba(0,0,0,1)]">
              {title}
            </h1>

            <p className="text-white text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-semibold drop-shadow-[0_3px_12px_rgba(0,0,0,1)] [text-shadow:_0_1px_8px_rgba(0,0,0,1),_0_2px_4px_rgba(0,0,0,1)]">
              {leadText || descText || believeText}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Strip (Below Header Banner) */}
      <div className="bg-[#FAF7F2] border-b border-[#fdb927]/25 py-2.5 px-3.5 sm:px-6 lg:px-8">
        <div className="w-full flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => onNavigate('home')}
            className="text-gray-500 hover:text-[#b45309] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-[#b45309] font-black">Our Mission (CSR)</span>
        </div>
      </div>

      {/* 2. Impact Statistics Counters */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {activeImpactStats.map((stat, idx) => {
            const IconComp = defaultStatIcons[idx % defaultStatIcons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-3 sm:p-5 border-2 border-[#fdb927]/40 shadow-lg hover:shadow-xl hover:border-[#fdb927] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="font-playfair text-xl sm:text-3xl md:text-4xl font-black text-[#1b072a]">
                    {stat.number}
                  </span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#fdb927]/20 text-[#1b072a] flex items-center justify-center">
                    <IconComp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 mb-0.5 sm:mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 leading-snug hidden sm:block">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Hero Visual Image Banner / Multi-Image Showcase Carousel */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="relative bg-[#1b072a] rounded-2xl sm:rounded-3xl border-2 border-[#fdb927]/40 shadow-xl overflow-hidden min-h-[260px] sm:min-h-[420px] md:min-h-[520px] max-h-[580px] flex items-center justify-center">
          {showcaseImages.length > 0 ? (
            <>
              {showcaseImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentShowcaseIdx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
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
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentShowcaseIdx ? 'w-6 bg-[#fdb927]' : 'w-2 bg-white/50 hover:bg-white'
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
        </div>
      </section>

      {/* 4. The 4-Step Crafting Journey */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#1b072a] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
            <span>THE ARTISANAL PROCESS</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            How Every Diya Comes to Life
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Over two hours of dedicated artistic care and patience poured into each piece.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {craftSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-[#fdb927]/70 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="text-2xl sm:text-3xl font-black font-playfair text-[#fdb927]/80 mb-1 sm:mb-2">
                {step.step}
              </div>
              <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Core Social Mission Pillars */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

          <div className="bg-gradient-to-b from-[#FAF7F2] to-white p-5 sm:p-6 rounded-2xl border border-[#fdb927]/30 shadow-sm">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-[#280a3e] flex items-center justify-center mb-3">
              <HandHeart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-1.5">
              Dignity Over Charity
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We empower children with physical challenges through their skills, not pity. Every rupee earned is a symbol of their hard work, self-reliance and artistic pride.
            </p>
          </div>

          <div className="bg-gradient-to-b from-[#FAF7F2] to-white p-5 sm:p-6 rounded-2xl border border-[#fdb927]/30 shadow-sm">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-1.5">
              Preserving Indian Craft
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We uphold the age-old tradition of Indian earthenware pottery while introducing modern, elegant gold scalloped finishes suited for contemporary festive homes.
            </p>
          </div>

          <div className="bg-gradient-to-b from-[#FAF7F2] to-white p-5 sm:p-6 rounded-2xl border border-[#fdb927]/30 shadow-sm">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-1.5">
              Empowering Creative Talent
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Purchasing from Seasonals directly sponsors vocational skill workshops and educational resources for specially-abled youth across our communities.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="bg-[#1b072a] text-white rounded-3xl p-5 sm:p-8 lg:p-10 border-2 border-[#fdb927]/50 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[#fdb927] text-xs font-bold uppercase tracking-wider block">
              Join The Movement • Light With Purpose
            </span>
            <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Support Specially-Abled Artisans & Bring Joy Home
            </h3>
            <p className="text-xs sm:text-sm text-white/80">
              Each pack purchased directly supports skilled young artisans and lights up both their future and your home festivities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#fdb927] to-[#e69500] hover:from-[#ffc84a] hover:to-[#fdb927] text-[#1b072a] font-black text-xs sm:text-sm px-7 py-3 rounded-full shadow-[0_4px_18px_rgba(253,185,39,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collection</span>
            </button>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-white hover:text-[#fdb927] px-6 py-3 rounded-full border border-white/20 hover:border-[#fdb927] bg-white/5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp 💬</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
