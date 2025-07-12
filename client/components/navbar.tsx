"use client";

import { useState } from "react";
import Link from "next/link";
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

  return (
    <nav className="bg-white dark:bg-black text-black dark:text-white shadow-sm dark:shadow-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-3xl font-light tracking-tight text-black dark:text-white"
          >
            Unify<span className="font-bold">DTU</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-light"
            >
              Home
            </Link>
            <Link
              href="/eventCalendar"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-light"
            >
              Event Calendar
            </Link>
            {user?.role === "Admin" && (
              <Link
                href="/admin"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-light"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-gray-300 dark:border-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-full"
                >
                  <Link href="/cart" className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                    {cartCount > 0 && (
                      <Badge
                        variant="default"
                        className="ml-1 bg-black dark:bg-white text-white dark:text-black"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-gray-50 dark:hover:bg-white/10 rounded-full"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border-gray-200 dark:border-white"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-gray-300 dark:border-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-full"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full"
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
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
              >
                Home
              </Link>
              <ThemeToggle />
              <Link
                href="/eventCalendar"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
              >
                Event Calendar
              </Link>
              {user?.role === "Admin" && (
                <Link
                  href="/admin"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
                >
                  Admin Panel
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Cart ({cartCount})
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
                  >
                    Profile
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-fit"
                  >
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
