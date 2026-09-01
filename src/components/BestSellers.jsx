import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

export default function BestSellers({ onNavigate, isPreview = false }) {
  const { products, loading, shopConfig } = useSiteConfig();

  const badgeText = shopConfig?.badgeText || "Shop the Season";
  const title = shopConfig?.title || "Made for Your Celebrations";
  const subtitle = shopConfig?.subtitle || "From festive décor to thoughtful gifts and return favours, discover handmade creations designed to make your celebrations a little more special";

  const displayProducts = isPreview && products && products.length > 8
    ? products.slice(0, 8)
    : products;

  return (
    <section id="bestsellers" className="py-8 sm:py-12 bg-white relative w-full font-inter">
      <div className="w-full px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Heading with Festive Ornamentation */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          
          <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/35 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#1b072a] mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
            <span>{badgeText}</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-[1.5px] w-10 sm:w-20 bg-gradient-to-r from-transparent to-[#fdb927]"></span>
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h2>
            <span className="h-[1.5px] w-10 sm:w-20 bg-gradient-to-l from-transparent to-[#fdb927]"></span>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>

        {/* Dynamic products grid - 4 Columns on Large Screens for perfect full-width balance */}
        {displayProducts && displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#fdb927] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading festive products...</p>
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-b from-[#FAF7F2] to-white rounded-3xl border border-[#fdb927]/30 max-w-md mx-auto p-6 shadow-sm">
            <span className="text-3xl mb-2 block">🪔</span>
            <h3 className="font-playfair text-lg font-bold text-gray-900 mb-1">
              Festive Collection
            </h3>
            <p className="text-xs text-gray-500">
              New handcrafted Diya sets added by the store manager in the Admin Panel will appear here live.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
