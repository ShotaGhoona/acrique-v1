'use client';

import { SITE_INFO } from '@/shared/config/site-info';
import { privacySections } from '../config/privacy-data';

export function PrivacyPage() {
  return (
    <main>
      {/* Hero */}
      <section className='bg-secondary/30 py-24 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Privacy Policy
          </p>
          <h1 className='mt-6 text-4xl font-light md:text-5xl'>
            プライバシーポリシー
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-muted-foreground'>
            お客様の個人情報の取り扱いについて
          </p>
        </div>
      </section>

      {/* Content */}
      <section className='py-24 md:py-32'>
        <div className='mx-auto max-w-3xl px-6 lg:px-12'>
          <p className='mb-12 text-sm text-muted-foreground'>
            {SITE_INFO.company.name}
            （以下「当社」）は、お客様の個人情報を適切に取り扱うことが社会的責務であると考え、以下のとおりプライバシーポリシーを定めます。
          </p>

          <div className='space-y-12'>
            {privacySections.map((section, index) => (
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
