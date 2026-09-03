import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTenantCollection, getTenantDoc } from '../firebase';
import { onSnapshot } from 'firebase/firestore';

const SiteConfigContext = createContext();

export const defaultReviewsList = [];

// Safe helper for local storage cache to eliminate page refresh flash
const getCachedConfig = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`seasonals_cached_${key}`);
    return item ? { ...fallback, ...JSON.parse(item) } : fallback;
  } catch (e) {
    return fallback;
  }
};

const setCachedConfig = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`seasonals_cached_${key}`, JSON.stringify(data));
  } catch (e) {}
};

const initialHeroConfig = {
  badgeText: "✨ Pure Terracotta • Handcrafted with Gold Scalloped Rim",
  showBadge: true,
  titleLine1: "Celebrate Joy.",
  titleHighlight: "Gift with Purpose.",
  showTitle: true,
  subtitle: "Discover beautiful handmade festive products, thoughtfully created by talented children with physical challenges. Every purchase celebrates their creativity and helps create meaningful opportunities.",
  showSubtitle: true,
  bgImage: "",
  backgroundImage: "",
  bgImages: [],
  offerTag: "Special Pack: ₹120 for Pack of 4",
  showPricePill: true
};

const initialHomeSectionsConfig = {
  showHero: true,
  showShop: true,
  showMission: true,
  showPromo: true,
  showFeatures: true,
  showReviews: true,
  showCorporateCta: true
};

const initialNavbarConfig = {
  showHome: true,
  showShop: true,
  showMission: true,
  showStory: true,
  showBulk: true,
  showContact: true,
  showCartBtn: true,
  showOrderNowBtn: true
};

const initialShopConfig = {
  badgeText: "Shop the Season",
  title: "Made for Your Celebrations",
  subtitle: "From festive décor to thoughtful gifts and return favours, discover handmade creations designed to make your celebrations a little more special",
  bgImage: "",
  bgImages: []
};

const initialPromoConfig = {
  badgeText: "✨ Festive Special Celebration",
  titleLine1: "Make Every Celebration",
  titleHighlight: "Extra Special",
  subtitle: "Celebrate traditional joy, warmth, and special occasions with your family & friends. Get authentic handcrafted products delivered directly to your doorstep.",
  btnText: "Order on WhatsApp",
  bannerImage: "",
  bgImages: []
};

