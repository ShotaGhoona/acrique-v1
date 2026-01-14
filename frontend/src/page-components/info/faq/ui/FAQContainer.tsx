'use client';

import { useState } from 'react';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import { faqCategories } from '../config/faq-data';
import { FAQItem } from './FAQItem';

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('order');

  return (
    <main>
      {/* Hero */}
      <section className='bg-secondary/30 py-24 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            FAQ
          </p>
          <h1 className='mt-6 text-4xl font-light md:text-5xl'>
            よくあるご質問
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-muted-foreground'>
            お客様からよくいただくご質問をまとめました。
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className='py-24 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <div className='grid gap-12 lg:grid-cols-4 lg:gap-16'>
            {/* Category Navigation */}
            <nav className='lg:col-span-1'>
              <div className='sticky top-32 space-y-1'>
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'block w-full rounded-sm px-4 py-3 text-left text-sm transition-colors',
                      {
                        'bg-foreground text-background':
                          activeCategory === category.id,
                        'hover:bg-secondary/50': activeCategory !== category.id,
                      },
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </nav>

            {/* FAQ List */}
            <div className='lg:col-span-3'>
              {faqCategories.map((category) => (
                <div
                  key={category.id}
                  className={cn({ hidden: activeCategory !== category.id })}
                >
                  <h2 className='mb-8 text-2xl font-light'>{category.name}</h2>
                  <div>
                    {category.faqs.map((faq, index) => (
                      <FAQItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className='bg-secondary/30 py-24 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 text-center lg:px-12'>
          <h2 className='text-2xl font-light md:text-3xl'>
            お探しの回答が見つからない場合
          </h2>
          <p className='mx-auto mt-6 max-w-xl text-muted-foreground'>
            お気軽にお問い合わせください。営業日2日以内にご返答いたします。
          </p>
          <a
            href='/contact'
            className='mt-8 inline-flex items-center justify-center rounded-sm bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90'
          >
            お問い合わせ
          </a>
        </div>
      </section>
    </main>
  );
}
