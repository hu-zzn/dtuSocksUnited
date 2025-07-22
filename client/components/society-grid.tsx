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
  const scrollDirectionRef = useRef<"left" | "right" | null>(null);
  const scrollCategoryRef = useRef<string | null>(null);

  const SCROLL_INTERVAL_MS = 250;

  useEffect(() => {
    getAllSocieties();
  }, []);

  const safeSocieties = societies ?? [];

  const categories =
    safeSocieties.length > 0
      ? Array.from(
          new Set(safeSocieties.flatMap((society) => society.socCategory))
        )
      : [];

  const fuse = new Fuse(safeSocieties, {
    keys: ["socName", "socCategory", "socKeyWord", "socKeyEvents.name"],
    threshold: 0.25,
    includeScore: true,
  });

  const matches =
    searchTerm.trim() === ""
      ? safeSocieties
      : fuse.search(searchTerm).map((result) => result.item);

  const filteredSocieties = matches.filter((society) =>
    categoryFilter === "all"
      ? true
      : society.socCategory.includes(categoryFilter)
  );

  const startScrolling = (direction: "left" | "right", category: string) => {
    scrollDirectionRef.current = direction;
    scrollCategoryRef.current = category;

    scrollIntervalRef.current = setInterval(() => {
      const swiper = swiperRefs.current[category];
      if (swiper) {
        if (direction === "left") {
          swiper.slidePrev(300);
        } else {
          swiper.slideNext(300);
        }
      }
    }, SCROLL_INTERVAL_MS);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(clamp(200px,25%,300px),1fr))]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            id="search"
            name="search"
            placeholder="Search societies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 w-full border border-border rounded-full bg-card text-foreground placeholder:text-muted-foreground text-[clamp(0.9rem,2vw,1rem)]"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[clamp(180px,30vw,240px)] h-12 border border-border rounded-full bg-card text-foreground text-[clamp(0.9rem,2vw,1rem)]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="border border-border bg-card text-foreground">
            <SelectItem value="all" className="text-[clamp(0.9rem,2vw,1rem)]">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-[clamp(0.9rem,2vw,1rem)]">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 🧩 Display by Category Carousel */}
      {categoryFilter === "all" && searchTerm.trim() === "" ? (
        categories.map((category) => {
          const societiesInCategory = filteredSocieties.filter((s) =>
            s.socCategory.includes(category)
          );
          if (societiesInCategory.length === 0) return null;

          return (
            <div
              key={category}
              className="space-y-4 mb-12 group relative hover:bg-muted/10 p-2 rounded-xl transition"
            >
              <h2 className="font-bold text-[clamp(1.5rem,3vw,2.5rem)] text-primary">{category}</h2>

              {/* ⬅️ Left scroll */}
              <button
                onMouseEnter={() => startScrolling("left", category)}
                onMouseLeave={stopScrolling}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex p-2 bg-card border border-border rounded-full shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* ➡️ Right scroll */}
              <button
                onMouseEnter={() => startScrolling("right", category)}
                onMouseLeave={stopScrolling}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex p-2 bg-card border border-border rounded-full shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <Swiper
                modules={[FreeMode]}
                onSwiper={(swiper) =>
                  (swiperRefs.current[category] = swiper)
                }
                freeMode={true}
                grabCursor={true}
                touchRatio={0.8}
                loop={true}
                speed={1000}
                spaceBetween={16}
                slidesPerView="auto"
              >
                {societiesInCategory.map((society) => (
                  <SwiperSlide key={society._id} style={{ width: "auto" }}>
                    <SocietyCard
                      society={society}
                      onViewDetails={() => setSelectedSociety(society)}
                      onToggle={() => toggleCart(society._id)}
                      isInCart={cart?.some(
                        (item) => item._id === society._id
                      )}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          );
        })
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 transition-all duration-300">
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

      {/* ❌ No Results */}
      {filteredSocieties.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-[clamp(1rem,2vw,1.5rem)] font-light">
            No societies found matching your criteria.
          </p>
        </div>
      )}

      {/* 🔍 Modal */}
      <SocietyModal
        society={selectedSociety}
        isOpen={!!selectedSociety}
        onClose={() => setSelectedSociety(null)}
      />
    </div>
  );
}
