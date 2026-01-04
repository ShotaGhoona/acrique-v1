'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import {
  dummyAdmins,
  adminRoleLabels,
  adminRoleColors,
  adminStatusLabels,
} from '../dummy-data/admins';

export function AdminsContainer() {
  const [searchQuery, setSearchQuery] = useState('');

  // 今後消す==========================================
  const filteredAdmins = dummyAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // =================================================

  return (
    <AdminLayout title='管理者一覧'>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <CardTitle>管理者一覧</CardTitle>
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
              <Button
                onClick={() => alert('管理者追加ダイアログを開く（未実装）')}
              >
                <Plus className='mr-2 h-4 w-4' />
                管理者を追加
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>管理者ID</TableHead>
                <TableHead>名前</TableHead>
                <TableHead>メールアドレス</TableHead>
                <TableHead>権限</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>最終ログイン</TableHead>
                <TableHead className='w-12'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className='font-medium'>{admin.id}</TableCell>
                  <TableCell className='font-medium'>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={adminRoleColors[admin.role]}>
                      {adminRoleLabels[admin.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        admin.status === 'active' ? 'outline' : 'secondary'
                      }
                    >
                      {adminStatusLabels[admin.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {admin.lastLoginAt}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => alert(`編集: ${admin.id}（未実装）`)}
                        >
                          <Edit className='mr-2 h-4 w-4' />
                          編集
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => alert(`削除: ${admin.id}（未実装）`)}
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

          {filteredAdmins.length === 0 && (
            <div className='py-12 text-center text-muted-foreground'>
              該当する管理者がいません
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