export const defaultImpactStats = [
  { number: "50+", label: "Artisans Supported", desc: "Children receiving skill training & fair wages" },
  { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth" },
  { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically" },
  { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance through talent" }
];

const initialMissionConfig = {
  badgeText: "Our Mission",
  title: "More Than a Product. A Story of Possibility.",
  leadText: "Behind every handmade creation is a child with imagination, patience and talent.",
  believeText: "We believe physical challenges should never limit a child's opportunity to create, learn and contribute.",
  descText: "Our products are made with care by children with physical challenges, giving them a platform to express their creativity, develop skills and experience the pride of seeing their work become part of someone's celebration.",
  missionImage: "",
  showcaseImages: [],
  bgImage: "",
  bgImages: [],
  impactStats: defaultImpactStats
};

const initialStoryConfig = {
  badgeText: "THE INSPIRING JOURNEY",
  title: "It Started With Two Sisters, Diyas & A Lesson",
  subtitle: "Discover how a mother's challenge to her young daughters transformed into a nationwide social initiative dedicated to celebrating children with physical challenges.",
  bgImage: "",
  bgImages: []
};

const initialBulkConfig = {
  badgeText: "CORPORATE • WEDDINGS • EVENT FAVORS",
  title: "Bespoke Corporate Festive Gifting & Bulk Orders",
  subtitle: "Elevate your corporate gifting with meaningful, sustainable terracotta diyas crafted by specially-abled artisans. Beautifully packaged with your brand identity.",
  bgImage: "",
  bgImages: []
};

const initialContactConfig = {
  badgeText: "WE ARE HERE TO HELP",
  title: "Get in Touch with Team Seasonals",
  subtitle: "Have questions about order status, bulk gifting, custom colors, or shipping timelines? Reach out to our dedicated support desk.",
  bgImage: "",
  bgImages: []
};

const initialInquiryConfig = {
  badgeText: "Have Questions or Need Bulk Orders?",
  title: "Inquire & Custom Orders",
  subtitle: "Looking for corporate gifting, custom color combinations, event favors, or bulk orders? Send us an inquiry and our team will get back to you promptly."
};

const initialFooterConfig = {
  brandBio: "Thoughtfully handmade festive products that celebrate creativity, purpose and the incredible talent of children with physical challenges.",
  supportPhone: "+91 91353 13565"
};

const initialWhatsappConfig = {
  phoneNumber: "9135313565",
  defaultMessage: "Hello Seasonals! 🪔 I would like to place an order for Handcrafted Festive Diyas."
};

export function SiteConfigProvider({ children }) {
  // Firestore data states with instant local storage fallback
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [homeSectionsConfig, setHomeSectionsConfig] = useState(() => getCachedConfig('home_sections', initialHomeSectionsConfig));
  const [navbarConfig, setNavbarConfig] = useState(() => getCachedConfig('navbar', initialNavbarConfig));
  const [heroConfig, setHeroConfig] = useState(() => getCachedConfig('hero', initialHeroConfig));
  const [shopConfig, setShopConfig] = useState(() => getCachedConfig('shop', initialShopConfig));
  const [promoConfig, setPromoConfig] = useState(() => getCachedConfig('promo', initialPromoConfig));
  const [missionConfig, setMissionConfig] = useState(() => getCachedConfig('mission', initialMissionConfig));
  const [storyConfig, setStoryConfig] = useState(() => getCachedConfig('story', initialStoryConfig));
  const [bulkConfig, setBulkConfig] = useState(() => getCachedConfig('bulk', initialBulkConfig));
  const [contactConfig, setContactConfig] = useState(() => getCachedConfig('contact', initialContactConfig));
  const [inquiryConfig, setInquiryConfig] = useState(() => getCachedConfig('inquiry', initialInquiryConfig));
  const [footerConfig, setFooterConfig] = useState(() => getCachedConfig('footer', initialFooterConfig));
  const [whatsappConfig, setWhatsappConfig] = useState(() => getCachedConfig('whatsapp', initialWhatsappConfig));
  const [loading, setLoading] = useState(true);

  // 1. Products Listener
  useEffect(() => {
    const productsRef = getTenantCollection("products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const productList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const activeImages = Array.isArray(data.images)
            ? data.images
            : (data.image ? [data.image] : []);
          productList.push({
            id: doc.id,
            ...data,
            images: activeImages,
            image: activeImages[0] || data.image || ''
          });
        });
        setProducts(productList);
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

  // 2. Reviews Listener
  useEffect(() => {
    const reviewsRef = getTenantCollection("reviews");
    const unsubscribe = onSnapshot(
      reviewsRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
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

  // 2b. Home Sections Visibility Listener
  useEffect(() => {
    const homeSectionsRef = getTenantDoc("settings", "home_sections_config");
    const unsubscribe = onSnapshot(
      homeSectionsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const updated = {
            ...initialHomeSectionsConfig,
            ...data
          };
          setCachedConfig('home_sections', updated);
          setHomeSectionsConfig(updated);
        } else {
          setHomeSectionsConfig(initialHomeSectionsConfig);
        }
      },
      (err) => console.warn("Tenant Home Sections config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 2c. Navbar & Navigation Visibility Listener
  useEffect(() => {
    const navbarRef = getTenantDoc("settings", "navbar_config");
    const unsubscribe = onSnapshot(
      navbarRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const updated = {
            ...initialNavbarConfig,
            ...data
          };
          setCachedConfig('navbar', updated);
          setNavbarConfig(updated);
        } else {
          setNavbarConfig(initialNavbarConfig);
        }
      },
      (err) => console.warn("Tenant Navbar config listen note:", err)
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
          const activeBgImages = Array.isArray(data.bgImages)
            ? data.bgImages
            : (data.bgImage || data.backgroundImage ? [data.bgImage || data.backgroundImage] : []);
          const activeBg = activeBgImages[0] || "";

          const updated = {
            ...initialHeroConfig,
            ...data,
            bgImage: activeBg,
            backgroundImage: activeBg,
            bgImages: activeBgImages,
            titleLine1: data.titleLine1 || "Celebrate Joy.",
            titleHighlight: data.titleHighlight || "Gift with Purpose.",
            showBadge: data.showBadge !== undefined ? data.showBadge : true,
            showTitle: data.showTitle !== undefined ? data.showTitle : true,
            showSubtitle: data.showSubtitle !== undefined ? data.showSubtitle : true,
            showPricePill: data.showPricePill !== undefined ? data.showPricePill : true
          };
          setCachedConfig('hero', updated);
          setHeroConfig(updated);
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
          const data = docSnap.data();
          const activeBgImages = Array.isArray(data.bgImages)
            ? data.bgImages
            : (data.bgImage ? [data.bgImage] : []);
          const updated = { 
            ...initialShopConfig, 
            ...data, 
            bgImages: activeBgImages,
            bgImage: activeBgImages[0] || ''
          };
          setCachedConfig('shop', updated);
          setShopConfig(updated);
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
          const data = docSnap.data();
          const activeBgImages = Array.isArray(data.bgImages)
            ? data.bgImages
            : (data.bannerImage ? [data.bannerImage] : []);
          const updated = { 
            ...initialPromoConfig, 
            ...data, 
            bgImages: activeBgImages,
            bannerImage: activeBgImages[0] || ''
          };
          setCachedConfig('promo', updated);
          setPromoConfig(updated);
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
          const data = docSnap.data();
          const activeBgImages = Array.isArray(data.bgImages)
            ? data.bgImages
            : (data.bgImage ? [data.bgImage] : []);
          const activeStats = Array.isArray(data.impactStats) && data.impactStats.length > 0
            ? data.impactStats
            : defaultImpactStats;
          const activeShowcaseImages = Array.isArray(data.showcaseImages)
            ? data.showcaseImages
            : (data.missionImage ? [data.missionImage] : []);
          const updated = {
            ...initialMissionConfig,
            ...data,
            bgImages: activeBgImages,
            bgImage: activeBgImages[0] || '',
            impactStats: activeStats,
            showcaseImages: activeShowcaseImages,
            missionImage: activeShowcaseImages[0] || ''
          };
          setCachedConfig('mission', updated);
          setMissionConfig(updated);
        } else {
          setMissionConfig(initialMissionConfig);
        }
      },
      (err) => console.warn("Tenant Mission config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 7. Story Section Listener
  useEffect(() => {
    const storyRef = getTenantDoc("settings", "story_config");
    const unsubscribe = onSnapshot(
      storyRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const activeBgImages = Array.isArray(data.bgImages)
            ? data.bgImages
            : (data.bgImage ? [data.bgImage] : []);
          const updated = { 
            ...initialStoryConfig, 
            ...data, 
            bgImages: activeBgImages,
            bgImage: activeBgImages[0] || ''
          };
          setCachedConfig('story', updated);
          setStoryConfig(updated);
        } else {
          setStoryConfig(initialStoryConfig);
        }
      },
      (err) => console.warn("Tenant Story config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 8. Bulk Gifting Section Listener
  useEffect(() => {
    const bulkRef = getTenantDoc("settings", "bulk_config");
    const unsubscribe = onSnapshot(
      bulkRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const activeBgImages = Array.isArray(data.bgImages)
            ? data.bgImages
            : (data.bgImage ? [data.bgImage] : []);
          const updated = { 
            ...initialBulkConfig, 
            ...data, 
            bgImages: activeBgImages,
            bgImage: activeBgImages[0] || ''
          };
          setCachedConfig('bulk', updated);
          setBulkConfig(updated);
        } else {
          setBulkConfig(initialBulkConfig);
        }
      },
      (err) => console.warn("Tenant Bulk config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 9. Contact Section Listener
  useEffect(() => {
    const contactRef = getTenantDoc("settings", "contact_config");
    const unsubscribe = onSnapshot(
      contactRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const activeBgImages = Array.isArray(data.bgImages)
            ? data.bgImages
            : (data.bgImage ? [data.bgImage] : []);
          const updated = { 
            ...initialContactConfig, 
            ...data, 
            bgImages: activeBgImages,
            bgImage: activeBgImages[0] || ''
          };
          setCachedConfig('contact', updated);
          setContactConfig(updated);
        } else {
          setContactConfig(initialContactConfig);
        }
      },
      (err) => console.warn("Tenant Contact config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 10. Inquiry Section Listener
  useEffect(() => {
    const inquiryRef = getTenantDoc("settings", "inquiry_config");
    const unsubscribe = onSnapshot(
      inquiryRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const updated = { ...initialInquiryConfig, ...docSnap.data() };
          setCachedConfig('inquiry', updated);
          setInquiryConfig(updated);
        } else {
          setInquiryConfig(initialInquiryConfig);
        }
      },
      (err) => console.warn("Tenant Inquiry config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 11. Footer Section Listener
  useEffect(() => {
    const footerRef = getTenantDoc("settings", "footer_config");
    const unsubscribe = onSnapshot(
      footerRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const updated = { ...initialFooterConfig, ...docSnap.data() };
          setCachedConfig('footer', updated);
          setFooterConfig(updated);
        } else {
          setFooterConfig(initialFooterConfig);
        }
      },
      (err) => console.warn("Tenant Footer config listen note:", err)
    );
    return () => unsubscribe();
  }, []);

  // 12. WhatsApp Config Listener
  useEffect(() => {
    const waRef = getTenantDoc("settings", "whatsapp_config");
    const unsubscribe = onSnapshot(
      waRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const updated = { ...initialWhatsappConfig, ...docSnap.data() };
          setCachedConfig('whatsapp', updated);
          setWhatsappConfig(updated);
        } else {
          setWhatsappConfig(initialWhatsappConfig);
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
        reviews,
        reviewsLoading,
        homeSectionsConfig,
        navbarConfig,
        heroConfig,
        shopConfig,
        promoConfig,
        missionConfig,
        storyConfig,
        bulkConfig,
        contactConfig,
        inquiryConfig,
        footerConfig,
        whatsappConfig,
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
