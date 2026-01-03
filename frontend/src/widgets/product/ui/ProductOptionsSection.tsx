'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import type { ProductDetail } from '@/entities/product';

// 価格差分フォーマット
function formatPriceDiff(priceDiff: number): string {
  if (priceDiff === 0) return '';
  const sign = priceDiff > 0 ? '+' : '';
  return `${sign}¥${priceDiff.toLocaleString()}`;
}

interface ProductOptionsSectionProps {
  product: ProductDetail;
}

export function ProductOptionsSection({ product }: ProductOptionsSectionProps) {
  // 各オプションの選択状態を管理
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >(() => {
    const initial: Record<number, number> = {};
    product.options.forEach((option) => {
      if (option.values.length > 0) {
        initial[option.id] = option.values[0].id;
      }
    });
    return initial;
  });

  const handleOptionChange = (optionId: number, valueId: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));
  };

  return (
    <section className='bg-secondary/30 py-20 lg:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='mx-auto max-w-3xl'>
          <h2 className='text-sm font-medium uppercase tracking-widest text-muted-foreground'>
            Customize
          </h2>
          <h3 className='mt-4 text-2xl font-light tracking-tight md:text-3xl'>
            オプションを選択
          </h3>
          <p className='mt-4 text-muted-foreground'>
            ご希望に合わせてカスタマイズいただけます
          </p>

          {/* Options */}
          <div className='mt-12 space-y-10'>
            {product.options.map((option) => (
              <div key={option.id}>
                <h4 className='mb-4 text-sm font-medium uppercase tracking-wider'>
                  {option.name}
                </h4>
                <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                  {option.values.map((value) => {
                    const isSelected = selectedOptions[option.id] === value.id;
                    return (
                      <button
                        key={value.id}
                        onClick={() => handleOptionChange(option.id, value.id)}
                        className={`relative rounded-sm border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-foreground bg-background ring-1 ring-foreground'
                            : 'border-border bg-background/50 hover:border-foreground/50'
                        }`}
                      >
                        <div className='flex items-start justify-between'>
                          <span className='font-medium'>{value.label}</span>
                          {value.price_diff !== 0 && (
                            <span className='text-sm text-muted-foreground'>
                              {formatPriceDiff(value.price_diff)}
                            </span>
                          )}
                        </div>
                        {value.description && (
                          <p className='mt-1 text-xs text-muted-foreground'>
                            {value.description}
                          </p>
                        )}
                        {/* Selected indicator */}
                        {isSelected && (
                          <div className='absolute right-2 top-2 h-2 w-2 rounded-full bg-foreground' />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary & CTA */}
          <div className='mt-16 rounded-sm border border-border bg-background p-6'>
            <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>選択中の構成</p>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {product.options.map((option) => {
                    const selectedValue = option.values.find(
                      (v) => v.id === selectedOptions[option.id],
                    );
                    return (
                      <span
                        key={option.id}
                        className='inline-block rounded-sm bg-secondary px-2 py-1 text-xs'
                      >
                        {option.name}: {selectedValue?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className='flex gap-3'>
                <Button variant='outline'>お問い合わせ</Button>
                <Button>お見積もり</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
