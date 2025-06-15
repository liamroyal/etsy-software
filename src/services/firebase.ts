import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for etsy-dropship-manager
const firebaseConfig = {
  apiKey: "AIzaSyCYYGe1euqblOd_2d67TWFBnxAcbXwDDBE",
  authDomain: "etsy-dropship-manager.firebaseapp.com",
  projectId: "etsy-dropship-manager",
  storageBucket: "etsy-dropship-manager.firebasestorage.app",
  messagingSenderId: "723951081534",
  appId: "1:723951081534:web:00f94d4442f5dcd75a996f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

// Note: After adding your real Firebase config:
// 1. Authentication will work for login/register
// 2. User data will be stored in Firestore
// 3. Roles (admin/user) will be managed automatically
