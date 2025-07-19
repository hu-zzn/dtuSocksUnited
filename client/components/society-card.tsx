"use client";

import { useState } from "react";
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

  const handleToggleCart = async () => {
    if (!isAuthenticated || !onToggle) return;

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
    <Card className="h-[45vh] min-h-[320px] max-h-[500px] w-full flex flex-col justify-between transition-all duration-300 border border-border bg-card text-foreground group hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-white/10">
      <CardHeader className="pb-4">
        {/* ... Header remains the same ... */}
      </CardHeader>

      <CardContent className="flex-1 pb-4 overflow-hidden">
        <p className="text-sm line-clamp-3 mb-4 leading-relaxed text-muted-foreground">
          {society.socAbout}
        </p>

        {society.socHighlights?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Highlights</h4>
            <ul className="text-xs space-y-2 text-muted-foreground max-h-[10vh] overflow-hidden">
              {society.socHighlights.slice(0, 3).map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-[0.375rem] h-[0.375rem] bg-muted rounded-full mt-[0.375rem] flex-shrink-0" />
                  <span className="leading-relaxed line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-6 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>{society.socContact?.team?.length ?? 0} council</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{society.socKeyEvents?.length ?? 0} events</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-0 mt-auto">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1 rounded-full font-light border-border hover:bg-muted text-foreground"
        >
          View Details
        </Button>

        <Button
          onClick={handleToggleCart}
          disabled={!isAuthenticated || isToggling}
          variant={isInCart ? "default" : "outline"}
          className={`flex-1 rounded-full font-light transition-colors ${isInCart
            ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] hover:opacity-90"
            : "border-border hover:bg-muted text-foreground"
            }`}
        >
          {isToggling ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isInCart ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>

  );
}
