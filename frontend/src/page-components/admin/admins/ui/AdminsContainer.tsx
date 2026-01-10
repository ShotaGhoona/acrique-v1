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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useAdmins } from '@/features/admin/get-admins/lib/use-admins';
import { useDeleteAdmin } from '@/features/admin/delete-admin/lib/use-delete-admin';
import type { Admin, AdminRole } from '@/entities/admin/model/types';
import { AdminFormDialog } from './AdminFormDialog';

const adminRoleLabels: Record<AdminRole, string> = {
  super_admin: 'スーパー管理者',
  admin: '管理者',
  staff: 'スタッフ',
};

const adminRoleColors: Record<AdminRole, 'default' | 'secondary' | 'outline'> =
  {
    super_admin: 'default',
    admin: 'secondary',
    staff: 'outline',
  };

export function AdminsContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const { data, isLoading } = useAdmins({ limit: 50 });
  const deleteAdminMutation = useDeleteAdmin();

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setDialogOpen(true);
  };

  const filteredAdmins = (data?.admins ?? []).filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (adminId: number, adminName: string) => {
    if (confirm(`「${adminName}」を削除しますか？`)) {
      deleteAdminMutation.mutate(adminId);
    }
  };

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
              <Button onClick={handleOpenCreate}>
                <Plus className='mr-2 h-4 w-4' />
                管理者を追加
              </Button>
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
                      <TableCell className='font-medium'>
                        {admin.name}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant={adminRoleColors[admin.role]}>
                          {adminRoleLabels[admin.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={admin.is_active ? 'outline' : 'secondary'}
                        >
                          {admin.is_active ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {admin.last_login_at
                          ? new Date(admin.last_login_at).toLocaleString(
                              'ja-JP',
                              {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
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
                            <DropdownMenuItem
                              onClick={() => handleOpenEdit(admin)}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-destructive'
                              onClick={() => handleDelete(admin.id, admin.name)}
                              disabled={deleteAdminMutation.isPending}
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

              {data?.admins && data.total > data.admins.length && (
                <div className='mt-4 text-center text-sm text-muted-foreground'>
                  {data.total}件中 {data.admins.length}件を表示
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AdminFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        admin={editingAdmin}
      />
    </AdminLayout>
  );
}
