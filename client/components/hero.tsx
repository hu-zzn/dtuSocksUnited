import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Calendar } from "lucide-react"

export function Hero() {
  return (
    <section className="bg-black text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">
          Discover Your
          <span className="block font-bold">Perfect Society</span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-300 font-light">
          Join communities that match your interests and build lifelong connections
        </p>
        <div className="flex flex-wrap justify-center gap-12 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-lg font-light">50+ Active Societies</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-lg font-light">100+ Events Yearly</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-lg font-light">Student-Led</span>
          </div>
        </div>
        <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-12 py-4 rounded-full font-medium">
          Explore Societies
        </Button>
      </div>
    </section>
  )
}
