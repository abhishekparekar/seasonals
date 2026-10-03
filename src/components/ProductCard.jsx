import React from 'react';
import { useCart } from '../context/CartContext';
import { useSiteConfig, initialCategoriesConfig } from '../context/SiteConfigContext';
import { ShoppingBag, Sparkles, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { setQuickViewProduct } = useCart();
  const { categories } = useSiteConfig();

  const activeCategories = Array.isArray(categories) && categories.length > 0 ? categories : initialCategoriesConfig;
  const matchedCat = product.category ? activeCategories.find((c) => 
    c.id === product.category.toLowerCase() || 
    (c.id === 'diya' && product.category.toLowerCase() === 'diyas') || 
    (c.id === 'lantern' && product.category.toLowerCase() === 'lanterns')
  ) : null;
  const displayCategoryLabel = matchedCat ? `${matchedCat.icon || '✨'} ${matchedCat.label}` : (product.categoryLabel || product.category);

  const handleOpenOrderForm = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : (product.image ? [product.image] : []);

  const mainImage = productImages[0] || product.image || '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full bg-white rounded-none border border-gray-200/90 shadow-[0_2px_10px_rgba(40,10,62,0.04)] hover:shadow-[0_8px_24px_rgba(253,185,39,0.18)] hover:border-[#fdb927] transition-all duration-300 flex flex-col justify-between group relative cursor-pointer font-inter overflow-hidden p-0"
      onClick={() => setQuickViewProduct(product)}
    >
      {/* Ambient Decorative Corner Glow on Hover */}
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-[#fdb927]/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

      {/* Top Section: Full Card Width Image (Edge-to-Edge, No Curve Radius) */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] flex items-center justify-center flex-shrink-0 rounded-none">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out select-none"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 text-[#1b072a] p-4 text-center">
            <span className="text-3xl mb-1">🪔</span>
            <span className="text-[11px] font-bold text-gray-500 font-playfair line-clamp-2">
              {product.name}
            </span>
          </div>
        )}

        {/* Top-Left Festive Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 max-w-[55%] sm:max-w-[65%] bg-[#1b072a]/95 backdrop-blur-md text-[#fdb927] text-[8px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-none shadow-sm border border-[#fdb927]/40 flex items-center gap-1 z-10 truncate">
            <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#fdb927] flex-shrink-0" />
            <span className="truncate">{product.badge}</span>
          </span>
        )}

        {/* Top-Right Discount Badge or Multi-Image Badge */}
        {product.originalPrice > product.price ? (
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2.5 py-0.5 rounded-none shadow-md border border-white/40 tracking-tight z-10 flex-shrink-0">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        ) : productImages.length > 1 ? (
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-[#1b072a]/85 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-none border border-white/20 z-10">
            📷 {productImages.length}
          </div>
        ) : null}

        {/* Hover Quick View Button Overlay (Desktop / Hover) */}
        <div className="absolute inset-0 bg-[#1b072a]/30 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center pointer-events-none z-10">
          <span className="bg-white text-[#1b072a] font-extrabold text-xs px-3.5 py-1.5 rounded-none shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 border border-[#fdb927]/60">
            <Eye className="w-3.5 h-3.5 text-[#b37400]" />
            <span>Quick View</span>
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-none shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Bottom Content Section: Balanced Padding on Meta & Price */}
      <div className="p-2.5 sm:p-3.5 md:p-4 flex-1 flex flex-col justify-between">
        {/* Category & Title */}
        <div>
          {/* Category & Pack Quantity Pills (Uniform height across cards) */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-h-[20px] sm:min-h-[22px] mb-1 sm:mb-1.5">
            {displayCategoryLabel && (
              <span className="inline-flex items-center gap-1 bg-[#1b072a]/5 text-[#1b072a] text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-none border border-gray-200 truncate max-w-[55%]">
                <span className="truncate">{displayCategoryLabel}</span>
              </span>
            )}
            {(product.packTitle || product.pieces) && (
              <div className="inline-flex items-center gap-1 bg-[#fdb927]/15 border border-[#fdb927]/30 text-[#1b072a] text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-none whitespace-nowrap">
                <span>{product.packTitle || `Pack of ${product.pieces} Pcs`}</span>
              </div>
            )}
          </div>

          {/* Product Title (Strict 2-line clamping with guaranteed overflow protection) */}
          <div className="h-[2.6rem] sm:h-[2.85rem] overflow-hidden my-0.5 flex items-start">
            <h3
              className="font-playfair font-bold text-xs sm:text-[14px] md:text-[15px] text-gray-950 group-hover:text-[#280a3e] transition-colors leading-[1.3] w-full"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.3',
                maxHeight: '2.6rem',
              }}
              title={product.name}
            >
              {product.name}
            </h3>
          </div>
        </div>

        {/* Footer Price & Order CTA Button (Always pinned to bottom) */}
        <div className="pt-2 sm:pt-2.5 mt-1 sm:mt-1.5 border-t border-gray-150 flex flex-col justify-between space-y-2">
          {/* Price Row: Current Price + Strikethrough + Discount Pill */}
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg md:text-xl font-black text-gray-950 tracking-tight">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1 sm:px-1.5 py-0.5 rounded-none whitespace-nowrap">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Quantity & Festive Set Badge */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 font-medium">
              <span className="truncate">
                / {product.packTitle || `${product.pieces || 4} pcs`}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-[#8c5700] bg-[#fdb927]/15 px-1.5 py-0.5 rounded-none border border-[#fdb927]/30 flex-shrink-0">
                🪔 Festive Set
              </span>
            </div>
          </div>

          {/* Action Order Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenOrderForm}
            className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-none bg-gradient-to-r from-[#1b072a] via-[#330c4e] to-[#1b072a] hover:from-[#fdb927] hover:via-[#ffc84a] hover:to-[#fdb927] text-white hover:text-[#1b072a] font-extrabold text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-300 border border-[#fdb927]/40 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#fdb927] group-hover:text-[#1b072a] transition-colors flex-shrink-0" />
            <span>Order Now</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
