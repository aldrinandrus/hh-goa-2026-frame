import { Hero } from "@/components/landing/Hero";
import { ExperienceSection } from "@/components/landing/ExperienceSection";
import { GoaVisualSection } from "@/components/landing/GoaVisualSection";
import { BuilderTypesSection } from "@/components/landing/BuilderTypesSection";
import { LandingCta } from "@/components/landing/LandingCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExperienceSection />
      <GoaVisualSection />
      <BuilderTypesSection />
      <LandingCta />
    </>
  );
}
