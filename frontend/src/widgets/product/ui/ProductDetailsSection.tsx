'use client';

import { Check } from 'lucide-react';
import type { ProductDetail } from '@/entities/product/model/product-data';

interface ProductDetailsSectionProps {
  product: ProductDetail;
}

export function ProductDetailsSection({ product }: ProductDetailsSectionProps) {
  return (
    <section className='py-20 lg:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='grid gap-16 lg:grid-cols-2 lg:gap-20'>
          {/* Left: Long Description */}
          <div>
            <h2 className='text-sm font-medium uppercase tracking-widest text-muted-foreground'>
              About this product
            </h2>
            <h3 className='mt-4 text-2xl font-light tracking-tight md:text-3xl'>
              製品について
            </h3>
            <div className='mt-8 space-y-4 leading-relaxed text-muted-foreground'>
              {product.longDescription
                .trim()
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>

            {/* Specs Table */}
            <div className='mt-12'>
              <h4 className='text-sm font-medium uppercase tracking-widest text-muted-foreground'>
                Specifications
              </h4>
              <dl className='mt-4 divide-y divide-border'>
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className='flex justify-between py-3 text-sm'
                  >
                    <dt className='text-muted-foreground'>{spec.label}</dt>
                    <dd className='font-medium'>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right: Features */}
          <div>
            <h2 className='text-sm font-medium uppercase tracking-widest text-muted-foreground'>
              Features
            </h2>
            <h3 className='mt-4 text-2xl font-light tracking-tight md:text-3xl'>
              特長
            </h3>
            <div className='mt-8 space-y-8'>
              {product.features.map((feature, index) => (
                <div key={index} className='flex gap-4'>
                  <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground'>
                    <Check className='h-4 w-4 text-background' />
                  </div>
                  <div>
                    <h4 className='font-medium'>{feature.title}</h4>
                    <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
