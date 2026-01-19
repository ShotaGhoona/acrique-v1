'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { AdminLayout } from '@/widgets/admin/layout/ui/AdminLayout';
import { useAdminLogs } from '@/features/admin-domain/admin-log/get-logs/lib/use-admin-logs';
import type {
  LogAction,
  LogTargetType,
} from '@/entities/admin-domain/admin-log/model/types';
import { AdminPagination } from '@/shared/ui/admin/pagination/AdminPagination';

const logActionLabels: Record<LogAction, string> = {
  login: 'ログイン',
  logout: 'ログアウト',
  create: '作成',
  update: '更新',
  delete: '削除',
};

const logTargetTypeLabels: Record<LogTargetType, string> = {
  admin: '管理者',
  user: '顧客',
  product: '商品',
  order: '注文',
};

const logActionIcons: Record<LogAction, React.ReactNode> = {
  login: <LogIn className='h-4 w-4 text-green-500' />,
  logout: <LogOut className='h-4 w-4 text-gray-500' />,
  create: <Plus className='h-4 w-4 text-blue-500' />,
  update: <Pencil className='h-4 w-4 text-yellow-500' />,
  delete: <Trash2 className='h-4 w-4 text-red-500' />,
};

const PAGE_SIZE = 20;

export function LogsContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<LogAction | 'all'>('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState<
    LogTargetType | 'all'
  >('all');
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useAdminLogs({
    action: actionFilter !== 'all' ? actionFilter : undefined,
    target_type: targetTypeFilter !== 'all' ? targetTypeFilter : undefined,
    limit: PAGE_SIZE,
    offset,
  });

  const handleFilterChange = (
    type: 'action' | 'targetType',
    value: string,
  ) => {
    if (type === 'action') {
      setActionFilter(value as LogAction | 'all');
    } else {
      setTargetTypeFilter(value as LogTargetType | 'all');
    }
    setOffset(0);
  };

  const filteredLogs = useMemo(() => {
    return (data?.logs ?? []).filter((log) => {
      const matchesSearch = (log.admin_name ?? '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [data?.logs, searchQuery]);

  return (
    <AdminLayout title='操作ログ'>
      {/* ヘッダー */}
      <div className='shrink-0'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='shrink-0 text-lg font-semibold'>操作ログ</h2>
          <Button
            variant='outline'
            onClick={() => alert('ログをエクスポート（未実装）')}
          >
            <Download className='mr-2 h-4 w-4' />
            エクスポート
          </Button>
        </div>

        {/* フィルター */}
        <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='管理者名で検索...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
          <Select
            value={actionFilter}
            onValueChange={(value) => handleFilterChange('action', value)}
          >
            <SelectTrigger className='w-full sm:w-40'>
              <Filter className='mr-2 h-4 w-4' />
              <SelectValue placeholder='アクション' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>すべて</SelectItem>
              {Object.entries(logActionLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={targetTypeFilter}
            onValueChange={(value) => handleFilterChange('targetType', value)}
          >
            <SelectTrigger className='w-full sm:w-40'>
              <SelectValue placeholder='対象タイプ' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>すべて</SelectItem>
              {Object.entries(logTargetTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* コンテンツ */}
      <div className='mt-6 min-h-0 flex-1 overflow-auto'>
        {isLoading ? (
          <div className='space-y-3'>
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className='h-12 w-full' />
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-12'></TableHead>
                  <TableHead>日時</TableHead>
                  <TableHead>管理者</TableHead>
                  <TableHead>アクション</TableHead>
                  <TableHead>対象タイプ</TableHead>
                  <TableHead>対象ID</TableHead>
                  <TableHead>IPアドレス</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{logActionIcons[log.action]}</TableCell>
                    <TableCell className='whitespace-nowrap text-muted-foreground'>
                      {new Date(log.created_at).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {log.admin_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {logActionLabels[log.action]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>
                        {logTargetTypeLabels[log.target_type]}
                      </Badge>
                    </TableCell>
                    <TableCell className='font-mono text-sm'>
                      {log.target_id || '-'}
                    </TableCell>
                    <TableCell className='font-mono text-sm text-muted-foreground'>
                      {log.ip_address || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredLogs.length === 0 && (
              <div className='py-12 text-center text-muted-foreground'>
                該当するログがありません
              </div>
            )}
          </>
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
