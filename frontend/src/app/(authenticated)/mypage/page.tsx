'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useLogout } from '@/features/auth/logout';
import { Button } from '@/shared/ui/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import {
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

const menuItems = [
  {
    title: '注文履歴',
    description: '過去のご注文を確認できます',
    href: '/mypage/orders',
    icon: Package,
  },
  {
    title: 'お気に入り',
    description: '保存した商品を確認できます',
    href: '/mypage/favorites',
    icon: Heart,
  },
  {
    title: 'アカウント設定',
    description: 'お届け先、パスワードの変更',
    href: '/mypage/settings',
    icon: Settings,
  },
];

export default function MyPage() {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='text-muted-foreground'>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-light tracking-tight md:text-3xl'>
          マイページ
        </h1>
        {user && (
          <p className='mt-2 text-muted-foreground'>
            {user.email || `ユーザーID: ${user.id}`} でログイン中
          </p>
        )}
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>メニュー</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <nav>
                {menuItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-6 py-4 transition-colors hover:bg-secondary/50 ${
                      index !== menuItems.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className='flex items-center gap-4'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-secondary'>
                        <item.icon className='h-5 w-5 text-muted-foreground' />
                      </div>
                      <div>
                        <div className='font-medium'>{item.title}</div>
                        <div className='text-sm text-muted-foreground'>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className='h-5 w-5 text-muted-foreground' />
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Recent Orders Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>最近のご注文</CardTitle>
              <CardDescription>直近の注文履歴を表示しています</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <ShoppingBag className='h-12 w-12 text-muted-foreground/30' />
                <p className='mt-4 text-muted-foreground'>
                  まだ注文履歴がありません
                </p>
                <Button asChild variant='outline' className='mt-4'>
                  <Link href='/shop'>商品を探す</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>アカウント情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {user ? (
                <>
                  <div>
                    <div className='text-sm text-muted-foreground'>
                      メールアドレス
                    </div>
                    <div className='mt-1'>{user.email || '-'}</div>
                  </div>
                  {user.name && (
                    <div>
                      <div className='text-sm text-muted-foreground'>
                        お名前
                      </div>
                      <div className='mt-1'>{user.name}</div>
                    </div>
                  )}
                </>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  ユーザー情報を取得できませんでした
                </p>
              )}
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardContent className='pt-6'>
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant='outline'
                className='w-full'
              >
                <LogOut className='mr-2 h-4 w-4' />
                {logoutMutation.isPending ? 'ログアウト中...' : 'ログアウト'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
