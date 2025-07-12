import { SocietyGrid } from "../components/society-grid"
import { Hero } from "../components/hero"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <section className="py-16">
        <div className="container mx-auto px-4 scale-[0.90] origin-top">
          <SocietyGrid />
        </div>
      </section>
    </div>
  )
}
