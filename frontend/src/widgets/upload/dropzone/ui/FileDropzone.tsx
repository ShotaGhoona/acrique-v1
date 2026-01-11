'use client';

import { useState, useCallback } from 'react';
import { Upload, X, FileImage, FileText, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { useUploadFile } from '@/features/upload/upload-file/lib/use-upload-file';
import type { Upload as UploadEntity } from '@/entities/upload/model/types';
import {
  type UploadType,
  getUploadTypeLabelDetail,
} from '@/shared/domain/upload/model/types';

interface UploadedFile {
  id: number;
  file_name: string;
  file_url: string;
  upload_type: string | null;
}

interface FileDropzoneProps {
  uploadType: UploadType;
  accept?: string;
  maxSize?: number;
  onUploadComplete?: (upload: UploadEntity) => void;
  onFileRemove?: (uploadId: number) => void;
  uploadedFiles?: UploadedFile[];
  label?: string;
  description?: string;
  className?: string;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];
const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'application/postscript', 'image/svg+xml'];

function getAcceptedTypes(uploadType: UploadType): string[] {
  switch (uploadType) {
    case 'logo':
      return [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES];
    case 'qr':
      return ACCEPTED_IMAGE_TYPES;
    case 'photo':
      return ACCEPTED_IMAGE_TYPES;
    default:
      return [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES];
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDropzone({
  uploadType,
  accept,
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

  const acceptedTypes = accept ? accept.split(',').map((t) => t.trim()) : getAcceptedTypes(uploadType);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.some((type) => file.type === type || file.name.endsWith(type.replace('*', '')))) {
        return '対応していないファイル形式です';
      }
      if (file.size > maxSize) {
        return `ファイルサイズは${formatFileSize(maxSize)}以下にしてください`;
      }
      return null;
    },
    [acceptedTypes, maxSize],
  );

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);

      try {
        const result = await uploadFile({ file, uploadType });
        onUploadComplete?.(result.upload as unknown as UploadEntity);
      } catch {
        setError('アップロードに失敗しました。もう一度お試しください。');
      }
    },
    [validateFile, uploadFile, uploadType, onUploadComplete],
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

  const getAcceptString = (): string => {
    return acceptedTypes.join(',');
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label */}
      {label && (
        <div>
          <p className='text-sm font-medium'>{label}</p>
          {description && <p className='mt-1 text-xs text-muted-foreground'>{description}</p>}
        </div>
      )}

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed transition-colors',
          isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground/30',
          isPending && 'pointer-events-none opacity-50',
        )}
      >
        <input
          type='file'
          accept={getAcceptString()}
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
                {getUploadTypeLabelDetail(uploadType)}をドラッグ＆ドロップ
              </p>
              <p className='mt-1 text-xs text-muted-foreground'>
                または<span className='text-accent'>クリックして選択</span>
              </p>
            </div>
            <p className='text-xs text-muted-foreground'>
              最大{formatFileSize(maxSize)} / {uploadType === 'photo' ? 'JPG, PNG' : 'AI, EPS, PDF, SVG, PNG'}
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className='flex items-center gap-2 text-sm text-destructive'>
          <AlertCircle className='h-4 w-4' />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            アップロード済み
          </p>
          <div className='space-y-2'>
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className='flex items-center justify-between rounded-sm border border-border bg-secondary/30 px-4 py-3'
              >
                <div className='flex items-center gap-3'>
                  {file.file_url?.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                    <FileImage className='h-5 w-5 text-muted-foreground' />
                  ) : (
                    <FileText className='h-5 w-5 text-muted-foreground' />
                  )}
                  <div>
                    <p className='text-sm font-medium'>{file.file_name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {file.upload_type && getUploadTypeLabelDetail(file.upload_type as UploadType)}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
