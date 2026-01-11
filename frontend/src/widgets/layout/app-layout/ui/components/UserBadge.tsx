'use client';

import Link from 'next/link';
import { User, LogOut, Package, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/ui/dropdown-menu';
import { useAppSelector } from '@/store/hooks/typed-hooks';
import { useLogout } from '@/features/auth/logout/lib/use-logout';

interface UserBadgeProps {
  className?: string;
}

export function UserBadge({ className = '' }: UserBadgeProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { mutate: logout, isPending } = useLogout();

  if (!isAuthenticated) {
    return (
      <Link href='/login'>
        <Button
          variant='ghost'
          size='icon'
          className={`h-9 w-9 ${className}`}
        >
          <User className='h-4 w-4' />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className={`h-9 w-9 ${className}`}
        >
          <div className='relative'>
            <User className='h-4 w-4' />
            <span className='absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500' />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {user?.name && (
          <>
            <div className='px-2 py-1.5 text-sm font-medium'>
              {user.name}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href='/mypage' className='cursor-pointer'>
            <User className='mr-2 h-4 w-4' />
            マイページ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/mypage/orders' className='cursor-pointer'>
            <Package className='mr-2 h-4 w-4' />
            注文履歴
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/mypage/addresses' className='cursor-pointer'>
            <MapPin className='mr-2 h-4 w-4' />
            住所管理
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isPending}
          className='cursor-pointer text-destructive focus:text-destructive'
        >
          <LogOut className='mr-2 h-4 w-4' />
          {isPending ? 'ログアウト中...' : 'ログアウト'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
