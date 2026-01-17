'use client';

import { useState, useCallback } from 'react';
import {
  Upload,
  X,
  FileImage,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { useUploadFile } from '@/features/checkout-domain/upload/upload-file/lib/use-upload-file';
import type { Upload as UploadEntity } from '@/entities/checkout-domain/upload/model/types';
import {
  DEFAULT_ACCEPTED_TYPES,
  formatFileSize,
  validateFile,
  getAcceptString,
} from '../../lib/file-utils';

interface UploadedFile {
  id: number;
  file_name: string;
  file_url: string;
  status?: string;
}

interface FileDropzoneProps {
  accept?: string[];
  maxSize?: number;
  onUploadComplete?: (upload: UploadEntity) => void;
  onFileRemove?: (uploadId: number) => void;
  uploadedFiles?: UploadedFile[];
  label?: string;
  description?: string;
  className?: string;
}

export function FileDropzone({
  accept = DEFAULT_ACCEPTED_TYPES,
  maxSize = 10 * 1024 * 1024,
  onUploadComplete,
  onFileRemove,
  uploadedFiles = [],
  label,
  description,
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: uploadFile, isPending } = useUploadFile();

  const handleValidateFile = useCallback(
    (file: File): string | null => {
      return validateFile(file, accept, maxSize);
    },
    [accept, maxSize],
  );

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = handleValidateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);

      try {
        const result = await uploadFile({ file });
        onUploadComplete?.(result.upload as unknown as UploadEntity);
      } catch {
        setError('アップロードに失敗しました。もう一度お試しください。');
      }
    },
    [handleValidateFile, uploadFile, onUploadComplete],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) {
        handleFile(files[0]);
      }
      e.target.value = '';
    },
    [handleFile],
  );

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <div>
          <p className='text-sm font-medium'>{label}</p>
          {description && (
            <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
          )}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed transition-colors',
          isDragging
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-foreground/30',
          isPending && 'pointer-events-none opacity-50',
        )}
      >
        <input
          type='file'
          accept={getAcceptString(accept)}
          onChange={handleInputChange}
          className='absolute inset-0 cursor-pointer opacity-0'
          disabled={isPending}
        />

        {isPending ? (
          <div className='flex flex-col items-center gap-3'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>アップロード中...</p>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-3 p-6 text-center'>
            <div className='rounded-full bg-secondary p-3'>
              <Upload className='h-6 w-6 text-muted-foreground' />
            </div>
            <div>
              <p className='text-sm font-medium'>
                ファイルをドラッグ＆ドロップ
              </p>
              <p className='mt-1 text-xs text-muted-foreground'>
                または<span className='text-accent'>クリックして選択</span>
              </p>
            </div>
            <p className='text-xs text-muted-foreground'>
              最大{formatFileSize(maxSize)}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className='flex items-center gap-2 text-sm text-destructive'>
          <AlertCircle className='h-4 w-4' />
          <span>{error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            アップロード済み
          </p>
          <div className='space-y-2'>
            {uploadedFiles.map((file) => {
              const isRejected = file.status === 'rejected';
              return (
                <div
                  key={file.id}
                  className={cn(
                    'flex items-center justify-between rounded-sm border px-4 py-3',
                    isRejected
                      ? 'border-destructive bg-destructive/10'
                      : 'border-border bg-secondary/30',
                  )}
                >
                  <div className='flex items-center gap-3'>
                    {isRejected ? (
                      <AlertCircle className='h-5 w-5 text-destructive' />
                    ) : file.file_url?.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                      <FileImage className='h-5 w-5 text-muted-foreground' />
                    ) : (
                      <FileText className='h-5 w-5 text-muted-foreground' />
                    )}
                    <div>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isRejected && 'text-destructive',
                        )}
                      >
                        {file.file_name}
                        {isRejected && (
                          <span className='ml-2 rounded bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground'>
                            差し戻し
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {onFileRemove && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => onFileRemove(file.id)}
                    >
                      <X className='h-4 w-4' />
                      <span className='sr-only'>削除</span>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
