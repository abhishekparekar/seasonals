import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTenantCollection, getTenantDoc } from '../firebase';
import { onSnapshot } from 'firebase/firestore';

const SiteConfigContext = createContext();

export const defaultReviewsList = [];

const initialHeroConfig = {
  badgeText: "✨ Pure Terracotta • Handcrafted with Gold Scalloped Rim",
  titleLine1: "Celebrate Joy.",
  titleHighlight: "Gift with Purpose.",
  subtitle: "Discover beautiful handmade festive products, thoughtfully created by talented children with physical challenges. Every purchase celebrates their creativity and helps create meaningful opportunities.",
  offerTag: "Special Pack: ₹120 for Pack of 4",
  showPricePill: true,
  primaryBtnText: "Explore Diya Collection",
  showPrimaryBtn: true,
  secondaryBtnText: "Explore Collection",
  showSecondaryBtn: false
};

const initialShopConfig = {
  badgeText: "Shop the Season",
  title: "Made for Your Celebrations",
  subtitle: "From festive décor to thoughtful gifts and return favours, discover handmade creations designed to make your celebrations a little more special"
};

const initialMissionConfig = {
  badgeText: "Our Mission",
  title: "More Than a Product. A Story of Possibility.",
  leadText: "Behind every handmade creation is a child with imagination, patience and talent.",
  believeText: "We believe physical challenges should never limit a child's opportunity to create, learn and contribute.",
  descText: "Our products are made with care by children with physical challenges, giving them a platform to express their creativity, develop skills and experience the pride of seeing their work become part of someone's celebration."
};

const initialFooterConfig = {
  brandBio: "Thoughtfully handmade festive products that celebrate creativity, purpose and the incredible talent of children with physical challenges.",
  specialPriceTag: "Special Pack: ₹120 for Pack of 4",
  supportPhone: "+91 91353 13565",
  creditText: "Designed & Developed by iCoded Automation Pvt. Ltd."
};

const initialWhatsappConfig = {
  phoneNumber: "9135313565",
  defaultMessage: "Hello Seasonals! 🪔 I have an inquiry regarding your Handcrafted Festive Clay Diya Sets. Could you please share the product details, pricing, and bulk delivery options? Thank you!"
};

export function SiteConfigProvider({ children }) {
  // Only admin-added products from Firestore
  const [products, setProducts] = useState([]);
  
  // Only admin-added reviews from Firestore (No hardcoded demo reviews)
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [heroConfig, setHeroConfig] = useState(initialHeroConfig);
  const [shopConfig, setShopConfig] = useState(initialShopConfig);
  const [missionConfig, setMissionConfig] = useState(initialMissionConfig);
  const [footerConfig, setFooterConfig] = useState(initialFooterConfig);
  const [whatsappConfig, setWhatsappConfig] = useState(initialWhatsappConfig);
  const [loading, setLoading] = useState(true);

  // 1. Real-time Firestore Products Listener under tenant 'seasonal-website'
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

  // 2. Real-time Firestore Reviews Listener under tenant 'seasonal-website'
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

  // 3. Real-time Firestore Hero Section Config Listener
  useEffect(() => {
    const heroRef = getTenantDoc("settings", "hero_config");
    const unsubscribe = onSnapshot(
      heroRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Check if stored Firestore data has legacy text "Illuminate Your Diwali", replace with new client brand text
          if (data.titleLine1 === "Illuminate Your Diwali" || !data.titleLine1) {
            setHeroConfig({
              ...initialHeroConfig,
              ...data,
              titleLine1: "Celebrate Joy.",
              titleHighlight: "Gift with Purpose.",
              subtitle: initialHeroConfig.subtitle
            });
          } else {
            setHeroConfig({ ...initialHeroConfig, ...data });
          }
        } else {
          setHeroConfig(initialHeroConfig);
        }
      },
      (err) => console.warn("Tenant Hero config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 4. Real-time Firestore Shop Section Config Listener
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

  // 5. Real-time Firestore Mission Section Config Listener
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

  // 6. Real-time Firestore Footer Section Config Listener
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

  // 7. Real-time Firestore WhatsApp Config Listener
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
        missionConfig,
        setMissionConfig,
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
