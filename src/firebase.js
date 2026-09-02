import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc,
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBX19VWQ81SAB5Hy_gkMyV6Dwx9SZgy6iI",
  authDomain: "job-portal-85414.firebaseapp.com",
  databaseURL: "https://job-portal-85414-default-rtdb.firebaseio.com",
  projectId: "job-portal-85414",
  storageBucket: "job-portal-85414.firebasestorage.app",
  messagingSenderId: "699831995778",
  appId: "1:699831995778:web:8c70b03e11a00761d4d39b",
  measurementId: "G-CH4DKBBLC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Universal helper to delete uploaded image files from storage if applicable
 */
export async function deleteImageFileFromStorage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  try {
    if (imageUrl.includes('firebasestorage.googleapis.com') || imageUrl.includes('firebasestorage.app')) {
      const imgRef = storageRef(storage, imageUrl);
      await deleteObject(imgRef);
      console.log("Deleted image from Firebase Storage:", imageUrl);
    }
  } catch (err) {
    console.warn("Storage deletion notice:", err);
  }
}

// Tenant Identifier
export const TENANT_ID = "seasonal-website";

// Helper to get Tenant Collection Reference
export const getTenantCollection = (subCollectionName) => {
  return collection(db, "tenants", TENANT_ID, subCollectionName);
};

// Helper to get Tenant Document Reference
export const getTenantDoc = (subCollectionName, docId) => {
  return doc(db, "tenants", TENANT_ID, subCollectionName, docId);
};

// ==========================================
// 1. ORDERS MANAGEMENT (Under Tenant)
// ==========================================

export async function saveOrderToFirestore(orderData) {
  try {
    const cleanMobile = (orderData.mobileNumber || "").replace(/\D/g, "");
    const timestamp = serverTimestamp();
    const orderRecord = {
      ...orderData,
      tenantId: TENANT_ID,
      cleanMobile,
      status: orderData.status || "pending", // 'pending' | 'confirmed' | 'rejected'
      createdAt: timestamp,
      createdDateString: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short"
      }),
      createdAtMillis: Date.now()
    };

    // 1. Save in tenant orders: tenants/seasonal-website/orders
    const tenantOrdersRef = getTenantCollection("orders");
    const docRef = await addDoc(tenantOrdersRef, orderRecord);

    // 2. Also partition under customer phone: tenants/seasonal-website/customers/{cleanMobile}/orders/{orderId}
    if (cleanMobile) {
      try {
        const customerOrderRef = doc(db, "tenants", TENANT_ID, "customers", cleanMobile, "orders", docRef.id);
        await setDoc(customerOrderRef, { ...orderRecord, id: docRef.id });
      } catch (err) {
        console.warn("Tenant customer partition notice:", err);
      }
    }

    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error("Error saving order to tenant Firestore:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId, newStatus, cleanMobile = null) {
  try {
    const orderDocRef = getTenantDoc("orders", orderId);
    await updateDoc(orderDocRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    if (cleanMobile) {
      try {
        const customerOrderRef = doc(db, "tenants", TENANT_ID, "customers", cleanMobile, "orders", orderId);
        await updateDoc(customerOrderRef, {
          status: newStatus,
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn("Customer partition status update note:", e);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function deleteOrderFromFirestore(orderId, cleanMobile = null) {
  try {
    await deleteDoc(getTenantDoc("orders", orderId));
    if (cleanMobile) {
      try {
        await deleteDoc(doc(db, "tenants", TENANT_ID, "customers", cleanMobile, "orders", orderId));
      } catch (e) {}
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

// ==========================================
// 2. DYNAMIC PRODUCTS MANAGEMENT (Under Tenant)
// ==========================================

export async function addProductToFirestore(productData) {
  try {
    const productsRef = getTenantCollection("products");
    const docRef = await addDoc(productsRef, {
      ...productData,
      tenantId: TENANT_ID,
      inStock: productData.inStock !== false,
      createdAt: serverTimestamp(),
      createdAtMillis: Date.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding product to tenant Firestore:", error);
    throw error;
  }
}

export async function updateProductInFirestore(productId, updatedData) {
  try {
    const prodDocRef = getTenantDoc("products", productId);
    await updateDoc(prodDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating product in tenant Firestore:", error);
    throw error;
  }
}

export async function deleteProductFromFirestore(productId) {
  try {
    const prodDocRef = getTenantDoc("products", productId);
    try {
      const snap = await getDoc(prodDocRef);
      if (snap.exists()) {
        const prodData = snap.data();
        const imgs = Array.isArray(prodData.images) ? prodData.images : (prodData.image ? [prodData.image] : []);
        for (const img of imgs) {
          await deleteImageFileFromStorage(img);
        }
      }
    } catch (fetchErr) {
      console.warn("Product image cleanup note:", fetchErr);
    }
    await deleteDoc(prodDocRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product from tenant Firestore:", error);
    throw error;
  }
}

// ==========================================
// 3. INQUIRIES MANAGEMENT (Under Tenant)
// ==========================================

export async function saveInquiryToFirestore(inquiryData) {
  try {
    const inqRef = getTenantCollection("inquiries");
    const docRef = await addDoc(inqRef, {
      ...inquiryData,
      tenantId: TENANT_ID,
      status: "unread", // 'unread' | 'contacted' | 'resolved'
      createdAt: serverTimestamp(),
      createdAtMillis: Date.now(),
      dateString: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short"
      })
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving customer inquiry:", error);
    throw error;
  }
}

export async function updateInquiryStatus(inquiryId, status) {
  try {
    await updateDoc(getTenantDoc("inquiries", inquiryId), {
      status,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    throw error;
  }
}

export async function deleteInquiryFromFirestore(inquiryId) {
  try {
    await deleteDoc(getTenantDoc("inquiries", inquiryId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    throw error;
  }
}

// ==========================================
// 4. DYNAMIC SITE SETTINGS (Under Tenant)
// ==========================================

export async function saveSiteSettings(settingKey, settingsData) {
  try {
    const settingDocRef = getTenantDoc("settings", settingKey);
    await setDoc(settingDocRef, {
      ...settingsData,
      tenantId: TENANT_ID,
      updatedAt: serverTimestamp(),
      updatedAtMillis: Date.now()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error(`Error saving tenant setting ${settingKey}:`, error);
    throw error;
  }
}

export async function getSiteSettings(settingKey) {
  try {
    const docSnap = await getDoc(getTenantDoc("settings", settingKey));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error(`Error getting tenant setting ${settingKey}:`, error);
    return null;
  }
}

// ==========================================
// 5. CUSTOMER REVIEWS MANAGEMENT (Under Tenant)
// ==========================================

export async function addReviewToFirestore(reviewData) {
  try {
    const reviewsRef = getTenantCollection("reviews");
    const docRef = await addDoc(reviewsRef, {
      ...reviewData,
      tenantId: TENANT_ID,
      rating: Number(reviewData.rating) || 5,
      isVerified: reviewData.isVerified !== false,
      createdAt: serverTimestamp(),
      createdAtMillis: Date.now(),
      dateString: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium"
      })
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding review to tenant Firestore:", error);
    throw error;
  }
}

export async function updateReviewInFirestore(reviewId, updatedData) {
  try {
    const revDocRef = getTenantDoc("reviews", reviewId);
    await updateDoc(revDocRef, {
      ...updatedData,
      rating: Number(updatedData.rating) || 5,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating review in tenant Firestore:", error);
    throw error;
  }
}

export async function deleteReviewFromFirestore(reviewId) {
  try {
    await deleteDoc(getTenantDoc("reviews", reviewId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting review from tenant Firestore:", error);
    throw error;
  }
}

