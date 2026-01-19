'use client';

import { useState } from 'react';
import { Search, Plus, Pencil } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/ui/table';
import { AdminLayout } from '@/widgets/admin/layout/ui/AdminLayout';
import { useAdminProductMasters } from '@/features/admin-domain/admin-product-master/get-product-masters/lib/use-admin-product-masters';
import type { AdminProductMaster } from '@/entities/admin-domain/admin-product-master/model/types';
import {
  modelCategoryLabels,
  modelCategoryColors,
} from '@/shared/domain/product/data/model-categories';
import { MasterFormDialog } from './MasterFormDialog';

export function MastersContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaster, setEditingMaster] = useState<AdminProductMaster | null>(
    null,
  );
  const { data, isLoading } = useAdminProductMasters();

  const handleOpenCreate = () => {
    setEditingMaster(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (master: AdminProductMaster) => {
    setEditingMaster(master);
    setDialogOpen(true);
  };

  const filteredMasters = (data?.masters ?? []).filter(
    (master) =>
      master.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      master.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (master.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false),
  );

  return (
    <AdminLayout title='商品マスタ管理'>
      {/* ヘッダー */}
      <div className='shrink-0'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='shrink-0 text-lg font-semibold'>商品マスタ一覧</h2>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='ID、名前で検索...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-9 sm:w-64'
            />
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className='mr-2 h-4 w-4' />
            マスタを追加
          </Button>
        </div>
      </div>
      </div>

      {/* コンテンツ */}
      <div className='mt-6 min-h-0 flex-1 overflow-auto'>
        {isLoading ? (
          <div className='space-y-3'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='h-16 w-full' />
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-12'></TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>名前</TableHead>
                  <TableHead>英語名</TableHead>
                  <TableHead>カテゴリ</TableHead>
                  <TableHead>キャッチコピー</TableHead>
                  <TableHead>納期</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>並び順</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMasters.map((master) => (
                  <TableRow key={master.id}>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => handleOpenEdit(master)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </TableCell>
                    <TableCell className='font-mono text-sm'>
                      {master.id}
                    </TableCell>
                    <TableCell className='font-medium'>{master.name}</TableCell>
                    <TableCell className='text-muted-foreground'>
                      {master.name_en ?? '-'}
                    </TableCell>
                    <TableCell>
                      {master.model_category ? (
                        <Badge
                          variant={
                            modelCategoryColors[master.model_category] ??
                            'outline'
                          }
                        >
                          {modelCategoryLabels[master.model_category] ??
                            master.model_category}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className='max-w-[200px] truncate text-muted-foreground'>
                      {master.tagline ?? '-'}
                    </TableCell>
                    <TableCell>
                      {master.base_lead_time_days
                        ? `${master.base_lead_time_days}日`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={master.is_active ? 'outline' : 'secondary'}
                      >
                        {master.is_active ? '有効' : '無効'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center'>
                      {master.sort_order}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredMasters.length === 0 && (
              <div className='py-12 text-center text-muted-foreground'>
                該当する商品マスタがありません
              </div>
            )}

            {data?.masters && data.total > data.masters.length && (
              <div className='mt-4 text-center text-sm text-muted-foreground'>
                {data.total}件中 {data.masters.length}件を表示
              </div>
            )}
          </>
        )}
      </div>

      <MasterFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        master={editingMaster}
      />
    </AdminLayout>
  );
}
