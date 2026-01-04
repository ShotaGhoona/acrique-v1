'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ImagePlus, Trash2 } from 'lucide-react';
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
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useProduct } from '@/features/product/get-product/lib/use-product';
import {
  categories,
  getCategoryIds,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';

interface ProductEditContainerProps {
  productId: string;
}

export function ProductEditContainer({ productId }: ProductEditContainerProps) {
  const router = useRouter();
  const categoryIds = getCategoryIds();
  const { data: product, isLoading, error } = useProduct(productId);

  const [formData, setFormData] = useState({
    name: '',
    name_ja: '',
    category_id: '' as CategoryId | '',
    tagline: '',
    description: '',
    long_description: '',
    base_price: '',
    price_note: '',
    lead_time_days: '',
    lead_time_note: '',
    is_featured: false,
    requires_upload: false,
    upload_type: '',
    upload_note: '',
  });

  // 商品データが取得できたらフォームに反映
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        name_ja: product.name_ja,
        category_id: product.category_id,
        tagline: product.tagline ?? '',
        description: product.description ?? '',
        long_description: product.long_description ?? '',
        base_price: product.base_price.toString(),
        price_note: product.price_note ?? '',
        lead_time_days: product.lead_time_days?.toString() ?? '',
        lead_time_note: product.lead_time_note ?? '',
        is_featured: product.is_featured,
        requires_upload: product.requires_upload,
        upload_type: product.upload_type ?? '',
        upload_note: product.upload_note ?? '',
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API呼び出しを実装
    alert('商品更新APIは未実装です');
  };

  const handleDelete = () => {
    if (confirm('本当に削除しますか？')) {
      // TODO: API呼び出しを実装
      alert('商品削除APIは未実装です');
      router.push('/admin/products');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title='商品編集'>
        <div className='flex min-h-[400px] items-center justify-center'>
          <p className='text-muted-foreground'>読み込み中...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout title='商品編集'>
        <div className='flex flex-col items-center justify-center py-12'>
          <p className='text-muted-foreground'>商品が見つかりません</p>
          <Link href='/admin/products' className='mt-4'>
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              一覧に戻る
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <AdminLayout title={`商品編集: ${product.name_ja}`}>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Link href='/admin/products'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            一覧に戻る
          </Button>
        </Link>
        <div className='flex gap-2'>
          <Button variant='destructive' onClick={handleDelete}>
            <Trash2 className='mr-2 h-4 w-4' />
            削除
          </Button>
          <Button onClick={handleSubmit}>
            <Save className='mr-2 h-4 w-4' />
            保存
          </Button>
        </div>
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
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>商品名（英語）</Label>
                    <Input
                      id='name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
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
                  {product.images.map((image) => (
                    <div
                      key={image.id}
                      className='relative aspect-square rounded-lg bg-muted'
                    >
                      <div className='flex h-full items-center justify-center text-xs text-muted-foreground'>
                        {image.alt ?? 'Image'}
                      </div>
                      {image.is_main && (
                        <span className='absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground'>
                          メイン
                        </span>
                      )}
                    </div>
                  ))}
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
                  />
                </div>
              </CardContent>
            </Card>

            {/* Info */}
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
      </form>
    </AdminLayout>
  );
}
