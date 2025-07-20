"use client";

import { useState, useEffect, useRef } from "react";
import { SocietyCard } from "../components/society-card";
import { SocietyModal } from "../components/society-modal";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Society } from "../types/index";
import { useSocieties } from "../hooks/use-society";
import { useCart } from "../context/cart-context";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Fuse from "fuse.js";
import "swiper/css";
import "swiper/css/free-mode";

export function SocietyGrid() {
  const { societies, loading, getAllSocieties } = useSocieties();
  const { cart, toggleCart } = useCart();

  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const swiperRefs = useRef<Record<string, SwiperType | null>>({});
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getAllSocieties();
  }, []);

  const safeSocieties = societies ?? [];

  const categories = safeSocieties.length > 0
    ? Array.from(new Set(safeSocieties.flatMap((society) => society.socCategory)))
    : [];

  const fuse = new Fuse(safeSocieties, {
    keys: ["socName", "socCategory", "socKeyWord", "socKeyEvents.name"],
    threshold: 0.4,
    includeScore: true,
  });

  const matches = searchTerm.trim() === ""
    ? safeSocieties
    : fuse.search(searchTerm).map((result) => result.item);

  const filteredSocieties = matches.filter((society) =>
    categoryFilter === "all" ? true : society.socCategory.includes(categoryFilter)
  );

  const startScrolling = (direction: "left" | "right", category: string) => {
    scrollIntervalRef.current = setInterval(() => {
      const swiper = swiperRefs.current[category];
      if (swiper) {
        direction === "left" ? swiper.slidePrev(300) : swiper.slideNext(300);
      }
    }, 250);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-36 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search societies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border border-border rounded-full bg-card text-foreground placeholder:text-muted-foreground text-xs"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48 h-10 border border-border rounded-full bg-card text-xs">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="border border-border bg-card text-xs">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display */}
      {categoryFilter === "all" && searchTerm.trim() === "" ? (
        categories.map((category) => {
          const societiesInCategory = filteredSocieties.filter((s) =>
            s.socCategory.includes(category)
          );
          if (societiesInCategory.length === 0) return null;
          return (
            <div
              key={category}
              className="space-y-2 mb-6 group relative hover:bg-muted/10 p-2 rounded-xl transition"
            >
              <h2 className="text-sm md:text-lg font-medium text-primary">{category}</h2>
              <button
                onMouseEnter={() => startScrolling("left", category)}
                onMouseLeave={stopScrolling}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex p-1 bg-card border border-border rounded-full shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onMouseEnter={() => startScrolling("right", category)}
                onMouseLeave={stopScrolling}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex p-1 bg-card border border-border rounded-full shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Swiper
                modules={[FreeMode]}
                onSwiper={(swiper) => (swiperRefs.current[category] = swiper)}
                freeMode
                grabCursor
                touchRatio={0.8}
                loop
                speed={1000}
                spaceBetween={16}
                slidesPerView="auto"
                breakpoints={{
                  0: { slidesPerView: 2 },
                  640: { slidesPerView: 2.5 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {societiesInCategory.map((society) => (
                  <SwiperSlide key={society._id}>
                    <SocietyCard
                      society={society}
                      onViewDetails={() => setSelectedSociety(society)}
                      onToggle={() => toggleCart(society._id)}
                      isInCart={cart?.some((item) => item._id === society._id)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSocieties.map((society) => (
            <SocietyCard
              key={society._id}
              society={society}
              onViewDetails={() => setSelectedSociety(society)}
              onToggle={() => toggleCart(society._id)}
              isInCart={cart?.some((item) => item._id === society._id)}
            />
          ))}
        </div>
      )}

      {filteredSocieties.length === 0 && (
        <div className="text-center py-10 text-xs text-muted-foreground">
          No societies found matching your criteria.
        </div>
      )}

      <SocietyModal
        society={selectedSociety}
        isOpen={!!selectedSociety}
        onClose={() => setSelectedSociety(null)}
      />
    </div>
  );
}
