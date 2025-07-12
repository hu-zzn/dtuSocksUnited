import { SocietyGrid } from "../components/society-grid"
import { Hero } from "../components/hero"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white">
      <Hero />
      
      <section className="py-16 bg-white dark:bg-black transition-colors">
        <div className="container mx-auto px-4 scale-[0.90] origin-top">
          <SocietyGrid />
        </div>
      </section>
    </div>
  )
}
