import { SocietyGrid } from "../components/society-grid";
import { Hero } from "../components/hero";
import { Footer } from "../components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Hero />

      {/* 🔽 Societies Section */}
      <section
        id="societies"
        className="py-16 bg-card text-card-foreground transition-colors duration-300"
      >
        <div className="container mx-auto px-4 scale-[1] origin-top">
          <SocietyGrid />
        </div>
      </section>
      <Footer />
    </div>
  );
}
