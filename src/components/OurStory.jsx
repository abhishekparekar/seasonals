import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Clock, Award, Compass, Lightbulb, Star } from 'lucide-react';

export default function OurStory() {
  return (
    <section id="story" className="py-8 sm:py-12 md:py-16 bg-[#FFFDF9] relative w-full font-inter overflow-hidden border-t border-[#fdb927]/25">
      {/* Background ambient decorative glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#1b072a]/90 text-[#fdb927] border border-[#fdb927]/50 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-extrabold mb-2.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#fdb927]" />
            <span>OUR STORY</span>
          </div>

          <h2 className="font-playfair text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2 sm:mb-3">
            It Started With Two Sisters, A Few Diyas & One Simple Lesson.
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#280a3e] font-semibold italic">
            "Sometimes, the biggest lessons don't come from a classroom. They come from doing."
          </p>
        </div>

        {/* Story Content Blocks */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          
          {/* Chapter 1: Two Sisters & The Question */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200/80 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-extrabold text-[#b37400] mb-2 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Chapter 1 • The Spark</span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed mb-3">
              A few years ago, our story began with two sisters — <strong className="text-gray-900 font-bold">12 years old and 5 years old</strong> — and a simple question from their mother:
            </p>
            <blockquote className="bg-[#FAF7F2] border-l-4 border-[#fdb927] p-3 sm:p-4 rounded-r-2xl my-2.5 text-xs sm:text-sm md:text-base text-[#1b072a] font-playfair font-bold italic">
              “Do you know how difficult it is to earn money?”
            </blockquote>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The girls knew how easy it was to ask for something they wanted. But they hadn't really understood what it took to earn that money. So their mother gave them a challenge: <strong className="text-gray-900">“Why don't you try earning it yourselves?”</strong>
            </p>
            <p className="text-xs text-[#280a3e] font-bold mt-2">
              And that's how this little idea began.
            </p>
          </motion.div>

          {/* Chapter 2: Two Days Before Diwali */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200/80 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-extrabold text-[#b37400] mb-2 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Chapter 2 • Two Days Before Diwali</span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed mb-2.5">
              With Diwali only two days away, the sisters decided to make and sell <strong className="text-[#280a3e] font-bold">hand-painted diyas</strong>. There was no big business plan. No fancy setup. Just two sisters, some diyas, colours, creativity — and a lot of excitement.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
              What they didn't expect was how much work went into making just <strong className="text-gray-900 font-bold">one diya ready to sell</strong>. They would carefully paint it, wait, finish the details, check it, and then prepare it to be market-ready.
            </p>
            <div className="bg-[#1b072a] text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#fdb927]/40 shadow-sm flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl">⏳</span>
              <p className="text-xs sm:text-sm font-bold text-[#fdb927]">
                One diya could take them a minimum of two hours.
              </p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mt-2.5">
              And because Diwali was just around the corner, they found themselves working late into the night to complete their little order. They were tired. They were excited. And they were learning.
            </p>
          </motion.div>

          {/* Chapter 3: The Realisation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-[#fdb927]/50 shadow-md"
          >
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-extrabold text-[#b37400] mb-2 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Chapter 3 • The Realisation</span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed mb-3">
              After spending hours making something that could be sold for just a small amount, they began to understand something they had never really experienced before:
            </p>
            <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-amber-200 text-center shadow-sm mb-3">
              <p className="font-playfair text-sm sm:text-base md:text-lg font-extrabold text-[#1b072a]">
                Spending money is easy.
              </p>
              <p className="font-playfair text-sm sm:text-base md:text-lg font-extrabold text-[#b37400]">
                Earning money takes time, effort and patience.
              </p>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              That Diwali, they didn't just sell diyas. They learned the value of money. They learned the value of someone's time. They learned that behind every product someone buys, there can be hours of effort that nobody sees. And most importantly, <strong className="text-gray-900 font-bold">they learned to appreciate the person who made it.</strong>
            </p>
          </motion.div>

          {/* Chapter 4: From Little Project To Something Bigger */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200/80 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-extrabold text-[#b37400] mb-2 uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Chapter 4 • From Their Little Project To Something Bigger</span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed mb-2.5">
              What started as a small financial lesson slowly became something much more meaningful. The sisters began to wonder:
            </p>
            <blockquote className="bg-[#1b072a]/5 border-l-4 border-[#1b072a] p-3 sm:p-4 rounded-r-2xl my-2.5 text-xs sm:text-sm md:text-base text-[#1b072a] font-semibold italic">
              “If we could learn so much by making and selling something ourselves, what if other children got the same opportunity?”
            </blockquote>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
              And that's where our idea began to grow. Today, we want to create a platform where <strong className="text-[#280a3e] font-extrabold">children with physical challenges can showcase their creativity and handmade skills</strong>, and where people can discover, appreciate and purchase what they create.
            </p>
            <div className="bg-[#FAF7F2] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-800 space-y-1">
              <p className="font-semibold">Because we don't want their work to be valued because of sympathy.</p>
              <p className="font-extrabold text-[#280a3e] text-xs sm:text-sm md:text-base">We want it to be valued because it is good.</p>
              <p className="text-gray-600 font-medium text-[11px] sm:text-xs">Beautifully made. Thoughtfully created. And made with effort.</p>
            </div>
          </motion.div>

          {/* Chapter 5: We Believe Every Child Has Something To Create */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200/80 shadow-sm"
          >
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-extrabold text-[#b37400] mb-2 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Chapter 5 • We Believe Every Child Has Something To Create</span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed mb-2.5">
              A physical challenge should never become the definition of a child's ability.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 my-3 text-center">
              <div className="bg-[#1b072a]/5 p-3 rounded-xl sm:rounded-2xl border border-[#1b072a]/10">
                <span className="text-xs font-extrabold text-[#1b072a] block">Every child has creativity.</span>
              </div>
              <div className="bg-[#fdb927]/15 p-3 rounded-xl sm:rounded-2xl border border-[#fdb927]/30">
                <span className="text-xs font-extrabold text-[#b37400] block">Every child has something to contribute.</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl sm:rounded-2xl border border-emerald-200">
                <span className="text-xs font-extrabold text-emerald-800 block">Every child deserves opportunity.</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-semibold">
              Every child deserves an opportunity to experience the pride of saying: <strong className="text-[#280a3e] font-extrabold text-xs sm:text-sm md:text-base">“I made this.”</strong>
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
              Our aim is to create that opportunity — one handmade creation at a time.
            </p>
          </motion.div>

          {/* Chapter 6: What Every Purchase Represents */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#220536] via-[#3d0f5e] to-[#220536] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-xl border-2 border-[#fdb927]/60 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/20 border border-[#fdb927]/50 px-3 py-0.5 rounded-full text-[11px] font-extrabold text-[#fdb927]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>What Every Purchase Represents</span>
              </div>

              <h3 className="font-playfair text-base sm:text-xl md:text-2xl font-bold leading-tight">
                When you buy from us, we hope you don't just see a festive product.
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/15">
                  <span className="text-[11px] sm:text-xs font-extrabold text-[#fdb927] block">The Time Behind It</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/15">
                  <span className="text-[11px] sm:text-xs font-extrabold text-[#fdb927] block">The Patience Behind It</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/15">
                  <span className="text-[11px] sm:text-xs font-extrabold text-[#fdb927] block">The Creativity Behind It</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/15">
                  <span className="text-[11px] sm:text-xs font-extrabold text-[#fdb927] block">The Person Behind It</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 text-center">
                <p className="text-[11px] sm:text-xs text-white/80 uppercase tracking-wider font-semibold mb-1">
                  Because sometimes, a small purchase can carry a very big message:
                </p>
                <p className="font-playfair text-xl sm:text-2xl md:text-3xl font-black text-[#fdb927] drop-shadow-md">
                  Your work matters.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Conclusion */}
          <div className="text-center bg-[#FAF7F2] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#fdb927]/40">
            <h4 className="font-playfair text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5">
              From Two Sisters' Diwali Lesson...
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 max-w-2xl mx-auto mb-3 leading-relaxed font-medium">
              What began with two sisters learning the value of earning has grown into a bigger dream: <strong className="text-[#280a3e]">To help more children discover the value of their own creativity, skills and work.</strong>
            </p>

            <div className="inline-block bg-[#1b072a] text-[#fdb927] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#fdb927]/50 shadow-md">
              <p className="font-playfair text-xs sm:text-sm md:text-base font-extrabold">
                Money can buy things.
              </p>
              <p className="font-playfair text-sm sm:text-base md:text-lg font-black text-white">
                But earning teaches you their value.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
