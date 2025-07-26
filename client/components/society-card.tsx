"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Users, Calendar, Plus, Check } from "lucide-react";
import type { Society } from "../types/index";
import { useAuth } from "../context/auth-context";
import { cn } from "../lib/utils";

interface SocietyCardProps {
  society: Society;
  onViewDetails?: () => void;
  onToggle?: () => void;
  isInCart?: boolean;
}

export function SocietyCard({
  society,
  onViewDetails,
  onToggle,
  isInCart = false,
}: SocietyCardProps) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();

  const handleToggleCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!onToggle) return;

    setIsToggling(true);
    try {
      await onToggle();
    } catch (error) {
      console.error("Failed to toggle cart:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="min-h-[30rem] flex flex-col justify-between border border-border bg-muted/20 rounded-2xl p-4 shadow-sm transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-white/10">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-[clamp(1rem,2.2vw,1.2rem)] font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {society.socName}
            </CardTitle>

            <div className="flex flex-wrap gap-2 mt-2">
              {society.socCategory.slice(0, 2).map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-[clamp(0.7rem,1.8vw,0.85rem)] bg-muted text-foreground rounded-full"
                >
                  {category}
                </Badge>
              ))}
              {society.socCategory.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-[clamp(0.7rem,1.8vw,0.85rem)] border-border text-muted-foreground rounded-full"
                >
                  +{society.socCategory.length - 2}
                </Badge>
              )}
            </div>
          </div>

          {society.socLogo && (
            <div className="flex-shrink-0">
              <img
                src={society.socLogo}
                alt={`${society.socName} logo`}
                className="w-[clamp(3rem,6vw,3.5rem)] h-[clamp(3rem,6vw,3.5rem)] rounded-full object-cover border border-border shadow-sm"
              />
            </div>
          )}
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="flex-1 overflow-hidden pb-4">
        <div className="flex flex-col h-full">
          {society.socAbout && (
            <p
              className={cn(
                "text-[clamp(0.85rem,2vw,0.95rem)] text-muted-foreground mb-4",
                "leading-relaxed overflow-hidden line-clamp-3"
              )}
            >
              {society.socAbout}
            </p>
          )}

          {society.socHighlights?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-[clamp(0.8rem,2vw,0.95rem)]">
                Highlights
              </h4>
              <ul
                className={cn(
                  "text-[clamp(0.7rem,1.8vw,0.85rem)] space-y-2 text-muted-foreground",
                  "overflow-hidden max-h-[4.2rem]"
                )}
              >
                {society.socHighlights.slice(0, 2).map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-muted rounded-full mt-1 flex-shrink-0" />
                    <span className="leading-relaxed line-clamp-1">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-6 mt-auto pt-4 text-[clamp(0.7rem,1.8vw,0.85rem)] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{society.socContact?.team?.length ?? 0} council</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{society.socKeyEvents?.length ?? 0} events</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-0">
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="w-full rounded-md font-light border-border hover:bg-muted text-foreground text-sm"
          >
            View Details
          </Button>

          <Button
            onClick={handleToggleCart}
            disabled={isToggling}
            variant={isInCart ? "default" : "outline"}
            className={cn(
              "w-full truncate rounded-md font-light transition-colors text-sm",
              isInCart
                ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] hover:opacity-90"
                : "border-border hover:bg-muted text-foreground"
            )}
          >
            {isToggling ? (
              <div className="w-4 h-4 border-[2px] border-current border-t-transparent rounded-full animate-spin" />
            ) : isInCart ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardFooter>

    </Card>
  );
}
