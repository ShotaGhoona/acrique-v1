'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
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
  dummyEstimates,
  estimateStatusLabels,
  estimateStatusColors,
  type EstimateStatus,
} from '../../dummy-data/estimates';

export function EstimatesHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EstimateStatus | 'all'>('all');

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  // 今後消す==========================================
  const filteredEstimates = dummyEstimates.filter((estimate) => {
    const matchesSearch =
      estimate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // =================================================

  return (
    <AdminLayout title="見積もり管理">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>見積もり一覧</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ID、顧客名、会社名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:w-64"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as EstimateStatus | 'all')}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {Object.entries(estimateStatusLabels).map(([key, label]) => (
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
                <TableHead>見積ID</TableHead>
                <TableHead>会社名</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>商品種別</TableHead>
                <TableHead className="text-right">数量</TableHead>
                <TableHead className="text-right">見積金額</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>依頼日</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstimates.map((estimate) => (
                <TableRow key={estimate.id}>
                  <TableCell className="font-medium">{estimate.id}</TableCell>
                  <TableCell>{estimate.companyName}</TableCell>
                  <TableCell>
                    <div>
                      <div>{estimate.customerName}</div>
                      <div className="text-xs text-muted-foreground">{estimate.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{estimate.productType}</TableCell>
                  <TableCell className="text-right">{estimate.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(estimate.quotedAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={estimateStatusColors[estimate.status]}>
                      {estimateStatusLabels[estimate.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{estimate.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/estimates/${estimate.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            詳細・回答
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredEstimates.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              該当する見積もりがありません
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
