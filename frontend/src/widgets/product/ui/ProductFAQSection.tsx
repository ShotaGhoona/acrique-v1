'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
// TODO: 後で消す - API接続時にAPIレスポンス型に置換
import type { ProductDetail } from '@/shared/dummy-data/products';

interface ProductFAQSectionProps {
  product: ProductDetail;
}

export function ProductFAQSection({ product }: ProductFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (product.faqs.length === 0) {
    return null;
  }

  return (
    <section className='py-20 lg:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='mx-auto max-w-3xl'>
          <div className='text-center'>
            <h2 className='text-sm font-medium uppercase tracking-widest text-muted-foreground'>
              FAQ
            </h2>
            <h3 className='mt-4 text-2xl font-light tracking-tight md:text-3xl'>
              よくあるご質問
            </h3>
            <p className='mt-4 text-muted-foreground'>
              {product.name}についてお寄せいただくご質問にお答えします
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className='mt-12 divide-y divide-border border-t border-border'>
            {product.faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className='flex w-full items-center justify-between py-6 text-left transition-colors hover:text-muted-foreground'
                >
                  <span className='pr-8 font-medium'>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ${
                    openIndex === index
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className='overflow-hidden'>
                    <p className='pb-6 leading-relaxed text-muted-foreground'>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className='mt-12 text-center'>
            <p className='text-sm text-muted-foreground'>
              その他のご質問がございましたら、お気軽にお問い合わせください
            </p>
            <a
              href='/contact'
              className='mt-4 inline-block text-sm font-medium underline underline-offset-4 transition-colors hover:text-muted-foreground'
            >
              お問い合わせはこちら
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
