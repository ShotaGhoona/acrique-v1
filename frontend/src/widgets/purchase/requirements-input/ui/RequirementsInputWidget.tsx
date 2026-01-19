'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import { FileDropzone } from './components/FileDropzone';
import type { UploadInput } from '@/shared/domain/upload/model/types';

export interface InputValue {
  key: string;
  type: 'text' | 'url' | 'date' | 'file';
  value: string;
  fileId?: number;
  fileName?: string;
}

interface RequirementsInputWidgetProps {
  input: UploadInput;
  value?: InputValue;
  onValueChange: (value: string, fileId?: number, fileName?: string) => void;
  onFileUpload?: (file: File) => Promise<void>;
  onFileRemove?: (fileId: number) => void;
}

export function RequirementsInputWidget({
  input,
  value,
  onValueChange,
  onFileUpload,
  onFileRemove,
}: RequirementsInputWidgetProps) {
  const [error, setError] = useState<string | null>(null);

  switch (input.type) {
    case 'text':
      return (
        <div className='space-y-2'>
          <Label htmlFor={input.key}>
            {input.label}
            {input.required && <span className='ml-1 text-destructive'>*</span>}
          </Label>
          <Input
            id={input.key}
            type='text'
            value={value?.value ?? ''}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={'placeholder' in input ? input.placeholder : undefined}
            maxLength={'maxLength' in input ? input.maxLength : undefined}
          />
          {'maxLength' in input && input.maxLength && (
            <p className='text-xs text-muted-foreground'>
              {(value?.value ?? '').length}/{input.maxLength}文字
            </p>
          )}
        </div>
      );

    case 'url': {
      const isValidUrl =
        !value?.value ||
        value.value === '' ||
        /^https?:\/\/.+/.test(value.value);
      return (
        <div className='space-y-2'>
          <Label htmlFor={input.key}>
            {input.label}
            {input.required && <span className='ml-1 text-destructive'>*</span>}
          </Label>
          <Input
            id={input.key}
            type='url'
            value={value?.value ?? ''}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={
              'placeholder' in input ? input.placeholder : 'https://'
            }
            className={cn(!isValidUrl && 'border-destructive')}
          />
          {!isValidUrl && (
            <p className='text-xs text-destructive'>
              有効なURLを入力してください（https://で始まる）
            </p>
          )}
        </div>
      );
    }

    case 'date':
      return (
        <div className='space-y-2'>
          <Label htmlFor={input.key}>
            {input.label}
            {input.required && <span className='ml-1 text-destructive'>*</span>}
          </Label>
          <Input
            id={input.key}
            type='date'
            value={value?.value ?? ''}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </div>
      );

    case 'file': {
      const handleFile = async (file: File) => {
        if (!onFileUpload) return;
        setError(null);
        try {
          await onFileUpload(file);
        } catch {
          setError('アップロードに失敗しました');
        }
      };

      if (value?.fileId) {
        return (
          <div className='space-y-2'>
            <Label>
              {input.label}
              {input.required && (
                <span className='ml-1 text-destructive'>*</span>
              )}
            </Label>
            <div className='flex items-center justify-between rounded-sm border border-green-200 bg-green-50/50 px-4 py-3'>
              <div className='flex items-center gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600' />
                <div>
                  <p className='text-sm font-medium'>{value.fileName}</p>
                  <p className='text-xs text-muted-foreground'>
                    アップロード完了
                  </p>
                </div>
              </div>
              {onFileRemove && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onFileRemove(value.fileId!)}
                >
                  削除
                </Button>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className='space-y-2'>
          <Label>
            {input.label}
            {input.required && <span className='ml-1 text-destructive'>*</span>}
          </Label>
          <FileDropzone
            accept={input.accept.split(',').map((t) => t.trim())}
            maxSize={(input.maxSizeMB ?? 10) * 1024 * 1024}
            onUploadComplete={(upload) => {
              onValueChange(upload.file_url, upload.id, upload.file_name);
            }}
          />
          {input.note && (
            <p className='text-xs text-muted-foreground'>{input.note}</p>
          )}
          {error && <p className='text-xs text-destructive'>{error}</p>}
        </div>
      );
    }

    default:
      return null;
  }
}
