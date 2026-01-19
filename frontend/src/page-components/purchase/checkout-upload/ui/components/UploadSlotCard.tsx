'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import type { UploadSlot, InputValue, SlotKey } from '../../lib/types';
import { isSlotComplete } from '../../lib/upload-slot-utils';
import { RequirementsInputWidget } from '@/widgets/purchase/requirements-input/ui/RequirementsInputWidget';

interface UploadSlotCardProps {
  slot: UploadSlot;
  itemQuantity: number;
  inputValues: Record<SlotKey, InputValue[]>;
  onValueChange: (
    slotKey: SlotKey,
    key: string,
    type: InputValue['type'],
    value: string,
    fileId?: number,
    fileName?: string,
  ) => void;
  onFileUpload: (
    slotKey: SlotKey,
    inputKey: string,
    file: File,
  ) => Promise<void>;
  onFileRemove: (slotKey: SlotKey, inputKey: string, fileId: number) => void;
}

export function UploadSlotCard({
  slot,
  itemQuantity,
  inputValues,
  onValueChange,
  onFileUpload,
  onFileRemove,
}: UploadSlotCardProps) {
  const slotIsComplete = isSlotComplete(slot, inputValues);
  const requirements = slot.uploadRequirements;

  return (
    <div
      className={cn(
        'rounded-sm border p-4',
        slotIsComplete ? 'border-green-200 bg-green-50/50' : 'border-border',
      )}
    >
      <div className='mb-4 flex items-center justify-between'>
        <span className='font-medium'>
          {itemQuantity > 1 ? `${slot.quantityIndex}個目` : '入稿データ'}
        </span>
        {slotIsComplete ? (
          <span className='flex items-center gap-1 text-sm text-green-600'>
            <CheckCircle2 className='h-4 w-4' />
            入力完了
          </span>
        ) : (
          <span className='flex items-center gap-1 text-sm text-muted-foreground'>
            <AlertCircle className='h-4 w-4' />
            未入力
          </span>
        )}
      </div>

      <div className='space-y-4'>
        {requirements?.inputs?.map((input) => (
          <RequirementsInputWidget
            key={input.key}
            input={input}
            value={inputValues[slot.slotKey]?.find((v) => v.key === input.key)}
            onValueChange={(value, fileId, fileName) =>
              onValueChange(
                slot.slotKey,
                input.key,
                input.type,
                value,
                fileId,
                fileName,
              )
            }
            onFileUpload={(file) => onFileUpload(slot.slotKey, input.key, file)}
            onFileRemove={(fileId) =>
              onFileRemove(slot.slotKey, input.key, fileId)
            }
          />
        ))}
      </div>
    </div>
  );
}
