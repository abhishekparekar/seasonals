import React from 'react';
import { motion } from 'framer-motion';

// Decorative floating and popping animated Diyas & Festive sparkles
export default function FloatingDiyas() {
  const diyaItems = [
    { id: 1, x: '8%', y: '18%', size: 36, delay: 0, duration: 4.5, icon: '🪔' },
    { id: 2, x: '88%', y: '22%', size: 40, delay: 0.8, duration: 5.2, icon: '🪔' },
    { id: 3, x: '14%', y: '68%', size: 32, delay: 1.4, duration: 4.8, icon: '🪔' },
    { id: 4, x: '82%', y: '72%', size: 38, delay: 0.4, duration: 5.0, icon: '🪔' },
    { id: 5, x: '5%', y: '45%', size: 28, delay: 1.8, duration: 4.2, icon: '✨' },
    { id: 6, x: '92%', y: '48%', size: 30, delay: 2.1, duration: 4.6, icon: '✨' },
    { id: 7, x: '50%', y: '10%', size: 26, delay: 1.0, duration: 3.8, icon: '✨' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {diyaItems.map((item) => (
        <motion.div
          key={item.id}
          className="absolute select-none pointer-events-auto cursor-pointer"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{
            opacity: [0.65, 1, 0.75, 1, 0.65],
            scale: [0.9, 1.15, 0.95, 1.1, 0.9],
            y: [-12, 12, -10, 8, -12],
            rotate: [-6, 6, -4, 4, -6],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.4,
            rotate: [0, -15, 15, 0],
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.85 }}
          title="Click to pop festive blessings! 🪔"
        >
          {/* Flame Glow Backdrop */}
          <div className="relative flex items-center justify-center">
            <span
              className="absolute -inset-2 bg-[#fdb927]/40 rounded-full blur-md animate-ping pointer-events-none"
              style={{ animationDuration: '3s' }}
            ></span>
            <span
              className="relative drop-shadow-[0_0_12px_rgba(253,185,39,0.9)] transition-transform hover:scale-125 inline-block"
              style={{ fontSize: `${item.size}px` }}
            >
              {item.icon}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Ambient Rising Golden Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-[#fdb927] rounded-full blur-[0.5px]"
          style={{
            left: `${15 + i * 14}%`,
            bottom: '5%',
          }}
          animate={{
            y: [0, -220],
            opacity: [0, 0.85, 0],
            scale: [0.5, 1.2, 0.3],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
