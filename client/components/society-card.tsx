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
    <Card className="h-[50vh] min-h-[45vh] max-h-[65vh] w-full flex flex-col justify-between border border-border bg-card text-foreground transition-all duration-300 group hover:-translate-y-[0.25rem] hover:shadow-2xl dark:hover:shadow-white/10">
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-[1rem]">
        <div className="flex justify-between items-start gap-[1rem]">
          <div className="flex-1">
            <CardTitle className="text-[1.1rem] font-medium group-hover:text-primary transition-colors line-clamp-2">
              {society.socName}
            </CardTitle>

            <div className="flex flex-wrap gap-[0.5rem] mt-[0.5rem]">
              {society.socCategory.slice(0, 2).map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-[0.75rem] bg-muted text-foreground hover:bg-accent border-0 rounded-full"
                >
                  {category}
                </Badge>
              ))}
              {society.socCategory.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-[0.75rem] border-border text-muted-foreground rounded-full"
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
                className="w-[3.5rem] h-[3.5rem] rounded-full object-cover border border-border shadow-sm"
              />
            </div>
          )}
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="flex-1 min-h-0 overflow-hidden pb-[1rem]">
        <div className="flex flex-col h-full">
          {/* About (3 lines only) */}
          <p className="text-[0.9rem] leading-relaxed text-muted-foreground line-clamp-3 mb-[1rem]">
            {society.socAbout}
          </p>

          {/* Highlights (3 items only) */}
          {society.socHighlights?.length > 0 && (
            <div className="space-y-[0.75rem]">
              <h4 className="font-medium text-[0.875rem]">Highlights</h4>
              <ul className="text-[0.75rem] space-y-[0.5rem] text-muted-foreground overflow-hidden max-h-[10vh]">
                {society.socHighlights.slice(0, 3).map((highlight, index) => (
                  <li key={index} className="flex items-start gap-[0.75rem]">
                    <div className="w-[0.375rem] h-[0.375rem] bg-muted rounded-full mt-[0.375rem] flex-shrink-0" />
                    <span className="leading-relaxed line-clamp-1">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-[1.5rem] mt-auto pt-[1rem] text-[0.75rem] text-muted-foreground">
            <div className="flex items-center gap-[0.5rem]">
              <Users className="w-[0.875rem] h-[0.875rem]" />
              <span>{society.socContact?.team?.length ?? 0} council</span>
            </div>
            <div className="flex items-center gap-[0.5rem]">
              <Calendar className="w-[0.875rem] h-[0.875rem]" />
              <span>{society.socKeyEvents?.length ?? 0} events</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-shrink-0 flex gap-[0.75rem] pt-0">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1 rounded-full font-light border-border hover:bg-muted text-foreground"
        >
          View Details
        </Button>

        {isAuthenticated && (
          <Button
            onClick={handleToggleCart}
            disabled={isToggling}
            variant={isInCart ? "default" : "outline"}
            className={`flex-1 rounded-full font-light transition-colors ${isInCart
              ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] hover:opacity-90"
              : "border-border hover:bg-muted text-foreground"
              }`}
          >
            {isToggling ? (
              <div className="w-[1rem] h-[1rem] border-[0.125rem] border-current border-t-transparent rounded-full animate-spin" />
            ) : isInCart ? (
              <>
                <Check className="w-[1rem] h-[1rem] mr-[0.5rem]" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-[1rem] h-[1rem] mr-[0.5rem]" />
                Add to Cart
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
