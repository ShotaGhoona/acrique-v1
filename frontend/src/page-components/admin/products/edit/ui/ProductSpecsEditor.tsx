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
import { useUpdateProductSpecs } from '@/features/admin-product/update-specs/lib/use-update-product-specs';
import type { AdminProductSpec } from '@/entities/admin-product/model/types';

// フォーム用の型（新規追加時はidがnull）
interface SpecFormItem {
  id: number | null;
  label: string;
  value: string;
  sort_order: number;
}

interface ProductSpecsEditorProps {
  productId: string;
  specs: AdminProductSpec[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductSpecsEditor({
  productId,
  specs: initialSpecs,
  open,
  onOpenChange,
}: ProductSpecsEditorProps) {
  const [specs, setSpecs] = useState<SpecFormItem[]>(initialSpecs);

  const updateSpecsMutation = useUpdateProductSpecs();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSpecs(initialSpecs);
    }
    onOpenChange(isOpen);
  };

  const addSpec = () => {
    setSpecs([
      ...specs,
      {
        id: null,
        label: '',
        value: '',
        sort_order: specs.length,
      },
    ]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, updates: Partial<SpecFormItem>) => {
    setSpecs(
      specs.map((spec, i) => (i === index ? { ...spec, ...updates } : spec)),
    );
  };

  const handleSave = () => {
    const sortedSpecs = specs.map((spec, i) => ({
      ...spec,
      sort_order: i,
    }));

    updateSpecsMutation.mutate(
      { productId, data: { specs: sortedSpecs } },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>仕様・スペック</DialogTitle>
        </DialogHeader>

        <div className='space-y-2 py-4'>
          <div className='grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground'>
            <div className='w-6'></div>
            <div>項目名</div>
            <div>値</div>
            <div className='w-8'></div>
          </div>

          {specs.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              スペックがありません
            </div>
          ) : (
            specs.map((spec, index) => (
              <div
                key={index}
                className='grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2'
              >
                <GripVertical className='h-4 w-4 text-muted-foreground' />
                <Input
                  value={spec.label}
                  onChange={(e) => updateSpec(index, { label: e.target.value })}
                  placeholder='例: サイズ'
                />
                <Input
                  value={spec.value}
                  onChange={(e) => updateSpec(index, { value: e.target.value })}
                  placeholder='例: 50mm × 50mm × 50mm'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => removeSpec(index)}
                  className='h-8 w-8 text-destructive'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))
          )}

          <Button
            type='button'
            variant='outline'
            onClick={addSpec}
            className='w-full'
          >
            <Plus className='mr-2 h-4 w-4' />
            スペックを追加
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
            disabled={updateSpecsMutation.isPending}
          >
            {updateSpecsMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
