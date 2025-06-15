import { SocietyGrid } from "@/components/society-grid"
import { Hero } from "@/components/hero"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <main className="container mx-auto px-4 py-16">
        <SocietyGrid />
      </main>
    </div>
  )
}
