import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { saveOrderToFirestore } from '../firebase';
import { initiateRazorpayPayment } from '../services/razorpay';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck,
  Send,
  Loader2,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    isCartOpen, 
    setIsCartOpen, 
    cartSubtotal,
    totalItemsCount
  } = useCart();
  const { whatsappConfig } = useSiteConfig();

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

  if (!isCartOpen) return null;

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCartSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Online Razorpay Payment Flow
    setIsSubmitting(true);
    try {
      await initiateRazorpayPayment({
        amount: cartSubtotal,
        customerName: formData.name.trim(),
        customerPhone: formData.mobileNumber.trim(),
        customerAddress: formData.address.trim(),
        productName: `${totalItemsCount} Festive Cart Items`,
        onSuccess: async (razorpayResult) => {
          try {
            const orderPayload = {
              name: formData.name.trim(),
              mobileNumber: formData.mobileNumber.trim(),
              address: formData.address.trim(),
              orderNotes: formData.orderNotes.trim() || null,
              items: cart,
              productName: cart.map(i => `${i.name} (Qty: ${i.quantity})`).join(', '),
              totalItemsCount: totalItemsCount,
              totalPrice: cartSubtotal,
              status: 'confirmed',
              paymentMethod: 'Razorpay Online',
              paymentStatus: 'PAID',
              paymentId: razorpayResult.paymentId || 'RZP_' + Date.now()
            };

            const res = await saveOrderToFirestore(orderPayload);
            setOrderSuccess({
              orderId: res.orderId,
              ...orderPayload
            });
            clearCart();
          } catch (err) {
            console.error(err);
            alert("Payment was successful, but error saving order details. Please message us on WhatsApp with payment ID.");
          } finally {
            setIsSubmitting(false);
          }
        },
        onFailure: (err) => {
          console.error("Razorpay Cart Checkout error:", err);
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
    const msg = `Hello Seasonals! 🪔\n\nI placed an order on your website:\n*Order ID:* #${orderSuccess.orderId.slice(-6).toUpperCase()}\n*Customer:* ${orderSuccess.name}\n*Mobile:* ${orderSuccess.mobileNumber}\n*Items:* ${orderSuccess.productName}\n*Total Amount:* ₹${orderSuccess.totalPrice}\n*Payment Status:* ${orderSuccess.paymentStatus || 'Pending'}\n*Address:* ${orderSuccess.address}\n\nPlease confirm delivery!`;
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-inter">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-[#0f0417]/80 backdrop-blur-sm"
        />

        {/* Slide-over Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#fdb927]/20 text-gray-900"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#1b072a] text-white border-b border-[#fdb927]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#fdb927]" />
                <h3 className="font-playfair text-lg sm:text-xl font-bold">Your Festive Cart</h3>
                <span className="bg-[#fdb927] text-[#1b072a] text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItemsCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {orderSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-playfair text-xl font-bold text-gray-900">
                      {orderSuccess.paymentStatus === 'PAID' ? 'Payment & Order Placed!' : 'Order Placed Successfully!'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Order ID: <strong className="text-[#1b072a]">#{orderSuccess.orderId.slice(-6).toUpperCase()}</strong>
                    </p>
                    {orderSuccess.paymentId && (
                      <p className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 py-0.5 px-2 rounded inline-block mt-1">
                        Razorpay ID: {orderSuccess.paymentId}
                      </p>
                    )}
                    <p className="text-xs text-emerald-700 font-semibold mt-1">
                      Saved to database under +91 {orderSuccess.mobileNumber}
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#fdb927]/30 text-xs text-left space-y-1">
                    <div><strong>Items:</strong> {orderSuccess.productName}</div>
                    <div><strong>Total Paid:</strong> ₹{orderSuccess.totalPrice} ({orderSuccess.paymentMethod})</div>
                    <div><strong>Address:</strong> {orderSuccess.address}</div>
                  </div>

                  <button
                    onClick={openWhatsAppConfirmation}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Confirm on WhatsApp 💬</span>
                  </button>
                </div>
              ) : cart.length > 0 ? (
                <>
                  {/* Items List */}
                  <div className="divide-y divide-gray-100">
                    {cart.map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-playfair font-bold text-xs sm:text-sm text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <div className="text-xs text-gray-500 mb-1.5">
                            ₹{item.price} each
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 text-gray-600 hover:text-black"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#1b072a]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 text-gray-600 hover:text-black"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#1b072a]">
                                ₹{item.price * item.quantity}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleCartSubmit} className="pt-3 border-t border-gray-200 space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                      Customer Delivery Details:
                    </h5>

                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name *"
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${
                          formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } focus:outline-none focus:border-[#fdb927]`}
                      />
                      {formErrors.name && (
                        <span className="text-[10px] text-red-500 block mt-0.5">{formErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-2 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-xs font-extrabold select-none flex-shrink-0">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </span>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="98765 43210 *"
                          maxLength={10}
                          className={`w-full px-3 py-2 text-xs rounded-r-xl border ${
                            formErrors.mobileNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          } focus:outline-none focus:border-[#fdb927] font-semibold text-gray-900`}
                        />
                      </div>
                      {formErrors.mobileNumber && (
                        <span className="text-[10px] text-red-500 font-semibold block mt-0.5">{formErrors.mobileNumber}</span>
                      )}
                    </div>

                    <div>
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your delivery address, city & pincode *"
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${
                          formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } focus:outline-none focus:border-[#fdb927] resize-none`}
                      />
                      {formErrors.address && (
                        <span className="text-[10px] text-red-500 block mt-0.5">{formErrors.address}</span>
                      )}
                    </div>

                    {/* Secure Online Payment Note */}
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#fdb927]/40 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#1b072a]" />
                        <span className="text-[11px] font-bold text-gray-900">Pay Online via Razorpay</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>100% Secure</span>
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-sm font-extrabold text-[#1b072a] mb-2">
                        <span>Total Amount:</span>
                        <span>₹{cartSubtotal}</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1b072a] to-[#380e56] hover:from-[#25093a] hover:to-[#4a1372] text-[#fdb927] hover:text-white flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#fdb927]" />
                            <span>Opening Payment Gateway...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 text-[#fdb927]" />
                            <span>Pay Online with Razorpay (₹{cartSubtotal})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-[#fdb927]/15 flex items-center justify-center text-2xl mb-3">
                    🪔
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-gray-900 mb-1">
                    Your Cart is Empty
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Click "Order Now" on any diya pack to order or add to cart.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#1b072a] text-[#fdb927] font-bold text-xs py-2.5 px-5 rounded-full"
                  >
                    Explore Diyas (₹120)
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
