'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { AdminLayout } from '@/widgets/admin/layout/ui/AdminLayout';
import { useAdminProducts } from '@/features/admin-domain/admin-product/get-products/lib/use-admin-products';
import { useDeleteProduct } from '@/features/admin-domain/admin-product/delete-product/lib/use-delete-product';
import {
  categories,
  getCategoryIds,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';
import { ProductsTable } from '../ui-block/table-view/ui/ProductsTable';
import { ProductsTableSkeleton } from '../ui-block/table-view/ui/skeleton/ProductsTableSkeleton';
import { ProductsGallery } from '../ui-block/gallery-view/ui/ProductsGallery';
import { ProductsGallerySkeleton } from '../ui-block/gallery-view/ui/skeleton/ProductsGallerySkeleton';
import { AdminPagination } from '@/shared/ui/admin/pagination/AdminPagination';

type ViewMode = 'table' | 'gallery';
const PAGE_SIZE = 10;

export function ProductsHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>(
    'all',
  );
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [offset, setOffset] = useState(0);

  const { data, isLoading, error } = useAdminProducts({
    search: searchQuery || undefined,
    category_id: categoryFilter !== 'all' ? categoryFilter : undefined,
    limit: PAGE_SIZE,
    offset,
  });
  const deleteProductMutation = useDeleteProduct();
  const products = data?.products ?? [];
  const categoryIds = getCategoryIds();

  const handleDelete = (productId: string, productName: string) => {
    if (
      confirm(`「${productName}」を削除しますか？この操作は取り消せません。`)
    ) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setOffset(0);
  };

  const handleCategoryChange = (value: CategoryId | 'all') => {
    setCategoryFilter(value);
    setOffset(0);
  };

  if (error) {
    return (
      <AdminLayout title='商品管理'>
        <div className='flex min-h-[400px] items-center justify-center'>
          <p className='text-destructive'>エラーが発生しました</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title='商品管理'>
      {/* ヘッダー */}
      <div className='shrink-0'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <h2 className='shrink-0 text-lg font-semibold'>商品一覧</h2>
          <div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
            {/* 検索 */}
            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='商品名で検索...'
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className='pl-9'
              />
            </div>
            {/* カテゴリフィルター */}
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                handleCategoryChange(value as CategoryId | 'all')
              }
            >
              <SelectTrigger className='w-full sm:w-36'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='カテゴリ' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>すべて</SelectItem>
                {categoryIds.map((id) => (
                  <SelectItem key={id} value={id}>
                    {categories[id].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* ビュー切り替え */}
            <div className='flex shrink-0 rounded-md border'>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size='icon'
                className='h-9 w-9 rounded-r-none'
                onClick={() => setViewMode('table')}
              >
                <List className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'gallery' ? 'secondary' : 'ghost'}
                size='icon'
                className='h-9 w-9 rounded-l-none border-l'
                onClick={() => setViewMode('gallery')}
              >
                <LayoutGrid className='h-4 w-4' />
              </Button>
            </div>
            {/* 商品追加 */}
            <Link href='/admin/products/new' className='shrink-0'>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                商品を追加
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className='mt-6 min-h-0 flex-1 overflow-auto'>
        {isLoading ? (
          viewMode === 'table' ? (
            <ProductsTableSkeleton />
          ) : (
            <ProductsGallerySkeleton />
          )
        ) : viewMode === 'table' ? (
          <ProductsTable
            products={products}
            onDelete={handleDelete}
            isDeleting={deleteProductMutation.isPending}
          />
        ) : (
          <ProductsGallery
            products={products}
            onDelete={handleDelete}
            isDeleting={deleteProductMutation.isPending}
          />
        )}

        {!isLoading && products.length === 0 && (
          <div className='py-12 text-center text-muted-foreground'>
            該当する商品がありません
          </div>
        )}
      </div>

      {/* ページネーション */}
      {data && data.total > 0 && (
        <div className='shrink-0 border-t pt-4'>
          <AdminPagination
            total={data.total}
            limit={data.limit}
            offset={data.offset}
            onPageChange={setOffset}
          />
        </div>
      )}
    </AdminLayout>
  );
}
