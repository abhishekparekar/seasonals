import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sparkles, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { setQuickViewProduct } = useCart();

  const handleOpenOrderForm = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-[0_8px_30px_rgba(40,10,62,0.05)] hover:shadow-[0_18px_40px_rgba(253,185,39,0.28)] hover:border-[#fdb927] transition-all duration-300 flex flex-col justify-between group relative cursor-pointer font-inter overflow-hidden"
      onClick={() => setQuickViewProduct(product)}
    >
      {/* Ambient Decorative Corner Flare on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fdb927]/25 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div>
        {/* Top Image Container */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] mb-3.5 border border-gray-100/80 shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />

          {/* Top-Left Festive Badge */}
          {product.badge ? (
            <span className="absolute top-2.5 left-2.5 bg-[#1b072a]/90 backdrop-blur-md text-[#fdb927] text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-md border border-[#fdb927]/40 flex items-center gap-1.5 group-hover:border-[#fdb927] transition-colors">
              <Sparkles className="w-3 h-3 text-[#fdb927]" />
              <span>{product.badge}</span>
            </span>
          ) : (
            <span className="absolute top-2.5 left-2.5 bg-[#1b072a]/90 backdrop-blur-md text-[#fdb927] text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-md border border-[#fdb927]/40 flex items-center gap-1 group-hover:border-[#fdb927] transition-colors">
              ✨ Handcrafted
            </span>
          )}

          {/* Top-Right Pure Terracotta Badge */}
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-[#fdb927] to-[#e69500] text-[#1b072a] text-[10px] font-black px-2 py-1 rounded-lg shadow-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <span>🪔</span>
            <span>Terracotta</span>
          </div>

          {/* Hover Quick View Button Overlay */}
          <div className="absolute inset-0 bg-[#1b072a]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <span className="bg-white text-[#1b072a] font-extrabold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 border border-[#fdb927]/60">
              <Eye className="w-3.5 h-3.5 text-[#b37400]" />
              <span>Quick View</span>
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          {/* Pack Quantity Badge */}
          <div className="inline-inline-flex items-center gap-1 bg-[#fdb927]/15 border border-[#fdb927]/35 text-[#1b072a] text-[11px] font-extrabold px-2.5 py-0.5 rounded-md group-hover:bg-[#fdb927]/25 transition-colors">
            <span>{product.packTitle || `Pack of ${product.pieces || 4} Pcs`}</span>
          </div>

          {/* Title */}
          <h3
            className="font-playfair font-extrabold text-base sm:text-lg text-gray-900 line-clamp-1 group-hover:text-[#280a3e] transition-colors leading-snug pt-0.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-xs line-clamp-1 font-medium">
            {product.description || "100% handmade terracotta clay with gold rim."}
          </p>
        </div>
      </div>

      {/* Footer / Price & Order CTA Button */}
      <div className="pt-3 mt-3 border-t border-gray-100 space-y-2.5">
        <div className="flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-black text-[#1b072a]">
              ₹{product.price}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              / {product.packTitle || `${product.pieces || 4} pcs`}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-[#b37400] bg-[#fdb927]/15 px-2 py-0.5 rounded-md border border-[#fdb927]/30">
            <span>🪔 Inclusive All</span>
          </div>
        </div>

        {/* Full-Width Order Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={handleOpenOrderForm}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#1b072a] via-[#3d0f5e] to-[#1b072a] hover:from-[#fdb927] hover:via-[#e69500] hover:to-[#fdb927] text-white hover:text-[#1b072a] font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-[0_6px_20px_rgba(253,185,39,0.45)] transition-all duration-300 border border-[#fdb927]/40 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#fdb927] group-hover:text-[#1b072a] transition-colors" />
          <span>Order Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
