/**
 * Razorpay Payment Gateway Service
 * Key ID: rzp_live_TIuAENTLzeEAzn
 */

export const RAZORPAY_KEY_ID = "rzp_live_TIuAENTLzeEAzn";

/**
 * Load Razorpay SDK script dynamically if needed
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay Checkout Modal
 */
export async function initiateRazorpayPayment({
  amount, // in Rupees
  customerName,
  customerPhone,
  customerAddress,
  productName = "Handcrafted Diwali Diya Set",
  orderId = "",
  onSuccess,
  onFailure,
  onDismiss
}) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    alert("Unable to load Razorpay payment gateway. Please check your internet connection.");
    if (onFailure) onFailure(new Error("Razorpay SDK failed to load"));
    return;
  }

  // Amount in Paise (e.g. ₹120 = 12000 paise)
  const amountInPaise = Math.round(Number(amount) * 100);

  const cleanPhone = (customerPhone || "").replace(/\D/g, "");

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise,
    currency: "INR",
    name: "Seasonals",
    description: `Diwali Celebration Order: ${productName}`,
    image: "/images/bg1.jpg",
    prefill: {
      name: customerName || "",
      contact: cleanPhone ? (cleanPhone.length === 10 ? `+91${cleanPhone}` : cleanPhone) : "",
    },
    notes: {
      address: customerAddress || "",
      order_id: orderId || `ORD_${Date.now()}`,
      store: "Seasonals Handcrafted Terracotta Diyas"
    },
    theme: {
      color: "#1b072a", // Royal Festive Plum
      backdrop_color: "rgba(15, 4, 23, 0.85)"
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss();
      }
    },
    handler: function (response) {
      // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          razorpayResponse: response
        });
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.error("Payment Failed:", response.error);
      if (onFailure) {
        onFailure(response.error);
      }
    });
    rzp.open();
  } catch (err) {
    console.error("Error opening Razorpay checkout:", err);
    if (onFailure) onFailure(err);
  }
}
