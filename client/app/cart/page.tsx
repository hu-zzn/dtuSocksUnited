"use client";

import { useCart } from "../../hooks/use-cart"; // adjust if path is different
import { SocietyCard } from "../../components/society-card";

export default function CartPage() {
  const { cart, toggleCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cart.map((society) => (
            <SocietyCard
              key={society._id}
              society={society}
              onToggle={() => toggleCart(society._id)}
              isInCart={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
