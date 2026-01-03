'use client';

import { ContactHeroSection } from '@/widgets/contact/ui/ContactHeroSection';
import { ContactFormSection } from '@/widgets/contact/ui/ContactFormSection';
import { ContactInfoSection } from '@/widgets/contact/ui/ContactInfoSection';

export function ContactPage() {
  return (
    <main>
      <ContactHeroSection />
      <ContactFormSection />
      <ContactInfoSection />
    </main>
  );
}
