import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTenantCollection, getTenantDoc } from '../firebase';
import { onSnapshot } from 'firebase/firestore';

const SiteConfigContext = createContext();

export const defaultReviewsList = [];

const cachedHeroBg = typeof window !== 'undefined' ? (localStorage.getItem('seasonals_cached_herobg') || "") : "";

const initialHeroConfig = {
  badgeText: "✨ Pure Terracotta • Handcrafted with Gold Scalloped Rim",
  titleLine1: "Celebrate Joy.",
  titleHighlight: "Gift with Purpose.",
  subtitle: "Discover beautiful handmade festive products, thoughtfully created by talented children with physical challenges. Every purchase celebrates their creativity and helps create meaningful opportunities.",
  bgImage: cachedHeroBg,
  backgroundImage: cachedHeroBg,
  offerTag: "Special Pack: ₹120 for Pack of 4",
  showPricePill: true,
  primaryBtnText: "Explore Collection",
  showPrimaryBtn: true,
  secondaryBtnText: "Our Mission",
  showSecondaryBtn: false
};

const initialShopConfig = {
  badgeText: "Shop the Season",
  title: "Made for Your Celebrations",
  subtitle: "From festive décor to thoughtful gifts and return favours, discover handmade creations designed to make your celebrations a little more special"
};

const initialPromoConfig = {
  badgeText: "✨ Festive Special Celebration",
  titleLine1: "Make Every Celebration",
  titleHighlight: "Extra Special",
  subtitle: "Celebrate traditional joy, warmth, and special occasions with your family & friends. Get authentic handcrafted products delivered directly to your doorstep.",
  btnText: "Order Now",
  bannerImage: "/images/promo1.jpg"
};

const initialMissionConfig = {
  badgeText: "Our Mission",
  title: "More Than a Product. A Story of Possibility.",
  leadText: "Behind every handmade creation is a child with imagination, patience and talent.",
  believeText: "We believe physical challenges should never limit a child's opportunity to create, learn and contribute.",
  descText: "Our products are made with care by children with physical challenges, giving them a platform to express their creativity, develop skills and experience the pride of seeing their work become part of someone's celebration.",
  missionImage: "/images/about1.png"
};

const initialInquiryConfig = {
  badgeText: "Have Questions or Need Bulk Orders?",
  title: "Inquire & Custom Orders",
  subtitle: "Looking for corporate gifting, custom color combinations, event favors, or bulk orders? Send us an inquiry and our team will get back to you promptly."
};

const initialFooterConfig = {
  brandBio: "Thoughtfully handmade festive products that celebrate creativity, purpose and the incredible talent of children with physical challenges.",
  specialPriceTag: "Special Pack: ₹120 for Pack of 4",
  supportPhone: "+91 91353 13565"
};

const initialWhatsappConfig = {
  phoneNumber: "9135313565",
  defaultMessage: "Hello Seasonals! 🪔 I have an inquiry regarding your Handcrafted Festive collections & bulk gifting. Could you please share the details? Thank you!"
};

