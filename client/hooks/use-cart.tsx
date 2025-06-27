// "use client";

// import { useState } from "react";
// import { cartApi } from "../lib/apis";
// import type { Society } from "../types/index";

// export function useCart() {
//   const [cart, setCart] = useState<Society[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCart = async () => {
//     setLoading(true);
//     try {
//       const res = await cartApi.getCart();
//       setCart(res.data.cart);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleCart = async (societyId: string) => {
//     setLoading(true);
//     try {
//       await cartApi.toggleCart(societyId);
//       await fetchCart();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { cart, loading, fetchCart, toggleCart };
// }

import { useEffect, useState } from "react";
import type { Society } from "../types";

export function useCart() {
  const [cart, setCart] = useState<Society[]>([]);

  // Load cart from localStorage when hook mounts
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Toggle cart with full object
  const toggleCart = (society: Society) => {
    const exists = cart.some((item) => item._id === society._id);
    const updated = exists
      ? cart.filter((item) => item._id !== society._id)
      : [...cart, society];
    setCart(updated);
  };

  return { cart, toggleCart };
}

