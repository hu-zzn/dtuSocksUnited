import { Button } from "../components/ui/button";
import { GraduationCap, Users, Calendar } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full min-h-screen bg-muted text-foreground py-24 relative overflow-hidden">
      {/* Optional: dark gradient overlay if you want to keep original feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-gray-200 to-muted opacity-90" />

      <div className="relative z-10 px-6 mx-auto max-w-7xl text-center">
        <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">
          Discover Your
          <span className="block font-bold">Perfect Society</span>
        </h1>

        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-muted-foreground font-light">
          Join communities that match your interests and build lifelong connections
        </p>

        <div className="flex flex-wrap justify-center gap-12 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-lg font-light">50+ Active Societies</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-lg font-light">100+ Events Yearly</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-lg font-light">Student-Led</span>
          </div>
        </div>

        <Button
          size="lg"
          className="bg-black text-white hover:bg-gray-900 text-lg px-12 py-4 rounded-full font-medium"
        >
          Explore Societies
        </Button>
      </div>
    </section>
  );
}
