'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Download, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/ui/card';
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
import { AdminLayout } from '@/widgets/admin-layout/ui/AdminLayout';
import {
  dummyUploads,
  uploadStatusLabels,
  uploadStatusColors,
  type UploadStatus,
} from '../../dummy-data/uploads';

export function UploadsHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UploadStatus | 'all'>('all');

  // 今後消す==========================================
  const filteredUploads = dummyUploads.filter((upload) => {
    const matchesSearch =
      upload.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upload.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upload.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || upload.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // =================================================

  return (
    <AdminLayout title="入稿データ管理">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>入稿データ一覧</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ID、注文ID、顧客名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:w-64"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as UploadStatus | 'all')}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {Object.entries(uploadStatusLabels).map(([key, label]) => (
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>入稿ID</TableHead>
                <TableHead>注文ID</TableHead>
                <TableHead>顧客名</TableHead>
                <TableHead>ファイル名</TableHead>
                <TableHead>ファイルサイズ</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>アップロード日時</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell className="font-medium">{upload.id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${upload.orderId}`}
                      className="text-primary hover:underline"
                    >
                      {upload.orderId}
                    </Link>
                  </TableCell>
                  <TableCell>{upload.customerName}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{upload.fileName}</div>
                      <div className="text-xs text-muted-foreground">{upload.fileType}</div>
                    </div>
                  </TableCell>
                  <TableCell>{upload.fileSize}</TableCell>
                  <TableCell>
                    <Badge variant={uploadStatusColors[upload.status]}>
                      {uploadStatusLabels[upload.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{upload.uploadedAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/uploads/${upload.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            詳細・確認
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`ダウンロード: ${upload.fileName}（未実装）`)}>
                          <Download className="mr-2 h-4 w-4" />
                          ダウンロード
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUploads.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              該当する入稿データがありません
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
