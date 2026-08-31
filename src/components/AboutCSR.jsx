import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, HandHeart, ShoppingBag, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function AboutCSR() {
  const { setQuickViewProduct } = useCart();
  const { products, missionConfig } = useSiteConfig();

  const badgeText = missionConfig?.badgeText || "Our Mission";
  const title = missionConfig?.title || "More Than a Product. A Story of Possibility.";
  const leadText = missionConfig?.leadText || "Behind every handmade creation is a child with imagination, patience and talent.";
  const believeText = missionConfig?.believeText || "We believe physical challenges should never limit a child's opportunity to create, learn and contribute.";
  const descText = missionConfig?.descText || "Our products are made with care by children with physical challenges, giving them a platform to express their creativity, develop skills and experience the pride of seeing their work become part of someone's celebration.";

  const handleSupportOrder = () => {
    if (products && products.length > 0) {
      setQuickViewProduct(products[0]);
    } else {
      const elem = document.querySelector('#bestsellers');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shareText = "🪔 Seasonals - A small act of kindness empowers specially-abled artisans. This Diwali, bring home authentic handcrafted terracotta diyas made with devotion:";
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + window.location.origin)}`;

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

          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[1.5px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-[#fdb927]"></span>
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h2>
            <span className="h-[1.5px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-[#fdb927]"></span>
          </div>

          <div className="max-w-3xl mx-auto space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
            <p className="font-bold text-sm sm:text-base text-[#280a3e]">
              {leadText}
            </p>
            <p className="font-semibold text-gray-800">
              {believeText}
            </p>
            <p className="text-gray-600">
              {descText}
            </p>
          </div>
        </div>

        {/* Full-Screen Edge-to-Edge Mission Banner Card with about1.png */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border-2 border-[#fdb927]/40 shadow-xl overflow-hidden mb-6 sm:mb-8 w-full"
        >
          <div className="relative group w-full">
            <img
              src={missionConfig?.missionImage || missionConfig?.imageUrl || "/images/about1.png"}
              alt="Talented children with physical challenges handcrafting festive products - Seasonals"
              className="w-full h-auto object-cover max-h-[560px] sm:max-h-[600px]"
            />
          </div>
        </motion.div>

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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_16px_rgba(253,185,39,0.35)] hover:scale-105 transition-all"
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
