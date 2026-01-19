'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/ui/dialog';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { Switch } from '@/shared/ui/shadcn/ui/switch';
import { useCreateProductMaster } from '@/features/admin-domain/admin-product-master/create-product-master/lib/use-create-product-master';
import { useUpdateProductMaster } from '@/features/admin-domain/admin-product-master/update-product-master/lib/use-update-product-master';
import type { AdminProductMaster } from '@/entities/admin-domain/admin-product-master/model/types';
import { modelCategoryLabels } from '@/shared/domain/product/data/model-categories';
import type { ModelCategory } from '@/shared/domain/product/model/types';

interface MasterFormData {
  id: string;
  name: string;
  name_en: string;
  model_category: ModelCategory | '';
  tagline: string;
  description: string;
  base_lead_time_days: number | '';
  is_active: boolean;
  sort_order: number;
}

const initialFormData: MasterFormData = {
  id: '',
  name: '',
  name_en: '',
  model_category: '',
  tagline: '',
  description: '',
  base_lead_time_days: '',
  is_active: true,
  sort_order: 0,
};

interface MasterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  master?: AdminProductMaster | null;
}

export function MasterFormDialog({
  open,
  onOpenChange,
  master,
}: MasterFormDialogProps) {
  const isEditing = !!master;
  const createMutation = useCreateProductMaster();
  const updateMutation = useUpdateProductMaster();

  const [formData, setFormData] = useState<MasterFormData>(initialFormData);

  useEffect(() => {
    if (master) {
      setFormData({
        id: master.id,
        name: master.name,
        name_en: master.name_en ?? '',
        model_category: master.model_category ?? '',
        tagline: master.tagline ?? '',
        description: master.description ?? '',
        base_lead_time_days: master.base_lead_time_days ?? '',
        is_active: master.is_active,
        sort_order: master.sort_order,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [master, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && master) {
      updateMutation.mutate(
        {
          masterId: master.id,
          data: {
            name: formData.name,
            name_en: formData.name_en || undefined,
            model_category:
              (formData.model_category as ModelCategory) || undefined,
            tagline: formData.tagline || undefined,
            description: formData.description || undefined,
            base_lead_time_days:
              formData.base_lead_time_days !== ''
                ? Number(formData.base_lead_time_days)
                : undefined,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          id: formData.id,
          name: formData.name,
          name_en: formData.name_en || undefined,
          model_category:
            (formData.model_category as ModelCategory) || undefined,
          tagline: formData.tagline || undefined,
          description: formData.description || undefined,
          base_lead_time_days:
            formData.base_lead_time_days !== ''
              ? Number(formData.base_lead_time_days)
              : undefined,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? '商品マスタを編集' : '商品マスタを追加'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? '商品マスタ情報を編集します。'
              : '新しい商品マスタ（形状テンプレート）を追加します。'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='id'>ID（英数字・ハイフン）</Label>
              <Input
                id='id'
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                placeholder='canvas'
                disabled={isEditing}
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>日本語名</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='キャンバス'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='name_en'>英語名</Label>
                <Input
                  id='name_en'
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, name_en: e.target.value })
                  }
                  placeholder='The Canvas'
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='model_category'>モデルカテゴリ</Label>
                <Select
                  value={formData.model_category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      model_category: value as ModelCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='選択してください' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(modelCategoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='base_lead_time_days'>基準納期（日数）</Label>
                <Input
                  id='base_lead_time_days'
                  type='number'
                  value={formData.base_lead_time_days}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      base_lead_time_days:
                        e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  placeholder='7'
                  min={1}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='tagline'>キャッチコピー</Label>
              <Input
                id='tagline'
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder='迷ったらこれ。最も美しい比率のアクリルアート。'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>説明</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='A2〜A5の定型規格サイズで展開する...'
                rows={3}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='sort_order'>並び順</Label>
                <Input
                  id='sort_order'
                  type='number'
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: Number(e.target.value),
                    })
                  }
                  min={0}
                />
              </div>
              <div className='flex items-end justify-between pb-2'>
                <Label htmlFor='is_active'>有効</Label>
                <Switch
                  id='is_active'
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? '保存中...' : isEditing ? '更新' : '追加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
