'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/ui/shadcn/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border-b border-border'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between py-5 text-left'
      >
        <span className='pr-8 font-medium'>{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-muted-foreground transition-transform',
            {
              'rotate-180': isOpen,
            },
          )}
        />
      </button>
      <div
        className={cn('grid transition-all duration-300', {
          'grid-rows-[1fr]': isOpen,
          'grid-rows-[0fr]': !isOpen,
        })}
      >
        <div className='overflow-hidden'>
          <p className='pb-5 text-sm leading-relaxed text-muted-foreground'>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
