'use client';

import { useRouter } from 'next/navigation';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { useAdminLogout } from '@/features/admin-auth/logout/lib/use-admin-logout';

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const router = useRouter();
  const logoutMutation = useAdminLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/admin/login');
      },
    });
  };

  return (
    <header className='flex h-16 items-center justify-between border-b bg-card px-6'>
      {/* Page Title */}
      <h1 className='text-xl font-semibold tracking-tight'>{title}</h1>

      {/* Actions */}
      <div className='flex items-center gap-4'>
        {/* Search */}
        <div className='relative hidden md:block'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input placeholder='検索...' className='w-64 pl-9' />
        </div>

        {/* Notifications */}
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          <span className='absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground'>
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <User className='h-5 w-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>
              <div className='flex flex-col'>
                <span className='font-medium'>管理者</span>
                <span className='text-xs text-muted-foreground'>
                  admin@acrique.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert('プロフィール（未実装）')}>
              プロフィール
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('設定（未実装）')}>
              設定
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className='text-destructive'
            >
              {logoutMutation.isPending ? 'ログアウト中...' : 'ログアウト'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
