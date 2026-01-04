'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, MoreHorizontal, Mail } from 'lucide-react';
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
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import {
  dummyUsers,
  userStatusLabels,
  userStatusColors,
  type UserStatus,
} from '../dummy-data/users';

export function UsersHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  // 今後消す==========================================
  const filteredUsers = dummyUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // =================================================

  return (
    <AdminLayout title='顧客管理'>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <CardTitle>顧客一覧</CardTitle>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='名前、メール、会社名で検索...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-9 sm:w-64'
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as UserStatus | 'all')
                }
              >
                <SelectTrigger className='w-full sm:w-40'>
                  <Filter className='mr-2 h-4 w-4' />
                  <SelectValue placeholder='ステータス' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>すべて</SelectItem>
                  {Object.entries(userStatusLabels).map(([key, label]) => (
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
                <TableHead>顧客ID</TableHead>
                <TableHead>名前</TableHead>
                <TableHead>会社名</TableHead>
                <TableHead className='text-right'>注文数</TableHead>
                <TableHead className='text-right'>累計購入額</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>最終ログイン</TableHead>
                <TableHead className='w-12'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{user.name}</div>
                      <div className='text-xs text-muted-foreground'>
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.companyName || '-'}</TableCell>
                  <TableCell className='text-right'>
                    {user.totalOrders}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatCurrency(user.totalSpent)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={userStatusColors[user.status]}>
                      {userStatusLabels[user.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {user.lastLoginAt}
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
                          <Link href={`/admin/users/${user.id}`}>
                            <Eye className='mr-2 h-4 w-4' />
                            詳細を見る
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`メール送信: ${user.email}（未実装）`)
                          }
                        >
                          <Mail className='mr-2 h-4 w-4' />
                          メール送信
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className='py-12 text-center text-muted-foreground'>
              該当する顧客がいません
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
