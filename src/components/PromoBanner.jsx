import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function PromoBanner({ onNavigate }) {
  const { setQuickViewProduct } = useCart();
  const { products, promoConfig, whatsappConfig } = useSiteConfig();

  const badgeText = promoConfig?.badgeText || "✨ Festive Celebration Special";
  const titleLine1 = promoConfig?.titleLine1 || "Make Every Celebration";
  const titleHighlight = promoConfig?.titleHighlight || "Extra Special";
  const subtitle = promoConfig?.subtitle || "Celebrate traditional joy, warmth, and special occasions with your family & friends. Get authentic handcrafted products delivered directly to your doorstep.";
  const btnText = promoConfig?.btnText || "Order on WhatsApp";

  const promoImages = Array.isArray(promoConfig?.bgImages) && promoConfig.bgImages.length > 0
    ? promoConfig.bgImages
    : (promoConfig?.bannerImage ? [promoConfig.bannerImage] : []);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (promoImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % promoImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [promoImages.length]);

  const handleOrderClick = () => {
    if (products && products.length > 0) {
      setQuickViewProduct(products[0]);
    } else if (onNavigate) {
      onNavigate('shop');
    }
  };

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappConfig.defaultMessage || "Hello Seasonals! 🪔 I would like to place an order for Handcrafted Festive Diyas.")}`;

  return (
    <section className="py-5 sm:py-8 bg-white w-full font-inter">
      <div className="w-full px-3.5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden bg-[#1b072a] text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-[#fdb927]/40 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10"
        >
          {/* Background animated breathing golden festive glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.12, 0.22, 0.12]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#fdb927] rounded-full blur-3xl pointer-events-none"
          />

          {/* Left Content Side */}
          <div className="text-center lg:text-left z-10 max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/35 px-3.5 py-1 rounded-full text-xs font-bold text-[#fdb927] mb-3 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{badgeText}</span>
            </motion.div>

            <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-2 sm:mb-3">
              {titleLine1} <br className="hidden sm:inline" />
              <span className="text-[#fdb927] drop-shadow-[0_2px_15px_rgba(253,185,39,0.4)]">
                {titleHighlight}
              </span>
            </h3>

            <p className="text-white/85 text-xs sm:text-sm lg:text-base mb-5 leading-relaxed">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              {/* In-app Order Modal CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOrderClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-black text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_18px_rgba(253,185,39,0.4)] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Catalog</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg transition-all"
              >
                <span>💬 Order on WhatsApp</span>
              </motion.a>
            </div>
          </div>

          {/* Right Image Banner Side with Smooth Multi-Image Crossfade */}
          {promoImages.length > 0 && (
            <div className="relative z-10 w-full lg:w-96 flex-shrink-0">
              <div className="relative h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden border-2 border-[#fdb927]/50 shadow-2xl group bg-black/40">
                <AnimatePresence mode="sync">
                  <motion.img
                    key={currentImgIndex}
                    src={promoImages[currentImgIndex]}
                    alt="Festive handmade creations - Seasonals"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1b072a]/70 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-3 left-3 right-3 bg-[#1b072a]/90 backdrop-blur-md p-2 rounded-xl border border-[#fdb927]/40 text-center flex items-center justify-between px-3">
                  <span className="text-[11px] font-extrabold text-[#fdb927] flex items-center gap-1">
                    <span>✨</span>
                    <span>Handcrafted Diya Art</span>
                  </span>
                  
                  {promoImages.length > 1 && (
                    <div className="flex items-center gap-1">
                      {promoImages.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-1.5 rounded-full transition-all ${
                            currentImgIndex === idx ? 'w-4 bg-[#fdb927]' : 'w-1.5 bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </section>
  );
}
