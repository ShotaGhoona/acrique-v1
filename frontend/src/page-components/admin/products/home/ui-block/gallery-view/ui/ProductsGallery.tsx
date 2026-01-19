import Link from 'next/link';
import Image from 'next/image';
import { Eye, Trash2, MoreHorizontal, Star, ImageOff } from 'lucide-react';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Button } from '@/shared/ui/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { categories } from '@/shared/domain/category/data/categories';
import type { AdminProduct } from '@/entities/admin-domain/admin-product/model/types';
import type { CategoryId } from '@/shared/domain/category/model/types';

interface ProductsGalleryProps {
  products: AdminProduct[];
  onDelete: (productId: string, productName: string) => void;
  isDeleting: boolean;
}

export function ProductsGallery({
  products,
  onDelete,
  isDeleting,
}: ProductsGalleryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {products.map((product) => (
        <div
          key={product.id}
          className='group relative overflow-hidden rounded-lg border bg-card'
        >
          {/* カード全体を編集ページへのリンクに */}
          <Link
            href={`/admin/products/${product.id}`}
            className='block'
          >
            {/* サムネイル */}
            <div className='relative aspect-square bg-muted'>
              {product.main_image_url ? (
                <Image
                  src={product.main_image_url}
                  alt={product.name_ja ?? product.name}
                  fill
                  className='object-cover transition-transform group-hover:scale-105'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <ImageOff className='h-8 w-8 text-muted-foreground/40' />
                </div>
              )}

              {/* おすすめバッジ */}
              {product.is_featured && (
                <div className='absolute left-2 top-2'>
                  <Star className='h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow' />
                </div>
              )}
            </div>

            {/* 商品情報 */}
            <div className='p-3'>
              <div className='mb-2'>
                <Badge variant='outline' className='text-xs'>
                  {categories[product.category_id as CategoryId]?.name ?? product.category_id}
                </Badge>
              </div>
              <h3 className='line-clamp-1 text-sm font-medium'>
                {product.name_ja ?? product.name}
              </h3>
              <p className='line-clamp-1 text-xs text-muted-foreground'>
                {product.name}
              </p>
              <p className='mt-2 text-sm font-semibold'>
                {formatCurrency(product.base_price)}〜
              </p>
            </div>
          </Link>

          {/* アクションメニュー（リンクとは別にオーバーレイ） */}
          <div className='absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='secondary'
                  size='icon'
                  className='h-8 w-8 shadow-md'
                  onClick={(e) => e.preventDefault()}
                >
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-destructive'
                  onClick={() => onDelete(product.id, product.name_ja ?? product.name)}
                  disabled={isDeleting}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
