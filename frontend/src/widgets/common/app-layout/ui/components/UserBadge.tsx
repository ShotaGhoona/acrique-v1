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
import { useLogout } from '@/features/account-domain/auth/logout/lib/use-logout';

interface UserBadgeProps {
  className?: string;
}

export function UserBadge({ className = '' }: UserBadgeProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { mutate: logout, isPending } = useLogout();

  if (!isAuthenticated) {
    return (
      <Link href='/login'>
        <Button variant='ghost' size='icon' className={`h-9 w-9 ${className}`}>
          <User className='h-4 w-4' />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className={`h-9 w-9 ${className}`}>
          <div className='relative'>
            <User className='h-4 w-4' />
            <span className='absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-background' />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-52 border-border bg-background/95 p-1 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      >
        {user?.name && (
          <>
            <div className='px-3 py-2'>
              <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                Account
              </p>
              <p className='mt-1 truncate text-sm font-medium tracking-wide'>
                {user.name}
              </p>
            </div>
            <DropdownMenuSeparator className='mx-1' />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link
            href='/mypage'
            className='flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm tracking-wide transition-colors'
          >
            <User className='h-4 w-4 text-muted-foreground' />
            マイページ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href='/mypage/orders'
            className='flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm tracking-wide transition-colors'
          >
            <Package className='h-4 w-4 text-muted-foreground' />
            注文履歴
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href='/mypage/addresses'
            className='flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm tracking-wide transition-colors'
          >
            <MapPin className='h-4 w-4 text-muted-foreground' />
            住所管理
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='mx-1' />
        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isPending}
          className='flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm tracking-wide text-destructive transition-colors focus:text-destructive'
        >
          <LogOut className='h-4 w-4' />
          {isPending ? 'ログアウト中...' : 'ログアウト'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
