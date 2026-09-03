import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';
import { addReviewToFirestore } from '../firebase';
import { Star, Sparkles, CheckCircle2, PlusCircle, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Reviews() {
  const { reviews, reviewsLoading, products } = useSiteConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const scrollRef = useRef(null);
  const isUserInteracting = useRef(false);

  const [reviewForm, setReviewForm] = useState({
    name: '',
    city: '',
    rating: 5,
    product: 'Handcrafted Floral Diya Set (Pack of 4)',
    review: ''
  });

  // Calculate dynamic average rating and count
  const reviewsCount = reviews?.length || 0;
  const avgRating = reviewsCount > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviewsCount).toFixed(1)
    : '5.0';

  // Smooth mobile auto-scroll timer
  useEffect(() => {
    if (!reviews || reviews.length <= 1) return;

    const interval = setInterval(() => {
      if (!isUserInteracting.current && scrollRef.current) {
        const nextIndex = (activeMobileIndex + 1) % reviews.length;
        scrollToIndex(nextIndex);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [activeMobileIndex, reviews]);

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.children;
    if (cards && cards[index]) {
      const card = cards[index];
      const scrollPos = card.offsetLeft - container.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      });
      setActiveMobileIndex(index);
    }
  };

  const handleMobileScroll = () => {
    if (!scrollRef.current || !reviews || reviews.length === 0) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.82;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < reviews.length) {
      setActiveMobileIndex(newIndex);
    }
  };

  const handlePrev = () => {
    isUserInteracting.current = true;
    const newIndex = activeMobileIndex > 0 ? activeMobileIndex - 1 : reviews.length - 1;
    scrollToIndex(newIndex);
    setTimeout(() => { isUserInteracting.current = false; }, 3000);
  };

  const handleNext = () => {
    isUserInteracting.current = true;
    const newIndex = (activeMobileIndex + 1) % reviews.length;
    scrollToIndex(newIndex);
    setTimeout(() => { isUserInteracting.current = false; }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.review.trim()) {
      alert("Please provide your name and review details");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReviewToFirestore({
        name: reviewForm.name.trim(),
        city: reviewForm.city.trim() || 'India',
        rating: Number(reviewForm.rating) || 5,
        product: reviewForm.product,
        review: reviewForm.review.trim(),
        tag: 'Verified Buyer',
        avatarBg: 'bg-amber-100 text-amber-800',
        dateString: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setReviewForm({
          name: '',
          city: '',
          rating: 5,
          product: 'Handcrafted Floral Diya Set (Pack of 4)',
          review: ''
        });
      }, 2000);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Could not submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-8 sm:py-14 bg-[#FFFDF9] w-full font-inter relative overflow-hidden border-t border-gray-100">
      {/* Ambient background sparkles */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-3 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <span className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#fdb927]"></span>
            <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Customer Reviews & Love
            </h2>
            <span className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#fdb927]"></span>
          </div>

          <p className="text-xs sm:text-sm text-gray-900 leading-relaxed mb-3.5 font-medium">
            Hear from families across India who celebrated their Diwali with our authentic handcrafted clay diyas.
          </p>

          {/* Dynamic Overall Rating Banner & Write Review CTA */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {reviewsCount > 0 ? (
              <div className="inline-flex items-center gap-2.5 bg-[#1b072a] text-white px-3.5 sm:px-5 py-2 rounded-2xl border border-[#fdb927]/40 shadow-md">
                <div className="flex items-center gap-1 text-[#fdb927]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#fdb927]" />
                  ))}
                </div>
                <div className="text-xs sm:text-sm font-black text-white">
                  {avgRating} / 5.0
                </div>
                <span className="text-white/40 hidden sm:inline">•</span>
                <div className="text-[11px] sm:text-xs text-[#fdb927] font-bold">
                  {reviewsCount} Verified Review{reviewsCount > 1 ? 's' : ''}
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-[#1b072a] text-white px-4 py-2 rounded-2xl border border-[#fdb927]/40 shadow-md">
                <Sparkles className="w-4 h-4 text-[#fdb927]" />
                <span className="text-xs font-bold text-white">
                  100% Handcrafted Terracotta Quality
                </span>
              </div>
            )}

            {/* Write Feedback Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#fdb927] hover:bg-[#ffc84a] active:scale-95 text-[#1b072a] text-xs font-bold px-3.5 sm:px-4 py-2 rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Share Feedback</span>
            </button>
          </div>
        </div>

        {/* Dynamic Reviews Output */}
        {reviewsLoading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-[#fdb927] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading customer reviews...</p>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <>
            {/* 1. MOBILE & IPHONE VIEW: Compact Animated Horizontal Swipe Carousel */}
            <div className="md:hidden relative">
              
              {/* Carousel Container */}
              <div
                ref={scrollRef}
                onScroll={handleMobileScroll}
                onTouchStart={() => { isUserInteracting.current = true; }}
                onTouchEnd={() => { setTimeout(() => { isUserInteracting.current = false; }, 3000); }}
                className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 pt-1 px-1 scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {reviews.map((rev, index) => {
                  const rating = Number(rev.rating) || 5;
                  return (
                    <div
                      key={rev.id || index}
                      className="w-[82vw] max-w-[310px] flex-shrink-0 snap-center bg-white rounded-2xl p-4 border border-gray-200/90 shadow-sm flex flex-col justify-between relative group"
                    >
                      {/* Top Quote Accent */}
                      <div className="absolute top-3 right-3 text-2xl font-serif text-gray-200 pointer-events-none">
                        “
                      </div>

                      <div>
                        {/* Stars & Verified Tag */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#fdb927] text-[#fdb927]" />
                            ))}
                          </div>

                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{rev.tag || 'Verified'}</span>
                          </span>
                        </div>

                        {/* Review Content */}
                        <p className="text-xs text-gray-950 leading-relaxed font-medium line-clamp-4 mb-3">
                          "{rev.review}"
                        </p>
                      </div>

                      {/* Author Tag */}
                      <div className="pt-2.5 border-t border-gray-100 flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${rev.avatarBg || 'bg-amber-100 text-amber-900'} flex items-center justify-center font-black text-xs flex-shrink-0 shadow-inner`}>
                          {(rev.name || 'C').charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-playfair font-bold text-xs text-gray-950 truncate">
                            {rev.name}
                          </div>
                          <div className="text-[10px] text-gray-800 font-semibold flex items-center gap-1 truncate">
                            <span>{rev.city || 'India'}</span>
                            {rev.product && (
                              <>
                                <span>•</span>
                                <span className="text-[#8c5700] font-bold truncate">{rev.product}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Carousel Controls & Dot Indicators */}
              <div className="flex items-center justify-between mt-3 px-2">
                {/* Prev Arrow */}
                <button
                  onClick={handlePrev}
                  aria-label="Previous Review"
                  className="w-8 h-8 rounded-full bg-white border border-[#fdb927]/60 shadow-sm flex items-center justify-center text-[#1b072a] active:scale-90 transition-transform cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#1b072a]" />
                </button>

                {/* Dot Indicators */}
                <div className="flex items-center gap-1.5">
                  {reviews.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => scrollToIndex(dotIdx)}
                      aria-label={`Go to review ${dotIdx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeMobileIndex === dotIdx
                          ? 'w-5 bg-[#1b072a]'
                          : 'w-2 bg-gray-300 hover:bg-[#fdb927]'
                      }`}
                    />
                  ))}
                </div>

                {/* Next Arrow */}
                <button
                  onClick={handleNext}
                  aria-label="Next Review"
                  className="w-8 h-8 rounded-full bg-white border border-[#fdb927]/60 shadow-sm flex items-center justify-center text-[#1b072a] active:scale-90 transition-transform cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#1b072a]" />
                </button>
              </div>
            </div>

            {/* 2. DESKTOP & TABLET VIEW: Responsive Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map((rev, index) => {
                const rating = Number(rev.rating) || 5;
                return (
                  <motion.div
                    key={rev.id || index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-sm hover:shadow-md hover:border-[#fdb927] transition-all flex flex-col justify-between group relative"
                  >
                    {/* Quote Mark */}
                    <div className="absolute top-4 right-4 text-3xl font-serif text-gray-200 group-hover:text-[#fdb927]/30 transition-colors pointer-events-none">
                      “
                    </div>

                    <div>
                      {/* Stars & Verified Tag */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#fdb927] text-[#fdb927]" />
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{rev.tag || 'Verified Buyer'}</span>
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-sm text-gray-950 leading-relaxed font-medium mb-4">
                        "{rev.review}"
                      </p>
                    </div>

                    {/* Author & Product Info */}
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${rev.avatarBg || 'bg-amber-100 text-amber-900'} flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-inner`}>
                        {(rev.name || 'C').charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-playfair font-bold text-xs sm:text-sm text-gray-950 truncate">
                          {rev.name}
                        </div>
                        <div className="text-[10px] text-gray-800 font-semibold flex items-center gap-1">
                          <span>{rev.city || 'India'}</span>
                          {rev.product && (
                            <>
                              <span>•</span>
                              <span className="text-[#8c5700] font-bold truncate">{rev.product}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-[#FAF7F2] rounded-3xl border border-[#fdb927]/30 max-w-md mx-auto p-6">
            <span className="text-3xl mb-2 block">✨</span>
            <h3 className="font-playfair text-lg font-bold text-gray-900 mb-1">
              Be the First to Review!
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Share your celebration experience with our handcrafted clay diyas.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1b072a] text-[#fdb927] font-bold text-xs py-2 px-4 rounded-full cursor-pointer"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>

      {/* Customer Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 font-inter">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-[#0f0417]/85 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#fdb927]/40 z-10 my-auto text-gray-900"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {submitSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                    ✓
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-gray-900">
                    Thank You for Your Feedback!
                  </h3>
                  <p className="text-xs text-gray-500">
                    Your verified review has been submitted and added to our store.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-gray-900">
                      Share Your Experience
                    </h3>
                    <p className="text-xs text-gray-500">
                      Let other Diwali shoppers know about your experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        name="name"
                        value={reviewForm.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">City / State</label>
                      <input
                        type="text"
                        name="city"
                        value={reviewForm.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city & state"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Rating</label>
                      <select
                        name="rating"
                        value={reviewForm.rating}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e] bg-white font-bold"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Product Purchased</label>
                      <input
                        type="text"
                        name="product"
                        value={reviewForm.product}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Your Review *</label>
                    <textarea
                      required
                      name="review"
                      rows={3}
                      value={reviewForm.review}
                      onChange={handleInputChange}
                      placeholder="Enter your review and feedback..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#1b072a] hover:bg-[#350d52] text-[#fdb927] flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#fdb927]" />
                        <span>Submitting Review...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Submit Verified Review</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
