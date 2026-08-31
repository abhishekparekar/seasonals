import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { saveOrderToFirestore } from '../firebase';
import { initiateRazorpayPayment } from '../services/razorpay';
import { X, Plus, Minus, ShoppingBag, Sparkles, Send, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct,
    addToCart
  } = useCart();
  const { whatsappConfig } = useSiteConfig();

  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: '',
    orderNotes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' (Razorpay) | 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setQuantity(1);
    setOrderSuccess(null);
    setFormErrors({});
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const totalPrice = product.price * quantity;
  const totalDiyasCount = (product.pieces || 4) * quantity;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const cleanName = formData.name.trim();
    if (!cleanName) {
      errors.name = 'Please enter your name';
    }

    const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.mobileNumber = 'Please enter your 10-digit mobile number';
    }

    // No validation check for address
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

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
        customerAddress: formData.address.trim(),
        productName: `${product.name} (Pack of 4)`,
        onSuccess: async (razorpayResult) => {
          try {
            const orderPayload = {
              name: formData.name.trim(),
              mobileNumber: formData.mobileNumber.trim(),
              address: formData.address.trim(),
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
      alert("Failed to initiate payment gateway. Please try again.");
    }
  };

  const openWhatsAppConfirmation = () => {
    if (!orderSuccess) return;
    const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
    const msg = `Hello Seasonals! 🪔\n\nI just placed an order on your website:\n*Order ID:* #${orderSuccess.orderId.slice(-6).toUpperCase()}\n*Customer Name:* ${orderSuccess.name}\n*Mobile:* ${orderSuccess.mobileNumber}\n*Product:* ${orderSuccess.productName}\n*Quantity:* ${orderSuccess.quantity} pack(s) (${orderSuccess.totalDiyasCount} Diyas)\n*Total Amount:* ₹${orderSuccess.totalPrice}\n*Payment Status:* ${orderSuccess.paymentStatus || 'Pending'}\n*Delivery Address:* ${orderSuccess.address}\n\nPlease share delivery tracking details!`;
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-4 font-inter">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-[#0f0417]/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative bg-white rounded-2xl max-w-md sm:max-w-lg w-full shadow-2xl border border-[#fdb927]/40 z-10 my-auto p-4 sm:p-5 text-gray-900 max-h-[92vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-gray-100 hover:bg-[#fdb927] text-gray-600 hover:text-[#1b072a] transition-colors z-30 cursor-pointer shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Success Screen */}
          {orderSuccess ? (
            <div className="text-center py-3 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-black animate-bounce">
                ✓
              </div>
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-gray-900">
                  {orderSuccess.paymentStatus === 'PAID' ? 'Payment & Order Successful!' : 'Order Placed Successfully!'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Order ID: <strong className="text-[#1b072a]">#{orderSuccess.orderId.slice(-6).toUpperCase()}</strong>
                </p>
                {orderSuccess.paymentId && (
                  <p className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 py-0.5 px-2 rounded inline-block mt-1">
                    Razorpay ID: {orderSuccess.paymentId}
                  </p>
                )}
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Saved under +91 {orderSuccess.mobileNumber}
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#fdb927]/30 text-xs text-left space-y-1">
                <div><strong>Product:</strong> {orderSuccess.productName} ({orderSuccess.quantity} Pack - {orderSuccess.totalDiyasCount} Diyas)</div>
                <div><strong>Total Paid:</strong> <span className="font-bold text-[#1b072a]">₹{orderSuccess.totalPrice}</span> ({orderSuccess.paymentMethod})</div>
                <div><strong>Delivery To:</strong> {orderSuccess.address}</div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={openWhatsAppConfirmation}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Confirm on WhatsApp (Instant Tracking)</span>
                  <span>💬</span>
                </button>

                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="w-full py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 underline cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Order Placement Form - Compact & Responsive */
            <form onSubmit={handleSubmitOrder} className="space-y-2.5 sm:space-y-3">
              
              {/* Product Header */}
              <div className="pr-8 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#fdb927] bg-[#1b072a] px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#fdb927]" />
                    <span>Direct Order</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                    {product.packTitle || `Pack of ${product.pieces || 4}`}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-playfair text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
                    {product.name}
                  </h3>
                  <span className="text-base sm:text-lg font-black text-[#1b072a] flex-shrink-0">
                    ₹{product.price}
                  </span>
                </div>
              </div>

              {/* Compact Specification Strip */}
              <div className="bg-[#FAF7F2] rounded-lg px-2.5 py-1.5 border border-[#fdb927]/25 text-[11px] text-gray-700 leading-tight">
                <span className="font-bold text-[#1b072a]">✨ Detail: </span>
                {product.description || "100% handmade terracotta clay with metallic golden rim & embossed floral rosette."}
              </div>

              {/* Quantity Selector Row */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-800">
                    Qty:
                  </span>
                  <span className="text-[10px] text-gray-500">
                    ({totalDiyasCount} Diyas)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-6 h-6 rounded-md bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-black text-xs text-[#1b072a]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-6 h-6 rounded-md bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer text-xs font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block leading-none">Total</span>
                  <span className="text-sm sm:text-base font-black text-[#1b072a]">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Customer Inputs in Compact 2-Col Grid */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                        formErrors.name ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                      } focus:outline-none focus:border-[#280a3e]`}
                    />
                    {formErrors.name && (
                      <span className="text-[9px] text-red-500 block">{formErrors.name}</span>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                      Mobile Number (10-Digit) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-gray-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        maxLength="10"
                        placeholder="Enter 10-digit number"
                        className={`w-full pl-9 pr-2.5 py-1.5 text-xs rounded-lg border ${
                          formErrors.mobileNumber ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                        } focus:outline-none focus:border-[#280a3e]`}
                      />
                    </div>
                    {formErrors.mobileNumber && (
                      <span className="text-[9px] text-red-500 block">{formErrors.mobileNumber}</span>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                    Delivery Address & City *
                  </label>
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your delivery address, city & pincode"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-[#280a3e] resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Compact Razorpay Security Strip */}
              <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#fdb927]/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#1b072a]" />
                  <span className="text-[11px] font-bold text-[#1b072a]">Pay Online via Razorpay</span>
                  <span className="text-[10px] text-gray-500 hidden sm:inline">(UPI, GPay, Cards)</span>
                </div>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>100% Secure</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 space-y-1.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#280a3e] to-[#451268] hover:from-[#350d52] hover:to-[#55187e] text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#fdb927]" />
                      <span>Opening Payment Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#fdb927]" />
                      <span>Pay ₹{totalPrice} & Confirm Order</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-2 px-3 rounded-xl font-semibold text-xs border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#1b072a]" />
                  <span>Add to Cart (Buy More)</span>
                </button>
              </div>

              {/* Trust Footer */}
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-500 pt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>100% Safe Transit Bubble Packaging • Official Invoice</span>
              </div>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
