import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useCart } from '../context/CartContext';
import { Sparkles, Heart, HandHeart, ShoppingBag, Share2, Award, Users, Leaf, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MissionPage({ onNavigate }) {
  const { products, missionConfig } = useSiteConfig();
  const { setQuickViewProduct } = useCart();

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

  const impactStats = [
    { number: "50+", label: "Artisans Supported", desc: "Children & specially-abled creators receiving training and fair wages", icon: Users },
    { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth and devotion", icon: Sparkles },
    { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically with zero harmful chemicals", icon: Leaf },
    { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance and artistic celebration over charity", icon: Award },
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
      
      {/* 1. Page Header & Breadcrumb */}
      <section className="bg-gradient-to-r from-[#1b072a] via-[#2f084a] to-[#1b072a] text-white py-10 sm:py-16 relative overflow-hidden border-b-2 border-[#fdb927]/40 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fdb927]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7b1fa2]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#fdb927]/80 mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-white">Our Mission (CSR)</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/20 border border-[#fdb927]/40 px-3.5 py-1 rounded-full text-xs font-black text-[#fdb927] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-[#FFF5C0] font-bold mb-2">
              {leadText}
            </p>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
              {believeText} {descText}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Impact Statistics Counters */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {impactStats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-5 border-2 border-[#fdb927]/40 shadow-lg hover:shadow-xl hover:border-[#fdb927] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-playfair text-3xl sm:text-4xl font-black text-[#1b072a]">
                    {stat.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#fdb927]/20 text-[#1b072a] flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-gray-900 mb-1">
                  {stat.label}
                </h3>
                <p className="text-[11px] text-gray-500 leading-snug">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Hero Visual Image Banner */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl border-2 border-[#fdb927]/40 shadow-xl overflow-hidden">
          <img
            src={missionConfig?.missionImage || missionConfig?.imageUrl || "/images/about1.png"}
            alt="Talented children with physical challenges creating handmade festive products"
            className="w-full h-auto object-cover max-h-[550px]"
          />
        </div>
      </section>

      {/* 4. The 4-Step Crafting Journey */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#1b072a] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
            <span>THE ARTISANAL PROCESS</span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            How Every Diya Comes to Life
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Over two hours of dedicated artistic care and patience poured into each piece.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {craftSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#fdb927]/70 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="text-3xl font-black font-playfair text-[#fdb927]/70 mb-2">
                {step.step}
              </div>
              <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900 mb-1.5">
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
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          
          <div className="bg-gradient-to-b from-[#FAF7F2] to-white p-6 rounded-2xl border border-[#fdb927]/30 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#280a3e] flex items-center justify-center mb-3">
              <HandHeart className="w-5 h-5" />
            </div>
            <h3 className="font-playfair text-base font-bold text-gray-900 mb-1.5">
              Dignity Over Charity
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We empower children with physical challenges through their skills, not pity. Every rupee earned is a symbol of their hard work, self-reliance and artistic pride.
            </p>
          </div>

          <div className="bg-gradient-to-b from-[#FAF7F2] to-white p-6 rounded-2xl border border-[#fdb927]/30 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-playfair text-base font-bold text-gray-900 mb-1.5">
              Preserving Indian Craft
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We uphold the age-old tradition of Indian earthenware pottery while introducing modern, elegant gold scalloped finishes suited for contemporary festive homes.
            </p>
          </div>

          <div className="bg-gradient-to-b from-[#FAF7F2] to-white p-6 rounded-2xl border border-[#fdb927]/30 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-playfair text-base font-bold text-gray-900 mb-1.5">
              Empowering Creative Talent
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Purchasing from Seasonals directly sponsors vocational skill workshops and educational resources for specially-abled youth across our communities.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-14">
        <div className="bg-[#1b072a] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#fdb927]/50 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#fdb927] to-[#e69500] hover:from-[#ffc84a] hover:to-[#fdb927] text-[#1b072a] font-black text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-[0_4px_18px_rgba(253,185,39,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collection</span>
            </button>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-white hover:text-[#fdb927] px-6 py-3.5 rounded-full border border-white/20 hover:border-[#fdb927] bg-white/5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Cause on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
