import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { saveOrderToFirestore } from '../firebase';
import { initiateRazorpayPayment } from '../services/razorpay';
import { lookupPincode } from '../utils/pincodeHelper';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck,
  Send,
  Loader2,
  CreditCard,
  CheckCircle2,
  MapPin
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
    pincode: '',
    addressLine: '',
    city: '',
    district: '',
    state: '',
    orderNotes: ''
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeSuccess, setPincodeSuccess] = useState(false);
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
      errors.addressLine = 'Please enter your street / house address';
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

  const fullCombinedAddress = `${formData.addressLine.trim()}, ${formData.city.trim()}, ${formData.district.trim() ? formData.district.trim() + ', ' : ''}${formData.state.trim()} - ${formData.pincode.trim()}`;

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
        customerAddress: fullCombinedAddress,
        productName: `${totalItemsCount} Festive Cart Items`,
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
      alert("Could not initialize Razorpay checkout. Please order via WhatsApp.");
    }
  };

  const cleanPhone = (whatsappConfig.phoneNumber || "9135313565").replace(/\D/g, "");
  const cartItemsText = cart.map((item, idx) => `${idx + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
  const whatsappCartMsg = `Hello Seasonals! 🪔 I would like to place an order for my cart:
${cartItemsText}

*Total Items:* ${totalItemsCount}
*Total Amount:* ₹${cartSubtotal}
*Customer Name:* ${formData.name || 'Not provided'}
*Phone:* ${formData.mobileNumber || 'Not provided'}
*Delivery Address:* ${fullCombinedAddress !== ',  - ' ? fullCombinedAddress : 'Will provide in chat'}`;

  const whatsappCartUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappCartMsg)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-inter">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="w-screen max-w-md bg-white shadow-2xl border-l border-[#fdb927]/30 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-[#1b072a] via-[#3d0f5e] to-[#1b072a] text-white border-b border-[#fdb927]/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#fdb927]" />
              <h2 className="font-playfair text-base sm:text-lg font-bold text-[#fdb927]">
                Shopping Cart ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {orderSuccess ? (
              /* Success View */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="font-playfair text-2xl font-bold text-gray-900">
                  Order Confirmed!
                </h3>
                <p className="text-xs text-gray-600">
                  Thank you, <strong>{orderSuccess.name}</strong>. Your payment of <strong>₹{orderSuccess.totalPrice}</strong> was received successfully.
                </p>
                <div className="p-3.5 bg-gray-50 rounded-2xl border text-xs text-left font-mono space-y-1">
                  <div><strong>Order ID:</strong> #{orderSuccess.orderId.slice(-8).toUpperCase()}</div>
                  <div><strong>Items:</strong> {orderSuccess.productName}</div>
                  <div><strong>Address:</strong> {orderSuccess.address}</div>
                </div>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 bg-[#1b072a] text-[#fdb927] font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              /* Empty Cart */
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-2xl">
                  🛒
                </div>
                <h3 className="font-playfair text-lg font-bold text-gray-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Add handcrafted terracotta diya sets from the shop to illuminate your celebrations.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-[#1b072a] text-[#fdb927] font-bold text-xs rounded-full shadow"
                >
                  Browse Shop
                </button>
              </div>
            ) : (
              /* Cart Items & Checkout Form */
              <div className="space-y-4">
                {/* Cart Items List */}
                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                          <span className="text-xs font-black text-[#b45309]">
                            ₹{item.price}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                          <span className="text-gray-400 font-normal text-[11px]">x {item.quantity}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1 rounded">
                              Save ₹{(item.originalPrice - item.price) * item.quantity}
                            </span>
                          )}
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 rounded-md bg-white border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-gray-800 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 rounded-md bg-white border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Savings Summary */}
                {(() => {
                  const totalCartSavings = cart.reduce((sum, item) => {
                    if (item.originalPrice && item.originalPrice > item.price) {
                      return sum + (item.originalPrice - item.price) * item.quantity;
                    }
                    return sum;
                  }, 0);

                  return (
                    <div className="p-3 bg-[#FFF8EB] rounded-2xl border border-[#fdb927]/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700">Subtotal ({totalItemsCount} items):</span>
                        <div className="flex items-baseline gap-1.5">
                          {totalCartSavings > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{cartSubtotal + totalCartSavings}
                            </span>
                          )}
                          <span className="text-base font-black text-[#1b072a]">₹{cartSubtotal}</span>
                        </div>
                      </div>
                      {totalCartSavings > 0 && (
                        <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-lg border border-emerald-300 flex items-center justify-between">
                          <span>🎉 Festive Discount Applied:</span>
                          <span>You Save ₹{totalCartSavings}!</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Checkout Address Form */}
                <form onSubmit={handleCartSubmit} className="space-y-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                      Delivery Address
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Fast Dispatch
                    </span>
                  </div>

                  {/* Name & Phone */}
                  <div className="space-y-2">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Full Name *"
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${
                          formErrors.name ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                        } focus:outline-none focus:border-[#280a3e]`}
                      />
                      {formErrors.name && (
                        <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-2 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-xs font-bold select-none flex-shrink-0">
                          <span>🇮🇳 +91</span>
                        </span>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          maxLength={10}
                          placeholder="10-digit Mobile Number *"
                          className={`w-full px-3 py-2 text-xs rounded-r-xl border ${
                            formErrors.mobileNumber ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                          } focus:outline-none focus:border-[#280a3e] font-semibold`}
                        />
                      </div>
                      {formErrors.mobileNumber && (
                        <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.mobileNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Pincode with Auto-Fetch */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#b45309]" />
                        <span>Pincode (Auto-fills City & State) *</span>
                      </span>
                      {pincodeLoading && (
                        <span className="text-[10px] text-[#b45309] font-bold flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Fetching...
                        </span>
                      )}
                      {pincodeSuccess && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Auto-filled
                        </span>
                      )}
                    </div>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      maxLength={6}
                      placeholder="Enter 6-digit Pincode (e.g. 400001) *"
                      className={`w-full px-3 py-2 text-xs rounded-xl border font-bold ${
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

                  {/* Street Address */}
                  <div>
                    <input
                      type="text"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleInputChange}
                      placeholder="House / Flat No., Street, Landmark *"
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        formErrors.addressLine ? 'border-red-500 bg-red-50/40' : 'border-gray-300'
                      } focus:outline-none focus:border-[#280a3e]`}
                    />
                    {formErrors.addressLine && (
                      <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.addressLine}</span>
                    )}
                  </div>

                  {/* City, District, State (Auto-filled / Editable) */}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City *"
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#280a3e] bg-gray-50`}
                    />
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="District"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-[#280a3e] bg-gray-50"
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State *"
                      className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                        formErrors.state ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#280a3e] bg-gray-50`}
                    />
                  </div>

                  {/* Checkout Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#220536] via-[#3d0f5e] to-[#220536] hover:from-[#2f084a] hover:to-[#4e1477] text-[#fdb927] hover:text-white flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer border-2 border-[#fdb927]/60 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#fdb927]" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-[#fdb927]" />
                        <span>Pay Online ₹{cartSubtotal} (Razorpay)</span>
                      </>
                    )}
                  </button>

                  {/* Or Order on WhatsApp CTA */}
                  <div className="pt-1">
                    <a
                      href={whatsappCartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <span>💬 Order on WhatsApp</span>
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
