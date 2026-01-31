import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyASHxsuoX0cemiszko7fAM2VmxEFI_GXi8",
  authDomain: "consi-tracker.firebaseapp.com",
  projectId: "consi-tracker",
  storageBucket: "consi-tracker.firebasestorage.app",
  messagingSenderId: "189460216925",
  appId: "1:189460216925:web:125445bf345cb1e4d421b4",
  measurementId: "G-BPF2NLTB6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
