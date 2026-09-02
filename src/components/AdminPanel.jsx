import React, { useState, useEffect } from 'react';
import { 
  db, 
  getTenantCollection,
  updateOrderStatus, 
  deleteOrderFromFirestore,
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  saveSiteSettings,
  updateInquiryStatus,
  deleteInquiryFromFirestore,
  addReviewToFirestore,
  updateReviewInFirestore,
  deleteReviewFromFirestore,
  deleteImageFileFromStorage
} from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { useSiteConfig } from '../context/SiteConfigContext';
import { products as defaultProducts } from '../data/products';
import MultiImageManager from './MultiImageManager';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  Search, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Package, 
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  PlusCircle,
  MessageSquare,
  Sparkles,
  Sliders,
  FileText,
  Save,
  Edit2,
  Check,
  X,
  Menu,
  CreditCard,
  Layers,
  HelpCircle,
  Upload,
  Image as ImageIcon,
  Link2,
  Star,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel({ onBackToHome }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('seasonals_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab & Mobile Sidebar State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Site Config Context
  const { 
    products: contextProducts, 
    heroConfig, 
    shopConfig,
    promoConfig,
    missionConfig,
    storyConfig,
    bulkConfig,
    contactConfig,
    inquiryConfig,
    footerConfig, 
    whatsappConfig 
  } = useSiteConfig();

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Reviews State in Admin
  const [reviewsList, setReviewsList] = useState([]);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    city: '',
    rating: 5,
    product: 'Handcrafted Floral Diya Set (Pack of 4)',
    review: '',
    tag: 'Verified Buyer',
    avatarBg: 'bg-amber-100 text-amber-800'
  });

  // Products State in Admin
  const [productsList, setProductsList] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [isCompressingImg, setIsCompressingImg] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 120,
    originalPrice: 160,
    pieces: 4,
    category: 'diyas',
    categoryLabel: 'Best Seller',
    badge: '🔥 Best Seller',
    image: '/images/diya-pack-of-4.jpg',
    images: ['/images/diya-pack-of-4.jpg'],
    description: '100% handmade terracotta clay with metallic golden rim & embossed floral rosette.',
    inStock: true
  });

  // Hero Section Form State
  const [heroForm, setHeroForm] = useState({ ...heroConfig });
  const [isSavingHero, setIsSavingHero] = useState(false);

  // Shop Page Form State
  const [shopForm, setShopForm] = useState({ ...shopConfig });
  const [isSavingShop, setIsSavingShop] = useState(false);

  // Promo Banner Form State
  const [promoForm, setPromoForm] = useState({ ...promoConfig });
  const [isSavingPromo, setIsSavingPromo] = useState(false);

  // Mission Section Form State
  const [missionForm, setMissionForm] = useState({ ...missionConfig });
  const [isSavingMission, setIsSavingMission] = useState(false);

  // Story Section Form State
  const [storyForm, setStoryForm] = useState({ ...storyConfig });
  const [isSavingStory, setIsSavingStory] = useState(false);

  // Bulk Gifting Form State
  const [bulkForm, setBulkForm] = useState({ ...bulkConfig });
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  // Contact Us Form State
  const [contactForm, setContactForm] = useState({ ...contactConfig });
  const [isSavingContact, setIsSavingContact] = useState(false);

  // Inquiry Section Form State
  const [inquiryForm, setInquiryForm] = useState({ ...inquiryConfig });
  const [isSavingInquiry, setIsSavingInquiry] = useState(false);

  // Footer Section Form State
  const [footerForm, setFooterForm] = useState({ ...footerConfig });
  const [isSavingFooter, setIsSavingFooter] = useState(false);

  // WhatsApp Form State
  const [waForm, setWaForm] = useState({ ...whatsappConfig });
  const [isSavingWa, setIsSavingWa] = useState(false);

  // Sync contexts when loaded
  useEffect(() => {
    setHeroForm({ ...heroConfig });
  }, [heroConfig]);

  useEffect(() => {
    setShopForm({ ...shopConfig });
  }, [shopConfig]);

  useEffect(() => {
    setPromoForm({ ...promoConfig });
  }, [promoConfig]);

  useEffect(() => {
    setMissionForm({ ...missionConfig });
  }, [missionConfig]);

  useEffect(() => {
    setStoryForm({ ...storyConfig });
  }, [storyConfig]);

  useEffect(() => {
    setBulkForm({ ...bulkConfig });
  }, [bulkConfig]);

  useEffect(() => {
    setContactForm({ ...contactConfig });
  }, [contactConfig]);

  useEffect(() => {
    setInquiryForm({ ...inquiryConfig });
  }, [inquiryConfig]);

  useEffect(() => {
    setFooterForm({ ...footerConfig });
  }, [footerConfig]);

  useEffect(() => {
    setWaForm({ ...whatsappConfig });
  }, [whatsappConfig]);

  // Handle Admin Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      if (emailInput.trim().toLowerCase() === 'seasonalsindia@gmail.com' && passwordInput === 'Seasonals1234#') {
        sessionStorage.setItem('seasonals_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid email or password. Please check your credentials.');
      }
      setIsLoggingIn(false);
    }, 300);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('seasonals_admin_auth');
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
  };

  // Real-time Firestore Orders Listener under tenant 'seasonal-website'
  useEffect(() => {
    if (!isAuthenticated) return;

    setOrdersLoading(true);
    const ordersRef = getTenantCollection("orders");
    const q = query(ordersRef, orderBy("createdAtMillis", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(list);
        setOrdersLoading(false);
      },
      (error) => {
        console.warn("Firestore tenant orders listen error:", error);
        setOrdersLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Real-time Firestore Products Listener under tenant 'seasonal-website'
  useEffect(() => {
    if (!isAuthenticated) return;

    const productsRef = getTenantCollection("products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductsList(list);
      },
      (error) => {
        console.warn("Tenant products listen error:", error);
        setProductsList([]);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Real-time Firestore Inquiries Listener under tenant 'seasonal-website'
  useEffect(() => {
    if (!isAuthenticated) return;

    setInquiriesLoading(true);
    const inqRef = getTenantCollection("inquiries");
    const q = query(inqRef, orderBy("createdAtMillis", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setInquiries(list);
        setInquiriesLoading(false);
      },
      (error) => {
        console.warn("Inquiries listen note:", error);
        setInquiriesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Real-time Firestore Reviews Listener under tenant 'seasonal-website'
  useEffect(() => {
    if (!isAuthenticated) return;

    const revRef = getTenantCollection("reviews");
    const q = query(revRef, orderBy("createdAtMillis", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviewsList(list);
      },
      (error) => {
        console.warn("Tenant reviews listen note:", error);
        setReviewsList([]);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Show Toast helper
  const showToast = (text, type = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Review Actions
  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.review.trim()) {
      alert("Please enter customer name and review text");
      return;
    }

    try {
      if (editingReview) {
        await updateReviewInFirestore(editingReview.id, reviewForm);
        showToast("Review updated successfully!");
        setEditingReview(null);
      } else {
        await addReviewToFirestore(reviewForm);
        showToast("New review published live on website!");
        setIsAddingReview(false);
      }

      setReviewForm({
        name: '',
        city: '',
        rating: 5,
        product: 'Handcrafted Floral Diya Set (Pack of 4)',
        review: '',
        tag: 'Verified Buyer',
        avatarBg: 'bg-amber-100 text-amber-800'
      });
    } catch (err) {
      console.error(err);
      showToast("Error saving review.", "error");
    }
  };

  const handleEditReviewClick = (rev) => {
    setEditingReview(rev);
    setReviewForm({
      name: rev.name || '',
      city: rev.city || '',
      rating: Number(rev.rating) || 5,
      product: rev.product || 'Handcrafted Floral Diya Set (Pack of 4)',
      review: rev.review || '',
      tag: rev.tag || 'Verified Buyer',
      avatarBg: rev.avatarBg || 'bg-amber-100 text-amber-800'
    });
    setIsAddingReview(true);
  };

  const handleDeleteReview = async (rev) => {
    if (!window.confirm(`Delete review from "${rev.name}"?`)) return;
    try {
      await deleteReviewFromFirestore(rev.id);
      showToast("Review deleted from store.");
    } catch (err) {
      console.error(err);
      showToast("Error deleting review.", "error");
    }
  };

  // Orders Actions
  const handleStatusChange = async (order, newStatus) => {
    try {
      setUpdatingId(order.id);
      await updateOrderStatus(order.id, newStatus, order.cleanMobile);
      showToast(`Order marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to update order status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`Are you sure you want to delete order from ${order.name}?`)) return;
    try {
      setUpdatingId(order.id);
      await deleteOrderFromFirestore(order.id, order.cleanMobile);
      showToast('Order deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete order.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const openCustomerWhatsApp = (order) => {
    const phone = order.cleanMobile || (order.mobileNumber || "").replace(/\D/g, "");
    let text = `Hello ${order.name || 'Customer'}! 🪔\n\nRegarding your Seasonals Diwali order (ID: #${order.id.slice(-6).toUpperCase()}):\n*Status:* ${order.status?.toUpperCase()}\n*Total Amount:* ₹${order.totalPrice || order.totalAmount}\n\n`;
    if (order.status === 'confirmed') {
      text += `Your order has been *CONFIRMED* and is being packed for dispatch! We will share tracking details shortly.`;
    } else if (order.status === 'rejected') {
      text += `We regret to inform you that your order could not be fulfilled at this moment. Please reply for support.`;
    } else {
      text += `We have received your order request. Please confirm your delivery address: ${order.address}`;
    }
    const url = `https://wa.me/${phone.startsWith('91') ? phone : '91' + phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Handle Local Image File Upload & Compression
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WEBP)");
      return;
    }

    setIsCompressingImg(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // High quality client-side canvas compression for crisp 800px display
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setProductForm((prev) => ({ ...prev, image: dataUrl }));
        setIsCompressingImg(false);
        showToast('Image uploaded and optimized successfully!');
      };
      img.onerror = () => {
        setIsCompressingImg(false);
        showToast('Failed to load image file.', 'error');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Product Form Handler
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      alert("Please enter product name");
      return;
    }

    const sellingPrice = Number(productForm.price) || 0;
    const regularMrp = productForm.originalPrice !== '' && productForm.originalPrice !== null && productForm.originalPrice !== undefined
      ? Number(productForm.originalPrice)
      : 0;

    const payload = {
      ...productForm,
      price: sellingPrice,
      originalPrice: regularMrp > 0 ? regularMrp : null
    };

    try {
      if (editingProduct) {
        // Update Product
        await updateProductInFirestore(editingProduct.id, payload);
        showToast("Product updated successfully!");
        setEditingProduct(null);
      } else {
        // Add New Product
        await addProductToFirestore(payload);
        showToast("New product added to store catalog!");
        setIsAddingProduct(false);
      }
      // Reset form
      setProductForm({
        name: '',
        price: 120,
        originalPrice: 160,
        pieces: 4,
        category: 'diyas',
        categoryLabel: 'Best Seller',
        badge: '🔥 Best Seller',
        image: '/images/diya-pack-of-4.jpg',
        images: ['/images/diya-pack-of-4.jpg'],
        description: '100% handmade terracotta clay with metallic golden rim & embossed floral rosette.',
        inStock: true
      });
    } catch (err) {
      console.error(err);
      showToast("Error saving product.", "error");
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    const prodImages = Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images
      : (prod.image ? [prod.image] : ['/images/diya-pack-of-4.jpg']);

    setProductForm({
      name: prod.name || '',
      price: prod.price !== undefined ? prod.price : 120,
      originalPrice: prod.originalPrice !== undefined && prod.originalPrice !== null ? prod.originalPrice : '',
      pieces: prod.pieces || 4,
      category: prod.category || 'diyas',
      categoryLabel: prod.categoryLabel || 'Best Seller',
      badge: prod.badge || '🔥 Best Seller',
      image: prod.image || prodImages[0] || '/images/diya-pack-of-4.jpg',
      images: prodImages,
      description: prod.description || '',
      inStock: prod.inStock !== false
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Delete product "${prod.name}"?`)) return;
    try {
      await deleteProductFromFirestore(prod.id);
      showToast("Product deleted from catalog.");
    } catch (err) {
      console.error(err);
      showToast("Error deleting product.", "error");
    }
  };

  const handleToggleProductStock = async (prod) => {
    try {
      await updateProductInFirestore(prod.id, { inStock: !prod.inStock });
      showToast(`Product marked as ${!prod.inStock ? 'IN STOCK' : 'OUT OF STOCK'}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Seed default products to Firestore
  const handleSeedProducts = async () => {
    if (!window.confirm("Seed all 12 initial handcrafted Diya products into Firestore?")) return;
    try {
      for (const p of defaultProducts) {
        await addProductToFirestore(p);
      }
      showToast("All default products seeded to Firestore successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error seeding products.", "error");
    }
  };

  // Save Dynamic Hero Settings
  const handleSaveHeroSettings = async (e) => {
    e.preventDefault();
    setIsSavingHero(true);
    try {
      const bgToSave = (heroForm.bgImages && heroForm.bgImages[0]) || heroForm.bgImage || heroForm.backgroundImage || "";
      const updatedHero = {
        ...heroForm,
        bgImage: bgToSave,
        backgroundImage: bgToSave
      };
      await saveSiteSettings("hero_config", updatedHero);
      showToast("Hero Section background image(s) & settings updated live!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Hero settings.", "error");
    } finally {
      setIsSavingHero(false);
    }
  };

  // Save Dynamic Shop Settings
  const handleSaveShopSettings = async (e) => {
    e.preventDefault();
    setIsSavingShop(true);
    try {
      await saveSiteSettings("shop_config", shopForm);
      showToast("Shop Collection page header & background image(s) updated live!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Shop settings.", "error");
    } finally {
      setIsSavingShop(false);
    }
  };

  // Save Dynamic Story Settings
  const handleSaveStorySettings = async (e) => {
    e.preventDefault();
    setIsSavingStory(true);
    try {
      await saveSiteSettings("story_config", storyForm);
      showToast("Our Story page header & background image(s) updated live!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Story settings.", "error");
    } finally {
      setIsSavingStory(false);
    }
  };

  // Save Dynamic Bulk Gifting Settings
  const handleSaveBulkSettings = async (e) => {
    e.preventDefault();
    setIsSavingBulk(true);
    try {
      await saveSiteSettings("bulk_config", bulkForm);
      showToast("Bulk & Corporate Gifting page header & background image(s) updated live!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Bulk Gifting settings.", "error");
    } finally {
      setIsSavingBulk(false);
    }
  };

  // Save Dynamic Contact Settings
  const handleSaveContactSettings = async (e) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      await saveSiteSettings("contact_config", contactForm);
      showToast("Contact Us page header & background image(s) updated live!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Contact settings.", "error");
    } finally {
      setIsSavingContact(false);
    }
  };

  // Save Dynamic Promo Settings
  const handleSavePromoSettings = async (e) => {
    e.preventDefault();
    setIsSavingPromo(true);
    try {
      await saveSiteSettings("promo_config", promoForm);
      showToast("Promo Banner settings updated live!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Promo Banner settings.", "error");
    } finally {
      setIsSavingPromo(false);
    }
  };

  // Save Dynamic Mission Settings
  const handleSaveMissionSettings = async (e) => {
    e.preventDefault();
    setIsSavingMission(true);
    try {
      const showcaseToSave = Array.isArray(missionForm.showcaseImages) && missionForm.showcaseImages.length > 0
        ? missionForm.showcaseImages
        : (missionForm.missionImage ? [missionForm.missionImage] : []);
      const updatedMission = {
        ...missionForm,
        showcaseImages: showcaseToSave,
        missionImage: showcaseToSave[0] || missionForm.missionImage || ""
      };
      await saveSiteSettings("mission_config", updatedMission);
      showToast("Our Mission page showcase photos & settings updated live!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Mission settings.", "error");
    } finally {
      setIsSavingMission(false);
    }
  };

  // Save Dynamic Inquiry Settings
  const handleSaveInquirySettings = async (e) => {
    e.preventDefault();
    setIsSavingInquiry(true);
    try {
      await saveSiteSettings("inquiry_config", inquiryForm);
      showToast("Inquiry Form settings updated live!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Inquiry settings.", "error");
    } finally {
      setIsSavingInquiry(false);
    }
  };

  // Save Dynamic Footer Settings
  const handleSaveFooterSettings = async (e) => {
    e.preventDefault();
    setIsSavingFooter(true);
    try {
      const cleanPhone = (footerForm.supportPhone || "9135313565").replace(/\D/g, "");
      const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone.slice(0,5)} ${cleanPhone.slice(5)}` : (footerForm.supportPhone || "+91 91353 13565");
      
      const updatedFooter = {
        ...footerForm,
        supportPhone: formattedPhone
      };
      await saveSiteSettings("footer_config", updatedFooter);
      
      // Also update whatsapp_config phone number if 10 digits
      if (cleanPhone.length === 10) {
        await saveSiteSettings("whatsapp_config", {
          ...waForm,
          phoneNumber: cleanPhone
        });
      }
      showToast("Footer & WhatsApp Support Phone updated live across the entire website!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save Footer settings.", "error");
    } finally {
      setIsSavingFooter(false);
    }
  };

  // Save Dynamic WhatsApp Settings
  const handleSaveWaSettings = async (e) => {
    e.preventDefault();
    setIsSavingWa(true);
    try {
      const cleanPhone = (waForm.phoneNumber || "9135313565").replace(/\D/g, "");
      const updatedWa = {
        ...waForm,
        phoneNumber: cleanPhone
      };
      await saveSiteSettings("whatsapp_config", updatedWa);
      
      // Also synchronize supportPhone in footer config
      const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone.slice(0,5)} ${cleanPhone.slice(5)}` : `+91 ${cleanPhone}`;
      await saveSiteSettings("footer_config", {
        ...footerForm,
        supportPhone: formattedPhone
      });
      showToast("Official Phone Number & WhatsApp updated live across the entire website!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save WhatsApp settings.", "error");
    } finally {
      setIsSavingWa(false);
    }
  };

  // KPI Metrics Calculation
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'pending' || !o.status).length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const totalRevenue = orders
    .filter(o => o.status === 'confirmed')
    .reduce((sum, o) => sum + Number(o.totalPrice || o.totalAmount || 0), 0);
  const paidOrdersCount = orders.filter(o => o.paymentStatus === 'PAID').length;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const queryLower = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !queryLower ||
      (order.name && order.name.toLowerCase().includes(queryLower)) ||
      (order.mobileNumber && order.mobileNumber.includes(queryLower)) ||
      (order.address && order.address.toLowerCase().includes(queryLower)) ||
      (order.productName && order.productName.toLowerCase().includes(queryLower)) ||
      (order.id && order.id.toLowerCase().includes(queryLower));

    return matchesStatus && matchesSearch;
  });

  // If not logged in, show clean Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0417] text-white flex items-center justify-center p-4 relative font-inter overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#fdb927]/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10"
        >
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <img
              src="/images/logo3.png"
              alt="Seasonals Logo"
              className="h-10 w-auto mx-auto max-w-[180px] object-contain drop-shadow-[0_2px_12px_rgba(253,185,39,0.4)] mb-3"
            />
            <h2 className="font-playfair text-2xl font-bold text-white">
              Admin CMS Portal
            </h2>
            <p className="text-xs text-white/60 mt-1">
              Sign in with credentials to manage products, orders & content
            </p>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/80 block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#fdb927] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="seasonalsindia@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#fdb927]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/80 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#fdb927] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-9 pr-10 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#fdb927]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoggingIn ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          {/* Back Button */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-white/60 hover:text-[#fdb927] transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store Website</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Grouped Sidebar Menu Navigation Items for Superior UX
  const navGroups = [
    {
      title: "Store Management",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'products', label: 'Manage Products', icon: Layers, badge: `${productsList.length}` },
        { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: `${pendingCount > 0 ? `${pendingCount} new` : orders.length}` },
        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, badge: `${inquiries.length}` },
        { id: 'reviews', label: 'Customer Reviews', icon: Star, badge: `${reviewsList.length}` },
      ]
    },
    {
      title: "Page CMS Management",
      items: [
        { id: 'hero', label: 'Hero Banner CMS', icon: Sparkles, badge: null },
        { id: 'shop', label: 'Shop Page CMS', icon: ShoppingBag, badge: null },
        { id: 'mission', label: 'Our Mission CMS', icon: Heart, badge: null },
        { id: 'story', label: 'Our Story CMS', icon: Sparkles, badge: null },
        { id: 'bulk', label: 'Bulk Gifting CMS', icon: Layers, badge: null },
        { id: 'contact', label: 'Contact Us CMS', icon: Phone, badge: null },
      ]
    },
    {
      title: "Settings & Addons",
      items: [
        { id: 'promo', label: 'Promo Banner CMS', icon: ImageIcon, badge: null },
        { id: 'inquiry_cms', label: 'Inquiry Form CMS', icon: HelpCircle, badge: null },
        { id: 'footer', label: 'Footer CMS', icon: FileText, badge: null },
        { id: 'whatsapp', label: 'WhatsApp Settings', icon: Phone, badge: null },
      ]
    }
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f0417] text-white font-inter flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* MOBILE STICKY TOP HEADER WITH TOGGLE BUTTON (Mobile Devices) */}
      {/* ========================================================================= */}
      <div className="md:hidden bg-[#1b072a] border-b border-[#fdb927]/25 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-md flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Toggle Admin Sidebar Menu"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#fdb927] hover:text-[#1b072a] text-[#fdb927] border border-[#fdb927]/30 transition-colors flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>

          <img
            src="/images/logo3.png"
            alt="Seasonals Logo"
            className="h-6 w-auto max-w-[110px] object-contain"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1 text-xs text-white/80 hover:text-[#fdb927] bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Store</span>
          </button>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE SLIDE-IN SIDEBAR DRAWER WITH ANIMATION (Mobile Devices) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-[#0a0112]/80 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Left Slide-in Drawer with Fixed Bottom Buttons */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-64 sm:w-72 max-w-[85vw] bg-[#1b072a] border-r border-[#fdb927]/30 shadow-2xl z-50 flex flex-col h-full overflow-hidden md:hidden text-white"
            >
              {/* Fixed Header inside Mobile Drawer */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0 bg-[#1b072a]">
                <img
                  src="/images/logo3.png"
                  alt="Seasonals Logo"
                  className="h-7 w-auto max-w-[130px] object-contain"
                />
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Mobile Navigation Links Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                <nav className="space-y-4">
                  {navGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#fdb927]/70 px-2 mb-1">
                        {group.title}
                      </div>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              isActive
                                ? 'bg-[#fdb927] text-[#1b072a] font-bold shadow-md'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1b072a]' : 'text-[#fdb927]'}`} />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                isActive ? 'bg-[#1b072a] text-[#fdb927]' : 'bg-white/10 text-white/80'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Fixed Mobile Drawer Bottom Action Buttons */}
              <div className="p-3.5 border-t border-white/10 space-y-2 bg-[#1b072a] flex-shrink-0 shadow-lg">
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    onBackToHome();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-[#fdb927] bg-white/5 border border-white/10"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>View Live Website</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-950/60 hover:bg-red-900 border border-red-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR NAVIGATION (PC, Laptop, iPad Landscape) */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#1b072a] border-r border-[#fdb927]/20 flex-col h-screen md:sticky md:top-0 flex-shrink-0 z-20 overflow-hidden">
        {/* Fixed Brand Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-center flex-shrink-0 bg-[#1b072a]">
          <img
            src="/images/logo3.png"
            alt="Seasonals Logo"
            className="h-8 sm:h-9 w-auto max-w-[170px] object-contain drop-shadow-[0_2px_8px_rgba(253,185,39,0.35)]"
          />
        </div>

        {/* Scrollable Navigation Menu Links Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <nav className="space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#fdb927]/70 px-2.5 mb-1">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#fdb927] text-[#1b072a] font-bold shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#1b072a]' : 'text-[#fdb927]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-[#1b072a] text-[#fdb927]' : 'bg-white/10 text-white/80'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Fixed Desktop Sidebar Footer Action Buttons */}
        <div className="p-3.5 border-t border-white/10 space-y-2 bg-[#1b072a] flex-shrink-0 shadow-lg">
          <button
            onClick={onBackToHome}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-[#fdb927] bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-950/60 hover:bg-red-900 border border-red-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA (Independently scrollable on all devices) */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 h-[calc(100dvh-53px)] md:h-screen overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-16 space-y-6 w-full max-w-full overflow-x-hidden scroll-smooth">
        
        {/* Top Header Notification Toast */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg border ${
                statusMessage.type === 'error'
                  ? 'bg-red-900/90 border-red-500 text-red-100'
                  : 'bg-emerald-900/90 border-emerald-500 text-emerald-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                <span>{statusMessage.text}</span>
              </div>
              <button onClick={() => setStatusMessage(null)} className="text-white/60 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================== */}
        {/* TAB 1: DASHBOARD */}
        {/* ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                  Store Overview
                </h1>
                <p className="text-xs text-white/60 mt-0.5">
                  Real-time synchronization with Firestore database & Razorpay gateway
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className="bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-white/10"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>View Orders</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="bg-[#1b072a] border border-[#fdb927]/20 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60 font-medium">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#fdb927]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-playfair text-white">
                  {totalOrdersCount}
                </div>
                <div className="text-[10px] text-white/40 mt-1">Live Firestore Feed</div>
              </div>

              <div className="bg-[#1b072a] border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-amber-400 font-medium">Pending Action</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-playfair text-amber-400">
                  {pendingCount}
                </div>
                <div className="text-[10px] text-amber-400/60 mt-1">Need verification</div>
              </div>

              <div className="bg-[#1b072a] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-emerald-400 font-medium">Confirmed Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-playfair text-emerald-400">
                  ₹{totalRevenue}
                </div>
                <div className="text-[10px] text-emerald-400/60 mt-1">From {confirmedCount} orders</div>
              </div>

              <div className="bg-[#1b072a] border border-[#fdb927]/30 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#fdb927] font-medium">Active Products</span>
                  <Layers className="w-4 h-4 text-[#fdb927]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-playfair text-[#fdb927]">
                  {productsList.length}
                </div>
                <div className="text-[10px] text-white/40 mt-1">In store catalogue</div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#1b072a] border border-[#fdb927]/20 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-playfair font-bold text-base sm:text-lg text-white">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#fdb927] hover:underline"
                >
                  View All Orders ({orders.length}) →
                </button>
              </div>

              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#fdb927] bg-[#fdb927]/10 px-2 py-0.5 rounded">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-white">{order.name} ({order.mobileNumber})</div>
                      <div className="text-[11px] text-white/60">{order.productName} • ₹{order.totalPrice}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      order.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-amber-950 text-amber-400 border-amber-500/40'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                    <button
                      onClick={() => openCustomerWhatsApp(order)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
                    >
                      WhatsApp 💬
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: PRODUCTS MANAGER / ADD PRODUCT */}
        {/* ===================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                  Products Manager
                </h1>
                <p className="text-xs text-white/60 mt-0.5">
                  Add, edit, delete, and control stock of products shown on the website
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSeedProducts}
                  className="bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-3 py-2 rounded-xl border border-white/15 transition-all"
                  title="Import default handcrafted Diya catalogue to Firestore"
                >
                  Import 12 Default Sets
                </button>
                <button
                  onClick={() => {
                    setIsAddingProduct(!isAddingProduct);
                    setEditingProduct(null);
                  }}
                  className="bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAddingProduct ? 'Close Form' : 'Add New Product'}</span>
                </button>
              </div>
            </div>

            {/* Add / Edit Product Form Modal / Section */}
            {isAddingProduct && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1b072a] border border-[#fdb927]/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-playfair text-lg font-bold text-[#fdb927]">
                    {editingProduct ? `Edit Product: ${editingProduct.name}` : '✨ Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="p-1 rounded-full text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Product Title */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Enter product name (e.g. Crimson Rose Handcrafted Floral Diya)"
                      className="w-full px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                    />
                  </div>

                  {/* Pieces in Pack */}
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      Pieces in Pack
                    </label>
                    <input
                      type="number"
                      value={productForm.pieces}
                      onChange={(e) => setProductForm({ ...productForm, pieces: Number(e.target.value) })}
                      placeholder="4"
                      className="w-full px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                    />
                  </div>

                  {/* Festive Tag / Badge */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      Festive Tag / Badge
                    </label>
                    <input
                      type="text"
                      value={productForm.badge}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                      placeholder="🔥 Best Seller"
                      className="w-full px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                    />
                  </div>

                  {/* ========================================================= */}
                  {/* DEDICATED PRICING & DISCOUNT CONFIGURATION SECTION       */}
                  {/* ========================================================= */}
                  <div className="sm:col-span-3 bg-gradient-to-br from-[#12031c] via-[#1f062e] to-[#12031c] border border-[#fdb927]/40 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#fdb927]/20 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#fdb927]/20 border border-[#fdb927]/40 text-[#fdb927] flex items-center justify-center font-bold text-sm">
                          ₹
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#fdb927] font-playfair">
                            Pricing & Festive Discount Configuration
                          </h4>
                          <p className="text-[11px] text-white/60">
                            Set your selling price and regular MRP to display attractive strikethrough offers to customers
                          </p>
                        </div>
                      </div>

                      {/* Calculated Status Pill */}
                      {(() => {
                        const sellingPrice = Number(productForm.price) || 0;
                        const originalMrp = Number(productForm.originalPrice) || 0;
                        const hasDiscount = originalMrp > sellingPrice && sellingPrice > 0;
                        const discountPercent = hasDiscount ? Math.round(((originalMrp - sellingPrice) / originalMrp) * 100) : 0;
                        const savings = hasDiscount ? originalMrp - sellingPrice : 0;

                        if (hasDiscount) {
                          return (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold self-start sm:self-auto">
                              <span>🎉 {discountPercent}% OFF</span>
                              <span className="text-white/60">• Save ₹{savings}</span>
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/15 text-xs font-semibold self-start sm:self-auto">
                            Regular Price (No Discount)
                          </span>
                        );
                      })()}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Selling Price (What Customer Pays) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-extrabold text-white flex items-center gap-1">
                            <span>Selling Price (₹) *</span>
                            <span className="text-[#fdb927] text-[10px] uppercase font-bold tracking-wider">(Customer Pays)</span>
                          </label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#fdb927] pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="1"
                            required
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                            placeholder="120"
                            className="w-full pl-8 pr-3 py-2.5 bg-black/60 border border-[#fdb927]/40 focus:border-[#fdb927] rounded-xl text-sm font-bold text-white focus:outline-none"
                          />
                        </div>
                        <p className="text-[11px] text-white/50 mt-1">
                          The actual price charged to customer in cart & checkout
                        </p>
                      </div>

                      {/* 2. Original Price / MRP (Strikethrough Price) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-extrabold text-white flex items-center gap-1">
                            <span>Original MRP Price (₹)</span>
                            <span className="text-gray-400 text-[10px] uppercase font-semibold">(Strikethrough)</span>
                          </label>
                          {productForm.originalPrice && (
                            <button
                              type="button"
                              onClick={() => setProductForm({ ...productForm, originalPrice: '' })}
                              className="text-[10px] text-red-400 hover:text-red-300 underline"
                            >
                              Remove MRP
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-white/40 pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={productForm.originalPrice}
                            onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                            placeholder="e.g. 160 (Leave empty if no discount)"
                            className="w-full pl-8 pr-3 py-2.5 bg-black/60 border border-white/20 focus:border-[#fdb927] rounded-xl text-sm font-semibold text-white focus:outline-none"
                          />
                        </div>
                        <p className="text-[11px] text-white/50 mt-1">
                          Displayed with a strikethrough (e.g. <del className="text-gray-400">₹160</del>) to highlight savings
                        </p>
                      </div>
                    </div>

                    {/* Quick Preset Discount Buttons */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-white/70">
                          Quick Discount Calculators (Based on MRP):
                        </span>
                        <span className="text-[10px] text-[#fdb927]/80">
                          Auto-sets selling price
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[10, 15, 20, 25, 30, 35, 50].map((percent) => (
                          <button
                            key={percent}
                            type="button"
                            onClick={() => {
                              const mrp = Number(productForm.originalPrice) || Number(productForm.price) || 120;
                              // If no original price is set yet, assume current price was the target selling price or MRP
                              const baseMrp = Number(productForm.originalPrice) > 0 ? Number(productForm.originalPrice) : Math.round(mrp / (1 - percent / 100));
                              const newSellingPrice = Math.round(baseMrp * (1 - percent / 100));
                              setProductForm({
                                ...productForm,
                                originalPrice: baseMrp,
                                price: newSellingPrice
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#fdb927] hover:text-[#1b072a] text-white/80 text-xs font-bold border border-white/10 hover:border-[#fdb927] transition-all"
                          >
                            {percent}% OFF
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            // Set nice standard Diwali festive discount: MRP 160 -> Selling 120 (25% OFF)
                            setProductForm({
                              ...productForm,
                              originalPrice: 160,
                              price: 120
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#fdb927]/20 hover:bg-[#fdb927] text-[#fdb927] hover:text-[#1b072a] text-xs font-extrabold border border-[#fdb927]/50 transition-all ml-auto"
                        >
                          ✨ Default: ₹160 → ₹120 (25% OFF)
                        </button>
                      </div>
                    </div>

                    {/* Live Storefront Preview Card */}
                    {(() => {
                      const sellingPrice = Number(productForm.price) || 0;
                      const originalMrp = Number(productForm.originalPrice) || 0;
                      const hasDiscount = originalMrp > sellingPrice && sellingPrice > 0;
                      const discountPercent = hasDiscount ? Math.round(((originalMrp - sellingPrice) / originalMrp) * 100) : 0;
                      const savings = hasDiscount ? originalMrp - sellingPrice : 0;

                      return (
                        <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">
                              Live Customer Storefront View
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-[#fdb927]">
                                ₹{sellingPrice}
                              </span>
                              {hasDiscount && (
                                <>
                                  <span className="text-sm font-semibold text-white/50 line-through">
                                    ₹{originalMrp}
                                  </span>
                                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                                    {discountPercent}% OFF
                                  </span>
                                </>
                              )}
                              <span className="text-xs text-white/60">
                                / Pack of {productForm.pieces || 4} pcs
                              </span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            {hasDiscount ? (
                              <div className="space-y-0.5">
                                <span className="text-xs font-bold text-emerald-400 block">
                                  🎉 Customer Saves ₹{savings} ({discountPercent}% Discount)
                                </span>
                                <span className="text-[10px] text-white/50 block">
                                  Displayed on Product Card & Checkout Modal
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-white/50">
                                No discount applied. Showing regular ₹{sellingPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Multi-Image Product Gallery Manager */}
                  <div className="sm:col-span-3">
                    <MultiImageManager
                      images={productForm.images || (productForm.image ? [productForm.image] : [])}
                      onChange={(updatedImages) => {
                        setProductForm((prev) => ({
                          ...prev,
                          images: updatedImages,
                          image: updatedImages[0] || ''
                        }));
                      }}
                      onDeleteImage={async (removedImg, remainingImages) => {
                        if (removedImg) await deleteImageFileFromStorage(removedImg);
                        if (editingProduct?.id) {
                          try {
                            await updateProductInFirestore(editingProduct.id, {
                              images: remainingImages,
                              image: remainingImages[0] || ''
                            });
                            setEditingProduct((prev) => prev ? { ...prev, images: remainingImages, image: remainingImages[0] || '' } : null);
                            showToast("Image permanently deleted from product in database!");
                          } catch (err) {
                            console.error(err);
                            showToast("Failed to delete image from database.", "error");
                          }
                        }
                      }}
                      label="Product Gallery Images (Upload Multiple Photos)"
                      helperText="Add multiple photos for this product. Deleting an image will immediately remove it from the product in the database."
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      Product Description / Specialization
                    </label>
                    <textarea
                      rows={2}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="100% handmade terracotta clay with metallic golden rim & embossed floral rosette."
                      className="w-full px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Product Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {productsList.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#1b072a] rounded-2xl p-4 border border-[#fdb927]/20 shadow-md flex flex-col justify-between group hover:border-[#fdb927]/50 transition-all"
                >
                  <div>
                    {/* Image Preview & Badge */}
                    <div className="relative rounded-xl overflow-hidden mb-3 aspect-square bg-black/40 border border-white/5">
                      <img
                        src={prod.image || '/images/diya-pack-of-4.jpg'}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b072a]/90 text-[#fdb927] border border-[#fdb927]/40">
                        {prod.badge || 'Pack of 4'}
                      </span>

                      {/* Stock indicator badge */}
                      <button
                        onClick={() => handleToggleProductStock(prod)}
                        className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${
                          prod.inStock !== false ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}
                        title="Click to toggle stock status"
                      >
                        {prod.inStock !== false ? 'In Stock' : 'Out of Stock'}
                      </button>

                      {/* Discount Tag on Image if available */}
                      {prod.originalPrice > prod.price && (
                        <span className="absolute bottom-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md border border-white/20">
                          {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    <h4 className="font-playfair font-bold text-sm text-white line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-white/60 line-clamp-2 mt-1">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-[#fdb927]">₹{prod.price}</span>
                        {prod.originalPrice > prod.price && (
                          <>
                            <span className="text-xs text-white/40 line-through">₹{prod.originalPrice}</span>
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      {prod.originalPrice > prod.price && (
                        <span className="text-[10px] text-emerald-400/80 font-medium block mt-0.5">
                          Save ₹{prod.originalPrice - prod.price} / pack
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditProductClick(prod)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#fdb927] hover:text-[#1b072a] text-white transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-600 text-white/60 hover:text-white transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: CUSTOMER ORDERS */}
        {/* ===================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                  Customer Orders
                </h1>
                <p className="text-xs text-white/60 mt-0.5">
                  Track, confirm, and fulfill orders with integrated Razorpay payment verification
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: `All (${totalOrdersCount})` },
                  { id: 'pending', label: `Pending (${pendingCount})` },
                  { id: 'confirmed', label: `Confirmed (${confirmedCount})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      filterStatus === tab.id
                        ? 'bg-[#fdb927] text-[#1b072a] font-bold shadow'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[#fdb927] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone (+91), city, order ID..."
                className="w-full pl-9 pr-3 py-2.5 bg-black/30 border border-[#fdb927]/30 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#fdb927]"
              />
            </div>

            {/* Orders Cards Grid */}
            {ordersLoading ? (
              <div className="text-center py-16">
                <RefreshCw className="w-8 h-8 text-[#fdb927] animate-spin mx-auto mb-3" />
                <p className="text-xs text-white/60">Connecting to Firestore database...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                  const status = order.status || 'pending';
                  const isUpdating = updatingId === order.id;

                  return (
                    <motion.div
                      layout
                      key={order.id}
                      className={`bg-[#1b072a] rounded-2xl p-4 sm:p-5 border transition-all shadow-md flex flex-col justify-between ${
                        status === 'confirmed'
                          ? 'border-emerald-500/40'
                          : status === 'rejected'
                          ? 'border-red-500/30'
                          : 'border-amber-500/40'
                      }`}
                    >
                      <div>
                        {/* Header: ID + Date */}
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 mb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[#fdb927] bg-[#fdb927]/10 px-2 py-0.5 rounded border border-[#fdb927]/20">
                              #{order.id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-white/50 block mt-1">
                              📅 {order.createdDateString || 'Just now'}
                            </span>
                          </div>

                          <span className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                            status === 'confirmed'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                              : status === 'rejected'
                              ? 'bg-red-950 text-red-400 border-red-500/40'
                              : 'bg-amber-950 text-amber-400 border-amber-500/40'
                          }`}>
                            {status}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-2 mb-3 text-xs">
                          <div>
                            <span className="text-white/50 text-[10px] uppercase font-bold block">Customer:</span>
                            <div className="font-bold text-white text-sm">
                              {order.name || 'Guest'}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 bg-black/20 p-2 rounded-xl">
                            <div className="flex items-center gap-1.5 text-white font-mono text-xs">
                              <Phone className="w-3.5 h-3.5 text-[#fdb927]" />
                              <span>{order.mobileNumber}</span>
                            </div>
                            <button
                              onClick={() => openCustomerWhatsApp(order)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <span>WhatsApp</span>
                              <span>💬</span>
                            </button>
                          </div>

                          <div className="flex items-start gap-1.5 text-white/80 text-[11px] pt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#fdb927] flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-relaxed">
                              {order.address || 'Address not provided'}
                            </span>
                          </div>
                        </div>

                        {/* Product Summary */}
                        <div className="bg-white/5 p-3 rounded-xl mb-4 border border-white/5 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold text-white">
                            <span className="flex items-center gap-1">
                              <Package className="w-3.5 h-3.5 text-[#fdb927]" />
                              {order.productName || 'Diya Set'}
                            </span>
                            <span className="text-[#fdb927] font-black text-sm">
                              ₹{order.totalPrice || order.totalAmount}
                            </span>
                          </div>

                          <div className="text-[11px] text-white/60 flex items-center justify-between">
                            <span>Quantity: <strong className="text-white">{order.quantity || 1} Pack(s)</strong></span>
                            <span>Total: ₹{order.totalPrice}</span>
                          </div>

                          {/* Razorpay Payment Status */}
                          <div className="pt-1 mt-1 border-t border-white/5 flex items-center justify-between text-[11px]">
                            <span className="text-white/60">Payment:</span>
                            {order.paymentStatus === 'PAID' ? (
                              <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                                ✓ PAID (Razorpay)
                              </span>
                            ) : (
                              <span className="font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                {order.paymentMethod || 'Cash on Delivery'}
                              </span>
                            )}
                          </div>
                          {order.paymentId && (
                            <div className="text-[10px] font-mono text-emerald-400/80 truncate">
                              Txn: {order.paymentId}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 flex-1">
                          <button
                            onClick={() => handleStatusChange(order, 'confirmed')}
                            disabled={isUpdating || status === 'confirmed'}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                              status === 'confirmed'
                                ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(order, 'pending')}
                            disabled={isUpdating || status === 'pending'}
                            className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-amber-600/70 hover:bg-amber-500 text-white"
                          >
                            Pending
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#1b072a] border border-[#fdb927]/20 rounded-2xl p-12 text-center max-w-md mx-auto">
                <div className="text-4xl mb-3">🪔</div>
                <h3 className="font-playfair text-lg font-bold text-white mb-1">
                  No Orders Found
                </h3>
                <p className="text-xs text-white/50">
                  Customer orders placed on the website will appear here in real-time.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: INQUIRIES */}
        {/* ===================================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Customer Inquiries & Messages
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Questions and messages submitted through the website contact forms
              </p>
            </div>

            {inquiriesLoading ? (
              <div className="text-center py-16">
                <RefreshCw className="w-8 h-8 text-[#fdb927] animate-spin mx-auto mb-3" />
                <p className="text-xs text-white/60">Loading inquiries...</p>
              </div>
            ) : inquiries.length > 0 ? (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-[#1b072a] border border-[#fdb927]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{inq.name}</span>
                        <span className="text-xs font-mono text-[#fdb927] bg-[#fdb927]/10 px-2 py-0.5 rounded">
                          {inq.phone}
                        </span>
                        <span className="text-[10px] text-white/40">{inq.dateString}</span>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                        "{inq.message || inq.inquiry}"
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/91${(inq.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}! Regarding your inquiry at Seasonals:`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        Reply on WhatsApp 💬
                      </a>
                      <button
                        onClick={async () => {
                          if (window.confirm("Delete inquiry?")) {
                            await deleteInquiryFromFirestore(inq.id);
                            showToast("Inquiry deleted");
                          }
                        }}
                        className="text-xs text-red-400 hover:text-red-300 p-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1b072a] border border-[#fdb927]/20 rounded-2xl p-12 text-center max-w-md mx-auto">
                <div className="text-4xl mb-3">✉️</div>
                <h3 className="font-playfair text-lg font-bold text-white mb-1">
                  No Inquiries Yet
                </h3>
                <p className="text-xs text-white/50">
                  Customer questions and messages will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: CUSTOMER REVIEWS MANAGEMENT */}
        {/* ===================================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                  Customer Reviews & Ratings CMS
                </h1>
                <p className="text-xs text-white/60 mt-0.5">
                  Add, edit, or delete customer reviews displayed live on the website wall
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingReview(null);
                  setReviewForm({
                    name: '',
                    city: '',
                    rating: 5,
                    product: productsList[0]?.name || 'Handcrafted Floral Diya Set (Pack of 4)',
                    review: '',
                    tag: 'Verified Buyer',
                    avatarBg: 'bg-amber-100 text-amber-800'
                  });
                  setIsAddingReview(!isAddingReview);
                }}
                className="inline-flex items-center gap-2 bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isAddingReview ? 'Close Form' : '+ Add Customer Review'}</span>
              </button>
            </div>

            {/* Add / Edit Review Modal/Form */}
            {isAddingReview && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1b072a] border border-[#fdb927]/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 max-w-3xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-playfair text-lg font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#fdb927] fill-[#fdb927]" />
                    <span>{editingReview ? 'Edit Customer Review' : 'Add New Customer Review'}</span>
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingReview(false);
                      setEditingReview(null);
                    }}
                    className="p-1 rounded-full text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="Enter customer full name"
                        className="w-full px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">City / State *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.city}
                        onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                        placeholder="Enter customer city & state"
                        className="w-full px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Star Rating (1 - 5)</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#0f0417] border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] font-bold"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                        <option value="2">⭐⭐ (2 Stars)</option>
                        <option value="1">⭐ (1 Star)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Product Purchased</label>
                      {productsList.length > 0 ? (
                        <select
                          value={reviewForm.product}
                          onChange={(e) => setReviewForm({ ...reviewForm, product: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0f0417] border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                        >
                          {productsList.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                          <option value="Diwali Handcrafted Diya Set (Pack of 4)">Custom Diya Set</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={reviewForm.product}
                          onChange={(e) => setReviewForm({ ...reviewForm, product: e.target.value })}
                          placeholder="Enter product name"
                          className="w-full px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                        />
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1">Verification Tag</label>
                      <select
                        value={reviewForm.tag}
                        onChange={(e) => setReviewForm({ ...reviewForm, tag: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0f0417] border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                      >
                        <option value="Verified Buyer">Verified Buyer</option>
                        <option value="Verified Customer">Verified Customer</option>
                        <option value="Top Reviewer">Top Reviewer</option>
                        <option value="Diwali Festivities">Diwali Festivities</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">Customer Review Message *</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                      placeholder="Enter customer feedback comment..."
                      className="w-full px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingReview(false);
                        setEditingReview(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs text-white/70 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-xs sm:text-sm shadow-md"
                    >
                      {editingReview ? 'Update Review Live' : 'Publish Review Live'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Reviews Cards List */}
            {reviewsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#1b072a] rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-[#fdb927]/50 transition-all flex flex-col justify-between shadow-md group relative"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 mb-3">
                        <div className="flex items-center gap-1 text-[#fdb927]">
                          {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#fdb927]" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          {rev.tag || 'Verified'}
                        </span>
                      </div>

                      <p className="text-xs text-white/80 leading-relaxed italic mb-3">
                        "{rev.review}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{rev.name}</div>
                        <div className="text-[10px] text-white/50">{rev.city || 'India'} • {rev.product}</div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditReviewClick(rev)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#fdb927] hover:text-[#1b072a] text-white/70 transition-colors"
                          title="Edit Review"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-600 text-white/70 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1b072a] border border-[#fdb927]/20 rounded-2xl p-12 text-center max-w-md mx-auto">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-playfair text-lg font-bold text-white mb-1">
                  No Reviews Added Yet
                </h3>
                <p className="text-xs text-white/50 mb-4">
                  Click the button below to add your first customer review. It will display live on the website immediately.
                </p>
                <button
                  onClick={() => setIsAddingReview(true)}
                  className="bg-[#fdb927] text-[#1b072a] font-bold text-xs py-2.5 px-6 rounded-full"
                >
                  + Add Customer Review
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 6: DYNAMIC HERO SECTION CMS */}
        {/* ===================================================================== */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Hero Section CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Edit the text, headlines, and offer badges of the Hero Section without altering the premium layout design
              </p>
            </div>

            <form onSubmit={handleSaveHeroSettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              {/* Badge Text */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  Top Festive Badge Text
                </label>
                <input
                  type="text"
                  value={heroForm.badgeText || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                  placeholder="✨ Pure Terracotta • Handcrafted with Gold Scalloped Rim"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              {/* Title Line 1 */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  Headline Line 1
                </label>
                <input
                  type="text"
                  value={heroForm.titleLine1 || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                  placeholder="Celebrate Joy."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              {/* Title Highlight */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  Headline Golden Highlight (Line 2)
                </label>
                <input
                  type="text"
                  value={heroForm.titleHighlight || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, titleHighlight: e.target.value })}
                  placeholder="Gift with Purpose."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-[#fdb927] font-bold focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  Subtitle / Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={heroForm.subtitle || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  placeholder="Discover beautiful handmade festive products, thoughtfully created by talented children with physical challenges. Every purchase celebrates their creativity and helps create meaningful opportunities."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              {/* Multi-Image Hero Background Slider Manager */}
              <MultiImageManager
                images={heroForm.bgImages || (heroForm.bgImage ? [heroForm.bgImage] : [])}
                onChange={(updatedImages) => {
                  setHeroForm((prev) => ({
                    ...prev,
                    bgImages: updatedImages,
                    bgImage: updatedImages[0] || '',
                    backgroundImage: updatedImages[0] || ''
                  }));
                }}
                onDeleteImage={async (removedImg, remainingImages) => {
                  if (removedImg) await deleteImageFileFromStorage(removedImg);
                  try {
                    const updated = {
                      ...heroForm,
                      bgImages: remainingImages,
                      bgImage: remainingImages[0] || '',
                      backgroundImage: remainingImages[0] || ''
                    };
                    setHeroForm(updated);
                    await saveSiteSettings("hero_config", updated);
                    try { localStorage.setItem('seasonals_cached_hero', JSON.stringify(updated)); } catch(e) {}
                    showToast("Image permanently deleted from Hero settings in database!");
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to delete Hero image from database.", "error");
                  }
                }}
                label="Hero Background Images (Multi-Image Crossfade Carousel)"
                helperText="Upload or add multiple background images. Deleting an image will immediately remove it from the Hero settings in the database."
              />

              {/* Price / Highlight Tag */}
              <div className="bg-black/20 p-4 rounded-2xl border border-[#fdb927]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-white block">
                      Price Pill Tag
                    </label>
                    <p className="text-[10px] text-white/50">Display auspicious price badge (e.g. Special Pack: ₹120 for Pack of 4)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHeroForm({ ...heroForm, showPricePill: heroForm.showPricePill === false ? true : false })}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                      heroForm.showPricePill !== false
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white/10 text-white/50 hover:bg-white/20'
                    }`}
                  >
                    <span>{heroForm.showPricePill !== false ? '✓ ENABLED (ON)' : '✕ HIDDEN (OFF)'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  disabled={heroForm.showPricePill === false}
                  value={heroForm.offerTag || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, offerTag: e.target.value })}
                  placeholder="Special Pack: ₹120 for Pack of 4"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] disabled:opacity-40"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingHero}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingHero ? 'Publishing Live...' : 'Publish Hero Section Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: DYNAMIC SHOP PAGE CMS */}
        {/* ===================================================================== */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Shop Page CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Customize shop page header badge, title, description, and upload multiple top section background images
              </p>
            </div>

            <form onSubmit={handleSaveShopSettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Top Badge Text</label>
                <input
                  type="text"
                  value={shopForm.badgeText || ''}
                  onChange={(e) => setShopForm({ ...shopForm, badgeText: e.target.value })}
                  placeholder="100% Pure Terracotta Handcrafted Collection"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Shop Page Heading Title</label>
                <input
                  type="text"
                  value={shopForm.title || ''}
                  onChange={(e) => setShopForm({ ...shopForm, title: e.target.value })}
                  placeholder="Handcrafted Festive Diya Sets"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={shopForm.subtitle || ''}
                  onChange={(e) => setShopForm({ ...shopForm, subtitle: e.target.value })}
                  placeholder="Explore authentic terracotta diyas meticulously hand-painted with radiant 24K gold scalloped rims..."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              {/* Multi-Image Background Manager for Shop Page Header */}
              <MultiImageManager
                images={shopForm.bgImages || (shopForm.bgImage ? [shopForm.bgImage] : [])}
                onChange={(updatedImages) => {
                  setShopForm((prev) => ({
                    ...prev,
                    bgImages: updatedImages,
                    bgImage: updatedImages[0] || ''
                  }));
                }}
                onDeleteImage={async (removedImg, remainingImages) => {
                  if (removedImg) await deleteImageFileFromStorage(removedImg);
                  try {
                    const updated = {
                      ...shopForm,
                      bgImages: remainingImages,
                      bgImage: remainingImages[0] || ''
                    };
                    setShopForm(updated);
                    await saveSiteSettings("shop_config", updated);
                    try { localStorage.setItem('seasonals_cached_shop', JSON.stringify(updated)); } catch(e) {}
                    showToast("Image permanently deleted from Shop settings in database!");
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to delete Shop image from database.", "error");
                  }
                }}
                label="Shop Header Top Background Images (Multi-Image Crossfade Slider)"
                helperText="Upload or add multiple background images for the Shop page top header section. Deleting an image will immediately remove it from the Shop settings in the database."
              />

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingShop}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingShop ? 'Publishing Live...' : 'Publish Shop Page Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: DYNAMIC OUR MISSION (CSR) CMS */}
        {/* ===================================================================== */}
        {activeTab === 'mission' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Our Mission (CSR) CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Customize mission statement headings, descriptions, section photo, and upload top section background images
              </p>
            </div>

            <form onSubmit={handleSaveMissionSettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Badge Tag Text</label>
                <input
                  type="text"
                  value={missionForm.badgeText || ''}
                  onChange={(e) => setMissionForm({ ...missionForm, badgeText: e.target.value })}
                  placeholder="Our Mission"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Mission Section Title</label>
                <input
                  type="text"
                  value={missionForm.title || ''}
                  onChange={(e) => setMissionForm({ ...missionForm, title: e.target.value })}
                  placeholder="More Than a Product. A Story of Possibility."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Lead Highlight Sentence</label>
                <input
                  type="text"
                  value={missionForm.leadText || ''}
                  onChange={(e) => setMissionForm({ ...missionForm, leadText: e.target.value })}
                  placeholder="Behind every handmade creation is a child with imagination, patience and talent."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Belief Statement</label>
                <input
                  type="text"
                  value={missionForm.believeText || ''}
                  onChange={(e) => setMissionForm({ ...missionForm, believeText: e.target.value })}
                  placeholder="We believe physical challenges should never limit a child's opportunity to create, learn and contribute."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Detailed Description Paragraph</label>
                <textarea
                  rows={4}
                  value={missionForm.descText || ''}
                  onChange={(e) => setMissionForm({ ...missionForm, descText: e.target.value })}
                  placeholder="Our products are made with care by children with physical challenges..."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              {/* Dynamic Impact Metric Counters & Cards */}
              <div className="bg-black/30 p-4 sm:p-5 rounded-2xl border border-[#fdb927]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#fdb927]" />
                      <span>Impact Metric Cards (4 Social Impact Counters)</span>
                    </label>
                    <p className="text-[10px] sm:text-[11px] text-white/60 mt-0.5">
                      Customize values (e.g. 50+, 10,000+, 100%), titles, and descriptions shown on the Our Mission page
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = Array.isArray(missionForm.impactStats) && missionForm.impactStats.length > 0
                        ? [...missionForm.impactStats]
                        : [
                            { number: "50+", label: "Artisans Supported", desc: "Children receiving skill training & fair wages" },
                            { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth" },
                            { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically" },
                            { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance through talent" }
                          ];
                      setMissionForm({
                        ...missionForm,
                        impactStats: [
                          ...current,
                          { number: "100+", label: "New Impact Metric", desc: "Custom impact description" }
                        ]
                      });
                    }}
                    className="px-3 py-1.5 bg-[#fdb927]/20 hover:bg-[#fdb927]/30 text-[#fdb927] border border-[#fdb927]/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add Card</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {(Array.isArray(missionForm.impactStats) && missionForm.impactStats.length > 0 ? missionForm.impactStats : [
                    { number: "50+", label: "Artisans Supported", desc: "Children receiving skill training & fair wages" },
                    { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth" },
                    { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically" },
                    { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance through talent" }
                  ]).map((stat, idx) => (
                    <div key={idx} className="bg-black/50 p-3.5 rounded-xl border border-white/10 space-y-2 relative">
                      <div className="flex items-center justify-between pb-1 border-b border-white/10">
                        <span className="text-[11px] font-bold text-[#fdb927]">Metric Card #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const current = Array.isArray(missionForm.impactStats) ? [...missionForm.impactStats] : [
                              { number: "50+", label: "Artisans Supported", desc: "Children receiving skill training & fair wages" },
                              { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth" },
                              { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically" },
                              { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance through talent" }
                            ];
                            current.splice(idx, 1);
                            setMissionForm({ ...missionForm, impactStats: current });
                          }}
                          className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-white/70 block mb-0.5">Value (e.g. 50+, 100%)</label>
                          <input
                            type="text"
                            value={stat.number || ''}
                            onChange={(e) => {
                              const current = Array.isArray(missionForm.impactStats) ? [...missionForm.impactStats] : [
                                { number: "50+", label: "Artisans Supported", desc: "Children receiving skill training & fair wages" },
                                { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth" },
                                { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically" },
                                { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance through talent" }
                              ];
                              current[idx] = { ...current[idx], number: e.target.value };
                              setMissionForm({ ...missionForm, impactStats: current });
                            }}
                            placeholder="50+"
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-[#fdb927]/30 rounded-lg text-xs text-[#fdb927] font-black focus:outline-none focus:border-[#fdb927]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-white/70 block mb-0.5">Title / Label (e.g. Artisans Supported)</label>
                          <input
                            type="text"
                            value={stat.label || ''}
                            onChange={(e) => {
                              const current = Array.isArray(missionForm.impactStats) ? [...missionForm.impactStats] : [
                                { number: "50+", label: "Artisans Supported", desc: "Children receiving skill training & fair wages" },
                                { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth" },
                                { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically" },
                                { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance through talent" }
                              ];
                              current[idx] = { ...current[idx], label: e.target.value };
                              setMissionForm({ ...missionForm, impactStats: current });
                            }}
                            placeholder="Artisans Supported"
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-[#fdb927]/30 rounded-lg text-xs text-white font-bold focus:outline-none focus:border-[#fdb927]"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[10px] text-white/70 block mb-0.5">Subtitle Description</label>
                          <input
                            type="text"
                            value={stat.desc || ''}
                            onChange={(e) => {
                              const current = Array.isArray(missionForm.impactStats) ? [...missionForm.impactStats] : [
                                { number: "50+", label: "Artisans Supported", desc: "Children receiving skill training & fair wages" },
                                { number: "10,000+", label: "Diyas Handcrafted", desc: "Illuminating homes with authentic festive warmth" },
                                { number: "100%", label: "Pure Terracotta", desc: "Organic natural clay sourced ethically" },
                                { number: "100%", label: "Dignity & Pride", desc: "Empowering self-reliance through talent" }
                              ];
                              current[idx] = { ...current[idx], desc: e.target.value };
                              setMissionForm({ ...missionForm, impactStats: current });
                            }}
                            placeholder="Children receiving skill training & fair wages"
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-[#fdb927]/30 rounded-lg text-xs text-white focus:outline-none focus:border-[#fdb927]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Image Middle Section Showcase Photo Gallery */}
              <MultiImageManager
                images={missionForm.showcaseImages || (missionForm.missionImage ? [missionForm.missionImage] : [])}
                onChange={(updatedImages) => {
                  setMissionForm((prev) => ({
                    ...prev,
                    showcaseImages: updatedImages,
                    missionImage: updatedImages[0] || ''
                  }));
                }}
                onDeleteImage={async (removedImg, remainingImages) => {
                  if (removedImg) await deleteImageFileFromStorage(removedImg);
                  try {
                    const updated = {
                      ...missionForm,
                      showcaseImages: remainingImages,
                      missionImage: remainingImages[0] || ''
                    };
                    setMissionForm(updated);
                    await saveSiteSettings("mission_config", updated);
                    try { localStorage.setItem('seasonals_cached_mission', JSON.stringify(updated)); } catch(e) {}
                    showToast("Showcase image permanently deleted from database & project!");
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to delete showcase image from database.", "error");
                  }
                }}
                label="Mission Artisanal Crafting Photos (Middle Section Showcase Gallery)"
                helperText="Upload or add multiple photos of artisans and children creating diyas. Deleting an image will immediately remove it from the database."
              />

              {/* Multi-Image Top Header Background Manager */}
              <MultiImageManager
                images={missionForm.bgImages || (missionForm.bgImage ? [missionForm.bgImage] : [])}
                onChange={(updatedImages) => {
                  setMissionForm((prev) => ({
                    ...prev,
                    bgImages: updatedImages,
                    bgImage: updatedImages[0] || ''
                  }));
                }}
                onDeleteImage={async (removedImg, remainingImages) => {
                  if (removedImg) await deleteImageFileFromStorage(removedImg);
                  try {
                    const updated = {
                      ...missionForm,
                      bgImages: remainingImages,
                      bgImage: remainingImages[0] || ''
                    };
                    setMissionForm(updated);
                    await saveSiteSettings("mission_config", updated);
                    try { localStorage.setItem('seasonals_cached_mission', JSON.stringify(updated)); } catch(e) {}
                    showToast("Header image permanently deleted from database & project!");
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to delete header image from database.", "error");
                  }
                }}
                label="Mission Page Header Top Background Images (Multi-Image Slider)"
                helperText="Upload or add multiple background images for the Our Mission page top header section. Deleting an image will immediately remove it from the database."
              />

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingMission}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingMission ? 'Publishing Live...' : 'Publish Mission Page Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: DYNAMIC OUR STORY JOURNEY CMS */}
        {/* ===================================================================== */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Our Story Journey CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Customize our story heading, narrative intro, and upload top section background images
              </p>
            </div>

            <form onSubmit={handleSaveStorySettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Badge Tag Text</label>
                <input
                  type="text"
                  value={storyForm.badgeText || ''}
                  onChange={(e) => setStoryForm({ ...storyForm, badgeText: e.target.value })}
                  placeholder="THE INSPIRING JOURNEY"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Story Page Heading Title</label>
                <input
                  type="text"
                  value={storyForm.title || ''}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  placeholder="It Started With Two Sisters, Diyas & A Lesson"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Subtitle / Narrative Summary</label>
                <textarea
                  rows={3}
                  value={storyForm.subtitle || ''}
                  onChange={(e) => setStoryForm({ ...storyForm, subtitle: e.target.value })}
                  placeholder="Discover how a mother's challenge to her young daughters transformed into a nationwide social initiative..."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              {/* Multi-Image Top Header Background Manager */}
              <MultiImageManager
                images={storyForm.bgImages || (storyForm.bgImage ? [storyForm.bgImage] : [])}
                onChange={(updatedImages) => {
                  setStoryForm((prev) => ({
                    ...prev,
                    bgImages: updatedImages,
                    bgImage: updatedImages[0] || ''
                  }));
                }}
                onDeleteImage={async (removedImg, remainingImages) => {
                  if (removedImg) await deleteImageFileFromStorage(removedImg);
                  try {
                    const updated = {
                      ...storyForm,
                      bgImages: remainingImages,
                      bgImage: remainingImages[0] || ''
                    };
                    setStoryForm(updated);
                    await saveSiteSettings("story_config", updated);
                    try { localStorage.setItem('seasonals_cached_story', JSON.stringify(updated)); } catch(e) {}
                    showToast("Image permanently deleted from database & project!");
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to delete Story image from database.", "error");
                  }
                }}
                label="Our Story Header Top Background Images (Multi-Image Slider)"
                helperText="Upload or add multiple background images for the Our Story page top header section. Deleting an image will immediately remove it from the database."
              />

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingStory}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingStory ? 'Publishing Live...' : 'Publish Our Story Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: DYNAMIC BULK & CORPORATE GIFTING CMS */}
        {/* ===================================================================== */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Bulk & Corporate Gifting CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Customize corporate gifting headlines, descriptions, and upload top section background images
              </p>
            </div>

            <form onSubmit={handleSaveBulkSettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Badge Tag Text</label>
                <input
                  type="text"
                  value={bulkForm.badgeText || ''}
                  onChange={(e) => setBulkForm({ ...bulkForm, badgeText: e.target.value })}
                  placeholder="CORPORATE • WEDDINGS • EVENT FAVORS"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Bulk Gifting Heading Title</label>
                <input
                  type="text"
                  value={bulkForm.title || ''}
                  onChange={(e) => setBulkForm({ ...bulkForm, title: e.target.value })}
                  placeholder="Bespoke Corporate Festive Gifting & Bulk Orders"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={bulkForm.subtitle || ''}
                  onChange={(e) => setBulkForm({ ...bulkForm, subtitle: e.target.value })}
                  placeholder="Elevate your corporate gifting with meaningful, sustainable terracotta diyas crafted by specially-abled artisans..."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              {/* Multi-Image Top Header Background Manager */}
              <MultiImageManager
                images={bulkForm.bgImages || (bulkForm.bgImage ? [bulkForm.bgImage] : [])}
                onChange={(updatedImages) => {
                  setBulkForm((prev) => ({
                    ...prev,
                    bgImages: updatedImages,
                    bgImage: updatedImages[0] || ''
                  }));
                }}
                onDeleteImage={async (removedImg, remainingImages) => {
                  if (removedImg) await deleteImageFileFromStorage(removedImg);
                  try {
                    const updated = {
                      ...bulkForm,
                      bgImages: remainingImages,
                      bgImage: remainingImages[0] || ''
                    };
                    setBulkForm(updated);
                    await saveSiteSettings("bulk_config", updated);
                    try { localStorage.setItem('seasonals_cached_bulk', JSON.stringify(updated)); } catch(e) {}
                    showToast("Image permanently deleted from database & project!");
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to delete Bulk image from database.", "error");
                  }
                }}
                label="Bulk Gifting Header Top Background Images (Multi-Image Slider)"
                helperText="Upload or add multiple background images for the Bulk & Corporate Gifting page top header section. Deleting an image will immediately remove it from the database."
              />

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingBulk}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingBulk ? 'Publishing Live...' : 'Publish Bulk Gifting Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: DYNAMIC CONTACT US CMS */}
        {/* ===================================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Contact Us CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Customize contact page headings, support descriptions, and upload top section background images
              </p>
            </div>

            <form onSubmit={handleSaveContactSettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Badge Tag Text</label>
                <input
                  type="text"
                  value={contactForm.badgeText || ''}
                  onChange={(e) => setContactForm({ ...contactForm, badgeText: e.target.value })}
                  placeholder="WE ARE HERE TO HELP"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Contact Page Heading Title</label>
                <input
                  type="text"
                  value={contactForm.title || ''}
                  onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                  placeholder="Get in Touch with Team Seasonals"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={contactForm.subtitle || ''}
                  onChange={(e) => setContactForm({ ...contactForm, subtitle: e.target.value })}
                  placeholder="Have questions about order status, bulk gifting, custom colors, or shipping timelines? Reach out to our dedicated support desk."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              {/* Multi-Image Top Header Background Manager */}
              <MultiImageManager
                images={contactForm.bgImages || (contactForm.bgImage ? [contactForm.bgImage] : [])}
                onChange={(updatedImages) => {
                  setContactForm((prev) => ({
                    ...prev,
                    bgImages: updatedImages,
                    bgImage: updatedImages[0] || ''
                  }));
                }}
                onDeleteImage={async (removedImg, remainingImages) => {
                  if (removedImg) await deleteImageFileFromStorage(removedImg);
                  try {
                    const updated = {
                      ...contactForm,
                      bgImages: remainingImages,
                      bgImage: remainingImages[0] || ''
                    };
                    setContactForm(updated);
                    await saveSiteSettings("contact_config", updated);
                    try { localStorage.setItem('seasonals_cached_contact', JSON.stringify(updated)); } catch(e) {}
                    showToast("Image permanently deleted from database & project!");
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to delete Contact image from database.", "error");
                  }
                }}
                label="Contact Us Header Top Background Images (Multi-Image Slider)"
                helperText="Upload or add multiple background images for the Contact Us page top header section. Deleting an image will immediately remove it from the database."
              />

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingContact}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingContact ? 'Publishing Live...' : 'Publish Contact Us Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: DYNAMIC PROMO BANNER CMS */}
        {/* ===================================================================== */}
        {activeTab === 'promo' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Promo Banner CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Customize promo banner text, headlines, CTA buttons, and uploaded banner image across festive seasons
              </p>
            </div>

            <form onSubmit={handleSavePromoSettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Top Badge Text</label>
                <input
                  type="text"
                  value={promoForm.badgeText || ''}
                  onChange={(e) => setPromoForm({ ...promoForm, badgeText: e.target.value })}
                  placeholder="✨ Festive Special Celebration"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Headline Line 1</label>
                <input
                  type="text"
                  value={promoForm.titleLine1 || ''}
                  onChange={(e) => setPromoForm({ ...promoForm, titleLine1: e.target.value })}
                  placeholder="Make Every Celebration"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Headline Golden Highlight (Line 2)</label>
                <input
                  type="text"
                  value={promoForm.titleHighlight || ''}
                  onChange={(e) => setPromoForm({ ...promoForm, titleHighlight: e.target.value })}
                  placeholder="Extra Special"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-[#fdb927] font-bold focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={promoForm.subtitle || ''}
                  onChange={(e) => setPromoForm({ ...promoForm, subtitle: e.target.value })}
                  placeholder="Celebrate traditional joy, warmth, and special occasions with your family & friends..."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={promoForm.btnText || ''}
                  onChange={(e) => setPromoForm({ ...promoForm, btnText: e.target.value })}
                  placeholder="Order Now"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              {/* Multi-Image Promo Banner Manager */}
              <MultiImageManager
                images={promoForm.bgImages || (promoForm.bannerImage ? [promoForm.bannerImage] : [])}
                onChange={(updatedImages) => {
                  setPromoForm((prev) => ({
                    ...prev,
                    bgImages: updatedImages,
                    bannerImage: updatedImages[0] || ''
                  }));
                }}
                onDeleteImage={async (removedImg, remainingImages) => {
                  if (removedImg) await deleteImageFileFromStorage(removedImg);
                  try {
                    const updated = {
                      ...promoForm,
                      bgImages: remainingImages,
                      bannerImage: remainingImages[0] || ''
                    };
                    setPromoForm(updated);
                    await saveSiteSettings("promo_config", updated);
                    try { localStorage.setItem('seasonals_cached_promo', JSON.stringify(updated)); } catch(e) {}
                    showToast("Image permanently deleted from database & project!");
                  } catch (err) {
                    console.error(err);
                    showToast("Failed to delete Promo image from database.", "error");
                  }
                }}
                label="Promo Banner Featured Images (Multi-Image Carousel)"
                helperText="Upload or add multiple festive banner images. Deleting an image will immediately remove it from the database."
              />

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPromo}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingPromo ? 'Publishing Live...' : 'Publish Promo Banner Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB: DYNAMIC INQUIRY FORM CMS */}
        {/* ===================================================================== */}
        {activeTab === 'inquiry_cms' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Inquiry Form CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Customize title, subtitle, and badge text of the Inquiry & Custom Orders section
              </p>
            </div>

            <form onSubmit={handleSaveInquirySettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Top Badge Text</label>
                <input
                  type="text"
                  value={inquiryForm.badgeText || ''}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, badgeText: e.target.value })}
                  placeholder="Have Questions or Need Bulk Orders?"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Inquiry Section Title</label>
                <input
                  type="text"
                  value={inquiryForm.title || ''}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, title: e.target.value })}
                  placeholder="Inquire & Custom Orders"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">Subtitle Description</label>
                <textarea
                  rows={3}
                  value={inquiryForm.subtitle || ''}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, subtitle: e.target.value })}
                  placeholder="Looking for corporate gifting, custom color combinations, event favors, or bulk orders?..."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingInquiry}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingInquiry ? 'Publishing Live...' : 'Publish Inquiry Form Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 6: DYNAMIC FOOTER CMS */}
        {/* ===================================================================== */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                Dynamic Footer Section CMS
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Update footer company biography, support phone number, and attribution text
              </p>
            </div>

            <form onSubmit={handleSaveFooterSettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  Brand Story / Bio Paragraph
                </label>
                <textarea
                  rows={3}
                  value={footerForm.brandBio || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, brandBio: e.target.value })}
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  Support Phone Number
                </label>
                <input
                  type="text"
                  value={footerForm.supportPhone || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, supportPhone: e.target.value })}
                  placeholder="+91 91353 13565"
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingFooter}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingFooter ? 'Saving...' : 'Save Footer Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 7: WHATSAPP SETTINGS */}
        {/* ===================================================================== */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-white">
                WhatsApp Button & Order Settings
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Configure your official WhatsApp support number and automated message greetings
              </p>
            </div>

            <form onSubmit={handleSaveWaSettings} className="bg-[#1b072a] border border-[#fdb927]/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  WhatsApp Support Phone Number (10 Digits) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl bg-black/50 border border-r-0 border-[#fdb927]/30 text-white/80 text-xs font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={waForm.phoneNumber || ''}
                    onChange={(e) => setWaForm({ ...waForm, phoneNumber: e.target.value })}
                    placeholder="9135313565"
                    className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-r-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  Default Customer Greeting Message
                </label>
                <textarea
                  rows={3}
                  value={waForm.defaultMessage || ''}
                  onChange={(e) => setWaForm({ ...waForm, defaultMessage: e.target.value })}
                  placeholder="Hello Seasonals! 🪔 I would like to order the Handcrafted Floral Diya Set (Pack of 4) for ₹120."
                  className="w-full px-3 py-2.5 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#fdb927] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingWa}
                  className="px-6 py-3 rounded-xl bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingWa ? 'Saving...' : 'Save WhatsApp Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
