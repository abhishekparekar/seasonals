import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { saveInquiryToFirestore } from '../firebase';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Send, CheckCircle2, MessageSquare, Sparkles, Phone, Mail, HelpCircle, Loader2 } from 'lucide-react';

export default function InquiryForm() {
  const { whatsappConfig, footerConfig, inquiryConfig } = useSiteConfig();

  const badgeText = inquiryConfig?.badgeText || "Have Questions or Need Bulk Orders?";
  const title = inquiryConfig?.title || "Inquire & Custom Orders";
  const subtitle = inquiryConfig?.subtitle || "Looking for corporate gifting, custom color combinations, event favors, or bulk orders? Send us an inquiry and our team will get back to you promptly.";

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'Bulk Diwali Gifting',
    quantityEstimate: '50-100 packs',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: cleanDigits }));
      if (cleanDigits.length > 0 && !/^[6-9]/.test(cleanDigits)) {
        setFormErrors((prev) => ({ ...prev, phone: 'Indian numbers start with 6, 7, 8, or 9' }));
      } else if (cleanDigits.length > 0 && cleanDigits.length < 10) {
        setFormErrors((prev) => ({ ...prev, phone: `Enter ${10 - cleanDigits.length} more digit(s)` }));
      } else if (cleanDigits.length === 10 && /^[6-9]\d{9}$/.test(cleanDigits)) {
        setFormErrors((prev) => ({ ...prev, phone: '' }));
      } else {
        setFormErrors((prev) => ({ ...prev, phone: '' }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name';
    
    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (!cleanPhone) {
      errors.phone = 'Please enter your mobile number';
    } else if (cleanPhone.length !== 10) {
      errors.phone = 'Must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = 'Must start with 6, 7, 8, or 9';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please provide details about your inquiry';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
        quantityEstimate: formData.quantityEstimate,
        ...formData,
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving inquiry:', err);
      alert('Could not submit inquiry. Please contact us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsAppUrl = `https://wa.me/91${(whatsappConfig?.phoneNumber || "9135313565").replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hello Seasonals! 🪔\n\nI have an inquiry regarding *${formData.inquiryType}*.\nName: ${formData.name || 'Customer'}\nContact: ${formData.phone || ''}\nMessage: ${formData.message || 'Please share product catalog and bulk rates.'}`
  )}`;

  return (
    <section id="inquiry" className="py-10 sm:py-16 bg-gradient-to-b from-white via-[#FAF7F2] to-white relative w-full font-inter overflow-hidden border-t border-gray-100">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1b072a]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/15 border border-[#fdb927]/30 px-3.5 py-1 rounded-full text-xs font-semibold text-[#1b072a] mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#b37400]" />
            <span>{badgeText}</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Main Grid: Form on Left + Direct Contact Info on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-8 border border-[#fdb927]/30 shadow-xl"
          >
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl animate-bounce">
                  ✓
                </div>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900">
                  Thank You for Your Inquiry!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  We have received your details. Our representative will reach out to you on <strong>+91 {formData.phone}</strong> shortly.
                </p>

                <div className="pt-4 space-y-2.5 max-w-sm mx-auto">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <span>Connect Instantly on WhatsApp 💬</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        inquiryType: 'Bulk Diwali Gifting',
                        quantityEstimate: '50-100 packs',
                        message: ''
                      });
                    }}
                    className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                        formErrors.name ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                      } focus:outline-none focus:border-[#280a3e]`}
                    />
                    {formErrors.name && (
                      <span className="text-[10px] text-red-500 block mt-0.5">{formErrors.name}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center gap-1 px-3 py-2.5 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-xs font-extrabold select-none flex-shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        placeholder="98765 43210"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-r-xl border ${
                          formErrors.phone ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                        } focus:outline-none focus:border-[#280a3e] font-semibold text-gray-900`}
                      />
                    </div>
                    {formErrors.phone && (
                      <span className="text-[10px] text-red-500 font-semibold block mt-0.5">{formErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e]"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Inquiry Category
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e] bg-white"
                    >
                      <option value="Bulk Diwali Gifting">Corporate / Bulk Diwali Gifting</option>
                      <option value="Custom Diya Set">Custom Diya Colors / Assortments</option>
                      <option value="Wedding / Event Favors">Wedding / Festive Event Favors</option>
                      <option value="Reseller / Wholesale">Reseller / Wholesale Inquiry</option>
                      <option value="General Question">General Product Question</option>
                    </select>
                  </div>
                </div>

                {/* Quantity Estimate */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Estimated Quantity Needed
                  </label>
                  <select
                    name="quantityEstimate"
                    value={formData.quantityEstimate}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e] bg-white"
                  >
                    <option value="10-25 packs (40-100 Diyas)">10 - 25 packs (40 - 100 Diyas)</option>
                    <option value="50-100 packs (200-400 Diyas)">50 - 100 packs (200 - 400 Diyas)</option>
                    <option value="100-500 packs (400-2000 Diyas)">100 - 500 packs (400 - 2,000 Diyas)</option>
                    <option value="500+ packs (Mega Bulk)">500+ packs (Mega Bulk Corporate)</option>
                    <option value="Personal Order Inquiry">Personal / Small Order Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Your Requirements / Message *
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your inquiry details, delivery requirements, or questions..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      formErrors.message ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                    } focus:outline-none focus:border-[#280a3e] resize-none`}
                  ></textarea>
                  {formErrors.message && (
                    <span className="text-[10px] text-red-500 block mt-0.5">{formErrors.message}</span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#1b072a] to-[#3b0f5b] hover:from-[#290a40] hover:to-[#4e1477] text-[#fdb927] hover:text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#fdb927]" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#fdb927]" />
                      <span>Submit Inquiry to Team</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right Column: Direct Info & Festive Assurance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Quick WhatsApp Contact Card */}
            <div className="bg-[#1b072a] text-white rounded-3xl p-5 sm:p-6 border border-[#fdb927]/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🪔</span>
                <div>
                  <h4 className="font-playfair text-base sm:text-lg font-bold text-[#fdb927]">
                    Prefer Instant Chat?
                  </h4>
                  <p className="text-[11px] text-white/70">
                    Get instant quotes, images & custom options on WhatsApp.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-xs space-y-1">
                <div className="text-white/60 text-[10px] font-bold uppercase">Official Support Desk:</div>
                <div className="font-mono font-bold text-sm text-[#fdb927]">
                  {footerConfig.supportPhone || "+91 91353 13565"}
                </div>
                <div className="text-[11px] text-white/80">Available 9:00 AM - 9:00 PM IST (Mon-Sun)</div>
              </div>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Chat Directly on WhatsApp 💬</span>
              </a>
            </div>

            {/* Bulk Order Benefits */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-3">
              <h4 className="font-playfair text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b37400]" />
                <span>Why Inquire For Bulk Orders?</span>
              </h4>

              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Custom Gift Boxes:</strong> Personalized packaging with your company branding or festive message.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Pan-India Direct Dispatch:</strong> We can dispatch directly to multiple client or employee addresses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Direct Social Impact:</strong> Every bulk order sustains livelihood for specially-abled artisan families.</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
