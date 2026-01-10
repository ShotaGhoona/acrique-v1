'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useProducts } from '@/features/product/get-products/lib/use-products';
import { useDeleteProduct } from '@/features/admin-product/delete-product/lib/use-delete-product';
import { ProductsTableSkeleton } from './skeleton/ProductsTableSkeleton';
import {
  categories,
  getCategoryIds,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';

export function ProductsHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>(
    'all',
  );

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
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

  if (isLoading) {
    return (
      <AdminLayout title='商品管理'>
        <ProductsTableSkeleton />
      </AdminLayout>
    );
  }

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
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <CardTitle>商品一覧</CardTitle>
            <Link href='/admin/products/new'>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                商品を追加
              </Button>
            </Link>
          </div>
          <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='商品名で検索...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(value as CategoryId | 'all')
              }
            >
              <SelectTrigger className='w-full sm:w-40'>
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
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品ID</TableHead>
                <TableHead>商品名</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead className='text-right'>基本価格</TableHead>
                <TableHead>おすすめ</TableHead>
                <TableHead className='w-12'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className='font-mono text-sm'>
                    {product.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{product.name_ja}</div>
                      <div className='text-xs text-muted-foreground'>
                        {product.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>
                      {categories[product.category_id]?.name ??
                        product.category_id}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatCurrency(product.base_price)}〜
                  </TableCell>
                  <TableCell>
                    {product.is_featured && (
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                          <Link href={`/${product.category_id}/${product.id}`}>
                            <Eye className='mr-2 h-4 w-4' />
                            プレビュー
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Edit className='mr-2 h-4 w-4' />
                            編集
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() =>
                            handleDelete(product.id, product.name_ja)
                          }
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className='py-12 text-center text-muted-foreground'>
              該当する商品がありません
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
