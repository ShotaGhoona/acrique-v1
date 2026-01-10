'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, MoreHorizontal, Mail } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useAdminUsers } from '@/features/admin-user/get-users/lib/use-admin-users';

export function UsersHomeContainer() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useAdminUsers({
    search: searchQuery || undefined,
    limit: 50,
  });

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
                  placeholder='名前、メールで検索...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-9 sm:w-64'
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                    <TableHead>顧客ID</TableHead>
                    <TableHead>名前</TableHead>
                    <TableHead>会社名</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>登録日</TableHead>
                    <TableHead className='w-12'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.customers ?? []).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className='font-medium'>
                        {customer.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>
                            {customer.name || '-'}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {customer.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.company || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            customer.is_email_verified ? 'outline' : 'default'
                          }
                        >
                          {customer.is_email_verified ? '認証済み' : '未認証'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString(
                              'ja-JP',
                            )
                          : '-'}
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
                              <Link href={`/admin/users/${customer.id}`}>
                                <Eye className='mr-2 h-4 w-4' />
                                詳細を見る
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                alert(`メール送信: ${customer.email}（未実装）`)
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

              {(data?.customers ?? []).length === 0 && (
                <div className='py-12 text-center text-muted-foreground'>
                  該当する顧客がいません
                </div>
              )}

              {data?.customers && data.total > data.customers.length && (
                <div className='mt-4 text-center text-sm text-muted-foreground'>
                  {data.total}件中 {data.customers.length}件を表示
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
