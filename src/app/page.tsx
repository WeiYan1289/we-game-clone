import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TopicSection } from "@/components/sections/TopicSection";

export default function Home() {
  return (
    <AppShell>
      <main>
        <HeroSection />
        <TopicSection />
      </main>
      <Footer />
    </AppShell>
  );
}
