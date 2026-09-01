import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Clock, Compass, Star, Quote, ArrowRight } from 'lucide-react';

export default function OurStory() {
  const storyMilestones = [
    {
      id: 1,
      chapter: "01",
      tag: "THE SPARK",
      icon: Compass,
      title: "Two Sisters & A Simple Challenge",
      highlight: "“Do you know how hard it is to earn money?”",
      description: "When a mother challenged her 12 & 5-year-old daughters to earn their own money, they decided to hand-paint and sell terracotta diyas just 2 days before Diwali.",
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
      description: "Working late into the night, they spent over 2 hours on every single diya. They learned the true value of time, effort, and respect for the artisan.",
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
      description: "That small project sparked a bigger mission: creating a platform for children with physical challenges to showcase their talent and earn with pride.",
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
      description: "Behind every product is a story of determination. Each purchase sends a message of encouragement to a young, talented creator.",
      badgeColor: "bg-[#fdb927]/20 text-[#280a3e] border-[#fdb927]/50",
      iconBg: "bg-[#fdb927]/20 text-[#280a3e]"
    }
  ];

  return (
    <section id="story" className="py-10 sm:py-14 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] relative w-full font-inter overflow-hidden border-t border-[#fdb927]/20">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#1b072a] text-[#fdb927] border border-[#fdb927]/50 px-3.5 py-1 rounded-full text-xs font-extrabold mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#fdb927]" />
            <span>OUR STORY</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-black text-[#1b072a] tracking-tight leading-snug mb-2">
            It Started With Two Sisters, Diyas & A Lesson
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            How a simple Diwali project evolved into a social mission empowering talented children.
          </p>
        </div>

        {/* Full Width 4-Card Grid on Desktop & Compact Responsive Cards on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
          {storyMilestones.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-gray-200/90 shadow-sm hover:shadow-md hover:border-[#fdb927]/50 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#fdb927] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <span className="font-playfair text-lg sm:text-2xl font-black text-gray-300 group-hover:text-[#1b072a] transition-colors">
                      {item.chapter}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`p-1.5 rounded-lg flex-shrink-0 ${item.iconBg}`}>
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h3 className="font-playfair text-xs sm:text-base font-bold text-gray-900 leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Quote / Highlight */}
                  <div className="mb-1.5 pl-2 border-l-2 border-[#fdb927]/50">
                    <p className="text-[11px] sm:text-xs font-serif italic font-semibold text-[#8a4209] leading-snug">
                      {item.highlight}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full Width Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#1b072a] via-[#2c0d45] to-[#1b072a] text-white rounded-2xl p-4 sm:p-6 border border-[#fdb927]/40 shadow-xl relative overflow-hidden text-center w-full"
        >
          <Quote className="w-8 h-8 text-[#fdb927]/20 absolute top-3 left-4 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-2">
            <p className="text-[11px] sm:text-xs font-extrabold text-[#fdb927] uppercase tracking-wider">
              The Seasonals Core Philosophy
            </p>
            <h3 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold leading-snug">
              “Money can buy things. But earning teaches you their value.”
            </h3>
            <p className="text-xs text-white/80 font-medium">
              Every handcrafted product carries time, patience, and purpose.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
