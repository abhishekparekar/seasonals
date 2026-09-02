import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistModal() {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    isWishlistOpen, 
    setIsWishlistOpen 
  } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 font-inter">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsWishlistOpen(false)}
          className="fixed inset-0 bg-[#0f0417]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#fdb927]/30 z-10 p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#fdb927]/20 mb-6">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900">
                Your Saved Festive Favorites
              </h3>
              <span className="bg-[#fdb927]/20 text-[#1b072a] font-bold text-xs px-2.5 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900"
              aria-label="Close wishlist modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          {wishlist.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 pr-2 space-y-3">
              {wishlist.map((product) => (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-playfair font-bold text-sm text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xs text-gray-900 font-bold">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <>
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                        <span className="text-[11px] text-gray-500">({product.packTitle || `Pack of ${product.pieces || 4}`})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        toggleWishlist(product);
                      }}
                      className="bg-[#1b072a] hover:bg-[#380d56] text-[#fdb927] text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      title="Remove"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[#fdb927]/10 text-2xl flex items-center justify-center mx-auto mb-3">
                ❤️
              </div>
              <h4 className="font-playfair text-lg font-bold text-gray-900 mb-1">
                Your wishlist is empty
              </h4>
              <p className="text-xs text-gray-500 mb-5">
                Saved festive diyas will appear here.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="bg-[#1b072a] text-[#fdb927] text-xs font-bold py-2.5 px-6 rounded-full"
              >
                Browse Collection
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
