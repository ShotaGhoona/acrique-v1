'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import { Switch } from '@/shared/ui/shadcn/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import {
  categories,
  getCategoryIds,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';
import type { BasicInfoTabProps } from '../../model/types';

export function BasicInfoTab({
  product,
  formData,
  onFormDataChange,
}: BasicInfoTabProps) {
  const categoryIds = getCategoryIds();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      {/* メインコンテンツ */}
      <div className='space-y-6 lg:col-span-2'>
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='name'>商品名（英語）</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='name_ja'>商品名（日本語）</Label>
                <Input
                  id='name_ja'
                  value={formData.name_ja}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, name_ja: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='tagline'>キャッチコピー</Label>
              <Input
                id='tagline'
                value={formData.tagline}
                onChange={(e) =>
                  onFormDataChange({ ...formData, tagline: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>商品説明（短）</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  onFormDataChange({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='long_description'>商品説明（詳細）</Label>
              <Textarea
                id='long_description'
                value={formData.long_description}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    long_description: e.target.value,
                  })
                }
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* 入稿設定 */}
        <Card>
          <CardHeader>
            <CardTitle>入稿設定</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label>入稿データ必要</Label>
                <p className='text-xs text-muted-foreground'>
                  お客様からデータ入稿が必要な商品
                </p>
              </div>
              <Switch
                checked={formData.requires_upload}
                onCheckedChange={(checked) =>
                  onFormDataChange({ ...formData, requires_upload: checked })
                }
              />
            </div>
            {formData.requires_upload && (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='upload_type'>入稿タイプ</Label>
                  <Select
                    value={formData.upload_type}
                    onValueChange={(value) =>
                      onFormDataChange({ ...formData, upload_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='選択してください' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='logo'>ロゴ</SelectItem>
                      <SelectItem value='qr'>QRコード</SelectItem>
                      <SelectItem value='photo'>写真</SelectItem>
                      <SelectItem value='text'>テキスト</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='upload_note'>入稿に関する注意事項</Label>
                  <Textarea
                    id='upload_note'
                    value={formData.upload_note}
                    onChange={(e) =>
                      onFormDataChange({
                        ...formData,
                        upload_note: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* サイドバー */}
      <div className='space-y-6'>
        {/* カテゴリ・おすすめ */}
        <Card>
          <CardHeader>
            <CardTitle>分類</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>カテゴリ</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  onFormDataChange({
                    ...formData,
                    category_id: value as CategoryId,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryIds.map((id) => (
                    <SelectItem key={id} value={id}>
                      {categories[id].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <Label>おすすめ商品</Label>
                <p className='text-xs text-muted-foreground'>
                  トップページに表示
                </p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  onFormDataChange({ ...formData, is_featured: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 価格設定 */}
        <Card>
          <CardHeader>
            <CardTitle>価格設定</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='base_price'>基本価格（税抜）</Label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                  ¥
                </span>
                <Input
                  id='base_price'
                  type='number'
                  value={formData.base_price}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, base_price: e.target.value })
                  }
                  className='pl-8'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='price_note'>価格備考</Label>
              <Input
                id='price_note'
                value={formData.price_note}
                onChange={(e) =>
                  onFormDataChange({ ...formData, price_note: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 納期 */}
        <Card>
          <CardHeader>
            <CardTitle>納期</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='lead_time_days'>納期日数</Label>
              <Input
                id='lead_time_days'
                type='number'
                value={formData.lead_time_days}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    lead_time_days: e.target.value,
                  })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lead_time_note'>納期備考</Label>
              <Input
                id='lead_time_note'
                value={formData.lead_time_note}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    lead_time_note: e.target.value,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 情報 */}
        <Card>
          <CardHeader>
            <CardTitle>情報</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>商品ID</span>
              <span className='font-mono'>{product.id}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>作成日</span>
              <span>{formatDate(product.created_at)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>更新日</span>
              <span>{formatDate(product.updated_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
