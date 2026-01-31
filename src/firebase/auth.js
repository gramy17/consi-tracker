import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./config";

// Sign up with email/password
export const signUpWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile with display name
  await updateProfile(user, { displayName });

  // Create user document in Firestore
  await createUserDocument(user, { displayName });

  return user;
};

// Sign in with email/password
export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Check if user document exists, if not create it
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await createUserDocument(user);
  }

  return user;
};

// Sign out
export const logOut = async () => {
  await signOut(auth);
};

// Send password reset email
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// Create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  const userRef = doc(db, "users", user.uid);

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || additionalData.displayName || "User",
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    preferences: {
      focusMode: true,
      autoScheduleHabits: false,
      weeklyRecapEmail: true,
    },
    ...additionalData,
  };

  await setDoc(userRef, userData);
  return userData;
};

// Auth state observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
