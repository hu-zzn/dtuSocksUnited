"use client";
import { useRouter } from "next/navigation";

export function RefreshHomeButton() {
  const router = useRouter();

  const handleRefresh = () => {
    // ✅ Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // ✅ Navigate to home and refresh data
    router.push("/");
    router.refresh();

    // ✅ Optional: Clear any custom global state here (e.g., Redux/Zustand)
  };

  return (
    <button
      onClick={handleRefresh}
      className="text-sm font-medium text-primary hover:underline"
    >
      Home
    </button>
  );
}
