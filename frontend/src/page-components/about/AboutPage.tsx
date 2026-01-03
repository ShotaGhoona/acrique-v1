'use client';

import { AboutHeroSection } from '@/widgets/about/ui/AboutHeroSection';
import { AboutPhilosophySection } from '@/widgets/about/ui/AboutPhilosophySection';
import { AboutStorySection } from '@/widgets/about/ui/AboutStorySection';
import { AboutCraftSection } from '@/widgets/about/ui/AboutCraftSection';
import { AboutValuesSection } from '@/widgets/about/ui/AboutValuesSection';
import { AboutCTASection } from '@/widgets/about/ui/AboutCTASection';

export function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <AboutPhilosophySection />
      <AboutStorySection />
      <AboutCraftSection />
      <AboutValuesSection />
      <AboutCTASection />
    </main>
  );
}
