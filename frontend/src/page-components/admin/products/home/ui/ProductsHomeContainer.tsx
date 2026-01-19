'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, LayoutGrid, List } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
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
import { useProducts } from '@/features/catalog-domain/product/get-products/lib/use-products';
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

type ViewMode = 'table' | 'gallery';

export function ProductsHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>(
    'all',
  );
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const { data, isLoading, error } = useProducts();
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name_ja.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || product.category_id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

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
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <CardTitle className='shrink-0'>商品一覧</CardTitle>
            <div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
              {/* 検索 */}
              <div className='relative w-full sm:w-64'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='商品名で検索...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9'
                />
              </div>
              {/* カテゴリフィルター */}
              <Select
                value={categoryFilter}
                onValueChange={(value) =>
                  setCategoryFilter(value as CategoryId | 'all')
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            viewMode === 'table' ? (
              <ProductsTableSkeleton />
            ) : (
              <ProductsGallerySkeleton />
            )
          ) : viewMode === 'table' ? (
            <ProductsTable
              products={filteredProducts}
              onDelete={handleDelete}
              isDeleting={deleteProductMutation.isPending}
            />
          ) : (
            <ProductsGallery
              products={filteredProducts}
              onDelete={handleDelete}
              isDeleting={deleteProductMutation.isPending}
            />
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className='py-12 text-center text-muted-foreground'>
              該当する商品がありません
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