export function SiteConfigProvider({ children }) {
  // Firestore data states
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [heroConfig, setHeroConfig] = useState(initialHeroConfig);
  const [shopConfig, setShopConfig] = useState(initialShopConfig);
  const [promoConfig, setPromoConfig] = useState(initialPromoConfig);
  const [missionConfig, setMissionConfig] = useState(initialMissionConfig);
  const [inquiryConfig, setInquiryConfig] = useState(initialInquiryConfig);
  const [footerConfig, setFooterConfig] = useState(initialFooterConfig);
  const [whatsappConfig, setWhatsappConfig] = useState(initialWhatsappConfig);
  const [loading, setLoading] = useState(true);

  // 1. Real-time Firestore Products Listener
  useEffect(() => {
    const productsRef = getTenantCollection("products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(list);
        setLoading(false);
      },
      (error) => {
        console.warn("Tenant products listener note:", error);
        setProducts([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Reviews Listener
  useEffect(() => {
    const reviewsRef = getTenantCollection("reviews");
    const unsubscribe = onSnapshot(
      reviewsRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(list);
        setReviewsLoading(false);
      },
      (error) => {
        console.warn("Tenant reviews listener note:", error);
        setReviews([]);
        setReviewsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Hero Section Listener
  useEffect(() => {
    const heroRef = getTenantDoc("settings", "hero_config");
    const unsubscribe = onSnapshot(
      heroRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const activeBg = data.bgImage || data.backgroundImage || "";
          if (activeBg && typeof window !== 'undefined') {
            try { localStorage.setItem('seasonals_cached_herobg', activeBg); } catch (e) {}
          }
          if (data.titleLine1 === "Illuminate Your Diwali" || !data.titleLine1) {
            setHeroConfig({
              ...initialHeroConfig,
              ...data,
              bgImage: activeBg,
              backgroundImage: activeBg,
              titleLine1: "Celebrate Joy.",
              titleHighlight: "Gift with Purpose."
            });
          } else {
            setHeroConfig({ 
              ...initialHeroConfig, 
              ...data, 
              bgImage: activeBg, 
              backgroundImage: activeBg 
            });
          }
        } else {
          setHeroConfig(initialHeroConfig);
        }
      },
      (err) => console.warn("Tenant Hero config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 4. Shop Section Listener
  useEffect(() => {
    const shopRef = getTenantDoc("settings", "shop_config");
    const unsubscribe = onSnapshot(
      shopRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setShopConfig({ ...initialShopConfig, ...docSnap.data() });
        } else {
          setShopConfig(initialShopConfig);
        }
      },
      (err) => console.warn("Tenant Shop config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 5. Promo Banner Section Listener
  useEffect(() => {
    const promoRef = getTenantDoc("settings", "promo_config");
    const unsubscribe = onSnapshot(
      promoRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setPromoConfig({ ...initialPromoConfig, ...docSnap.data() });
        } else {
          setPromoConfig(initialPromoConfig);
        }
      },
      (err) => console.warn("Tenant Promo config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 6. Mission Section Listener
  useEffect(() => {
    const missionRef = getTenantDoc("settings", "mission_config");
    const unsubscribe = onSnapshot(
      missionRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setMissionConfig({ ...initialMissionConfig, ...docSnap.data() });
        } else {
          setMissionConfig(initialMissionConfig);
        }
      },
      (err) => console.warn("Tenant Mission config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 7. Inquiry Section Listener
  useEffect(() => {
    const inquiryRef = getTenantDoc("settings", "inquiry_config");
    const unsubscribe = onSnapshot(
      inquiryRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setInquiryConfig({ ...initialInquiryConfig, ...docSnap.data() });
        } else {
          setInquiryConfig(initialInquiryConfig);
        }
      },
      (err) => console.warn("Tenant Inquiry config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 8. Footer Section Listener
  useEffect(() => {
    const footerRef = getTenantDoc("settings", "footer_config");
    const unsubscribe = onSnapshot(
      footerRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setFooterConfig((prev) => ({ ...prev, ...docSnap.data() }));
        }
      },
      (err) => console.warn("Tenant Footer config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 9. WhatsApp Listener
  useEffect(() => {
    const waRef = getTenantDoc("settings", "whatsapp_config");
    const unsubscribe = onSnapshot(
      waRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setWhatsappConfig((prev) => ({ ...prev, ...docSnap.data() }));
        }
      },
      (err) => console.warn("Tenant WhatsApp config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{
        products,
        setProducts,
        reviews,
        setReviews,
        reviewsLoading,
        heroConfig,
        setHeroConfig,
        shopConfig,
        setShopConfig,
        promoConfig,
        setPromoConfig,
        missionConfig,
        setMissionConfig,
        inquiryConfig,
        setInquiryConfig,
        footerConfig,
        setFooterConfig,
        whatsappConfig,
        setWhatsappConfig,
        loading
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}
