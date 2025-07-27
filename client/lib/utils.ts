import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Merge class names
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}

// ✅ Force logout logic for expired session
export function logoutUser() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
