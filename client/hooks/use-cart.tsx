"use client";

import { useState } from "react";
import { cartApi } from "../lib/apis";
import type { Society } from "../types/index";

export function useCart() {
  const [cart, setCart] = useState<Society[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart(res.data.cart);
    } finally {
      setLoading(false);
    }
  };

  const toggleCart = async (societyId: string) => {
    setLoading(true);
    try {
      await cartApi.toggleCart(societyId);
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  return { cart, loading, fetchCart, toggleCart };
}
