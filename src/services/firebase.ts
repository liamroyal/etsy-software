import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYYGe1euqblOd_2d67TWFBnxAcbXwDDBE",
  authDomain: "etsy-dropship-manager.firebaseapp.com",
  projectId: "etsy-dropship-manager",
  storageBucket: "etsy-dropship-manager.appspot.com",
  messagingSenderId: "723951081534",
  appId: "1:723951081534:web:00f94d4442f5dcd75a996f"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Export the app instance
export default app;

// Note: After adding your real Firebase config:
// 1. Authentication will work for login/register
// 2. User data will be stored in Firestore
// 3. Roles (admin/user) will be managed automatically
