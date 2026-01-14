'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ImagePlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { AdminLayout } from '@/widgets/admin/layout/ui/AdminLayout';
import { useCreateProduct } from '@/features/admin-domain/admin-product/create-product/lib/use-create-product';
import {
  type CreateProductFormData,
  createProductFormDataInitial,
} from '@/features/admin-domain/admin-product/create-product/model/types';
import {
  categories,
  getCategoryIds,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';

export function ProductNewContainer() {
  const router = useRouter();
  const categoryIds = getCategoryIds();
  const createProductMutation = useCreateProduct();

  const [formData, setFormData] =
    useState<CreateProductFormData>(createProductFormDataInitial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.id ||
      !formData.category_id ||
      !formData.name ||
      !formData.name_ja ||
      !formData.base_price
    ) {
      alert('商品ID、カテゴリ、商品名、基本価格は必須です');
      return;
    }

    createProductMutation.mutate(
      {
        id: formData.id,
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
        requires_upload: formData.requires_upload,
        upload_type: formData.upload_type || undefined,
        upload_note: formData.upload_note || undefined,
      },
      {
        onSuccess: () => {
          router.push('/admin/products');
        },
      },
    );
  };

  return (
    <AdminLayout title='商品追加'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Link href='/admin/products'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            一覧に戻る
          </Button>
        </Link>
        <Button
          onClick={handleSubmit}
          disabled={createProductMutation.isPending}
        >
          <Save className='mr-2 h-4 w-4' />
          {createProductMutation.isPending ? '作成中...' : '保存'}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='id'>商品ID（英数字・URLに使用）</Label>
                  <Input
                    id='id'
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-'),
                      })
                    }
                    placeholder='qr-code-cube'
                  />
                  <p className='text-xs text-muted-foreground'>
                    英小文字、数字、ハイフンのみ使用可能
                  </p>
                </div>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>商品名（英語）</Label>
                    <Input
                      id='name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder='QR Code Cube'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='name_ja'>商品名（日本語）</Label>
                    <Input
                      id='name_ja'
                      value={formData.name_ja}
                      onChange={(e) =>
                        setFormData({ ...formData, name_ja: e.target.value })
                      }
                      placeholder='QRコードキューブ'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='tagline'>キャッチコピー</Label>
                  <Input
                    id='tagline'
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder='あなたのQRを、アートに。'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='description'>商品説明（短）</Label>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder='商品の簡単な説明...'
                    rows={3}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='long_description'>商品説明（詳細）</Label>
                  <Textarea
                    id='long_description'
                    value={formData.long_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        long_description: e.target.value,
                      })
                    }
                    placeholder='商品の詳細な説明...'
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>商品画像</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                  <button
                    type='button'
                    className='flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50'
                    onClick={() => alert('画像アップロードは未実装です')}
                  >
                    <ImagePlus className='h-8 w-8' />
                    <span className='mt-2 text-xs'>画像を追加</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Settings */}
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
                      setFormData({ ...formData, requires_upload: checked })
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
                          setFormData({ ...formData, upload_type: value })
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
                          setFormData({
                            ...formData,
                            upload_note: e.target.value,
                          })
                        }
                        placeholder='入稿データの形式など...'
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Category & Featured */}
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
                      setFormData({
                        ...formData,
                        category_id: value as CategoryId,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='選択してください' />
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
                      setFormData({ ...formData, is_featured: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
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
                        setFormData({ ...formData, base_price: e.target.value })
                      }
                      className='pl-8'
                      placeholder='0'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='price_note'>価格備考</Label>
                  <Input
                    id='price_note'
                    value={formData.price_note}
                    onChange={(e) =>
                      setFormData({ ...formData, price_note: e.target.value })
                    }
                    placeholder='サイズ・オプションにより変動'
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lead Time */}
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
                      setFormData({
                        ...formData,
                        lead_time_days: e.target.value,
                      })
                    }
                    placeholder='5'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lead_time_note'>納期備考</Label>
                  <Input
                    id='lead_time_note'
                    value={formData.lead_time_note}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lead_time_note: e.target.value,
                      })
                    }
                    placeholder='5営業日〜'
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
