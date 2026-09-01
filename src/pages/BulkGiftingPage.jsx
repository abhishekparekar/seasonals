import React, { useState } from 'react';
import InquiryForm from '../components/InquiryForm';
import BannerBackground from '../components/BannerBackground';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Sparkles, Gift, CheckCircle2, Building2, PackageCheck, Truck, ShieldCheck, ChevronDown, ChevronUp, MessageSquare, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BulkGiftingPage({ onNavigate }) {
  const { bulkConfig, whatsappConfig } = useSiteConfig();
  const [activeFaq, setActiveFaq] = useState(null);

  const cleanPhone = (whatsappConfig?.phoneNumber || "9135313565").replace(/\D/g, "");
  const directWhatsAppUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent("Hello Seasonals! 🪔 I would like to inquire about Corporate Festive Bulk Gifting packages and custom branding options.")}`;

  const bulkImages = Array.isArray(bulkConfig?.bgImages) && bulkConfig.bgImages.length > 0
    ? bulkConfig.bgImages
    : (bulkConfig?.bgImage ? [bulkConfig.bgImage] : []);

  const corporateBenefits = [
    {
      icon: Gift,
      title: "Custom Brand Personalization",
      desc: "Add your corporate logo, customized greeting cards, and bespoke festive packaging tailored to your brand identity."
    },
    {
      icon: Building2,
      title: "CSR & Social Impact Alignment",
      desc: "Every bulk order directly supports livelihood, artistic training, and financial dignity for specially-abled children."
    },
    {
      icon: Truck,
      title: "Direct Multi-Location Dispatch",
      desc: "We can ship directly to employee home addresses or deliver in bulk directly to your corporate office."
    },
    {
      icon: ShieldCheck,
      title: "Breakage-Free Bubble Packaging",
      desc: "Double-reinforced bubble wrapping and sturdy corrugated boxing ensures 100% zero-damage transit guarantee."
    }
  ];

  const bulkTiers = [
    {
      tier: "Starter Tier",
      quantity: "25 - 50 Packs",
      diyaCount: "100 - 200 Diyas",
      tag: "Small Teams & Families",
      features: [
        "Assorted Vibrant Color Mix",
        "Festive Gift Box Packaging",
        "Express Safe Dispatch",
        "Dedicated Support Desk"
      ]
    },
    {
      tier: "Popular Tier",
      quantity: "100 - 250 Packs",
      diyaCount: "400 - 1,000 Diyas",
      tag: "Most Popular for Corporates",
      highlight: true,
      features: [
        "Custom Logo Greeting Card Included",
        "Choice of Custom Color Themes",
        "Priority Workshop Production",
        "Direct Multi-Address Delivery",
        "Complimentary Cotton Wicks"
      ]
    },
    {
      tier: "Enterprise Tier",
      quantity: "500+ Packs",
      diyaCount: "2,000+ Diyas",
      tag: "Mega Corporates & Events",
      features: [
        "Full Custom Branding & Gift Boxes",
        "Exclusive Color Combinations",
        "Dedicated Relationship Manager",
        "Multi-Batch Scheduled Deliveries",
        "Direct Impact Certificate for HR"
      ]
    }
  ];

  const corporateFaqs = [
    {
      q: "Can we get our company logo printed on the gift boxes?",
      a: "Yes! For orders above 50 packs, we provide custom printed logo sleeves, branded greeting cards, and customized thank-you notes crafted with your message."
    },
    {
      q: "Can you ship directly to individual employee home addresses?",
      a: "Absolutely. Provide us with an Excel sheet of addresses, and our logistics team will safely dispatch individual bubble-packed gift boxes directly to each employee."
    },
    {
      q: "What is the turnaround time for bulk orders?",
      a: "Standard bulk orders (50 - 500 packs) are crafted, packaged and dispatched within 3 to 6 business days. For urgent timelines, express expedited priority dispatch is available."
    },
    {
      q: "Do you provide GST invoices for corporate accounting?",
      a: "Yes, 100% compliant GST invoices with full input tax credit are provided for all corporate and bulk purchases."
    }
  ];

  return (
    <div className="w-full font-inter bg-[#FFFDF9] min-h-screen pb-16">

      {/* 1. Header with Dynamic Multi-Image Slider */}
      <section className="relative text-white py-10 sm:py-14 overflow-hidden border-b-2 border-[#fdb927]/40 shadow-lg min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center">
        <BannerBackground images={bulkImages} />

        <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/20 backdrop-blur-sm border border-[#fdb927]/40 px-3.5 py-1 rounded-full text-xs font-black text-[#fdb927] mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{bulkConfig?.badgeText || "CORPORATE • WEDDINGS • EVENT FAVORS"}</span>
            </div>

            <h1 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 leading-tight drop-shadow-md">
              {bulkConfig?.title || "Bespoke Corporate Festive Gifting & Bulk Orders"}
            </h1>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl font-medium drop-shadow-sm">
              {bulkConfig?.subtitle || "Elevate your corporate gifting with meaningful, sustainable terracotta diyas crafted by specially-abled artisans. Beautifully packaged with your brand identity."}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Strip (Below Header Banner) */}
      <div className="bg-[#FAF7F2] border-b border-[#fdb927]/25 py-2.5 px-3.5 sm:px-6 lg:px-8">
        <div className="w-full flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => onNavigate('home')}
            className="text-gray-500 hover:text-[#b45309] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-[#b45309] font-black">Bulk & Corporate Gifting</span>
        </div>
      </div>

      {/* 2. Bulk Tiers Cards (VOLUME PACKAGES) */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#1b072a] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
            <span>VOLUME PACKAGES</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Tailored Bulk Gifting Packages
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Flexible tier options to fit team sizes and corporate gifting budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {bulkTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between ${tier.highlight
                  ? 'bg-[#1b072a] text-white border-2 border-[#fdb927] shadow-xl md:scale-[1.02]'
                  : 'bg-white text-gray-900 border border-gray-200 shadow-sm hover:border-[#fdb927]/60'
                }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${tier.highlight ? 'bg-[#fdb927] text-[#1b072a]' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {tier.tag}
                  </span>
                  <span className="text-xs font-bold opacity-70">
                    {tier.diyaCount}
                  </span>
                </div>

                <h3 className={`font-playfair text-lg sm:text-xl font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {tier.tier}
                </h3>
                <div className={`text-xl sm:text-2xl font-black mb-3.5 sm:mb-4 ${tier.highlight ? 'text-[#fdb927]' : 'text-[#1b072a]'}`}>
                  {tier.quantity}
                </div>

                <ul className="space-y-2 text-xs mb-5 sm:mb-6">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.highlight ? 'text-[#fdb927]' : 'text-emerald-600'
                        }`} />
                      <span className={tier.highlight ? 'text-white/90' : 'text-gray-600'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black text-center transition-all ${tier.highlight
                    ? 'bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] shadow-md'
                    : 'bg-[#1b072a] hover:bg-[#280a3e] text-[#fdb927]'
                  }`}
              >
                Inquire for {tier.tier}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Key Benefits (Display after VOLUME PACKAGES) */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {corporateBenefits.map((benefit, idx) => {
            const IconComp = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#fdb927] transition-all"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#fdb927]/20 text-[#1b072a] flex items-center justify-center mb-2.5 sm:mb-3">
                  <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Inquiry Form */}
      <section className="w-full pt-10 sm:pt-12">
        <InquiryForm />
      </section>

      {/* 5. FAQs Accordion */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-playfair text-xl sm:text-3xl font-black text-gray-900 mb-1.5">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Everything you need to know about placing bulk & corporate festive orders.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {corporateFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-gray-900 hover:text-[#1b072a] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#d97706] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 text-xs text-gray-600 border-t border-gray-100 bg-[#FAF7F2]/40 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
