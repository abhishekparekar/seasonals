import React from 'react';
import Hero from '../components/Hero';
import AboutCSR from '../components/AboutCSR';
import PromoBanner from '../components/PromoBanner';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import { Sparkles, ArrowRight, Gift, HeartHandshake } from 'lucide-react';

export default function HomePage({ onNavigate }) {
  return (
    <div className="w-full">
      {/* 1. Hero Banner */}
      <Hero onNavigate={onNavigate} />

      {/* 2. Our Social Mission Spotlight */}
      <div className="relative">
        <AboutCSR onNavigate={onNavigate} isPreview={true} />
      </div>

      {/* 3. Promotional Festive Banner */}
      <PromoBanner onNavigate={onNavigate} />

      {/* 5. Why Choose Us / The Seasonals Promise */}
      <Features />

      {/* 6. Verified Customer Reviews */}
      <Reviews />

      {/* 7. Corporate & Bulk Inquiries Banner */}
      <section className="py-10 sm:py-12 bg-gradient-to-r from-[#1b072a] via-[#2f084a] to-[#1b072a] text-white relative overflow-hidden border-t-2 border-[#fdb927]/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-3.5 sm:space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#fdb927]/20 border border-[#fdb927]/50 px-4 py-1 rounded-full text-xs font-black text-[#fdb927] shadow-sm">
              <Gift className="w-3.5 h-3.5" />
              <span>CORPORATE & BULK ORDERS</span>
            </div>
            
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              Looking for Corporate Gifting or Custom Festive Favors?
            </h2>
            
            <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
              We provide customized eco-friendly packaging, company branding, and multi-destination express shipping for corporate & family events.
            </p>

            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('bulk-gifting')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-black text-xs sm:text-sm px-7 py-3 rounded-full shadow-[0_4px_18px_rgba(253,185,39,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Inquire for Bulk Orders</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full border border-white/30 hover:border-[#fdb927] transition-all cursor-pointer backdrop-blur-sm"
              >
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
