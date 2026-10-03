import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Cloudinary Config ──────────────────────────────────────────────────────
// 1. Sign up free at https://cloudinary.com
// 2. Dashboard → copy your Cloud Name
// 3. Settings → Upload → Upload Presets → Add preset → set to "Unsigned" → Save
const CLOUDINARY_CLOUD_NAME = 'dh0wcd9ma';
const CLOUDINARY_UPLOAD_PRESET = 'Inventory';
// ─────────────────────────────────────────────────────────────────────────────

const CARS_COLLECTION = 'inventory';
const INQUIRIES_COLLECTION = 'inquiries';
const REVIEWS_COLLECTION = 'reviews';

// --- Storage: Image Upload ---

export const uploadCarImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'car-images');

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
    );

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Image upload to Cloudinary failed');
    }

    const data = await response.json();
    return data.secure_url;
};

// --- Cars API ---

export const getCars = async () => {
    try {
        const q = query(collection(db, CARS_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching cars:", error);
        throw error;
    }
};

export const getCarById = async (id) => {
    try {
        const docRef = doc(db, CARS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching car:", error);
        throw error;
    }
};

export const addCar = async (carData) => {
    try {
        const docRef = await addDoc(collection(db, CARS_COLLECTION), {
            ...carData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...carData };
    } catch (error) {
        console.error("API: Error adding car:", error);
        throw error;
    }
};

export const updateCar = async (id, carData) => {
    try {
        const docRef = doc(db, CARS_COLLECTION, id);
        await updateDoc(docRef, {
            ...carData,
            updatedAt: serverTimestamp()
        });
        return { id, ...carData };
    } catch (error) {
        console.error("Error updating car:", error);
        throw error;
    }
};

export const deleteCar = async (id) => {
    try {
        await deleteDoc(doc(db, CARS_COLLECTION, id));
        return id;
    } catch (error) {
        console.error("Error deleting car:", error);
        throw error;
    }
};

// --- Inquiries API ---

export const submitInquiry = async (inquiryData) => {
    try {
        const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
            ...inquiryData,
            status: 'New',
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...inquiryData };
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        throw error;
    }
};

export const getLeads = async () => {
    try {
        const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching leads:", error);
        throw error;
    }
};

export const updateLeadStatus = async (id, status) => {
    try {
        const docRef = doc(db, INQUIRIES_COLLECTION, id);
        await updateDoc(docRef, { status });
        return { id, status };
    } catch (error) {
        console.error("Error updating lead:", error);
        throw error;
    }
};

export const deleteLead = async (id) => {
    try {
        await deleteDoc(doc(db, INQUIRIES_COLLECTION, id));
        return id;
    } catch (error) {
        console.error("Error deleting lead:", error);
        throw error;
    }
};

// --- Reviews API ---

export const getReviews = async () => {
    try {
        const q = query(collection(db, REVIEWS_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export const addReview = async (reviewData) => {
    try {
        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
            ...reviewData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...reviewData };
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

export const deleteReview = async (id) => {
    try {
        await deleteDoc(doc(db, REVIEWS_COLLECTION, id));
        return id;
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
};
