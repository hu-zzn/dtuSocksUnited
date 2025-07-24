"use client"

import { Button } from "../components/ui/button"
import { GraduationCap, Users, Calendar } from "lucide-react"

export function Hero() {
  const scrollToSocieties = () => {
    const section = document.getElementById("societies")
    section?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="bg-black text-white py-12 md:py-24 relative overflow-hidden min-h-[50vh] md:min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
      <div className="container mx-auto px-4 text-center relative z-10 w-full">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-light mb-4 md:mb-8 tracking-tight">
          Discover Your
          <span className="block font-bold">Perfect Society</span>
        </h1>
        <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-12 max-w-2xl md:max-w-3xl mx-auto text-gray-300 font-light">
          Explore communities that match your interests and build lifelong connections
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-12 mb-6 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <span className="text-sm md:text-lg font-light">50+ Active Societies</span>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <span className="text-sm md:text-lg font-light">100+ Events Yearly</span>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <span className="text-sm md:text-lg font-light">Student-Led</span>
          </div>
        </div>
        <Button
          size="lg"
          className="bg-white text-black hover:bg-gray-100 text-base md:text-lg px-8 md:px-12 py-3 md:py-4 rounded-full font-medium"
          onClick={scrollToSocieties}
        >
          Explore Societies
        </Button>
      </div>
    </section>
  )
}
