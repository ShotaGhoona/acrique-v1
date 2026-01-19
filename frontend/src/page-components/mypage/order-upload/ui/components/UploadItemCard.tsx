'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import type { InputValue } from '@/widgets/purchase/requirements-input/ui/RequirementsInputWidget';
import type { UploadRequirements } from '@/shared/domain/upload/model/types';
import type { OrderItem } from '@/entities/checkout-domain/order/model/types';
import { ReUploadSlotCard } from './ReUploadSlotCard';

type SlotKey = `${number}-${number}`;

interface UploadItemCardProps {
  item: OrderItem;
  inputValues: Record<SlotKey, Record<string, InputValue>>;
  onValueChange: (
    slotKey: SlotKey,
    inputKey: string,
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

export function UploadItemCard({
  item,
  inputValues,
  onValueChange,
  onFileUpload,
  onFileRemove,
}: UploadItemCardProps) {
  const uploadRequirements = item.upload_requirements;
  const inputs = uploadRequirements?.inputs ?? [];

  // 全スロットの完了状態を確認
  const allSlotsComplete = Array.from(
    { length: item.quantity },
    (_, i) => i + 1,
  ).every((quantityIndex) => {
    const slotKey = `${item.id}-${quantityIndex}` as SlotKey;
    const slotValues = inputValues[slotKey] ?? {};
    return inputs.every((input) => {
      if (!input.required) return true;
      const value = slotValues[input.key];
      if (!value) return false;
      if (input.type === 'file') {
        return !!value.fileId;
      }
      return value.value && value.value.trim() !== '';
    });
  });

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle className='text-lg'>
              {item.product_name_ja || item.product_name}
            </CardTitle>
            <p className='mt-1 text-sm text-muted-foreground'>
              数量: {item.quantity}
            </p>
          </div>
          {allSlotsComplete && (
            <Badge
              variant='outline'
              className='gap-1 border-green-600 text-green-600'
            >
              <CheckCircle className='h-3 w-3' />
              入力完了
            </Badge>
          )}
          {!allSlotsComplete && (
            <Badge variant='destructive' className='gap-1'>
              <AlertCircle className='h-3 w-3' />
              再入稿が必要
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {Array.from({ length: item.quantity }, (_, i) => i + 1).map(
          (quantityIndex) => {
            const slotKey = `${item.id}-${quantityIndex}` as SlotKey;
            const slotValues = inputValues[slotKey] ?? {};

            return (
              <ReUploadSlotCard
                key={quantityIndex}
                quantityIndex={quantityIndex}
                itemQuantity={item.quantity}
                uploadRequirements={uploadRequirements}
                isRejected={true}
                inputValues={slotValues}
                onValueChange={(inputKey, value, fileId, fileName) =>
                  onValueChange(slotKey, inputKey, value, fileId, fileName)
                }
                onFileUpload={(inputKey, file) =>
                  onFileUpload(slotKey, inputKey, file)
                }
                onFileRemove={(inputKey, fileId) =>
                  onFileRemove(slotKey, inputKey, fileId)
                }
              />
            );
          },
        )}
      </CardContent>
    </Card>
  );
}
