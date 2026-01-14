'use client';

import { termsSections } from '../config/terms-data';

export function TermsPage() {
  return (
    <main>
      {/* Hero */}
      <section className='bg-secondary/30 py-24 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Terms of Service
          </p>
          <h1 className='mt-6 text-4xl font-light md:text-5xl'>利用規約</h1>
          <p className='mt-6 max-w-2xl text-lg text-muted-foreground'>
            本サービスのご利用にあたっての規約
          </p>
        </div>
      </section>

      {/* Content */}
      <section className='py-24 md:py-32'>
        <div className='mx-auto max-w-3xl px-6 lg:px-12'>
          <div className='space-y-10'>
            {termsSections.map((section, index) => (
              <div key={index}>
                <h2 className='text-lg font-medium'>{section.title}</h2>
                <div className='mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div className='mt-16 border-t border-border pt-8'>
            <p className='text-sm text-muted-foreground'>
              制定日: 2024年1月1日
              <br />
              最終改定日: 2024年6月1日
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
