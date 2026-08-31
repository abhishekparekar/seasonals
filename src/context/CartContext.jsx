import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const WHATSAPP_PHONE_NUMBER = "919135313565"; // Seasonals Official WhatsApp Number

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('seasonals_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('seasonals_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('seasonals_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('seasonals_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`✨ Added "${product.name}" to order!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`❤️ Saved "${product.name}" to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getWhatsAppOrderUrl = (customItems = null) => {
    const itemsToOrder = customItems || cart;
    if (itemsToOrder.length === 0) {
      return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent("Hello Seasonals! 🪔 I would like to order the Handcrafted Floral Diya Set (Pack of 4) for ₹120. Please share payment & delivery details.")}`;
    }

    let itemsListText = itemsToOrder
      .map(
        (item, index) =>
          `${index + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
      )
      .join('\n');

    const total = itemsToOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const message = `Hello Seasonals! 🪔\n\nI would like to place an order from your website:\n\n*Order Details:*\n${itemsListText}\n\n*Total Amount:* ₹${total}\n\nPlease share payment details and estimated delivery time. Thank you!`;

    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const getSingleProductWhatsAppUrl = (product, quantity = 1) => {
    const total = product.price * quantity;
    const message = `Hello Seasonals! 🪔\n\nI would like to order:\n*Product:* ${product.name}\n*Quantity:* ${quantity} pack(s)\n*Price:* ₹${total} (Price ₹120 for pack of 4)\n\nPlease confirm availability and share payment/delivery details.`;
    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        totalItemsCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        toastMessage,
        getWhatsAppOrderUrl,
        getSingleProductWhatsAppUrl,
        phoneNumber: WHATSAPP_PHONE_NUMBER,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
