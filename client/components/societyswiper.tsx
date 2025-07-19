"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SocietyCard } from "./society-card";
import type { Society } from "../types/index";

interface SocietySwiperProps {
  societies: Society[];
}

export function SocietySwiper({ societies }: SocietySwiperProps) {
  return (
    <Swiper
      spaceBetween={16}
      watchOverflow={true}
      slidesPerView={1.2}
      breakpoints={{
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
    >
      {societies.map((society) => (
        <SwiperSlide key={society._id || society.socName} className="px-1">
          <SocietyCard society={society} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
