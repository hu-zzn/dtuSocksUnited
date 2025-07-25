"use client"

import { useRouter } from "next/navigation"; // ✅ Add this import
import { useCart } from "../../hooks/use-cart"
import { SocietyCard } from "../../components/society-card"

export default function CartPage() {
  const { cart, toggleCart } = useCart()
  const router = useRouter(); // ✅ Initialize router

  return (
    <section className="bg-background text-foreground min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-8 text-primary">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-muted-foreground text-lg">
            Your cart is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cart.map((society) => (
              <SocietyCard
                key={society._id}
                society={society}
                onToggle={() => toggleCart(society._id)}
                isInCart={true}
                onViewDetails={() => router.push(`/societies/${society._id}`)} // ✅ Now works
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
