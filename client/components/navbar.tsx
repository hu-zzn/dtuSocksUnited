"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useAuth } from "../hooks/use-auth"
import { useCart } from "../hooks/use-cart"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { cart } = useCart()
  const  cartCount  = cart?.length?? 0

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-light text-black tracking-tight">
            Society<span className="font-bold">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-black transition-colors font-light">
              Home
            </Link>
            <Link href="/eventCalender" className="text-gray-600 hover:text-black transition-colors font-light">
              Event Calender 
            </Link>
            {user?.role === "Admin" && (
              <Link href="/admin" className="text-gray-600 hover:text-black transition-colors font-light">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild className="border-gray-300 hover:bg-gray-50 rounded-full">
                  <Link href="/cart" className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                    {cartCount > 0 && (
                      <Badge variant="default" className="ml-1 bg-black text-white">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-50 rounded-full">
                      <User className="w-4 h-4 mr-2" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-gray-200">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" asChild className="border-gray-300 hover:bg-gray-50 rounded-full">
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-black hover:bg-gray-800 rounded-full">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link href="/societies" className="text-gray-700 hover:text-blue-600">
                Societies
              </Link>
              {user?.role === "Admin" && (
                <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                  Admin Panel
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <ShoppingCart className="w-4 h-4" />
                    Cart ({cartCount})
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                    Profile
                  </Link>
                  <Button variant="outline" size="sm" onClick={logout} className="w-fit">
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
