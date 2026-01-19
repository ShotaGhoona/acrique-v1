import Link from 'next/link';
import { Eye, Pencil, Trash2, MoreHorizontal, Star } from 'lucide-react';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Button } from '@/shared/ui/shadcn/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { categories } from '@/shared/domain/category/data/categories';
import type { ProductListItem } from '@/entities/catalog-domain/product/model/types';

interface ProductsTableProps {
  products: ProductListItem[];
  onDelete: (productId: string, productName: string) => void;
  isDeleting: boolean;
}

export function ProductsTable({
  products,
  onDelete,
  isDeleting,
}: ProductsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-12'></TableHead>
          <TableHead>商品ID</TableHead>
          <TableHead>商品名</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead className='text-right'>基本価格</TableHead>
          <TableHead>おすすめ</TableHead>
          <TableHead className='w-12'></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Link href={`/admin/products/${product.id}`}>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <Pencil className='h-4 w-4' />
                </Button>
              </Link>
            </TableCell>
            <TableCell className='font-mono text-sm'>{product.id}</TableCell>
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
                {categories[product.category_id]?.name ?? product.category_id}
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-destructive'
                    onClick={() => onDelete(product.id, product.name_ja)}
                    disabled={isDeleting}
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
  );
}
