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
      title: "Pan-India Fast Dispatch",
      subtitle: "Dispatched within 24 hours to reach your doorstep well before Diwali."
    },
    {
      icon: Sparkles,
      title: "Zero-Breakage Packaging",
      subtitle: "Multi-layer bubble box packing guarantees safe transit with zero damage."
    }
  ];

  return (
    <section id="features" className="py-8 sm:py-12 bg-white border-t border-gray-100 w-full font-inter">
      <div className="w-full px-2.5 sm:px-6 lg:px-10">
        
        {/* Section Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-1.5">
            <span className="h-[1px] w-10 sm:w-16 bg-[#fdb927]/60"></span>
            <span className="text-sm font-bold text-[#fdb927] tracking-wider uppercase">
              The Seasonals Promise
            </span>
            <span className="h-[1px] w-10 sm:w-16 bg-[#fdb927]/60"></span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Why Choose Our Handcrafted Diyas?
          </h2>
        </div>

        {/* 4 Premium Trust Cards (2 cols mobile, 4 cols desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="bg-gradient-to-b from-[#FAF7F2] to-white rounded-2xl p-4 sm:p-5 border border-[#fdb927]/30 shadow-sm hover:shadow-[0_10px_25px_rgba(253,185,39,0.2)] hover:border-[#fdb927] transition-all duration-300 flex flex-col justify-between group cursor-default"
              >
                <div>
                  {/* Top Golden Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#1b072a] text-[#fdb927] border border-[#fdb927]/40 flex items-center justify-center mb-3.5 shadow-md group-hover:scale-110 group-hover:bg-[#280a3e] transition-all duration-300">
                    <Icon className="w-6 h-6 group-hover:rotate-6 transition-transform duration-300" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="font-playfair font-bold text-sm sm:text-base text-gray-900 mb-1.5 leading-snug group-hover:text-[#280a3e] transition-colors">
                    {badge.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {badge.subtitle}
                  </p>
                </div>

                {/* Bottom Verified Tag */}
                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
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
