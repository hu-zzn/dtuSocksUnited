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

  // STEP 1: Load cart from localStorage when app starts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // STEP 2: Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // STEP 3: Toggle add/remove
  const toggleCart = (societyId: string, societyData?: Society) => {
    setCart((prevCart) => {
      const exists = prevCart.some((item) => item._id === societyId);
      const updatedCart = exists
        ? prevCart.filter((item) => item._id !== societyId)
        : [...prevCart, societyData!]; // Add full object if adding
      return updatedCart;
    });
  };

  // STEP 4: Expose fetchCart (optional, can remove if unused)
  const fetchCart = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  return { cart, toggleCart, fetchCart };
}
