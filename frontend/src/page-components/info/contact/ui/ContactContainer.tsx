'use client';

import { ContactHeroSection } from './sections/ContactHeroSection';
import { ContactFormSection } from './sections/ContactFormSection';
import { ContactInfoSection } from './sections/ContactInfoSection';

export function ContactPage() {
  return (
    <main>
      <ContactHeroSection />
      <ContactFormSection />
      <ContactInfoSection />
    </main>
  );
}
