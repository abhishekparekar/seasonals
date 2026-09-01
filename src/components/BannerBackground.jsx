import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BannerBackground({
  images = [],
  fallbackImage = '',
  interval = 4500,
  className = ''
}) {
  // Normalize images list
  const normalizedImages = Array.isArray(images)
    ? images.filter(Boolean)
    : [images].filter(Boolean);

  const finalImages = normalizedImages.length > 0 
    ? normalizedImages 
    : (fallbackImage ? [fallbackImage] : []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (finalImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % finalImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [finalImages.length, interval]);

  if (finalImages.length === 0) {
    return null;
  }

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Background Slides with smooth transition - NO dark tint / NO color overlap */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${JSON.stringify(finalImages[currentIndex])})` }}
        />
      </AnimatePresence>

      {/* Slide Navigation Dots (when multiple images are uploaded) */}
      {finalImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-auto">
          {finalImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to image slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 bg-[#fdb927] shadow-md'
                  : 'w-2 bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
