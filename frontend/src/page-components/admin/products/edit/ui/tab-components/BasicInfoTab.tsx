'use client';

import {
  FileText,
  Tag,
  DollarSign,
  Clock,
  Upload,
  Info,
  Save,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
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
import { useUpdateProduct } from '@/features/admin-domain/admin-product/update-product/lib/use-update-product';
import type { CategoryId } from '@/shared/domain/category/model/types';
import type { BasicInfoTabProps } from '../../model/types';

export function BasicInfoTab({
  productId,
  product,
  formData,
  onFormDataChange,
}: BasicInfoTabProps) {
  const categoryIds = getCategoryIds();
  const updateProductMutation = useUpdateProduct();

  const handleSave = () => {
    if (!formData.category_id) return;

    updateProductMutation.mutate(
      {
        productId,
        data: {
          name: formData.name,
          name_ja: formData.name_ja,
          category_id: formData.category_id,
          tagline: formData.tagline || undefined,
          description: formData.description || undefined,
          long_description: formData.long_description || undefined,
          base_price: parseInt(formData.base_price, 10),
          price_note: formData.price_note || undefined,
          lead_time_days: formData.lead_time_days
            ? parseInt(formData.lead_time_days, 10)
            : undefined,
          lead_time_note: formData.lead_time_note || undefined,
          is_featured: formData.is_featured,
          master_id: formData.master_id || undefined,
          production_type: formData.production_type,
          upload_requirements: formData.upload_requirements,
        },
      },
      {
        onSuccess: () => {
          alert('基本情報を保存しました');
        },
      },
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div className='space-y-6'>
      {/* 保存ボタン */}
      <div className='flex justify-end'>
        <Button onClick={handleSave} disabled={updateProductMutation.isPending}>
          <Save className='mr-2 h-4 w-4' />
          {updateProductMutation.isPending ? '保存中...' : '基本情報を保存'}
        </Button>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* 左カラム */}
        <div className='space-y-6'>
          {/* 基本情報 */}
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <FileText className='h-5 w-5 text-muted-foreground' />
                <CardTitle className='text-base'>商品情報</CardTitle>
              </div>
              <CardDescription>商品名や説明文を設定します</CardDescription>
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
                    placeholder='Acrylic Keychain'
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
                    placeholder='アクリルキーホルダー'
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
                  placeholder='高品質なオリジナルアクリルグッズ'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>商品説明（短）</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder='一覧ページなどに表示される短い説明文'
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
                  placeholder='商品詳細ページに表示される詳しい説明文'
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* 製作設定 */}
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Upload className='h-5 w-5 text-muted-foreground' />
                <CardTitle className='text-base'>製作設定</CardTitle>
              </div>
              <CardDescription>製作タイプと入稿要件の設定</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='master_id'>プロダクトマスターID</Label>
                <Input
                  id='master_id'
                  value={formData.master_id}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, master_id: e.target.value })
                  }
                  placeholder='cube, canvas, plate など'
                />
                <p className='text-xs text-muted-foreground'>
                  製造テンプレートの識別子
                </p>
              </div>
              <div className='space-y-2'>
                <Label>製作タイプ</Label>
                <Select
                  value={formData.production_type}
                  onValueChange={(value: 'standard' | 'template' | 'custom') =>
                    onFormDataChange({ ...formData, production_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='選択してください' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='standard'>
                      スタンダード（入稿不要）
                    </SelectItem>
                    <SelectItem value='template'>
                      テンプレート（URL/テキスト入力）
                    </SelectItem>
                    <SelectItem value='custom'>
                      カスタム（画像入稿必要）
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.production_type !== 'standard' && (
                <div className='space-y-4 rounded-lg border p-4'>
                  <div className='space-y-2'>
                    <Label>入稿要件（JSON）</Label>
                    <Textarea
                      value={
                        formData.upload_requirements
                          ? JSON.stringify(
                              formData.upload_requirements,
                              null,
                              2,
                            )
                          : ''
                      }
                      onChange={(e) => {
                        try {
                          const parsed = e.target.value
                            ? JSON.parse(e.target.value)
                            : null;
                          onFormDataChange({
                            ...formData,
                            upload_requirements: parsed,
                          });
                        } catch {
                          // JSON parse error - ignore
                        }
                      }}
                      placeholder='{"inputs": [{"key": "qr_url", "type": "url", "label": "QRコードURL", "required": true}]}'
                      rows={6}
                      className='font-mono text-sm'
                    />
                    <p className='text-xs text-muted-foreground'>
                      有効なJSON形式で入力してください
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右カラム */}
        <div className='space-y-6'>
          {/* 分類 */}
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Tag className='h-5 w-5 text-muted-foreground' />
                <CardTitle className='text-base'>分類</CardTitle>
              </div>
              <CardDescription>カテゴリと表示設定</CardDescription>
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
                    <SelectValue placeholder='カテゴリを選択' />
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
              <div className='flex items-center justify-between rounded-lg border bg-muted/30 p-3'>
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
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <DollarSign className='h-5 w-5 text-muted-foreground' />
                <CardTitle className='text-base'>価格設定</CardTitle>
              </div>
              <CardDescription>基本価格と価格に関する備考</CardDescription>
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
                      onFormDataChange({
                        ...formData,
                        base_price: e.target.value,
                      })
                    }
                    className='pl-8'
                    placeholder='1000'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price_note'>価格備考</Label>
                <Input
                  id='price_note'
                  value={formData.price_note}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      price_note: e.target.value,
                    })
                  }
                  placeholder='100個以上で割引あり'
                />
              </div>
            </CardContent>
          </Card>

          {/* 納期 */}
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-muted-foreground' />
                <CardTitle className='text-base'>納期</CardTitle>
              </div>
              <CardDescription>標準納期と納期に関する備考</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='lead_time_days'>納期日数</Label>
                <div className='flex items-center gap-2'>
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
                    placeholder='5'
                    className='w-24'
                  />
                  <span className='text-sm text-muted-foreground'>営業日</span>
                </div>
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
                  placeholder='お急ぎの場合はご相談ください'
                />
              </div>
            </CardContent>
          </Card>

          {/* 情報 */}
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='h-5 w-5 text-muted-foreground' />
                <CardTitle className='text-base'>商品情報</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between rounded-md bg-muted/30 px-3 py-2'>
                  <span className='text-muted-foreground'>商品ID</span>
                  <span className='font-mono text-xs'>{product.id}</span>
                </div>
                <div className='flex justify-between rounded-md bg-muted/30 px-3 py-2'>
                  <span className='text-muted-foreground'>作成日</span>
                  <span>{formatDate(product.created_at)}</span>
                </div>
                <div className='flex justify-between rounded-md bg-muted/30 px-3 py-2'>
                  <span className='text-muted-foreground'>更新日</span>
                  <span>{formatDate(product.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
