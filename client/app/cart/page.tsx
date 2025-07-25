"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import type { Society } from "../../types/index"; // adjust the path if your types are elsewhere

interface SocietyCardProps {
  society: Society;
  onViewDetails?: () => void;
  onToggle: () => void;
  isInCart: boolean;
}

export function SocietyCard({
  society,
  onViewDetails,
  onToggle,
  isInCart,
}: SocietyCardProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold">{society.socName}</h3>

      {/* Example optional detail button */}
      {onViewDetails && (
        <Button onClick={onViewDetails} variant="ghost" className="w-full">
          View Details
        </Button>
      )}

      <Button onClick={onToggle} variant="outline" className="w-full">
        {isInCart ? "Remove from Cart" : "Add to Cart"}
      </Button>

      {/* Hide this on /cart page */}
      {pathname !== "/cart" && (
        <Button
          onClick={() => router.push("/cart")}
          variant="default"
          className="w-full"
        >
          View Cart
        </Button>
      )}
    </div>
  );
}
