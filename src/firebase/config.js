import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const requiredEnvKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
];

export const firebaseEnvMissingKeys = requiredEnvKeys.filter(
  (key) => !import.meta.env[key]
);
export const firebaseEnvValid = firebaseEnvMissingKeys.length === 0;

if (!firebaseEnvValid) {
  // Don't throw here: a top-level throw causes a blank page in production builds.
  // Instead, let the app render a helpful configuration message.
  console.error(
    `Missing Firebase env vars: ${firebaseEnvMissingKeys.join(
      ", "
    )}. Configure them in your deployment environment (e.g. Vercel Project Settings → Environment Variables).`
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only when configured
const app = firebaseEnvValid ? initializeApp(firebaseConfig) : null;

// Initialize services
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

export default app;
