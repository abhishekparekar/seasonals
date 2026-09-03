import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { saveOrderToFirestore } from '../firebase';
import { initiateRazorpayPayment } from '../services/razorpay';
import { lookupPincode } from '../utils/pincodeHelper';
import { X, Plus, Minus, ShoppingBag, Sparkles, Send, Loader2, CreditCard, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct,
    addToCart
  } = useCart();
  const { whatsappConfig } = useSiteConfig();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    pincode: '',
    addressLine: '',
    city: '',
    district: '',
    state: '',
    orderNotes: ''
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeSuccess, setPincodeSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' (Razorpay) | 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setQuantity(1);
    setActiveImageIndex(0);
    setOrderSuccess(null);
    setFormErrors({});
    setPincodeSuccess(false);
    setPincodeLoading(false);
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);

  const currentMainImage = productImages[activeImageIndex] || product.image;
  const totalPrice = product.price * quantity;
  const totalDiyasCount = (product.pieces || 4) * quantity;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobileNumber') {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, mobileNumber: cleanDigits }));
      if (cleanDigits.length > 0 && !/^[6-9]/.test(cleanDigits)) {
        setFormErrors((prev) => ({ ...prev, mobileNumber: 'Indian numbers start with 6, 7, 8, or 9' }));
      } else if (cleanDigits.length > 0 && cleanDigits.length < 10) {
        setFormErrors((prev) => ({ ...prev, mobileNumber: `Enter ${10 - cleanDigits.length} more digit(s)` }));
      } else if (cleanDigits.length === 10 && /^[6-9]\d{9}$/.test(cleanDigits)) {
        setFormErrors((prev) => ({ ...prev, mobileNumber: '' }));
      } else {
        setFormErrors((prev) => ({ ...prev, mobileNumber: '' }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePincodeChange = async (e) => {
    const rawVal = e.target.value;
    const cleanPin = rawVal.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      setPincodeLoading(true);
      setPincodeSuccess(false);
      const res = await lookupPincode(cleanPin);
      setPincodeLoading(false);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          city: res.city || prev.city,
          district: res.district || prev.district,
          state: res.state || prev.state
        }));
        setPincodeSuccess(true);
        setFormErrors((prev) => ({ ...prev, pincode: '' }));
      } else {
        setFormErrors((prev) => ({ ...prev, pincode: res.error || 'Pincode not recognized' }));
        setPincodeSuccess(false);
      }
    } else {
      setPincodeSuccess(false);
      if (cleanPin.length > 0 && cleanPin.length < 6) {
        setFormErrors((prev) => ({ ...prev, pincode: `Enter ${6 - cleanPin.length} more digit(s)` }));
      } else {
        setFormErrors((prev) => ({ ...prev, pincode: '' }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const cleanName = formData.name.trim();
    if (!cleanName) {
      errors.name = 'Please enter your name';
    }

    const cleanPhone = (formData.mobileNumber || '').replace(/\D/g, '');
    if (!cleanPhone) {
      errors.mobileNumber = 'Please enter your 10-digit mobile number';
    } else if (cleanPhone.length !== 10) {
      errors.mobileNumber = 'Must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.mobileNumber = 'Must start with 6, 7, 8, or 9';
    }

    const cleanPin = (formData.pincode || '').replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pincode = 'Please enter a valid 6-digit Pincode';
    }

    if (!formData.addressLine.trim()) {
      errors.addressLine = 'Please enter your house/street address';
    }

    if (!formData.city.trim()) {
      errors.city = 'Please enter or confirm city';
    }

    if (!formData.state.trim()) {
      errors.state = 'Please enter or confirm state';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

  const fullCombinedAddress = `${formData.addressLine.trim()}, ${formData.city.trim()}, ${formData.district.trim() ? formData.district.trim() + ', ' : ''}${formData.state.trim()} - ${formData.pincode.trim()}`;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Online Razorpay Payment Flow
    setIsSubmitting(true);
    try {
      await initiateRazorpayPayment({
        amount: totalPrice,
        customerName: formData.name.trim(),
        customerPhone: formData.mobileNumber.trim(),
        customerAddress: fullCombinedAddress,
        productName: `${product.name} (Pack of ${product.pieces || 4})`,
        onSuccess: async (razorpayResult) => {
          try {
            const orderPayload = {
              name: formData.name.trim(),
              mobileNumber: formData.mobileNumber.trim(),
              pincode: formData.pincode.trim(),
              addressLine: formData.addressLine.trim(),
              city: formData.city.trim(),
              district: formData.district.trim() || null,
              state: formData.state.trim(),
              address: fullCombinedAddress,
              orderNotes: formData.orderNotes.trim() || null,
              productId: product.id,
              productName: product.name,
              productColor: product.colorName || null,
              pricePerPack: product.price,
              quantity: quantity,
              totalDiyasCount: totalDiyasCount,
              totalPrice: totalPrice,
              status: 'confirmed',
              paymentMethod: 'Razorpay Online',
              paymentStatus: 'PAID',
              paymentId: razorpayResult.paymentId || 'RZP_' + Date.now(),
              image: product.image
            };

            const res = await saveOrderToFirestore(orderPayload);
            setOrderSuccess({
              orderId: res.orderId,
              ...orderPayload
            });
          } catch (err) {
            console.error(err);
            alert("Payment was successful, but error saving order details. Please message us on WhatsApp with payment ID.");
          } finally {
            setIsSubmitting(false);
          }
        },
        onFailure: (err) => {
          console.error("Razorpay error:", err);
          setIsSubmitting(false);
          alert("Payment was not completed. Please try again.");
        },
        onDismiss: () => {
          setIsSubmitting(false);
        }
      });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert("Could not initialize Razorpay checkout. Please order via WhatsApp.");
    }
  };

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const whatsappMsg = `Hello Seasonals! 🪔 I would like to order:
*Product:* ${product.name}
*Quantity:* ${quantity} Pack(s) (${totalDiyasCount} Diyas)
*Price:* ₹${totalPrice}
*Customer Name:* ${formData.name || 'Not provided'}
*Phone:* ${formData.mobileNumber || 'Not provided'}
*Delivery Address:* ${fullCombinedAddress !== ',  - ' ? fullCombinedAddress : 'Will provide in chat'}`;

  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto font-inter">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-[#fdb927]/30"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-gradient-to-r from-[#1b072a] via-[#3d0f5e] to-[#1b072a] text-white border-b border-[#fdb927]/40">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">🪔</span>
            <div>
              <h2 className="font-playfair text-sm sm:text-base font-bold text-[#fdb927]">
                {product.name}
              </h2>
              <p className="text-[10px] text-white/70">
                100% Pure Organic Terracotta • Gold Rim
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          {orderSuccess ? (
            /* Order Success View */
            <div className="text-center py-8 px-4 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h3 className="font-playfair text-2xl font-bold text-gray-900">
                Order Confirmed!
              </h3>
              <p className="text-xs text-gray-600">
                Thank you, <strong>{orderSuccess.name}</strong>. Your payment was successful and your handcrafted diya order has been confirmed.
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl border text-xs text-left space-y-1 font-mono">
                <div><strong>Order ID:</strong> #{orderSuccess.orderId.slice(-8).toUpperCase()}</div>
                <div><strong>Product:</strong> {orderSuccess.productName} ({orderSuccess.quantity} Pack(s))</div>
                <div><strong>Total Paid:</strong> ₹{orderSuccess.totalPrice}</div>
                <div><strong>Address:</strong> {orderSuccess.address}</div>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="w-full py-3 bg-[#1b072a] text-[#fdb927] font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Product Image Gallery & Specs */}
              <div className="md:col-span-5 space-y-3.5">
                
                {/* Main Active Image with Zoom */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] border border-gray-200 shadow-inner group">
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={currentMainImage}
                      src={currentMainImage}
                      alt={product.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </AnimatePresence>
                  
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-[#1b072a]/90 text-[#fdb927] text-[10px] font-bold px-2.5 py-1 rounded-md border border-[#fdb927]/40 shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md border border-white/40 tracking-tight">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Multiple Images Thumbnail Gallery */}
                {productImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {productImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#fdb927] scale-105 shadow-md'
                            : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Price & Quantity Box */}
                <div className="p-3.5 bg-[#FFF8EB] rounded-2xl border border-[#fdb927]/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Price Per Pack</span>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-2xl font-black text-[#1b072a]">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <>
                            <span className="text-sm font-bold text-gray-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500">/ Pack of {product.pieces || 4}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-white rounded-xl border border-gray-300 shadow-sm p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-gray-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#fdb927]/30 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span>Total Amount ({totalDiyasCount} Diyas):</span>
                      <div className="flex items-baseline gap-1.5">
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice * quantity}
                          </span>
                        )}
                        <span className="text-lg font-black text-[#280a3e]">₹{totalPrice}</span>
                      </div>
                    </div>
                    {product.originalPrice > product.price && (
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center justify-between">
                        <span>🎉 Total Festive Savings:</span>
                        <span>₹{(product.originalPrice - product.price) * quantity}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add to Cart Quick Trigger */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs bg-[#FFF8EB] hover:bg-[#FFF1D6] text-[#1b072a] border-2 border-[#fdb927]/80 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#9a6400]" />
                  <span>Add to Shopping Cart</span>
                </button>
              </div>

              {/* Right Column: Checkout Form with Pincode Auto-Fill */}
              <div className="md:col-span-7 space-y-4">
                <form onSubmit={handleSubmitOrder} className="space-y-3.5">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                    <h3 className="font-playfair text-sm sm:text-base font-bold text-gray-900">
                      Express Doorstep Checkout
                    </h3>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Zero Risk Guarantee</span>
                    </span>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-950 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${
                          formErrors.name ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                        } focus:outline-none focus:border-[#280a3e] text-gray-900 font-medium`}
                      />
                      {formErrors.name && (
                        <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-950 block mb-1">
                        Mobile Number *
                      </label>
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-2 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-950 text-xs font-bold select-none flex-shrink-0">
                          <span>🇮🇳 +91</span>
                        </span>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          maxLength={10}
                          placeholder="98765 43210"
                          className={`w-full px-3 py-2 text-xs rounded-r-xl border ${
                            formErrors.mobileNumber ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                          } focus:outline-none focus:border-[#280a3e] font-bold text-gray-900`}
                        />
                      </div>
                      {formErrors.mobileNumber && (
                        <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.mobileNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Pincode with Realtime Auto-Lookup */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-gray-950 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#b45309]" />
                        <span>Pincode (Auto-fills City & State) *</span>
                      </label>
                      {pincodeLoading && (
                        <span className="text-[10px] text-[#b45309] font-bold flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Fetching city & state...
                        </span>
                      )}
                      {pincodeSuccess && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Auto-filled successfully
                        </span>
                      )}
                    </div>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      maxLength={6}
                      placeholder="Enter 6-digit Pincode (e.g. 400001)"
                      className={`w-full px-3 py-2 text-xs rounded-xl border font-bold text-gray-900 ${
                        formErrors.pincode 
                          ? 'border-red-500 bg-red-50/40' 
                          : pincodeSuccess 
                            ? 'border-emerald-500 bg-emerald-50/30' 
                            : 'border-gray-300'
                      } focus:outline-none focus:border-[#280a3e]`}
                    />
                    {formErrors.pincode && (
                      <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.pincode}</span>
                    )}
                  </div>

                  {/* House / Street Address */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-950 block mb-1">
                      Flat / House No., Building, Street Name *
                    </label>
                    <input
                      type="text"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 402, Lotus Towers, MG Road"
                      className={`w-full px-3 py-2 text-xs rounded-xl border text-gray-900 font-medium ${
                        formErrors.addressLine ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                      } focus:outline-none focus:border-[#280a3e]`}
                    />
                    {formErrors.addressLine && (
                      <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.addressLine}</span>
                    )}
                  </div>

                  {/* City, District, State (Auto-filled / Editable) */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-950 block mb-0.5">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className={`w-full px-2.5 py-1.5 text-xs rounded-lg border text-gray-900 ${
                          formErrors.city ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-[#280a3e] bg-gray-50 font-bold`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-950 block mb-0.5">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="District"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-[#280a3e] bg-gray-50 font-bold text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                          formErrors.state ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-[#280a3e] bg-gray-50 font-medium`}
                      />
                    </div>
                  </div>

                  {/* Primary Razorpay Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#220536] via-[#3d0f5e] to-[#220536] hover:from-[#2f084a] hover:to-[#4e1477] text-[#fdb927] hover:text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer border-2 border-[#fdb927]/60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#fdb927]" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-[#fdb927]" />
                        <span>Pay Online ₹{totalPrice} (Razorpay / UPI / Card)</span>
                      </>
                    )}
                  </button>

                  {/* Or Order on WhatsApp CTA */}
                  <div className="pt-1">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <span>💬 Order on WhatsApp</span>
                    </a>
                  </div>
                </form>
              </div>

            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
