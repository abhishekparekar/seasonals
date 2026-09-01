import React, { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { saveInquiryToFirestore } from '../firebase';
import { Sparkles, Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage({ onNavigate }) {
  const { footerConfig, whatsappConfig } = useSiteConfig();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappConfig.defaultMessage || "Hello Seasonals! 🪔 I have an inquiry regarding your handcrafted festive products.")}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: cleanDigits }));
      if (cleanDigits.length > 0 && !/^[6-9]/.test(cleanDigits)) {
        setFormErrors((prev) => ({ ...prev, phone: 'Indian numbers start with 6, 7, 8, or 9' }));
      } else if (cleanDigits.length > 0 && cleanDigits.length < 10) {
        setFormErrors((prev) => ({ ...prev, phone: `Enter ${10 - cleanDigits.length} more digit(s)` }));
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
    
    const cleanP = (formData.phone || '').replace(/\D/g, '');
    if (!cleanP) {
      errors.phone = 'Please enter your mobile number';
    } else if (cleanP.length !== 10) {
      errors.phone = 'Must be exactly 10 digits';
    }

    if (!formData.message.trim()) errors.message = 'Please enter your message';
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
        inquiryType: `Contact: ${formData.subject}`,
        message: formData.message.trim(),
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      alert('Could not submit message. Please contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span className="text-white">Contact Us</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-[#fdb927]/20 border border-[#fdb927]/40 px-3.5 py-1 rounded-full text-xs font-black text-[#fdb927] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WE ARE HERE TO HELP</span>
            </div>

            <h1 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3 leading-tight">
              Get in Touch with Team Seasonals
            </h1>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl font-medium">
              Have questions about order status, bulk gifting, custom colors, or shipping timelines? Reach out to our dedicated support desk.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Contact Cards Grid: 2x2 on Mobile, 4x1 on Desktop */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          
          {/* Card 1: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-wider block mb-0.5">
                INSTANT CHAT
              </span>
              <h3 className="font-playfair text-xs sm:text-base font-bold text-gray-900 mb-1">
                WhatsApp Chat
              </h3>
              <p className="text-[11px] sm:text-xs font-mono font-bold text-gray-800">
                {footerConfig.supportPhone || "+91 91353 13565"}
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-2 inline-block">
              Chat Now 💬 →
            </span>
          </a>

          {/* Card 2: Phone Helpline */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#fdb927] transition-all flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-[#280a3e] flex items-center justify-center mb-2.5 sm:mb-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-[#280a3e] tracking-wider block mb-0.5">
                HELPLINE
              </span>
              <h3 className="font-playfair text-xs sm:text-base font-bold text-gray-900 mb-1">
                Direct Call
              </h3>
              <p className="text-[11px] sm:text-xs font-mono font-bold text-gray-800">
                {footerConfig.supportPhone || "+91 91353 13565"}
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-500 mt-2 block">
              9 AM - 9 PM IST
            </span>
          </div>

          {/* Card 3: Pan India Delivery */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#fdb927] transition-all flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 sm:mb-3">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-700 tracking-wider block mb-0.5">
                SHIPPING
              </span>
              <h3 className="font-playfair text-xs sm:text-base font-bold text-gray-900 mb-1">
                Pan-India
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">
                15,000+ pincodes covered.
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-500 mt-2 block">
              3-5 business days
            </span>
          </div>

          {/* Card 4: Operating Hours */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#fdb927] transition-all flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2.5 sm:mb-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-rose-700 tracking-wider block mb-0.5">
                SUPPORT
              </span>
              <h3 className="font-playfair text-xs sm:text-base font-bold text-gray-900 mb-1">
                7 Days a Week
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">
                Live festive team assistance.
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-500 mt-2 block">
              Quick response
            </span>
          </div>

        </div>
      </section>

      {/* 3. Contact Form & FAQ Grid */}
      <section className="w-full px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-8 border border-gray-200 shadow-xl">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Send Us a Message
            </h2>
            <p className="text-xs text-gray-600 mb-5 sm:mb-6">
              Fill in your details below and our team will get back to you promptly.
            </p>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-gray-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you for reaching out. We will contact you at <strong>+91 {formData.phone}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 bg-[#1b072a] text-[#fdb927] font-bold text-xs rounded-full cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                        formErrors.name ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                      } focus:outline-none focus:border-[#280a3e]`}
                    />
                    {formErrors.name && (
                      <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.name}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Mobile Number *
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
                      <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#280a3e] bg-white text-gray-700"
                    >
                      <option value="General Question">General Product Question</option>
                      <option value="Order Tracking">Order Tracking / Status</option>
                      <option value="Bulk Order">Bulk & Corporate Gifting</option>
                      <option value="Custom Colors">Custom Diya Colors</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      formErrors.message ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                    } focus:outline-none focus:border-[#280a3e] resize-none`}
                  />
                  {formErrors.message && (
                    <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#1b072a] to-[#3b0f5b] hover:from-[#290a40] hover:to-[#4e1477] text-[#fdb927] hover:text-white flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#fdb927]" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#fdb927]" />
                      <span>Send Message to Team</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#1b072a] text-white rounded-3xl p-5 sm:p-6 border-2 border-[#fdb927]/40 shadow-xl space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪔</span>
                <div>
                  <h3 className="font-playfair text-base sm:text-lg font-bold text-[#fdb927]">
                    Fast Order Assistance
                  </h3>
                  <p className="text-[11px] text-white/70">
                    Need instant confirmation or real-time photos?
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                Connect with our artisan coordination team directly on WhatsApp for expedited order placement, custom colors, or bulk quote generation.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Chat Instantly on WhatsApp 💬</span>
              </a>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-2.5">
              <h4 className="font-playfair text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transit & Quality Promise</span>
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
                  <span>100% replacement guarantee in case of any transit breakage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
                  <span>Double-thick bubble packaging for absolute peace of mind.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
                  <span>Support available 7 days a week during the festive season.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
