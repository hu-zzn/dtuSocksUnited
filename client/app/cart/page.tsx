"use client";

import { useState } from "react";
import { useCart } from "../../context/cart-context";
import { SocietyCard } from "../../components/society-card";
import { SocietyModal } from "../../components/society-modal";
import type { Society } from "../../types";

export default function CartPage() {
  const { cart, setCart, toggleCart } = useCart(); // ✅ ensure `setCart` is exposed
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (society: Society) => {
    setSelectedSociety(society);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSociety(null);
    setIsModalOpen(false);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  return (
    <section className="bg-background text-foreground min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-8 text-primary">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-muted-foreground text-lg">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cart.map((society) => (
              <SocietyCard
                key={society._id}
                society={society}
                isInCart={true}
                onToggle={() => removeFromCart(society._id)}
                onViewDetails={() => openModal(society)}
              />
            ))}
          </div>
        )}
      </div>

      <SocietyModal
        society={selectedSociety}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
