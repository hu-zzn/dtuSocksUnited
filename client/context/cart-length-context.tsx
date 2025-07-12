// context/cart-length-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useCart } from "../hooks/use-cart";

interface CartLengthContextProps {
  cartLength: number;
}

const CartLengthContext = createContext<CartLengthContextProps | undefined>(undefined);

export function CartLengthProvider({ children }: { children: ReactNode }) {
  const { cart } = useCart();
  const [cartLength, setCartLength] = useState(cart?.length ?? 0);

  useEffect(() => {
    setCartLength(cart?.length ?? 0);
  }, [cart]);

  return (
    <CartLengthContext.Provider value={{ cartLength }}>
      {children}
    </CartLengthContext.Provider>
  );
}

export const useCartLength = () => {
  const ctx = useContext(CartLengthContext);
  if (!ctx) {
    throw new Error("useCartLength must be used within a CartLengthProvider");
  }
  return ctx;
};
