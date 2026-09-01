import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sparkles, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { setQuickViewProduct } = useCart();

  const handleOpenOrderForm = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);

  const mainImage = productImages[0] || product.image || '/images/logo3.png';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-gray-200/90 shadow-[0_4px_20px_rgba(40,10,62,0.04)] hover:shadow-[0_12px_32px_rgba(253,185,39,0.22)] hover:border-[#fdb927] transition-all duration-300 flex flex-col justify-between group relative cursor-pointer font-inter overflow-hidden"
      onClick={() => setQuickViewProduct(product)}
    >
      {/* Ambient Decorative Corner Glow on Hover */}
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-[#fdb927]/20 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div>
        {/* Top Product Image Container with Clean Aspect Ratio */}
        <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF7F2] mb-2 sm:mb-3 border border-gray-100/90 shadow-inner">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top-Left Festive Badge */}
          {product.badge ? (
            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-[#1b072a]/90 backdrop-blur-md text-[#fdb927] text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm border border-[#fdb927]/40 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#fdb927]" />
              <span className="line-clamp-1">{product.badge}</span>
            </span>
          ) : (
            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-[#1b072a]/90 backdrop-blur-md text-[#fdb927] text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm border border-[#fdb927]/40 flex items-center gap-1">
              <span>✨</span>
              <span>Handmade</span>
            </span>
          )}

          {/* Top-Right Multi-Image Count Badge */}
          {productImages.length > 1 && (
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#1b072a]/85 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20">
              📷 {productImages.length}
            </div>
          )}

          {/* Hover Quick View Button Overlay (Desktop / Hover) */}
          <div className="absolute inset-0 bg-[#1b072a]/30 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center pointer-events-none">
            <span className="bg-white text-[#1b072a] font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 border border-[#fdb927]/60">
              <Eye className="w-3.5 h-3.5 text-[#b37400]" />
              <span>Quick View</span>
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-1 sm:space-y-1.5">
          {/* Pack Quantity Pill */}
          <div className="inline-flex items-center gap-1 bg-[#fdb927]/15 border border-[#fdb927]/30 text-[#1b072a] text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md">
            <span>{product.packTitle || `Pack of ${product.pieces || 4} Pcs`}</span>
          </div>

          {/* Product Title */}
          <h3
            className="font-playfair font-extrabold text-xs sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#280a3e] transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description (Desktop only to prevent mobile clutter) */}
          {product.description && (
            <p className="text-gray-500 text-xs line-clamp-1 font-medium hidden sm:block">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Price & Order CTA Button */}
      <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-100 space-y-1.5 sm:space-y-2">
        <div className="flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-lg md:text-xl font-black text-[#1b072a]">
              ₹{product.price}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500">
              / {product.packTitle || `${product.pieces || 4} pcs`}
            </span>
          </div>

          <span className="text-[8px] sm:text-[10px] font-bold text-[#b37400] bg-[#fdb927]/15 px-1.5 py-0.5 rounded border border-[#fdb927]/30 hidden sm:inline-block">
            🪔 Inclusive All
          </span>
        </div>

        {/* Action Order Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenOrderForm}
          className="w-full py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-gradient-to-r from-[#1b072a] via-[#3d0f5e] to-[#1b072a] hover:from-[#fdb927] hover:via-[#e69500] hover:to-[#fdb927] text-white hover:text-[#1b072a] font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-300 border border-[#fdb927]/40 cursor-pointer"
        >
          <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#fdb927] group-hover:text-[#1b072a] transition-colors" />
          <span>Order Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
