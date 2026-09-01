import React, { useState } from 'react';
import InquiryForm from '../components/InquiryForm';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Sparkles, Gift, CheckCircle2, Building2, PackageCheck, Truck, ShieldCheck, ChevronDown, ChevronUp, MessageSquare, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BulkGiftingPage({ onNavigate }) {
  const { whatsappConfig, footerConfig } = useSiteConfig();
  
  const [activeFaq, setActiveFaq] = useState(null);

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const directWhatsAppUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent("Hello Seasonals! 🪔 I would like to inquire about Corporate Festive Bulk Gifting packages and custom branding options.")}`;

  const corporateBenefits = [
    {
      icon: Gift,
      title: "Customized Festive Packaging",
      desc: "Add your corporate logo, custom ribbon, greeting card, or personalized message inside each premium gift box."
    },
    {
      icon: Building2,
      title: "CSR & Social Impact Alignment",
      desc: "Every bulk order directly supports livelihood, artistic training, and financial dignity for specially-abled children."
    },
    {
      icon: Truck,
      title: "Pan-India Multi-Location Dispatch",
      desc: "We can ship directly to individual employee home addresses across 15,000+ pincodes or deliver in bulk to your corporate office."
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
        "Pan-India Express Dispatch",
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
        "Pan-India Multi-Address Shipping",
        "Complimentary Cotton Wicks"
      ]
    },
    {
      tier: "Enterprise Tier",
      quantity: "500+ Packs",
      diyaCount: "2,000+ Diyas",
      tag: "Mega Corporates & Events",
      features: [
        "Full Custom Box Branding",
        "Special Volume Tier Discounts",
        "Dedicated Account Manager",
        "Custom Sample Box Dispatched First",
        "GST Invoice with Full Tax Input"
      ]
    }
  ];

  const faqs = [
    {
      q: "What is the Minimum Order Quantity (MOQ) for corporate gifting?",
      a: "Our bulk orders start at just 25 packs (100 diyas). We can cater to orders up to 5,000+ packs for large enterprise clients."
    },
    {
      q: "Can we request a physical sample before placing the full bulk order?",
      a: "Yes! We can dispatch a sample box containing our assorted terracotta handcrafted diyas directly to your office within 2-3 business days."
    },
    {
      q: "Can you deliver to employee home addresses directly?",
      a: "Absolutely. You can share your employee or client address sheet in Excel, and we will handle end-to-end individual door-to-door delivery with tracking numbers."
    },
    {
      q: "What is the delivery turnaround time for bulk orders?",
      a: "Standard bulk orders (50 - 500 packs) are crafted, packaged and dispatched within 3 to 6 business days. For urgent timelines, express expedited priority dispatch is available."
    },
    {
      q: "Do you provide GST invoices for corporate accounting?",
      a: "Yes, 100% compliant GST invoices with full input tax credit are provided for all corporate and bulk purchases."
    }
  ];

  return (
    <div className="w-full font-inter bg-[#FFFDF9] min-h-screen pb-16">
      
      {/* 1. Header & Breadcrumb */}
      <section className="bg-gradient-to-r from-[#1b072a] via-[#2f084a] to-[#1b072a] text-white py-10 sm:py-16 relative overflow-hidden border-b-2 border-[#fdb927]/40 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fdb927]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7b1fa2]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#fdb927]/80 mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-white">Bulk & Corporate Gifting</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/20 border border-[#fdb927]/40 px-3.5 py-1 rounded-full text-xs font-black text-[#fdb927] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CORPORATE • WEDDINGS • EVENT FAVORS</span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
              Bespoke Corporate Festive Gifting & Bulk Orders
            </h1>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl font-medium">
              Elevate your corporate gifting with meaningful, sustainable terracotta diyas crafted by specially-abled artisans. Beautifully packaged with your brand identity.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Key Benefits */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {corporateBenefits.map((benefit, idx) => {
            const IconComp = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#fdb927] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#fdb927]/20 text-[#1b072a] flex items-center justify-center mb-3">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-base font-bold text-gray-900 mb-1.5">
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

      {/* 3. Bulk Tiers Cards */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#1b072a] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
            <span>VOLUME PACKAGES</span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Tailored Bulk Gifting Packages
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Flexible tier options to fit team sizes and corporate gifting budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bulkTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 transition-all flex flex-col justify-between ${
                tier.highlight
                  ? 'bg-[#1b072a] text-white border-2 border-[#fdb927] shadow-xl scale-[1.02]'
                  : 'bg-white text-gray-900 border border-gray-200 shadow-sm hover:border-[#fdb927]/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    tier.highlight ? 'bg-[#fdb927] text-[#1b072a]' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tier.tag}
                  </span>
                  <span className="text-xs font-bold opacity-70">
                    {tier.diyaCount}
                  </span>
                </div>

                <h3 className={`font-playfair text-xl font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {tier.tier}
                </h3>
                <div className={`text-2xl font-black mb-4 ${tier.highlight ? 'text-[#fdb927]' : 'text-[#1b072a]'}`}>
                  {tier.quantity}
                </div>

                <ul className="space-y-2.5 text-xs mb-6">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        tier.highlight ? 'text-[#fdb927]' : 'text-emerald-600'
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
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black text-center transition-all ${
                  tier.highlight
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

      {/* 4. Interactive Inquiry Form */}
      <section className="w-full pt-12">
        <InquiryForm />
      </section>

      {/* 5. FAQs Accordion */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Everything you need to know about placing bulk & corporate festive orders.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-gray-900 hover:text-[#1b072a] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#d97706] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-600 border-t border-gray-100 bg-[#FAF7F2]/40 leading-relaxed">
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
