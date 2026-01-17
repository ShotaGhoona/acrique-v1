'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import {
  RequirementsInputWidget,
  type InputValue,
} from '@/widgets/purchase/requirements-input/ui/RequirementsInputWidget';
import type { UploadRequirements } from '@/shared/domain/upload/model/types';

interface ReUploadSlotCardProps {
  quantityIndex: number;
  itemQuantity: number;
  uploadRequirements: UploadRequirements;
  isRejected: boolean;
  adminNotes?: string | null;
  inputValues: Record<string, InputValue>;
  onValueChange: (
    key: string,
    value: string,
    fileId?: number,
    fileName?: string,
  ) => void;
  onFileUpload: (inputKey: string, file: File) => Promise<void>;
  onFileRemove: (inputKey: string, fileId: number) => void;
}

export function ReUploadSlotCard({
  quantityIndex,
  itemQuantity,
  uploadRequirements,
  isRejected,
  adminNotes,
  inputValues,
  onValueChange,
  onFileUpload,
  onFileRemove,
}: ReUploadSlotCardProps) {
  const inputs = uploadRequirements?.inputs ?? [];
  const hasInputs = inputs.length > 0;

  // すべての必須入力が完了しているか確認
  const isComplete = inputs.every((input) => {
    if (!input.required) return true;
    const value = inputValues[input.key];
    if (!value) return false;
    if (input.type === 'file') {
      return !!value.fileId;
    }
    return value.value && value.value.trim() !== '';
  });

  return (
    <div className='rounded-sm border border-border p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <p className='text-sm font-medium'>
          {itemQuantity > 1 ? `${quantityIndex}個目` : '入稿データ'}
        </p>
        {isComplete && (
          <Badge
            variant='outline'
            className='gap-1 border-green-600 text-green-600'
          >
            <CheckCircle className='h-3 w-3' />
            入力完了
          </Badge>
        )}
        {isRejected && !isComplete && (
          <Badge variant='destructive' className='gap-1'>
            <AlertCircle className='h-3 w-3' />
            差し戻し
          </Badge>
        )}
      </div>

      {/* 差し戻し理由 */}
      {isRejected && adminNotes && (
        <div className='mb-4 rounded-sm border border-destructive/30 bg-destructive/5 p-3'>
          <p className='text-xs font-medium text-destructive'>差し戻し理由:</p>
          <p className='mt-1 text-sm text-muted-foreground'>{adminNotes}</p>
        </div>
      )}

      {/* 入力フィールド */}
      {hasInputs && (
        <div className='space-y-4'>
          {inputs.map((input) => (
            <RequirementsInputWidget
              key={input.key}
              input={input}
              value={inputValues[input.key]}
              onValueChange={(value, fileId, fileName) =>
                onValueChange(input.key, value, fileId, fileName)
              }
              onFileUpload={(file) => onFileUpload(input.key, file)}
              onFileRemove={(fileId) => onFileRemove(input.key, fileId)}
            />
          ))}
        </div>
      )}

      {/* 入力がない場合のメッセージ */}
      {!hasInputs && (
        <p className='text-sm text-muted-foreground'>入稿データなし</p>
      )}
    </div>
  );
}
