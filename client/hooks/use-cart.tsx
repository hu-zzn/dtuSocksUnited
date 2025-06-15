"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { cartApi } from "../lib/api"
import { useAuth } from "./use-auth"

interface CartContextType {
  cartItems: string[]
  cartCount: number
  isInCart: (societyId: string) => boolean
  toggleCart: (societyId: string) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<string[]>([])
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    } else {
      setCartItems([])
    }
  }, [isAuthenticated])

  const refreshCart = async () => {
    try {
      const cart = await cartApi.getCart()
      setCartItems(cart.map((item: any) => item._id))
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    }
  }

  const toggleCart = async (societyId: string) => {
    try {
      await cartApi.toggleCart(societyId)
      await refreshCart()
    } catch (error) {
      console.error("Failed to toggle cart:", error)
      throw error
    }
  }

  const isInCart = (societyId: string) => {
    return cartItems.includes(societyId)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        isInCart,
        toggleCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
