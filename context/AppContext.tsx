"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase";

export interface PriceLookupItem {
  id: string;
  name?: string;
  color?: string;
  colorCode?: string;
  hex?: string;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  priceTypes: PriceLookupItem[];
  lidColors: PriceLookupItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceLookupItem[]>([]);
  const [lidColors, setLidColors] = useState<PriceLookupItem[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resPrice, resColor] = await Promise.all([
          fetch("/api/price-types"),
          fetch("/api/lid-colors"),
        ]);
        const dataPrice = await resPrice.json();
        const dataColor = await resColor.json();
        if (dataPrice.data) setPriceTypes(dataPrice.data);
        if (dataColor.data) setLidColors(dataColor.data);
      } catch (err) {
        console.error("Failed to fetch master data in AppContext", err);
      }
    };
    fetchMasterData();
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Load user-specific wishlist
      if (currentUser) {
        const savedWishlist = localStorage.getItem(`wishlist_${currentUser.uid}`);
        if (savedWishlist) {
          try {
            setWishlist(JSON.parse(savedWishlist));
          } catch {
            setWishlist([]);
          }
        } else {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`Selamat datang, ${result.user.displayName}!`);
      return result.user;
    } catch (error: unknown) {
      console.error("Google login failed", error);
      const errorCode =
        typeof error === "object" && error !== null && "code" in error
          ? (error as { code?: string }).code
          : undefined;

      if (errorCode !== "auth/popup-closed-by-user") {
        toast.error("Gagal masuk dengan Google");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setWishlist([]);
      toast.success("Berhasil keluar");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Gagal keluar");
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    // Check if user is logged in
    let currentUser = user;
    if (!currentUser) {
      toast.info("Silakan masuk dengan akun Google terlebih dahulu");
      currentUser = await loginWithGoogle();
      if (!currentUser) {
        return false; // Login failed/canceled
      }
    }

    const key = `wishlist_${currentUser.uid}`;
    let updated: string[];

    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      toast.success("Dihapus dari wishlist");
    } else {
      updated = [...wishlist, productId];
      toast.success("Ditambahkan ke wishlist");
    }

    setWishlist(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    return true;
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
        wishlist,
        toggleWishlist,
        isInWishlist,
        priceTypes,
        lidColors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
