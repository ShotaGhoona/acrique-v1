'use client';

import { useState, useRef, useCallback } from 'react';
import { ImagePlus, Trash2, Star, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/shadcn/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Progress } from '@/shared/ui/shadcn/ui/progress';
import { useUploadProductImage } from '@/features/admin-product/upload-image/lib/use-upload-product-image';
import { useUpdateProductImage } from '@/features/admin-product/update-image/lib/use-update-product-image';
import { useDeleteProductImage } from '@/features/admin-product/delete-image/lib/use-delete-product-image';
import type { MediaTabProps } from '../../model/types';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function MediaTab({ productId, product }: MediaTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newImageAlt, setNewImageAlt] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageMutation = useUploadProductImage({
    onProgress: (progress) => setUploadProgress(progress.percentage),
  });
  const updateImageMutation = useUpdateProductImage();
  const deleteImageMutation = useDeleteProductImage();

  const images = product.images;

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'JPEG、PNG、WebP、GIF形式のみアップロードできます';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'ファイルサイズは10MB以下にしてください';
    }
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadImageMutation.mutate(
      {
        productId,
        file: selectedFile,
        alt: newImageAlt.trim() || undefined,
        is_main: isMain,
        sort_order: images.length,
      },
      {
        onSuccess: () => {
          closeDialog();
        },
        onError: (error) => {
          setError(
            error instanceof Error
              ? error.message
              : 'アップロードに失敗しました',
          );
        },
      },
    );
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setNewImageAlt('');
    setIsMain(false);
    setUploadProgress(0);
    setError(null);
  };

  const handleDeleteImage = (imageId: number) => {
    if (confirm('この画像を削除しますか？')) {
      deleteImageMutation.mutate({ productId, imageId });
    }
  };

  const handleSetMain = (imageId: number) => {
    updateImageMutation.mutate({
      productId,
      imageId,
      data: { is_main: true },
    });
  };

  return (
    <>
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
                {image.s3_url ? (
                  <img
                    src={image.s3_url}
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
                      disabled={updateImageMutation.isPending}
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
            <button
              type='button'
              className='flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50'
              onClick={() => setDialogOpen(true)}
            >
              <ImagePlus className='h-8 w-8' />
              <span className='mt-2 text-xs'>画像を追加</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>画像をアップロード</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {!selectedFile ? (
              <div
                className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className='h-10 w-10 text-muted-foreground' />
                <p className='mt-2 text-sm text-muted-foreground'>
                  ドラッグ&ドロップ または クリックして選択
                </p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  JPEG, PNG, WebP, GIF (最大10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={ALLOWED_TYPES.join(',')}
                  onChange={handleFileInputChange}
                  className='hidden'
                />
              </div>
            ) : (
              <div className='relative'>
                <div className='relative aspect-video overflow-hidden rounded-lg bg-muted'>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt='プレビュー'
                      className='h-full w-full object-contain'
                    />
                  )}
                </div>
                <Button
                  type='button'
                  size='icon'
                  variant='secondary'
                  className='absolute right-2 top-2 h-8 w-8'
                  onClick={() => {
                    setSelectedFile(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(null);
                  }}
                >
                  <X className='h-4 w-4' />
                </Button>
                <p className='mt-2 truncate text-sm text-muted-foreground'>
                  {selectedFile.name}
                </p>
              </div>
            )}

            {error && <p className='text-sm text-destructive'>{error}</p>}

            {uploadImageMutation.isPending && (
              <div className='space-y-2'>
                <Progress value={uploadProgress} />
                <p className='text-center text-sm text-muted-foreground'>
                  アップロード中... {uploadProgress}%
                </p>
              </div>
            )}

            <div className='grid gap-2'>
              <Label htmlFor='imageAlt'>代替テキスト（任意）</Label>
              <Input
                id='imageAlt'
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                placeholder='商品画像の説明'
              />
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='isMain'
                checked={isMain}
                onChange={(e) => setIsMain(e.target.checked)}
                className='h-4 w-4'
              />
              <Label htmlFor='isMain'>メイン画像として設定</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={closeDialog}
              disabled={uploadImageMutation.isPending}
            >
              キャンセル
            </Button>
            <Button
              type='button'
              onClick={handleUpload}
              disabled={uploadImageMutation.isPending || !selectedFile}
            >
              {uploadImageMutation.isPending
                ? 'アップロード中...'
                : 'アップロード'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
