"use client"

import { useEffect, useState } from "react"
import { cartApi } from "../lib/apis"
import type { Society } from "../types"

export function useCart() {
  const [cart, setCart] = useState<Society[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart()
      setCart(res.data.cart)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCart = async (societyId: string) => {
    setLoading(true)
    try {
      await cartApi.toggleCart(societyId)
      await fetchCart()
    } catch (error) {
      console.error("Failed to toggle cart:", error)
    } finally {
      setLoading(false)
    }
  }

  // 👇 Fetch cart on first load
  useEffect(() => {
    fetchCart()
  }, [])

  return { cart, loading, fetchCart, toggleCart }
}
