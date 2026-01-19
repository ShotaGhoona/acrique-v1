'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/ui/dialog';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { Switch } from '@/shared/ui/shadcn/ui/switch';
import { useCreateAdmin } from '@/features/admin-domain/admin/create-admin/lib/use-create-admin';
import { useUpdateAdmin } from '@/features/admin-domain/admin/update-admin/lib/use-update-admin';
import {
  type UpdateAdminFormData,
  updateAdminFormDataInitial,
} from '@/features/admin-domain/admin/update-admin/model/types';
import type {
  Admin,
  AdminRole,
} from '@/entities/admin-domain/admin/model/types';

const adminRoleLabels: Record<AdminRole, string> = {
  super_admin: 'スーパー管理者',
  admin: '管理者',
  staff: 'スタッフ',
};

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin?: Admin | null;
}

export function AdminFormDialog({
  open,
  onOpenChange,
  admin,
}: AdminFormDialogProps) {
  const isEditing = !!admin;
  const createAdminMutation = useCreateAdmin();
  const updateAdminMutation = useUpdateAdmin();

  const [formData, setFormData] = useState<UpdateAdminFormData>(
    updateAdminFormDataInitial,
  );

  useEffect(() => {
    if (admin) {
      setFormData({
        email: admin.email,
        password: '',
        name: admin.name,
        role: admin.role,
        is_active: admin.is_active,
      });
    } else {
      setFormData(updateAdminFormDataInitial);
    }
  }, [admin, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && admin) {
      const updateData: {
        email?: string;
        password?: string;
        name?: string;
        role?: AdminRole;
        is_active?: boolean;
      } = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        is_active: formData.is_active,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      updateAdminMutation.mutate(
        { adminId: admin.id, data: updateData },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    } else {
      createAdminMutation.mutate(
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    }
  };

  const isPending =
    createAdminMutation.isPending || updateAdminMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? '管理者を編集' : '管理者を追加'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? '管理者情報を編集します。パスワードは変更する場合のみ入力してください。'
              : '新しい管理者を追加します。'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>名前</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='山田 太郎'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>メールアドレス</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder='admin@example.com'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>
                パスワード{isEditing && '（変更する場合のみ）'}
              </Label>
              <Input
                id='password'
                type='password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder='••••••••'
                required={!isEditing}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='role'>権限</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as AdminRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(adminRoleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isEditing && (
              <div className='flex items-center justify-between'>
                <Label htmlFor='is_active'>アカウント有効</Label>
                <Switch
                  id='is_active'
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? '保存中...' : isEditing ? '更新' : '追加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
