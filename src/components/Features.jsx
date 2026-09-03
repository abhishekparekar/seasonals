import React from 'react';
import { Award, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Features() {
  const { footerConfig } = useSiteConfig();
  const phone = footerConfig.supportPhone || "+91 91353 13565";

  const trustBadges = [
    {
      icon: Award,
      title: "100% Pure Organic Clay",
      subtitle: "Handmade by local Indian artisans with authentic terracotta & golden rims."
    },
    {
      icon: ShieldCheck,
      title: "Direct WhatsApp Booking",
      subtitle: `Instant booking confirmation & personal support on ${phone}.`
    },
    {
      icon: Truck,
      title: "Doorstep Fast Dispatch",
      subtitle: "Dispatched promptly to reach your doorstep safely for your celebrations."
    },
    {
      icon: Sparkles,
      title: "Zero-Breakage Packaging",
      subtitle: "Multi-layer bubble box packing guarantees safe transit with zero damage."
    }
  ];

  return (
    <section id="features" className="py-7 sm:py-12 bg-white border-t border-gray-100 w-full font-inter">
      <div className="w-full px-3 sm:px-6 lg:px-10">
        
        {/* Section Heading */}
        <div className="text-center mb-5 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
            <span className="h-[1px] w-8 sm:w-16 bg-[#fdb927]/60"></span>
            <span className="text-xs sm:text-sm font-bold text-[#fdb927] tracking-wider uppercase">
              The Seasonals Promise
            </span>
            <span className="h-[1px] w-8 sm:w-16 bg-[#fdb927]/60"></span>
          </div>
          <h2 className="font-playfair text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight">
            Why Choose Our Handcrafted Creations?
          </h2>
        </div>

        {/* 4 Premium Compact Trust Cards (2 cols on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="bg-gradient-to-b from-[#FAF7F2] via-white to-white rounded-2xl p-3 sm:p-5 border border-[#fdb927]/30 shadow-sm hover:shadow-[0_8px_20px_rgba(253,185,39,0.18)] hover:border-[#fdb927] transition-all duration-300 flex flex-col justify-between group cursor-default"
              >
                <div>
                  {/* Top Golden Icon */}
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#1b072a] text-[#fdb927] border border-[#fdb927]/40 flex items-center justify-center mb-2.5 shadow-md group-hover:scale-105 group-hover:bg-[#280a3e] transition-all duration-300">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-6 transition-transform duration-300" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="font-playfair font-bold text-xs sm:text-base text-gray-950 mb-1 leading-snug group-hover:text-[#280a3e] transition-colors">
                    {badge.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[11px] sm:text-xs text-gray-800 leading-relaxed font-medium">
                    {badge.subtitle}
                  </p>
                </div>

                {/* Bottom Verified Tag */}
                <div className="pt-2 mt-2 border-t border-gray-100 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                  <span>Verified Festive Quality</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
