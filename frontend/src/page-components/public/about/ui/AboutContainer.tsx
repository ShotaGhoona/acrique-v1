'use client';

import { AboutHeroSection } from './sections/AboutHeroSection';
import { AboutPhilosophySection } from './sections/AboutPhilosophySection';
import { AboutStorySection } from './sections/AboutStorySection';
import { AboutCraftSection } from './sections/AboutCraftSection';
import { AboutValuesSection } from './sections/AboutValuesSection';
import { AboutCTASection } from './sections/AboutCTASection';

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
