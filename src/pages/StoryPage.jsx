import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import BannerBackground from '../components/BannerBackground';
import { Sparkles, Heart, Clock, Compass, Star, Quote, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoryPage({ onNavigate }) {
  const { storyConfig } = useSiteConfig();
  const storyImages = Array.isArray(storyConfig?.bgImages) && storyConfig.bgImages.length > 0
    ? storyConfig.bgImages
    : (storyConfig?.bgImage ? [storyConfig.bgImage] : []);
  const storyMilestones = [
    {
      id: 1,
      chapter: "01",
      tag: "THE SPARK",
      icon: Compass,
      title: "Two Sisters & A Simple Challenge",
      highlight: "“Do you know how hard it is to earn money?”",
      description: "When a mother challenged her 12 & 5-year-old daughters to understand the true value of money, they decided to hand-paint and sell authentic terracotta diyas just 2 days before Diwali.",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      iconBg: "bg-amber-500/10 text-amber-600"
    },
    {
      id: 2,
      chapter: "02",
      tag: "THE LESSON",
      icon: Clock,
      title: "2+ Hours Per Diya",
      highlight: "“Spending is easy. Earning takes patience.”",
      description: "Working late into the night, they spent over 2 hours on every single diya. They learned the true value of patience, meticulous effort, and deep respect for Indian artisans.",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      iconBg: "bg-purple-500/10 text-purple-600"
    },
    {
      id: 3,
      chapter: "03",
      tag: "THE MISSION",
      icon: Heart,
      title: "Dignity, Not Sympathy",
      highlight: "“Valued because it is good — not out of pity.”",
      description: "That small project sparked a permanent movement: creating a platform for children with physical challenges to showcase their immense talent and earn with absolute pride.",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      iconBg: "bg-rose-500/10 text-rose-600"
    },
    {
      id: 4,
      chapter: "04",
      tag: "THE IMPACT",
      icon: Star,
      title: "Every Purchase Matters",
      highlight: "“Your craft matters.”",
      description: "Behind every product is a story of determination. Each purchase sends a message of encouragement, financial support, and artistic validation to a young creator.",
      badgeColor: "bg-[#fdb927]/20 text-[#280a3e] border-[#fdb927]/50",
      iconBg: "bg-[#fdb927]/20 text-[#280a3e]"
    }
  ];

  const coreValues = [
    {
      title: "Purpose Over Profit",
      desc: "Our primary measure of success is the positive empowerment and livelihood delivered to talented young creators."
    },
    {
      title: "Dignity, Not Sympathy",
      desc: "We believe products should be purchased because of exceptional craftsmanship and beauty, celebrating authentic ability."
    },
    {
      title: "Eco-Friendly Heritage",
      desc: "We use only pure terracotta clay and biodegradable materials, honoring Mother Earth and traditional Indian pottery."
    },
    {
      title: "Uncompromising Quality",
      desc: "From smooth clay finishes to shimmering gold scalloped rims, every diya is crafted to elevate festive home decor."
    }
  ];

  return (
    <div className="w-full font-inter bg-[#FFFDF9] min-h-screen pb-16">

      {/* 1. Header with Dynamic Multi-Image Slider */}
      <section className="relative text-white py-10 sm:py-14 overflow-hidden border-b-2 border-[#fdb927]/40 shadow-lg min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center">
        <BannerBackground images={storyImages} />

        <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/20 backdrop-blur-sm border border-[#fdb927]/40 px-3.5 py-1 rounded-full text-xs font-black text-[#fdb927] mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{storyConfig?.badgeText || "THE INSPIRING JOURNEY"}</span>
            </div>

            <h1 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 leading-tight drop-shadow-md">
              {storyConfig?.title || "It Started With Two Sisters, Diyas & A Lesson"}
            </h1>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl font-medium drop-shadow-sm">
              {storyConfig?.subtitle || "Discover how a mother's challenge to her young daughters transformed into a nationwide social initiative dedicated to celebrating children with physical challenges."}
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
          <span className="text-[#b45309] font-black">Our Story</span>
        </div>
      </div>

      {/* 2. Story Chapters Grid */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {storyMilestones.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#fdb927]/60 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#fdb927] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <span className={`text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <span className="font-playfair text-xl sm:text-2xl font-black text-gray-300 group-hover:text-[#1b072a] transition-colors">
                      {item.chapter}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`p-2 rounded-xl ${item.iconBg}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="bg-[#FAF7F2] border-l-2 border-[#fdb927] px-3 py-2 rounded-r-lg my-2.5">
                    <p className="text-xs font-bold text-[#1b072a] italic">
                      {item.highlight}
                    </p>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Core Philosophy Banner */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="bg-gradient-to-r from-[#1b072a] via-[#2c0d45] to-[#1b072a] text-white rounded-3xl p-5 sm:p-8 lg:p-10 border-2 border-[#fdb927]/40 shadow-2xl relative overflow-hidden text-center">
          <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-[#fdb927]/15 absolute top-3 sm:top-4 left-4 sm:left-6 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="text-xs font-extrabold text-[#fdb927] uppercase tracking-wider block">
              The Seasonals Core Philosophy
            </span>
            <h2 className="font-playfair text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
              “Money can buy things. But earning teaches you their value.”
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-medium">
              Every handcrafted product carries hours of meticulous patience, love, and purpose. When you light a Seasonals diya, you honor the artisan's journey.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Values Grid */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#1b072a] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
            <span>OUR CORE VALUES</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
            What Drives Everything We Do
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-[#fdb927] shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fdb927]/20 text-[#1b072a] flex items-center justify-center font-bold text-xs sm:text-sm mb-2.5 sm:mb-3">
                0{idx + 1}
              </div>
              <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-1.5">
                {val.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Direct CTA */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="bg-[#FFF8EB] rounded-3xl p-5 sm:p-8 border-2 border-[#fdb927]/50 shadow-md text-center max-w-3xl mx-auto space-y-3.5 sm:space-y-4">
          <h3 className="font-playfair text-lg sm:text-2xl font-bold text-[#1b072a]">
            Become Part of Our Story
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 max-w-lg mx-auto">
            Choose handcrafted terracotta diyas for your home, festive hampers, or corporate celebrations and support talented child artisans.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1b072a] hover:bg-[#2c0d45] text-[#fdb927] font-black text-xs sm:text-sm px-7 py-3 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collection</span>
            </button>
            <button
              onClick={() => onNavigate('bulk-gifting')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <span>Bulk & Corporate Orders</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
