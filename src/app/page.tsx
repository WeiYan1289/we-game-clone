import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { CollegeSection } from "@/components/sections/CollegeSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { FrameSection } from "@/components/sections/FrameSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TeamupSection } from "@/components/sections/TeamupSection";
import { TopicSection } from "@/components/sections/TopicSection";

export default function Home() {
  return (
    <AppShell>
      <main>
        <HeroSection />
        <TopicSection />
        <FrameSection />
        <FeatureSection />
        <TeamupSection />
        <CollegeSection />
      </main>
      <Footer />
    </AppShell>
  );
}
