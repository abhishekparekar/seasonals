import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import BannerBackground from '../components/BannerBackground';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoryPage({ onNavigate }) {
  const { storyConfig } = useSiteConfig();
  const storyImages = Array.isArray(storyConfig?.bgImages) && storyConfig.bgImages.length > 0
    ? storyConfig.bgImages
    : (storyConfig?.bgImage ? [storyConfig.bgImage] : []);

  return (
    <div className="w-full font-inter bg-[#FFFDF9] min-h-screen pb-16">

      {/* 1. Header matching Hero Section Size */}
      <section className="relative flex items-center justify-center text-white py-14 sm:py-20 md:py-24 overflow-hidden font-inter transition-all duration-300 min-h-[360px] sm:min-h-[440px] border-b-2 border-[#fdb927]/40 shadow-lg">
        <BannerBackground images={storyImages} />

        <div className="w-full px-3 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-full max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center bg-[#1b072a]/85 backdrop-blur-md border border-[#fdb927]/40 px-4 py-1.5 rounded-full mb-3 sm:mb-4 shadow-lg text-xs sm:text-sm font-semibold text-[#fdb927] tracking-wide gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#fdb927]" />
              <span>{storyConfig?.badgeText || "THE INSPIRING JOURNEY"}</span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold leading-[1.18] tracking-tight mb-3 sm:mb-4 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)] [text-shadow:_0_2px_12px_rgba(0,0,0,1),_0_1px_4px_rgba(0,0,0,1)]">
              {storyConfig?.title || "From Two Sisters to a Team of Young Creators"}
            </h1>

            <p className="text-white text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-[0_3px_12px_rgba(0,0,0,1)] [text-shadow:_0_1px_8px_rgba(0,0,0,1),_0_2px_4px_rgba(0,0,0,1)]">
              {storyConfig?.subtitle || "Discover how a simple creative activity grew into a heartfelt movement empowering specially-abled children."}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Strip (Below Header Banner) */}
      <div className="bg-[#FAF7F2] border-b border-[#fdb927]/25 py-2.5 px-3 sm:px-6 lg:px-8">
        <div className="w-full flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => onNavigate('home')}
            className="text-gray-500 hover:text-[#b45309] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-[#b45309] font-black">Our Story</span>
        </div>
      </div>

      {/* 2. Editorial Story Narrative (100% Full-Width, No Unwanted Padding on Left and Right) */}
      <section className="w-full px-0 py-6 sm:py-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >

          {/* Section Heading */}
          <div className="mb-8 text-center w-full px-4 sm:px-8">
            <div className="inline-flex items-center gap-2 bg-[#fdb927]/15 border border-[#fdb927]/40 px-4 py-1 rounded-full text-xs font-black text-[#1b072a] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
              <span>THE SEASONALS STORY</span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-black text-[#1b072a] leading-tight tracking-tight">
              From Two Sisters to a Team of Young Creators
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#fdb927] to-[#e69500] rounded-full mx-auto mt-4" />
          </div>

          {/* Story Narrative Flow - Edge-to-edge */}
          <div className="w-full space-y-6 text-[#2c1d38] text-base sm:text-lg md:text-xl leading-relaxed">

            {/* Chapter 1: The Beginning */}
            <div className="w-full px-4 sm:px-8 space-y-3">
              <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-[#1b072a]">
                It started with Shria & Dhwani.
              </h3>
              <p>
                In November 2025, <strong className="font-bold text-[#1b072a]">12-year-old Shria and 7-year-old Dhwani</strong> decided to make something of their own.
              </p>
              <p>
                Last year, they picked up their paints and <strong className="font-bold text-[#1b072a]">painted diyas with their own hands</strong>.
              </p>
              <p className="text-gray-700">
                It started as a simple creative activity. But along the way, they discovered something bigger — the joy of creating, the value of effort, and the excitement of seeing something they made become real.
              </p>
            </div>

            {/* Chapter 2: The Spark / Thought Callout */}
            <div className="w-full my-6 p-6 sm:p-8 bg-gradient-to-r from-[#FAF5EC] via-[#FFFDF9] to-[#FAF5EC] border-y sm:border-y-0 sm:border-l-4 border-[#fdb927] shadow-sm space-y-2 px-4 sm:px-8">
              <h3 className="font-playfair text-base sm:text-lg font-bold text-[#8a4209] uppercase tracking-wide">
                Then they thought,
              </h3>
              <p className="font-playfair text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1b072a] italic leading-snug">
                “Why not create this opportunity for more children?”
              </p>
            </div>

            {/* Chapter 3: Expansion & Purpose */}
            <div className="w-full px-4 sm:px-8 space-y-3">
              <p>
                This year, Seasonals has grown beyond Shria and Dhwani.
              </p>
              <p>
                We are bringing together <strong className="font-bold text-[#1b072a]">creations made by children with physical challenges</strong>, giving their creativity a place to be seen, valued and celebrated.
              </p>
              <p className="text-gray-700">
                Shria and Dhwani are learning too — about products, customers, money, teamwork and what it means to build something that can make a difference.
              </p>
            </div>

            {/* Chapter 4: Climax Highlight */}
            <div className="w-full py-6 sm:py-8 border-y border-[#fdb927]/30 my-6 space-y-2 text-center bg-[#FAF7F2]/60 px-4 sm:px-8">
              <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1b072a]">
                From creating with their own hands
              </h3>
              <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-extrabold text-[#9a4e00]">
                to creating opportunities for other young creators.
              </h3>
              <p className="text-sm sm:text-base font-bold text-gray-600 pt-2">
                That's the journey of Seasonals.
              </p>
            </div>

            {/* Chapter 5: Callout Card with Action CTA */}
            <div className="w-full bg-[#1b072a] text-white p-6 sm:p-10 shadow-xl border-y-2 sm:border-2 border-[#fdb927]/50 text-center space-y-5 px-4 sm:px-8">
              <p className="font-playfair text-lg sm:text-2xl md:text-3xl font-bold leading-relaxed text-[#FFF8EB]">
                Every creation has a story.<br className="hidden sm:inline" />
                This one is theirs. And now, it's yours to take home.
              </p>

              <div className="w-20 h-0.5 bg-[#fdb927] mx-auto" />

              <p className="text-base sm:text-lg md:text-xl font-extrabold text-[#fdb927] tracking-wide">
                Meet the young creators. Discover their creations.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#fdb927] to-[#e69500] hover:from-[#ffc84a] hover:to-[#fdb927] text-[#1b072a] font-black text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Discover Their Creations</span>
                </button>
                <button
                  onClick={() => onNavigate('bulk-gifting')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full border border-white/30 hover:border-[#fdb927] transition-all cursor-pointer"
                >
                  <span>Bulk & Corporate Orders</span>
                </button>
              </div>
            </div>

          </div>

        </motion.article>
      </section>

    </div>
  );
}
