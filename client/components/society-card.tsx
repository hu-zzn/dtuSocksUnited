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
    <Card className="h-full min-h-[420px] flex flex-col transition-all duration-300 border border-border bg-card text-foreground group hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-white/10">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors mb-3 leading-tight">
              {society.socName}
            </CardTitle>

            <div className="flex flex-wrap gap-2">
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
                className="w-20 h-20 rounded-full object-cover border border-border shadow-sm"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm mb-6 leading-relaxed text-muted-foreground">
          {society.socAbout}
        </p>

        {society.socHighlights?.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-sm text-foreground">Highlights</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              {society.socHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-6 text-sm text-muted-foreground mt-auto">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{society.socContact?.team?.length ?? 0} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{society.socKeyEvents?.length ?? 0} events</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-0">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1 rounded-full font-medium border-border hover:bg-muted text-foreground"
        >
          View Details
        </Button>

        {isAuthenticated && (
          <Button
            onClick={handleToggleCart}
            disabled={isToggling}
            variant={isInCart ? "default" : "outline"}
            className={`flex-1 rounded-full font-medium transition-colors ${
              isInCart
                ? "bg-primary text-primary-foreground hover:opacity-90"
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
        )}
      </CardFooter>
    </Card>
  );
}