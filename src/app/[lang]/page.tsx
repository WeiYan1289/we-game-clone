import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { CollegeSection } from "@/components/sections/CollegeSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { FrameSection } from "@/components/sections/FrameSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TeamupSection } from "@/components/sections/TeamupSection";
import { TopicSection } from "@/components/sections/TopicSection";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <AppShell
      locale={lang}
      dict={{ header: dict.header, rail: dict.rail, region: dict.region, download: dict.download, pwa: dict.pwa }}
    >
      <main>
        <HeroSection dict={dict.hero} downloadDict={dict.download} />
        <TopicSection dict={dict.topic} games={dict.games} />
        <FrameSection dict={dict.frame} />
        <FeatureSection dict={dict.feature} />
        <TeamupSection dict={dict.teamup} />
        <CollegeSection dict={dict.college} />
      </main>
      <Footer dict={dict.footer} downloadDict={dict.download} />
    </AppShell>
  );
}
