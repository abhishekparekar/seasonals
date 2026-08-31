import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveInquiryToFirestore } from '../firebase';
import { useSiteConfig } from '../context/SiteConfigContext';
import { X, Sparkles, Send, Loader2, Phone, CheckCircle2, MessageSquare } from 'lucide-react';

export default function InquiryPopup() {
  const { whatsappConfig, footerConfig } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'Bulk Festive Gifting (50+ Sets)',
    message: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Trigger popup exactly after 2 seconds (2000ms) on each page load/refresh
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await saveInquiryToFirestore({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        inquiryType: formData.inquiryType,
        message: formData.message.trim() || 'Inquired via 3s Festive Popup Form',
        source: '3-Second Instant Popup'
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      console.error('Error saving popup inquiry:', err);
      alert('Could not submit inquiry. Please connect directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const directWhatsAppUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    `Hello Seasonals! 🪔\n\nI would like to inquire about *${formData.inquiryType}*.\nName: ${formData.name || 'Customer'}\nContact: ${formData.phone || ''}\nMessage: ${formData.message || 'Please share product catalog and bulk rates.'}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 font-inter">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#0f0417]/80 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border-2 border-[#fdb927]/50 z-10 my-auto text-gray-900 overflow-hidden max-h-[92vh] flex flex-col justify-between"
          >
            {/* Top Festive Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#280a3e] via-[#fdb927] to-[#280a3e]"></div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer z-20"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 sm:py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl animate-bounce shadow-sm">
                  ✓
                </div>
                <h3 className="font-playfair text-2xl font-bold text-gray-900">
                  Inquiry Received!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                  Thank you for reaching out. Our team will contact you shortly with catalog details & bulk rates.
                </p>
                <div className="pt-2">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-full shadow-sm"
                  >
                    <span>Need Instant Reply? Chat on WhatsApp</span>
                    <span>💬</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto pr-1">
                {/* Header */}
                <div className="mb-4 pr-6">
                  <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/20 border border-[#fdb927]/40 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-[#1b072a] mb-1.5">
                    <Sparkles className="w-3 h-3 text-[#b37400]" />
                    <span>Diwali Special • Bulk & Custom Inquiries</span>
                  </div>
                  <h3 className="font-playfair text-lg sm:text-xl font-extrabold text-gray-900 leading-snug">
                    Looking for Bulk Gifts or Custom Diyas? 🪔
                  </h3>
                  <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed mt-0.5">
                    Get special corporate rates, custom festive packaging & priority doorstep dispatch.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {/* Name & Phone in 2-Col Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-0.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } focus:outline-none focus:border-[#280a3e]`}
                      />
                      {errors.name && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-0.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit mobile number"
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } focus:outline-none focus:border-[#280a3e]`}
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-0.5">
                      Inquiry Requirement
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e] bg-white font-semibold"
                    >
                      <option value="Bulk Festive Gifting (50+ Sets)">📦 Bulk Festive Gifting (50+ Sets)</option>
                      <option value="Corporate Diwali Hampers">🏢 Corporate Diwali Hampers</option>
                      <option value="Custom Handcrafted Color Diyas">🎨 Custom Handcrafted Color Diyas</option>
                      <option value="Wedding / Festive Event Favors">🎉 Wedding / Festive Event Favors</option>
                      <option value="General Store Question">💬 General Question / Support</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-0.5">
                      Your Message / Quantity Estimate
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="e.g. Need 100 sets for corporate Diwali gifts by Oct 20..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e] resize-none"
                    ></textarea>
                  </div>

                  {/* Actions */}
                  <div className="pt-1.5 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#220536] via-[#3d0f5e] to-[#220536] hover:from-[#2f084a] hover:to-[#4c1374] text-[#fdb927] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer border border-[#fdb927]/60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#fdb927]" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#fdb927]" />
                          <span>Submit Instant Inquiry</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-[11px] pt-0.5 px-1">
                      <a
                        href={directWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>Or WhatsApp Directly</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-700 font-medium underline cursor-pointer"
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
