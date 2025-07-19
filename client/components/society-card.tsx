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
    <Card className="aspect-[4/5] w-full flex flex-col justify-between border border-border bg-card text-foreground transition-all duration-300 group hover:-translate-y-[0.25rem] hover:shadow-2xl dark:hover:shadow-white/10">
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-3 px-4 sm:px-6 pt-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-sm sm:text-base font-medium group-hover:text-primary transition-colors line-clamp-2">
              {society.socName}
            </CardTitle>

            <div className="flex flex-wrap gap-1 mt-2">
              {society.socCategory.slice(0, 2).map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-xs bg-muted text-foreground hover:bg-accent border-0 rounded-full"
                >
                  {category}
                </Badge>
              ))}
              {society.socCategory.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground rounded-full"
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
                className="w-12 h-12 rounded-full object-cover border border-border shadow-sm"
              />
            </div>
          )}
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 pb-4">
        <div className="flex flex-col h-full">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2 leading-relaxed">
            {society.socAbout}
          </p>

          {society.socHighlights?.length > 0 && (
            <div className="space-y-1">
              <h4 className="font-medium text-xs sm:text-sm">Highlights</h4>
              <ul className="text-xs space-y-1 text-muted-foreground overflow-hidden max-h-[8vh]">
                {society.socHighlights.slice(0, 3).map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-muted rounded-full mt-1 flex-shrink-0" />
                    <span className="leading-snug line-clamp-1">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-4 mt-auto pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{society.socContact?.team?.length ?? 0} council</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{society.socKeyEvents?.length ?? 0} events</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-shrink-0 gap-2 px-4 sm:px-6 pb-4 pt-0">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1 rounded-full font-light border-border hover:bg-muted text-foreground text-xs sm:text-sm"
        >
          View Details
        </Button>

        <Button
          onClick={handleToggleCart}
          disabled={isToggling}
          variant={isInCart ? "default" : "outline"}
          className={`flex-1 rounded-full font-light transition-colors text-xs sm:text-sm ${
            isInCart
              ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] hover:opacity-90"
              : "border-border hover:bg-muted text-foreground"
          }`}
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
      </CardFooter>
    </Card>
  );
}
