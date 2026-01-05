'use client';

import { useState } from 'react';
import { ImagePlus, Trash2, Star } from 'lucide-react';
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
import { useAddProductImage } from '@/features/admin-product/add-image/lib/use-add-product-image';
import { useDeleteProductImage } from '@/features/admin-product/delete-image/lib/use-delete-product-image';
import type { MediaTabProps } from '../../model/types';

export function MediaTab({ productId, product }: MediaTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [isMain, setIsMain] = useState(false);

  const addImageMutation = useAddProductImage();
  const deleteImageMutation = useDeleteProductImage();

  const images = product.images;

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;

    addImageMutation.mutate(
      {
        productId,
        data: {
          url: newImageUrl.trim(),
          alt: newImageAlt.trim() || undefined,
          is_main: isMain,
          sort_order: images.length,
        },
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setNewImageUrl('');
          setNewImageAlt('');
          setIsMain(false);
        },
      },
    );
  };

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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>画像を追加</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='imageUrl'>画像URL</Label>
              <Input
                id='imageUrl'
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder='https://example.com/image.jpg'
              />
            </div>
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
              onClick={() => setDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              type='button'
              onClick={handleAddImage}
              disabled={addImageMutation.isPending || !newImageUrl.trim()}
            >
              {addImageMutation.isPending ? '追加中...' : '追加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
