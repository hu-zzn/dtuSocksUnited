"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { useCart } from "../context/cart-context";
import { ThemeToggle } from "../components/theme-toggle";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { cart } = useCart();
  const cartCount = cart?.length ?? 0;
  const router = useRouter();

  const handleCartClick = () => {
    if (isAuthenticated) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  // ✅ Full browser refresh for Home button
  const handleHomeClick = () => {
    window.location.href = "/";
  };

  return (
    <nav className="bg-background text-foreground shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-y-4 py-4">
          {/* Logo */}
          <Link href="/" className="text-3xl font-light tracking-tight">
            Unify<span className="font-bold">DTU</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              onClick={handleHomeClick}
              className="hover:text-primary transition-colors font-light"
            >
              Home
            </button>
            <Link
              href="/eventCalendar"
              className="hover:text-primary transition-colors font-light"
            >
              Event Calendar
            </Link>
            {user?.role === "Admin" && (
              <Link
                href="/admin"
                className="hover:text-primary transition-colors font-light"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Actions: ThemeToggle, Cart, Auth */}
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border hover:bg-secondary"
              onClick={handleCartClick}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart
                {cartCount > 0 && (
                  <Badge className="ml-1 bg-foreground text-background">
                    {cartCount}
                  </Badge>
                )}
              </div>
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-secondary rounded-full"
                >
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    {user?.name}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="rounded-full border-border hover:bg-secondary"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-border hover:bg-secondary rounded-full"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-muted rounded-full"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
