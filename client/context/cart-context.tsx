"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { cartApi } from "../lib/apis";
import type { Society } from "../types";

interface CartContextProps {
  cart: Society[];
  loading: boolean;
  toggleCart: (id: string) => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Society[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart(res.data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCart = async (societyId: string) => {
    setLoading(true);
    try {
      await cartApi.toggleCart(societyId);
      await fetchCart();
    } catch (error) {
      console.error("Error toggling cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, toggleCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
