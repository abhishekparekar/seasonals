import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function PromoBanner() {
  const { setQuickViewProduct } = useCart();
  const { products, whatsappConfig } = useSiteConfig();

  const handleOrderClick = () => {
    if (products && products.length > 0) {
      setQuickViewProduct(products[0]);
    }
  };

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappConfig.defaultMessage || "Hello Seasonals! 🪔 I have an inquiry regarding your Festive Clay Diya collections & bulk festive gifting. Could you please share the details? Thank you!")}`;

  return (
    <section className="py-5 sm:py-8 bg-white w-full font-inter">
      <div className="w-full px-2.5 sm:px-6 lg:px-10">
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
              <span>Diwali Festive Special Celebration</span>
            </motion.div>

            <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-2 sm:mb-3">
              Make this Diwali <br className="hidden sm:inline" />
              <span className="text-[#fdb927] drop-shadow-[0_2px_15px_rgba(253,185,39,0.4)]">
                Extra Special
              </span>
            </h3>

            <p className="text-white/85 text-xs sm:text-sm lg:text-base mb-5 leading-relaxed">
              Celebrate traditional joy, warmth, and auspicious light with your family. Get authentic handcrafted terracotta floral diyas delivered directly to your doorstep.
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
                <span>Order Now</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-white/90 hover:text-[#fdb927] px-5 py-3 rounded-full border border-white/25 hover:border-[#fdb927] bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>WhatsApp Support 💬</span>
              </motion.a>
            </div>
          </div>

          {/* Right Visual Side - promo1.jpg */}
          <div className="relative z-10 flex-shrink-0 w-full lg:w-auto flex items-center justify-center">
            <div className="relative max-w-md w-full rounded-2xl overflow-hidden border-2 border-[#fdb927]/40 shadow-2xl group bg-black/20">
              
              {/* Photo */}
              <img
                src="/images/promo1.jpg"
                alt="Diwali Festive Celebration"
                className="w-full h-56 sm:h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Bottom Overlay for festive caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b072a]/90 via-transparent to-transparent flex items-end p-4 pointer-events-none">
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-[#fdb927] text-xs font-bold">
                    <span>🪔</span>
                    <span>Lighting Joy in Every Home</span>
                  </div>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    Traditional clay diyas for joyful family celebrations
                  </p>
                </div>
              </div>

              {/* Sparkle badge */}
              <span className="absolute top-3 right-3 text-lg bg-[#1b072a]/80 backdrop-blur-md p-1.5 rounded-full border border-[#fdb927]/40 shadow">
                ✨
              </span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
