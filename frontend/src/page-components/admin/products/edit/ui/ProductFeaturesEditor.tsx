'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/shadcn/ui/dialog';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';
import { useUpdateProductFeatures } from '@/features/admin-product/update-features/lib/use-update-product-features';
import type { AdminProductFeature } from '@/entities/admin-product/model/types';

// フォーム用の型（新規追加時はidがnull）
interface FeatureFormItem {
  id: number | null;
  title: string;
  description: string;
  sort_order: number;
}

interface ProductFeaturesEditorProps {
  productId: string;
  features: AdminProductFeature[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductFeaturesEditor({
  productId,
  features: initialFeatures,
  open,
  onOpenChange,
}: ProductFeaturesEditorProps) {
  const [features, setFeatures] = useState<FeatureFormItem[]>(initialFeatures);

  const updateFeaturesMutation = useUpdateProductFeatures();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFeatures(initialFeatures);
    }
    onOpenChange(isOpen);
  };

  const addFeature = () => {
    setFeatures([
      ...features,
      {
        id: null,
        title: '',
        description: '',
        sort_order: features.length,
      },
    ]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, updates: Partial<FeatureFormItem>) => {
    setFeatures(
      features.map((feature, i) =>
        i === index ? { ...feature, ...updates } : feature,
      ),
    );
  };

  const handleSave = () => {
    const sortedFeatures = features.map((feature, i) => ({
      ...feature,
      sort_order: i,
    }));

    updateFeaturesMutation.mutate(
      { productId, data: { features: sortedFeatures } },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>商品の特長</DialogTitle>
        </DialogHeader>

        <div className='space-y-3 py-4'>
          {features.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              特長がありません
            </div>
          ) : (
            features.map((feature, index) => (
              <Card key={index}>
                <CardContent className='p-3'>
                  <div className='flex items-start gap-2'>
                    <GripVertical className='mt-2 h-4 w-4 flex-shrink-0 text-muted-foreground' />
                    <div className='flex-1 space-y-2'>
                      <Input
                        value={feature.title}
                        onChange={(e) =>
                          updateFeature(index, { title: e.target.value })
                        }
                        placeholder='特長タイトル（例: 高品質なアクリル素材）'
                      />
                      <Textarea
                        value={feature.description ?? ''}
                        onChange={(e) =>
                          updateFeature(index, { description: e.target.value })
                        }
                        placeholder='詳細説明（任意）'
                        rows={2}
                      />
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeFeature(index)}
                      className='mt-1 h-8 w-8 flex-shrink-0 text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          <Button
            type='button'
            variant='outline'
            onClick={addFeature}
            className='w-full'
          >
            <Plus className='mr-2 h-4 w-4' />
            特長を追加
          </Button>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          <Button
            type='button'
            onClick={handleSave}
            disabled={updateFeaturesMutation.isPending}
          >
            {updateFeaturesMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
