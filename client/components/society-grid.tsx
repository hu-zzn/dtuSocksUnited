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
import "swiper/css";
import "swiper/css/free-mode";

export function SocietyGrid() {
  const { societies, loading, getAllSocieties } = useSocieties();
  const { cart, toggleCart } = useCart();

  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    getAllSocieties();
  }, []);

  const swiperRefs = useRef<Record<string, SwiperType | null>>({});

  const safeSocieties = societies ?? [];
  const categories =
    safeSocieties.length > 0
      ? Array.from(
        new Set(safeSocieties.flatMap((society) => society.socCategory))
      )
      : [];

  const filteredSocieties = safeSocieties.filter((society) => {
    const searchWord = searchTerm.trim().toLowerCase();
    if (!searchWord)
      return categoryFilter === "all" ||
        society.socCategory.includes(categoryFilter);

    const searchRegex = new RegExp(`\\b${searchWord}\\b`, "i");

    const matchesSearch =
      searchRegex.test(society.socName) ||
      society.socCategory.some((cat) => searchRegex.test(cat)) ||
      (society.socKeyWord ?? []).some((keyword) =>
        searchRegex.test(keyword)
      ) ||
      (society.socKeyEvents ?? []).some((event) =>
        searchRegex.test(event.name)
      );

    const matchesCategory =
      categoryFilter === "all" || society.socCategory.includes(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            id="search"
            name="search"
            placeholder="Search societies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border border-border rounded-full bg-card text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-64 h-12 border border-border rounded-full bg-card text-foreground">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="border border-border bg-card text-foreground">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 🧩 Display by Category Carousel */}
      {categoryFilter === "all" ? (
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
              <h2 className="text-3xl font-semibold text-primary">
                {category}
              </h2>

              {/* ← Arrow */}
              <button
                onClick={() => swiperRefs.current[category]?.slidePrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex p-2 bg-card border border-border rounded-full shadow-md transition hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* → Arrow */}
              <button
                onClick={() => swiperRefs.current[category]?.slideNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex p-2 bg-card border border-border rounded-full shadow-md transition hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <Swiper
                modules={[FreeMode]}
                onSwiper={(swiper) =>
                  (swiperRefs.current[category] = swiper)
                }
                freeMode={{
                  enabled: true,
                  momentum: true,
                  momentumBounce: false,
                  momentumRatio: 1.5,       // Speed boost
                  momentumVelocityRatio: 2, // Acceleration feel
                  sticky: false,
                }}
                grabCursor={true}
                loop={true}
                speed={800} // ✅ Smooth transition
                spaceBetween={24}
                slidesPerView={3}
                breakpoints={{
                  0: { slidesPerView: 1.2 },
                  640: { slidesPerView: 2.1 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {societiesInCategory.map((society) => (
                  <SwiperSlide key={society._id}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <p className="text-muted-foreground text-xl font-light">
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
