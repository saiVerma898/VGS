import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2chi7baabGASKtPkuHfANKNYYIce6HXc",
  authDomain: "viralgrowthstrategy.firebaseapp.com",
  projectId: "viralgrowthstrategy",
  storageBucket: "viralgrowthstrategy.firebasestorage.app",
  messagingSenderId: "855010460443",
  appId: "1:855010460443:web:6f01c59b66b6a938ad09be",
  measurementId: "G-YK7FNRLET2",
};

// Initialize only once (prevents re-init on hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth — for user login/signup
export const auth = getAuth(app);

// Firestore — for storing users, subscriptions, newsletter signups, contact form submissions
export const db = getFirestore(app);

// Analytics — only in browser
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
