"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
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

  const handleHomeClick = () => {
    // Force refresh of the homepage
    router.refresh();
    router.push("/");
  };

  return (
    <nav className="bg-background text-foreground shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-light tracking-tight">
            Unify<span className="font-bold">DTU</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-secondary rounded-full"
                  >
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
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background text-foreground">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleHomeClick();
                }}
                className="hover:text-primary text-left"
              >
                Home
              </button>
              <ThemeToggle />
              <Link href="/eventCalendar" className="hover:text-primary">
                Event Calendar
              </Link>
              {user?.role === "Admin" && (
                <Link href="/admin" className="hover:text-primary">
                  Admin Panel
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-0 hover:text-primary"
                onClick={handleCartClick}
              >
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
              </Button>
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="hover:text-primary">
                    Profile
                  </Link>
                  <Button variant="outline" size="sm" onClick={logout}>
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
  );
}
