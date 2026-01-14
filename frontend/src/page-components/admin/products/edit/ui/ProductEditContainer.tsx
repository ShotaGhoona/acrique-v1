'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Trash2,
  Eye,
  FileText,
  Image,
  Settings,
} from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn/ui/tabs';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useAdminProduct } from '@/features/admin-domain/admin-product/get-product/lib/use-admin-product';
import { useDeleteProduct } from '@/features/admin-domain/admin-product/delete-product/lib/use-delete-product';
import { ProductEditSkeleton } from './skeleton/ProductEditSkeleton';
import { BasicInfoTab } from './tab-components/BasicInfoTab';
import { MediaTab } from './tab-components/MediaTab';
import { DetailsTab } from './tab-components/DetailsTab';
import { ProductPreviewSheet } from './components/ProductPreviewSheet';
import type { CategoryId } from '@/shared/domain/category/model/types';
import type { BasicInfoFormData } from '../model/types';

interface ProductEditContainerProps {
  productId: string;
}

export function ProductEditContainer({ productId }: ProductEditContainerProps) {
  const router = useRouter();
  const { data: productData, isLoading, error } = useAdminProduct(productId);
  const product = productData?.product;
  const deleteProductMutation = useDeleteProduct();

  const [activeTab, setActiveTab] = useState('basic');
  const [previewOpen, setPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<BasicInfoFormData>({
    name: '',
    name_ja: '',
    category_id: '',
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
        name_ja: product.name_ja ?? '',
        category_id: product.category_id as '' | CategoryId,
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

  const handleDelete = () => {
    if (confirm('本当に削除しますか？この操作は取り消せません。')) {
      deleteProductMutation.mutate(productId, {
        onSuccess: () => {
          router.push('/admin/products');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title='商品編集'>
        <ProductEditSkeleton />
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

  return (
    <AdminLayout title={`商品編集: ${product.name_ja}`}>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Header with Tabs */}
        <div className='mb-6 flex items-center justify-between'>
          <Link href='/admin/products'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              戻る
            </Button>
          </Link>
          <TabsList>
            <TabsTrigger value='basic'>
              <FileText className='mr-1.5 h-4 w-4' />
              基本情報
            </TabsTrigger>
            <TabsTrigger value='media'>
              <Image className='mr-1.5 h-4 w-4' />
              メディア
            </TabsTrigger>
            <TabsTrigger value='details'>
              <Settings className='mr-1.5 h-4 w-4' />
              詳細設定
            </TabsTrigger>
          </TabsList>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className='mr-2 h-4 w-4' />
              プレビュー
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleDelete}
              disabled={deleteProductMutation.isPending}
              className='text-destructive hover:text-destructive'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <TabsContent value='basic'>
          <BasicInfoTab
            productId={productId}
            product={product}
            formData={formData}
            onFormDataChange={setFormData}
          />
        </TabsContent>

        <TabsContent value='media'>
          <MediaTab productId={productId} product={product} />
        </TabsContent>

        <TabsContent value='details'>
          <DetailsTab productId={productId} product={product} />
        </TabsContent>
      </Tabs>

      {/* Preview Sheet */}
      <ProductPreviewSheet
        product={product}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </AdminLayout>
  );
}
