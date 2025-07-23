"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { ShoppingCart, User, Menu, X, Home, Calendar, Shield } from "lucide-react"
import { useAuth } from "../context/auth-context"
import { useCart } from "../context/cart-context"
import { ThemeToggle } from "../components/theme-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const isAuthenticated = !!user
  const { cart } = useCart()
  const cartCount = cart?.length ?? 0
  const router = useRouter()

  const handleCartClick = () => {
    if (isAuthenticated) {
      router.push("/cart")
    } else {
      router.push("/login")
    }
  }

  // ✅ Full browser refresh for Home button
  const handleHomeClick = () => {
    window.location.href = "/"
  }

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-background text-foreground shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-light tracking-tight">
            Info<span className="font-bold">SOC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={handleHomeClick} className="hover:text-primary transition-colors font-light">
              Home
            </button>
            <Link href="/eventCalendar" className="hover:text-primary transition-colors font-light">
              Event Calendar
            </Link>
            {user?.role === "Admin" && (
              <Link href="/admin" className="hover:text-primary transition-colors font-light">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border hover:bg-secondary bg-transparent"
              onClick={handleCartClick}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart
                {cartCount > 0 && <Badge className="ml-1 bg-foreground text-background">{cartCount}</Badge>}
              </div>
            </Button>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-secondary rounded-full">
                    <User className="w-4 h-4 mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border bg-popover text-popover-foreground">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-border hover:bg-secondary rounded-full bg-transparent"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-muted rounded-full">
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

        {/* Mobile Menu - Improved */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="py-4 space-y-1">
              {/* Navigation Links */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    closeMobileMenu()
                    handleHomeClick()
                  }}
                  className="flex items-center w-full px-8 py-3 text-left hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4 mr-3" />
                  Home
                </button>

                <Link
                  href="/eventCalendar"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-8 py-3 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Event Calendar
                </Link>

                {user?.role === "Admin" && (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center w-full px-8 py-3 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    Admin Panel
                  </Link>
                )}
              </div>

              <Separator className="my-3" />

              {/* Cart */}
              <button
                onClick={() => {
                  closeMobileMenu()
                  handleCartClick()
                }}
                className="flex items-center justify-between w-full px-8 py-3 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-3" />
                  Cart
                </div>
                {cartCount > 0 && <Badge className="bg-primary text-primary-foreground">{cartCount}</Badge>}
              </button>

              <Separator className="my-3" />

              {/* User Actions */}
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center w-full px-8 py-3 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      closeMobileMenu()
                      logout()
                    }}
                    className="flex items-center w-full px-8 py-3 text-left hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-destructive"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-8 space-y-3">
                  <Button variant="outline" size="sm" asChild className="w-full justify-center bg-transparent">
                    <Link href="/login" onClick={closeMobileMenu}>
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="w-full justify-center">
                    <Link href="/register" onClick={closeMobileMenu}>
                      Register
                    </Link>
                  </Button>
                </div>
              )}

              <Separator className="my-3" />

              {/* Theme Toggle at Bottom */}
              <div className="px-8 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
