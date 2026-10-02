import React, { useState, useMemo } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import ProductCard from '../components/ProductCard';
import { Search, X, ShieldCheck, Truck, RefreshCw, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShopPage({ onNavigate }) {
  const { products, loading } = useSiteConfig();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoryCounts = useMemo(() => {
    const counts = { all: products?.length || 0, diya: 0, lantern: 0, rangoli: 0 };
    if (!products) return counts;
    products.forEach((p) => {
      const cat = (p.category || 'diya').toLowerCase();
      if (cat === 'diya' || cat === 'diyas') counts.diya++;
      else if (cat === 'lantern' || cat === 'lanterns') counts.lantern++;
      else if (cat === 'rangoli') counts.rangoli++;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let list = products;

    if (selectedCategory !== 'all') {
      list = list.filter((p) => {
        const cat = (p.category || 'diya').toLowerCase();
        if (selectedCategory === 'diya') return cat === 'diya' || cat === 'diyas';
        if (selectedCategory === 'lantern') return cat === 'lantern' || cat === 'lanterns';
        if (selectedCategory === 'rangoli') return cat === 'rangoli';
        return cat === selectedCategory;
      });
    }

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter((product) => {
      const matchName = product.name?.toLowerCase().includes(query);
      const matchColor = product.colorName?.toLowerCase().includes(query);
      const matchDesc = product.description?.toLowerCase().includes(query);
      const matchCategory = product.category?.toLowerCase().includes(query);
      const matchCategoryLabel = product.categoryLabel?.toLowerCase().includes(query);
      return matchName || matchColor || matchDesc || matchCategory || matchCategoryLabel;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="w-full font-inter bg-[#FFFDF9] min-h-screen pb-16">

      {/* Unified Top Navigation & Search Bar Strip */}
      <section className="sticky top-14 sm:top-16 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#fdb927]/30 py-2.5 px-3.5 sm:px-6 lg:px-8 shadow-xs">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">

          {/* Left: Page Path / Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap self-start md:self-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-500 hover:text-[#b45309] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-[#b45309] font-black">Shop Collection</span>
          </div>

          {/* Center: Search Bar */}
          <div className="w-full md:max-w-md lg:max-w-lg relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by color, name, set..."
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-white hover:bg-gray-50 focus:bg-white border border-[#fdb927]/40 focus:border-[#280a3e] rounded-full focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Category Count Pill */}
          <div className="hidden lg:inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1b072a] bg-[#fdb927]/15 border border-[#fdb927]/40 px-3 py-1 rounded-full whitespace-nowrap shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
            <span>Handcrafted Festive Collection ({products.length})</span>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs Bar */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-4 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Products', icon: '✨', count: categoryCounts.all },
            { id: 'diya', label: 'Diyas', icon: '🪔', count: categoryCounts.diya },
            { id: 'lantern', label: 'Lanterns', icon: '🏮', count: categoryCounts.lantern },
            { id: 'rangoli', label: 'Rangoli', icon: '🌸', count: categoryCounts.rangoli },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-[#1b072a] text-[#fdb927] border-2 border-[#fdb927] scale-102 shadow-sm'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#fdb927]/20 text-[#fdb927]' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-4">



        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-3 border-[#fdb927] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500">Loading full handcrafted collection...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#fdb927]/30 max-w-lg mx-auto p-8 shadow-sm">
            <span className="text-4xl mb-3 block">{searchQuery ? '🔍' : '🪔'}</span>
            <h3 className="font-playfair text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
              {searchQuery ? 'No Matching Products Found' : 'Festive Collection Coming Soon'}
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              {searchQuery
                ? `We couldn't find any products matching "${searchQuery}". Try searching for another keyword or browse all products.`
                : 'Handcrafted products added by the store administrator will appear here.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-[#1b072a] text-[#fdb927] font-bold text-xs rounded-full shadow-md hover:bg-[#280a3e] transition-all cursor-pointer"
              >
                Show All Festive Products
              </button>
            )}
          </div>
        )}

      </section>

      {/* 4. Trust Badges Strip */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 mt-14">
        <div className="bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#fdb927]/40 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-center sm:text-left">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Safe Transit Packaging</h4>
              <p className="text-[11px] text-gray-500">Double-layer bubble wrap & crashproof box</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#280a3e] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Doorstep Delivery</h4>
              <p className="text-[11px] text-gray-500">Fast doorstep courier dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">100% Social Purpose</h4>
              <p className="text-[11px] text-gray-500">Directly supports talented child artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Pure Terracotta Clay</h4>
              <p className="text-[11px] text-gray-500">100% Eco-friendly & non-toxic gold paints</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
