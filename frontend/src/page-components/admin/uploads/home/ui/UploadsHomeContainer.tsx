'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Download, MoreHorizontal } from 'lucide-react';
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
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { AdminLayout } from '@/widgets/admin/layout/ui/AdminLayout';
import { useAdminUploads } from '@/features/admin-domain/admin-upload/get-uploads/lib/use-admin-uploads';
import type { UploadStatus } from '@/shared/domain/upload/model/types';
import {
  UPLOAD_STATUS_LABELS,
  UPLOAD_STATUS_COLORS,
} from '@/shared/domain/upload/model/types';

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function UploadsHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UploadStatus | 'all'>('all');

  const { data, isLoading, error } = useAdminUploads(
    statusFilter === 'all' ? undefined : { status: statusFilter },
  );

  const uploads = data?.uploads ?? [];

  // クライアント側でのフィルタリング（検索クエリ）
  const filteredUploads = uploads.filter((upload) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      upload.id.toString().includes(query) ||
      (upload.order_id?.toString().includes(query) ?? false) ||
      upload.file_name.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout title='入稿データ管理'>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <CardTitle>入稿データ一覧</CardTitle>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='ID、注文ID、ファイル名で検索...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-9 sm:w-64'
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as UploadStatus | 'all')
                }
              >
                <SelectTrigger className='w-full sm:w-40'>
                  <Filter className='mr-2 h-4 w-4' />
                  <SelectValue placeholder='ステータス' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>すべて</SelectItem>
                  {Object.entries(UPLOAD_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='py-12 text-center text-muted-foreground'>
              読み込み中...
            </div>
          ) : error ? (
            <div className='py-12 text-center text-destructive'>
              データの取得に失敗しました
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>入稿ID</TableHead>
                    <TableHead>注文ID</TableHead>
                    <TableHead>ファイル名</TableHead>
                    <TableHead>ファイルサイズ</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>アップロード日時</TableHead>
                    <TableHead className='w-12'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUploads.map((upload) => (
                    <TableRow key={upload.id}>
                      <TableCell className='font-medium'>{upload.id}</TableCell>
                      <TableCell>
                        {upload.order_id ? (
                          <Link
                            href={`/admin/orders/${upload.order_id}`}
                            className='text-primary hover:underline'
                          >
                            {upload.order_id}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>{upload.file_name}</div>
                          {upload.file_type && (
                            <div className='text-xs text-muted-foreground'>
                              {upload.file_type}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(upload.file_size)}</TableCell>
                      <TableCell>
                        <Badge variant={UPLOAD_STATUS_COLORS[upload.status]}>
                          {UPLOAD_STATUS_LABELS[upload.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {formatDate(upload.created_at)}
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
                              <Link href={`/admin/uploads/${upload.id}`}>
                                <Eye className='mr-2 h-4 w-4' />
                                詳細・確認
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                href={upload.file_url}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <Download className='mr-2 h-4 w-4' />
                                ダウンロード
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredUploads.length === 0 && (
                <div className='py-12 text-center text-muted-foreground'>
                  該当する入稿データがありません
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
