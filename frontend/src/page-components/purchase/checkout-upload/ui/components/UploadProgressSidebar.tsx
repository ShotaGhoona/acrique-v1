'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import type {
  UploadSlot,
  UploadRequiredItem,
  InputValue,
  SlotKey,
} from '../../lib/types';
import { isSlotComplete } from '../../lib/upload-slot-utils';

interface UploadProgressItem {
  item: UploadRequiredItem;
  slots: UploadSlot[];
}

interface UploadProgressSidebarProps {
  groupedByItem: UploadProgressItem[];
  inputValues: Record<SlotKey, InputValue[]>;
  completedSlotCount: number;
  totalSlotCount: number;
  isAllComplete: boolean;
  isSubmitting: boolean;
  onProceed: () => void;
}

export function UploadProgressSidebar({
  groupedByItem,
  inputValues,
  completedSlotCount,
  totalSlotCount,
  isAllComplete,
  isSubmitting,
  onProceed,
}: UploadProgressSidebarProps) {
  return (
    <div className='lg:sticky lg:top-24 lg:self-start'>
      <div className='rounded-sm border border-border bg-background p-6'>
        <h3 className='font-medium'>入稿状況</h3>

        <div className='mt-4 space-y-3'>
          {groupedByItem.map(({ item, slots }) => {
            const completedCount = slots.filter((s) =>
              isSlotComplete(s, inputValues),
            ).length;
            const isComplete = completedCount === slots.length;

            return (
              <div
                key={item.id}
                className='flex items-center justify-between text-sm'
              >
                <span className='text-muted-foreground'>
                  {item.product_name_ja || item.product_name}
                </span>
                <span
                  className={isComplete ? 'text-green-600' : 'text-amber-600'}
                >
                  {completedCount}/{slots.length}
                </span>
              </div>
            );
          })}
        </div>

        <div className='mt-6 border-t border-border pt-6'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>入稿進捗</span>
            <span
              className={cn(
                'text-lg font-medium',
                isAllComplete ? 'text-green-600' : 'text-foreground',
              )}
            >
              {completedSlotCount}/{totalSlotCount}
            </span>
          </div>
          {!isAllComplete && (
            <p className='mt-2 text-xs text-amber-600'>
              すべての入稿を完了してください
            </p>
          )}
        </div>

        <div className='mt-6'>
          <Button
            onClick={onProceed}
            disabled={!isAllComplete || isSubmitting}
            className='w-full'
            size='lg'
          >
            {isSubmitting ? (
              '処理中...'
            ) : (
              <>
                注文内容を確認する
                <ArrowRight className='ml-2 h-4 w-4' />
              </>
            )}
          </Button>
        </div>

        {!isAllComplete && (
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            残り {totalSlotCount - completedSlotCount} 件の入稿が必要です
          </p>
        )}
      </div>
    </div>
  );
}
