'use client';

import { useState, useRef, useCallback } from 'react';
import { ImagePlus, Trash2, Star, Upload, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { useUploadProductImage } from '@/features/admin-product/upload-image/lib/use-upload-product-image';
import { useDeleteProductImage } from '@/features/admin-product/delete-image/lib/use-delete-product-image';
import { useAddProductImage } from '@/features/admin-product/add-image/lib/use-add-product-image';
import type { MediaTabProps } from '../../model/types';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function MediaTab({ productId, product }: MediaTabProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageMutation = useUploadProductImage();
  const deleteImageMutation = useDeleteProductImage();
  const addImageMutation = useAddProductImage();

  const images = product.images;

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'JPEG、PNG、WebP、GIF形式の画像のみアップロードできます';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'ファイルサイズは10MB以下にしてください';
    }
    return null;
  };

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      setUploadError(null);
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          setUploadError(error);
          continue;
        }

        try {
          await uploadImageMutation.mutateAsync({
            productId,
            file,
            isMain: images.length === 0,
            sortOrder: images.length,
          });
        } catch {
          setUploadError('画像のアップロードに失敗しました');
        }
      }
    },
    [productId, images.length, uploadImageMutation],
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
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleUpload(files);
      }
    },
    [handleUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleUpload(files);
      }
      // リセットして同じファイルを再選択可能にする
      e.target.value = '';
    },
    [handleUpload],
  );

  const handleDeleteImage = (imageId: number) => {
    if (confirm('この画像を削除しますか？')) {
      deleteImageMutation.mutate({ productId, imageId });
    }
  };

  const handleSetMain = (imageId: number) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    addImageMutation.mutate({
      productId,
      data: {
        url: image.url,
        alt: image.alt || undefined,
        is_main: true,
        sort_order: image.sort_order,
      },
    });
  };

  const isUploading = uploadImageMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>商品画像</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5'>
          {images.map((image) => (
            <div
              key={image.id}
              className='group relative aspect-square overflow-hidden rounded-lg bg-muted'
            >
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.alt ?? '商品画像'}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full items-center justify-center text-xs text-muted-foreground'>
                  {image.alt ?? 'Image'}
                </div>
              )}
              {image.is_main && (
                <span className='absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground'>
                  メイン
                </span>
              )}
              <div className='absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                {!image.is_main && (
                  <Button
                    type='button'
                    size='icon'
                    variant='secondary'
                    className='h-8 w-8'
                    onClick={() => handleSetMain(image.id)}
                    title='メイン画像に設定'
                  >
                    <Star className='h-4 w-4' />
                  </Button>
                )}
                <Button
                  type='button'
                  size='icon'
                  variant='destructive'
                  className='h-8 w-8'
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={deleteImageMutation.isPending}
                  title='削除'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}

          {/* アップロードエリア */}
          <div
            className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              multiple
              className='hidden'
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            {isUploading ? (
              <>
                <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                <span className='mt-2 text-xs text-muted-foreground'>
                  アップロード中...
                </span>
              </>
            ) : (
              <>
                {isDragging ? (
                  <Upload className='h-8 w-8 text-primary' />
                ) : (
                  <ImagePlus className='h-8 w-8 text-muted-foreground' />
                )}
                <span className='mt-2 text-center text-xs text-muted-foreground'>
                  {isDragging ? 'ドロップして追加' : 'クリックまたはドラッグ'}
                </span>
              </>
            )}
          </div>
        </div>

        {uploadError && (
          <p className='mt-4 text-sm text-destructive'>{uploadError}</p>
        )}

        <p className='mt-4 text-xs text-muted-foreground'>
          JPEG、PNG、WebP、GIF形式 / 最大10MB
        </p>
      </CardContent>
    </Card>
  );
}
