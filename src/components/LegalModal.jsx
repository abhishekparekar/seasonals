import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, Truck, Lock } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function LegalModal({ isOpen, onClose, activeDoc = 'privacy' }) {
  const { footerConfig } = useSiteConfig();
  const phone = footerConfig.supportPhone || "+91 91353 13565";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-inter">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0f0417]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-gray-200"
        >
          {/* Header */}
          <div className="bg-[#1b072a] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#fdb927]/20 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo3.png"
                alt="Seasonals Logo"
                className="h-7 w-auto max-w-[120px] object-contain"
              />
              <div>
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#fdb927]">
                  {activeDoc === 'privacy' && 'Privacy Policy'}
                  {activeDoc === 'terms' && 'Terms & Conditions'}
                  {activeDoc === 'shipping' && 'Shipping & Replacement Policy'}
                </h3>
                <p className="text-[11px] text-white/70">
                  Official Legal & Customer Protection Guidelines
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-gray-700 text-xs sm:text-sm leading-relaxed">
            
            {/* 1. PRIVACY POLICY */}
            {activeDoc === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#280a3e] font-bold text-sm sm:text-base border-b pb-2">
                  <Lock className="w-4 h-4 text-[#fdb927]" />
                  <span>Privacy & Data Protection Policy</span>
                </div>
                <p>
                  At <strong>Seasonals</strong>, we value the trust you place in us. This Privacy Policy outlines how your personal information is collected, used, and safeguarded when you order handcrafted terracotta Diya sets through our platform.
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">1. Information We Collect</h4>
                <p>
                  When you place an order or reach out via WhatsApp/Inquiry, we collect your <strong>Full Name, Mobile Number, Shipping Address, and Order Details</strong>. We do not store sensitive credit card or UPI credentials on our servers.
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">2. Secure Payment Processing</h4>
                <p>
                  Online payments are processed securely through <strong>Razorpay Payment Gateway</strong> (PCI-DSS compliant). Your transaction information is encrypted and transmitted securely directly to the banking network.
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">3. Use of Information</h4>
                <p>
                  Your information is strictly used for order fulfillment, dispatch communication, tracking updates via WhatsApp/SMS, and addressing customer support queries. We never sell, rent, or trade your personal data to third parties.
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">4. Contact & Inquiries</h4>
                <p>
                  For any questions regarding privacy, please contact our support team directly at <strong>{phone}</strong> or via WhatsApp.
                </p>
              </div>
            )}

            {/* 2. TERMS & CONDITIONS */}
            {activeDoc === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#280a3e] font-bold text-sm sm:text-base border-b pb-2">
                  <FileText className="w-4 h-4 text-[#fdb927]" />
                  <span>Terms of Service & Purchase Conditions</span>
                </div>

                <p>
                  By accessing the <strong>Seasonals</strong> website and placing an order, you agree to the following terms and guidelines:
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">1. Authentic Handcrafted Products</h4>
                <p>
                  Every Diya is handcrafted individually from organic terracotta clay and hand-painted by specially-abled artisans. Minor natural variations in shape, texture, and metallic gold brush strokes are a celebrated hallmark of authentic handmade craftsmanship.
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">2. Pricing & Orders</h4>
                <p>
                  Prices are listed in Indian National Rupees (INR). We reserve the right to accept or decline any order in the event of stock shortages or unforeseen logistical limitations. Orders are confirmed via Order ID (#ORD-XXXXXX).
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">3. Payment Methods</h4>
                <p>
                  We accept 100% secure online payments via Razorpay (UPI, GPay, PhonePe, Debit/Credit Cards, and Net Banking).
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">4. Social Mission (CSR)</h4>
                <p>
                  Proceeds and procurement are directly tied to the empowerment and livelihood support of our specially-abled artisan partners.
                </p>
              </div>
            )}

            {/* 3. SHIPPING & REPLACEMENT */}
            {activeDoc === 'shipping' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#280a3e] font-bold text-sm sm:text-base border-b pb-2">
                  <Truck className="w-4 h-4 text-[#fdb927]" />
                  <span>Shipping, Delivery & Transit Replacement Policy</span>
                </div>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">1. Dispatch & Delivery Timelines</h4>
                <p>
                  Orders are typically packed and dispatched within <strong>24 to 48 hours</strong>. Standard doorstep delivery usually takes <strong>3-5 business days</strong> via express courier partners.
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">2. Safe Transit Guarantee & Packaging</h4>
                <p>
                  Each Diya set is cushioned with multi-layer bubble packaging, corrugated protective dividers, and sturdy shipping boxes to ensure safe transit to your doorstep.
                </p>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">3. Free Replacement for Transit Damage</h4>
                <p>
                  In the rare instance that your diya arrives damaged during transit, simply share an unboxing photo/video with our WhatsApp support (<strong>{phone}</strong>) within 48 hours of receipt, and we will promptly send a replacement set with zero hassle!
                </p>
              </div>
            )}

          </div>

          {/* Footer Close CTA */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified & Compliant Customer Policy</span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#280a3e] hover:bg-[#3d0f5e] text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              I Understand & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
