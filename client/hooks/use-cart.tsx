import { useEffect, useState } from "react";
import { cartApi } from "../lib/apis";
import type { Society } from "../types";

export function useCart() {
  const [cart, setCart] = useState<Society[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart(res.data.cart); // ✅ Ensure backend returns { cart: [...] }
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
    fetchCart(); // load cart on first mount
  }, []);

  return { cart, loading, toggleCart };
}
