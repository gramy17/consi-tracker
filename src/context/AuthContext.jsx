import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange, logOut } from "../firebase/auth";
import { subscribeToUserProfile } from "../firebase/firestore";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to user profile when user is logged in
  useEffect(() => {
    let unsubscribe = null;

    if (user) {
      unsubscribe = subscribeToUserProfile(user.uid, (profile) => {
        setUserProfile(profile);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
      setUserProfile(null);
    };
  }, [user]);

  const logout = async () => {
    try {
      await logOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
